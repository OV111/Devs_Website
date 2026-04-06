/**
 * Performance / Load Tests — Step 8
 *
 * Strategy
 * --------
 * - MongoMemoryServer provides a real in-memory MongoDB so queries behave
 *   exactly as in production (indexes, aggregations, cursors).
 * - supertest drives the Express test app (same one used by contract tests)
 *   so every request goes through the full middleware + controller stack.
 * - Promise.all() fires N requests simultaneously, simulating concurrent users.
 * - Timing assertions use wall-clock elapsed time.  Thresholds are intentionally
 *   generous to avoid flakiness on slow CI runners — the goal is to catch
 *   O(N²) regressions and hanging requests, not to enforce sub-ms SLAs.
 *
 * Scenarios covered
 * -----------------
 * 1. Concurrent registrations       — 50 users sign up simultaneously
 * 2. Concurrent logins              — 30 authenticated logins at once
 * 3. Concurrent profile reads       — 40 GET /my-profile requests in parallel
 * 4. Concurrent search queries      — 30 search requests at once
 * 5. Mixed read/write load          — register + login + profile reads interleaved
 * 6. Response time under load       — every response arrives within the threshold
 * 7. No dropped connections         — every request returns a 2xx or expected 4xx
 * 8. Follower-list pagination load  — 25 concurrent paginated requests
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import process from 'node:process'
import { createApp } from '../api/testApp.js'
import connectDB from '../../config/db.js'
import { signUp } from '../../controllers/authController.js'

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
let mongod
let client
let db
let request

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  process.env.MONGO_URI = uri
  await connectDB()

  client = new MongoClient(uri)
  await client.connect()
  db = client.db('DevsBlog')

  const app = createApp(db)
  request = supertest(app)
}, 60_000)

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const makeUser = (n) => ({
  firstName: `User${n}`,
  lastName: `Load${n}`,
  email: `loaduser${n}_${Date.now()}_${Math.random().toString(36).slice(2)}@perf.test`,
  password: 'LoadTest123!',
  username: `loaduser${n}`,
})

const bearer = (token) => `Bearer ${token}`

/** Register N users concurrently via HTTP and return their tokens. */
const registerN = async (n, offset = 0) => {
  const payloads = Array.from({ length: n }, (_, i) => makeUser(i + offset))
  const responses = await Promise.all(
    payloads.map((p) => request.post('/get-started').send(p)),
  )
  return responses.map((r) => r.body.token).filter(Boolean)
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Concurrent registrations
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — concurrent registrations', () => {
  it('50 simultaneous sign-up requests all return 201', async () => {
    const N = 50
    const payloads = Array.from({ length: N }, (_, i) => makeUser(i))

    const start = Date.now()
    const responses = await Promise.all(
      payloads.map((p) => request.post('/get-started').send(p)),
    )
    const elapsed = Date.now() - start

    const successes = responses.filter((r) => r.status === 201)
    expect(successes).toHaveLength(N)

    // All 50 registrations must complete within 30 s (generous CI threshold)
    expect(elapsed).toBeLessThan(30_000)

    // Verify all users were actually persisted
    const count = await db.collection('users').countDocuments()
    expect(count).toBe(N)
  }, 40_000)

  it('each 201 response includes a valid JWT', async () => {
    const N = 20
    const payloads = Array.from({ length: N }, (_, i) => makeUser(i))

    const responses = await Promise.all(
      payloads.map((p) => request.post('/get-started').send(p)),
    )

    responses.forEach((r) => {
      expect(r.status).toBe(201)
      expect(r.body.token).toBeTruthy()
      expect(r.body.token.split('.')).toHaveLength(3)
    })
  }, 30_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Concurrent logins
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — concurrent logins', () => {
  it('30 simultaneous logins for registered users all return 200', async () => {
    const N = 30
    const payloads = Array.from({ length: N }, (_, i) => makeUser(i))

    // Register all users first (sequential is fine here — testing login load)
    await Promise.all(payloads.map((p) => signUp(p)))

    const credentials = payloads.map((p) => ({
      email: p.email,
      password: p.password,
    }))

    const start = Date.now()
    const responses = await Promise.all(
      credentials.map((c) => request.post('/login').send(c)),
    )
    const elapsed = Date.now() - start

    const successes = responses.filter((r) => r.status === 200)
    expect(successes).toHaveLength(N)
    expect(elapsed).toBeLessThan(30_000)
  }, 40_000)

  it('concurrent logins return unique tokens per user', async () => {
    const N = 15
    const payloads = Array.from({ length: N }, (_, i) => makeUser(i))
    await Promise.all(payloads.map((p) => signUp(p)))

    const responses = await Promise.all(
      payloads.map((p) =>
        request.post('/login').send({ email: p.email, password: p.password }),
      ),
    )

    const tokens = responses.map((r) => r.body.token)
    const uniqueTokens = new Set(tokens)
    expect(uniqueTokens.size).toBe(N)
  }, 30_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Concurrent authenticated profile reads
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — concurrent profile reads', () => {
  it('40 simultaneous GET /my-profile requests all return 200', async () => {
    const N = 40
    const tokens = await registerN(N)
    expect(tokens).toHaveLength(N)

    const start = Date.now()
    const responses = await Promise.all(
      tokens.map((t) =>
        request.get('/my-profile').set('Authorization', bearer(t)),
      ),
    )
    const elapsed = Date.now() - start

    const successes = responses.filter((r) => r.status === 200)
    expect(successes).toHaveLength(N)
    expect(elapsed).toBeLessThan(30_000)
  }, 45_000)

  it('no profile response leaks a password field under load', async () => {
    const N = 20
    const tokens = await registerN(N)

    const responses = await Promise.all(
      tokens.map((t) =>
        request.get('/my-profile').set('Authorization', bearer(t)),
      ),
    )

    responses.forEach((r) => {
      expect(r.status).toBe(200)
      expect(JSON.stringify(r.body)).not.toContain('password')
    })
  }, 30_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. Concurrent search queries
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — concurrent search queries', () => {
  beforeEach(async () => {
    // Seed 20 users with known names for search
    const payloads = Array.from({ length: 20 }, (_, i) => makeUser(i))
    await Promise.all(payloads.map((p) => signUp(p)))
  })

  it('30 simultaneous GET /search/users requests all return 200', async () => {
    const queries = ['User', 'Load', 'user1', 'user2', 'user']
    const N = 30

    const start = Date.now()
    const responses = await Promise.all(
      Array.from({ length: N }, (_, i) =>
        request.get(`/search/users?q=${queries[i % queries.length]}`),
      ),
    )
    const elapsed = Date.now() - start

    responses.forEach((r) => expect(r.status).toBe(200))
    expect(elapsed).toBeLessThan(20_000)
  }, 30_000)

  it('concurrent searches never return password fields', async () => {
    const N = 20
    const responses = await Promise.all(
      Array.from({ length: N }, () => request.get('/search/users?q=User')),
    )

    responses.forEach((r) => {
      expect(r.status).toBe(200)
      expect(JSON.stringify(r.body)).not.toContain('password')
    })
  }, 25_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. Mixed read/write load
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — mixed read/write load', () => {
  it('concurrent registrations + logins + profile reads all succeed', async () => {
    // Pre-register some users for login/profile reads
    const existingPayloads = Array.from({ length: 10 }, (_, i) =>
      makeUser(i + 500),
    )
    await Promise.all(existingPayloads.map((p) => signUp(p)))
    const existingTokens = await Promise.all(
      existingPayloads.map(async (p) => {
        const r = await request
          .post('/login')
          .send({ email: p.email, password: p.password })
        return r.body.token
      }),
    )

    // Fire all three types at once
    const newPayloads = Array.from({ length: 10 }, (_, i) => makeUser(i + 600))

    const start = Date.now()
    const [regResponses, loginResponses, profileResponses] = await Promise.all([
      // 10 new registrations
      Promise.all(newPayloads.map((p) => request.post('/get-started').send(p))),
      // 10 logins for existing users
      Promise.all(
        existingPayloads.map((p) =>
          request.post('/login').send({ email: p.email, password: p.password }),
        ),
      ),
      // 10 profile reads for existing users
      Promise.all(
        existingTokens.map((t) =>
          request.get('/my-profile').set('Authorization', bearer(t)),
        ),
      ),
    ])
    const elapsed = Date.now() - start

    expect(regResponses.every((r) => r.status === 201)).toBe(true)
    expect(loginResponses.every((r) => r.status === 200)).toBe(true)
    expect(profileResponses.every((r) => r.status === 200)).toBe(true)
    expect(elapsed).toBeLessThan(30_000)
  }, 45_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. Individual response-time threshold
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — individual response-time thresholds', () => {
  it('GET /verify-token responds in under 500ms per request under 20-way concurrency', async () => {
    const tokens = await registerN(20)

    const timings = await Promise.all(
      tokens.map(async (t) => {
        const start = Date.now()
        const r = await request
          .get('/verify-token')
          .set('Authorization', bearer(t))
        return { elapsed: Date.now() - start, status: r.status }
      }),
    )

    timings.forEach(({ elapsed, status }) => {
      expect(status).toBe(200)
      // 500ms per individual request is very generous — catches hanging handlers
      expect(elapsed).toBeLessThan(500)
    })
  }, 20_000)

  it('POST /get-started responds in under 5s per request under 25-way concurrency', async () => {
    const N = 25
    const payloads = Array.from({ length: N }, (_, i) => makeUser(i + 1000))

    const timings = await Promise.all(
      payloads.map(async (p) => {
        const start = Date.now()
        const r = await request.post('/get-started').send(p)
        return { elapsed: Date.now() - start, status: r.status }
      }),
    )

    timings.forEach(({ elapsed, status }) => {
      expect(status).toBe(201)
      expect(elapsed).toBeLessThan(5_000)
    })
  }, 30_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. No dropped connections — every endpoint handles surge traffic gracefully
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — no dropped connections', () => {
  it('100 rapid GET /verify-token requests (no token) all return a parseable JSON body', async () => {
    const N = 100

    const start = Date.now()
    const responses = await Promise.all(
      Array.from({ length: N }, () => request.get('/verify-token')),
    )
    const elapsed = Date.now() - start

    responses.forEach((r) => {
      expect(r.status).toBe(200)
      expect(r.body).toMatchObject({ valid: false })
    })

    expect(elapsed).toBeLessThan(15_000)
  }, 20_000)

  it('50 rapid DELETE /log-out requests all return 200', async () => {
    const N = 50
    const responses = await Promise.all(
      Array.from({ length: N }, () => request.delete('/log-out')),
    )
    responses.forEach((r) => expect(r.status).toBe(200))
  }, 15_000)
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. Follower-list pagination load
// ─────────────────────────────────────────────────────────────────────────────
describe('Performance — follower-list pagination under load', () => {
  it('25 concurrent GET /my-profile/followers requests return valid paginated data', async () => {
    const N = 25
    const tokens = await registerN(N)

    const start = Date.now()
    const responses = await Promise.all(
      tokens.map((t) =>
        request
          .get('/my-profile/followers?page=1&limit=10')
          .set('Authorization', bearer(t)),
      ),
    )
    const elapsed = Date.now() - start

    responses.forEach((r) => {
      expect(r.status).toBe(200)
      expect(r.body).toMatchObject({
        followers: expect.any(Array),
        followersCount: expect.any(Number),
        page: expect.any(Number),
        hasMore: expect.any(Boolean),
      })
    })

    expect(elapsed).toBeLessThan(20_000)
  }, 30_000)
})
