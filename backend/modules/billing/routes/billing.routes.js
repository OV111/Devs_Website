import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate.js";
import { validate } from "../../../middleware/validate.js";
import { checkoutBodySchema } from "../schemas/billing.schemas.js";
import {
  getSubscriptionStatus,
  startCheckout,
  openPortal,
  syncNow,
} from "../controllers/billing.controller.js";

const router = Router();

// These three call Polar's API. Limit per USER (not per IP — many learners share
// a campus or bootcamp IP) so a stuck client loop can't hammer the provider.
// Read-only status is cheap and unlimited.
const providerLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user?._id ?? "anonymous"),
  message: {
    success: false,
    code: "RATE_LIMITED",
    message: "Too many billing requests. Please wait a minute.",
  },
});

router.get("/subscription", authenticate, getSubscriptionStatus);
router.post(
  "/checkout",
  authenticate,
  providerLimiter,
  validate({ body: checkoutBodySchema }),
  startCheckout,
);
router.post("/portal", authenticate, providerLimiter, openPortal);
router.post("/sync", authenticate, providerLimiter, syncNow);

export default router;
