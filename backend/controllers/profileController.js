import { ObjectId } from "mongodb";
import busboy from "busboy";
import { verifyToken } from "../utils/jwtToken.js";
import { getAuthToken } from "../services/followService.js";
import {
  getProfileService,
  updateLastActiveService,
  updateSettingsService,
  uploadToCloudinary,
  getNotificationsService,
  getFollowingService,
  getFollowersService,
  getMutualFollowersService,
  getChatReceiverStatsService,
} from "../services/profileService.js";

export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const verified = verifyToken(token);
    if (!token || !verified)
      return res.status(403).json({ message: "Forbidden: Invalid Token" });

    const userId = new ObjectId(verified.id);
    const result = await getProfileService(req.app.locals.db, userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message || "Server Error" });
  }
};

export const updateLastActive = async (req, res) => {
  try {
    const { id, lastActive } = req.body;
    const result = await updateLastActiveService(req.app.locals.db, id, lastActive);
    res.status(200).json({ message: "stat", result });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateSettings = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json("Unauthorized: Invalid Token!");

  const bb = busboy({ headers: req.headers, limits: { fileSize: 5 * 1024 * 1024 } });
  const fields = {};
  const fileUploads = {};

  bb.on("file", (fieldname, file) => {
    file.on("limit", () => {
      res.status(400).json({ message: "File too large. Maximum size is 5 MB." });
      file.resume();
    });
    fileUploads[fieldname] = uploadToCloudinary(file);
  });

  bb.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  bb.on("finish", async () => {
    try {
      const resolved = {};
      for (const [key, promise] of Object.entries(fileUploads)) {
        resolved[key] = await promise;
      }

      const userId = new ObjectId(verifyToken(token).id);
      const result = await updateSettingsService(req.app.locals.db, userId, fields, resolved);
      res.status(200).json({ message: "Changes Saved", ...result });
    } catch (err) {
      res.status(500).json({ message: "Error updating profile", error: err.message });
    }
  });

  req.pipe(bb);
};

export const getNotifications = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);
  if (!verified) return res.status(401).json({ message: "Unauthorized" });

  const userId = new ObjectId(verified.id);
  const results = await getNotificationsService(req.app.locals.db, userId);
  res.status(200).json(results);
};

export const getFollowing = async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  const data = await getFollowingService(
    req.app.locals.db,
    auth.userObjectId,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 25,
  );
  res.status(200).json(data);
};

export const getFollowers = async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  const data = await getFollowersService(
    req.app.locals.db,
    auth.userObjectId,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 25,
  );
  res.status(200).json(data);
};

export const getMutualFollowers = async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  const mutualFollowers = await getMutualFollowersService(req.app.locals.db, auth.userObjectId);
  res.status(200).json({ mutualFollowers });
};

export const getChatReceiverStats = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { receiverId } = req.params;
    if (!ObjectId.isValid(receiverId))
      return res.status(400).json({ message: "Bad Request, invalid receiver id" });

    const stats = await getChatReceiverStatsService(req.app.locals.db, receiverId);
    res.status(200).json({ message: "Success", code: 200, stats });
  } catch (err) {
    res.status(500).json({ message: "Server Error", code: 500, error: err.message });
  }
};
