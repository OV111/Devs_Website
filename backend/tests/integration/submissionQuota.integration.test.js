/**
 * The daily submission cap against a real MongoDB. The property that matters is
 * that the cap holds under concurrency: a burst of parallel submits must not
 * slip past it, which is exactly what a read-then-write counter would allow.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import {
  DAILY_SUBMISSIONS,
  consumeSubmission,
  limitMessage,
  nextUtcMidnight,
  resetSubmissionQuotaIndexes,
} from '../../modules/coding-challenges/services/submissionQuotaService.js'

let mongod
let client
let db

const NOON = new Date('2026-10-01T12:00:00Z')

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
  await db.collection('submission_usage').drop().catch(() => {})
  resetSubmissionQuotaIndexes()
})

describe('consumeSubmission', () => {
  it('allows up to the free limit, then refuses', async () => {
    const user = new ObjectId()
    for (let i = 1; i <= DAILY_SUBMISSIONS.free; i++) {
      const r = await consumeSubmission(db, user, 'free', NOON)
      expect(r).toMatchObject({ allowed: true, used: i })
    }
    const over = await consumeSubmission(db, user, 'free', NOON)
    expect(over).toMatchObject({ allowed: false, limit: DAILY_SUBMISSIONS.free })
  })

  it('HOLDS UNDER CONCURRENCY: a parallel burst never exceeds the cap', async () => {
    const user = new ObjectId()
    const burst = DAILY_SUBMISSIONS.free + 20
    const results = await Promise.all(
      Array.from({ length: burst }, () => consumeSubmission(db, user, 'free', NOON)),
    )
    expect(results.filter((r) => r.allowed)).toHaveLength(DAILY_SUBMISSIONS.free)
    const doc = await db.collection('submission_usage').findOne({ userId: user })
    expect(doc.count).toBe(DAILY_SUBMISSIONS.free)
  })

  it('gives Pro the larger allowance', async () => {
    const user = new ObjectId()
    for (let i = 0; i < DAILY_SUBMISSIONS.free; i++) await consumeSubmission(db, user, 'pro', NOON)
    expect((await consumeSubmission(db, user, 'pro', NOON)).allowed).toBe(true)
  })

  it('treats an unknown plan as free (fail safe)', async () => {
    const user = new ObjectId()
    for (let i = 0; i < DAILY_SUBMISSIONS.free; i++) await consumeSubmission(db, user, 'mystery', NOON)
    expect((await consumeSubmission(db, user, 'mystery', NOON)).allowed).toBe(false)
  })

  it('resets at UTC midnight', async () => {
    const user = new ObjectId()
    for (let i = 0; i < DAILY_SUBMISSIONS.free; i++) await consumeSubmission(db, user, 'free', NOON)
    expect((await consumeSubmission(db, user, 'free', NOON)).allowed).toBe(false)

    const tomorrow = new Date('2026-10-02T00:00:01Z')
    expect(await consumeSubmission(db, user, 'free', tomorrow)).toMatchObject({ allowed: true, used: 1 })
  })

  it('counts each user separately', async () => {
    const a = new ObjectId()
    const b = new ObjectId()
    for (let i = 0; i < DAILY_SUBMISSIONS.free; i++) await consumeSubmission(db, a, 'free', NOON)
    expect((await consumeSubmission(db, b, 'free', NOON)).allowed).toBe(true)
  })

  it('stamps counters to expire after the day is over', async () => {
    const user = new ObjectId()
    await consumeSubmission(db, user, 'free', NOON)
    const doc = await db.collection('submission_usage').findOne({ userId: user })
    expect(doc.expiresAt.getTime()).toBeGreaterThan(nextUtcMidnight(NOON).getTime())
  })
})

describe('limitMessage', () => {
  it('tells the learner the limit, when it resets, and that Run still works', () => {
    const msg = limitMessage({ limit: 30, resetAt: nextUtcMidnight(NOON) }, NOON)
    expect(msg).toMatch(/30/)
    expect(msg).toMatch(/12h/)
    expect(msg).toMatch(/Run/)
  })
})
