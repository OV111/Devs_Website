import { ObjectId } from "mongodb";

export const getExamHistory = async (db, userId, limit = 10) => {
  const collection = db.collection("examHistory");
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ passedAt: -1 })
    .limit(limit)
    .toArray();
};

export const getLastExam = async (db, userId) => {
  const collection = db.collection("examHistory");
  return collection.findOne(
    { userId: new ObjectId(userId) },
    { sort: { passedAt: -1 } },
  );
};

export const saveExamResult = async (
  db,
  userId,
  {
    path,
    layer,
    score,
    totalQuestions,
    correctAnswers,
    missedTopics,
    timeTakenSecs,
  },
) => {
  const collection = db.collection("examHistory");
  const doc = {
    userId: new ObjectId(userId),
    path,
    layer,
    score,
    totalQuestions,
    correctAnswers,
    missedTopics: missedTopics || [],
    timeTakenSecs,
    passedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};
