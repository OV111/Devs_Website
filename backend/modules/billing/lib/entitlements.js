/**
 * Pure subscription logic — no database, no Polar client, no clock except the
 * `now` you pass in. Everything with a business rule in it lives here so it can
 * be unit-tested exhaustively; the services around it only move data.
 */

// Polar statuses that mean "the customer is paying". `past_due` is included on
// purpose: a failed card is retried by Polar's own dunning, and cutting a paying
// learner off on the first failure is a worse outcome than a few days of grace.
// If dunning gives up, Polar moves the subscription to `canceled`/`unpaid` and
// the next event removes access.
const ENTITLED_STATUSES = new Set(["active", "trialing", "past_due"]);

// Safety net for a missed webhook. A subscription whose paid period ended more
// than this long ago cannot still be current, even if we never heard it ended.
// Three days covers normal retry delays without leaving access open forever.
const PERIOD_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

const toDate = (value) => (value ? new Date(value) : null);

/**
 * Does this stored subscription currently grant access?
 *
 * `cancelAtPeriodEnd` is deliberately NOT a reason to deny access: Polar keeps
 * the subscription `active` until the period ends, and the customer paid for it.
 */
export const isEntitled = (sub, now = new Date()) => {
  if (!sub || !ENTITLED_STATUSES.has(sub.status)) return false;

  if (sub.endsAt && new Date(sub.endsAt) <= now) return false;

  if (sub.currentPeriodEnd) {
    const cutoff = new Date(sub.currentPeriodEnd).getTime() + PERIOD_GRACE_MS;
    if (cutoff <= now.getTime()) return false;
  }
  return true;
};

/** What the API and the UI see. Absence of a subscription is simply "free". */
export const describeEntitlement = (sub, now = new Date()) => {
  if (!sub) {
    return {
      plan: "free",
      status: "none",
      entitled: false,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      endsAt: null,
      interval: null,
    };
  }

  const entitled = isEntitled(sub, now);
  return {
    plan: entitled ? sub.plan : "free",
    status: sub.status,
    entitled,
    cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
    currentPeriodEnd: sub.currentPeriodEnd ?? null,
    endsAt: sub.endsAt ?? null,
    interval: sub.interval ?? null,
  };
};

/**
 * Polar subscription payload -> the document we store.
 *
 * Only the fields we actually use are kept. Copying the whole payload would tie
 * our schema to Polar's API version, which is date-versioned and changes.
 */
export const normalizeSubscription = (polarSub, plan) => ({
  plan,
  polarSubscriptionId: polarSub.id,
  polarCustomerId: polarSub.customer_id,
  productId: polarSub.product_id,
  status: polarSub.status,
  interval: polarSub.recurring_interval ?? null,
  amount: polarSub.amount ?? null,
  currency: polarSub.currency ?? null,
  currentPeriodStart: toDate(polarSub.current_period_start),
  currentPeriodEnd: toDate(polarSub.current_period_end),
  cancelAtPeriodEnd: Boolean(polarSub.cancel_at_period_end),
  canceledAt: toDate(polarSub.canceled_at),
  endsAt: toDate(polarSub.ends_at),
  startedAt: toDate(polarSub.started_at),
  // The ordering key. modified_at is null until a subscription is first changed,
  // so created_at stands in for it.
  polarModifiedAt: toDate(polarSub.modified_at ?? polarSub.created_at),
  polarCreatedAt: toDate(polarSub.created_at),
});

/**
 * Should an incoming subscription overwrite what we have stored?
 *
 * One document per user means this is the arbiter when events arrive late, twice,
 * or out of order (webhooks guarantee none of those):
 *
 *   - same subscription  -> apply only if it is not older than what we hold.
 *     Equal timestamps apply, which makes a replayed event a harmless no-op.
 *   - different subscription (user re-subscribed after cancelling, or has two)
 *     -> an entitled one wins over a dead one; otherwise the newer one wins.
 */
export const shouldReplace = (existing, incoming, now = new Date()) => {
  if (!existing) return true;

  if (existing.polarSubscriptionId === incoming.polarSubscriptionId) {
    return (
      (incoming.polarModifiedAt?.getTime() ?? 0) >=
      (existing.polarModifiedAt?.getTime() ?? 0)
    );
  }

  const incomingLive = isEntitled(incoming, now);
  const existingLive = isEntitled(existing, now);
  if (incomingLive !== existingLive) return incomingLive;

  return (
    (incoming.polarCreatedAt?.getTime() ?? 0) >=
    (existing.polarCreatedAt?.getTime() ?? 0)
  );
};
