/**
 * Recruiter scorecard, step 1: data shapes.
 *
 * A developer's scorecard is a PUBLIC page for recruiters, so it is opt-in and
 * the developer picks which sections show. Settings live in their own
 * collection (not on `users`) so they can never leak through a user projection
 * and the allow-list in userService.js stays untouched.
 *
 * recruiter_settings: { userId, enabled, openToWork, show: { exams, capstone, teams, strengths },
 *                       createdAt, updatedAt }
 *   - `enabled: false` (the default, and the state of anyone with no document)
 *     means the scorecard answers 404, exactly like an unknown username.
 *   - `show.strengths` is the only section built from weak-spot data, so it
 *     defaults to off: weak spots are never shown without explicit consent.
 *
 * Scorecard response (built in step 2, never stored): see RECRUITER_SCORECARD_SECTIONS.
 */

export const RECRUITER_SETTINGS = "recruiter_settings";

export const RECRUITER_SCORECARD_SECTIONS = Object.freeze(["exams", "capstone", "teams", "strengths"]);

/** What a developer with no document (or a new opt-in) gets. */
export const DEFAULT_RECRUITER_SETTINGS = Object.freeze({
  enabled: false,
  openToWork: false, // an explicit signal from the developer; never inferred
  show: Object.freeze({ exams: true, capstone: true, teams: true, strengths: false }),
});

let indexesReady = null;
export const ensureIndexes = (db) => {
  indexesReady ??= db
    .collection(RECRUITER_SETTINGS)
    .createIndex({ userId: 1 }, { unique: true }) // one settings document per developer
    .catch((err) => {
      indexesReady = null; // retry on the next request instead of caching a failure
      throw err;
    });
  return indexesReady;
};

export const fail = (status, message) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};
