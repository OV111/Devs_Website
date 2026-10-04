/**
 * Capstone rules in one place, so the service, tests and (later) the admin
 * view all read the same numbers. Decided 2026-10-03.
 */

// A capstone attempt that has not reached a final state yet. Used to find the
// learner's "current" attempt and to refuse a second concurrent one.
//   started   → building; may submit
//   checking  → a submission's automated checks are running (short lock)
//   submitted → automated checks passed; waiting for the AI review
//   reviewing → the AI rubric review is running (short lock)
//   defense   → rubric passed; answering defense questions (stage 4)
// Final: passed, or failed (rubric or defense below the pass mark).
export const OPEN_STATUSES = Object.freeze(["started", "checking", "submitted", "reviewing", "defense"]);
export const FINAL_STATUSES = Object.freeze(["passed", "failed"]);

// Failed attempts a learner may use per track before the capstone locks.
export const MAX_ATTEMPTS = 3;

// Wait after a failed attempt before the next one can start.
export const COOLDOWN_HOURS = 72;
export const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

// Pass marks as fractions of the maximum score. Brief documents may override
// them per brief; these are the defaults the seeder writes.
export const DEFAULT_PASS_THRESHOLDS = Object.freeze({ rubric: 0.7, defense: 0.6 });

// ── Submissions (stage 2) ─────────────────────────────────────

// Each submission costs ~5 GitHub API calls. Unauthenticated, the whole server
// gets 60 calls/hour, so production needs GITHUB_TOKEN (5,000/hour).
export const MAX_SUBMISSIONS_PER_DAY = 10;

// A "checking" lock older than this is treated as abandoned (crashed request),
// so a learner is never stuck unable to resubmit.
export const CHECK_LOCK_STALE_MS = 5 * 60 * 1000;

// Hard limits on what we are willing to fetch and (in stage 3) send to the LLM.
export const MAX_REPO_SIZE_KB = 25 * 1024; // GitHub's approximate repo size
export const MAX_REPO_FILES = 1500;

// Fewer commits than this is flagged (not failed) as a possible copy-paste dump.
export const MIN_COMMITS_BEFORE_FLAG = 5;

export const GITHUB_TIMEOUT_MS = 10_000;

// ── AI rubric review (stage 3) ────────────────────────────────

export const REVIEW_MODEL = "openai/gpt-oss-120b"; // same family as teach-back grading
export const REVIEW_PROMPT_VERSION = "capstone-review-v2"; // bump on any prompt change

// How much repository text one review may send. ~3.5 chars per token, so the
// default (~23k tokens) needs a PAID Groq tier: the free tier allows 8k tokens
// per minute for gpt-oss-120b. For local dev on a free key set
// CAPSTONE_REVIEW_MAX_CHARS=16000.
export const DEFAULT_REVIEW_MAX_CHARS = 80_000;
export const REVIEW_MAX_FILE_CHARS = 12_000; // longer files are truncated
export const REVIEW_SKIP_FILE_BYTES = 200_000; // larger files are never downloaded
export const REVIEW_MAX_FILES = 60;
export const REVIEW_FETCH_CONCURRENCY = 6;

// A "reviewing" claim older than this belongs to a request that died.
export const REVIEW_LOCK_STALE_MS = 10 * 60 * 1000;

// Rubric scale is 0–4 per criterion. A criterion at or below this becomes a
// weak spot for the layer that teaches it.
export const RUBRIC_MAX_SCORE = 4;
export const WEAK_SPOT_MAX_SCORE = 1;

// ── Defense (stage 4) ─────────────────────────────────────────

export const DEFENSE_QUESTION_COUNT = 5;
export const DEFENSE_QUESTION_MS = 3 * 60 * 1000; // per question, enforced server-side
// Network latency allowance on top of the visible timer, so an answer sent at
// 2:59 is not rejected for arriving at 3:01.
export const DEFENSE_GRACE_MS = 15 * 1000;
export const DEFENSE_ANSWER_MAX_CHARS = 3000;
// Defense sessions per attempt. A failed session waits COOLDOWN_MS before the
// next; failing the last one fails the whole attempt.
export const MAX_DEFENSE_SESSIONS = 3;
// A "generating"/"grading" claim older than this belongs to a dead request.
export const DEFENSE_LOCK_STALE_MS = 5 * 60 * 1000;
// Lines of code shown around each question's reference, for grading.
export const DEFENSE_EXCERPT_RADIUS = 20;

// ── What the AI reviewer sees of each kind of file (stage 3, v2) ──────────
// The budget is small on purpose (free Groq tiers), so it goes to CODE first:
// documentation and config get a short slice each, noise comes last.
export const REVIEW_FILE_CAPS = Object.freeze({
  doc: 1200, // README
  manifest: 1000, // package.json, go.mod, Cargo.toml …
  ops: 500, // Dockerfile, compose, .env.example, CI workflow
  source: 4500,
  test: 3500,
  other: 2500, // other docs / data files
  noise: 400, // .gitignore, linter config, tsconfig …
});
// A file that does not fit whole is still shown partially if at least this
// much room is left, rather than hidden entirely.
export const REVIEW_MIN_PARTIAL_CHARS = 1500;
// Room set aside for tests so they are not squeezed out by large source files.
export const REVIEW_TEST_RESERVE = Object.freeze({ fraction: 0.15, min: 1500, max: 3500 });
