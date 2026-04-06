/**
 * API / Contract tests.
 *
 * Verifies the HTTP contract of each endpoint:
 *   • correct status codes for every scenario
 *   • correct JSON response shape (required fields present)
 *   • Content-Type: application/json on every response
 *   • auth gates reject unauthenticated requests
 *   • password field is NEVER leaked in any response
 *
 * Uses supertest against a minimal Express test app (testApp.js) that wires
 * the real controllers and services — no HTTP logic is duplicated in tests.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import process from 'node:process'
import { createApp } from './testApp.js'
import connectDB from '../../config/db.js'
import { createToken } from '../../utils/jwtToken.js'
import { signUp } from '../../controllers/authController.js'

let mongod
let client
let db
let request // supertest agent

// ─────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  // Prime the connectDB singleton (used by signUp / login)
  process.env.MONGO_URI = uri
  await connectDB()

  // Direct client for assertions and seeding
  client = new MongoClient(uri)
  await client.connect()
  db = client.db('DevsBlog')

  const app = createApp(db)
  request = supertest(app)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  await db.collection('users').deleteMany({})
  await db.collection('usersStats').deleteMany({})
  await db.collection('follows').deleteMany({})
  await db.collection('notifications').deleteMany({})
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

/** Register a user and return the token */
const seedUser = async (overrides = {}) => {
  const result = await signUp({ ...BASE_USER, ...overrides })
  return { token: result.token, userId: result.token }
}

/** Auth header for a given token */
const bearer = (token) => `Bearer ${token}`

