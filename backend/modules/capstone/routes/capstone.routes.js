import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { validate } from "../../../middleware/validate.js";
import { aiBurstLimiter } from "../../../middleware/aiRateLimit.js";
import { defenseAnswerSchema, submitSchema, trackParamSchema } from "../schemas/capstone.schemas.js";
import {
  answerDefense,
  getCatalog,
  getOverview,
  getDefense,
  getStatus,
  gradeDefense,
  review,
  startAttempt,
  startDefense,
  submit,
} from "../controllers/capstone.controller.js";

const router = Router();

// Registered BEFORE "/:trackId" so "catalog" is never read as a track id.
// Public: the roadmap shows the capstone node to guests too.
router.get("/catalog", getCatalog);
// The /capstone picker: every capstone plus where this learner stands.
router.get("/", authenticate, getOverview);

router.get("/:trackId", authenticate, validate({ params: trackParamSchema }), getStatus);
router.post("/:trackId/start", authenticate, validate({ params: trackParamSchema }), startAttempt);
router.post(
  "/:trackId/submit",
  authenticate,
  validate({ params: trackParamSchema, body: submitSchema }),
  submit,
);
// The review calls a paid LLM. The attempt claim already stops parallel
// reviews; aiBurstLimiter (keyed per user, so after authenticate) caps retries.
router.post("/:trackId/review", authenticate, aiBurstLimiter, validate({ params: trackParamSchema }), review);

const track = validate({ params: trackParamSchema });
router.get("/:trackId/defense", authenticate, track, getDefense);
// start and grade call the model, so they share the per-user AI burst limit.
// answer deliberately does NOT: that limiter is shared with the mentor, and a
// 429 mid-defense would burn the learner's timer. Answers are already bounded
// by the session itself (one per question, five per session).
router.post("/:trackId/defense/start", authenticate, aiBurstLimiter, track, startDefense);
router.post(
  "/:trackId/defense/answer",
  authenticate,
  validate({ params: trackParamSchema, body: defenseAnswerSchema }),
  answerDefense,
);
router.post("/:trackId/defense/grade", authenticate, aiBurstLimiter, track, gradeDefense);

export default router;
