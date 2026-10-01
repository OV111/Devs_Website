import { ObjectId } from "mongodb";

/**
 * Daily cap on server-graded submissions.
 *
 * Every submission runs untrusted code on our CPU, so an unlimited endpoint is
 * an easy way to burn the server (Render free tier: 0.1 CPU). The in-browser
 * "Run" is free for us and stays unlimited; only the authoritative Submit
 * counts. Applied for everyone regardless of BILLING_ENFORCED — this is abuse
 * protection first and a plan perk second.
 */
export const DAILY_SUBMISSIONS = { free: 30, pro: 300 };

const COLLECTION = "submission_usage";
const DAY_MS = 24 * 60 * 60 * 1000;

export const utcDayKey = (now) => now.toISOString().slice(0, 10);

export const nextUtcMidnight = (now) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

let indexesReady = null;
const ensureIndexes = (db) => {
  indexesReady ??= Promise.all([
    db.collection(COLLECTION).createIndex({ userId: 1, day: 1 }, { unique: true }),
    // Yesterday's counters are worthless; let Mongo delete them.
    db.collection(COLLECTION).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).catch((err) => {
    indexesReady = null;
    throw err;
  });
  return indexesReady;
};

/** Test seam: each test database needs its own indexes. */
export const resetSubmissionQuotaIndexes = () => {
  indexesReady = null;
};

/**
 * Atomically use one submission from today's allowance.
 *
 * One conditional upsert does the check and the increment together:
 *   - no counter yet       -> inserted with count 1
 *   - count below the cap  -> incremented
 *   - count at the cap     -> the filter doesn't match, so the upsert tries to
 *                             INSERT a second {userId, day} row, which the unique
 *                             index rejects. That rejection IS "limit reached".
 * A read-then-write would let parallel requests all see "29" and all pass.
 */
export const consumeSubmission = async (db, userId, plan = "free", now = new Date()) => {
  await ensureIndexes(db);

  const limit = DAILY_SUBMISSIONS[plan] ?? DAILY_SUBMISSIONS.free;
  const day = utcDayKey(now);
  const resetAt = nextUtcMidnight(now);

  try {
    const doc = await db.collection(COLLECTION).findOneAndUpdate(
      { userId: new ObjectId(userId), day, count: { $lt: limit } },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date(resetAt.getTime() + DAY_MS) },
      },
      { upsert: true, returnDocument: "after" },
    );
    return { allowed: true, used: doc.count, limit, resetAt };
  } catch (err) {
    if (err?.code === 11000) return { allowed: false, used: limit, limit, resetAt };
    throw err;
  }
};

/** Human message for the 429, shown as-is in the arena's result panel. */
export const limitMessage = ({ limit, resetAt }, now = new Date()) => {
  const hours = Math.max(1, Math.ceil((resetAt - now) / (60 * 60 * 1000)));
  return (
    `You've used all ${limit} graded submissions for today. ` +
    `They reset in about ${hours}h. "Run" in your browser is still unlimited.`
  );
};
