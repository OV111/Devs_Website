/**
 * Capstone defense (stage 4).
 *
 * Session lifecycle (capstone_defenses.status):
 *   generating → questions are being written by the model (short lock)
 *   active     → questions served one at a time; currentIndex is the open one
 *   answered   → every question answered or expired; waiting for grading
 *   grading    → the model is grading (short lock)
 *   graded     → result stored; applied to the attempt
 *
 * Timer: a question's clock starts when the server first serves it
 * (`askedAt`), never when the client says so. An answer after the deadline
 * (+ a small network grace) is kept for the admin but scores 0. A question
 * nobody answered expires lazily on the next read, without serving the next
 * one — its clock only starts when the learner is actually there to see it.
 *
 * Every state change is one conditional update on the session, so a double
 * click, two tabs or a retry can never answer twice or skip a question.
 *
 * Result → attempt: applied by `applyResult`, which is idempotent (it records
 * the session id it applied). It runs right after grading AND on every read,
 * so a crash between "session graded" and "attempt updated" heals itself on
 * the learner's next request — no multi-document transaction needed.
 */

import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { trackEvent } from "../../../services/eventService.js";
import { addWeakSpot } from "../../../services/weakSpotService.js";
import { recomputeMastery } from "../../../services/learnerMasteryService.js";
import { XP_AMOUNTS, awardXp } from "../../../services/xpService.js";
import {
  COOLDOWN_MS,
  DEFENSE_LOCK_STALE_MS,
  MAX_DEFENSE_SESSIONS,
  REVIEW_MODEL,
  REVIEW_PROMPT_VERSION,
  WEAK_SPOT_MAX_SCORE,
} from "../lib/constants.js";
import {
  buildGradingMessages,
  buildQuestionMessages,
  gradingJsonSchema,
  isOnTime,
  normalizeAnswer,
  parseGrades,
  parseQuestions,
  questionJsonSchema,
  scoreDefense,
} from "../lib/defense.js";
import { scanForInjection } from "../lib/reviewPrompt.js";
import { callWithOneRetry } from "../lib/retry.js";
import { toPublicAttempt, toPublicDefense } from "../lib/publicView.js";
import { loadSubmissionFiles } from "./repoFiles.js";
import { runStructured } from "./reviewModel.js";
import { ensureCertificate } from "./certificateService.js";
import {
  ATTEMPTS,
  BRIEFS,
  DEFENSES,
  REVIEWS,
  SUBMISSIONS,
  ensureIndexes,
  fail,
  getAttempts,
} from "./capstoneData.js";

const NOT_GRADED = ["generating", "active", "answered", "grading"];

// ── Loading ──────────────────────────────────────────────────

/** The learner's latest attempt on this track, with its brief and submission. */
const loadContext = async (db, userId, trackId) => {
  const [attempt] = await getAttempts(db, userId, trackId);
  if (!attempt) fail(404, "No capstone attempt. Start the capstone first.");
  const [brief, submission] = await Promise.all([
    db.collection(BRIEFS).findOne({ _id: attempt.briefId }),
    attempt.submissionId ? db.collection(SUBMISSIONS).findOne({ _id: attempt.submissionId }) : null,
  ]);
  return { attempt, brief, submission };
};

const getSessions = (db, attemptId) =>
  db.collection(DEFENSES).find({ attemptId }).sort({ sessionNumber: 1 }).toArray();

// ── Result → attempt (idempotent) ────────────────────────────

