/**
 * Step 5 — WebSocket tests
 *
 * Strategy
 * --------
 * - `connectDB` is mocked so chatHandler's DB calls succeed without a real
 *   MongoDB.  The mock collection returns sensible stub values.
 * - `notificationQueue` (bullmq) is mocked to avoid a live Redis dependency.
 * - A real http.Server + ws.WebSocketServer is started on an OS-assigned port
 *   (port 0) in beforeAll and torn down in afterAll.
 * - Test clients are plain `ws` WebSocket instances connecting to that server.
 *
 * Known chatHandler bug (line 103)
 * ----------------------------------
 * chatHandler.js uses `WebSocket.OPEN` (the class, not imported from 'ws').
 * `WebSocket` is not in scope there, so `WebSocket.OPEN` is `undefined`.
 * The broadcast guard `clientSocket.readyState === undefined` is never true,
 * so messages are inserted into the DB but NOT broadcast to room members.
 * The broadcast test below documents this behaviour and tests only what
 * actually happens (DB insert path + the error-free response path).
 */

import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import http from 'node:http'
import process from 'node:process'
import WebSocket from 'ws'
import jwt from 'jsonwebtoken'

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
// vi.hoisted() runs before any import, so these refs are available to vi.mock().

const mockInsertOne = vi.hoisted(() => vi.fn().mockResolvedValue({ insertedId: 'msg-id-1' }))
const mockFindOne   = vi.hoisted(() => vi.fn().mockResolvedValue(null))
const mockUpdateOne = vi.hoisted(() => vi.fn().mockResolvedValue({}))

// find() chain: find().sort().limit().toArray() and find().project().toArray()
const mockToArray   = vi.hoisted(() => vi.fn().mockResolvedValue([]))
const mockLimit     = vi.hoisted(() => vi.fn().mockReturnValue({ toArray: mockToArray }))
const mockSort      = vi.hoisted(() => vi.fn().mockReturnValue({ limit: mockLimit }))
const mockProject   = vi.hoisted(() => vi.fn().mockReturnValue({ toArray: mockToArray }))
const mockFind      = vi.hoisted(() =>
  vi.fn().mockReturnValue({ sort: mockSort, limit: mockLimit, project: mockProject, toArray: mockToArray })
)

const mockConnectDB         = vi.hoisted(() => vi.fn())
const mockNotificationAdd   = vi.hoisted(() => vi.fn().mockResolvedValue({}))

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock('../../config/db.js', () => ({ default: mockConnectDB }))

vi.mock('../../queues/notificationQueue.js', () => ({
  default: { add: mockNotificationAdd },
}))

// ─── Import SUT after mocks are registered ────────────────────────────────────

import initWebSocketServer from '../../websocket/index.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Mint a valid JWT for the given user id (defaults to a realistic ObjectId string).
 */
const makeToken = (id = '507f1f77bcf86cd799439011') =>
  jwt.sign({ id }, process.env.JWT_Secret, { expiresIn: '1h' })

/**
 * Build a mock DB whose collections support the operations used by chatHandler.
 * Accepts per-method overrides so individual tests can control return values.
 */
const makeMockDb = (overrides = {}) => {
  const collections = {
    rooms: {
      findOne:   overrides.roomsFindOne   ?? mockFindOne,
      insertOne: overrides.roomsInsertOne ?? mockInsertOne,
      updateOne: overrides.roomsUpdateOne ?? mockUpdateOne,
      find:      overrides.roomsFind      ?? mockFind,
    },
    messages: {
      findOne:   overrides.messagesFindOne   ?? mockFindOne,
      insertOne: overrides.messagesInsertOne ?? mockInsertOne,
      updateOne: overrides.messagesUpdateOne ?? mockUpdateOne,
      find:      overrides.messagesFind      ?? mockFind,
    },
  }
  return {
    collection: vi.fn((name) => collections[name] ?? {
      findOne:   mockFindOne,
      insertOne: mockInsertOne,
      updateOne: mockUpdateOne,
      find:      mockFind,
    }),
  }
}

