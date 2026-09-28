/**
 * Learner mastery — the Adaptive Engine (Stage 4).
 *
 * This service owns two things the AI mentor deliberately does not:
 *
 *   1. The POLICY that turns raw evidence into a mastery status. It lives here,
 *      in a platform service, rather than under services/agent/, because "is
 *      this learner solid on JWT signatures" is a fact about the learner that
 *      the roadmap UI, the exam gate and the mentor must all agree on. If the
 *      mentor owned it, the mentor's opinion would be the truth.
 *
 *   2. The ANSWER to "what should happen next" (`getNextAction`). The mentor's
 *      job is only to decide HOW to make that happen conversationally.
 *
 * Statuses are recomputed on evidence write (exam submitted, teach-back graded)
 * and stored in `learnerMastery`, so every reader gets the same answer without
 * re-deriving it, and reading it stays cheap.
 */

import { ObjectId } from "mongodb";
import { getExamHistory } from "./examHistoryService.js";
import { getWeakSpots } from "./weakSpotService.js";
import { toTopicSlug, topicSlugOf } from "../utils/topicKey.js";

const COLLECTION = "learnerMastery";

// How much history counts as current evidence. Deliberately generous: mastery is
// a durable judgement, unlike the prompt summary which is capped for token cost.
const EVIDENCE_LIMIT = 10;

// Score bands. Named rather than inlined because they encode a teaching policy
// that should be reviewable in one place, not a arithmetic detail.
const TEACH_BACK_SHAKY_BELOW = 60;
const SOLID_AT_OR_ABOVE = 80;
const REPEATED_FAILURE_AT = 2;

// Ordering for every consumer: what needs attention comes first.
export const STATUS_PRIORITY = { shaky: 0, developing: 1, untested: 2, solid: 3 };

/**
 * Readable title for a legacy row whose only stored title is SHOUTED.
 *
 * weakSpots used to uppercase every topic; those rows would otherwise be read
 * back to the learner in caps. New writes keep their original casing, so this
 * only ever fires on pre-existing documents.
 */
const titleFromSlug = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/**
 * Collapse one topic's evidence into a single status.
 *
 * Pure, so it can be unit-tested with no database and no model. The ordering of
 * the checks IS the policy: teach-back outranks exam score, because a
 * multiple-choice exam can be passed by recognition while the learner still
 * cannot explain the concept. When the two signals disagree, the weaker one is
 * the honest one.
 */
export const deriveTopicStatus = ({ examScore, teachBackScore, failCount = 0 }) => {
  const hasExam = typeof examScore === "number";
  const hasTeachBack = typeof teachBackScore === "number";

  if (!hasExam && !hasTeachBack) {
    // No assessment evidence at all. Confusion voiced in conversation is a real
    // signal, but a single mention is weak evidence — calling it shaky on one
    // mention makes the mentor alarmist about topics the learner may simply have
    // asked a passing question about. Repeated confusion is different.
    if (failCount >= REPEATED_FAILURE_AT) return "shaky";
    return failCount > 0 ? "developing" : "untested";
  }

  if (hasTeachBack && teachBackScore < TEACH_BACK_SHAKY_BELOW) return "shaky";
  if (failCount >= REPEATED_FAILURE_AT) return "shaky";

  const strongExam = hasExam && examScore >= SOLID_AT_OR_ABOVE;
  const strongTeachBack = hasTeachBack && teachBackScore >= SOLID_AT_OR_ABOVE;

  // "Solid" demands that nothing contradicts it: every signal present is strong
  // and there is no unresolved failure history.
  if (failCount === 0 && (!hasExam || strongExam) && (!hasTeachBack || strongTeachBack)) {
    return "solid";
  }

  return "developing";
};

/**
 * Merge weak spots, exam history and teach-back sessions into TopicState[].
 *
 * Pure: takes already-fetched documents, so the merge rules — the part that is
 * genuinely easy to get wrong — are testable directly.
 *
 * `exams` and `teachBacks` MUST arrive newest-first. Each derived field is only
 * written if still unset, which turns first-write-wins into most-recent-wins and
 * yields current state rather than first-ever attempt.
 */
