import { describe, it, expect } from 'vitest'
import {
  isEntitled,
  describeEntitlement,
  normalizeSubscription,
  shouldReplace,
} from '../../modules/billing/lib/entitlements.js'
import {
  getBillingConfig,
  getPlanForProduct,
  isBillingConfigured,
} from '../../modules/billing/lib/billingConfig.js'

const NOW = new Date('2026-10-10T12:00:00Z')
const DAY = 24 * 60 * 60 * 1000
const inDays = (n) => new Date(NOW.getTime() + n * DAY)

const sub = (over = {}) => ({
  plan: 'pro',
  polarSubscriptionId: 'sub_1',
  status: 'active',
  currentPeriodEnd: inDays(20),
  endsAt: null,
  cancelAtPeriodEnd: false,
  polarModifiedAt: inDays(-1),
  polarCreatedAt: inDays(-30),
  ...over,
})

describe('isEntitled', () => {
  it('grants access for active and trialing', () => {
    expect(isEntitled(sub({ status: 'active' }), NOW)).toBe(true)
    expect(isEntitled(sub({ status: 'trialing' }), NOW)).toBe(true)
  })

  it('keeps access during past_due (Polar retries the card)', () => {
    expect(isEntitled(sub({ status: 'past_due' }), NOW)).toBe(true)
  })

  it.each(['canceled', 'unpaid', 'paused', 'incomplete', 'incomplete_expired'])(
    'denies access for %s',
    (status) => {
      expect(isEntitled(sub({ status }), NOW)).toBe(false)
    },
  )

  it('keeps access after cancelling until the paid period ends', () => {
    // Polar leaves the subscription active with cancel_at_period_end=true.
    expect(isEntitled(sub({ cancelAtPeriodEnd: true }), NOW)).toBe(true)
  })

  it('denies access once ends_at has passed', () => {
    expect(isEntitled(sub({ endsAt: inDays(-1) }), NOW)).toBe(false)
    expect(isEntitled(sub({ endsAt: inDays(1) }), NOW)).toBe(true)
  })

  it('is the safety net for a missed webhook: a long-expired period is not current', () => {
    // Still says "active" because we never heard it end, but the period ended 5 days ago.
    expect(isEntitled(sub({ currentPeriodEnd: inDays(-5) }), NOW)).toBe(false)
  })

  it('tolerates a short renewal delay (inside the grace window)', () => {
    expect(isEntitled(sub({ currentPeriodEnd: inDays(-1) }), NOW)).toBe(true)
  })

  it('denies access with no subscription', () => {
    expect(isEntitled(null, NOW)).toBe(false)
    expect(isEntitled(undefined, NOW)).toBe(false)
  })
})

describe('describeEntitlement', () => {
  it('reports free/none when there is no subscription', () => {
    expect(describeEntitlement(null, NOW)).toMatchObject({
      plan: 'free',
      status: 'none',
      entitled: false,
    })
  })

  it('reports pro for an entitled subscription', () => {
    expect(describeEntitlement(sub(), NOW)).toMatchObject({
      plan: 'pro',
      entitled: true,
      status: 'active',
    })
  })

  it('falls back to free when the stored plan is no longer entitled', () => {
    const out = describeEntitlement(sub({ status: 'canceled' }), NOW)
    expect(out.plan).toBe('free')
    expect(out.entitled).toBe(false)
    expect(out.status).toBe('canceled')
  })

  it('surfaces a pending cancellation so the UI can say "ends on…"', () => {
    const out = describeEntitlement(sub({ cancelAtPeriodEnd: true }), NOW)
    expect(out).toMatchObject({ plan: 'pro', entitled: true, cancelAtPeriodEnd: true })
  })
})

describe('normalizeSubscription', () => {
  const polarSub = {
    id: 'sub_9',
    customer_id: 'cus_9',
    product_id: 'prod_9',
    status: 'active',
    recurring_interval: 'month',
    amount: 1500,
    currency: 'usd',
    current_period_start: '2026-10-01T00:00:00Z',
    current_period_end: '2026-11-01T00:00:00Z',
    cancel_at_period_end: true,
    canceled_at: '2026-10-05T00:00:00Z',
    ends_at: null,
    started_at: '2026-10-01T00:00:00Z',
    created_at: '2026-10-01T00:00:00Z',
    modified_at: null,
  }

  it('maps snake_case Polar fields to our camelCase document with real Dates', () => {
    const out = normalizeSubscription(polarSub, 'pro')
    expect(out).toMatchObject({
      plan: 'pro',
      polarSubscriptionId: 'sub_9',
      polarCustomerId: 'cus_9',
      productId: 'prod_9',
      status: 'active',
      interval: 'month',
      cancelAtPeriodEnd: true,
    })
    expect(out.currentPeriodEnd).toBeInstanceOf(Date)
    expect(out.endsAt).toBeNull()
  })

  it('uses created_at as the ordering key while modified_at is still null', () => {
    const out = normalizeSubscription(polarSub, 'pro')
    expect(out.polarModifiedAt).toEqual(new Date('2026-10-01T00:00:00Z'))
  })
})

