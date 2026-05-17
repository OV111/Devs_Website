import { Router } from "express";
import { getUserProfile, followUser, unfollowUser } from "../controllers/userController.js";

const router = Router();

router.get("/users/:username", getUserProfile);
router.post("/users/:username/follow", followUser);
router.delete("/users/:username/follow", unfollowUser);

export default router;
