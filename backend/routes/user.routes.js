import { Router } from "express";
import { getUserProfile, followUser, unfollowUser } from "../controllers/userController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Public user profiles and follow system
 */

/**
 * @openapi
 * /users/{username}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user's public profile
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /users/{username}/follow:
 *   post:
 *     tags: [Users]
 *     summary: Follow a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Now following
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollowed
 */

router.get("/users/:username", getUserProfile);
router.post("/users/:username/follow", followUser);
router.delete("/users/:username/follow", unfollowUser);

export default router;
