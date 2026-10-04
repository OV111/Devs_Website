/**
 * Pure helpers: what the client is allowed to see, and twist selection.
 * No DB access here, so they are unit-tested directly.
 */

import { randomInt } from "crypto";
import { DEFENSE_QUESTION_MS } from "./constants.js";

/**
 * The brief as the learner sees it. Rubric criteria keep their name and
 * description (the learner must know what is judged), but weights and pass
 * thresholds stay server-side so nobody can optimise against exact numbers.
 * The twist pool is never sent — only the learner's own twist, on the attempt.
 */
export const toPublicBrief = (brief) => ({
  id: brief._id.toString(),
  trackId: brief.trackId,
  slug: brief.slug,
  version: brief.version,
  title: brief.title,
  summary: brief.summary,
  stack: brief.stack ?? [],
  // `checked`: verified automatically on submit. The check itself (its file
  // pattern) stays server-side.
  requirements: brief.requirements.map(({ id, text, check }) => ({ id, text, checked: Boolean(check) })),
  rubric: brief.rubric.map(({ id, name, description }) => ({ id, name, description })),
  rules: brief.rules ?? [],
});

export const toPublicAttempt = (attempt, brief) => {
  const twist = brief?.twistPool.find((t) => t.id === attempt.twistId);
  return {
    id: attempt._id.toString(),
    attemptNumber: attempt.attemptNumber,
    status: attempt.status,
    briefVersion: attempt.briefVersion,
    twist: twist ? { id: twist.id, text: twist.text } : null,
    startedAt: attempt.startedAt,
    cooldownUntil: attempt.cooldownUntil ?? null,
    defenseRetryAt: attempt.defenseRetryAt ?? null,
  };
};

const codeUrl = (submission, codeRef) =>
  submission?.repo && codeRef
    ? `${submission.repo.htmlUrl}/blob/${submission.commitSha}/${codeRef.path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}${codeRef.line ? `#L${codeRef.line}` : ""}`
    : null;

/**
 * A defense session as the learner sees it. Only the open question is shown
 * (with its server-side deadline), plus the ones already behind them.
 * Expected points, code excerpts, integrity counters and flags never leave
 * the server; scores and feedback appear only once the session is graded.
 */
export const toPublicDefense = (session, submission, now = new Date()) => {
  const questions = session.questions ?? [];
  const graded = session.status === "graded";
  const i = session.currentIndex ?? 0;
  const open = session.status === "active" ? questions[i] : null;
  const ref = (q) => ({ codeRef: q.codeRef, codeUrl: codeUrl(submission, q.codeRef) });

  return {
    id: session._id.toString(),
    sessionNumber: session.sessionNumber,
    status: session.status,
    total: questions.length,
    answeredCount: Math.min(i, questions.length),
    current:
      open?.askedAt
        ? {
            id: open.id,
            number: i + 1,
            text: open.text,
            ...ref(open),
            askedAt: open.askedAt,
            deadline: new Date(open.askedAt.getTime() + DEFENSE_QUESTION_MS),
            secondsLeft: Math.max(0, Math.round((open.askedAt.getTime() + DEFENSE_QUESTION_MS - now.getTime()) / 1000)),
          }
        : null,
    answered: questions.slice(0, i).map((q) => ({
      id: q.id,
      text: q.text,
      ...ref(q),
      answer: q.answer ?? "",
      expired: Boolean(q.expired),
      ...(graded ? { score: q.score, maxScore: 4, feedback: q.feedback } : {}),
    })),
    result: graded ? { score: session.result.score, passed: session.result.passed } : null,
  };
};

/**
 * A submission as the learner sees it: the repo, the pinned commit and the
 * check results. Integrity flags are admin-only and never included.
 */
export const toPublicSubmission = (s) => ({
  id: s._id.toString(),
  repo: s.repo ? { fullName: s.repo.fullName, url: s.repo.htmlUrl } : null,
  commitSha: s.commitSha ?? null,
  passed: s.passed,
  checks: s.checks,
  submittedAt: s.submittedAt,
});

/**
 * A rubric review as the learner sees it: per-criterion score, feedback and
 * evidence, the total and the outcome. Weights, the pass mark, the model's
 * input files and integrity flags stay server-side.
 */
export const toPublicReview = (review, brief) => {
  const nameOf = new Map((brief?.rubric ?? []).map((c) => [c.id, c.name]));
  return {
    id: review._id.toString(),
    totalScore: review.totalScore,
    passed: review.passed,
    summary: review.summary,
    criteria: review.criteria.map((c) => ({
      id: c.id,
      name: nameOf.get(c.id) ?? c.id,
      score: c.score,
      maxScore: 4,
      feedback: c.feedback,
      evidence: c.evidence,
    })),
    createdAt: review.createdAt,
  };
};

/**
 * Pick a twist the learner has not had before, so a retry is a fresh problem
 * rather than a resubmission of last time's work. Falls back to the full pool
 * once every twist has been used. `rand` is injectable for tests.
 */
export const pickTwist = (twistPool, usedTwistIds = [], rand = randomInt) => {
  if (!twistPool?.length) throw new Error("Brief has an empty twistPool");
  const used = new Set(usedTwistIds);
  const fresh = twistPool.filter((t) => !used.has(t.id));
  const pool = fresh.length ? fresh : twistPool;
  return pool[rand(pool.length)];
};
