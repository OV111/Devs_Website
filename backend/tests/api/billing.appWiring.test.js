/**
 * End-to-end wiring test: the REAL `createApp()` from app.js, an in-memory
 * MongoDB, and payloads signed with the same HMAC scheme Polar uses.
 *
 * billing.contract.test.js mounts the webhook and router itself, so it cannot
 * notice if app.js registers them in the wrong ORDER. That is the one mistake
 * that breaks webhooks silently in production: put `app.use(express.json())`
 * before the raw-body webhook route and every signature check fails, because the
 * body has already been parsed. This test fails if that ever happens.
 *
 * No network: Polar itself is never called, only its signature format is used.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { createApp } from '../../app.js'
import { resetSubscriptionIndexes } from '../../modules/billing/services/subscriptionService.js'
import { createAccessToken } from '../../utils/jwtToken.js'

let mongod
let client
let db
let app

const PRO = 'prod_pro_wiring'
const WEBHOOK_SECRET = `whsec_${Buffer.from('wiring-test-secret-0123456789').toString('base64')}`
const ENV_KEYS = ['POLAR_ACCESS_TOKEN', 'POLAR_WEBHOOK_SECRET', 'POLAR_PRO_PRODUCT_ID', 'MAINTENANCE_MODE']
let savedEnv

const DAY = 24 * 60 * 60 * 1000
const iso = (d) => new Date(Date.now() + d * DAY).toISOString()

const signedWebhook = (event) => {
  const body = JSON.stringify(event)
  const id = `msg_${crypto.randomUUID()}`
  const ts = String(Math.floor(Date.now() / 1000))
  const key = Buffer.from(WEBHOOK_SECRET.slice('whsec_'.length), 'base64')
  const signature = 'v1,' + crypto.createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64')
  return request(app)
    .post('/api/billing/webhook')
    .set('Content-Type', 'application/json')
    .set('webhook-id', id)
    .set('webhook-timestamp', ts)
    .set('webhook-signature', signature)
    .send(body)
}

const subscriptionEvent = (userId, over = {}, type = 'subscription.active') => ({
  type,
  timestamp: new Date().toISOString(),
  data: {
    id: 'sub_wiring',
    customer_id: 'cus_wiring',
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

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('DevsBlog')
  app = createApp(db)
})

afterAll(async () => {
  await client.close()
  await mongod.stop()
})

beforeEach(async () => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]))
  process.env.POLAR_ACCESS_TOKEN = 'polar_oat_wiring_test'
  process.env.POLAR_WEBHOOK_SECRET = WEBHOOK_SECRET
  process.env.POLAR_PRO_PRODUCT_ID = PRO
  delete process.env.MAINTENANCE_MODE

  await db.collection('subscriptions').drop().catch(() => {})
  await db.collection('users').deleteMany({})
  resetSubscriptionIndexes()
})

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k]
    else process.env[k] = savedEnv[k]
  }
})

describe('billing wiring in the real app', () => {
  it('a signed webhook through app.js grants Pro, visible via the authenticated status route', async () => {
    const userId = new ObjectId()
    await db.collection('users').insertOne({ _id: userId, email: 'e2e@test.com' })

    const hook = await signedWebhook(subscriptionEvent(userId))
    expect(hook.status).toBe(202)

    const token = createAccessToken({ id: userId.toString() })
    const status = await request(app)
      .get('/api/billing/subscription')
      .set('Authorization', `Bearer ${token}`)

    expect(status.status).toBe(200)
    expect(status.body.data).toMatchObject({
      configured: true,
      plan: 'pro',
      entitled: true,
      status: 'active',
    })
  })

  it('a signed cancellation through app.js removes Pro again', async () => {
    const userId = new ObjectId()
    await signedWebhook(subscriptionEvent(userId, { modified_at: iso(-2) }))
    const revoke = await signedWebhook(
      subscriptionEvent(userId, { status: 'canceled', ends_at: iso(-0.1), modified_at: iso(-1) }, 'subscription.revoked'),
    )
    expect(revoke.status).toBe(202)

    const token = createAccessToken({ id: userId.toString() })
    const status = await request(app)
      .get('/api/billing/subscription')
      .set('Authorization', `Bearer ${token}`)
    expect(status.body.data).toMatchObject({ plan: 'free', entitled: false })
  })

  it('rejects a forged webhook (signed with the wrong secret) and stores nothing', async () => {
    const userId = new ObjectId()
    const body = JSON.stringify(subscriptionEvent(userId))
    const id = 'msg_forged'
    const ts = String(Math.floor(Date.now() / 1000))
    const wrongKey = Buffer.from('attacker-guess')
    const sig = 'v1,' + crypto.createHmac('sha256', wrongKey).update(`${id}.${ts}.${body}`).digest('base64')

    const res = await request(app)
      .post('/api/billing/webhook')
      .set('Content-Type', 'application/json')
      .set('webhook-id', id)
      .set('webhook-timestamp', ts)
      .set('webhook-signature', sig)
      .send(body)

    expect(res.status).toBe(403)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('does not let the JSON body parser consume the webhook body (registration order)', async () => {
    // If express.json() ran first, the raw body would be gone and a perfectly
    // valid signature would be rejected. A 202 here proves the order is right.
    const res = await signedWebhook(subscriptionEvent(new ObjectId()))
    expect(res.status).toBe(202)
  })

  it('keeps the rest of the API on the JSON parser (billing routes still need auth)', async () => {
    const res = await request(app).post('/api/billing/checkout').send({ plan: 'pro' })
    expect(res.status).toBe(401)
  })
})
