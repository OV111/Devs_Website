/**
 * Event tracking against a real MongoDB. The properties that matter: tracking
 * never throws into the caller, and active_day stays one row per user per day
 * even under concurrent token refreshes.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { trackEvent, trackActiveDay, getFunnel } from '../../services/eventService.js'

let mongod
let client
let db

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
  await db.collection('userEvents').drop().catch(() => {})
  // same index as config/db.js
  await db.collection('userEvents').createIndex(
    { userId: 1, day: 1 },
    { unique: true, partialFilterExpression: { type: 'active_day' } },
  )
})

describe('trackEvent', () => {
  it('stores the event with an ObjectId userId', async () => {
    const userId = new ObjectId()
    await trackEvent(db, userId.toString(), 'exam_started', { layer: 'l1' })
    const rows = await db.collection('userEvents').find().toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0].userId).toEqual(userId)
    expect(rows[0].meta).toEqual({ layer: 'l1' })
  })

  it('never throws: unknown types and bad ids are dropped and logged', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(trackEvent(db, new ObjectId(), 'not_a_type')).resolves.toBeUndefined()
    await expect(trackEvent(db, 'not-an-id', 'signup')).resolves.toBeUndefined()
    expect(await db.collection('userEvents').countDocuments()).toBe(0)
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })
})

describe('trackActiveDay', () => {
  it('keeps one row per user per day under a burst of concurrent calls', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const userId = new ObjectId()
    await Promise.all(Array.from({ length: 20 }, () => trackActiveDay(db, userId)))
    expect(await db.collection('userEvents').countDocuments({ userId, type: 'active_day' })).toBe(1)
    expect(spy).not.toHaveBeenCalled() // duplicate-key races are expected, not errors
    spy.mockRestore()
  })
})

describe('getFunnel', () => {
  it('only includes users who signed up inside the window', async () => {
    const recent = new ObjectId()
    const old = new ObjectId()
    await trackEvent(db, recent, 'signup')
    await db.collection('userEvents').insertOne({
      userId: old, type: 'signup', meta: {}, createdAt: new Date('2025-01-01T00:00:00Z'),
    })
    const funnel = await getFunnel(db, new Date(Date.now() - 24 * 60 * 60 * 1000))
    expect(funnel.signedUp).toBe(1)
  })
})
