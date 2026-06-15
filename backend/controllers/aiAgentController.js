import {
  createSession as dbCreateSession,
  listSessions,
  getSession,
  appendMessages,
  checkDailyLimit,
  incrementUsage,
} from "../services/agent/sessionService.js";
import { streamAgentResponse } from "../services/agent/streamService.js";

export const createSession = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const { title } = req.body;
    const session = await dbCreateSession(db, userId, title);
    res.status(201).json(session);
  } catch (err) {
    console.error("createSession error:", err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const sessions = await listSessions(db, userId);
    res.json({ sessions });
  } catch (err) {
    console.error("getSessions error:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const session = await getSession(db, userId, req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    console.error("getSessionById error:", err);
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

export const stream = async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user._id.toString();
  const { sessionId, message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "message is required" });
  }

  // rate limit check
  const limit = await checkDailyLimit(db, userId);
  if (!limit.allowed) {
    return res.status(429).json({ message: "Daily message limit reached.", resetAt: limit.resetAt });
  }

  // resolve or create session
  let session = null;
  if (sessionId) {
    session = await getSession(db, userId, sessionId);
  }
  if (!session) {
    session = await dbCreateSession(db, userId, message.slice(0, 60));
  }

  const sessionMessages = session.messages ?? [];

  // set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const assistantContent = await streamAgentResponse({
      res,
      db,
      userId,
      sessionMessages,
      userMessage: message.trim(),
    });

    await incrementUsage(db, userId);
    await appendMessages(db, session._id.toString(), message.trim(), assistantContent);
  } catch (err) {
    console.error("stream error:", err);
    try {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Agent error. Please try again." })}\n\n`);
      res.end();
    } catch { /* already ended */ }
  }
};
