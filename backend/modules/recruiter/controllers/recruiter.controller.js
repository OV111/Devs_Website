import { getScorecardService } from "../services/scorecardService.js";
import { getSettingsService, saveSettingsService } from "../services/settingsService.js";

const handle = (fn) => async (req, res) => {
  try {
    res.json({ success: true, data: await fn(req) });
  } catch (err) {
    if (!err.status) console.error("recruiter error:", err);
    res.status(err.status ?? 500).json({ success: false, message: err.status ? err.message : "Something went wrong" });
  }
};

const db = (req) => req.app.locals.db;

export const getScorecard = handle((req) => getScorecardService(db(req), req.params.username));
export const getSettings = handle((req) => getSettingsService(db(req), req.user._id));
export const saveSettings = handle((req) => saveSettingsService(db(req), req.user._id, req.body));