export const buildTopicStates = ({ exams = [], weakSpots = [], teachBacks = [] }) => {
  /** @type {Map<string, object>} */
  const bySlug = new Map();

  const upsert = (slug, { title, path, layer }) => {
    if (!slug) return null;
    let entry = bySlug.get(slug);
    if (!entry) {
      entry = {
        slug,
        title: title ?? slug,
        path: path ?? null,
        layer: layer ?? null,
        examScore: null,
        teachBackScore: null,
        failCount: 0,
        misconceptions: [],
        lastEvidenceAt: null,
      };
      bySlug.set(slug, entry);
    }
    // weakSpots stores the topic uppercased, so a title-cased value from a
    // teach-back session or rubric is a strict improvement and should win.
    if (title && (entry.title === entry.slug || entry.title === entry.title.toUpperCase())) {
      entry.title = title;
    }
    entry.path ??= path ?? null;
    entry.layer ??= layer ?? null;
    return entry;
  };

  const noteEvidenceAt = (entry, at) => {
    if (!at) return;
    const ts = at instanceof Date ? at : new Date(at);
    if (Number.isNaN(ts.getTime())) return;
    if (!entry.lastEvidenceAt || ts > entry.lastEvidenceAt) entry.lastEvidenceAt = ts;
  };

  // ── Weak spots: the failure counter, and the only source that persists
  //    across layers regardless of assessment type.
  for (const ws of weakSpots) {
    const entry = upsert(topicSlugOf(ws), { title: ws.topic, path: ws.path, layer: ws.layer });
    if (!entry) continue;
    entry.failCount = ws.failCount ?? 0;
    noteEvidenceAt(entry, ws.updatedAt ?? ws.createdAt);
  }

  // ── Exams: the score attaches to each topic the attempt flagged as missed.
  //    A clean pass contributes nothing per-topic by design.
  for (const exam of exams) {
    const slugs = exam.missedTopicSlugs?.length
      ? exam.missedTopicSlugs
      : (exam.missedTopics ?? []).map(toTopicSlug);
    const titles = exam.missedTopics ?? [];

    slugs.forEach((slug, i) => {
      const entry = upsert(slug, { title: titles[i], path: exam.path, layer: exam.layer });
      if (!entry) return;
      entry.examScore ??= exam.score ?? null;
      noteEvidenceAt(entry, exam.takenAt);
    });
  }

  // ── Teach-backs: the strongest signal, plus the named misconceptions that
  //    let a mentor correct a specific wrong belief instead of re-explaining.
  for (const tb of teachBacks) {
    const entry = upsert(topicSlugOf(tb, { slugField: "topicSlug" }), {
      title: tb.topic,
      path: tb.path,
      layer: tb.layer,
    });
    if (!entry) continue;

    entry.teachBackScore ??= tb.score ?? null;

    // Entries may be objects ({id, description}) or bare ids depending on what
    // the evaluator returned. Normalise to ids and union across sessions, so an
    // older, still-uncorrected misconception is not lost because the newest
    // session happened not to re-detect it.
    for (const m of tb.misconceptionsDetected ?? []) {
      const id = typeof m === "string" ? m : m?.id;
      if (id && !entry.misconceptions.includes(id)) entry.misconceptions.push(id);
    }

    noteEvidenceAt(entry, tb.startedAt);
  }

  return [...bySlug.values()]
    .map((entry) => ({
      ...entry,
      // Only reachable for legacy all-caps titles; a word with any lowercase in
      // it is left exactly as its source wrote it.
      title: entry.title === entry.title.toUpperCase() ? titleFromSlug(entry.slug) : entry.title,
      status: deriveTopicStatus(entry),
    }))
    .sort(
      (a, b) =>
        STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
        b.failCount - a.failCount ||
        a.title.localeCompare(b.title),
    );
};

/**
 * Fetch the raw per-topic evidence. Shared by the engine (to recompute) and by
 * LearnerContext (to derive on the fly when no stored mastery exists yet), so
 * the two can never disagree about what counts as evidence.
 */
