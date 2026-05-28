import { ObjectId } from "mongodb";

export const getUserProgress = async (db, userId) => {
  const collection = db.collection("userProgress");
  return collection.findOne({ userId: new ObjectId(userId) });
};

export const createUserProgress = async (db, userId, data = {}) => {
  const collection = db.collection("userProgress");
  const doc = {
    userId: new ObjectId(userId),
    activePath: data.activePath,
    currentLayer: data.currentLayer || 1,
    completedLayers: data.completedLayers || [],
    skillLevel: data.skillLevel || "beginner",
    xpTotal: 0,
    streak: 0,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const updateUserProgress = async (db, userId, fields) => {
  const collection = db.collection("userProgress");
  return collection.findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $set: { ...fields, updatedAt: new Date() } },
    { returnDocument: "after", upsert: true },
  );
};

export const incrementXP = async (db, userId, amount) => {
  const collection = db.collection("userProgress");
  return collection.findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $inc: { xpTotal: amount },
      $set: { lastActiveAt: new Date(), updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );
};
