import { ObjectId } from "mongodb";
import { getPlanForProduct } from "../lib/billingConfig.js";
import {
  describeEntitlement,
  normalizeSubscription,
  shouldReplace,
} from "../lib/entitlements.js";

const COLLECTION = "subscriptions";

// How many times to retry a compare-and-swap that lost a race. Two webhooks for
// one user landing in the same millisecond is rare; three attempts is plenty.
const MAX_SWAP_ATTEMPTS = 3;

let indexesReady = null;

/** Created once per process, lazily — there is no startup hook to hang it on. */
const ensureIndexes = (db) => {
  indexesReady ??= db
    .collection(COLLECTION)
    .createIndex({ userId: 1 }, { unique: true })
    .catch((err) => {
      indexesReady = null; // allow a retry on the next call
      throw err;
    });
  return indexesReady;
};

/** Test seam: each test database needs its own index creation. */
export const resetSubscriptionIndexes = () => {
  indexesReady = null;
};

export const getSubscription = (db, userId) =>
  db.collection(COLLECTION).findOne({ userId: new ObjectId(userId) });

/** The shape the API and UI consume (never the raw document). */
export const getEntitlement = async (db, userId, now = new Date()) =>
  describeEntitlement(await getSubscription(db, userId), now);

/**
 * Store a Polar subscription for the user it belongs to.
 *
 * Returns `{ applied, reason }` instead of throwing for the expected "nothing to
 * do" cases (unmapped customer, unknown product, stale event). A webhook handler
 * that threw on those would make Polar retry an event we can never process, and
 * ten failures disable the endpoint.
 *
 * Race safety: the write is a compare-and-swap on `polarModifiedAt`. Reading,
 * deciding and then blindly writing would let two concurrent events for one user
 * clobber each other; the swap makes the loser re-read and re-decide.
 */
export const applyPolarSubscription = async (db, polarSub, config, now = new Date()) => {
  const externalId = polarSub?.customer?.external_id;
  if (!externalId || !ObjectId.isValid(externalId)) {
    return { applied: false, reason: "no-external-id" };
  }

  const plan = getPlanForProduct(polarSub.product_id, config);
  if (!plan) return { applied: false, reason: "unknown-product" };

  await ensureIndexes(db);

  const userId = new ObjectId(externalId);
  const incoming = normalizeSubscription(polarSub, plan);
  const col = db.collection(COLLECTION);

  for (let attempt = 0; attempt < MAX_SWAP_ATTEMPTS; attempt++) {
    const existing = await col.findOne({ userId });

    if (!existing) {
      try {
        await col.insertOne({
          userId,
          ...incoming,
          createdAt: now,
          updatedAt: now,
        });
        return { applied: true, reason: "inserted" };
      } catch (err) {
        if (err?.code === 11000) continue; // lost the insert race; re-read
        throw err;
      }
    }

    if (!shouldReplace(existing, incoming, now)) {
      return { applied: false, reason: "stale" };
    }

    const result = await col.updateOne(
      { _id: existing._id, polarModifiedAt: existing.polarModifiedAt },
      { $set: { ...incoming, updatedAt: now } },
    );
    if (result.matchedCount === 1) return { applied: true, reason: "updated" };
    // matchedCount 0: someone changed it between our read and write. Go again.
  }

  return { applied: false, reason: "contention" };
};

/**
 * Pull the user's subscriptions straight from Polar and apply them.
 *
 * Two jobs: closes the gap on the checkout success page (the redirect can beat
 * the webhook), and repairs state after a missed webhook. It goes through the
 * same stale-guarded path as webhooks, so it can never move state backwards.
 */
export const syncSubscription = async (db, polar, config, userId) => {
  const page = await polar.subscriptions.list({
    external_customer_id: String(userId),
    limit: 10,
  });

  let applied = 0;
  for (const sub of page.items ?? []) {
    const result = await applyPolarSubscription(db, sub, config);
    if (result.applied) applied += 1;
  }
  return { checked: page.items?.length ?? 0, applied };
};
