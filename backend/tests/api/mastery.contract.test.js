/**
 * HTTP contract tests for GET /api/mastery, through the REAL router, the real
 * mastery engine and a real (in-memory) MongoDB.
 *
 * The things this layer can get wrong that the pure tests cannot see:
 *  - auth on the route,
 *  - the free/Pro decision actually coming from the billing module,
 *  - the fallback that derives mastery for a learner who has never had it
 *    recomputed (otherwise a new learner's page is blank),
 *  - nothing private (other users, raw ids) in the response.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import process from 'node:process'
import express from 'express'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import masteryRoutes from '../../modules/mastery/index.js'
import { resetSubscriptionIndexes } from '../../modules/billing/services/subscriptionService.js'
import { createAccessToken } from '../../utils/jwtToken.js'

let mongod
let client
let db
let app
let savedEnforced

const get = (userId) =>
  request(app)
    .get('/api/mastery')
    .set('Authorization', `Bearer ${createAccessToken({ id: userId.toString() })}`)

const seedMastery = (userId, rows) =>
  db.collection('learnerMastery').insertMany(
    rows.map((r) => ({
      userId,
      failCount: 0,
      examScore: null,
      teachBackScore: null,
      misconceptions: [],
      lastEvidenceAt: new Date(),
      ...r,
    })),
  )

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')

  app = express()
  app.use(express.json())
  app.locals.db = db
  app.use('/api/mastery', masteryRoutes)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  savedEnforced = process.env.BILLING_ENFORCED
  delete process.env.BILLING_ENFORCED
  await Promise.all(
    ['learnerMastery', 'weakSpots', 'examHistory', 'teach_back_sessions', 'userProgress', 'roadmap_layers', 'concepts', 'subscriptions']
      .map((c) => db.collection(c).deleteMany({})),
  )
  resetSubscriptionIndexes()
})

afterEach(() => {
  if (savedEnforced === undefined) delete process.env.BILLING_ENFORCED
  else process.env.BILLING_ENFORCED = savedEnforced
})

describe('GET /api/mastery', () => {
  it('requires authentication', async () => {
    expect((await request(app).get('/api/mastery')).status).toBe(401)
  })

  it('returns an empty but well-formed view for a brand-new learner', async () => {
    const res = await get(new ObjectId())
    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      summary: { total: 0, percentSolid: 0 },
      topics: [],
      // No path chosen yet -> the engine says "start"
      nextAction: { action: 'start', target: { kind: 'roadmap' } },
    })
  })

  it('returns stored mastery with layer titles and misconception text (billing not enforced)', async () => {
    const user = new ObjectId()
    await db.collection('roadmap_layers').insertOne({ layerId: 'node-dev-6', title: 'Authentication & Security', trackId: 'node-dev', order: 6 })
    await db.collection('concepts').insertOne({
      id: 'jwt-signature',
      misconceptions: [{ id: 'sig-encrypts', description: 'The signature encrypts the payload', correction: 'SECRET-CORRECTION' }],
    })
    await seedMastery(user, [
      { slug: 'jwt-signature', title: 'JWT Signature', status: 'shaky', path: 'backend', layer: 'node-dev-6', failCount: 2, misconceptions: ['sig-encrypts'] },
      { slug: 'http-basics', title: 'HTTP Basics', status: 'solid', path: 'backend', layer: 'node-dev-1' },
    ])

    const res = await get(user)

    expect(res.status).toBe(200)
    const { data } = res.body
    expect(data.detail).toBe(true)
    expect(data.summary).toMatchObject({ total: 2, shaky: 1, solid: 1, percentSolid: 50 })
    // Attention-first: the shaky topic is the next step and comes first.
    expect(data.nextAction).toMatchObject({ action: 'reinforce', title: 'JWT Signature', target: { kind: 'exam', layerId: 'node-dev-6', path: 'backend' } })
    expect(data.topics[0]).toMatchObject({
      slug: 'jwt-signature',
      layer: { id: 'node-dev-6', title: 'Authentication & Security' },
      misconceptions: [{ id: 'sig-encrypts', description: 'The signature encrypts the payload' }],
    })
    expect(JSON.stringify(data)).not.toContain('SECRET-CORRECTION')
  })

  it('derives mastery on the fly for a learner never recomputed (no blank page)', async () => {
    const user = new ObjectId()
    // Evidence exists, but learnerMastery was never written for this user.
    await db.collection('weakSpots').insertOne({
      userId: user, topic: 'SQL Joins', slug: 'sql-joins', path: 'backend', layer: 'api-dev-5',
      failCount: 3, resolvedAt: null, createdAt: new Date(), updatedAt: new Date(),
    })

    const res = await get(user)

    expect(res.body.data.summary.total).toBe(1)
    expect(res.body.data.topics[0]).toMatchObject({ slug: 'sql-joins', status: 'shaky' })
  })

  it('only ever returns the requesting user\'s topics', async () => {
    const me = new ObjectId()
    const other = new ObjectId()
    await seedMastery(other, [{ slug: 'someone-elses-topic', title: 'Someone Else', status: 'shaky' }])

    const res = await get(me)
    expect(res.body.data.summary.total).toBe(0)
    expect(JSON.stringify(res.body)).not.toContain('Someone Else')
  })

  it('never exposes raw ids', async () => {
    const user = new ObjectId()
    await seedMastery(user, [{ slug: 'a', title: 'A', status: 'solid' }])
    const json = JSON.stringify((await get(user)).body)
    expect(json).not.toContain(user.toString())
    expect(json).not.toContain('"_id"')
  })

  describe('with BILLING_ENFORCED=true', () => {
    beforeEach(() => {
      process.env.BILLING_ENFORCED = 'true'
    })

    it('a free user gets the summary and next step, but the topic list is withheld server-side', async () => {
      const user = new ObjectId()
      await seedMastery(user, [
        { slug: 'jwt-signature', title: 'JWT Signature', status: 'shaky', path: 'backend', layer: 'node-dev-6', failCount: 2 },
        { slug: 'private-topic', title: 'Private Topic Name', status: 'developing' },
      ])

      const { data } = (await get(user)).body

      expect(data.detail).toBe(false)
      expect(data.topics).toEqual([])
      expect(data.lockedTopicCount).toBe(2)
      expect(data.summary.total).toBe(2)
      expect(data.nextAction.title).toBe('JWT Signature')
      expect(JSON.stringify(data)).not.toContain('Private Topic Name')
    })

    it('a Pro user gets the full topic map', async () => {
      const user = new ObjectId()
      await db.collection('subscriptions').insertOne({
        userId: user,
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 20 * 86400000),
        endsAt: null,
        polarSubscriptionId: 'sub_1',
        polarModifiedAt: new Date(),
      })
      await seedMastery(user, [{ slug: 'a', title: 'Topic A', status: 'developing' }])

      const { data } = (await get(user)).body

      expect(data.detail).toBe(true)
      expect(data.topics).toHaveLength(1)
    })
  })
})
