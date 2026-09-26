import { z } from "zod";

/**
 * Schemas for the /api/ai-agent routes.
 *
 * These are the first Zod schemas in the codebase — VISION.md Recommendation #8
 * commits every NEW route to validating at the boundary, so unvalidated payloads
 * can never reach a service (or the model) in the first place.
 */

// A Mongo ObjectId is exactly 24 hex characters. Validating the SHAPE here is
// what stops `new ObjectId(garbage)` from throwing a BSONError deep in a
// service and surfacing as a 500 with a stack trace.
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Must be a 24-character hex id");

// POST /api/ai-agent/sessions
export const createSessionSchema = z.object({
  // The client sends the first message sliced to 60 chars, or "New conversation".
  // Optional because a session can legitimately be created untitled.
  title: z.string().trim().min(1).max(80).optional(),
});

// GET / PATCH / DELETE /api/ai-agent/sessions/:id
export const sessionIdParamSchema = z.object({
  id: objectId,
});

// PATCH /api/ai-agent/sessions/:id — partial update
export const updateSessionSchema = z
  .object({
    // Same 80-char ceiling createSession truncates to, enforced up front so the
    // client gets a 400 instead of silently-truncated input.
    title: z.string().trim().min(1, "title is required").max(80).optional(),
    pinned: z.boolean().optional(),
  })
  // An empty body would otherwise "succeed" while changing nothing but updatedAt,
  // which would silently reorder the user's session list.
  .refine((v) => v.title !== undefined || v.pinned !== undefined, {
    message: "Provide title or pinned",
  });

/**
 * Attachment limits — the ENFORCING copy. `constants/AiAgent.js` mirrors these
 * for UI feedback only; a client can send anything, so these are what count.
 * Keep the two in sync if you change them.
 *
 * MAX_TOTAL_CHARS is a context-window guard, not just a cost guard: the session
 * keeps a 20-turn window, so 20 turns x ~4k tokens of attachments stays inside
 * gpt-oss-120b's 131K context.
 */
export const ATTACHMENT_LIMITS = {
  MAX_FILES: 3,
  MAX_CHARS_PER_FILE: 8200, // slight headroom over the client's 8000 + truncation marker
  MAX_TOTAL_CHARS: 16500,
};

const attachmentSchema = z.object({
  name: z.string().trim().min(1).max(200),
  content: z.string().min(1).max(ATTACHMENT_LIMITS.MAX_CHARS_PER_FILE),
});

// POST /api/ai-agent/stream
export const streamSchema = z
  .object({
    // useAgentStream.js sends `sessionId: null` when no session exists yet, so
    // null must be accepted — the controller then creates one.
    sessionId: objectId.nullish(),
    // Upper bound is a cost control as much as a validation rule: an unbounded
    // message is an unbounded prompt, and the user pays per token.
    message: z.string().trim().min(1, "message is required").max(4000),
    attachments: z.array(attachmentSchema).max(ATTACHMENT_LIMITS.MAX_FILES).optional(),
  })
  // Per-file caps alone don't bound the request — 3 files each just under the
  // limit would still blow past the budget, so the total is checked separately.
  .refine(
    (v) =>
      (v.attachments ?? []).reduce((sum, a) => sum + a.content.length, 0) <=
      ATTACHMENT_LIMITS.MAX_TOTAL_CHARS,
    {
      message: `Attachments exceed the total size limit of ${ATTACHMENT_LIMITS.MAX_TOTAL_CHARS} characters`,
      path: ["attachments"],
    },
  );
