/**
 * HTTP contract tests for the billing module.
 *
 * Mounts the REAL router and webhook handler exactly as app.js wires them —
 * including the one thing that is easy to get wrong: the webhook must be
 * registered with `express.raw` BEFORE `express.json`, or signature verification
 * can never succeed. Payloads are signed with the same HMAC scheme Polar uses, so
 * the SDK's real verification path runs; only Polar's HTTP API is faked.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import express from 'express'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import billingRoutes, { handleBillingWebhook } from '../../modules/billing/index.js'
import { setPolarClient } from '../../modules/billing/services/polarClient.js'
import { resetSubscriptionIndexes } from '../../modules/billing/services/subscriptionService.js'
import { createAccessToken } from '../../utils/jwtToken.js'

let mongod
let client
let db
let app

const PRO = 'prod_pro'
const SECRET_BYTES = 'super-secret-test-key-0123456789'
const WEBHOOK_SECRET = `whsec_${Buffer.from(SECRET_BYTES).toString('base64')}`

const ENV_KEYS = [
  'POLAR_ACCESS_TOKEN',
  'POLAR_WEBHOOK_SECRET',
  'POLAR_PRO_PRODUCT_ID',
  'FRONTEND_URL',
  'BILLING_ENFORCED',
]
let savedEnv

const DAY = 24 * 60 * 60 * 1000
const iso = (d) => new Date(Date.now() + d * DAY).toISOString()

const sign = (id, ts, body, secret = WEBHOOK_SECRET) => {
  const key = Buffer.from(secret.slice('whsec_'.length), 'base64')
  return 'v1,' + crypto.createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64')
}

/** POST a Polar-style webhook with a valid (or deliberately broken) signature. */
const postWebhook = (event, { secret = WEBHOOK_SECRET, tsOffsetSec = 0, tamper = false } = {}) => {
  const body = JSON.stringify(event)
  const id = `msg_${crypto.randomUUID()}`
  const ts = String(Math.floor(Date.now() / 1000) + tsOffsetSec)
  const signature = sign(id, ts, body, secret)
  return request(app)
    .post('/api/billing/webhook')
    .set('Content-Type', 'application/json')
    .set('webhook-id', id)
    .set('webhook-timestamp', ts)
    .set('webhook-signature', signature)
    .send(tamper ? body.replace('"active"', '"trialing"') : body)
}

const subscriptionEvent = (userId, over = {}, type = 'subscription.active') => ({
  type,
  timestamp: new Date().toISOString(),
  data: {
    id: 'sub_1',
    customer_id: 'cus_1',
    product_id: PRO,
    status: 'active',
    recurring_interval: 'month',
    amount: 1500,
    currency: 'usd',
    current_period_start: iso(-1),
    current_period_end: iso(29),
    cancel_at_period_end: false,
    canceled_at: null,
    ends_at: null,
    started_at: iso(-1),
    created_at: iso(-1),
    modified_at: iso(-1),
    customer: { external_id: userId.toString() },
    ...over,
  },
})

const tokenFor = (userId) => createAccessToken({ id: userId.toString() })
const authed = (req, userId) => req.set('Authorization', `Bearer ${tokenFor(userId)}`)
const newUser = async () => {
  const id = new ObjectId()
  await db.collection('users').insertOne({ _id: id, email: `${id}@test.com` })
  return id
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')

  app = express()
  app.locals.db = db
  // Same order as app.js: raw webhook first, then the JSON parser, then routes.
  app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), handleBillingWebhook)
  app.use(express.json())
  app.use('/api/billing', billingRoutes)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
  process.env.POLAR_ACCESS_TOKEN = 'tok'
  process.env.POLAR_WEBHOOK_SECRET = WEBHOOK_SECRET
  process.env.POLAR_PRO_PRODUCT_ID = PRO
  process.env.FRONTEND_URL = 'https://app.test'
  delete process.env.BILLING_ENFORCED

  await db.collection('subscriptions').drop().catch(() => {})
  await db.collection('users').deleteMany({})
  resetSubscriptionIndexes()
})

afterEach(() => {
  setPolarClient(null)
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
})

