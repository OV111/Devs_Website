import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate.js";
import { validate } from "../../../middleware/validate.js";
import { settingsSchema, usernameParamSchema } from "../schemas/recruiter.schemas.js";
import { getScorecard, getSettings, saveSettings } from "../controllers/recruiter.controller.js";

const router = Router();

// Public and unauthenticated, so keyed per IP (trust proxy is set in app.js).
// Generous for a recruiter opening a few links, tight enough to stop scraping
// every username.
const scorecardLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please wait a minute.", code: 429 },
});

router.get("/scorecards/:username", scorecardLimiter, validate({ params: usernameParamSchema }), getScorecard);

// Everything below is the signed-in developer's own settings.
router.get("/settings", authenticate, getSettings);
router.put("/settings", authenticate, validate({ body: settingsSchema }), saveSettings);

export default router;
