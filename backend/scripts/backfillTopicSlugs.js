/**
 * Backfill canonical topic slugs (Stage 0).
 *
 * Usage:
 *   MONGO_URI=... node backend/scripts/backfillTopicSlugs.js          # dry run
 *   MONGO_URI=... node backend/scripts/backfillTopicSlugs.js --write  # apply
 *
 * Every read path already falls back to slugifying the display topic at runtime
 * (see utils/topicKey.js), so this script is an optimisation, not a prerequisite:
 * it exists so the slug becomes an indexable stored field rather than something
 * recomputed on each read. Safe to re-run — it only touches documents that are
 * missing or disagree with the computed slug.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";
import { toTopicSlug } from "../utils/topicKey.js";

// Same env files, in the same order, as backend/server.js. dotenv never
// overrides an already-set variable, so an inline MONGO_URI still wins.
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const APPLY = process.argv.includes("--write");

/**
 * Collections holding a topic, and the slug field each one should carry.
 * `arrayField` marks a list of topic strings (examHistory.missedTopics) rather
 * than a single value, because that one needs a parallel array of slugs.
 */
const TARGETS = [
  { collection: "weakSpots", topicField: "topic", slugField: "slug" },
  { collection: "teach_back_sessions", topicField: "topic", slugField: "topicSlug" },
  { collection: "teach_back_rubrics", topicField: "topic", slugField: "topicSlug" },
  {
    collection: "examHistory",
    topicField: "missedTopics",
    slugField: "missedTopicSlugs",
    arrayField: true,
  },
];

const slugsFor = (value) => [
  ...new Set((Array.isArray(value) ? value : []).map(toTopicSlug).filter(Boolean)),
];

const sameSet = (a = [], b = []) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const backfill = async (db, { collection, topicField, slugField, arrayField }) => {
  const col = db.collection(collection);
  // Only load the two fields that matter — these collections hold full essay
  // answers and question banks, which there is no reason to pull over the wire.
  const docs = await col
    .find({}, { projection: { [topicField]: 1, [slugField]: 1 } })
    .toArray();

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const expected = arrayField ? slugsFor(doc[topicField]) : toTopicSlug(doc[topicField]);
    const current = doc[slugField];

    const upToDate = arrayField
      ? Array.isArray(current) && sameSet(current, expected)
      : current === expected;

    // Nothing to write, or nothing slugifiable to write.
    if (upToDate || (!arrayField && !expected)) {
      skipped++;
      continue;
    }

    if (APPLY) {
      await col.updateOne({ _id: doc._id }, { $set: { [slugField]: expected } });
    }
    updated++;
  }

  console.log(
    `  ${collection.padEnd(22)} ${String(updated).padStart(5)} to update, ${String(skipped).padStart(5)} already correct`,
  );
  return updated;
};

/**
 * Indexes that make the slug worth storing. Created here rather than in the
 * services because index creation is a deploy-time concern — doing it on every
 * request would be a needless round-trip.
 */
const ensureIndexes = async (db) => {
  await db.collection("weakSpots").createIndex({ userId: 1, resolvedAt: 1 });
  await db.collection("weakSpots").createIndex({ userId: 1, slug: 1 });
  await db.collection("examHistory").createIndex({ userId: 1, takenAt: -1 });
  await db.collection("teach_back_sessions").createIndex({ userId: 1, startedAt: -1 });
  await db.collection("challengeResults").createIndex({ userId: 1, solvedAt: -1 });
  await db.collection("teach_back_rubrics").createIndex({ path: 1, layer: 1, topicSlug: 1 });
  console.log("  ✓ indexes ensured");
};

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");

  console.log(`Connected. Mode: ${APPLY ? "WRITE" : "DRY RUN (pass --write to apply)"}\n`);

  let total = 0;
  for (const target of TARGETS) {
    total += await backfill(db, target);
  }

  if (APPLY) {
    console.log("\nEnsuring indexes...");
    await ensureIndexes(db);
  }

  console.log(
    `\n${APPLY ? "Updated" : "Would update"} ${total} document(s) across ${TARGETS.length} collections.`,
  );
  await mongo.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