const applyResult = async (db, userId, attempt, session, brief, gradedSessions) => {
  if (session.status !== "graded" || attempt.lastDefenseSessionId?.equals(session._id)) return attempt;

  const now = new Date();
  const failedCount = gradedSessions.filter((s) => !s.result.passed).length;
  const finalFail = !session.result.passed && failedCount >= MAX_DEFENSE_SESSIONS;

  const fields = session.result.passed
    ? { status: "passed", finishedAt: now, defenseScore: session.result.score }
    : finalFail
      ? { status: "failed", finishedAt: now, cooldownUntil: new Date(now.getTime() + COOLDOWN_MS) }
      : { defenseRetryAt: new Date(now.getTime() + COOLDOWN_MS) };

  const updated = await db.collection(ATTEMPTS).findOneAndUpdate(
    { _id: attempt._id, status: "defense", lastDefenseSessionId: { $ne: session._id } },
    { $set: { ...fields, lastDefenseSessionId: session._id, updatedAt: now } },
    { returnDocument: "after" },
  );
  if (!updated) return db.collection(ATTEMPTS).findOne({ _id: attempt._id }); // someone else applied it

  const meta = { trackId: attempt.trackId, attemptId: attempt._id.toString(), stage: "defense", score: session.result.score };
  if (session.result.passed) await trackEvent(db, userId, "capstone_passed", meta);
  else if (finalFail) await trackEvent(db, userId, "capstone_failed", meta);

  // XP for the first genuine defense pass on this track (not admin overrides,
  // which never reach applyResult). Once per track, enforced by xpAwards' unique
  // index. Derived reward: never fail the learner's request over it.
  if (session.result.passed) {
    try {
      const award = await awardXp(db, userId, {
        kind: "capstone",
        sourceId: attempt.trackId,
        amount: XP_AMOUNTS.capstone,
        meta: { attemptId: attempt._id.toString(), score: session.result.score },
      });
      if (award.awarded) {
        // Remembered on the attempt so the result screen can say "+N XP".
        await db.collection(ATTEMPTS).updateOne({ _id: updated._id }, { $set: { xpAwarded: award.amount } });
        updated.xpAwarded = award.amount;
      }
    } catch (err) {
      console.error("capstone XP award failed (result already applied):", err);
    }
  }

  // Issue the certificate now. If this fails, the status read retries it, so
  // never fail the learner's request over it.
  if (session.result.passed) {
    await ensureCertificate(db, userId, updated).catch((err) =>
      console.error("certificate issue failed (will retry on next status read):", err),
    );
  }

  // Weak spots + mastery are derived data: never fail the request over them.
  try {
    const rubricById = new Map(brief.rubric.map((c) => [c.id, c]));
    const weakFocus = new Set(
      session.questions.filter((q) => q.score <= WEAK_SPOT_MAX_SCORE).map((q) => q.focus),
    );
    for (const focus of weakFocus) {
      const c = rubricById.get(focus);
      if (c) await addWeakSpot(db, userId, { topic: c.name, path: brief.categoryId, layer: c.layerId, source: "capstone" });
    }
    await recomputeMastery(db, userId);
  } catch (err) {
    console.error("capstone defense weak-spot/mastery update failed (result already applied):", err);
  }
  return updated;
};

// ── Timer housekeeping (one conditional update each) ─────────

/** Expire the open question if its time ran out. Does NOT serve the next one. */
const expireOverdue = async (db, session, now) => {
  const i = session.currentIndex;
  const q = session.questions[i];
  if (session.status !== "active" || !q?.askedAt || isOnTime(q.askedAt, now)) return session;

  const last = i + 1 === session.questions.length;
  const updated = await db.collection(DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i, [`questions.${i}.askedAt`]: q.askedAt },
    {
      $set: {
        [`questions.${i}.answer`]: "",
        [`questions.${i}.expired`]: true,
        [`questions.${i}.answeredAt`]: now,
        currentIndex: i + 1,
        ...(last ? { status: "answered" } : {}),
      },
    },
    { returnDocument: "after" },
  );
  return updated ?? db.collection(DEFENSES).findOne({ _id: session._id });
};

/** Start the open question's clock if it has not been served yet. */
const serveCurrent = async (db, session, now) => {
  const i = session.currentIndex;
  if (session.status !== "active" || session.questions[i]?.askedAt) return session;
  const updated = await db.collection(DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i, [`questions.${i}.askedAt`]: null },
    { $set: { [`questions.${i}.askedAt`]: now } },
    { returnDocument: "after" },
  );
  return updated ?? db.collection(DEFENSES).findOne({ _id: session._id });
};

// ── View ─────────────────────────────────────────────────────

const view = (attempt, session, brief, submission, sessions) => {
  const graded = sessions.filter((s) => s.status === "graded");
  const now = new Date();
  const waiting = attempt.defenseRetryAt && attempt.defenseRetryAt > now;
  const open = sessions.some((s) => NOT_GRADED.includes(s.status));
  return {
    attempt: toPublicAttempt(attempt, brief),
    session: session ? toPublicDefense(session, submission, now) : null,
    sessionsUsed: graded.length,
    maxSessions: MAX_DEFENSE_SESSIONS,
    canStart: attempt.status === "defense" && !open && !waiting && graded.length < MAX_DEFENSE_SESSIONS,
    retryAt: waiting ? attempt.defenseRetryAt : null,
  };
};

// ── Public service functions ─────────────────────────────────

export const getDefenseService = async (db, userId, trackId) => {
  await ensureIndexes(db);
  const ctx = await loadContext(db, userId, trackId);
  let { attempt } = ctx;
  const sessions = await getSessions(db, attempt._id);
  let session = sessions.at(-1) ?? null;

  if (session) {
    const now = new Date();
    session = await serveCurrent(db, await expireOverdue(db, session, now), now);
    sessions[sessions.length - 1] = session;
    // Self-heal: a graded session whose result never reached the attempt.
    attempt = await applyResult(db, userId, attempt, session, ctx.brief, sessions.filter((s) => s.status === "graded"));
  }
  return view(attempt, session, ctx.brief, ctx.submission, sessions);
};

