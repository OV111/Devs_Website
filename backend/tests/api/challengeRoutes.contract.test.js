/**
 * HTTP contract tests for the coding-challenges router.
 *
 * Unlike testApp.js, this mounts the REAL router — real `authenticate`
 * middleware, real controllers — because the things most likely to break at
 * this layer can't be seen from the service tests:
 *
 *  1. Route ordering. `/readiness` and `/leaderboard` are static segments
 *     declared alongside `/:slug`; get the order wrong and they are silently
 *     swallowed and answered as "challenge not found".
 *  2. Auth. Every one of these must 401 without a token.
 *  3. Query-param plumbing from the URL through to the service.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import challengeRoutes from '../../modules/coding-challenges/routes/challenge.routes.js'
import { createAccessToken } from '../../utils/jwtToken.js'

let mongod
let client
let db
let app

const USER_ID = new ObjectId()
const TOKEN = () => createAccessToken({ id: USER_ID.toString() })
const LAYER = 'api-dev-3'
const TRACK = 'api-dev'

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')

  app = express()
  app.use(express.json())
  app.locals.db = db
  app.use('/api/challenges', challengeRoutes)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  await Promise.all(
    [
      'challenges',
      'challengeResults',
      'challenge_attempts',
      'roadmap_layers',
      'userProgress',
      'weakSpots',
      'users',
      'usersStats',
    ].map((c) => db.collection(c).deleteMany({})),
  )

  await db.collection('users').insertOne({
    _id: USER_ID,
    username: 'tester',
    firstName: 'Test',
    lastName: 'User',
    email: 'tester@test.com',
  })
  await db
    .collection('roadmap_layers')
    .insertOne({ layerId: LAYER, trackId: TRACK, order: 3, title: 'Error handling' })
  await db
    .collection('userProgress')
    .insertOne({ userId: USER_ID, activePath: TRACK, currentLayer: 3, xpTotal: 0 })
})

const seedChallenge = (slug, overrides = {}) =>
  db.collection('challenges').insertOne({
    slug,
    trackId: TRACK,
    layerId: LAYER,
    status: 'published',
    type: 'CODE',
    difficulty: 'med',
    title: `Title ${slug}`,
    summary: 'Summary',
    tags: ['async'],
    estimatedMins: 25,
    xp: 45,
    stats: { solves: 0 },
    ...overrides,
  })

const auth = (req) => req.set('Authorization', `Bearer ${TOKEN()}`)

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
describe('auth', () => {
  it.each(['/readiness', '/leaderboard', '/stats/me', '/topics', '/daily', '/'])(
    'rejects %s without a token',
    async (path) => {
      const res = await request(app).get(`/api/challenges${path}`)
      expect(res.status).toBe(401)
    },
  )

  it('rejects a garbage token', async () => {
    const res = await request(app)
      .get('/api/challenges/readiness')
      .set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────
// Route ordering — the real risk with /:slug
// ─────────────────────────────────────────────
describe('route ordering', () => {
  it('serves /readiness rather than treating it as a slug', async () => {
    const res = await auth(request(app).get('/api/challenges/readiness'))

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    // A slug-route match would have 404'd or returned a challenge document.
    expect(res.body.data).toHaveProperty('hasLayer', true)
    expect(res.body.data).not.toHaveProperty('starterFiles')
  })

  it('serves /leaderboard rather than treating it as a slug', async () => {
    const res = await auth(request(app).get('/api/challenges/leaderboard'))

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('rows')
    expect(Array.isArray(res.body.data.rows)).toBe(true)
  })

  it('still resolves a genuine slug', async () => {
    await seedChallenge('async-error-wrapper')
    const res = await auth(
      request(app).get('/api/challenges/async-error-wrapper'),
    )
    expect(res.status).toBe(200)
    expect(res.body.data.slug).toBe('async-error-wrapper')
  })

  it('404s an unknown slug', async () => {
    const res = await auth(request(app).get('/api/challenges/nope-not-real'))
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────
// Readiness
// ─────────────────────────────────────────────
describe('GET /readiness', () => {
  it('returns the layer-scoped percentage', async () => {
    await seedChallenge('a')
    await seedChallenge('b')
    await db.collection('challengeResults').insertOne({
      userId: USER_ID,
      challengeId: 'a',
      path: TRACK,
      layer: LAYER,
      status: 'solved',
      xpEarned: 45,
      solvedAt: new Date(),
    })

    const res = await auth(request(app).get('/api/challenges/readiness'))

    expect(res.body.data).toMatchObject({
      hasLayer: true,
      layerId: LAYER,
      layerOrder: 3,
      total: 2,
      solved: 1,
      toGo: 1,
      percent: 50,
    })
    expect(typeof res.body.data.message).toBe('string')
  })

  it('reports hasLayer:false for a user with no roadmap progress', async () => {
    await db.collection('userProgress').deleteMany({})
    const res = await auth(request(app).get('/api/challenges/readiness'))
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual({ hasLayer: false })
  })
})

// ─────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────
describe('GET /leaderboard', () => {
  const solve = (userId, slug, xpEarned, extra = {}) => ({
    userId,
    challengeId: slug,
    path: TRACK,
    layer: LAYER,
    status: 'solved',
    xpEarned,
    solvedAt: new Date(),
    ...extra,
  })

  it('ranks users and marks the caller', async () => {
    const rivalId = new ObjectId()
    await db
      .collection('users')
      .insertOne({ _id: rivalId, username: 'rival', firstName: 'Ri', lastName: 'Val' })
    await db
      .collection('challengeResults')
      .insertMany([solve(USER_ID, 'a', 50), solve(rivalId, 'b', 90)])

    const res = await auth(request(app).get('/api/challenges/leaderboard'))

    expect(res.body.data.rows[0]).toMatchObject({ rank: 1, name: '@rival', you: false })
    expect(res.body.data.rows[1]).toMatchObject({ rank: 2, name: '@tester', you: true })
  })

  it('honours the limit query param', async () => {
    const ids = []
    for (let i = 0; i < 4; i++) {
      const id = new ObjectId()
      ids.push(id)
      await db.collection('users').insertOne({ _id: id, username: `u${i}` })
    }
    await db
      .collection('challengeResults')
      .insertMany(ids.map((id, i) => solve(id, `s${i}`, 100 + i)))

    const res = await auth(
      request(app).get('/api/challenges/leaderboard?limit=2'),
    )
    expect(res.body.data.rows).toHaveLength(2)
  })

  it('honours scope=global', async () => {
    await db
      .collection('challengeResults')
      .insertOne(solve(USER_ID, 'a', 50, { layer: 'some-other-layer' }))

    const scoped = await auth(
      request(app).get('/api/challenges/leaderboard?scope=layer'),
    )
    expect(scoped.body.data.rows).toHaveLength(0)

    const global = await auth(
      request(app).get('/api/challenges/leaderboard?scope=global'),
    )
    expect(global.body.data.rows).toHaveLength(1)
    expect(global.body.data.scope).toBe('global')
  })

  it('honours range=all', async () => {
    await db.collection('challengeResults').insertOne(
      solve(USER_ID, 'old', 50, {
        solvedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      }),
    )

    const week = await auth(
      request(app).get('/api/challenges/leaderboard?range=7d'),
    )
    expect(week.body.data.rows).toHaveLength(0)

    const all = await auth(
      request(app).get('/api/challenges/leaderboard?range=all'),
    )
    expect(all.body.data.rows).toHaveLength(1)
  })
})

// ─────────────────────────────────────────────
// List decoration over HTTP
// ─────────────────────────────────────────────
describe('GET / (list)', () => {
  it('returns done / inProgress / hot on each item', async () => {
    const { insertedId } = await seedChallenge('started')
    await seedChallenge('solved')
    await seedChallenge('fresh')

    await db.collection('challenge_attempts').insertOne({
      userId: USER_ID,
      challengeId: insertedId,
      challengeSlug: 'started',
      code: [],
      startedAt: new Date(),
    })
    await db.collection('challengeResults').insertOne({
      userId: USER_ID,
      challengeId: 'solved',
      path: TRACK,
      layer: LAYER,
      status: 'solved',
      xpEarned: 45,
      solvedAt: new Date(),
    })

    const res = await auth(request(app).get('/api/challenges?limit=100'))
    const bySlug = (s) => res.body.items.find((i) => i.slug === s)

    expect(bySlug('solved')).toMatchObject({ done: true, inProgress: false, hot: false })
    expect(bySlug('started')).toMatchObject({ done: false, inProgress: true, hot: true })
    expect(bySlug('fresh')).toMatchObject({ done: false, inProgress: false, hot: true })
  })

  it('never ships solution or hiddenTests', async () => {
    await seedChallenge('secret', {
      solution: { code: 'answer', explanation: 'why' },
      hiddenTests: [{ name: 't', code: 'x' }],
    })

    const res = await auth(request(app).get('/api/challenges?limit=100'))
    const item = res.body.items.find((i) => i.slug === 'secret')
    expect(item.solution).toBeUndefined()
    expect(item.hiddenTests).toBeUndefined()
  })
})