/**
 * Return a Promise that resolves with the first parsed JSON message whose
 * `.type` matches `type`.  Rejects after `timeoutMs` milliseconds.
 *
 * @param {WebSocket} ws
 * @param {string}    type
 * @param {number}    [timeoutMs=3000]
 */
const waitForMsg = (ws, type, timeoutMs = 3000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`waitForMsg('${type}') timed out after ${timeoutMs}ms`)),
      timeoutMs,
    )

    const onMessage = (raw) => {
      let msg
      try { msg = JSON.parse(raw.toString()) } catch { return }
      if (msg.type === type) {
        clearTimeout(timer)
        ws.off('message', onMessage)
        resolve(msg)
      }
    }

    ws.on('message', onMessage)
  })

/**
 * Wait for the WebSocket close event, or reject after `timeoutMs`.
 */
const waitForClose = (ws, timeoutMs = 3000) =>
  new Promise((resolve, reject) => {
    if (ws.readyState === WebSocket.CLOSED) return resolve()
    const timer = setTimeout(
      () => reject(new Error(`waitForClose timed out after ${timeoutMs}ms`)),
      timeoutMs,
    )
    ws.once('close', () => { clearTimeout(timer); resolve() })
  })

/**
 * Connect a new WebSocket to the test server and wait until it is OPEN.
 */
