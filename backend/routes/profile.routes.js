import { Router } from "express";
import {
  getProfile,
  updateLastActive,
  updateSettings,
  checkUsernameAvailable,
  getNotifications,
  readNotification,
  readAllNotifications,
  removeNotification,
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
import {
  muteRoom,
  clearRoom,
  getBlockedUsers,
  getBlockedUserList,
  blockChatUser,
  unblockChatUser,
} from "../controllers/chatControlsController.js";

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
router.patch("/notifications/read-all", readAllNotifications);
router.patch("/notifications/:id/read", readNotification);
router.delete("/notifications/:id", removeNotification);
router.get("/following", getFollowing);
router.get("/followers", getFollowers);
router.get("/chats/mutual-followers", getMutualFollowers);
router.get("/chats/:receiverId/stats", getChatReceiverStats);

/**
 * @openapi
 * /my-profile/chats/rooms/{roomId}/mute:
 *   patch:
 *     tags: [Profile]
 *     summary: Mute or unmute a chat's notifications (for the caller only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [muted]
 *             properties:
 *               muted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mute state saved
 *       404:
 *         description: Room not found or caller is not a member
 * /my-profile/chats/rooms/{roomId}/clear:
 *   post:
 *     tags: [Profile]
 *     summary: Clear a chat for the caller only (other members keep their history)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Chat cleared for the caller
 * /my-profile/chats/blocks:
 *   get:
 *     tags: [Profile]
 *     summary: Ids of users the caller has blocked
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked user ids
 * /my-profile/blocked-users:
 *   get:
 *     tags: [Profile]
 *     summary: Users the caller has blocked, with name, username and avatar
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked users, newest block first
 * /my-profile/chats/blocks/{userId}:
 *   put:
 *     tags: [Profile]
 *     summary: Block a user from messaging (idempotent)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User blocked
 *   delete:
 *     tags: [Profile]
 *     summary: Unblock a user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User unblocked
 */
router.patch("/chats/rooms/:roomId/mute", muteRoom);
router.post("/chats/rooms/:roomId/clear", clearRoom);
router.get("/chats/blocks", getBlockedUsers);
router.get("/blocked-users", getBlockedUserList);
router.put("/chats/blocks/:userId", blockChatUser);
router.delete("/chats/blocks/:userId", unblockChatUser);

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
