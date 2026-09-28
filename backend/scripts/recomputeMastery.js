/**
 * Backfill learner mastery (Stage 4).
 *
 * Usage:
 *   node backend/scripts/recomputeMastery.js          # dry run — prints, writes nothing
 *   node backend/scripts/recomputeMastery.js --write   # apply
 *
 * The Adaptive Engine normally recomputes on evidence write (exam submitted,
 * teach-back graded, weak spot logged). This script covers learners whose
 * evidence predates the engine: without it their mastery row only appears after
 * their next assessment. Safe to re-run — a recompute is idempotent for
 * unchanged evidence.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";

// Same env files, in the same order, as backend/server.js.
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const {
  recomputeMastery,
  buildTopicStates,
  loadTopicEvidence,
  deriveNextAction,
} = await import("../services/learnerMasteryService.js");
const { getUserProgress } = await import("../services/userProgressService.js");

const APPLY = process.argv.includes("--write");

/**
 * Every learner who has any evidence at all. Union of the three sources rather
 * than just weakSpots, so a learner who only ever passed exams still gets a row.
 */
const learnersWithEvidence = async (db) => {
  const idSets = await Promise.all([
    db.collection("weakSpots").distinct("userId"),
    db.collection("examHistory").distinct("userId"),
    db.collection("teach_back_sessions").distinct("userId"),
  ]);
  return [...new Map(idSets.flat().map((id) => [id.toString(), id])).values()];
};

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");

  console.log(`Connected. Mode: ${APPLY ? "WRITE" : "DRY RUN (pass --write to apply)"}\n`);

  const learners = await learnersWithEvidence(db);
  console.log(`Learners with evidence: ${learners.length}`);

  let rows = 0;

  for (const userId of learners) {
    const id = userId.toString();

    const states = APPLY
      ? await recomputeMastery(db, id)
      : buildTopicStates(await loadTopicEvidence(db, id));

    const progress = await getUserProgress(db, id);
    const next = deriveNextAction(states, progress);

    console.log(`\nuser ${id} — ${states.length} topic(s)`);
    for (const s of states) {
      console.log(
        `  ${s.status.padEnd(11)} ${s.slug.padEnd(26)} exam=${s.examScore ?? "-"} teach-back=${s.teachBackScore ?? "-"} fails=${s.failCount}`,
      );
    }
    console.log(`  -> next: ${next.action}${next.topicSlug ? ` ${next.topicSlug}` : ""} (${next.reason})`);
    rows += states.length;
  }

  console.log(
    `\n${APPLY ? "Wrote" : "Would write"} ${rows} mastery row(s) for ${learners.length} learner(s).`,
  );
  await mongo.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
