import { MongoClient } from "mongodb";
import process from "process";
let db;
let client;

const connectDB = async () => {
  if (db) return db; // reuse existing connection

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing");
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    console.log("MongoDB connected successfully!");
    db = client.db("DevsBlog"); // store reference to DB

    await Promise.all([
      db.collection("follows").createIndex({ followerId: 1, followingId: 1 }, { unique: true }),
      db.collection("notifications").createIndex({ targetUserId: 1, createdAt: -1 }),
      db.collection("blogs").createIndex({ status: 1, category: 1, createdAt: -1 }),
      db.collection("exam_attempts").createIndex({ userId: 1, path: 1, layer: 1, startedAt: -1 }),
      db.collection("teach_back_rubrics").createIndex({ path: 1, layer: 1, topic: 1 }, { unique: true }),
      db.collection("teach_back_sessions").createIndex({ userId: 1, path: 1, layer: 1, startedAt: -1 }),
      // LearnerContext runs these five reads on every AI-mentor turn, so they
      // need to be index-backed rather than collection scans.
      db.collection("weakSpots").createIndex({ userId: 1, resolvedAt: 1 }),
      db.collection("weakSpots").createIndex({ userId: 1, slug: 1 }),
      db.collection("examHistory").createIndex({ userId: 1, takenAt: -1 }),
      db.collection("challengeResults").createIndex({ userId: 1, solvedAt: -1 }),
      db.collection("teach_back_sessions").createIndex({ userId: 1, startedAt: -1 }),
      // One mastery row per learner per topic — unique so a concurrent recompute
      // upserts rather than duplicating, which would give readers two statuses
      // for the same topic.
      db.collection("learnerMastery").createIndex({ userId: 1, slug: 1 }, { unique: true }),
      // Teaching log is always read as "recent attempts for these topics".
      db.collection("mentor_teaching_log").createIndex({ userId: 1, slug: 1, at: -1 }),
      // One redirect target per freed-up handle; renaming or reclaiming a
      // username upserts/deletes this row rather than duplicating it.
      db.collection("usernameHistory").createIndex({ oldUsername: 1 }, { unique: true }),
    ]);

    return db;
  } catch (err) {
    console.error("MongoDB connection error", err);
    throw err;
  }
};
// let x = await connectDB()
// console.log(x)
export default connectDB;
