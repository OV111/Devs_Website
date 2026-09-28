import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getHistory,
  getLastExamResult,
  submitExamResult,
  listWeakSpots,
  addWeakSpotRoute,
  resolveWeakSpotRoute,
} from "../controllers/examController.js";
import { generate, submit, submitTeachBackAnswer, submitTeachBackFollowUpAnswer } from "../controllers/examEngineController.js";

const router = Router();

// Exam engine
router.post("/generate", authenticate, generate);
router.post("/submit", authenticate, submit);
router.post("/submit-teach-back", authenticate, submitTeachBackAnswer);
router.post("/submit-teach-back-followup", authenticate, submitTeachBackFollowUpAnswer);

// Exam history
router.get("/history", authenticate, getHistory);
router.get("/history/last", authenticate, getLastExamResult);
router.post("/result", authenticate, submitExamResult);

// Weak spots
router.get("/weak-spots", authenticate, listWeakSpots);
router.post("/weak-spots", authenticate, addWeakSpotRoute);
router.patch("/weak-spots/:topic/resolve", authenticate, resolveWeakSpotRoute);

export default router;
