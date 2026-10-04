import {
  createSession as dbCreateSession,
  listSessions,
  getSession,
  appendMessages,
  checkDailyLimit,
  incrementUsage,
  getUsageToday,
  updateSession,
  deleteSession,
  MAX_TURNS,
  DAILY_MESSAGE_CAP,
} from "../services/agent/sessionService.js";
import {
  streamAgentResponse,
  composeUserMessage,
  MODEL,
} from "../services/agent/streamService.js";
import { generateTitle } from "../services/agent/titleService.js";
import { toolDefinitions } from "../tools/agentTools.js";
import { ATTACHMENT_LIMITS } from "../validation/aiAgent.schemas.js";
import { trackEvent } from "../services/eventService.js";
import { hasLiveDefense } from "../modules/capstone/index.js";

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

export const updateSessionById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    // A rename through this endpoint is always a deliberate user action, so
    // lock the title against later auto-generation.
    const session = await updateSession(db, userId, req.params.id, {
      ...req.body,
      ...(req.body.title !== undefined && { titleLocked: true }),
    });

    // Also 404 when the session belongs to someone else — a 403 would confirm
    // that the id exists, which is information the caller shouldn't get.
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    console.error("updateSessionById error:", err);
    res.status(500).json({ message: "Failed to update session" });
  }
};

export const deleteSessionById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const deleted = await deleteSession(db, userId, req.params.id);
    if (!deleted) return res.status(404).json({ message: "Session not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteSessionById error:", err);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

/**
 * GET /api/ai-agent/context
 *
 * Real runtime facts for the /context command. Everything here is read from the
 * same constants and collections the agent actually uses, so it cannot drift —
 * which is precisely how the old hardcoded context panel ended up stating a
 * skill level, streak and exam score that were never true.
 */
export const getContext = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();

    const usage = await getUsageToday(db, userId);

    res.json({
      model: MODEL,
      tools: toolDefinitions.map((t) => t.function.name),
      limits: {
        maxTurns: MAX_TURNS,
        dailyMessageCap: DAILY_MESSAGE_CAP,
        maxAttachments: ATTACHMENT_LIMITS.MAX_FILES,
        maxAttachmentChars: ATTACHMENT_LIMITS.MAX_TOTAL_CHARS,
      },
      usage,
    });
  } catch (err) {
    console.error("getContext error:", err);
    res.status(500).json({ message: "Failed to load context" });
  }
};

export const stream = async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user._id.toString();
  // Shape is guaranteed by validate({ body: streamSchema }) on the route —
  // message is a non-empty trimmed string, sessionId is a valid ObjectId or null,
  // and attachments (if present) are within the per-file and total size caps.
  const { sessionId, message, attachments = [], activity = null } = req.body;

  // Anti-cheat: while a capstone defense question is on the clock, the mentor
  // is paused — otherwise it could be asked the answers. Checked before the
  // daily limit so a paused request does not use up a message.
  if (await hasLiveDefense(db, userId)) {
    return res.status(423).json({
      message: "Your mentor is paused while a capstone defense question is on the clock. It will be back as soon as you answer.",
      code: "defense_in_progress",
    });
  }

  // rate limit check
  const limit = await checkDailyLimit(db, userId);
  if (!limit.allowed) {
    return res.status(429).json({ message: "Daily message limit reached.", resetAt: limit.resetAt });
  }

  await trackEvent(db, userId, "mentor_message", { hasAttachments: attachments.length > 0 });

  // resolve or create session
  let session = null;
  if (sessionId) {
    session = await getSession(db, userId, sessionId);
  }
  if (!session) {
    session = await dbCreateSession(db, userId, message.slice(0, 60));
  }

  const sessionMessages = session.messages ?? [];

  // Auto-title on the first exchange only, and never over a name the user chose.
  // Fired BEFORE streaming so it runs concurrently with the answer — by the time
  // the reply finishes it has almost always resolved, costing no extra wait.
  const shouldTitle = sessionMessages.length === 0 && !session.titleLocked;
  const titlePromise = shouldTitle ? generateTitle(message) : null;

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
      userMessage: message,
      attachments,
      // Lets the teaching log record which conversation an explanation happened
      // in, so a future turn can tell "I already tried this" from "we discussed
      // this at length in one long session".
      sessionId: session._id.toString(),
      // Deliberately NOT persisted with the turn: where the learner was when
      // they asked is context for this answer only. Replaying it into a later
      // turn would tell the mentor they are still on the exam results page.
      activity,
    });

    await incrementUsage(db, userId);
    // Persist the COMPOSED message (message + file content), not the bare text,
    // so follow-up turns like "now refactor that file" still see the content.
    // The total-size cap keeps 20 such turns inside the model's context window.
    await appendMessages(
      db,
      session._id.toString(),
      composeUserMessage(message, attachments),
      assistantContent,
    );

    if (titlePromise) {
      // Race against a short timeout: a hung titling call must never hold the
      // stream open, because the client can't send its next message until this
      // closes. Titling is cosmetic — dropping it is always the right trade.
      const title = await Promise.race([
        titlePromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 1500)),
      ]);

      if (title) {
        await updateSession(db, userId, session._id.toString(), { title });
        res.write(
          `data: ${JSON.stringify({ type: "title", sessionId: session._id.toString(), title })}\n\n`,
        );
      }
    }

    // Close the stream only now that the turn is durable. The client treats
    // "done" as permission to send the next message, and that next request
    // re-reads the session — so persisting first is what makes follow-up
    // turns reliably see the turn they are following up on.
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("stream error:", err);
    try {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Agent error. Please try again." })}\n\n`);
      res.end();
    } catch { /* already ended */ }
  }
};
