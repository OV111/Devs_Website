/**
 * Capstone admin (stage 7): review queue, full detail, overrides, revocation.
 *
 * Every write requires a reason and appends to capstone_admin_actions — an
 * append-only audit log. Overriding an AI decision is exactly the kind of
 * action that must be explainable later, to the learner and to ourselves.
 *
 * Admins see everything the learner never does: integrity flags, expected
 * points, late answers, paste/tab counters, model usage.
 */

import { ObjectId } from "mongodb";
import { revokeCapstoneXp } from "../../../services/xpService.js";
import { COOLDOWN_MS } from "../lib/constants.js";
import { ensureCertificate } from "./certificateService.js";
import {
  ADMIN_ACTIONS,
  ATTEMPTS,
  BRIEFS,
  CERTIFICATES,
  DEFENSES,
  REVIEWS,
  SUBMISSIONS,
  ensureIndexes,
  fail,
} from "./capstoneData.js";

const PAGE_SIZE = 25;

const logAction = (db, adminId, action, fields) =>
  db.collection(ADMIN_ACTIONS).insertOne({ adminId: new ObjectId(adminId), action, ...fields, at: new Date() });

const sumIntegrity = (sessions) =>
  sessions
    .flatMap((s) => s.questions ?? [])
    .reduce(
      (t, q) => ({
        tabSwitches: t.tabSwitches + (q.integrity?.tabSwitches ?? 0),
        pasteEvents: t.pasteEvents + (q.integrity?.pasteEvents ?? 0),
        lateAnswers: t.lateAnswers + (q.lateAnswer ? 1 : 0),
      }),
      { tabSwitches: 0, pasteEvents: 0, lateAnswers: 0 },
    );

