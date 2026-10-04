/**
 * Can a learner start a new capstone attempt? Pure function over their past
 * attempts, so every rule is unit-tested without a database.
 *
 * Order matters: an open attempt wins (resume it), then a pass (done for good),
 * then the attempt cap, then the cooldown.
 */

import { OPEN_STATUSES, MAX_ATTEMPTS } from "./constants.js";

/**
 * @param {Array<{status:string, cooldownUntil?:Date|null, attemptNumber:number}>} attempts
 * @param {Date} now
 * @returns {{ canStart: boolean, reason: null|"open_attempt"|"already_passed"|"max_attempts"|"cooldown",
 *             retryAt: Date|null, failedCount: number }}
 */
export const evaluateStart = (attempts, now = new Date()) => {
  const failed = attempts.filter((a) => a.status === "failed");
  const result = (reason, retryAt = null) => ({
    canStart: reason === null,
    reason,
    retryAt,
    failedCount: failed.length,
  });

  if (attempts.some((a) => OPEN_STATUSES.includes(a.status))) return result("open_attempt");
  if (attempts.some((a) => a.status === "passed")) return result("already_passed");
  if (failed.length >= MAX_ATTEMPTS) return result("max_attempts");

  const latestFail = failed.reduce(
    (latest, a) => (!latest || a.attemptNumber > latest.attemptNumber ? a : latest),
    null,
  );
  if (latestFail?.cooldownUntil && latestFail.cooldownUntil > now) {
    return result("cooldown", latestFail.cooldownUntil);
  }

  return result(null);
};
