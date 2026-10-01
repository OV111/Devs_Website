/**
 * Title search on GET /blogs (?q=). Search must cover every published post,
 * not just the current page, and user input must be matched literally — regex
 * metacharacters are escaped so "(a+)+" can't become an expensive pattern.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import { getBlogsService } from '../../services/blogService.js'

let mongod
let client
let db

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  await db.collection('blogs').insertMany([
    ...Array.from({ length: 15 }, (_, i) => ({
      title: `Filler post ${i}`,
      status: 'published',
      createdAt: new Date(2026, 0, i + 1),
    })),
    { title: 'Learn C++ Templates', status: 'published', createdAt: new Date(2025, 0, 1) },
    { title: 'Regex (a+)+ pitfalls', status: 'published', createdAt: new Date(2025, 0, 2) },
    { title: 'Draft about C++', status: 'draft', createdAt: new Date() },
  ])
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

const titles = (result) => result.data.map((b) => b.title)

describe('getBlogsService ?q= search', () => {
  it('finds a match beyond the first page, case-insensitively', async () => {
    const result = await getBlogsService(db, { q: 'c++ templates', limit: 10 })
    expect(titles(result)).toEqual(['Learn C++ Templates'])
    expect(result.pagination.total).toBe(1)
  })

  it('matches regex metacharacters literally', async () => {
    const result = await getBlogsService(db, { q: '(a+)+' })
    expect(titles(result)).toEqual(['Regex (a+)+ pitfalls'])
  })

  it('never returns drafts', async () => {
    const result = await getBlogsService(db, { q: 'C++' })
    expect(titles(result)).toEqual(['Learn C++ Templates'])
  })

  it('ignores a repeated ?q= (array) instead of crashing', async () => {
    const result = await getBlogsService(db, { q: ['a', 'b'] })
    expect(result.pagination.total).toBe(17)
  })
})
