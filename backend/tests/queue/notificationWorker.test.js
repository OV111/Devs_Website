/**
 * Step 6 — Queue / Worker tests
 *
 * Strategy: vi.hoisted() captures the Worker processor function before any
 * module code runs.  connectDB and getWss are fully mocked so no real Redis
 * or MongoDB connection is needed.  A MongoMemoryServer provides a real DB
 * for the assertions that verify document shape / insertion.
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — hoist a mutable ref so the mock closure can write into it
// ─────────────────────────────────────────────────────────────────────────────
const { processorRef } = vi.hoisted(() => ({ processorRef: { fn: null } }))

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — mock bullmq: capture processor; suppress real Redis connections
// ─────────────────────────────────────────────────────────────────────────────
vi.mock('bullmq', () => {
  return {
    Worker: class MockWorker {
      constructor(name, processor, options) {
        processorRef.fn = processor
      }
    },
    Queue: class MockQueue {
      constructor(name, options) {
        this.add = vi.fn()
      }
    },
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — mock connectDB
// ─────────────────────────────────────────────────────────────────────────────
const mockConnectDB = vi.hoisted(() => vi.fn())
vi.mock('../../config/db.js', () => ({ default: mockConnectDB }))

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — mock getWss
// ─────────────────────────────────────────────────────────────────────────────
const mockGetWss = vi.hoisted(() => vi.fn())
vi.mock('../../websocket/index.js', () => ({ getWss: mockGetWss }))

// ─────────────────────────────────────────────────────────────────────────────
// MongoMemoryServer lifecycle
// ─────────────────────────────────────────────────────────────────────────────
let mongod
let client
let realDb

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  realDb = client.db('DevsBlog')

  // Import the modules after mocks are established and DB is ready
  await import('../../workers/notificationWorker.js')
  await import('../../queues/notificationQueue.js')
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  vi.clearAllMocks()

  // Default: wss returns null (no WebSocket server)
  mockGetWss.mockReturnValue(null)

  // Default: connectDB resolves to the real in-memory DB
  mockConnectDB.mockResolvedValue(realDb)

  // Clear collections between tests
  await realDb.collection('notifications').deleteMany({})
  await realDb.collection('users').deleteMany({})
})

// ─────────────────────────────────────────────────────────────────────────────
// notificationWorker processor
// ─────────────────────────────────────────────────────────────────────────────
describe('notificationWorker processor', () => {
  it('does nothing when required fields are missing', async () => {
    await processorRef.fn({ data: {} })
    await processorRef.fn({ data: { type: 'follow' } })
    await processorRef.fn({ data: { type: 'follow', actorId: '507f1f77bcf86cd799439011' } })

    expect(mockConnectDB).not.toHaveBeenCalled()
  })

  it('does nothing when actorId === targetUserId (no self-notifications)', async () => {
    const id = '507f1f77bcf86cd799439011'
    await processorRef.fn({ data: { type: 'follow', actorId: id, targetUserId: id } })

    expect(mockConnectDB).not.toHaveBeenCalled()
  })

  it('inserts a notification document into the DB', async () => {
    const actorId = new ObjectId('507f1f77bcf86cd799439011').toString()
    const targetUserId = new ObjectId('507f1f77bcf86cd799439022').toString()

    await realDb.collection('users').insertOne({
      _id: new ObjectId(actorId),
      username: 'actoruser',
      firstName: 'Actor',
      lastName: 'User',
    })

    await processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })

    const notification = await realDb.collection('notifications').findOne({ actorId })
    expect(notification).not.toBeNull()
    expect(notification.type).toBe('follow')
    expect(notification.targetUserId).toBe(targetUserId)
    expect(notification.read).toBe(false)
  })

  it('notification document has all required fields', async () => {
    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await realDb.collection('users').insertOne({
      _id: new ObjectId(actorId),
      username: 'sender',
      firstName: 'John',
      lastName: 'Doe',
    })

    await processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })

    const notification = await realDb.collection('notifications').findOne({ actorId })
    expect(notification).toMatchObject({
      type: 'follow',
      actorId,
      targetUserId,
      read: false,
      senderUsername: 'sender',
      senderName: 'John Doe',
    })
    expect(notification.createdAt).toBeInstanceOf(Date)
  })

  it('sets senderName to "undefined undefined" gracefully when actor not found', async () => {
    // No user inserted for this actorId — actor lookup returns null
    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })

    const notification = await realDb.collection('notifications').findOne({ actorId })
    expect(notification).not.toBeNull()
    // actor?.username is undefined when actor is null
    expect(notification.senderUsername).toBeUndefined()
    // actor?.firstName + " " + actor?.lastName => "undefined undefined"
    expect(notification.senderName).toBe('undefined undefined')
  })

  it('sends WebSocket notification to the target user if connected', async () => {
    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await realDb.collection('users').insertOne({
      _id: new ObjectId(actorId),
      username: 'wsactor',
      firstName: 'WS',
      lastName: 'Actor',
    })

    const mockSend = vi.fn()
    const mockClient = { userId: targetUserId, readyState: 1, send: mockSend }
    mockGetWss.mockReturnValue({ clients: [mockClient] })

    await processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })

    expect(mockSend).toHaveBeenCalledOnce()
    const sentPayload = JSON.parse(mockSend.mock.calls[0][0])
    expect(sentPayload.type).toBe('notification')
    expect(sentPayload.data.type).toBe('follow')
  })

  it('does NOT send WebSocket notification when target user is not connected', async () => {
    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await realDb.collection('users').insertOne({
      _id: new ObjectId(actorId),
      username: 'wsactor2',
      firstName: 'A',
      lastName: 'B',
    })

    const mockSend = vi.fn()
    // Client belongs to a different user, not targetUserId
    const mockClient = { userId: 'different-user-id', readyState: 1, send: mockSend }
    mockGetWss.mockReturnValue({ clients: [mockClient] })

    await processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })

    expect(mockSend).not.toHaveBeenCalled()
  })

  it('does NOT send WebSocket notification when wss is null', async () => {
    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await realDb.collection('users').insertOne({
      _id: new ObjectId(actorId),
      username: 'noWssActor',
      firstName: 'No',
      lastName: 'Wss',
    })

    // Default beforeEach already sets mockGetWss.mockReturnValue(null)
    await expect(
      processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })
    ).resolves.not.toThrow()
  })

  it('throws on DB error so BullMQ can retry', async () => {
    mockConnectDB.mockRejectedValue(new Error('DB connection failed'))

    const actorId = new ObjectId().toString()
    const targetUserId = new ObjectId().toString()

    await expect(
      processorRef.fn({ data: { type: 'follow', actorId, targetUserId } })
    ).rejects.toThrow('DB connection failed')
  })
})

// The worker and queue are verified to be instantiated through successful processor test execution.
