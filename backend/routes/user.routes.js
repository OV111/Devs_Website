import { Router } from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/jwtToken.js";
import notificationQueue from "../queues/notificationQueue.js";

const router = Router();

// GET /users/:username
router.get("/users/:username", async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  if (!userName) {
    return res.status(400).json({ message: "Username is required", code: 400 });
  }

  const verifyTokenResult = verifyToken(
    req.headers.authorization?.replace("Bearer ", ""),
  );
  if (!verifyTokenResult) {
    return res.status(401).json({ message: "Unauthorized", code: 401 });
  }

  const db = req.app.locals.db;
  const currentUserId = new ObjectId(verifyTokenResult.id);
  const users = db.collection("users");
  const targetUser = await users.findOne({ username: userName });

  if (!targetUser) {
    return res.status(404).json({ message: "Not Found", code: 404 });
  }

  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");
  const [followDoc, reverseDoc] = await Promise.all([
    follows.findOne({ followerId: currentUserId, followingId: targetUser._id }),
    follows.findOne({ followerId: targetUser._id, followingId: currentUserId }),
  ]);

  const isFollowing = !!followDoc;
  const isFollower = !!reverseDoc;
  const stats = await userStats.findOne({ userId: targetUser._id });

  res.status(200).json({ targetUser, stats, isFollowing, isFollower });
});

// POST /users/:username/follow
router.post("/users/:username/follow", async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  const verifyTokenResult = verifyToken(
    req.headers.authorization?.replace("Bearer ", ""),
  );
  if (!verifyTokenResult) {
    return res.status(403).json({ message: "Forbidden", code: 403 });
  }

  const db = req.app.locals.db;
  const currentUserId = new ObjectId(verifyTokenResult.id);
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");
  const targetUser = await users.findOne({ username: userName });

  if (!targetUser) {
    return res.status(404).json({ message: "User Not Found!", code: 404 });
  }

  await follows.insertOne({
    followerId: currentUserId,
    followingId: targetUser._id,
    createdAt: new Date(),
  });

  notificationQueue.add("follow", {
    type: "follow",
    actorId: currentUserId.toString(),
    targetUserId: targetUser._id.toString(),
  });

  await userStats.updateOne(
    { userId: targetUser._id },
    { $inc: { followersCount: 1 } },
    { upsert: true },
  );
  await userStats.updateOne(
    { userId: currentUserId },
    { $inc: { followingsCount: 1 } },
    { upsert: true },
  );

  res.status(200).json({ message: "Successfully followed user", code: 200 });
});

// DELETE /users/:username/follow
router.delete("/users/:username/follow", async (req, res) => {
  const userName = decodeURIComponent(req.params.username).trim();
  const verifyTokenResult = verifyToken(
    req.headers.authorization?.replace("Bearer ", ""),
  );
  if (!verifyTokenResult) {
    return res.status(403).json({ message: "Forbidden", code: 403 });
  }

  const db = req.app.locals.db;
  const currentUserId = new ObjectId(verifyTokenResult.id);
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");
  const targetUser = await users.findOne({ username: userName });

  if (!targetUser) {
    return res.status(404).json({ message: "User Not Found!", code: 404 });
  }

  const targetStats = await userStats.findOne({ userId: targetUser._id });
  if ((targetStats?.followersCount ?? 0) > 0) {
    await follows.deleteOne({
      followerId: currentUserId,
      followingId: targetUser._id,
    });
    await userStats.updateOne(
      { userId: targetUser._id },
      { $inc: { followersCount: -1 } },
      { upsert: true },
    );
    await userStats.updateOne(
      { userId: currentUserId },
      { $inc: { followingsCount: -1 } },
      { upsert: true },
    );
  }

  res.status(200).json({ message: "Successfully unfollowed user", code: 200 });
});

export default router;
