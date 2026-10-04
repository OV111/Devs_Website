import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate.js";
import { validate } from "../../../middleware/validate.js";
import { certificateParamSchema } from "../schemas/capstone.schemas.js";
import { getPublicCertificate, listMyCertificates } from "../controllers/certificate.controller.js";

const router = Router();

// The verify endpoint is public, so it is keyed per IP (`trust proxy` is set in
// app.js, so req.ip is the real client). Generous for humans and recruiters,
// tight enough to make enumerating 72-bit ids pointless.
const verifyLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please wait a minute.", code: 429 },
});

router.get("/", authenticate, listMyCertificates);
router.get("/:publicId", verifyLimiter, validate({ params: certificateParamSchema }), getPublicCertificate);

export default router;
