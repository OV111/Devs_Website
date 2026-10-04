/**
 * TESTING ONLY — wipe one user's capstone progress for one track, so the whole
 * flow can be tried again from "Start".
 *
 * Usage:
 *   node backend/scripts/resetCapstone.js <username> <trackId>          # dry run: only counts
 *   node backend/scripts/resetCapstone.js <username> <trackId> --yes    # actually delete
 *
 * Why it exists: a failed review uses up an attempt and starts a 72-hour
 * cooldown (3 attempts in total), which would lock a real test account out.
 *
 * Deletes, for that user and track only: attempts, submissions, reviews,
 * defense sessions and the certificate. Admin audit-log rows are kept (they are
 * append-only history). Exam passes and everything else on the account are
 * never touched. Writes to whatever MONGO_URI points at, hence --yes.
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
    "Usage: node backend/scripts/resetCapstone.js <username> <trackId> [--yes]",
  );
}

const host =
  (process.env.MONGO_URI ?? "").replace(/\/\/[^@]*@/, "//").split("/")[2] ??
  "unknown";
const db = await connectDB();
const user = await db
  .collection("users")
  .findOne({ username }, { projection: { _id: 1 } });
if (!user) await exit(1, `No user named "${username}".`);

const attempts = await db
  .collection("capstone_attempts")
  .find(
    { userId: user._id, trackId },
    { projection: { _id: 1, status: 1, attemptNumber: 1 } },
  )
  .toArray();
const attemptIds = attempts.map((a) => a._id);

const byAttempt = { attemptId: { $in: attemptIds } };
const counts = {
  attempts: attempts.length,
  submissions: await db
    .collection("capstone_submissions")
    .countDocuments(byAttempt),
  reviews: await db.collection("capstone_reviews").countDocuments(byAttempt),
  defenses: await db.collection("capstone_defenses").countDocuments(byAttempt),
  certificates: await db
    .collection("certificates")
    .countDocuments({ userId: user._id, trackId }),
};
const summary = Object.entries(counts)
  .map(([k, v]) => `${v} ${k}`)
  .join(", ");

if (!confirmed) {
  await exit(
    0,
    `Dry run for ${username} on ${trackId} (${host}): would delete ${summary}.\nAdd --yes to delete.`,
  );
}

await Promise.all([
  db.collection("capstone_submissions").deleteMany(byAttempt),
  db.collection("capstone_reviews").deleteMany(byAttempt),
  db.collection("capstone_defenses").deleteMany(byAttempt),
  db.collection("certificates").deleteMany({ userId: user._id, trackId }),
]);
// attempts last: the other rows are found through them
await db
  .collection("capstone_attempts")
  .deleteMany({ userId: user._id, trackId });

await exit(
  0,
  `✓ ${username} on ${trackId} (${host}): deleted ${summary}. The capstone is back to "Start".`,
);
