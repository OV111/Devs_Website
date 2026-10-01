/**
 * Contact module — public "send us a message" endpoint.
 *
 * Public on purpose (guests are the main senders), so it's guarded by an IP
 * rate limit, a honeypot field and strict Zod validation instead of auth.
 */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../middleware/validate.js";
import { contactBodySchema } from "./schemas/contact.schemas.js";
import { submitContactMessage } from "./controllers/contact.controller.js";

// Keyed by IP (no user on a public route). `trust proxy` is set to one hop in
// app.js, so req.ip is the real client, not the load balancer.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many messages. Please try again in an hour.", code: 429 },
});

const router = Router();

router.post("/", contactLimiter, validate({ body: contactBodySchema }), submitContactMessage);

export default router;
