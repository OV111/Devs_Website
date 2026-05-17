import { Router } from "express";
import { deleteAccount } from "../controllers/accountController.js";

const router = Router();

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
 */

router.delete("/deleteAccount", deleteAccount);

export default router;
