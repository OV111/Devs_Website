/**
 * TESTING ONLY — fast-forward a capstone attempt past submission and AI review,
 * straight to the defense, so the rest of the flow can be tried without
 * writing a project that scores 70%.
 *
 * Usage:
 *   node backend/scripts/seedTestReview.js <username> <trackId> --yes
 *
 * What it does, for ONE admin account:
 *  - borrows the repo from a submission the user already made on this attempt
 *    (it can have failed its checks; only the repo, commit and tree are used),
 *  - records it as an accepted submission and adds a passing AI review with
 *    placeholder feedback, both marked seededForTesting,
 *  - moves the attempt "started" → "defense".
 * From there everything is real: the defense questions are generated from the
 * borrowed repo's actual code by the real model and graded for real, and a pass
 * issues a certificate — labelled TEST on its public page.
 *
 * Safety rails: only admin accounts; only an open attempt in "started"; needs
 * a prior submission; requires --yes (writes to whatever MONGO_URI points at).
 * Undo everything with: npm run capstone:reset -- <username> <trackId> --yes
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB, { closeDB } from "../config/db.js";

const [username, trackId] = process.argv.slice(2);
const confirmed = process.argv.includes("--yes");

const exit = async (code, message) => {
  if (message) (code ? console.error : console.log)(message);
  await closeDB().catch(() => {});
  process.exit(code);
};

if (
  !username ||
  !trackId ||
  username.startsWith("--") ||
  trackId.startsWith("--")
) {
  await exit(
    1,
    "Usage: node backend/scripts/seedTestReview.js <username> <trackId> --yes",
  );
}
const host =
  (process.env.MONGO_URI ?? "").replace(/\/\/[^@]*@/, "//").split("/")[2] ??
  "unknown";
if (!confirmed)
  await exit(
    1,
    `Refusing to run without --yes. This writes to the database at ${host}.`,
  );

const db = await connectDB();

const user = await db
  .collection("users")
  .findOne({ username }, { projection: { _id: 1, role: 1 } });
if (!user) await exit(1, `No user named "${username}".`);
if (user.role !== "admin")
  await exit(
    1,
    `"${username}" is not an admin. This tool is for test accounts only.`,
  );

const attempt = await db
  .collection("capstone_attempts")
  .find({ userId: user._id, trackId })
  .sort({ attemptNumber: -1 })
  .limit(1)
  .next();
if (!attempt)
  await exit(
    1,
    `${username} has no ${trackId} capstone attempt. Press Start on /capstone first.`,
  );
if (attempt.status !== "started") {
  await exit(
    1,
    `The attempt is "${attempt.status}", not "started". Run npm run capstone:reset to start over.`,
  );
}

// A real public repo is needed for the defense: its code is what the questions are about.
const borrowed = await db
  .collection("capstone_submissions")
  .find({
    attemptId: attempt._id,
    "repo.fullName": { $exists: true },
    treeSha: { $ne: null },
  })
  .sort({ submittedAt: -1 })
  .limit(1)
  .next();
if (!borrowed) {
  await exit(
    1,
    "Submit any public repo on /capstone once first (it may fail the checks). Its code is used for the defense questions.",
  );
}

const brief = await db
  .collection("capstone_briefs")
  .findOne({ _id: attempt.briefId });
if (!brief) await exit(1, "The brief for this attempt no longer exists.");

const now = new Date();
const { _id: _old, ...borrowedFields } = borrowed;
const { insertedId: submissionId } = await db
  .collection("capstone_submissions")
  .insertOne({
    ...borrowedFields,
    passed: true,
    checks: [
      {
        id: "seeded",
        label: "Accepted by the test shortcut",
        passed: true,
        detail: null,
      },
    ],
    flags: [
      { id: "seeded-for-testing", detail: "created by seedTestReview.js" },
    ],
    submittedAt: now,
    seededForTesting: true,
  });

// Every criterion at 3/4 → 75%, above the 70% pass mark.
const SCORE = 3;
const earned = brief.rubric.reduce((sum, c) => sum + (c.weight * SCORE) / 4, 0);
const { insertedId: reviewId } = await db
  .collection("capstone_reviews")
  .insertOne({
    attemptId: attempt._id,
    submissionId,
    userId: user._id,
    trackId,
    criteria: brief.rubric.map((c) => ({
      id: c.id,
      score: SCORE,
      feedback:
        "TEST DATA — placeholder feedback created by the test shortcut, not a real review.",
      evidence: [],
    })),
    summary:
      "TEST DATA — this review was seeded for testing and is not a real assessment.",
    totalScore: Math.round(earned * 10) / 10,
    passed: true,
    passMark: brief.passThresholds.rubric,
    model: "test-seed",
    promptVersion: "test-seed",
    files: [],
    omittedCount: 0,
    flags: [],
    usage: null,
    durationMs: 0,
    createdAt: now,
    seededForTesting: true,
  });

const { modifiedCount } = await db
  .collection("capstone_attempts")
  .updateOne(
    { _id: attempt._id, status: "started" },
    { $set: { status: "defense", submissionId, reviewId, updatedAt: now } },
  );
if (!modifiedCount)
  await exit(
    1,
    "The attempt changed while this ran. Nothing was moved; run it again.",
  );

const budgetSet = Boolean(process.env.CAPSTONE_REVIEW_MAX_CHARS);
await exit(
  0,
  `✓ ${username} on ${trackId} (${host}): attempt ${attempt.attemptNumber} is now in the DEFENSE, using ${borrowed.repo.fullName} @ ${borrowed.commitSha.slice(0, 7)}.\n` +
    `  Open /capstone and press "start the defense".\n` +
    (budgetSet
      ? ""
      : `  ⚠ Set CAPSTONE_REVIEW_MAX_CHARS=12000 in backend/.env and restart the API first: on a free Groq key the default repo budget is too big for the defense questions.\n`) +
    `  Undo: npm run capstone:reset -- ${username} ${trackId} --yes`,
);
