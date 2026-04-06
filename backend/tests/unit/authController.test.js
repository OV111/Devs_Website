import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- hoisted mocks (must be defined before any import that uses them) ---
const mockConnectDB = vi.hoisted(() => vi.fn())
const { mockBcryptHash, mockBcryptCompare } = vi.hoisted(() => ({
  mockBcryptHash: vi.fn(),
  mockBcryptCompare: vi.fn(),
}))

vi.mock('../../config/db.js', () => ({ default: mockConnectDB }))
vi.mock('bcrypt', () => ({
  default: { hash: mockBcryptHash, compare: mockBcryptCompare },
}))

import { signUp, login } from '../../controllers/authController.js'

// --- helpers ---
const MOCK_OID = '507f1f77bcf86cd799439011'

/**
 * Build a lightweight in-memory mock DB.
 * Pass per-collection overrides to control return values.
 */
const makeDb = ({
  usersFindOnce = [],       // sequential mockResolvedValueOnce for users.findOne
  usersInsertOne = { insertedId: MOCK_OID },
  usersStatsFindOne = null,
} = {}) => {
  const usersFindOne = vi.fn()
  usersFindOnce.forEach((v) => usersFindOne.mockResolvedValueOnce(v))

  const collections = {
    users: {
      findOne: usersFindOne,
      insertOne: vi.fn().mockResolvedValue(usersInsertOne),
    },
    usersStats: {
      findOne: vi.fn().mockResolvedValue(usersStatsFindOne),
      insertOne: vi.fn().mockResolvedValue({}),
      updateOne: vi.fn().mockResolvedValue({}),
    },
  }
  return { collection: vi.fn((name) => collections[name]) }
}

beforeEach(() => {
  vi.clearAllMocks()
  // Default bcrypt behaviour — override per test as needed
  mockBcryptHash.mockResolvedValue('hashed_password')
  mockBcryptCompare.mockResolvedValue(false)
})

// ─────────────────────────────────────────────
// signUp
// ─────────────────────────────────────────────
describe('signUp', () => {
  const validPayload = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    password: 'secret123',
    username: 'janedoe',
  }

  it('returns 409 when a user with that email already exists', async () => {
    mockConnectDB.mockResolvedValue(
      makeDb({ usersFindOnce: [{ email: validPayload.email }] }),
    )

    const result = await signUp(validPayload)

    expect(result.status).toBe(409)
    expect(result.message).toMatch(/already registered/i)
  })

  it('returns 201 and a token for a new user', async () => {
    mockConnectDB.mockResolvedValue(
      makeDb({
        // 1st findOne → no existing email  2nd → no username collision
        usersFindOnce: [null, null],
      }),
    )

    const result = await signUp(validPayload)

    expect(result.status).toBe(201)
    expect(result.message).toMatch(/created/i)
    expect(typeof result.token).toBe('string')
    expect(result.token.split('.')).toHaveLength(3)
  })

  it('hashes the password before saving', async () => {
    mockConnectDB.mockResolvedValue(
      makeDb({ usersFindOnce: [null, null] }),
    )

    await signUp(validPayload)

    expect(mockBcryptHash).toHaveBeenCalledWith(validPayload.password, 13)
  })

  it('retries username generation on collision then resolves', async () => {
    mockConnectDB.mockResolvedValue(
      makeDb({
        // email check → null, first username → collision, second → null
        usersFindOnce: [null, { username: 'janedoe_1234' }, null],
      }),
    )

    const result = await signUp(validPayload)
    expect(result.status).toBe(201)
  })

  it('returns 500 on unexpected DB error', async () => {
    mockConnectDB.mockRejectedValue(new Error('connection refused'))

    const result = await signUp(validPayload)

    expect(result.code).toBe(500)
    expect(result.message).toMatch(/sign up failed/i)
  })

  it('uses firstName+lastName as base username when username is empty', async () => {
    mockConnectDB.mockResolvedValue(
      makeDb({ usersFindOnce: [null, null] }),
    )
    const db = await mockConnectDB()
    const usersCollection = db.collection('users')

    await signUp({ ...validPayload, username: '' })

    const insertedDoc = usersCollection.insertOne.mock.calls[0][0]
    // username should start with firstnamelastname (sanitized)
    expect(insertedDoc.username).toMatch(/^janedoe_/)
  })
})

// ─────────────────────────────────────────────
// login
// ─────────────────────────────────────────────
describe('login', () => {
  const credentials = { email: 'jane@example.com', password: 'secret123' }
  const storedUser = {
    _id: MOCK_OID,
    email: 'jane@example.com',
    password: 'hashed_password',
  }

  it('returns 404 when the user is not found', async () => {
    mockConnectDB.mockResolvedValue(makeDb({ usersFindOnce: [null] }))

    const result = await login(credentials)

    expect(result.status).toBe(404)
    expect(result.message).toMatch(/not found/i)
  })

  it('returns 401 when the password is incorrect', async () => {
    mockConnectDB.mockResolvedValue(makeDb({ usersFindOnce: [storedUser] }))
    mockBcryptCompare.mockResolvedValue(false)

    const result = await login(credentials)

    expect(result.status).toBe(401)
    expect(result.message).toMatch(/incorrect/i)
  })

  it('returns 200 with token and userId on valid credentials', async () => {
    mockConnectDB.mockResolvedValue(makeDb({ usersFindOnce: [storedUser] }))
    mockBcryptCompare.mockResolvedValue(true)

    const result = await login(credentials)

    expect(result.status).toBe(200)
    expect(result.message).toMatch(/login successful/i)
    expect(typeof result.token).toBe('string')
    expect(result.userId).toBe(MOCK_OID)
  })

  it('updates lastActive in usersStats on successful login', async () => {
    const db = makeDb({ usersFindOnce: [storedUser] })
    mockConnectDB.mockResolvedValue(db)
    mockBcryptCompare.mockResolvedValue(true)

    await login(credentials)

    const statsCollection = db.collection('usersStats')
    expect(statsCollection.updateOne).toHaveBeenCalledOnce()
    const setArg = statsCollection.updateOne.mock.calls[0][1]
    expect(setArg.$set).toHaveProperty('lastActive')
  })

  it('compares against the stored hashed password', async () => {
    mockConnectDB.mockResolvedValue(makeDb({ usersFindOnce: [storedUser] }))
    mockBcryptCompare.mockResolvedValue(true)

    await login(credentials)

    expect(mockBcryptCompare).toHaveBeenCalledWith(
      credentials.password,
      storedUser.password,
    )
  })
})
