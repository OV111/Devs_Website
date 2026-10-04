/**
 * isPathComplete against a real MongoDB (in memory) — the capstone's gate.
 * The property that matters most: only server-graded exam passes count, never
 * the self-reported "mark complete" progress.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { isPathComplete } from '../../modules/capstone/lib/pathCompletion.js'

let mongod
let client
let db

const userId = new ObjectId()
const other = new ObjectId()
const TRACK = 'api-dev'
const LAYERS = ['api-dev-1', 'api-dev-2', 'api-dev-3']

const pass = (layer, who = userId, passed = true) =>
  db.collection('exam_attempts').insertOne({ userId: who, path: 'backend', layer, passed, submitted: true })

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  await db.collection('roadmap_layers').deleteMany({})
  await db.collection('exam_attempts').deleteMany({})
  await db.collection('userProgress').deleteMany({})
  // inserted out of order on purpose: `missing` must follow roadmap order
  await db.collection('roadmap_layers').insertMany(
    [3, 1, 2].map((n) => ({ layerId: `api-dev-${n}`, trackId: TRACK, order: n })),
  )
  await db.collection('roadmap_layers').insertOne({ layerId: 'go-dev-1', trackId: 'go-dev', order: 1 })
})

describe('isPathComplete', () => {
  it('reports nothing passed for a new learner, in roadmap order', async () => {
    expect(await isPathComplete(db, userId.toString(), TRACK)).toEqual({
      complete: false, passed: 0, total: 3, missing: LAYERS,
    })
  })

  it('counts each passed layer once, however many retakes', async () => {
    await pass('api-dev-1')
    await pass('api-dev-1')
    await pass('api-dev-1')
    expect(await isPathComplete(db, userId.toString(), TRACK)).toMatchObject({
      passed: 1, missing: ['api-dev-2', 'api-dev-3'],
    })
  })

  it('is complete only when every layer has a passed exam', async () => {
    for (const l of LAYERS) await pass(l)
    expect(await isPathComplete(db, userId.toString(), TRACK)).toEqual({
      complete: true, passed: 3, total: 3, missing: [],
    })
  })

  it('ignores failed attempts', async () => {
    for (const l of LAYERS) await pass(l, userId, false)
    expect((await isPathComplete(db, userId.toString(), TRACK)).passed).toBe(0)
  })

  it("ignores other learners' passes and other tracks' layers", async () => {
    for (const l of LAYERS) await pass(l, other)
    await pass('go-dev-1')
    expect((await isPathComplete(db, userId.toString(), TRACK)).passed).toBe(0)
  })

  it('ignores self-reported progress (the "mark complete" toggle)', async () => {
    await db.collection('userProgress').insertOne({
      userId, completedLayers: LAYERS, layerProgress: Object.fromEntries(LAYERS.map((l) => [l, 'done'])),
    })
    expect((await isPathComplete(db, userId.toString(), TRACK)).complete).toBe(false)
  })

  it('throws a 404 for an unknown track', async () => {
    await expect(isPathComplete(db, userId.toString(), 'no-such-track')).rejects.toMatchObject({ status: 404 })
  })
})
