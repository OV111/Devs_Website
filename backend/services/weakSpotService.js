import { ObjectId } from "mongodb";

export const getWeakSpots = async (db, userId) => {
  const collection = db.collection("weakSpots");
  return collection
    .find({ userId: new ObjectId(userId), resolvedAt: null })
    .sort({ failCount: -1 })
    .toArray();
};

export const addWeakSpot = async (
  db,
  userId,
  { topic, path, layer, source },
) => {
  const collection = db.collection("weakSpots");
  const existing = await collection.findOne({
    userId: new ObjectId(userId),
    topic: topic.toUpperCase(),
  });

  if (existing) {
    return collection.findOneAndUpdate(
      { _id: existing._id },
      {
        $inc: { failCount: 1 },
        $set: { resolvedAt: null, updatedAt: new Date() },
      },
      { returnDocument: "after" },
    );
  }

  const doc = {
    userId: new ObjectId(userId),
    topic: topic.toUpperCase(),
    path,
    layer,
    source,
    failCount: 1,
    resolvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const resolveWeakSpot = async (db, userId, topic) => {
  const collection = db.collection("weakSpots");
  return collection.findOneAndUpdate(
    { userId: new ObjectId(userId), topic: topic.toUpperCase() },
    { $set: { resolvedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" },
  );
};
