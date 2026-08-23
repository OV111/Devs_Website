import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  submitVoiceSession,
  getVoiceReviewResult,
  getVoiceReviewHistory,
} from "../controllers/voiceReviewController.js";

// Voice AI Progress Review — scaffold only, not implemented. See VISION.md.

const router = Router();

router.post("/sessions", authenticate, submitVoiceSession);
router.get("/sessions/:id", authenticate, getVoiceReviewResult);
router.get("/history", authenticate, getVoiceReviewHistory);

export default router;