describe('POST /api/billing/webhook', () => {
  it('accepts a correctly signed subscription event and grants Pro', async () => {
    const user = await newUser()

    const res = await postWebhook(subscriptionEvent(user))
    expect(res.status).toBe(202)

    const status = await authed(request(app).get('/api/billing/subscription'), user)
    expect(status.body.data).toMatchObject({ plan: 'pro', entitled: true, status: 'active' })
  })

  it('rejects a bad signature with 403 and changes nothing', async () => {
    const user = await newUser()

    const res = await postWebhook(subscriptionEvent(user), {
      secret: `whsec_${Buffer.from('some-other-secret').toString('base64')}`,
    })

    expect(res.status).toBe(403)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('rejects a body tampered with after signing (e.g. status flipped)', async () => {
    const user = await newUser()
    const res = await postWebhook(subscriptionEvent(user, { status: 'active' }), { tamper: true })
    expect(res.status).toBe(403)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('rejects a replay of an old signed message (timestamp outside tolerance)', async () => {
    const user = await newUser()
    const res = await postWebhook(subscriptionEvent(user), { tsOffsetSec: -3600 })
    expect(res.status).toBe(403)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('rejects unsigned requests (no headers at all)', async () => {
    const user = await newUser()
    const res = await request(app)
      .post('/api/billing/webhook')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(subscriptionEvent(user)))
    expect(res.status).toBe(403)
  })

  it('FAILS CLOSED when no webhook secret is configured', async () => {
    delete process.env.POLAR_WEBHOOK_SECRET
    const user = await newUser()

    // Even a request "signed" with an empty/guessable secret must not be believed.
    const res = await postWebhook(subscriptionEvent(user))

    expect(res.status).toBe(503)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('400s a non-JSON content type rather than crashing', async () => {
    const res = await request(app)
      .post('/api/billing/webhook')
      .set('Content-Type', 'text/plain')
      .send('hello')
    expect(res.status).toBe(400)
  })

  it('acknowledges (202) events we do not act on, so Polar does not retry them', async () => {
    const res = await postWebhook({
      type: 'order.paid',
      timestamp: new Date().toISOString(),
      data: { id: 'ord_1' },
    })
    expect(res.status).toBe(202)
  })

  it('acknowledges (202) an event type the API version does not know', async () => {
    const res = await postWebhook({
      type: 'totally.unknown_event',
      timestamp: new Date().toISOString(),
      data: {},
    })
    expect(res.status).toBe(202)
  })

  it('acknowledges (202) a subscription for an unmapped customer instead of erroring', async () => {
    const res = await postWebhook({
      type: 'subscription.active',
      timestamp: new Date().toISOString(),
      data: { ...subscriptionEvent(new ObjectId()).data, customer: { external_id: null } },
    })
    expect(res.status).toBe(202)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('removes Pro when a later revoked event arrives', async () => {
    const user = await newUser()
    await postWebhook(subscriptionEvent(user, { modified_at: iso(-2) }))
    await postWebhook(
      subscriptionEvent(
        user,
        { status: 'canceled', ends_at: iso(-0.1), modified_at: iso(-1) },
        'subscription.revoked',
      ),
    )

    const status = await authed(request(app).get('/api/billing/subscription'), user)
    expect(status.body.data).toMatchObject({ plan: 'free', entitled: false, status: 'canceled' })
  })
})

describe('GET /api/billing/subscription', () => {
  it('requires authentication', async () => {
    expect((await request(app).get('/api/billing/subscription')).status).toBe(401)
  })

  it('reports free/none for a user who never subscribed, plus whether billing is live', async () => {
    const user = await newUser()
    const res = await authed(request(app).get('/api/billing/subscription'), user)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      configured: true,
      enforced: false,
      plan: 'free',
      status: 'none',
      entitled: false,
    })
  })

  it('reports configured:false when Polar credentials are absent', async () => {
    delete process.env.POLAR_ACCESS_TOKEN
    const user = await newUser()
    const res = await authed(request(app).get('/api/billing/subscription'), user)
    expect(res.body.data.configured).toBe(false)
  })

  it('never exposes provider ids or the raw document', async () => {
    const user = await newUser()
    await postWebhook(subscriptionEvent(user))
    const res = await authed(request(app).get('/api/billing/subscription'), user)

    const keys = Object.keys(res.body.data)
    expect(keys).not.toContain('polarSubscriptionId')
    expect(keys).not.toContain('polarCustomerId')
    expect(keys).not.toContain('_id')
  })
})

describe('POST /api/billing/checkout', () => {
  const fakePolar = () => ({
    checkouts: { create: vi.fn().mockResolvedValue({ url: 'https://polar.test/c/1' }) },
  })

  it('requires authentication', async () => {
    expect((await request(app).post('/api/billing/checkout').send({})).status).toBe(401)
  })

  it('returns a checkout URL for a free user', async () => {
    const user = await newUser()
    setPolarClient(fakePolar())

    const res = await authed(request(app).post('/api/billing/checkout').send({ plan: 'pro' }), user)

    expect(res.status).toBe(200)
    expect(res.body.data.url).toBe('https://polar.test/c/1')
  })

  it('works with an empty body (defaults to pro)', async () => {
    const user = await newUser()
    setPolarClient(fakePolar())
    const res = await authed(request(app).post('/api/billing/checkout'), user)
    expect(res.status).toBe(200)
  })

  it('rejects a client-supplied product id (the price is not the client\'s to choose)', async () => {
    const user = await newUser()
    const polar = fakePolar()
    setPolarClient(polar)

    const res = await authed(
      request(app).post('/api/billing/checkout').send({ plan: 'pro', productId: 'prod_cheap' }),
      user,
    )

    expect(res.status).toBe(400)
    expect(polar.checkouts.create).not.toHaveBeenCalled()
  })

  it('rejects an unknown plan', async () => {
    const user = await newUser()
    setPolarClient(fakePolar())
    const res = await authed(request(app).post('/api/billing/checkout').send({ plan: 'enterprise' }), user)
    expect(res.status).toBe(400)
  })

  it('503s with BILLING_NOT_CONFIGURED when Polar is not set up', async () => {
    delete process.env.POLAR_ACCESS_TOKEN
    const user = await newUser()
    const res = await authed(request(app).post('/api/billing/checkout').send({}), user)

    expect(res.status).toBe(503)
    expect(res.body).toMatchObject({ success: false, code: 'BILLING_NOT_CONFIGURED' })
  })

  it('409s ALREADY_SUBSCRIBED for a paying user', async () => {
    const user = await newUser()
    await postWebhook(subscriptionEvent(user))
    setPolarClient(fakePolar())

    const res = await authed(request(app).post('/api/billing/checkout').send({}), user)

    expect(res.status).toBe(409)
    expect(res.body.code).toBe('ALREADY_SUBSCRIBED')
  })

  // The SDK tags its transport errors with these names but does not export the
  // classes, so the controller matches on `name` (see PROVIDER_OUTAGE_ERRORS).
  it.each(['PolarNetworkError', 'PolarServerError', 'PolarRateLimitError'])(
    'maps a Polar %s to 502 without leaking its message',
    async (name) => {
      const user = await newUser()
      const err = Object.assign(new Error('connect ECONNREFUSED 10.0.0.5'), { name })
      setPolarClient({ checkouts: { create: vi.fn().mockRejectedValue(err) } })
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const res = await authed(request(app).post('/api/billing/checkout').send({}), user)

      expect(res.status).toBe(502)
      expect(res.body.code).toBe('PROVIDER_UNAVAILABLE')
      expect(JSON.stringify(res.body)).not.toContain('10.0.0.5')
      errSpy.mockRestore()
    },
  )

  it('maps an unexpected error to a generic 500 without leaking it', async () => {
    const user = await newUser()
    setPolarClient({
      checkouts: { create: vi.fn().mockRejectedValue(new Error('secret internal detail')) },
    })
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await authed(request(app).post('/api/billing/checkout').send({}), user)

    expect(res.status).toBe(500)
    expect(JSON.stringify(res.body)).not.toContain('secret internal detail')
    errSpy.mockRestore()
  })
})

describe('POST /api/billing/portal', () => {
  it('requires authentication', async () => {
    expect((await request(app).post('/api/billing/portal')).status).toBe(401)
  })

  it('returns the portal URL', async () => {
    const user = await newUser()
    setPolarClient({
      customerSessions: { create: vi.fn().mockResolvedValue({ customer_portal_url: 'https://polar.test/portal' }) },
    })
    const res = await authed(request(app).post('/api/billing/portal'), user)
    expect(res.status).toBe(200)
    expect(res.body.data.url).toBe('https://polar.test/portal')
  })

  it('409s NO_BILLING_ACCOUNT for someone who has never paid', async () => {
    const user = await newUser()
    setPolarClient({
      customerSessions: { create: vi.fn().mockRejectedValue(Object.assign(new Error('nf'), { statusCode: 404 })) },
    })
    const res = await authed(request(app).post('/api/billing/portal'), user)
    expect(res.status).toBe(409)
    expect(res.body.code).toBe('NO_BILLING_ACCOUNT')
  })
})

describe('POST /api/billing/sync', () => {
  it('requires authentication', async () => {
    expect((await request(app).post('/api/billing/sync')).status).toBe(401)
  })

  it('repairs state from Polar when the webhook has not arrived yet', async () => {
    const user = await newUser()
    setPolarClient({
      subscriptions: { list: vi.fn().mockResolvedValue({ items: [subscriptionEvent(user).data] }) },
    })

    const res = await authed(request(app).post('/api/billing/sync'), user)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({ plan: 'pro', entitled: true })
  })
})

describe('rate limiting', () => {
  it('limits provider-calling routes per user (and not other users)', async () => {
    const noisy = await newUser()
    const quiet = await newUser()
    setPolarClient({
      customerSessions: { create: vi.fn().mockResolvedValue({ customer_portal_url: 'https://polar.test/p' }) },
    })

    const statuses = []
    for (let i = 0; i < 12; i++) {
      statuses.push((await authed(request(app).post('/api/billing/portal'), noisy)).status)
    }
    expect(statuses.slice(0, 10).every((s) => s === 200)).toBe(true)
    expect(statuses.slice(10)).toEqual([429, 429])

    // A different user is unaffected by the noisy one.
    expect((await authed(request(app).post('/api/billing/portal'), quiet)).status).toBe(200)
  })
})
