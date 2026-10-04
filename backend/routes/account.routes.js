import { Router } from "express";
import rateLimit from "express-rate-limit";
import { deleteAccount } from "../controllers/accountController.js";

const router = Router();

// The password is the only real check on this endpoint, so a stolen access
// token must not allow unlimited guessing. Only failed attempts count
// (skipSuccessfulRequests), so a legitimate deletion is never blocked.
export const deleteAccountLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please wait 15 minutes and try again.",
    status: 429,
  },
});

/**
 * @openapi
 * tags:
 *   - name: Account
 *     description: Account management
 */

/**
 * @openapi
 * /deleteAccount:
 *   delete:
 *     tags: [Account]
 *     summary: Permanently delete the authenticated user's account
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many failed attempts (5 per 15 minutes)
 *       502:
 *         description: Active subscription could not be cancelled; nothing was deleted
 */

router.delete("/deleteAccount", deleteAccountLimiter, deleteAccount);

export default router;
