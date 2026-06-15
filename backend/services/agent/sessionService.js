import { ObjectId } from "mongodb";

const MAX_TURNS = 20;
const DAILY_MESSAGE_CAP = 30;

// ── Sessions ──────────────────────────────────────────────────

export const createSession = async (db, userId, title) => {
  const col = db.collection("agent_sessions");
  const doc = {
    userId: new ObjectId(userId),
    title: title?.slice(0, 80) ?? "New conversation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const listSessions = async (db, userId, limit = 20) => {
  const col = db.collection("agent_sessions");
  return col
    .find({ userId: new ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .project({ messages: 0 })
    .toArray();
};

export const getSession = async (db, userId, sessionId) => {
  const col = db.collection("agent_sessions");
  return col.findOne({
    _id: new ObjectId(sessionId),
    userId: new ObjectId(userId),
  });
};

// Append user + assistant messages, enforce 20-turn sliding window
export const appendMessages = async (db, sessionId, userMsg, assistantMsg) => {
  const col = db.collection("agent_sessions");

  const session = await col.findOne({ _id: new ObjectId(sessionId) });
  if (!session) return;

  const messages = [
    ...(session.messages ?? []),
    { role: "user", content: userMsg, at: new Date() },
    { role: "assistant", content: assistantMsg, at: new Date() },
  ];

  // keep last MAX_TURNS messages (each turn = user + assistant = 2 entries)
  const trimmed = messages.slice(-MAX_TURNS * 2);

  await col.updateOne(
    { _id: new ObjectId(sessionId) },
    { $set: { messages: trimmed, updatedAt: new Date() } },
  );
};

// ── Rate limiting ─────────────────────────────────────────────

export const checkDailyLimit = async (db, userId) => {
  const col = db.collection("agent_usage");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);

  const doc = await col.findOne({ userId: new ObjectId(userId), date: today });
  const count = doc?.count ?? 0;

  if (count >= DAILY_MESSAGE_CAP) {
    return { allowed: false, resetAt: tomorrow.toISOString() };
  }

  return { allowed: true, count };
};

export const incrementUsage = async (db, userId) => {
  const col = db.collection("agent_usage");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await col.findOneAndUpdate(
    { userId: new ObjectId(userId), date: today },
    { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
};
