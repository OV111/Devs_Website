import rateLimit from "express-rate-limit";

// Limits for routes that call the LLM provider. Keyed per user, not per IP,
// so they must run AFTER `authenticate`. Without them one looping client can
// burn the shared Groq quota and break the mentor for every other user.
//
// In-memory store: counters are per process and reset on restart. Fine for a
// single-instance pilot; move to a Redis store before running several instances.

const byUser = (req) => String(req.user?._id ?? "anonymous");

// Burst guard for every LLM route (mentor stream, teach-back).
export const aiBurstLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: byUser,
  message: { message: "Too many AI requests. Please wait a minute.", code: 429 },
});

// Daily cost bound for teach-back grading. The mentor stream already has its
// own per-user daily cap (DAILY_MESSAGE_CAP in sessionService.js).
export const teachBackDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: byUser,
  message: { message: "Daily teach-back limit reached. Try again tomorrow.", code: 429 },
});
