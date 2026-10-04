/**
 * TESTING ONLY — reopen a user's latest FAILED capstone attempt so it can be
 * submitted again immediately, without waiting out the 72-hour cooldown.
 *
 * Usage:
 *   node backend/scripts/reopenCapstone.js <username> <trackId> --yes
 *
 * Unlike resetCapstone.js this keeps the attempt (and so its start time).
 * That matters: the "repository was created after you started" check is
 * measured from the FIRST attempt's start, so a full reset would move the start
 * later than a repository created in the meantime and make it fail.
 *
 * What it does: attempt "failed" → "started" (cooldown and result cleared);
 * deletes that attempt's review and defense sessions so the page does not show
 * the old result; KEEPS its submissions as history. Admin accounts only; writes
 * to whatever MONGO_URI points at, hence --yes.
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

if (!username || !trackId || username.startsWith("--") || trackId.startsWith("--")) {
  await exit(1, "Usage: node backend/scripts/reopenCapstone.js <username> <trackId> --yes");
}
const host = (process.env.MONGO_URI ?? "").replace(/\/\/[^@]*@/, "//").split("/")[2] ?? "unknown";
if (!confirmed) await exit(1, `Refusing to run without --yes. This writes to the database at ${host}.`);

const db = await connectDB();
const user = await db.collection("users").findOne({ username }, { projection: { _id: 1, role: 1 } });
if (!user) await exit(1, `No user named "${username}".`);
if (user.role !== "admin") await exit(1, `"${username}" is not an admin. This tool is for test accounts only.`);

const attempt = await db
  .collection("capstone_attempts")
  .find({ userId: user._id, trackId })
  .sort({ attemptNumber: -1 })
  .limit(1)
  .next();
if (!attempt) await exit(1, `${username} has no ${trackId} capstone attempt.`);
if (attempt.status !== "failed") {
  await exit(1, `The latest attempt is "${attempt.status}", not "failed". Nothing to reopen.`);
}

const { modifiedCount } = await db.collection("capstone_attempts").updateOne(
  { _id: attempt._id, status: "failed" },
  {
    $set: { status: "started", cooldownUntil: null, updatedAt: new Date() },
    $unset: {
      finishedAt: "",
      reviewId: "",
      submissionId: "",
      defenseRetryAt: "",
      lastDefenseSessionId: "",
      defenseScore: "",
      override: "",
    },
  },
);
if (!modifiedCount) await exit(1, "The attempt changed while this ran. Nothing was reopened; run it again.");

const byAttempt = { attemptId: attempt._id };
const [reviews, defenses] = await Promise.all([
  db.collection("capstone_reviews").deleteMany(byAttempt),
  db.collection("capstone_defenses").deleteMany(byAttempt),
]);

await exit(
  0,
  `✓ ${username} on ${trackId} (${host}): attempt ${attempt.attemptNumber} is open again ` +
    `(started ${attempt.startedAt.toISOString()}, unchanged). Removed ${reviews.deletedCount} review(s) and ` +
    `${defenses.deletedCount} defense session(s); submissions are kept.\n  Submit your repository on /capstone.`,
);
