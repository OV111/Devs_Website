/**
 * What the AI mentor may know about a learner's capstone (stage 7).
 *
 * Two rules:
 *  1. The mentor coaches on FEEDBACK, never on answers: expected points, code
 *     excerpts, integrity data and flags are never included here.
 *  2. While a defense question is on the clock the mentor is unavailable
 *     (see hasLiveDefense) — otherwise the learner could ask it the answers.
 */

import { ObjectId } from "mongodb";
import { isDefenseLive } from "../lib/liveDefense.js";
import { ATTEMPTS, BRIEFS, CERTIFICATES, DEFENSES, REVIEWS } from "./capstoneData.js";

export const hasLiveDefense = async (db, userId, now = new Date()) => {
  const sessions = await db
    .collection(DEFENSES)
    .find({ userId: new ObjectId(userId), status: "active" }, { projection: { status: 1, currentIndex: 1, questions: 1 } })
    .toArray();
  return sessions.some((s) => isDefenseLive(s, now));
};

/** The learner's latest attempt per track, shaped for coaching. */
export const getCapstoneMentorView = async (db, userId) => {
  const ownerId = new ObjectId(userId);
  const attempts = await db.collection(ATTEMPTS).find({ userId: ownerId }).sort({ attemptNumber: -1 }).toArray();
  // Sorted newest first, so keep the FIRST attempt seen per track. (new Map(entries)
  // would keep the last one — the oldest attempt.)
  const latestByTrack = new Map();
  for (const a of attempts) if (!latestByTrack.has(a.trackId)) latestByTrack.set(a.trackId, a);
  const latestPerTrack = [...latestByTrack.values()];
  if (latestPerTrack.length === 0) return { capstones: [], note: "The learner has not started a capstone." };

  const capstones = await Promise.all(
    latestPerTrack.map(async (attempt) => {
      const [brief, review, lastDefense, certificate] = await Promise.all([
        db.collection(BRIEFS).findOne({ _id: attempt.briefId }, { projection: { title: 1, rubric: 1, twistPool: 1 } }),
        attempt.reviewId ? db.collection(REVIEWS).findOne({ _id: attempt.reviewId }) : null,
        db.collection(DEFENSES).find({ attemptId: attempt._id, status: "graded" }).sort({ sessionNumber: -1 }).limit(1).next(),
        db.collection(CERTIFICATES).findOne({ userId: ownerId, trackId: attempt.trackId }, { projection: { publicId: 1, revokedAt: 1 } }),
      ]);
      const nameOf = new Map((brief?.rubric ?? []).map((c) => [c.id, c.name]));

      return {
        trackId: attempt.trackId,
        project: brief?.title ?? null,
        twist: brief?.twistPool.find((t) => t.id === attempt.twistId)?.text ?? null,
        status: attempt.status,
        attemptNumber: attempt.attemptNumber,
        cooldownUntil: attempt.cooldownUntil ?? null,
        defenseRetryAt: attempt.defenseRetryAt ?? null,
        review: review && {
          totalScore: review.totalScore,
          passed: review.passed,
          summary: review.summary,
          criteria: review.criteria.map((c) => ({ name: nameOf.get(c.id) ?? c.id, score: c.score, outOf: 4, feedback: c.feedback })),
        },
        lastDefense: lastDefense && {
          score: lastDefense.result.score,
          passed: lastDefense.result.passed,
          // Question + feedback only: the learner already saw both. No expected points.
          questions: lastDefense.questions.map((q) => ({ question: q.text, score: q.score, outOf: 4, feedback: q.feedback })),
        },
        certificate: certificate && { verifyPath: `/verify/${certificate.publicId}`, revoked: Boolean(certificate.revokedAt) },
      };
    }),
  );

  return {
    capstones,
    coachingRules:
      "Coach from this feedback Socratically. Never write capstone code, never draft answers to defense questions, " +
      "and never reveal what a grader expects — help the learner understand the concept so they can do it themselves.",
  };
};
