import { canAccess } from "../../billing/index.js";
import { getMasteryView } from "../services/masteryViewService.js";

/**
 * GET /api/mastery
 *
 * The per-topic map is a Pro feature. While billing is not enforced,
 * `canAccess` returns true for everyone, so every pilot user gets the full view.
 */
export const getMyMastery = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const detail = await canAccess(db, req.user._id, "pro");
    const data = await getMasteryView(db, req.user._id, { detail });
    res.json({ success: true, data });
  } catch (err) {
    console.error("mastery: failed to build view:", err);
    res
      .status(500)
      .json({ success: false, message: "Couldn't load your progress." });
  }
};
