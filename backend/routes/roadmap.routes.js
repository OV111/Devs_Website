import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getProgress, startPath, saveProgress } from "../controllers/roadmapController.js";

const router = Router();

// GET /api/roadmaps/progress — fetch user's persisted layer progress
router.get("/progress", authenticate, getProgress);

// POST /api/roadmaps/start — set active path (first pick or switch)
router.post("/start", authenticate, startPath);

// POST /api/roadmaps/progress — persist layer status map
router.post("/progress", authenticate, saveProgress);

export default router;
