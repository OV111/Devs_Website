import { Router } from "express";
import {
  getProfile,
  updateLastActive,
  updateSettings,
  checkUsernameAvailable,
  getNotifications,
  getFollowing,
  getFollowers,
  getMutualFollowers,
  getChatReceiverStats,
} from "../controllers/profileController.js";
import {
  createGroup,
  addGroupMember,
  removeGroupMember,
  leaveGroup,
  setGroupAdmin,
  updateGroup,
  getGroupDetails,
} from "../controllers/groupChatController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Profile
 *     description: Authenticated user's profile and settings
 */

/**
 * @openapi
 * /my-profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get current user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 *   put:
 *     tags: [Profile]
 *     summary: Update last active timestamp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               lastActive:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */

/**
 * @openapi
 * /my-profile/settings:
 *   put:
 *     tags: [Profile]
 *     summary: Update profile settings (name, bio, links, avatar, banner)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               linkedinLink:
 *                 type: string
 *               twitterLink:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Settings saved
 */

/**
 * @openapi
 * /my-profile/notifications:
 *   get:
 *     tags: [Profile]
 *     summary: Get notifications for current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */

/**
 * @openapi
 * /my-profile/followers:
 *   get:
 *     tags: [Profile]
 *     summary: Get followers of current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 */

/**
 * @openapi
 * /my-profile/following:
 *   get:
 *     tags: [Profile]
 *     summary: Get users the current user follows
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of following
 */

/**
 * @openapi
 * /my-profile/chats/mutual-followers:
 *   get:
 *     tags: [Profile]
 *     summary: Get mutual followers (can message each other)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of mutual followers
 */

/**
 * @openapi
 * /my-profile/chats/{receiverId}/stats:
 *   get:
 *     tags: [Profile]
 *     summary: Get chat receiver profile stats
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Receiver stats
 */

router.get("/", getProfile);
router.put("/", updateLastActive);
router.put("/settings", updateSettings);
router.get("/username-available", checkUsernameAvailable);
router.get("/notifications", getNotifications);
router.get("/following", getFollowing);
router.get("/followers", getFollowers);
router.get("/chats/mutual-followers", getMutualFollowers);
router.get("/chats/:receiverId/stats", getChatReceiverStats);

/**
 * @openapi
 * /my-profile/chats/groups:
 *   post:
 *     tags: [Profile]
 *     summary: Create a group chat
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, memberIds]
 *             properties:
 *               name:
 *                 type: string
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Group created
 */
router.post("/chats/groups", createGroup);

/**
 * @openapi
 * /my-profile/chats/groups/{roomId}:
 *   get:
 *     tags: [Profile]
 *     summary: Get group details and member list
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *   patch:
 *     tags: [Profile]
 *     summary: Rename a group or change its avatar (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group updated
 */
router.get("/chats/groups/:roomId", getGroupDetails);
router.patch("/chats/groups/:roomId", updateGroup);

/**
 * @openapi
 * /my-profile/chats/groups/{roomId}/members:
 *   post:
 *     tags: [Profile]
 *     summary: Add a member to a group (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member added
 */
router.post("/chats/groups/:roomId/members", addGroupMember);

/**
 * @openapi
 * /my-profile/chats/groups/{roomId}/members/{memberId}:
 *   delete:
 *     tags: [Profile]
 *     summary: Remove a member from a group (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete("/chats/groups/:roomId/members/:memberId", removeGroupMember);

/**
 * @openapi
 * /my-profile/chats/groups/{roomId}/leave:
 *   post:
 *     tags: [Profile]
 *     summary: Leave a group chat
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left the group
 */
router.post("/chats/groups/:roomId/leave", leaveGroup);

/**
 * @openapi
 * /my-profile/chats/groups/{roomId}/admins/{memberId}:
 *   patch:
 *     tags: [Profile]
 *     summary: Promote or demote a group admin (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promote:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Admin status updated
 */
router.patch("/chats/groups/:roomId/admins/:memberId", setGroupAdmin);

export default router;
