import { ObjectId } from "mongodb";
import { toTopicSlug } from "../utils/topicKey.js";

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
  const slug = toTopicSlug(topic);

  const existing = await collection.findOne({
    userId: new ObjectId(userId),
    // Match on the slug, but also on the legacy uppercase topic so a document
    // written before slugs existed gets incremented rather than duplicated —
    // otherwise the same weak spot would be tracked twice, splitting failCount
    // and under-reporting how much the learner is actually struggling.
    $or: [{ slug }, { topic: topic.toUpperCase() }],
  });

  if (existing) {
    return collection.findOneAndUpdate(
      { _id: existing._id },
      {
        $inc: { failCount: 1 },
        // Backfill the slug opportunistically, so legacy documents self-heal on
        // the next write even if the migration script never runs.
        $set: { slug, resolvedAt: null, updatedAt: new Date() },
      },
      { returnDocument: "after" },
    );
  }

  const doc = {
    userId: new ObjectId(userId),
    // Stored with the caller's own casing. Uppercasing used to be how two
    // spellings of one topic were matched, but `slug` is the identity key now, so
    // the topic field is purely a display string — and SHOUTED titles ended up
    // being read back to learners verbatim in the mentor's prompt.
    topic: topic.trim(),
    slug,
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
  // Same dual match as addWeakSpot: resolving has to find the document however
  // it was keyed when written, or a learner who just proved mastery keeps an
  // open weak spot and the mentor keeps nagging them about it.
  return collection.findOneAndUpdate(
    {
      userId: new ObjectId(userId),
      $or: [{ slug: toTopicSlug(topic) }, { topic: topic.toUpperCase() }],
    },
    { $set: { resolvedAt: new Date(), updatedAt: new Date() } },
    { returnDocument: "after" },
  );
};
