import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {
  listChallenges,
  getChallenge,
  getTagCounts,
  getDailyChallenge,
  getPersonalStats,
  getReadiness,
  getLeaderboard,
} from "../controllers/challenge.controller.js";

const router = Router();

// Static segments are declared before "/:slug" so a request for /daily is not
// swallowed by the slug route.
router.get("/daily", authenticate, getDailyChallenge);
router.get("/stats/me", authenticate, getPersonalStats);
router.get("/readiness", authenticate, getReadiness);
router.get("/leaderboard", authenticate, getLeaderboard);
router.get("/topics", authenticate, getTagCounts);
router.get("/", authenticate, listChallenges);
router.get("/:slug", authenticate, getChallenge);

export default router;
