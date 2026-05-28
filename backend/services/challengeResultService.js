import { ObjectId } from "mongodb";

export const getChallengeResults = async (db, userId) => {
  const collection = db.collection("challengeResults");
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ solvedAt: -1 })
    .toArray();
};

export const getSolvedChallenges = async (db, userId) => {
  const collection = db.collection("challengeResults");
  return collection
    .find({ userId: new ObjectId(userId), status: "solved" })
    .toArray();
};

export const saveChallengeResult = async (
  db,
  userId,
  { challengeId, path, layer, status, xpEarned, timeTakenSecs, attempts },
) => {
  const collection = db.collection("challengeResults");

  const existing = await collection.findOne({
    userId: new ObjectId(userId),
    challengeId,
  });

  if (existing) {
    return collection.findOneAndUpdate(
      { _id: existing._id },
      {
        $set: {
          status,
          xpEarned,
          timeTakenSecs,
          attempts: (existing.attempts || 0) + 1,
          solvedAt: status === "solved" ? new Date() : existing.solvedAt,
        },
      },
      { returnDocument: "after" },
    );
  }

  const doc = {
    userId: new ObjectId(userId),
    challengeId,
    path,
    layer,
    status,
    xpEarned: xpEarned || 0,
    timeTakenSecs: timeTakenSecs || 0,
    attempts: attempts || 1,
    solvedAt: status === "solved" ? new Date() : null,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};
