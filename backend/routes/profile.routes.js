import { Router } from "express";
import {
  getProfile,
  updateLastActive,
  updateSettings,
  getNotifications,
  getFollowing,
  getFollowers,
  getMutualFollowers,
  getChatReceiverStats,
} from "../controllers/profileController.js";

const router = Router();

router.get("/", getProfile);
router.put("/", updateLastActive);
router.put("/settings", updateSettings);
router.get("/notifications", getNotifications);
router.get("/following", getFollowing);
router.get("/followers", getFollowers);
router.get("/chats/mutual-followers", getMutualFollowers);
router.get("/chats/:receiverId/stats", getChatReceiverStats);

export default router;
