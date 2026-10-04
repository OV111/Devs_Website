/**
 * Capstone catalog (public) and overview (per learner) — what links the
 * roadmap and the /capstone picker to the capstone. Real MongoDB in memory,
 * plus real HTTP to prove the route order ("/catalog" is not a track id).
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

let mongod
let client
let db
let server
let base

const { getCatalogService, getOverviewService } = await import('../../modules/capstone/services/capstoneService.js')
const { createAccessToken } = await import('../../utils/jwtToken.js')

const userId = new ObjectId()
const brief = (trackId, version, status = 'published') => ({
  trackId, slug: `${trackId}-s`, version, status, title: `${trackId} v${version}`, summary: `${trackId} summary`,
  requirements: [], rubric: [], twistPool: [{ id: 't', text: 't' }], passThresholds: { rubric: 0.7, defense: 0.6 },
})

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  const { createApp } = await import('../../app.js')
  server = createApp(db).listen(0)
  base = `http://127.0.0.1:${server.address().port}/api/capstone`
})

afterAll(async () => {
  server.close()
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  for (const c of ['capstone_briefs', 'roadmap_tracks', 'roadmap_layers', 'exam_attempts', 'capstone_attempts']) {
    await db.collection(c).deleteMany({})
  }
  await db.collection('roadmap_tracks').insertMany([
    { trackId: 'api-dev', title: 'API Developer', categoryId: 'backend' },
    { trackId: 'go-dev', title: 'Go Developer', categoryId: 'backend' },
  ])
  await db.collection('roadmap_layers').insertMany([
    { layerId: 'api-dev-1', trackId: 'api-dev', order: 1 },
    { layerId: 'api-dev-2', trackId: 'api-dev', order: 2 },
    { layerId: 'go-dev-1', trackId: 'go-dev', order: 1 },
  ])
  await db.collection('capstone_briefs').insertMany([
    brief('api-dev', 1), brief('api-dev', 2), // newest published wins
    brief('go-dev', 1, 'draft'), // hidden from the picker, previewed on the roadmap
  ])
})

describe('catalog', () => {
  it('by default lists only tracks with a published brief, newest version, with track titles', async () => {
    expect(await getCatalogService(db)).toEqual([
      { trackId: 'api-dev', trackTitle: 'API Developer', categoryId: 'backend', briefTitle: 'api-dev v2', summary: 'api-dev summary', published: true },
    ])
  })

  it('with includeDrafts also lists draft-only tracks, flagged unpublished, with only title and summary', async () => {
    const all = await getCatalogService(db, { includeDrafts: true })
    expect(all.map((c) => [c.trackId, c.published]).sort()).toEqual([['api-dev', true], ['go-dev', false]])
    const draft = all.find((c) => c.trackId === 'go-dev')
    expect(Object.keys(draft).sort()).toEqual(['briefTitle', 'categoryId', 'published', 'summary', 'trackId', 'trackTitle'])
  })

  it('a published version beats a newer draft of the same track', async () => {
    await db.collection('capstone_briefs').insertOne(brief('api-dev', 3, 'draft'))
    const api = (await getCatalogService(db, { includeDrafts: true })).find((c) => c.trackId === 'api-dev')
    expect(api).toMatchObject({ briefTitle: 'api-dev v2', published: true })
  })

  it('is public over HTTP (drafts included as previews) and not mistaken for a track id', async () => {
    const res = await fetch(`${base}/catalog`)
    expect(res.status).toBe(200)
    const data = (await res.json()).data
    expect(data.map((c) => c.trackId).sort()).toEqual(['api-dev', 'go-dev'])
    // a draft's requirements, rubric and twists never leave the server
    expect(JSON.stringify(data)).not.toMatch(/requirements|rubric|twist/i)
  })
})

describe('overview', () => {
  it('never lists a draft capstone — the picker only offers what can be opened', async () => {
    expect((await getOverviewService(db, userId.toString())).map((c) => c.trackId)).toEqual(['api-dev'])
  })

  it('derives each capstone state for the learner', async () => {
    expect((await getOverviewService(db, userId.toString()))[0]).toMatchObject({
      trackId: 'api-dev', state: 'locked', eligibility: { passed: 0, total: 2 },
    })

    await db.collection('exam_attempts').insertMany(
      ['api-dev-1', 'api-dev-2'].map((layer) => ({ userId, layer, passed: true })),
    )
    expect((await getOverviewService(db, userId.toString()))[0].state).toBe('ready')

    await db.collection('capstone_attempts').insertOne({ userId, trackId: 'api-dev', attemptNumber: 1, status: 'defense' })
    expect((await getOverviewService(db, userId.toString()))[0]).toMatchObject({ state: 'in_progress', attemptStatus: 'defense' })

    await db.collection('capstone_attempts').updateOne({ userId }, { $set: { status: 'passed' } })
    expect((await getOverviewService(db, userId.toString()))[0].state).toBe('passed')
  })

  it('requires login over HTTP', async () => {
    expect((await fetch(`${base}`)).status).toBe(401)
    const res = await fetch(`${base}`, { headers: { Authorization: `Bearer ${createAccessToken({ id: userId })}` } })
    expect(res.status).toBe(200)
    expect((await res.json()).data[0].state).toBe('locked')
  })
})
