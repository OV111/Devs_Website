import { isOnTime } from "./defense.js";

/**
 * Is a defense question on the clock RIGHT NOW? Pure, so it is unit-tested.
 *
 * "Active" sessions are not enough: a learner who walks away leaves a session
 * active until their next read, and blocking the mentor on that would lock
 * them out of help indefinitely. Only a served, unanswered question whose
 * timer is still running counts — at most ~3 minutes per question.
 */
export const isDefenseLive = (session, now = new Date()) => {
  if (session?.status !== "active") return false;
  const q = session.questions?.[session.currentIndex];
  return Boolean(q?.askedAt && !q.answeredAt && isOnTime(q.askedAt, now));
};
