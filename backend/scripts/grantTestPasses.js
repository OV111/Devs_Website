/**
 * TESTING ONLY — give an account a passed exam for every layer of a track, so
 * the capstone (which unlocks after all layer exams) can be tried without
 * sitting ten exams.
 *
 * Usage:
 *   node backend/scripts/grantTestPasses.js <username> <trackId> --yes
 *   node backend/scripts/grantTestPasses.js <username> <trackId> --undo --yes
 *
 * What it writes, and why it is safe to undo:
 *  - one exam_attempts row per layer the user has NOT already passed, marked
 *    `seededForTesting: true`. Real passes are never touched or duplicated.
 *  - layerProgress.<layer> = "done", exactly as a real pass does, so the
 *    roadmap shows the layers as done.
 *  - no exam history, no analytics events, no XP: the funnel and the mastery
 *    engine never see fake evidence.
 * --undo deletes only the rows marked seededForTesting for that user and track.
 * (layerProgress is self-reported anyway and is left as is.)
 *
 * --yes is required because this writes to whatever MONGO_URI points at.
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB, { closeDB } from "../config/db.js";

const [username, trackId] = process.argv.slice(2);
const undo = process.argv.includes("--undo");
const confirmed = process.argv.includes("--yes");

const exit = async (code, message) => {
  if (message) (code ? console.error : console.log)(message);
  await closeDB().catch(() => {});
  process.exit(code);
};

if (!username || !trackId || username.startsWith("--") || trackId.startsWith("--")) {
  await exit(1, "Usage: node backend/scripts/grantTestPasses.js <username> <trackId> [--undo] --yes");
}

const host = (process.env.MONGO_URI ?? "").replace(/\/\/[^@]*@/, "//").split("/")[2] ?? "unknown";
if (!confirmed) {
  await exit(1, `Refusing to run without --yes. This writes to the database at ${host}.`);
}

const db = await connectDB();
const user = await db.collection("users").findOne({ username }, { projection: { _id: 1, username: 1 } });
if (!user) await exit(1, `No user named "${username}".`);

const layers = await db
  .collection("roadmap_layers")
  .find({ trackId }, { projection: { layerId: 1, categoryId: 1, _id: 0 } })
  .sort({ order: 1 })
  .toArray();
if (layers.length === 0) await exit(1, `Unknown track "${trackId}".`);
const layerIds = layers.map((l) => l.layerId);

if (undo) {
  const { deletedCount } = await db
    .collection("exam_attempts")
    .deleteMany({ userId: user._id, layer: { $in: layerIds }, seededForTesting: true });
  await exit(0, `✓ removed ${deletedCount} seeded pass(es) for ${username} on ${trackId} (${host}). Real passes untouched.`);
}

const alreadyPassed = new Set(
  await db.collection("exam_attempts").distinct("layer", { userId: user._id, passed: true, layer: { $in: layerIds } }),
);
const now = new Date();
const toSeed = layers.filter((l) => !alreadyPassed.has(l.layerId));

if (toSeed.length) {
  await db.collection("exam_attempts").insertMany(
    toSeed.map((l) => ({
      userId: user._id,
      path: l.categoryId, // exam_attempts.path is the category, as the exam engine writes it
      layer: l.layerId,
      questions: [],
      startedAt: now,
      expiresAt: now,
      submitted: true,
      submittedAt: now,
      score: 100,
      passed: true,
      seededForTesting: true,
    })),
  );
  await db
    .collection("userProgress")
    .updateOne(
      { userId: user._id },
      { $set: { ...Object.fromEntries(toSeed.map((l) => [`layerProgress.${l.layerId}`, "done"])), updatedAt: now } },
      { upsert: true },
    );
}

const seededTotal = await db
  .collection("exam_attempts")
  .distinct("layer", { userId: user._id, layer: { $in: layerIds }, seededForTesting: true });
const real = layerIds.length - toSeed.length - (seededTotal.length - toSeed.length);
await exit(
  0,
  `✓ ${username} on ${trackId} (${host}): ${real} passed for real, ${seededTotal.length} seeded for testing ` +
    `(${toSeed.length} added now) → ${alreadyPassed.size + toSeed.length}/${layerIds.length} passed.`,
);
