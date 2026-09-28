import { ObjectId } from "mongodb";
import { toTopicSlug } from "../utils/topicKey.js";

export const getExamHistory = async (db, userId, limit = 10) => {
  const collection = db.collection("examHistory");
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ takenAt: -1 })
    .limit(limit)
    .toArray();
};

export const getLastExam = async (db, userId) => {
  const collection = db.collection("examHistory");
  return collection.findOne(
    { userId: new ObjectId(userId) },
    { sort: { takenAt: -1 } },
  );
};

export const saveExamResult = async (
  db,
  userId,
  {
    path,
    layer,
    score,
    passed,
    totalQuestions,
    correctAnswers,
    missedTopics,
    timeTakenSecs,
  },
) => {
  const collection = db.collection("examHistory");
  const missed = missedTopics || [];

  const doc = {
    userId: new ObjectId(userId),
    path,
    layer,
    score,
    passed: Boolean(passed),
    totalQuestions,
    correctAnswers,
    // `missedTopics` stays exactly as the caller passed it — it is what the UI
    // shows. `missedTopicSlugs` is the canonical join key LearnerContext uses to
    // line this exam up against weak spots and teach-back scores for the same
    // topic. Storing both means neither consumer has to slugify at read time.
    missedTopics: missed,
    missedTopicSlugs: [...new Set(missed.map(toTopicSlug).filter(Boolean))],
    timeTakenSecs,
    takenAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};