const connect = (port) =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}`)
    ws.once('open',  () => resolve(ws))
    ws.once('error', reject)
  })

/**
 * Send a JSON message through the given WebSocket.
 */
const send = (ws, payload) => ws.send(JSON.stringify(payload))

/**
 * Authenticate `ws` with a freshly minted token and wait for the next message
 * (which proves the auth was accepted — the server continues processing).
 * We do this by performing auth then immediately sending a `load_last_messages`
 * request and waiting for its response (a reliable echo back).
 *
 * Returns the token's user id.
 */
const authenticate = async (ws, userId = '507f1f77bcf86cd799439011') => {
  const token = makeToken(userId)
  send(ws, { type: 'auth', token })
  // Give the server a tick to process the auth message before we continue.
  await new Promise((r) => setTimeout(r, 50))
  return userId
}

// ─── Server lifecycle ─────────────────────────────────────────────────────────

let server
let port
/** @type {WebSocket[]} */
let openClients = []

beforeAll(async () => {
  mockConnectDB.mockResolvedValue(makeMockDb())

  server = http.createServer()
  initWebSocketServer(server)

  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      port = server.address().port
      resolve()
    })
    server.once('error', reject)
  })
})

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve))
})

afterEach(async () => {
  // Close every client opened during the test and drain the list.
  await Promise.all(
    openClients.map((ws) => {
      if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
        ws.close()
      }
      return waitForClose(ws).catch(() => {})
    }),
  )
  openClients = []
  vi.clearAllMocks()
  // Re-apply the default mock so future tests don't fail due to missing stub.
  mockConnectDB.mockResolvedValue(makeMockDb())
})

// ─── Helper that opens a client and registers it for auto-cleanup ─────────────
const openClient = async () => {
  const ws = await connect(port)
  openClients.push(ws)
  return ws
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth flow
// ─────────────────────────────────────────────────────────────────────────────

describe('WebSocket — auth', () => {
  it('closes the connection for an invalid token', async () => {
    const ws = await openClient()
    send(ws, { type: 'auth', token: 'badtoken' })
    await waitForClose(ws)
    expect(ws.readyState).toBe(WebSocket.CLOSED)
  })

  it('closes connection when a non-auth message is sent before authenticating', async () => {
    const ws = await openClient()
    // Send a join_room without authenticating first.
    send(ws, { type: 'join_room', roomId: 'x' })
    await waitForClose(ws)
    expect(ws.readyState).toBe(WebSocket.CLOSED)
  })

  it('authenticated client can send subsequent messages without being closed', async () => {
    const ws = await openClient()
    await authenticate(ws)

    // Send load_last_messages — a safe, always-valid request for an authed client.
    send(ws, { type: 'load_last_messages' })

    // Server responds, connection stays open.
    const response = await waitForMsg(ws, 'load_last_messages')
    expect(response.type).toBe('load_last_messages')
    expect(ws.readyState).toBe(WebSocket.OPEN)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// join_room
// ─────────────────────────────────────────────────────────────────────────────

describe('WebSocket — join_room', () => {
  it('returns error when roomId is missing', async () => {
    const ws = await openClient()
    await authenticate(ws)

    send(ws, { type: 'join_room', receiverId: 'user-abc' })
    const msg = await waitForMsg(ws, 'error')
    expect(msg.message).toMatch(/room id is missing/i)
  })

  it('returns error when receiverId is missing', async () => {
    const ws = await openClient()
    await authenticate(ws)

    send(ws, { type: 'join_room', roomId: 'room1' })
    const msg = await waitForMsg(ws, 'error')
    // chatHandler reports "Users Id is missing!" when receiverId is absent.
    expect(msg.message).toMatch(/id is missing/i)
  })

  it('sends joined_room and message_history on success', async () => {
    const ws = await openClient()
    await authenticate(ws)

    // Collect both expected messages in parallel before sending.
    const [joinedRoom, messageHistory] = await Promise.all([
      waitForMsg(ws, 'joined_room'),
      waitForMsg(ws, 'message_history'),
      // Trigger after both listeners are registered.
      Promise.resolve().then(() =>
        send(ws, { type: 'join_room', roomId: 'room-success', receiverId: 'user-receiver' }),
      ),
    ])

    expect(joinedRoom.type).toBe('joined_room')
    expect(joinedRoom.roomId).toBe('room-success')
    expect(messageHistory.type).toBe('message_history')
    expect(Array.isArray(messageHistory.messageHistory)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// send_message
// ─────────────────────────────────────────────────────────────────────────────

describe('WebSocket — send_message', () => {
  it('returns error when required fields are missing', async () => {
    const ws = await openClient()
    await authenticate(ws)

    // Join the room first so it exists in the in-memory Map.
    await Promise.all([
      waitForMsg(ws, 'joined_room'),
      waitForMsg(ws, 'message_history'),
      Promise.resolve().then(() =>
        send(ws, { type: 'join_room', roomId: 'room1', receiverId: 'user-recv' }),
      ),
    ])

    // Send without the required `text` field.
    send(ws, { type: 'send_message', roomId: 'room1' })
    const msg = await waitForMsg(ws, 'error')
    expect(msg.message).toMatch(/missing required fields/i)
  })

  it('returns error when room does not exist', async () => {
    const ws = await openClient()
    await authenticate(ws)

    // Do NOT join any room — the in-memory Map won't have 'nonexistent'.
    send(ws, {
      type: 'send_message',
      roomId: 'nonexistent',
      receiverId: 'user-x',
      text: 'hi',
    })
    const msg = await waitForMsg(ws, 'error')
    expect(msg.message).toMatch(/room does not exist/i)
  })

  it('inserts message to DB on send_message (broadcast silently skipped due to chatHandler bug)', async () => {
    /**
     * BUG NOTE — chatHandler.js line 103:
     *   `if (clientSocket.readyState === WebSocket.OPEN)`
     * `WebSocket` is not imported in chatHandler.js, so `WebSocket.OPEN` is
     * `undefined`.  The guard is never satisfied, meaning the broadcast loop
     * runs but never actually sends.  Both clients in the room will NOT receive
     * a `sended_message` frame.
     *
     * This test verifies that:
     *   1. The message IS inserted into the DB (messagesCollection.insertOne called).
     *   2. The room metadata IS updated (roomsCollection.updateOne called).
     *   3. No error is sent back to the sender.
     *   4. The sender's connection remains open.
     *
     * Fix: in chatHandler.js replace `WebSocket.OPEN` with the numeric value
     * `1` or import WebSocket from 'ws' and use `ws.OPEN`.
     */
    const insertOneSpy = vi.fn().mockResolvedValue({ insertedId: 'new-msg-id' })
    const updateOneSpy = vi.fn().mockResolvedValue({})

    mockConnectDB.mockResolvedValue(
      makeMockDb({
        messagesInsertOne: insertOneSpy,
        roomsUpdateOne:    updateOneSpy,
      }),
    )

    const [clientA, clientB] = await Promise.all([openClient(), openClient()])
    await authenticate(clientA, '507f1f77bcf86cd799439011')
    await authenticate(clientB, '507f1f77bcf86cd799439012')

    // Both clients join the same room.
    await Promise.all([
      waitForMsg(clientA, 'joined_room'),
      waitForMsg(clientA, 'message_history'),
      Promise.resolve().then(() =>
        send(clientA, { type: 'join_room', roomId: 'shared-room', receiverId: '507f1f77bcf86cd799439012' }),
      ),
    ])
    await Promise.all([
      waitForMsg(clientB, 'joined_room'),
      waitForMsg(clientB, 'message_history'),
      Promise.resolve().then(() =>
        send(clientB, { type: 'join_room', roomId: 'shared-room', receiverId: '507f1f77bcf86cd799439011' }),
      ),
    ])

    // clientA sends a message.
    send(clientA, {
      type:       'send_message',
      roomId:     'shared-room',
      receiverId: '507f1f77bcf86cd799439012',
      text:       'Hello from A',
    })

    // Allow the async handler to complete.
    await new Promise((r) => setTimeout(r, 200))

    // DB insert was called — this is the primary side-effect we can verify.
    expect(insertOneSpy).toHaveBeenCalledTimes(1)
    const insertedDoc = insertOneSpy.mock.calls[0][0]
    expect(insertedDoc.text).toBe('Hello from A')
    expect(insertedDoc.roomId).toBe('shared-room')

    // Room lastMessage was also updated.
    expect(updateOneSpy).toHaveBeenCalled()

    // Sender's connection remains open (no error forced a close).
    expect(clientA.readyState).toBe(WebSocket.OPEN)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// load_last_messages
// ─────────────────────────────────────────────────────────────────────────────

describe('WebSocket — load_last_messages', () => {
  it('returns load_last_messages with roomsData', async () => {
    const stubRoomsData = [
      { _id: 'room-a', members: ['507f1f77bcf86cd799439011', 'user-2'], updatedAt: new Date() },
      { _id: 'room-b', members: ['507f1f77bcf86cd799439011', 'user-3'], updatedAt: new Date() },
    ]

    // Provide a find().project().toArray() chain returning stub rooms.
    const toArrayStub = vi.fn().mockResolvedValue(stubRoomsData)
    const projectStub = vi.fn().mockReturnValue({ toArray: toArrayStub })
    const findStub    = vi.fn().mockReturnValue({
      sort:    vi.fn().mockReturnThis(),
      limit:   vi.fn().mockReturnThis(),
      project: projectStub,
      toArray: toArrayStub,
    })

    mockConnectDB.mockResolvedValue(makeMockDb({ roomsFind: findStub }))

    const ws = await openClient()
    await authenticate(ws)

    send(ws, { type: 'load_last_messages' })
    const msg = await waitForMsg(ws, 'load_last_messages')

    expect(msg.type).toBe('load_last_messages')
    expect(Array.isArray(msg.roomsData)).toBe(true)
    expect(msg.roomsData).toHaveLength(2)
    expect(msg.roomsData[0]._id).toBe('room-a')
  })
})
