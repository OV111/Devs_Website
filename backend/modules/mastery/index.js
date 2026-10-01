/**
 * Mastery module — the learner-facing view of what they know.
 *
 * It owns no policy: statuses and the next action come from
 * services/learnerMasteryService.js (the Adaptive Engine), and the free/Pro
 * decision comes from the billing module. This module only shapes and serves.
 */

import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { getMyMastery } from "./controllers/mastery.controller.js";

const router = Router();

router.get("/", authenticate, getMyMastery);

export default router;