/** The review queue: newest activity first, with every integrity signal summarised. */
export const listAttemptsService = async (db, { status, page = 1 }) => {
  await ensureIndexes(db);
  const filter = status ? { status } : {};
  const [attempts, total] = await Promise.all([
    db.collection(ATTEMPTS).find(filter).sort({ updatedAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
    db.collection(ATTEMPTS).countDocuments(filter),
  ]);

  // Batch the related reads: one query per collection for the whole page.
  const ids = attempts.map((a) => a._id);
  const [users, submissions, reviews, sessions] = await Promise.all([
    db.collection("users").find({ _id: { $in: attempts.map((a) => a.userId) } }, { projection: { username: 1 } }).toArray(),
    db.collection(SUBMISSIONS).find({ attemptId: { $in: ids } }, { projection: { attemptId: 1, flags: 1, passed: 1, submittedAt: 1, "repo.fullName": 1 } }).toArray(),
    db.collection(REVIEWS).find({ attemptId: { $in: ids } }, { projection: { attemptId: 1, totalScore: 1, passed: 1, flags: 1, createdAt: 1 } }).toArray(),
    db.collection(DEFENSES).find({ attemptId: { $in: ids } }, { projection: { attemptId: 1, status: 1, result: 1, flags: 1, "questions.integrity": 1, "questions.lateAnswer": 1 } }).toArray(),
  ]);
  const usernameOf = new Map(users.map((u) => [u._id.toString(), u.username]));
  const byAttempt = (rows) => {
    const m = new Map();
    for (const r of rows) {
      const k = r.attemptId.toString();
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return m;
  };
  const subs = byAttempt(submissions);
  const revs = byAttempt(reviews);
  const defs = byAttempt(sessions);

  return {
    page,
    pageSize: PAGE_SIZE,
    total,
    attempts: attempts.map((a) => {
      const k = a._id.toString();
      const mySubs = subs.get(k) ?? [];
      const myRevs = revs.get(k) ?? [];
      const myDefs = defs.get(k) ?? [];
      const flags = [...mySubs, ...myRevs, ...myDefs].flatMap((x) => x.flags ?? []).map((f) => f.id);
      const latestReview = myRevs.sort((x, y) => y.createdAt - x.createdAt)[0];
      const graded = myDefs.filter((s) => s.status === "graded");
      return {
        id: k,
        username: usernameOf.get(a.userId.toString()) ?? null,
        trackId: a.trackId,
        attemptNumber: a.attemptNumber,
        status: a.status,
        repo: mySubs.find((s) => s.passed)?.repo?.fullName ?? mySubs[0]?.repo?.fullName ?? null,
        reviewScore: latestReview?.totalScore ?? null,
        defenseScore: a.defenseScore ?? graded.at(-1)?.result?.score ?? null,
        flags: [...new Set(flags)],
        integrity: sumIntegrity(myDefs),
        overridden: Boolean(a.override),
        updatedAt: a.updatedAt,
      };
    }),
  };
};

const loadAttempt = async (db, attemptId) => {
  const attempt = await db.collection(ATTEMPTS).findOne({ _id: new ObjectId(attemptId) });
  if (!attempt) fail(404, "Attempt not found");
  return attempt;
};

/** Everything about one attempt, including what learners never see. */
export const getAttemptDetailService = async (db, attemptId) => {
  await ensureIndexes(db);
  const attempt = await loadAttempt(db, attemptId);
  const [user, brief, submissions, reviews, sessions, certificate, actions] = await Promise.all([
    db.collection("users").findOne({ _id: attempt.userId }, { projection: { username: 1, firstName: 1, lastName: 1, email: 1 } }),
    db.collection(BRIEFS).findOne({ _id: attempt.briefId }, { projection: { title: 1, version: 1, rubric: 1, twistPool: 1, passThresholds: 1 } }),
    db.collection(SUBMISSIONS).find({ attemptId: attempt._id }).sort({ submittedAt: -1 }).toArray(),
    db.collection(REVIEWS).find({ attemptId: attempt._id }).sort({ createdAt: -1 }).toArray(),
    db.collection(DEFENSES).find({ attemptId: attempt._id }).sort({ sessionNumber: 1 }).toArray(),
    db.collection(CERTIFICATES).findOne({ attemptId: attempt._id }),
    db.collection(ADMIN_ACTIONS).find({ attemptId: attempt._id }).sort({ at: -1 }).toArray(),
  ]);
  return {
    attempt,
    user,
    brief: brief && { ...brief, twist: brief.twistPool.find((t) => t.id === attempt.twistId) ?? null },
    submissions,
    reviews,
    defenses: sessions,
    certificate,
    integrity: sumIntegrity(sessions),
    actions,
  };
};

/**
 * Force an attempt's outcome.
 *  passed → requires a review (a certificate is a snapshot of real scores);
 *           issues the certificate.
 *  failed → starts the cooldown (it counts as a used attempt) and revokes any
 *           certificate already issued for it.
 * Only the learner's LATEST attempt on a track can be overridden: changing an
 * old one while a newer one exists would leave two outcomes for one track.
 *
 * In-flight work cannot undo this: every service's own write is conditional on
 * the status it claimed, so after an override those writes simply match nothing.
 */
export const overrideAttemptService = async (db, adminId, attemptId, { outcome, reason }) => {
  await ensureIndexes(db);
  const attempt = await loadAttempt(db, attemptId);

  const newer = await db.collection(ATTEMPTS).findOne({
    userId: attempt.userId,
    trackId: attempt.trackId,
    attemptNumber: { $gt: attempt.attemptNumber },
  });
  if (newer) fail(409, "Only the learner's latest attempt on this track can be overridden");
  if (attempt.status === outcome) fail(409, `The attempt is already ${outcome}`);
  if (outcome === "passed" && !attempt.reviewId) {
    fail(409, "An attempt can only be passed after its AI review exists — the certificate needs real scores");
  }

  const now = new Date();
  const override = { by: new ObjectId(adminId), at: now, reason, previousStatus: attempt.status };
  const fields =
    outcome === "passed"
      ? { status: "passed", finishedAt: now, cooldownUntil: null }
      : { status: "failed", finishedAt: now, cooldownUntil: new Date(now.getTime() + COOLDOWN_MS) };

  // Conditional on the status we just read, so a concurrent change (the learner
  // finishing their defense this second) makes the override fail loudly instead
  // of silently overwriting it.
  const updated = await db.collection(ATTEMPTS).findOneAndUpdate(
    { _id: attempt._id, status: attempt.status },
    {
      $set: { ...fields, override, updatedAt: now },
      $unset: { checkingSince: "", reviewingSince: "", defenseRetryAt: "" },
    },
    { returnDocument: "after" },
  );
  if (!updated) fail(409, "The attempt changed while you were looking at it. Reload and try again.");

  let certificate = null;
  if (outcome === "passed") {
    certificate = await ensureCertificate(db, updated.userId.toString(), updated);
  } else {
    await db.collection(CERTIFICATES).updateOne(
      { attemptId: attempt._id, revokedAt: null },
      { $set: { revokedAt: now, revokedReason: `Capstone outcome changed after review: ${reason}` } },
    );
    // The XP was a reward for a pass that no longer stands.
    await revokeCapstoneXp(db, attempt.userId, attempt._id).catch((err) =>
      console.error("capstone XP revoke failed (override already applied):", err),
    );
  }

  await logAction(db, adminId, "override", {
    attemptId: attempt._id,
    from: attempt.status,
    to: outcome,
    reason,
  });

  return { attempt: updated, certificate };
};

/** Revoke or restore a certificate. Revocation is shown on the public page. */
export const setCertificateRevokedService = async (db, adminId, publicId, { revoked, reason }) => {
  await ensureIndexes(db);
  const cert = await db.collection(CERTIFICATES).findOne({ publicId });
  if (!cert) fail(404, "Certificate not found");
  if (Boolean(cert.revokedAt) === revoked) fail(409, revoked ? "Already revoked" : "Not revoked");

  // Restoring a certificate whose attempt is no longer passed would show a
  // valid certificate for a failed capstone.
  if (!revoked) {
    const attempt = await db.collection(ATTEMPTS).findOne({ _id: cert.attemptId }, { projection: { status: 1 } });
    if (attempt?.status !== "passed") fail(409, "Restore the attempt to passed before restoring its certificate");
  }

  const updated = await db.collection(CERTIFICATES).findOneAndUpdate(
    { _id: cert._id },
    { $set: revoked ? { revokedAt: new Date(), revokedReason: reason } : { revokedAt: null, revokedReason: null } },
    { returnDocument: "after" },
  );
  if (revoked) {
    await revokeCapstoneXp(db, cert.userId, cert.attemptId).catch((err) =>
      console.error("capstone XP revoke failed (certificate already revoked):", err),
    );
  }
  await logAction(db, adminId, revoked ? "revoke_certificate" : "restore_certificate", {
    attemptId: cert.attemptId,
    publicId,
    reason,
  });
  return updated;
};
