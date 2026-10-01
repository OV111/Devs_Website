/**
 * Integration tests for the billing services against a real MongoDB
 * (mongodb-memory-server) with a FAKE Polar client. Polar itself is never
 * called: what is under test is our reaction to what it would send — ordering,
 * replays, re-subscription, unmapped customers, and the gate.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'
import { getBillingConfig } from '../../modules/billing/lib/billingConfig.js'
import {
  applyPolarSubscription,
  getEntitlement,
  getSubscription,
  resetSubscriptionIndexes,
  syncSubscription,
} from '../../modules/billing/services/subscriptionService.js'
import {
  createCheckoutSession,
  createPortalSession,
} from '../../modules/billing/services/checkoutService.js'
import { canAccess, getUserPlan } from '../../modules/billing/services/featureGateService.js'

let mongod
let client
let db

const PRO = 'prod_pro'
const USER = new ObjectId()
const CONFIG = getBillingConfig({
  POLAR_ACCESS_TOKEN: 'tok',
  POLAR_PRO_PRODUCT_ID: PRO,
  FRONTEND_URL: 'https://app.test',
})

const DAY = 24 * 60 * 60 * 1000
const iso = (offsetDays) => new Date(Date.now() + offsetDays * DAY).toISOString()

const polarSub = (over = {}) => ({
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
  customer: { external_id: USER.toString(), email: 'u@test.com' },
  ...over,
})

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
  await db.collection('subscriptions').drop().catch(() => {})
  await db.collection('users').deleteMany({})
  resetSubscriptionIndexes()
})

describe('applyPolarSubscription', () => {
  it('stores a subscription and grants Pro', async () => {
    const res = await applyPolarSubscription(db, polarSub(), CONFIG)
    expect(res).toEqual({ applied: true, reason: 'inserted' })

    const ent = await getEntitlement(db, USER)
    expect(ent).toMatchObject({ plan: 'pro', entitled: true, status: 'active' })
  })

  it('keeps ONE document per user across many events', async () => {
    await applyPolarSubscription(db, polarSub({ modified_at: iso(-3) }), CONFIG)
    await applyPolarSubscription(db, polarSub({ modified_at: iso(-2) }), CONFIG)
    await applyPolarSubscription(db, polarSub({ modified_at: iso(-1) }), CONFIG)
    expect(await db.collection('subscriptions').countDocuments({ userId: USER })).toBe(1)
  })

  it('ignores an out-of-order OLDER event (a late "active" must not undo a cancel)', async () => {
    await applyPolarSubscription(
      db,
      polarSub({ status: 'canceled', modified_at: iso(-1) }),
      CONFIG,
    )
    const late = await applyPolarSubscription(
      db,
      polarSub({ status: 'active', modified_at: iso(-5) }),
      CONFIG,
    )
    expect(late).toEqual({ applied: false, reason: 'stale' })
    expect((await getEntitlement(db, USER)).plan).toBe('free')
  })

  it('is idempotent: replaying the same event changes nothing', async () => {
    const event = polarSub()
    await applyPolarSubscription(db, event, CONFIG)
    const before = await getSubscription(db, USER)
    await applyPolarSubscription(db, event, CONFIG)
    const after = await getSubscription(db, USER)

    expect(after.status).toBe(before.status)
    expect(await db.collection('subscriptions').countDocuments({})).toBe(1)
  })

  it('removes access when the subscription is canceled/revoked', async () => {
    await applyPolarSubscription(db, polarSub({ modified_at: iso(-2) }), CONFIG)
    await applyPolarSubscription(
      db,
      polarSub({ status: 'canceled', ends_at: iso(-0.1), modified_at: iso(-1) }),
      CONFIG,
    )
    expect(await getUserPlan(db, USER)).toBe('free')
  })

  it('keeps Pro until period end when cancelled at period end', async () => {
    await applyPolarSubscription(
      db,
      polarSub({ cancel_at_period_end: true, canceled_at: iso(-1) }),
      CONFIG,
    )
    const ent = await getEntitlement(db, USER)
    expect(ent).toMatchObject({ plan: 'pro', entitled: true, cancelAtPeriodEnd: true })
  })

  it('lets a user re-subscribe after cancelling (new subscription id wins)', async () => {
    await applyPolarSubscription(
      db,
      polarSub({ id: 'sub_old', status: 'canceled', ends_at: iso(-20), created_at: iso(-60), modified_at: iso(-20) }),
      CONFIG,
    )
    await applyPolarSubscription(
      db,
      polarSub({ id: 'sub_new', status: 'active', created_at: iso(-1), modified_at: iso(-1) }),
      CONFIG,
    )
    const stored = await getSubscription(db, USER)
    expect(stored.polarSubscriptionId).toBe('sub_new')
    expect((await getEntitlement(db, USER)).plan).toBe('pro')
  })

  it('does not apply an event for a product we do not sell', async () => {
    const res = await applyPolarSubscription(db, polarSub({ product_id: 'prod_mystery' }), CONFIG)
    expect(res).toEqual({ applied: false, reason: 'unknown-product' })
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it.each([
    ['missing external_id', { customer: { email: 'x@y.z' } }],
    ['null external_id', { customer: { external_id: null } }],
    ['non-ObjectId external_id', { customer: { external_id: 'not-an-object-id' } }],
  ])('skips an unmapped customer: %s', async (_label, over) => {
    const res = await applyPolarSubscription(db, polarSub(over), CONFIG)
    expect(res).toEqual({ applied: false, reason: 'no-external-id' })
    expect(await db.collection('subscriptions').countDocuments({})).toBe(0)
  })

  it('survives concurrent events for the same user without duplicating or losing the newest', async () => {
    const events = Array.from({ length: 8 }, (_, i) =>
      polarSub({ modified_at: iso(-10 + i), status: i === 7 ? 'canceled' : 'active', ends_at: i === 7 ? iso(-0.1) : null }),
    )
    // Fire them all at once, in shuffled order.
    await Promise.all([...events].sort(() => Math.random() - 0.5).map((e) => applyPolarSubscription(db, e, CONFIG)))

    expect(await db.collection('subscriptions').countDocuments({ userId: USER })).toBe(1)
    // The newest event (i=7, canceled) must be what is stored, whatever the arrival order.
    expect((await getSubscription(db, USER)).status).toBe('canceled')
  })
})

describe('syncSubscription', () => {
  it('pulls from Polar by external id and applies the result', async () => {
    const polar = { subscriptions: { list: vi.fn().mockResolvedValue({ items: [polarSub()] }) } }

    const res = await syncSubscription(db, polar, CONFIG, USER)

    expect(polar.subscriptions.list).toHaveBeenCalledWith({
      external_customer_id: USER.toString(),
      limit: 10,
    })
    expect(res).toEqual({ checked: 1, applied: 1 })
    expect((await getEntitlement(db, USER)).plan).toBe('pro')
  })

  it('cannot move state backwards (goes through the same stale guard)', async () => {
    await applyPolarSubscription(db, polarSub({ status: 'canceled', ends_at: iso(-1), modified_at: iso(-1) }), CONFIG)
    const polar = {
      subscriptions: { list: vi.fn().mockResolvedValue({ items: [polarSub({ status: 'active', modified_at: iso(-9) })] }) },
    }
    await syncSubscription(db, polar, CONFIG, USER)
    expect((await getEntitlement(db, USER)).plan).toBe('free')
  })

  it('handles a user who has never subscribed', async () => {
    const polar = { subscriptions: { list: vi.fn().mockResolvedValue({ items: [] }) } }
    expect(await syncSubscription(db, polar, CONFIG, USER)).toEqual({ checked: 0, applied: 0 })
    expect((await getEntitlement(db, USER)).plan).toBe('free')
  })
})

describe('createCheckoutSession', () => {
  const fakePolar = () => ({
    checkouts: { create: vi.fn().mockResolvedValue({ url: 'https://polar.test/checkout/abc' }) },
  })

  it('sends the server-side product, our user id as the identity link, and the redirect URLs', async () => {
    await db.collection('users').insertOne({ _id: USER, email: 'u@test.com' })
    const polar = fakePolar()

    const out = await createCheckoutSession(db, polar, CONFIG, USER)

    expect(out).toEqual({ url: 'https://polar.test/checkout/abc' })
    expect(polar.checkouts.create).toHaveBeenCalledWith({
      products: [PRO],
      external_customer_id: USER.toString(),
      customer_email: 'u@test.com',
      metadata: { userId: USER.toString() },
      success_url: 'https://app.test/billing?checkout=success',
      return_url: 'https://app.test/pricing',
    })
  })

  it('refuses a second subscription (would double-charge) with ALREADY_SUBSCRIBED', async () => {
    await applyPolarSubscription(db, polarSub(), CONFIG)
    const polar = fakePolar()

    await expect(createCheckoutSession(db, polar, CONFIG, USER)).rejects.toMatchObject({
      status: 409,
      code: 'ALREADY_SUBSCRIBED',
    })
    expect(polar.checkouts.create).not.toHaveBeenCalled()
  })

  it('allows checkout again after a subscription has ended', async () => {
    await applyPolarSubscription(db, polarSub({ status: 'canceled', ends_at: iso(-2) }), CONFIG)
    const polar = fakePolar()
    await expect(createCheckoutSession(db, polar, CONFIG, USER)).resolves.toHaveProperty('url')
  })
})

describe('createPortalSession', () => {
  it('returns the hosted portal URL', async () => {
    const polar = {
      customerSessions: { create: vi.fn().mockResolvedValue({ customer_portal_url: 'https://polar.test/portal' }) },
    }
    const out = await createPortalSession(polar, CONFIG, USER)

    expect(out).toEqual({ url: 'https://polar.test/portal' })
    expect(polar.customerSessions.create).toHaveBeenCalledWith({
      external_customer_id: USER.toString(),
      return_url: 'https://app.test/billing',
    })
  })

  it('turns Polar "no such customer" into a friendly NO_BILLING_ACCOUNT', async () => {
    const polar = {
      customerSessions: { create: vi.fn().mockRejectedValue(Object.assign(new Error('nf'), { statusCode: 404 })) },
    }
    await expect(createPortalSession(polar, CONFIG, USER)).rejects.toMatchObject({
      status: 409,
      code: 'NO_BILLING_ACCOUNT',
    })
  })

  it('does not swallow other Polar failures', async () => {
    const boom = Object.assign(new Error('upstream'), { statusCode: 500 })
    const polar = { customerSessions: { create: vi.fn().mockRejectedValue(boom) } }
    await expect(createPortalSession(polar, CONFIG, USER)).rejects.toBe(boom)
  })
})

describe('featureGate', () => {
  it('allows everything while billing is NOT enforced', async () => {
    const cfg = getBillingConfig({ BILLING_ENFORCED: 'false' })
    expect(await canAccess(db, USER, 'pro', cfg)).toBe(true)
  })

  it('blocks a free user from a pro feature once enforced', async () => {
    const cfg = getBillingConfig({ BILLING_ENFORCED: 'true' })
    expect(await canAccess(db, USER, 'pro', cfg)).toBe(false)
    expect(await canAccess(db, USER, 'free', cfg)).toBe(true)
  })

  it('lets a paying user through once enforced', async () => {
    const cfg = getBillingConfig({ BILLING_ENFORCED: 'true' })
    await applyPolarSubscription(db, polarSub(), CONFIG)
    expect(await canAccess(db, USER, 'pro', cfg)).toBe(true)
  })

  it('stops letting a user through the moment their subscription ends', async () => {
    const cfg = getBillingConfig({ BILLING_ENFORCED: 'true' })
    await applyPolarSubscription(db, polarSub({ modified_at: iso(-2) }), CONFIG)
    await applyPolarSubscription(
      db,
      polarSub({ status: 'canceled', ends_at: iso(-0.1), modified_at: iso(-1) }),
      CONFIG,
    )
    expect(await canAccess(db, USER, 'pro', cfg)).toBe(false)
  })
})
