import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { requireAdmin } from "../../../middleware/requireAdmin.js";
import {
  submitProposal,
  listMyProposals,
  listProposals,
  approveProposal,
  rejectProposal,
} from "../controllers/admin.controller.js";

const router = Router();

// Anyone signed in may propose a challenge and track their own submissions.
router.post("/", authenticate, submitProposal);
router.get("/mine", authenticate, listMyProposals);

// Review surface. `requireAdmin` runs after `authenticate` and re-reads the
// role from the database, so a demotion takes effect immediately.
router.get("/", authenticate, requireAdmin, listProposals);
router.post("/:id/approve", authenticate, requireAdmin, approveProposal);
router.post("/:id/reject", authenticate, requireAdmin, rejectProposal);

export default router;