export const startDefenseService = async (db, userId, trackId) => {
  await ensureIndexes(db);
  const { attempt, brief, submission } = await loadContext(db, userId, trackId);
  if (attempt.status !== "defense") {
    fail(409, attempt.status === "passed" || attempt.status === "failed"
      ? "This attempt is finished"
      : "The defense opens after your review passes");
  }

  const sessions = await getSessions(db, attempt._id);
  const latest = sessions.at(-1);
  const now = new Date();

  if (latest?.status === "generating") {
    if (now - latest.lockedAt < DEFENSE_LOCK_STALE_MS) fail(409, "Your questions are being prepared");
    // A dead request left this behind: remove it so the number can be reused.
    await db.collection(DEFENSES).deleteOne({ _id: latest._id, status: "generating", lockedAt: latest.lockedAt });
    sessions.pop();
  } else if (latest && NOT_GRADED.includes(latest.status)) {
    return getDefenseService(db, userId, trackId); // resume the open session
  }

  if (sessions.length >= MAX_DEFENSE_SESSIONS) fail(409, "All defense sessions have been used");
  if (attempt.defenseRetryAt && attempt.defenseRetryAt > now) {
    fail(429, "You can retake the defense after the cooldown", { retryAt: attempt.defenseRetryAt });
  }

  // CLAIM by inserting the placeholder first: the unique (attemptId,
  // sessionNumber) index means only one concurrent start ever reaches the model.
  const placeholder = {
    attemptId: attempt._id,
    userId: new ObjectId(userId),
    trackId,
    sessionNumber: sessions.length + 1,
    status: "generating",
    lockedAt: now,
    createdAt: now,
  };
  try {
    placeholder._id = (await db.collection(DEFENSES).insertOne(placeholder)).insertedId;
  } catch (err) {
    if (err.code === 11000) fail(409, "Your questions are being prepared");
    throw err;
  }

  try {
    const review = await db.collection(REVIEWS).findOne({ _id: attempt.reviewId });
    if (!review || !submission) fail(500, "The review or submission for this attempt is missing");
    const twist = brief.twistPool.find((t) => t.id === attempt.twistId);

    const { files } = await loadSubmissionFiles(submission);
    if (files.length === 0) fail(422, "None of the files in your repository could be read.");
    const fileTexts = new Map(files.map((f) => [f.path, f.text]));

    const messages = buildQuestionMessages({
      brief,
      twist,
      review,
      files,
      previousQuestions: sessions.flatMap((s) => s.questions?.map((q) => q.text) ?? []),
      nonce: randomBytes(12).toString("hex"),
    });
    const schema = questionJsonSchema(brief.rubric.map((c) => c.id));
    const { questions, usage } = await callWithOneRetry(
      () => runStructured(messages, schema, "capstone_defense_questions"),
      (content) => parseQuestions(content, brief.rubric, fileTexts),
      "capstone defense questions",
    );

    const startedAt = new Date();
    const activated = await db.collection(DEFENSES).findOneAndUpdate(
      { _id: placeholder._id, status: "generating" },
      {
        $set: {
          status: "active",
          // The first question is served immediately — its clock starts now.
          questions: questions.map((q, i) => ({
            ...q,
            askedAt: i === 0 ? startedAt : null,
            answeredAt: null,
            answer: null,
            expired: false,
          })),
          currentIndex: 0,
          startedAt,
          model: REVIEW_MODEL,
          promptVersion: REVIEW_PROMPT_VERSION,
          generationUsage: usage,
        },
        $unset: { lockedAt: "" },
      },
      { returnDocument: "after" },
    );
    if (!activated) fail(409, "Your questions are being prepared");
    return view(attempt, activated, brief, submission, [...sessions, activated]);
  } catch (err) {
    // Remove the placeholder so the learner can retry; nothing was used up.
    await db.collection(DEFENSES).deleteOne({ _id: placeholder._id, status: "generating" }).catch(() => {});
    throw err;
  }
};

