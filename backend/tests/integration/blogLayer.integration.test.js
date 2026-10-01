/**
 * "Posts for this layer": tagging posts with roadmap layers and filtering the
 * public list by one, against a real MongoDB. The filter must only ever return
 * published posts, and a hostile `layer` query must not widen the match.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { createBlogService, getBlogsService, updateBlogService } from '../../services/blogService.js'

let mongod
let client
let db
let user

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
  await db.collection('blogs').deleteMany({})
  user = { _id: new ObjectId() }
  await db.collection('users').insertOne({ _id: user._id, firstName: 'A', lastName: 'B', username: 'ab' })
})

const post = (title, extra = {}) =>
  createBlogService(db, { title, content: 'word '.repeat(50), category: 'Backend', status: 'published', ...extra }, user)

describe('createBlogService with layerIds', () => {
  it('stores cleaned layer ids', async () => {
    const created = await post('Tagged', { layerIds: JSON.stringify(['API-dev-1', 'bad id!', 'api-dev-1']) })
    expect(created.layerIds).toEqual(['api-dev-1'])
    const row = await db.collection('blogs').findOne({ _id: created._id })
    expect(row.layerIds).toEqual(['api-dev-1'])
  })

  it('defaults to an empty list for untagged posts', async () => {
    expect((await post('Untagged')).layerIds).toEqual([])
  })
})

describe('getBlogsService layer filter', () => {
  it('returns only published posts tagged with that layer', async () => {
    await post('On layer 1', { layerIds: ['api-dev-1'] })
    await post('Also layer 1', { layerIds: ['api-dev-1', 'api-dev-2'] })
    await post('Layer 2 only', { layerIds: ['api-dev-2'] })
    await post('Draft on layer 1', { layerIds: ['api-dev-1'], status: 'draft' })
    await post('Untagged')

    const res = await getBlogsService(db, { layer: 'api-dev-1' })
    expect(res.data.map((b) => b.title).sort()).toEqual(['Also layer 1', 'On layer 1'])
    expect(res.pagination.total).toBe(2)
  })

  it('ignores a malformed or hostile layer value instead of widening the match', async () => {
    await post('Tagged', { layerIds: ['api-dev-1'] })
    // repeated ?layer=a&layer=b arrives as an array; operators are not slugs
    const asArray = await getBlogsService(db, { layer: ['api-dev-1', 'x'] })
    const asOperator = await getBlogsService(db, { layer: '$ne' })
    // Ignored filter = the normal unfiltered published list, not an error or a crash
    expect(asArray.data).toHaveLength(1)
    expect(asOperator.data).toHaveLength(1)
  })
})

describe('updateBlogService with layerIds', () => {
  it('replaces the tags when sent and keeps them when omitted', async () => {
    const created = await post('Edit me', { layerIds: ['api-dev-1'] })

    await updateBlogService(db, created._id, user._id, { title: 'Edit me', layerIds: JSON.stringify(['node-dev-2']) })
    expect((await db.collection('blogs').findOne({ _id: created._id })).layerIds).toEqual(['node-dev-2'])

    await updateBlogService(db, created._id, user._id, { title: 'Edit me again' })
    expect((await db.collection('blogs').findOne({ _id: created._id })).layerIds).toEqual(['node-dev-2'])

    await updateBlogService(db, created._id, user._id, { layerIds: '[]' })
    expect((await db.collection('blogs').findOne({ _id: created._id })).layerIds).toEqual([])
  })
})
