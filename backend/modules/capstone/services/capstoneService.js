/**
 * Capstone status + start (stage 1).
 *
 * Same two rules as the coding-challenges attempt layer:
 *  1. Ownership is part of every filter. A miss is a 404, never "forbidden",
 *     so we never confirm that someone else's attempt exists.
 *  2. Projection discipline: weights, thresholds and the twist pool are read
 *     here but only ever leave through lib/publicView.js.
 */

import { ObjectId } from "mongodb";
import { trackEvent } from "../../../services/eventService.js";
import { isPathComplete } from "../lib/pathCompletion.js";
import { evaluateStart } from "../lib/startRules.js";
import { MAX_ATTEMPTS, OPEN_STATUSES } from "../lib/constants.js";
import {
  pickTwist,
  toPublicAttempt,
  toPublicBrief,
  toPublicReview,
  toPublicSubmission,
} from "../lib/publicView.js";
import {
  ATTEMPTS,
  BRIEFS,
  DEFENSES,
  REVIEWS,
  SUBMISSIONS,
  ensureIndexes,
  fail,
  getAttempts,
  getBriefForAttempt,
  getLatestBrief,
} from "./capstoneData.js";
import { ensureCertificate, toPublicCertificate } from "./certificateService.js";
import { buildTimeline } from "../lib/timeline.js";

export const getStatusService = async (db, userId, trackId) => {
  await ensureIndexes(db);

  const [brief, eligibility, attempts, track] = await Promise.all([
    getLatestBrief(db, trackId),
    isPathComplete(db, userId, trackId),
    getAttempts(db, userId, trackId),
    db.collection("roadmap_tracks").findOne({ trackId }, { projection: { _id: 0, title: 1, categoryId: 1 } }),
  ]);

  const current = attempts[0] ?? null;
  const gate = evaluateStart(attempts);
  const reason = !brief ? "no_brief" : !eligibility.complete ? "not_eligible" : gate.reason;

  // Everything for the current attempt in one parallel round: the brief it
  // was started on, all its submissions (newest first, for the history), its
  // review, and its graded defense sessions.
  const [currentBrief, submissions, review, gradedDefenses] = current
    ? await Promise.all([
        getBriefForAttempt(db, current, brief),
        db.collection(SUBMISSIONS).find({ attemptId: current._id }).sort({ submittedAt: -1 }).toArray(),
        db.collection(REVIEWS).find({ attemptId: current._id }).sort({ createdAt: -1 }).limit(1).next(),
        db
          .collection(DEFENSES)
          .find({ attemptId: current._id, status: "graded" }, { projection: { sessionNumber: 1, result: 1, gradedAt: 1 } })
          .sort({ sessionNumber: 1 })
          .toArray(),
      ])
    : [null, [], null, []];
  const lastSubmission = submissions[0] ?? null;

  // Idempotent: issues on first read after passing if the issue at pass time
  // failed, or once the learner gains access while billing is enforced.
  const cert =
    current?.status === "passed"
      ? await ensureCertificate(db, userId, current).catch((err) => {
          console.error("certificate issue failed (status still served):", err);
          return null;
        })
      : null;
  const certificate = !cert ? null : cert.locked ? { locked: true } : toPublicCertificate(cert, null);

  const twistText = currentBrief?.twistPool.find((t) => t.id === current?.twistId)?.text ?? null;

  return {
    trackId,
    track: { id: trackId, title: track?.title ?? trackId, categoryId: track?.categoryId ?? null },
    eligibility,
    brief: brief ? toPublicBrief(brief) : null,
    attempt: current ? toPublicAttempt(current, currentBrief) : null,
    lastSubmission: lastSubmission ? toPublicSubmission(lastSubmission) : null,
    review: review ? toPublicReview(review, currentBrief) : null,
    certificate,
    timeline: buildTimeline({
      attempt: current,
      twistText,
      submissions: [...submissions].reverse(),
      review,
      defenses: gradedDefenses,
      certificate: cert,
    }),
    attemptsUsed: gate.failedCount,
    maxAttempts: MAX_ATTEMPTS,
    canStart: reason === null,
    reason,
    retryAt: gate.retryAt,
  };
};

/**
 * Start a new attempt, or resume the open one. Idempotent under double POST.
 */
