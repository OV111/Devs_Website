import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getFunnel } from "../services/eventService.js";

const router = Router();

const DEFAULT_WINDOW_DAYS = 30;
const MAX_WINDOW_DAYS = 365;

// GET /api/admin/funnel?days=30 — pilot funnel for users who signed up in the
// last `days` days. Admin-only: requireAdmin answers 404 to everyone else.
router.get("/funnel", authenticate, requireAdmin, async (req, res) => {
  try {
    const days = Number(req.query.days ?? DEFAULT_WINDOW_DAYS);
    if (!Number.isInteger(days) || days < 1 || days > MAX_WINDOW_DAYS) {
      return res.status(400).json({ message: `days must be an integer from 1 to ${MAX_WINDOW_DAYS}` });
    }
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    res.json(await getFunnel(req.app.locals.db, since));
  } catch (err) {
    console.error("funnel error:", err);
    res.status(500).json({ message: "Failed to compute funnel" });
  }
});

export default router;
