import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import {
  startAttempt,
  getAttempt,
  saveAttemptCode,
  revealHint,
} from "../controllers/attempt.controller.js";

const router = Router();

// Every attempt belongs to a user, so there is no anonymous path in here.
router.post("/", authenticate, startAttempt);
router.get("/:id", authenticate, getAttempt);
router.patch("/:id", authenticate, saveAttemptCode);
router.post("/:id/hints/:order", authenticate, revealHint);

export default router;