export const loadTopicEvidence = async (db, userId, { limit = EVIDENCE_LIMIT } = {}) => {
  const uid = new ObjectId(userId);

  const [exams, weakSpots, teachBacks] = await Promise.all([
    getExamHistory(db, userId, limit),
    getWeakSpots(db, userId),
    db
      .collection("teach_back_sessions")
      .find({ userId: uid })
      .sort({ startedAt: -1 })
      .limit(limit * 2)
      // Never pull the learner's raw essay answers or full criteria arrays into
      // a merge that only needs scores and misconception ids.
      .project({ answerText: 0, criteria: 0 })
      .toArray(),
  ]);

  return { exams, weakSpots, teachBacks };
};

/**
 * Recompute and persist mastery for one learner.
 *
 * Full recompute rather than incremental per-topic: it is three reads and one
 * bulk write, it runs only on evidence writes (not on reads), and it cannot
 * drift the way a partial update can. Worth revisiting only if a learner ever
 * accumulates enough topics for the bulk write to matter.
 */
export const recomputeMastery = async (db, userId) => {
  const evidence = await loadTopicEvidence(db, userId);
  const states = buildTopicStates(evidence);
  if (!states.length) return [];

  const uid = new ObjectId(userId);
  const now = new Date();

  await db.collection(COLLECTION).bulkWrite(
    states.map((s) => ({
      updateOne: {
        filter: { userId: uid, slug: s.slug },
        update: { $set: { ...s, userId: uid, updatedAt: now }, $setOnInsert: { createdAt: now } },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  return states;
};

/** Stored mastery for a learner, ordered so what needs attention comes first. */
export const getMastery = async (db, userId) => {
  const rows = await db
    .collection(COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .project({ _id: 0, userId: 0 })
    .toArray();

  return rows.sort(
    (a, b) =>
      STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
      b.failCount - a.failCount ||
      a.title.localeCompare(b.title),
  );
};

/**
 * WHAT should happen next for this learner.
 *
 * Pure and deliberately small: this is a learning decision, so it belongs in
 * reviewable code rather than in a model's judgement. The mentor receives the
 * answer and decides only HOW to deliver it.
 */
export const deriveNextAction = (topics = [], progress = null) => {
  const firstOf = (status) => topics.find((t) => t.status === status);

  const shaky = firstOf("shaky");
  if (shaky) {
    return {
      action: "reinforce",
      topicSlug: shaky.slug,
      title: shaky.title,
      reason:
        shaky.teachBackScore !== null && shaky.teachBackScore < TEACH_BACK_SHAKY_BELOW
          ? `Could not explain it (teach-back ${shaky.teachBackScore}%)`
          : `Failed ${shaky.failCount} time(s)`,
      misconceptions: shaky.misconceptions ?? [],
    };
  }

  const developing = firstOf("developing");
  if (developing) {
    return {
      action: "practice",
      topicSlug: developing.slug,
      title: developing.title,
      reason: "Partial understanding — not yet reliable",
      misconceptions: developing.misconceptions ?? [],
    };
  }

  // Nothing weak on record. If a topic was never assessed, prove it before
  // calling the layer done — an untested topic is not a passed one.
  const untested = firstOf("untested");
  if (untested) {
    return {
      action: "assess",
      topicSlug: untested.slug,
      title: untested.title,
      reason: "No assessment evidence yet",
      misconceptions: [],
    };
  }

  if (!progress?.activePath) {
    return { action: "start", topicSlug: null, title: null, reason: "No roadmap path chosen yet", misconceptions: [] };
  }

  return {
    action: "advance",
    topicSlug: null,
    title: null,
    reason: "Everything assessed is solid — ready for the next layer",
    misconceptions: [],
  };
};

/** DB-backed wrapper: reads stored mastery, falls back to deriving it. */
export const getNextAction = async (db, userId, progress = null) => {
  let topics = await getMastery(db, userId);
  if (!topics.length) topics = buildTopicStates(await loadTopicEvidence(db, userId));
  return deriveNextAction(topics, progress);
};
