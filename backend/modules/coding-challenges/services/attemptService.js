/**
 * Challenge attempt layer.
 *
 * An attempt is the user's live session on one challenge: the autosaved draft,
 * which hints they have paid for, and (from a later stage) the last run result.
 *
 * Two rules drive everything in here:
 *  1. Ownership is part of every filter, never a separate read-then-compare.
 *     A miss is reported as 404 so we never confirm that someone else's attempt
 *     exists.
 *  2. Hint text is the paid product. It is read from `challenges` only inside
 *     revealHintService and never projected onto an attempt response, matching
 *     the projection discipline in challengeService.js.
 */

import { ObjectId } from "mongodb";

const COL = "challenge_attempts";
const CHALLENGES = "challenges";
const PROGRESS = "userProgress";

// One attempt per (user, challenge) — the unique index is what makes the
// create/resume path safe under a double POST, not the findOne before it.
let indexesReady = null;
const ensureIndexes = (db) => {
  indexesReady ??= db
    .collection(COL)
    .createIndex({ userId: 1, challengeId: 1 }, { unique: true });
  return indexesReady;
};

const fail = (status, message) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

const toObjectId = (value, label) => {
  if (!ObjectId.isValid(value)) fail(400, `Invalid ${label}`);
  return new ObjectId(value);
};

/**
 * Create or resume. Idempotent: the unique index turns a concurrent duplicate
 * insert into an E11000, which we swallow and resolve by re-reading the winner.
 */
export const startAttemptService = async (db, userId, slug) => {
  if (typeof slug !== "string" || !slug.trim()) {
    fail(400, "slug is required");
  }

  await ensureIndexes(db);

  const challenge = await db
    .collection(CHALLENGES)
    .findOne(
      { slug, status: "published" },
      { projection: { _id: 1, slug: 1, starterFiles: 1 } },
    );

  if (!challenge) fail(404, "Challenge not found");

  const filter = { userId: new ObjectId(userId), challengeId: challenge._id };

  const existing = await db.collection(COL).findOne(filter);
  if (existing) return existing;

  const doc = {
    ...filter,
    challengeSlug: challenge.slug,
    code: (challenge.starterFiles ?? []).map(({ name, code }) => ({
      name,
      code,
    })),
    hintsRevealed: [],
    xpSpent: 0,
    runs: 0,
    lastResult: null,
    startedAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await db.collection(COL).insertOne(doc);
    return { ...doc, _id: result.insertedId };
  } catch (err) {
    // 11000 = another request for the same (user, challenge) won the race.
    if (err.code !== 11000) throw err;
    return db.collection(COL).findOne(filter);
  }
};

export const getAttemptService = async (db, userId, attemptId) => {
  const attempt = await db.collection(COL).findOne({
    _id: toObjectId(attemptId, "attempt id"),
    userId: new ObjectId(userId),
  });

  if (!attempt) fail(404, "Attempt not found");
  return attempt;
};

/**
 * Autosave the draft. `code` is replaced wholesale rather than merged per file:
 * the editor always holds the full file set, so a partial write would silently
 * drop a file the user deleted.
 */
export const saveAttemptCodeService = async (db, userId, attemptId, code) => {
  if (!Array.isArray(code)) fail(400, "code must be an array of files");

  const files = code.map((file) => {
    if (
      !file ||
      typeof file.name !== "string" ||
      typeof file.code !== "string"
    ) {
      fail(400, "each file needs a string name and string code");
    }
    return { name: file.name, code: file.code };
  });

  const result = await db.collection(COL).findOneAndUpdate(
    {
      _id: toObjectId(attemptId, "attempt id"),
      userId: new ObjectId(userId),
    },
    { $set: { code: files, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  if (!result) fail(404, "Attempt not found");
  return result;
};

/**
 * Reveal a hint, charging its XP cost exactly once.
 *
 * The sequence is claim → charge → compensate, and there is no read-then-write
 * anywhere in it:
 *
 *  1. CLAIM: findOneAndUpdate filtered on `hintsRevealed: { $ne: order }`.
 *     MongoDB applies a single document update atomically, so of two
 *     simultaneous double-click requests exactly one matches; the loser gets
 *     null and returns the text for free.
 *  2. CHARGE: a second conditional update on userProgress filtered on
 *     `xpTotal: { $gte: cost }`, so the balance can never go negative.
 *  3. COMPENSATE: if the charge fails (broke, or no progress doc), the claim is
 *     rolled back with $pull before throwing 402 — otherwise a poor user would
 *     burn the hint without paying.
 *
 * A transaction would be the textbook fix for the two-document write, but that
 * needs a replica set; the compensating update is the pragmatic equivalent here.
 */
export const revealHintService = async (db, userId, attemptId, order) => {
  const hintOrder = Number(order);
  if (!Number.isInteger(hintOrder)) fail(400, "Invalid hint order");

  const _id = toObjectId(attemptId, "attempt id");
  const ownerId = new ObjectId(userId);

  const attempt = await db.collection(COL).findOne({ _id, userId: ownerId });
  if (!attempt) fail(404, "Attempt not found");

  const challenge = await db
    .collection(CHALLENGES)
    .findOne(
      { _id: attempt.challengeId },
      { projection: { hints: 1 } },
    );

  const hint = (challenge?.hints ?? []).find((h) => h.order === hintOrder);
  if (!hint) fail(404, "Hint not found");

  const cost = Number(hint.cost) || 0;

  const progressCol = db.collection(PROGRESS);
  const readBalance = async () =>
    (await progressCol.findOne({ userId: ownerId }, { projection: { xpTotal: 1 } }))
      ?.xpTotal ?? 0;

  // 1. Claim.
  const claimed = await db.collection(COL).findOneAndUpdate(
    { _id, userId: ownerId, hintsRevealed: { $ne: hintOrder } },
    {
      $push: { hintsRevealed: hintOrder },
      $inc: { xpSpent: cost },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  // Already paid for — replay the text, charge nothing.
  if (!claimed) {
    return {
      text: hint.text,
      cost,
      xpSpent: attempt.xpSpent,
      xpRemaining: await readBalance(),
      hintsRevealed: attempt.hintsRevealed,
      alreadyRevealed: true,
    };
  }

  // Free hints skip the ledger entirely.
  if (cost === 0) {
    return {
      text: hint.text,
      cost,
      xpSpent: claimed.xpSpent,
      xpRemaining: await readBalance(),
      hintsRevealed: claimed.hintsRevealed,
      alreadyRevealed: false,
    };
  }

  // 2. Charge.
  const charged = await progressCol.findOneAndUpdate(
    { userId: ownerId, xpTotal: { $gte: cost } },
    {
      $inc: { xpTotal: -cost },
      $set: { lastActiveAt: new Date(), updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  // 3. Compensate.
  if (!charged) {
    await db.collection(COL).updateOne(
      { _id, userId: ownerId },
      {
        $pull: { hintsRevealed: hintOrder },
        $inc: { xpSpent: -cost },
        $set: { updatedAt: new Date() },
      },
    );
    fail(402, `Not enough XP — this hint costs ${cost}`);
  }

  return {
    text: hint.text,
    cost,
    xpSpent: claimed.xpSpent,
    xpRemaining: charged.xpTotal,
    hintsRevealed: claimed.hintsRevealed,
    alreadyRevealed: false,
  };
};
