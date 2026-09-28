import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import {
  getFollowersData,
  getFollowingData,
} from "./followService.js";
import { sanitizeUsername } from "../utils/username.js";

export const getProfileService = async (db, userId) => {
  const users = db.collection("users");
  const usersStats = db.collection("usersStats");

  const [user, stats] = await Promise.all([
    users.findOne({ _id: userId }),
    usersStats.findOne({ userId }),
  ]);

  if (!user) throw { status: 404, message: "User Not Found!" };

  await usersStats.updateOne(
    { userId },
    { $set: { lastActive: new Date() } },
  );

  const { _password, ...userWithoutPassword } = user;
  return { userWithoutPassword, stats };
};

export const updateLastActiveService = async (db, id, lastActive) => {
  const usersStats = db.collection("usersStats");
  return usersStats.findOneAndUpdate(
    { userId: new ObjectId(id) },
    { $set: { lastActive } },
  );
};

export const updateSettingsService = async (db, userId, fields, files) => {
  const users = db.collection("users");
  const usersStats = db.collection("usersStats");
  const usernameHistory = db.collection("usernameHistory");

  const userUpdate = {};
  if (fields.fname !== undefined) userUpdate.firstName = fields.fname;
  if (fields.lname !== undefined) userUpdate.lastName = fields.lname;

  let previousUsername = null;
  if (fields.username !== undefined) {
    const clean = sanitizeUsername(fields.username);
    if (clean.length < 3) {
      throw {
        status: 400,
        message: "Username must be at least 3 characters (letters and numbers only).",
      };
    }
    const existing = await users.findOne({
      username: clean,
      _id: { $ne: userId },
    });
    if (existing) {
      throw { status: 409, message: "That username is already taken." };
    }

    const currentUser = await users.findOne({ _id: userId }, { projection: { username: 1 } });
    if (currentUser?.username && currentUser.username !== clean) {
      previousUsername = currentUser.username;
    }

    userUpdate.username = clean;
  }

  const statsUpdate = { lastActive: new Date() };
  if (fields.bio !== undefined) statsUpdate.bio = fields.bio;
  if (fields.postsCount !== undefined) statsUpdate.postsCount = Number(fields.postsCount);
  if (fields.githubLink !== undefined) statsUpdate.githubLink = fields.githubLink;
  if (fields.linkedinLink !== undefined) statsUpdate.linkedinLink = fields.linkedinLink;
  if (fields.twitterLink !== undefined) statsUpdate.twitterLink = fields.twitterLink;
  if (fields.location !== undefined) statsUpdate.location = fields.location;
  if (fields.timezone !== undefined) statsUpdate.timezone = fields.timezone;
  if (files.profileImage) statsUpdate.profileImage = files.profileImage;
  if (files.bannerImage) statsUpdate.bannerImage = files.bannerImage;
  if (files.cvFile) statsUpdate.cvUrl = files.cvFile;

  let updatedUser;
  if (Object.keys(userUpdate).length > 0) {
    const result = await users.findOneAndUpdate(
      { _id: userId },
      { $set: userUpdate },
      { returnDocument: "after" },
    );
    updatedUser = result.value || result;

    if (userUpdate.username) {
      // A reclaimed old handle should point at whoever holds it now, not a stale owner.
      await usernameHistory.deleteOne({ oldUsername: userUpdate.username });
    }
    if (previousUsername) {
      await usernameHistory.updateOne(
        { oldUsername: previousUsername },
        { $set: { oldUsername: previousUsername, userId, changedAt: new Date() } },
        { upsert: true },
      );
    }
  } else {
    updatedUser = await users.findOne({ _id: userId });
  }

  const statsResult = await usersStats.findOneAndUpdate(
    { userId },
    { $set: statsUpdate },
    { returnDocument: "after", upsert: true },
  );

  return { user: updatedUser, stats: statsResult.value || statsResult };
};

export const checkUsernameAvailableService = async (db, userId, rawUsername) => {
  const users = db.collection("users");
  const clean = sanitizeUsername(rawUsername);

  if (clean.length < 3) {
    return { available: false, username: clean, reason: "too_short" };
  }

  const existing = await users.findOne({
    username: clean,
    _id: { $ne: userId },
  });

  return { available: !existing, username: clean };
};

export const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "devs_website" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    file.pipe(stream);
  });

export const getNotificationsService = async (db, userId) => {
  const notifications = db.collection("notifications");
  return notifications
    .find({ targetUserId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
};

export const getFollowingService = (db, userId, page, limit) =>
  getFollowingData({ userId, db, page, limit });

export const getFollowersService = (db, userId, page, limit) =>
  getFollowersData({ userId, db, page, limit });

export const getMutualFollowersService = async (db, userId) => {
  const users = db.collection("users");
  const follows = db.collection("follows");

  const [followingDocs, followersDocs] = await Promise.all([
    follows.find({ followerId: userId }).toArray(),
    follows.find({ followingId: userId }).toArray(),
  ]);

  const followingIds = followingDocs.map((doc) => doc.followingId);
  const followersSet = new Set(
    followersDocs.map((doc) => doc.followerId.toString()),
  );
  const mutualFollowerIds = followingIds.filter((id) =>
    followersSet.has(id.toString()),
  );

  return users
    .aggregate([
      { $match: { _id: { $in: mutualFollowerIds } } },
      {
        $lookup: {
          from: "usersStats",
          localField: "_id",
          foreignField: "userId",
          as: "stats",
        },
      },
      { $unwind: { path: "$stats", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          username: 1,
          email: 1,
          stats: 1,
        },
      },
    ])
    .toArray();
};

export const getChatReceiverStatsService = async (db, receiverId) => {
  const usersStats = db.collection("usersStats");
  return usersStats.findOne({ userId: new ObjectId(receiverId) });
};
