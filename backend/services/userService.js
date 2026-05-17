import { ObjectId } from "mongodb";
import notificationQueue from "../queues/notificationQueue.js";

export const getUserProfileService = async (db, userName, currentUserId) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");

  const targetUser = await users.findOne({ username: userName });
  if (!targetUser) throw { status: 404, message: "Not Found" };

  const [followDoc, reverseDoc, stats] = await Promise.all([
    follows.findOne({ followerId: currentUserId, followingId: targetUser._id }),
    follows.findOne({ followerId: targetUser._id, followingId: currentUserId }),
    userStats.findOne({ userId: targetUser._id }),
  ]);

  return {
    targetUser,
    stats,
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

  const targetStats = await userStats.findOne({ userId: targetUser._id });
  if ((targetStats?.followersCount ?? 0) <= 0) return;

  await follows.deleteOne({
    followerId: currentUserId,
    followingId: targetUser._id,
  });

  await Promise.all([
    userStats.updateOne(
      { userId: targetUser._id },
      { $inc: { followersCount: -1 } },
      { upsert: true },
    ),
    userStats.updateOne(
      { userId: currentUserId },
      { $inc: { followingsCount: -1 } },
      { upsert: true },
    ),
  ]);
};
