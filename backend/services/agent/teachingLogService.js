/**
 * Teaching log — cross-session mentor memory (Stage 7).
 *
 * This is the one collection the mentor legitimately owns, and the reason is a
 * careful distinction:
 *
 *   "Vahe does not understand JWT signatures"   → a claim about the LEARNER.
 *                                                 Platform truth. Not ours.
 *   "I explained it with the jwt.io decode demo" → a record of what the MENTOR
 *                                                 DID. Nobody else can know it.
 *
 * So the log stores only the mentor's own actions. Whether an attempt worked is
 * never self-assessed — it is derived by comparing the topic's mastery status at
 * the time of the attempt against its status now, which comes from the Adaptive
 * Engine. The mentor records what it tried; the platform decides whether it
 * landed.
 *
 * Without this, every new conversation restarts the teaching arc: the mentor
 * re-explains a concept the same failed way because the 20-turn session window
 * is the only memory it has.
 */

import { ObjectId } from "mongodb";
import { toTopicSlug } from "../../utils/topicKey.js";

const COLLECTION = "mentor_teaching_log";

// Prompt budget. Only a handful of recent attempts can ride along on every turn,
// so this is deliberately small — the point is "don't repeat yourself", which
// needs the last attempt or two, not a full history.
const MAX_PER_TOPIC = 2;
const MAX_TOTAL = 5;

// Attempts older than this stop being useful guidance and start being noise: an
// explanation from two months ago is worth trying again.
const RELEVANT_DAYS = 30;

/**
 * Record one teaching attempt.
 *
 * `statusAtTime` is captured here rather than looked up later because it is the
 * baseline the outcome is measured against — without it, "still shaky" cannot be
 * distinguished from "was always shaky".
 */
export const logTeachingAttempt = async (
  db,
  userId,
  { topicSlug, approach, misconceptionId = null, statusAtTime = null, sessionId = null },
) => {
  const slug = toTopicSlug(topicSlug);
  if (!slug || !approach?.trim()) return null;

  const doc = {
    userId: new ObjectId(userId),
    slug,
    // Capped hard: this is a note to the mentor's future self, not a transcript.
    approach: approach.trim().slice(0, 300),
    misconceptionId,
    statusAtTime,
    sessionId: sessionId ? new ObjectId(sessionId) : null,
    at: new Date(),
  };

  await db.collection(COLLECTION).insertOne(doc);
  return doc;
};

/**
 * Recent attempts for the given topics, newest first.
 *
 * Scoped to specific slugs rather than fetching everything, because the caller
 * only ever needs history for the topics already in focus this turn.
 */
export const getTeachingHistory = async (db, userId, topicSlugs = []) => {
  const slugs = [...new Set(topicSlugs.map(toTopicSlug).filter(Boolean))];
  if (!slugs.length) return [];

  const since = new Date(Date.now() - RELEVANT_DAYS * 86400000);

  return db
    .collection(COLLECTION)
    .find({ userId: new ObjectId(userId), slug: { $in: slugs }, at: { $gte: since } })
    .sort({ at: -1 })
    .limit(MAX_TOTAL * 2) // headroom, then thinned per-topic below
    .project({ _id: 0, userId: 0 })
    .toArray();
};

/**
 * Judge each attempt against what the platform now says about the topic.
 *
 * Pure. The verdict is derived, never self-reported: comparing the status the
 * topic had when the mentor taught it against the status the Adaptive Engine
 * gives it now is the only honest way to know whether the explanation worked.
 */
export const summarizeTeachingHistory = (attempts = [], topics = []) => {
  if (!attempts.length) return null;

  const statusBySlug = new Map(topics.map((t) => [t.slug, t.status]));
  const RANK = { shaky: 0, developing: 1, untested: 1, solid: 2 };

  const perTopic = new Map();
  const lines = [];

  for (const a of attempts) {
    const seen = perTopic.get(a.slug) ?? 0;
    if (seen >= MAX_PER_TOPIC || lines.length >= MAX_TOTAL) continue;
    perTopic.set(a.slug, seen + 1);

    const now = statusBySlug.get(a.slug);
    const was = a.statusAtTime;

    let verdict = "";
    if (was && now) {
      if (RANK[now] > RANK[was]) verdict = ` — improved since (${was} → ${now})`;
      else if (RANK[now] === RANK[was]) verdict = ` — did NOT land, still ${now}`;
      else verdict = ` — got worse since (${was} → ${now})`;
    }

    const days = Math.max(0, Math.round((Date.now() - new Date(a.at).getTime()) / 86400000));
    const when = days === 0 ? "today" : `${days}d ago`;

    lines.push(`  - ${a.slug}: tried "${a.approach}" ${when}${verdict}`);
  }

  if (!lines.length) return null;

  return ["Your own previous attempts with this learner:", ...lines].join("\n");
};
