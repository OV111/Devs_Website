import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { submit, runnerStatus } from "../controllers/submission.controller.js";

const router = Router();

router.get("/runner", authenticate, runnerStatus);
router.post("/:id", authenticate, submit);

export default router;
