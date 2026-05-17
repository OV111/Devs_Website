import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/jwtToken.js";
import {
  getUserProfileService,
  followUserService,
  unfollowUserService,
} from "../services/userService.js";

const resolveCurrentUser = (req) => {
  const result = verifyToken(req.headers.authorization?.replace("Bearer ", ""));
  if (!result) return null;
  return new ObjectId(result.id);
};

export const getUserProfile = async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  if (!userName)
    return res.status(400).json({ message: "Username is required", code: 400 });

  const currentUserId = resolveCurrentUser(req);
  if (!currentUserId)
    return res.status(401).json({ message: "Unauthorized", code: 401 });

  try {
    const db = req.app.locals.db;
    const result = await getUserProfileService(db, userName, currentUserId);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
};

export const followUser = async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  const currentUserId = resolveCurrentUser(req);
  if (!currentUserId)
    return res.status(403).json({ message: "Forbidden", code: 403 });

  try {
    const db = req.app.locals.db;
    await followUserService(db, userName, currentUserId);
    res.status(200).json({ message: "Successfully followed user", code: 200 });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
};

export const unfollowUser = async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  const currentUserId = resolveCurrentUser(req);
  if (!currentUserId)
    return res.status(403).json({ message: "Forbidden", code: 403 });

  try {
    const db = req.app.locals.db;
    await unfollowUserService(db, userName, currentUserId);
    res.status(200).json({ message: "Successfully unfollowed user", code: 200 });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
};