/** Grade a session in "answered" (or a stale "grading") and apply the result. */
export const gradeDefenseService = async (db, userId, trackId) => {
  await ensureIndexes(db);
  const ctx = await loadContext(db, userId, trackId);
  const sessions = await getSessions(db, ctx.attempt._id);
  const latest = sessions.at(-1);
  if (!latest || !["answered", "grading"].includes(latest.status)) {
    fail(409, "There is no finished defense waiting to be graded");
  }

  const now = new Date();
  const claimed = await db.collection(DEFENSES).findOneAndUpdate(
    {
      _id: latest._id,
      $or: [
        { status: "answered" },
        { status: "grading", lockedAt: { $lt: new Date(now.getTime() - DEFENSE_LOCK_STALE_MS) } },
      ],
    },
    { $set: { status: "grading", lockedAt: now } },
    { returnDocument: "after" },
  );
  if (!claimed) fail(409, "Your defense is already being graded");

  try {
    // Expired or empty answers score 0 without spending model tokens.
    const answered = claimed.questions.filter((q) => !q.expired && q.answer);
    let grades = new Map();
    let usage = null;
    if (answered.length) {
      const ids = answered.map((q) => q.id);
      const messages = buildGradingMessages({ questions: answered, nonce: randomBytes(12).toString("hex") });
      ({ grades, usage } = await callWithOneRetry(
        () => runStructured(messages, gradingJsonSchema(ids), "capstone_defense_grading"),
        (content) => parseGrades(content, ids),
        "capstone defense grading",
      ));
    }

    const questions = claimed.questions.map((q) => {
      const g = grades.get(q.id);
      return g
        ? { ...q, score: g.score, feedback: g.feedback }
        : { ...q, score: 0, feedback: q.expired ? "No answer within the time limit." : "No answer given." };
    });
    const result = scoreDefense(questions.map((q) => q.score), ctx.brief.passThresholds.defense);
    const injected = scanForInjection(answered.map((q) => ({ path: q.id, text: q.answer })));

    const graded = await db.collection(DEFENSES).findOneAndUpdate(
      { _id: claimed._id, status: "grading", lockedAt: claimed.lockedAt },
      {
        $set: {
          status: "graded",
          questions,
          result,
          gradedAt: new Date(),
          gradingUsage: usage,
          flags: injected.length ? [{ id: "prompt-injection-suspected", detail: injected.join(", ") }] : [],
        },
        $unset: { lockedAt: "" },
      },
      { returnDocument: "after" },
    );
    if (!graded) fail(409, "Your defense is already being graded");

    const allSessions = sessions.map((s) => (s._id.equals(graded._id) ? graded : s));
    const attempt = await applyResult(
      db,
      userId,
      ctx.attempt,
      graded,
      ctx.brief,
      allSessions.filter((s) => s.status === "graded"),
    );
    return view(attempt, graded, ctx.brief, ctx.submission, allSessions);
  } catch (err) {
    await db
      .collection(DEFENSES)
      .updateOne({ _id: claimed._id, status: "grading", lockedAt: claimed.lockedAt }, { $set: { status: "answered" }, $unset: { lockedAt: "" } })
      .catch(() => {});
    throw err;
  }
};

/**
 * Answer the open question. On time → stored; late → kept for the admin as
 * `lateAnswer` but scored 0. The next question is served in the same update,
 * so its clock starts the moment this response goes out.
 * After the last answer, grading runs immediately; if grading fails the answers
 * are safe and the client retries with POST /defense/grade.
 */
export const answerDefenseService = async (db, userId, trackId, { questionId, answer, integrity }) => {
  await ensureIndexes(db);
  const { attempt, brief, submission } = await loadContext(db, userId, trackId);
  if (attempt.status !== "defense") fail(409, "There is no defense in progress");

  const sessions = await getSessions(db, attempt._id);
  const session = sessions.at(-1);
  if (!session || session.status !== "active") fail(409, "There is no defense in progress");

  const i = session.currentIndex;
  const q = session.questions[i];
  if (q.id !== questionId) fail(409, "That question is no longer open");
  if (!q.askedAt) fail(409, "Load the question before answering it");

  const now = new Date();
  const text = normalizeAnswer(answer);
  const late = !isOnTime(q.askedAt, now);
  const last = i + 1 === session.questions.length;

  const updated = await db.collection(DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i },
    {
      $set: {
        [`questions.${i}.answer`]: late ? "" : text,
        [`questions.${i}.expired`]: late,
        [`questions.${i}.answeredAt`]: now,
        [`questions.${i}.integrity`]: integrity,
        ...(late ? { [`questions.${i}.lateAnswer`]: text } : {}),
        currentIndex: i + 1,
        ...(last ? { status: "answered" } : { [`questions.${i + 1}.askedAt`]: now }),
      },
    },
    { returnDocument: "after" },
  );
  if (!updated) fail(409, "That question is no longer open");

  if (last) {
    try {
      return await gradeDefenseService(db, userId, trackId);
    } catch (err) {
      // Answers are saved; only grading failed. Tell the client to retry it.
      const fresh = await getSessions(db, attempt._id);
      return {
        ...view(attempt, fresh.at(-1), brief, submission, fresh),
        gradingError: err.status ? err.message : "Grading failed. Try again in a minute.",
      };
    }
  }

  sessions[sessions.length - 1] = updated;
  return view(attempt, updated, brief, submission, sessions);
};
