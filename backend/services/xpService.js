import { ObjectId } from "mongodb";

/**
 * XP awards for verified milestones: the first pass of a layer exam and the
 * first pass of a capstone.
 *
 * Rule from docs/XP_SYSTEM.md: XP measures effort, never proof. Awards here are
 * a reward for a result the SERVER already decided; XP never unlocks anything.
 *
 * Why a separate `xpAwards` collection instead of only `$inc: { xpTotal }`:
 * - Audit trail: every XP point can be explained (what, when, for which source).
 * - Dedupe in the database: a unique (userId, kind, sourceId) index means a
 *   retry, a double click or two tabs can never award the same milestone twice.
 *
 * Award order: (1) insert the award row, (2) claim it (`applied: false -> true`),
 * (3) `$inc xpTotal`. The claim is one conditional update, so two concurrent
 * callers cannot both increment. If the increment fails the claim is released
 * and a later call for the same milestone COULD finish the job. Nothing retries
 * on its own today: a failed credit is logged by the caller, not repaired.
 */

export const XP_AWARDS = "xpAwards";

export const XP_AMOUNTS = Object.freeze({
  exam: 50,
  examHighScoreBonus: 25, // score >= EXAM_BONUS_SCORE
  capstone: 300,
});
const EXAM_BONUS_SCORE = 90;

/** Pure: XP for a first exam pass at this score. */
export const examXp = (score) =>
  XP_AMOUNTS.exam + (score >= EXAM_BONUS_SCORE ? XP_AMOUNTS.examHighScoreBonus : 0);

let indexesReady = null;
const ensureIndexes = (db) => {
  indexesReady ??= db
    .collection(XP_AWARDS)
    .createIndex({ userId: 1, kind: 1, sourceId: 1 }, { unique: true })
    .catch((err) => {
      indexesReady = null; // retry on the next call instead of caching a failure
      throw err;
    });
  return indexesReady;
};

/**
 * Take back the capstone XP of one attempt (its certificate was revoked or the
 * attempt was overridden to failed). The award row is kept and marked revoked, so
 * the unique index still blocks a second award for the same track. The balance is
 * floored at 0: XP already spent on hints is not clawed back below zero.
 * @returns {Promise<{ revoked: boolean, amount: number }>}
 */
export const revokeCapstoneXp = async (db, rawUserId, attemptId) => {
  const userId = new ObjectId(rawUserId);
  const claimed = await db.collection(XP_AWARDS).findOneAndUpdate(
    { userId, kind: "capstone", "meta.attemptId": attemptId.toString(), applied: true, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
  if (!claimed) return { revoked: false, amount: 0 };

  const progress = db.collection("userProgress");
  const res = await progress.updateOne({ userId, xpTotal: { $gte: claimed.amount } }, { $inc: { xpTotal: -claimed.amount } });
  if (!res.matchedCount) await progress.updateOne({ userId }, { $set: { xpTotal: 0 } });
  return { revoked: true, amount: claimed.amount };
};

/**
 * Award XP once per (user, kind, source).
 * @param {"exam"|"capstone"} kind
 * @param {string} sourceId  "<path>:<layer>" for an exam, the track id for a capstone
 * @returns {Promise<{ awarded: boolean, amount: number }>} awarded=false when it was already given
 */
export const awardXp = async (db, rawUserId, { kind, sourceId, amount, meta = {} }) => {
  await ensureIndexes(db);
  const userId = new ObjectId(rawUserId); // callers pass a string or an ObjectId
  const awards = db.collection(XP_AWARDS);

  try {
    await awards.insertOne({ userId, kind, sourceId, amount, meta, applied: false, awardedAt: new Date() });
  } catch (err) {
    if (err.code !== 11000) throw err;
    // Row exists: either fully applied (nothing to do) or left half-done by a crash (finish below).
  }

  const claimed = await awards.findOneAndUpdate(
    { userId, kind, sourceId, applied: false },
    { $set: { applied: true, appliedAt: new Date() } },
  );
  if (!claimed) return { awarded: false, amount: 0 };

  try {
    const res = await db
      .collection("userProgress")
      .updateOne({ userId }, { $inc: { xpTotal: claimed.amount }, $set: { updatedAt: new Date() } });
    if (!res.matchedCount) throw new Error("No userProgress document to credit");
  } catch (err) {
    await awards.updateOne({ _id: claimed._id }, { $set: { applied: false }, $unset: { appliedAt: "" } });
    throw err;
  }
  return { awarded: true, amount: claimed.amount };
};
