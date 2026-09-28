/**
 * Print the exact system prompt the mentor would receive for a learner.
 *
 * Usage:
 *   node backend/scripts/previewMentorPrompt.js                 # first learner found
 *   node backend/scripts/previewMentorPrompt.js <userId>
 *   node backend/scripts/previewMentorPrompt.js <userId> exam-results backend layer-6 "JWT Signature"
 *
 * The assembled prompt is the one place every stage of the mentor architecture
 * meets — learner state, the engine's recommendation, the teaching log and the
 * current activity. Being able to read it verbatim is the fastest way to tell
 * whether a change did what was intended, without burning a model call.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";

dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const { getLearnerContext, summarizeLearnerContext } = await import(
  "../services/agent/learnerContextService.js"
);
const { buildSystemPrompt, describeActivity } = await import("../services/agent/streamService.js");

const [, , userIdArg, surface, path, layer, topic] = process.argv;

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");

  let userId = userIdArg;
  if (!userId) {
    const [any] = await db.collection("learnerMastery").find({}).limit(1).toArray();
    userId = any?.userId?.toString();
    if (!userId) throw new Error("No learner has mastery yet — run: npm run migrate:mastery -- --write");
    console.log(`(no userId given, using ${userId})\n`);
  }

  const ctx = await getLearnerContext(db, userId);
  const activity = surface ? { surface, path, layer, topic } : null;

  console.log("═".repeat(72));
  console.log(buildSystemPrompt(summarizeLearnerContext(ctx), describeActivity(activity)));
  console.log("═".repeat(72));

  console.log(`\nTopics: ${ctx.topics.length} | teaching attempts on file: ${ctx.teachingAttempts.length}`);
  console.log(`Engine says: ${ctx.nextAction.action} ${ctx.nextAction.topicSlug ?? ""}`);

  await mongo.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
