import { ObjectId } from "mongodb";
import notificationQueue from "../queues/notificationQueue.js";

import { withLayerTitles } from "./examHistoryService.js";
import { listPublicCertificatesForUser } from "../modules/capstone/index.js";

// What ANY logged-in viewer may see about another user's account record.
// An explicit allow-list: the old `{ password: 0, googleId: 0, githubId: 0 }`
// deny-list sent everything else — email included — to every profile visitor,
// and would silently leak any field added to `users` later.
export const PUBLIC_USER_FIELDS = Object.freeze({ username: 1, firstName: 1, lastName: 1 });

export const getUserProfileService = async (db, userName, currentUserId) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");
  const userProgress = db.collection("userProgress");
  const examHistory = db.collection("examHistory");
  const usernameHistory = db.collection("usernameHistory");

  const targetUser = await users.findOne(
    { username: userName },
    { projection: PUBLIC_USER_FIELDS },
  );
  if (!targetUser) {
    const history = await usernameHistory.findOne({ oldUsername: userName });
    if (history) {
      const currentOwner = await users.findOne(
        { _id: history.userId },
        { projection: { username: 1 } },
      );
      if (currentOwner?.username) {
        throw { status: 404, message: "Username changed", redirect: currentOwner.username };
      }
    }
    throw { status: 404, message: "Not Found" };
  }

  const [followDoc, reverseDoc, stats, progress, exams, certificates] = await Promise.all([
    follows.findOne({ followerId: currentUserId, followingId: targetUser._id }),
    follows.findOne({ followerId: targetUser._id, followingId: currentUserId }),
    userStats.findOne({ userId: targetUser._id }),
    userProgress.findOne({ userId: targetUser._id }),
    examHistory
      .find({ userId: targetUser._id })
      .sort({ takenAt: -1 })
      .limit(10)
      .toArray()
      .then((rows) => withLayerTitles(db, rows)),
    listPublicCertificatesForUser(db, targetUser._id, targetUser.username),
  ]);

  return {
    targetUser,
    stats,
    progress: progress ?? null,
    examHistory: exams,
    certificates,
    isFollowing: !!followDoc,
    isFollower: !!reverseDoc,
  };
};

export const followUserService = async (db, userName, currentUserId) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");

  const targetUser = await users.findOne({ username: userName });
  if (!targetUser) throw { status: 404, message: "User Not Found!" };

  try {
    await follows.insertOne({
      followerId: currentUserId,
      followingId: targetUser._id,
      createdAt: new Date(),
    });
  } catch (err) {
    if (err.code === 11000) return; // already following — idempotent
    throw err;
  }

  notificationQueue.add("follow", {
    type: "follow",
    actorId: currentUserId.toString(),
    targetUserId: targetUser._id.toString(),
  });

  await Promise.all([
    userStats.updateOne(
      { userId: targetUser._id },
      { $inc: { followersCount: 1 } },
      { upsert: true },
    ),
    userStats.updateOne(
      { userId: currentUserId },
      { $inc: { followingsCount: 1 } },
      { upsert: true },
    ),
  ]);
};

export const unfollowUserService = async (db, userName, currentUserId) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");

  const targetUser = await users.findOne({ username: userName });
  if (!targetUser) throw { status: 404, message: "User Not Found!" };

  const deleted = await follows.deleteOne({
    followerId: currentUserId,
    followingId: targetUser._id,
  });

  if (!deleted.deletedCount) return;

  await Promise.all([
    userStats.updateOne(
      { userId: targetUser._id },
      [{ $set: { followersCount: { $max: [0, { $subtract: ["$followersCount", 1] }] } } }],
    ),
    userStats.updateOne(
      { userId: currentUserId },
      [{ $set: { followingsCount: { $max: [0, { $subtract: ["$followingsCount", 1] }] } } }],
    ),
  ]);
};
