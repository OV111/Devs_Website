/**
 * Integration tests for signUp and login.
 *
 * These tests use a real in-memory MongoDB instance (mongodb-memory-server)
 * and the real bcrypt implementation.  No mocks — we're verifying that the
 * full signUp → DB write → login → DB read pipeline behaves correctly end-to-end.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import process from 'node:process'
import { signUp, login } from '../../controllers/authController.js'
import connectDB from '../../config/db.js'
import { verifyToken } from '../../utils/jwtToken.js'

let mongod

// ─────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGO_URI = mongod.getUri()
  // Trigger the lazy connection now so tests don't pay startup cost individually
  await connectDB()
})

afterAll(async () => {
  await mongod.stop()
})

beforeEach(async () => {
  // Wipe relevant collections before every test for full isolation
  const db = await connectDB()
  await db.collection('users').deleteMany({})
  await db.collection('usersStats').deleteMany({})
})

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const BASE_USER = {
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@test.com',
  password: 'password123',
  username: 'alice',
}

// ─────────────────────────────────────────────
// signUp — integration
// ─────────────────────────────────────────────
describe('signUp — integration', () => {
  it('returns 201 and a token on success', async () => {
    const result = await signUp(BASE_USER)
    expect(result.status).toBe(201)
    expect(result.message).toMatch(/created/i)
    expect(typeof result.token).toBe('string')
  })

  it('actually persists the user document in MongoDB', async () => {
    await signUp(BASE_USER)

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    expect(user).not.toBeNull()
    expect(user.firstName).toBe('Alice')
    expect(user.lastName).toBe('Smith')
    expect(user.email).toBe('alice@test.com')
  })

  it('stores the password as a bcrypt hash, never in plaintext', async () => {
    await signUp(BASE_USER)

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    expect(user.password).not.toBe(BASE_USER.password)
    // bcrypt hashes always start with $2b$ or $2a$
    expect(user.password).toMatch(/^\$2[ab]\$/)
  })

  it('creates a default usersStats record linked to the new user', async () => {
    await signUp(BASE_USER)

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    const stats = await db.collection('usersStats').findOne({ userId: user._id })

    expect(stats).not.toBeNull()
    expect(stats.followersCount).toBe(0)
    expect(stats.followingsCount).toBe(0)
    expect(stats.postsCount).toBe(0)
    expect(stats.bio).toBe('')
  })

  it('returns a JWT whose payload contains the new user id', async () => {
    const result = await signUp(BASE_USER)

    const payload = verifyToken(result.token)
    expect(payload).not.toBeNull()
    expect(payload.id).toBeTruthy()

    // The id in the token must match the actual DB document
    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    expect(payload.id).toBe(user._id.toString())
  })

  it('returns 409 when the same email is registered twice', async () => {
    await signUp(BASE_USER)
    const result = await signUp({ ...BASE_USER, firstName: 'Other' })
    expect(result.status).toBe(409)
    expect(result.message).toMatch(/already registered/i)
  })

  it('does not insert a duplicate user on 409', async () => {
    await signUp(BASE_USER)
    await signUp(BASE_USER) // second attempt

    const db = await connectDB()
    const count = await db.collection('users').countDocuments({ email: BASE_USER.email })
    expect(count).toBe(1)
  })

  it('sanitizes the username to lowercase alphanumeric characters only', async () => {
    const result = await signUp({ ...BASE_USER, email: 'b@test.com', username: 'Alice!@# 99' })
    expect(result.status).toBe(201)

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: 'b@test.com' })
    // sanitized base: 'alice99', then appended with _<suffix>
    expect(user.username).toMatch(/^alice99_\d+$/)
  })

  it('generates a unique username suffix when base username collides', async () => {
    // Sign up two users with the same base name — both must get distinct usernames
    const r1 = await signUp({ ...BASE_USER })
    const r2 = await signUp({ ...BASE_USER, email: 'alice2@test.com' })

    const db = await connectDB()
    const [u1, u2] = await Promise.all([
      db.collection('users').findOne({ email: BASE_USER.email }),
      db.collection('users').findOne({ email: 'alice2@test.com' }),
    ])
    expect(u1.username).not.toBe(u2.username)
    // Both should resolve successfully
    expect(r1.status).toBe(201)
    expect(r2.status).toBe(201)
  })
})

// ─────────────────────────────────────────────
// login — integration
// ─────────────────────────────────────────────
describe('login — integration', () => {
  // Seed a user before each login test
  beforeEach(async () => {
    await signUp(BASE_USER)
  })

  it('returns 404 for an email that does not exist', async () => {
    const result = await login({ email: 'nobody@test.com', password: 'pass' })
    expect(result.status).toBe(404)
    expect(result.message).toMatch(/not found/i)
  })

  it('returns 401 for the correct email but wrong password', async () => {
    const result = await login({ email: BASE_USER.email, password: 'wrongpassword' })
    expect(result.status).toBe(401)
    expect(result.message).toMatch(/incorrect/i)
  })

  it('returns 200 with a token and userId for valid credentials', async () => {
    const result = await login({ email: BASE_USER.email, password: BASE_USER.password })
    expect(result.status).toBe(200)
    expect(result.message).toMatch(/successful/i)
    expect(typeof result.token).toBe('string')
    expect(result.userId).toBeTruthy()
  })

  it('returns a verifiable JWT on successful login', async () => {
    const result = await login({ email: BASE_USER.email, password: BASE_USER.password })
    const payload = verifyToken(result.token)
    expect(payload).not.toBeNull()
    expect(payload.id).toBeTruthy()
  })

  it('userId in response matches the real document _id', async () => {
    const result = await login({ email: BASE_USER.email, password: BASE_USER.password })

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    expect(result.userId.toString()).toBe(user._id.toString())
  })

  it('updates lastActive in usersStats on successful login', async () => {
    const before = new Date()

    await login({ email: BASE_USER.email, password: BASE_USER.password })

    const db = await connectDB()
    const user = await db.collection('users').findOne({ email: BASE_USER.email })
    const stats = await db.collection('usersStats').findOne({ userId: user._id })

    expect(stats.lastActive).toBeInstanceOf(Date)
    expect(stats.lastActive.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  it('signUp then login is a complete working auth cycle', async () => {
    // Full round-trip: register → login → verify JWT contains same id
    const signUpResult = await signUp({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@test.com',
      password: 'bobspass',
      username: 'bob',
    })
    expect(signUpResult.status).toBe(201)

    const loginResult = await login({ email: 'bob@test.com', password: 'bobspass' })
    expect(loginResult.status).toBe(200)

    const signUpPayload = verifyToken(signUpResult.token)
    const loginPayload = verifyToken(loginResult.token)
    expect(signUpPayload.id).toBe(loginPayload.id)
  })
})
