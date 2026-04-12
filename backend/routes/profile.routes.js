import { Router } from "express";
import { ObjectId } from "mongodb";
import busboy from "busboy";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "../utils/jwtToken.js";
import {
  getAuthToken,
  getFollowersData,
  getFollowingData,
} from "../services/followService.js";

const router = Router();

// GET /my-profile
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }
    const verified = verifyToken(token);
    if (!verified) {
      return res.status(403).json({ message: "Forbidden: Invalid Token" });
    }

    const db = req.app.locals.db;
    const userId = new ObjectId(verified.id);
    const users = db.collection("users");
    const usersStats = db.collection("usersStats");

    const [user, stats] = await Promise.all([
      users.findOne({ _id: userId }),
      usersStats.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    await usersStats.updateOne({ userId }, { $set: { lastActive: new Date() } });
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({ userWithoutPassword, stats });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});

// PUT /my-profile
router.put("/", async (req, res) => {
  try {
    const parsedData = req.body;
    const db = req.app.locals.db;
    const usersStats = db.collection("usersStats");
    const result = await usersStats.findOneAndUpdate(
      { userId: new ObjectId(parsedData.id) },
      { $set: { lastActive: parsedData.lastActive } },
    );
    res.status(200).json({ message: "stat", result });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// PUT /my-profile/settings  (multipart/form-data via busboy)
router.put("/settings", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json("Unauthorized: Invalid Token!");
  }

  const bb = busboy({ headers: req.headers });
  const fields = {};
  const files = {};

  bb.on("file", (fieldname, file) => {
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "devs_website" },
        (error, result) => {
          if (error) return reject(error);
          files[fieldname] = result.secure_url;
          resolve();
        },
      );
      file.pipe(stream);
    });
    files[`${fieldname}_promise`] = uploadPromise;
  });

  bb.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  bb.on("finish", async () => {
    try {
      const uploadPromises = Object.keys(files)
        .filter((k) => k.endsWith("_promise"))
        .map((k) => files[k]);
      await Promise.all(uploadPromises);

      const db = req.app.locals.db;
      const users = db.collection("users");
      const usersStats = db.collection("usersStats");

      const userUpdate = {};
      if (fields.fname !== undefined) userUpdate.firstName = fields.fname;
      if (fields.lname !== undefined) userUpdate.lastName = fields.lname;

      const statsUpdate = { lastActive: new Date() };
      if (fields.bio !== undefined) statsUpdate.bio = fields.bio;
      if (fields.postsCount !== undefined) statsUpdate.postsCount = Number(fields.postsCount);
      if (fields.githubLink !== undefined) statsUpdate.githubLink = fields.githubLink;
      if (fields.linkedinLink !== undefined) statsUpdate.linkedinLink = fields.linkedinLink;
      if (fields.twitterLink !== undefined) statsUpdate.twitterLink = fields.twitterLink;
      if (fields.location !== undefined) statsUpdate.location = fields.location;
      if (files.profileImage) statsUpdate.profileImage = files.profileImage;
      if (files.bannerImage) statsUpdate.bannerImage = files.bannerImage;

      const userId = new ObjectId(verifyToken(token).id);

      let updatedUser;
      if (Object.keys(userUpdate).length > 0) {
        const result = await users.findOneAndUpdate(
          { _id: userId },
          { $set: userUpdate },
          { returnDocument: "after" },
        );
        updatedUser = result.value || result;
      } else {
        updatedUser = await users.findOne({ _id: userId });
      }

      const statsResult = await usersStats.findOneAndUpdate(
        { userId },
        { $set: statsUpdate },
        { returnDocument: "after", upsert: true },
      );
      const updatedStats = statsResult.value || statsResult;

      res.status(200).json({
        message: "Changes Saved",
        user: updatedUser,
        stats: updatedStats,
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating profile", error: err.message });
    }
  });

  req.pipe(bb);
});

// GET /my-profile/notifications
router.get("/notifications", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const db = req.app.locals.db;
  const currentUserId = new ObjectId(verified.id);
  const notifications = db.collection("notifications");
  const results = await notifications
    .find({ targetUserId: currentUserId.toString() })
    .sort({ createdAt: -1 })
    .toArray();

  res.status(200).json(results);
});

// GET /my-profile/following
router.get("/following", async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) {
    return res.status(auth.status).json({ message: auth.message });
  }

  const db = req.app.locals.db;
  const data = await getFollowingData({
    userId: auth.userObjectId,
    db,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 25,
  });
  res.status(200).json(data);
});

// GET /my-profile/followers
router.get("/followers", async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) {
    return res.status(auth.status).json({ message: auth.message });
  }

  const db = req.app.locals.db;
  const data = await getFollowersData({
    userId: auth.userObjectId,
    db,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 25,
  });
  res.status(200).json(data);
});

// GET /my-profile/chats/mutual-followers  (must be before /:receiverId/stats)
router.get("/chats/mutual-followers", async (req, res) => {
  const auth = getAuthToken(req.headers.authorization);
  if (!auth.ok) {
    return res.status(auth.status).json({ message: auth.message });
  }

  const db = req.app.locals.db;
  const userId = auth.userObjectId;
  const follows = db.collection("follows");

  const followingDocs = await follows.find({ followerId: new ObjectId(userId) }).toArray();
  const followersDocs = await follows.find({ followingId: new ObjectId(userId) }).toArray();
  const followingIds = followingDocs.map((doc) => doc.followingId);
  const followersIds = followersDocs.map((doc) => doc.followerId);
  const mutualFollowerIds = followingIds.filter((id) =>
    followersIds.some((fid) => fid.equals(id)),
  );

  const users = db.collection("users");
  const mutualFollowers = await users
    .find({ _id: { $in: mutualFollowerIds } }, { projection: { password: 0 } })
    .toArray();

  res.status(200).json({ mutualFollowers });
});

// GET /my-profile/chats/:receiverId/stats
router.get("/chats/:receiverId/stats", async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) {
      return res.status(auth.status).json({ message: auth.message });
    }

    const { receiverId } = req.params;
    if (!ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Bad Request, invalid receiver id" });
    }

    const db = req.app.locals.db;
    const usersStats = db.collection("usersStats");
    const stats = await usersStats.findOne({ userId: new ObjectId(receiverId) });

    res.status(200).json({ message: "Success", code: 200, stats });
  } catch (err) {
    res.status(500).json({ message: "Server Error", code: 500, error: err.message });
  }
});

export default router;