export const startAttemptService = async (db, userId, trackId) => {
  await ensureIndexes(db);

  const brief = await getLatestBrief(db, trackId);
  if (!brief) fail(404, "No capstone is available for this track yet");

  const eligibility = await isPathComplete(db, userId, trackId);
  if (!eligibility.complete) {
    fail(403, "Pass every layer exam in this track to unlock the capstone", {
      missing: eligibility.missing,
    });
  }

  const attempts = await getAttempts(db, userId, trackId);
  const gate = evaluateStart(attempts);

  if (gate.reason === "open_attempt") {
    const open = attempts.find((a) => OPEN_STATUSES.includes(a.status));
    const openBrief = await getBriefForAttempt(db, open, brief);
    return { attempt: toPublicAttempt(open, openBrief), brief: toPublicBrief(openBrief), resumed: true };
  }
  if (gate.reason === "already_passed") fail(409, "You have already passed this capstone");
  if (gate.reason === "max_attempts") fail(403, `All ${MAX_ATTEMPTS} attempts have been used`);
  if (gate.reason === "cooldown") {
    fail(429, "Cooldown after a failed attempt is still running", { retryAt: gate.retryAt });
  }

  const twist = pickTwist(brief.twistPool, attempts.map((a) => a.twistId));
  const now = new Date();
  const attempt = {
    userId: new ObjectId(userId),
    trackId,
    briefId: brief._id,
    briefVersion: brief.version,
    twistId: twist.id,
    attemptNumber: attempts.length + 1,
    status: "started",
    startedAt: now,
    cooldownUntil: null,
    updatedAt: now,
  };

  try {
    const { insertedId } = await db.collection(ATTEMPTS).insertOne(attempt);
    attempt._id = insertedId;
  } catch (err) {
    if (err.code !== 11000) throw err;
    // Lost the race to a concurrent start — return the attempt that won.
    const winner = await db.collection(ATTEMPTS).findOne({
      userId: attempt.userId,
      trackId,
      attemptNumber: attempt.attemptNumber,
    });
    return { attempt: toPublicAttempt(winner, brief), brief: toPublicBrief(brief), resumed: true };
  }

  await trackEvent(db, userId, "capstone_started", {
    trackId,
    attemptId: attempt._id.toString(),
    attemptNumber: attempt.attemptNumber,
    twistId: twist.id,
  });

  return { attempt: toPublicAttempt(attempt, brief), brief: toPublicBrief(brief), resumed: false };
};

/**
 * The capstones the roadmap knows about, one per track.
 *
 * Default: published only — what a learner can actually open (the /capstone
 * picker uses this). With includeDrafts, tracks whose capstone is still a
 * draft are listed too, flagged `published: false`, so the roadmap can show
 * a locked preview of what is coming. Only the title and summary of a draft
 * leave the server — never its requirements, rubric or twists.
 *
 * Per track, a published version always wins over a newer draft, so editing a
 * live capstone in draft never hides it.
 */
export const getCatalogService = async (db, { includeDrafts = false } = {}) => {
  const briefs = await db
    .collection(BRIEFS)
    .find(
      { status: includeDrafts ? { $in: ["published", "draft"] } : "published" },
      { projection: { trackId: 1, title: 1, summary: 1, version: 1, status: 1 } },
    )
    .sort({ version: -1 })
    .toArray();
  const latest = new Map();
  for (const b of briefs) {
    const have = latest.get(b.trackId);
    // sorted newest first: keep the first seen, unless it is a draft and a
    // published version of the same track turns up later.
    if (!have || (have.status !== "published" && b.status === "published")) latest.set(b.trackId, b);
  }

  const tracks = await db
    .collection("roadmap_tracks")
    .find({ trackId: { $in: [...latest.keys()] } }, { projection: { _id: 0, trackId: 1, title: 1, categoryId: 1 } })
    .toArray();
  const trackOf = new Map(tracks.map((t) => [t.trackId, t]));

  return [...latest.values()].map((b) => ({
    trackId: b.trackId,
    trackTitle: trackOf.get(b.trackId)?.title ?? b.trackId,
    categoryId: trackOf.get(b.trackId)?.categoryId ?? null,
    briefTitle: b.title,
    summary: b.summary,
    published: b.status === "published",
  }));
};

/** The catalog plus where this learner stands on each capstone — the /capstone picker. */
export const getOverviewService = async (db, userId) => {
  await ensureIndexes(db);
  const catalog = await getCatalogService(db);
  return Promise.all(
    catalog.map(async (entry) => {
      const [eligibility, attempts] = await Promise.all([
        isPathComplete(db, userId, entry.trackId),
        getAttempts(db, userId, entry.trackId),
      ]);
      const latest = attempts[0];
      const state = !eligibility.complete
        ? "locked"
        : !latest
          ? "ready"
          : OPEN_STATUSES.includes(latest.status)
            ? "in_progress"
            : latest.status; // "passed" | "failed"
      return {
        ...entry,
        state,
        attemptStatus: latest?.status ?? null,
        eligibility: { passed: eligibility.passed, total: eligibility.total },
      };
    }),
  );
};