describe('shouldReplace', () => {
  it('stores the first subscription', () => {
    expect(shouldReplace(null, sub(), NOW)).toBe(true)
  })

  it('applies a newer event for the same subscription', () => {
    const existing = sub({ polarModifiedAt: inDays(-2) })
    const incoming = sub({ polarModifiedAt: inDays(-1) })
    expect(shouldReplace(existing, incoming, NOW)).toBe(true)
  })

  it('rejects an OLDER event for the same subscription (out-of-order delivery)', () => {
    const existing = sub({ polarModifiedAt: inDays(-1), status: 'canceled' })
    const incoming = sub({ polarModifiedAt: inDays(-3), status: 'active' })
    expect(shouldReplace(existing, incoming, NOW)).toBe(false)
  })

  it('applies an identical timestamp, so a replayed event is a harmless no-op', () => {
    const existing = sub()
    expect(shouldReplace(existing, { ...existing }, NOW)).toBe(true)
  })

  it('lets a live re-subscription replace a dead one', () => {
    const dead = sub({ polarSubscriptionId: 'old', status: 'canceled' })
    const fresh = sub({ polarSubscriptionId: 'new', status: 'active' })
    expect(shouldReplace(dead, fresh, NOW)).toBe(true)
  })

  it('does not let a dead subscription replace a live one', () => {
    const live = sub({ polarSubscriptionId: 'new', status: 'active' })
    const dead = sub({ polarSubscriptionId: 'old', status: 'canceled' })
    expect(shouldReplace(live, dead, NOW)).toBe(false)
  })

  it('prefers the newer of two dead subscriptions', () => {
    const older = sub({ polarSubscriptionId: 'a', status: 'canceled', polarCreatedAt: inDays(-60) })
    const newer = sub({ polarSubscriptionId: 'b', status: 'canceled', polarCreatedAt: inDays(-10) })
    expect(shouldReplace(older, newer, NOW)).toBe(true)
    expect(shouldReplace(newer, older, NOW)).toBe(false)
  })
})

describe('billing config', () => {
  it('defaults to sandbox and not-enforced (the safe choices)', () => {
    const cfg = getBillingConfig({})
    expect(cfg.environment).toBe('sandbox')
    expect(cfg.enforced).toBe(false)
  })

  it('only goes to production on the exact string "production"', () => {
    expect(getBillingConfig({ POLAR_ENVIRONMENT: 'production' }).environment).toBe('production')
    expect(getBillingConfig({ POLAR_ENVIRONMENT: 'Production ' }).environment).toBe('sandbox')
    expect(getBillingConfig({ POLAR_ENVIRONMENT: 'prod' }).environment).toBe('sandbox')
  })

  it('only enforces on the exact string "true"', () => {
    expect(getBillingConfig({ BILLING_ENFORCED: 'true' }).enforced).toBe(true)
    expect(getBillingConfig({ BILLING_ENFORCED: '1' }).enforced).toBe(false)
  })

  it('needs both a token and a product to count as configured', () => {
    expect(isBillingConfigured(getBillingConfig({}))).toBe(false)
    expect(isBillingConfigured(getBillingConfig({ POLAR_ACCESS_TOKEN: 't' }))).toBe(false)
    expect(
      isBillingConfigured(getBillingConfig({ POLAR_ACCESS_TOKEN: 't', POLAR_PRO_PRODUCT_ID: 'p' })),
    ).toBe(true)
  })

  it.each(['...', 'whsec_...', '<paste token here>', '   ', ''])(
    'treats the placeholder %j as unset (a half-filled .env is not "configured")',
    (value) => {
      const cfg = getBillingConfig({
        POLAR_ACCESS_TOKEN: value,
        POLAR_WEBHOOK_SECRET: value,
        POLAR_PRO_PRODUCT_ID: 'prod_x',
      })
      expect(cfg.accessToken).toBe('')
      expect(cfg.webhookSecret).toBe('')
      expect(isBillingConfigured(cfg)).toBe(false)
    },
  )

  it('keeps a real-looking value intact (and trims it)', () => {
    const cfg = getBillingConfig({ POLAR_ACCESS_TOKEN: '  polar_oat_abc123  ' })
    expect(cfg.accessToken).toBe('polar_oat_abc123')
  })

  it('maps only the configured product to a plan; unknown products grant nothing', () => {
    const cfg = getBillingConfig({ POLAR_PRO_PRODUCT_ID: 'prod_pro' })
    expect(getPlanForProduct('prod_pro', cfg)).toBe('pro')
    expect(getPlanForProduct('prod_other', cfg)).toBeNull()
    expect(getPlanForProduct(undefined, cfg)).toBeNull()
    expect(getPlanForProduct('', getBillingConfig({}))).toBeNull()
  })

  it('strips a trailing slash from the frontend URL', () => {
    expect(getBillingConfig({ FRONTEND_URL: 'https://app.test/' }).frontendUrl).toBe('https://app.test')
  })
})
