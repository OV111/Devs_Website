import { z } from "zod";
import { parseRepoUrl } from "../lib/githubUrl.js";

// Track ids are seeded slugs like "api-dev" or "python-backend". Validating the
// shape up front keeps arbitrary strings out of every Mongo filter.
export const trackParamSchema = z.object({
  trackId: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid track id")
    .max(40),
});

// POST /api/capstone/:trackId/submit — the controller receives
// req.body.repo = { owner, repo }, never the raw URL (see lib/githubUrl.js).
export const submitSchema = z
  .object({
    repoUrl: z.string().trim().min(1, "repoUrl is required").max(200),
  })
  .transform((body, ctx) => {
    const parsed = parseRepoUrl(body.repoUrl);
    if (!parsed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repoUrl"],
        message: "Use a GitHub repository URL like https://github.com/you/project",
      });
      return z.NEVER;
    }
    return { repo: parsed };
  });

// Client-reported integrity counters (tab switches, pastes). Admin-only
// signals, never graded — clamped so a hostile client cannot store junk.
const counter = z.number().int().min(0).max(1000).catch(0);

// POST /api/capstone/:trackId/defense/answer
export const defenseAnswerSchema = z.object({
  questionId: z.string().regex(/^q\d{1,2}$/, "Invalid question id"),
  // Empty is allowed: it is how a learner skips a question (scored 0).
  answer: z.string().max(3000, "Answers are limited to 3000 characters"),
  integrity: z
    .object({ tabSwitches: counter, pasteEvents: counter })
    .partial()
    .default({})
    .transform((v) => ({ tabSwitches: v.tabSwitches ?? 0, pasteEvents: v.pasteEvents ?? 0 })),
});

// GET /api/capstone/certificates/:publicId — 12 base64url characters.
export const certificateParamSchema = z.object({
  publicId: z.string().regex(/^[A-Za-z0-9_-]{12}$/, "Invalid certificate id"),
});

// ── Admin (stage 7) ───────────────────────────────────────────

export const attemptIdParamSchema = z.object({
  attemptId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid attempt id"),
});

// A reason is mandatory for every admin write: it goes into the audit log and,
// for revocations, onto the public certificate page.
const reason = z.string().trim().min(10, "Give a reason of at least 10 characters").max(500);

export const adminListQuerySchema = z.object({
  status: z.enum(["started", "checking", "submitted", "reviewing", "defense", "passed", "failed"]).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

export const overrideSchema = z.object({
  outcome: z.enum(["passed", "failed"]),
  reason,
});

export const revokeSchema = z.object({
  revoked: z.boolean(),
  reason,
});
