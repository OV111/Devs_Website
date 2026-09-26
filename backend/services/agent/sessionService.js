import { ObjectId } from "mongodb";

// Exported so /context can report the real caps instead of hardcoding them in
// the UI — the old context panel drifted into fiction exactly that way.
export const MAX_TURNS = 20;
export const DAILY_MESSAGE_CAP = 30;

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
    // Pinned first, then most recent. Documents created before pinning existed
    // have no `pinned` field; missing sorts below true under -1, which is the
    // behaviour we want without needing a migration.
    .sort({ pinned: -1, updatedAt: -1 })
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

/**
 * Partial update of a session — title and/or pinned.
 *
 * The filter includes userId deliberately: matching on _id alone would let any
 * authenticated user rename, pin or delete another user's conversation by
 * guessing an id. Returns null when the session doesn't exist OR isn't theirs —
 * the caller turns both into a 404, so the endpoint never reveals that an id
 * exists.
 */
export const updateSession = async (db, userId, sessionId, { title, pinned }) => {
  const col = db.collection("agent_sessions");

  const $set = { updatedAt: new Date() };
  if (title !== undefined) $set.title = title.slice(0, 80);
  if (pinned !== undefined) $set.pinned = pinned;

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(sessionId), userId: new ObjectId(userId) },
    { $set },
    { returnDocument: "after", projection: { messages: 0 } },
  );
  return result?.value ?? result ?? null;
};

/** Delete a session. Scoped by userId for the same reason as renameSession. */
export const deleteSession = async (db, userId, sessionId) => {
  const col = db.collection("agent_sessions");
  const { deletedCount } = await col.deleteOne({
    _id: new ObjectId(sessionId),
    userId: new ObjectId(userId),
  });
  return deletedCount > 0;
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

/** Messages used today, for /context. Mirrors checkDailyLimit's day boundary. */
export const getUsageToday = async (db, userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const doc = await db
    .collection("agent_usage")
    .findOne({ userId: new ObjectId(userId), date: today });

  const used = doc?.count ?? 0;
  return { used, cap: DAILY_MESSAGE_CAP, remaining: Math.max(0, DAILY_MESSAGE_CAP - used) };
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