// ─────────────────────────────────────────────────────────────────────────────
// POST /get-started — register
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /get-started', () => {
  it('returns 201 with token and success message', async () => {
    const res = await request.post('/get-started').send(BASE_USER)

    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toMatchObject({
      status: 201,
      message: expect.stringMatching(/created/i),
      token: expect.any(String),
    })
    expect(res.body.token.split('.')).toHaveLength(3)
  })

  it('returns 409 for a duplicate email', async () => {
    await request.post('/get-started').send(BASE_USER)
    const res = await request.post('/get-started').send(BASE_USER)

    expect(res.status).toBe(409)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toMatchObject({
      status: 409,
      message: expect.stringMatching(/already registered/i),
    })
  })

  it('response never contains a password field', async () => {
    const res = await request.post('/get-started').send(BASE_USER)
    expect(JSON.stringify(res.body)).not.toContain('password')
  })

  it('token in 201 response is verifiable', async () => {
    const res = await request.post('/get-started').send(BASE_USER)
    const { createToken: _, verifyToken } = await import('../../utils/jwtToken.js')
    // import verifyToken directly to check
    const { verifyToken: verify } = await import('../../utils/jwtToken.js')
    const payload = verify(res.body.token)
    expect(payload).not.toBeNull()
    expect(payload.id).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /login
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /login', () => {
  beforeEach(async () => {
    await request.post('/get-started').send(BASE_USER)
  })

  it('returns 200 with token and userId for valid credentials', async () => {
    const res = await request
      .post('/login')
      .send({ email: BASE_USER.email, password: BASE_USER.password })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toMatchObject({
      status: 200,
      message: expect.stringMatching(/successful/i),
      token: expect.any(String),
    })
    expect(res.body.token.split('.')).toHaveLength(3)
    expect(res.body.userId).toBeTruthy()
  })

  it('returns 401 for the correct email with a wrong password', async () => {
    const res = await request
      .post('/login')
      .send({ email: BASE_USER.email, password: 'wrongpass' })

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      status: 401,
      message: expect.stringMatching(/incorrect/i),
    })
  })

  it('returns 404 for an email that is not registered', async () => {
    const res = await request
      .post('/login')
      .send({ email: 'ghost@test.com', password: 'anypass' })

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({
      status: 404,
      message: expect.stringMatching(/not found/i),
    })
  })

  it('response never contains a password field', async () => {
    const res = await request
      .post('/login')
      .send({ email: BASE_USER.email, password: BASE_USER.password })
    expect(JSON.stringify(res.body)).not.toContain('password')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /verify-token
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /verify-token', () => {
  it('returns { valid: true } for a valid token', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/verify-token')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ valid: true })
  })

  it('returns { valid: false } for an invalid token', async () => {
    const res = await request
      .get('/verify-token')
      .set('Authorization', 'Bearer invalid.jwt.token')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ valid: false })
  })

  it('returns { valid: false } when no Authorization header is sent', async () => {
    const res = await request.get('/verify-token')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ valid: false })
  })

  it('returns { valid: false } for an expired token', async () => {
    const jwt = await import('jsonwebtoken')
    const expired = jwt.default.sign(
      { id: '507f1f77bcf86cd799439011', exp: Math.floor(Date.now() / 1000) - 10 },
      process.env.JWT_Secret,
    )
    const res = await request
      .get('/verify-token')
      .set('Authorization', bearer(expired))

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ valid: false })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /log-out
// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /log-out', () => {
  it('returns 200 with a logout confirmation', async () => {
    const res = await request.delete('/log-out')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toMatchObject({
      message: expect.stringMatching(/logged out/i),
      code: 200,
    })
  })

  it('returns 200 even without an auth token (stateless logout)', async () => {
    const res = await request.delete('/log-out')
    expect(res.status).toBe(200)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /my-profile
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /my-profile', () => {
  it('returns 403 when no Authorization header is provided', async () => {
    const res = await request.get('/my-profile')
    expect(res.status).toBe(403)
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  it('returns 403 for an invalid token', async () => {
    const res = await request
      .get('/my-profile')
      .set('Authorization', 'Bearer not.a.valid.token')
    expect(res.status).toBe(403)
  })

  it('returns 200 with userWithoutPassword and stats for a valid token', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toHaveProperty('userWithoutPassword')
    expect(res.body).toHaveProperty('stats')
    expect(res.body.userWithoutPassword.email).toBe(BASE_USER.email)
    expect(res.body.userWithoutPassword.firstName).toBe(BASE_USER.firstName)
  })

  it('never leaks the password field in the profile response', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile')
      .set('Authorization', bearer(token))

    expect(res.body.userWithoutPassword.password).toBeUndefined()
    expect(JSON.stringify(res.body)).not.toContain('password')
  })

  it('stats contains expected default fields', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile')
      .set('Authorization', bearer(token))

    const { stats } = res.body
    expect(stats).toMatchObject({
      followersCount: 0,
      followingsCount: 0,
      postsCount: 0,
      bio: '',
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /my-profile/followers
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /my-profile/followers', () => {
  it('returns 403 with no Authorization header', async () => {
    const res = await request.get('/my-profile/followers')
    expect(res.status).toBe(403)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toHaveProperty('message')
  })

  it('returns 403 with a malformed Authorization header', async () => {
    const res = await request
      .get('/my-profile/followers')
      .set('Authorization', 'InvalidScheme token')
    expect(res.status).toBe(403)
  })

  it('returns 200 with the correct response shape for a valid token', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/followers')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/application\/json/)
    expect(res.body).toMatchObject({
      followers: expect.any(Array),
      followersCount: expect.any(Number),
      followingCount: expect.any(Number),
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      hasMore: expect.any(Boolean),
    })
  })

  it('returns empty followers list for a new user with no followers', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/followers')
      .set('Authorization', bearer(token))

    expect(res.body.followers).toEqual([])
    expect(res.body.followersCount).toBe(0)
    expect(res.body.hasMore).toBe(false)
  })

  it('followers list never contains password fields', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/followers')
      .set('Authorization', bearer(token))

    res.body.followers.forEach((f) => {
      expect(f.password).toBeUndefined()
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /my-profile/following
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /my-profile/following', () => {
  it('returns 403 with no Authorization header', async () => {
    const res = await request.get('/my-profile/following')
    expect(res.status).toBe(403)
  })

  it('returns 200 with the correct response shape for a valid token', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/following')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      following: expect.any(Array),
      followingCount: expect.any(Number),
      followersCount: expect.any(Number),
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      hasMore: expect.any(Boolean),
    })
  })

  it('supports page and limit query parameters', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/following?page=2&limit=5')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(2)
    expect(res.body.limit).toBe(5)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /my-profile/notifications
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /my-profile/notifications', () => {
  it('returns 401 with no token', async () => {
    const res = await request.get('/my-profile/notifications')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ message: expect.stringMatching(/unauthorized/i) })
  })

  it('returns 200 with an array of notifications for a valid token', async () => {
    const { token } = await signUp(BASE_USER)
    const res = await request
      .get('/my-profile/notifications')
      .set('Authorization', bearer(token))

    expect(res.status).toBe(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /search/users
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /search/users', () => {
  beforeEach(async () => {
    await signUp(BASE_USER)
    await signUp({ ...BASE_USER, email: 'bob@test.com', username: 'bob', firstName: 'Bob' })
  })

  it('returns 200 with empty results for an empty query', async () => {
    const res = await request.get('/search/users')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ results: [] })
  })

  it('returns matching users for a valid query', async () => {
    const res = await request.get('/search/users?q=Alice')
    expect(res.status).toBe(200)
    expect(res.body.results).toBeInstanceOf(Array)
    expect(res.body.results.length).toBeGreaterThan(0)
  })

  it('each result has the required shape', async () => {
    const res = await request.get('/search/users?q=Alice')
    res.body.results.forEach((r) => {
      expect(r).toMatchObject({
        id: expect.anything(),
        type: 'user',
        title: expect.any(String),
        username: expect.any(String),
      })
    })
  })

  it('results never contain a password field', async () => {
    const res = await request.get('/search/users?q=Alice')
    expect(JSON.stringify(res.body)).not.toContain('password')
  })

  it('returns 200 with empty results for a query that matches nobody', async () => {
    const res = await request.get('/search/users?q=zzznomatch999')
    expect(res.status).toBe(200)
    expect(res.body.results).toEqual([])
  })

  it('search is case-insensitive', async () => {
    const lower = await request.get('/search/users?q=alice')
    const upper = await request.get('/search/users?q=ALICE')
    expect(lower.body.results.length).toBe(upper.body.results.length)
    expect(lower.body.results.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Global contract — Content-Type and JSON validity
// ─────────────────────────────────────────────────────────────────────────────
describe('global contract — all endpoints return JSON', () => {
  const ENDPOINTS = [
    { method: 'post', path: '/get-started', body: BASE_USER },
    { method: 'post', path: '/login', body: { email: BASE_USER.email, password: BASE_USER.password } },
    { method: 'get', path: '/verify-token' },
    { method: 'delete', path: '/log-out' },
    { method: 'get', path: '/my-profile' },
    { method: 'get', path: '/my-profile/followers' },
    { method: 'get', path: '/my-profile/following' },
    { method: 'get', path: '/my-profile/notifications' },
    { method: 'get', path: '/search/users' },
  ]

  it('every endpoint responds with Content-Type: application/json', async () => {
    for (const { method, path, body } of ENDPOINTS) {
      const res = await request[method](path).send(body)
      expect(
        res.headers['content-type'],
        `Expected JSON content-type for ${method.toUpperCase()} ${path}`,
      ).toMatch(/application\/json/)
    }
  })

  it('every endpoint responds with parseable JSON (no empty bodies)', async () => {
    for (const { method, path, body } of ENDPOINTS) {
      const res = await request[method](path).send(body)
      expect(
        typeof res.body,
        `Expected object/array body for ${method.toUpperCase()} ${path}`,
      ).toMatch(/^(object)$/)
    }
  })
})
