import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createSession, getSessions, getSessionById, stream } from "../controllers/aiAgentController.js";

const router = Router();

router.get("/sessions", authenticate, getSessions);
router.get("/sessions/:id", authenticate, getSessionById);
router.post("/sessions", authenticate, createSession);
router.post("/stream", authenticate, stream);

export default router;
