import http from "http";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });
import connectDB from "./config/db.js";
import process from "process";
import cookie from "cookie";
import bcrypt from "bcrypt";
import busboy from "busboy";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import initWebSocketServer from "./websocket/index.js";
import NotificationWorker from "./workers/notificationWorker.js";
import notificationQueue from "./queues/notificationQueue.js";

import { postHandling } from "./routes/postHandling.js";
import { defaultPostsHandling } from "./routes/handleDefPosts.js";

import { signUp, login } from "./controllers/authController.js";
import { verifyToken } from "./utils/jwtToken.js";
import { ObjectId } from "mongodb";
import { CATEGORY_OPTIONS } from "../constants/Categories.js";
import {
  getAuthToken,
  getFollowersData,
  getFollowingData,
} from "./services/followService.js";
import { type } from "os";

const PORT = process.env.PORT || 5000;
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let db;
// (async () => {
//   try {
//     db = await connectDB();
//   } catch (err) {
//     console.log("failed to connect", err);
//     process.exit(1);
//   }
// })();
const failedLoginByIp = new Map();
const MAX_FAILED_LOGINS = 5;
const getClientIp = (req) => {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .toString()
    .split(",")[0]
    .trim();
};

const DEFAULT_FOLLOWERS_LIMIT = 25;
const MAX_FOLLOWERS_LIMIT = 50;

const StartServer = async () => {
  try {
    db = await connectDB();

    const server = http.createServer(async (req, res) => {
      const maintenance = false;
      if (maintenance) {
        res.writeHead(503, { "content-type": "application/json" });
        return res.end("Server is under Maintenance");
      }

      // CORS Headers
      res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, OPTIONS, DELETE",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
      }

      // const cookies = cookie.parse(req.headers.cookie || "");
      // console.log("Incoming cookies ", cookies);

      if (
        req.method === "POST" &&
        ["/accept-cookies", "/get-started", "/login"].includes(req.url)
      ) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body);
            if (req.url === "/accept-cookies") {
              if (data.accepted) {
                const serialized = cookie.serialize("cookiesAccepted", "true", {
                  httpOnly: false,
                  maxAge: 60 * 60 * 24 * 365,
                  path: "/",
                });
                res.setHeader("Set-Cookie", serialized);
                res.writeHead(200, { "content-type": "application/json" });
                return res.end(
                  JSON.stringify({ message: "Cookies Accepted", code: 200 }),
                );
              }
            } else if (req.url === "/get-started") {
              const result = await signUp(data);

              if (result.status === 409) {
                res.writeHead(result.status, {
                  "content-type": "application/json",
                });
                return res.end(JSON.stringify(result));
              }

              res.writeHead(result.status, {
                "content-type": "application/json",
              });
              return res.end(JSON.stringify(result));
            } else if (req.url === "/login") {
              const ip = getClientIp(req);
              const failedCount = failedLoginByIp.get(ip) || 0;
              if (failedCount >= MAX_FAILED_LOGINS) {
                res.writeHead(429, { "content-type": "application/json" });
                return res.end(
                  JSON.stringify({
                    message: "Too many login attempts. Please try again later.",
                    code: 429,
                  }),
                );
              }
              const result = await login(data);
              if (result.status === 200) {
                failedLoginByIp.delete(ip);
                const serialized = cookie.serialize("session", result.userId, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "strict",
                  maxAge: 60 * 60,
                  path: "/",
                });
                res.setHeader("Set-Cookie", serialized);
              } else if ([401, 404].includes(result.status)) {
                failedLoginByIp.set(ip, failedCount + 1);
              }

              res.writeHead(result.status, {
                "content-type": "application/json",
              });
              return res.end(JSON.stringify(result));
            } else {
              res.writeHead(404, { "content-type": "application/json" });
              return res.end(JSON.stringify({ message: "Not Found!" }));
            }
          } catch (err) {
            res.writeHead(500, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Server Error.",
                code: 500,
                error: err.message,
              }),
            );
          }
        });

        // ! Initial Lines
      } else if (req.method === "GET" && req.url.startsWith("/categories/")) {
        try {
          const categoryName = decodeURIComponent(req.url.split("/")[2]);
          const isDefault = decodeURIComponent(req.url.split("/")[3]) === "default";

          let result;
          if (isDefault) {
            result = await defaultPostsHandling(categoryName);
          } else {
            result = await postHandling(categoryName);
          }

          res.writeHead(result.status, {
            "content-type": "application/json",
          });
          return res.end(JSON.stringify(result.data));
          // ! here getting result from cache server not DB--(postsHandling will check that)
        } catch (err) {
          console.log(err);
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Server Error!",
              code: 500,
            }),
          );
        }
      }

      if (req.method === "GET" && req.url === "/verify-token") {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const isValid = verifyToken(token);
        if (!isValid) {
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(JSON.stringify({ valid: false }));
        }
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify({ valid: true }));
      }

      if (req.method === "POST" && req.url === "/blogs") {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!verifyToken(token)) {
          res.writeHead(401, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Unauthorized", code: 401 }),
          );
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          const data = JSON.parse(body);
          const blogs = db.collection("blogs");

          const newBlog = {
            title: data.title,
            text: data.text,
            category: data.category,
            file: data.file,
          };
          const result = await blogs.insertOne(newBlog);

          res.writeHead(201, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ code: 201, message: "Created Blog" }),
          );
        });
      } else if (req.url === "/log-out" && req.method === "DELETE") {
        try {
          const serialized = cookie.serialize("session", "", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
          });
          res.setHeader("Set-Cookie", serialized);
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Logged out succesfully", code: 200 }),
          );
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Logout Error",
              code: 500,
              error: err.message,
            }),
          );
        }
      } else if (req.url === "/my-profile" && req.method === "GET") {
        try {
          const token = req.headers.authorization?.replace("Bearer ", "");
          if (!token) {
            res.writeHead(403, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({ message: "Forbidden: Invalid Token" }),
            );
          }
          const verified = verifyToken(token);
          const users = db.collection("users");
          const usersStats = db.collection("usersStats");

          const userId = new ObjectId(verified.id);

          const [user, stats] = await Promise.all([
            users.findOne({ _id: userId }),
            usersStats.findOne({ userId }),
          ]);
          // const user = await users.findOne({ _id: new ObjectId(verified.id) });
          // const stats = await usersStats.findOne({
          //   userId: new ObjectId(verified.id),
          // });

          if (!user) {
            res.writeHead(404, { "content-type": "application/json" });
            return res.end(JSON.stringify({ message: "User Not Found!" }));
          }

          await usersStats.updateOne(
            { userId },
            { $set: { lastActive: new Date() } },
          );
          const { password, ...userWithoutPassword } = user;

          res.writeHead(200, { "content-type": "application/json" });
          return res.end(JSON.stringify({ userWithoutPassword, stats }));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Server Error", error: err }),
          );
        }
      } else if (req.url === "/my-profile" && req.method === "PUT") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          let parsedData = JSON.parse(body);
          const usersStats = db.collection("usersStats");
          const result = await usersStats.findOneAndUpdate(
            { userId: new ObjectId(parsedData.id) },
            { $set: { lastActive: parsedData.lastActive } },
          );
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: "stat", result }));
        });
      } else if (req.url === "/my-profile/settings" && req.method === "PUT") {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(JSON.stringify("Unauthorized: Invalid Token!"));
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

            const users = db.collection("users");
            const usersStats = db.collection("usersStats");
            const userUpdate = {};
            if (fields.fname !== undefined) userUpdate.firstName = fields.fname;
            if (fields.lname !== undefined) userUpdate.lastName = fields.lname;

            const statsUpdate = {
              lastActive: new Date(),
            };
            if (fields.bio !== undefined) statsUpdate.bio = fields.bio;
            if (fields.postsCount !== undefined)
              statsUpdate.postsCount = Number(fields.postsCount);
            if (fields.githubLink !== undefined)
              statsUpdate.githubLink = fields.githubLink;
            if (fields.linkedinLink !== undefined)
              statsUpdate.linkedinLink = fields.linkedinLink;
            if (fields.twitterLink !== undefined)
              statsUpdate.twitterLink = fields.twitterLink;
            if (fields.location !== undefined)
              statsUpdate.location = fields.location;
            if (files.profileImage)
              statsUpdate.profileImage = files.profileImage;
            if (files.bannerImage) statsUpdate.bannerImage = files.bannerImage;

            const userId = new ObjectId(verifyToken(token).id);

            // ✅ Only update if there are changes
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

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Changes Saved",
                user: updatedUser,
                stats: updatedStats,
              }),
            );
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Error updating profile",
                error: err.message,
              }),
            );
          }
        });
        req.pipe(bb);
      }

      const chatStatsMatch = new URL(
        req.url,
        `http://${req.headers.host}`,
      ).pathname.match(/^\/my-profile\/chats\/([^/]+)\/stats$/);
      if (req.method === "GET" && chatStatsMatch) {
        try {
          const auth = getAuthToken(req.headers.authorization);
          if (!auth.ok) {
            res.writeHead(auth.status, { "content-type": "application/json" });
            return res.end(JSON.stringify({ message: auth.message }));
          }
          const receiverId = decodeURIComponent(chatStatsMatch[1] || "");
          if (!receiverId) {
            res.writeHead(400, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Bad Request, missing receiver id",
                code: 400,
              }),
            );
          }
          if (!ObjectId.isValid(receiverId)) {
            res.writeHead(400, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({ message: "Bad Request, invalid receiver id" }),
            );
          }
          const usersStats = db.collection("usersStats");

          const stats = await usersStats.findOne({
            userId: new ObjectId(receiverId),
          });
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Success", code: 200, stats }),
          );
        } catch (err) {
          console.log(err);
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Server Error",
              code: 500,
              error: err.message,
            }),
          );
        }
      } else if (
        req.method === "GET" &&
        req.url.startsWith("/my-profile/chats/mutual-followers")
      ) {
        const auth = getAuthToken(req.headers.authorization);
        if (!auth.ok) {
          res.writeHead(auth.status, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: auth.message }));
        }
        const userId = auth.userObjectId;
        const follows = db.collection("follows");
        const followingDocs = await follows
          .find({ followerId: new ObjectId(userId) })
          .toArray();
        const followersDocs = await follows
          .find({ followingId: new ObjectId(userId) })
          .toArray();
        const followingIds = followingDocs.map((doc) => doc.followingId);
        const followersIds = followersDocs.map((doc) => doc.followerId);
        const mutualFollowerIds = followingIds.filter((id) =>
          followersIds.some((fid) => fid.equals(id)),
        );
        const users = db.collection("users");
        const mutualFollowers = await users
          .find(
            { _id: { $in: mutualFollowerIds } },
            { projection: { password: 0 } },
          )
          .toArray();
        res.writeHead(200, {
          "content-type": "application/json",
        });
        return res.end(JSON.stringify({ mutualFollowers }));
      }

      if (req.method === "GET" && req.url === "/my-profile/notifications") {
        const token = req.headers["authorization"]?.split(" ")[1];
        const verified = verifyToken(token);
        if (!verified) {
          res.writeHead(401, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: "Unauthorized" }));
        }
        const currentUserId = new ObjectId(verified.id);
        const notifications = db.collection("notifications");

        const results = await notifications.find({ targetUserId: currentUserId.toString() }).sort({ createdAt: -1 }).toArray();

        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify(results));
      }

      if (req.method === "GET" && req.url.startsWith("/my-profile/following")) {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const rawPage = Number(reqUrl.searchParams.get("page"));
        const rawLimit = Number(reqUrl.searchParams.get("limit"));
        const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
        const limit =
          Number.isFinite(rawLimit) && rawLimit > 0
            ? Math.min(rawLimit, DEFAULT_FOLLOWERS_LIMIT)
            : DEFAULT_FOLLOWERS_LIMIT;
        const auth = getAuthToken(req.headers.authorization);
        if (!auth.ok) {
          res.writeHead(auth.status, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: auth.message }));
        }
        const userId = auth.userObjectId;
        const data = await getFollowingData({ userId, db, page, limit });
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify(data));
      } else if (
        req.method === "GET" &&
        req.url.startsWith("/my-profile/followers")
      ) {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const rawPage = Number(reqUrl.searchParams.get("page"));
        const rawLimit = Number(reqUrl.searchParams.get("limit"));
        const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
        const limit =
          Number.isFinite(rawLimit) && rawLimit > 0
            ? Math.min(rawLimit, DEFAULT_FOLLOWERS_LIMIT)
            : DEFAULT_FOLLOWERS_LIMIT;
        const auth = getAuthToken(req.headers.authorization);
        if (!auth.ok) {
          res.writeHead(auth.status, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: auth.message }));
        }
        const userId = auth.userObjectId;
        const data = await getFollowersData({ userId, db, page, limit });
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify(data));
      }

      if (req.method === "GET" && req.url.startsWith("/search/users")) {
        try {
          const reqUrl = new URL(req.url, `http://${req.headers.host}`);
          const query = reqUrl.searchParams.get("q")?.trim() || "";
          if (!query) {
            res.writeHead(200, { "content-type": "application/json" });
            return res.end(JSON.stringify({ results: [] }));
          }
          const users = db.collection("users");
          const regex = new RegExp(escapeRegex(query), "i");
          const foundUsers = await users
            .find(
              {
                $or: [
                  { username: { $regex: regex } },
                  { firstName: { $regex: regex } },
                  { lastName: { $regex: regex } },
                ],
              },
              {
                projection: {
                  password: 0,
                },
              },
            )
            .limit(10)
            .toArray();

          const results = foundUsers.map((user) => ({
            id: user._id,
            type: "user",
            title:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.username,
            username: user.username,
          }));
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(JSON.stringify({ results }));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Search failed",
              code: 500,
              error: err.message,
            }),
          );
        }
      } else if (
        req.method === "GET" &&
        req.url.startsWith("/search/categories")
      ) {
        try {
          const reqUrl = new URL(req.url, `http://${req.headers.host}`);
          const query = reqUrl.searchParams.get("q")?.trim() || "";
          if (!query) {
            res.writeHead(200, { "content-type": "application/json" });
            return res.end(JSON.stringify({ results: [] }));
          }
          const categories = CATEGORY_OPTIONS.filter((category) => {
            const regex = new RegExp(escapeRegex(query), "i");
            return regex.test(category.title) || regex.test(category.slug);
          }).map((category) => ({
            id: category.id,
            type: "category",
            title: category.title,
            slug: category.slug,
          }));
          res.writeHead(200, { "content-type": "application/json" });
          return res.end(JSON.stringify({ results: categories }));
        } catch (err) {
          res.writeHead(500, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Search failed",
              code: 500,
              error: err.message,
            }),
          );
        }
      } else if (req.method === "GET" && req.url.startsWith("/users/")) {
        const userName = decodeURIComponent(req.url.split("/")[2] || "").trim();
        if (!userName) {
          res.writeHead(400, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Username is required", code: 400 }),
          );
        }
        const verifyTokenResult = verifyToken(
          req.headers.authorization?.replace("Bearer ", ""),
        );
        if (!verifyTokenResult) {
          res.writeHead(401, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "Unauthorized", code: 401 }),
          );
        }
        let isFollowing = false;
        let isFollower = false;
        const currentUserId = new ObjectId(verifyTokenResult?.id);
        const users = db.collection("users");
        const targetUser = await users.findOne({ username: userName });

        if (!targetUser) {
          res.writeHead(404, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: "Not Found", code: 404 }));
        }

        const userStats = db.collection("usersStats");
        const follows = db.collection("follows");
        const [followDoc, reverseDoc] = await Promise.all([
          follows.findOne({
            followerId: currentUserId,
            followingId: targetUser._id,
          }),
          follows.findOne({
            followerId: targetUser._id,
            followingId: currentUserId,
          }),
        ]);
        if (followDoc) isFollowing = true;
        if (reverseDoc) isFollower = true;

        const stats = await userStats.findOne({ userId: targetUser._id });

        res.writeHead(200, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({ targetUser, stats, isFollowing, isFollower }),
        );
      }

      const followMatch = new URL(
        req.url,
        `http://${req.headers.host}`,
      ).pathname.match(/^\/users\/([^/]+)\/follow$/);
      if (followMatch) {
        const userName = decodeURIComponent(followMatch[1] || "").trim();
        const verifyTokenResult = verifyToken(
          req.headers.authorization?.replace("Bearer ", ""),
        );
        if (!verifyTokenResult) {
          res.writeHead(403, { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: "Forbidden", code: 403 }));
        }
        const currentUserId = new ObjectId(verifyTokenResult.id);
        const users = db.collection("users");
        const userStats = db.collection("usersStats");
        const follows = db.collection("follows");
        const targetUser = await users.findOne({ username: userName });

        if (!targetUser) {
          res.writeHead(404, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({ message: "User Not Found!", code: 404 }),
          );
        }
        if (req.method === "POST") {
          await follows.insertOne({
            followerId: currentUserId,
            followingId: targetUser._id,
            createdAt: new Date(),
          });
          // notification for being followed
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

          res.writeHead(200, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Successfully followed user",
              code: 200,
            }),
          );
        } else if (req.method === "DELETE") {
          const targetStats = await userStats.findOne({
            userId: targetUser._id,
          });

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

          res.writeHead(200, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Successfully unfollowed user",
              code: 200,
            }),
          );
        } else {
          res.writeHead(405, { "content-type": "application/json" });
          return res.end(
            JSON.stringify({
              message: "Method Not Allowed",
              code: 405,
            }),
          );
        }
      }
      if (req.url === "/deleteAccount" && req.method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const token = req.headers.authorization?.replace("Bearer ", "");
            const verifyTokenResult = verifyToken(token);
            if (!verifyTokenResult) {
              res.writeHead(401, { "content-type": "application/json" });
              return res.end(
                JSON.stringify({
                  message: "Unauthorized: Invalid Token",
                  status: 401,
                }),
              );
            }

            let data = JSON.parse(body);
            const email = data.email?.trim();
            const password = data.password?.trim();
            if (!email || !password) {
              res.writeHead(400, { "content-type": "application/json" });
              return res.end(
                JSON.stringify({
                  message: "Email and password are required",
                  status: 400,
                }),
              );
            }

            const users = db.collection("users");
            const userStats = db.collection("usersStats");
            const follows = db.collection("follows");
            const currentUserId = new ObjectId(verifyTokenResult.id);
            const currentUser = await users.findOne({ _id: currentUserId });

            if (!currentUser) {
              res.writeHead(404, { "content-type": "application/json" });
              return res.end(
                JSON.stringify({
                  message: "Current user not found",
                  status: 404,
                }),
              );
            }

            if (currentUser.email !== email) {
              res.writeHead(403, { "content-type": "application/json" });
              return res.end(
                JSON.stringify({
                  message: "Forbidden: Email does not match current user",
                  status: 403,
                }),
              );
            }

            const isMatch = await bcrypt.compare(
              password,
              currentUser.password,
            );
            if (!isMatch) {
              res.writeHead(401, { "content-type": "application/json" });
              return res.end(
                JSON.stringify({
                  message: "Unauthorized: Incorrect password",
                  status: 401,
                }),
              );
            }
            await Promise.all([
              follows.deleteMany({ followerId: currentUserId }),
              follows.deleteMany({ followingId: currentUserId }),
              userStats.deleteOne({ userId: currentUserId }),
              users.deleteOne({ _id: currentUserId }),
            ]);

            res.writeHead(200, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Account deleted successfully",
                status: 200,
              }),
            );
          } catch (err) {
            res.writeHead(500, { "content-type": "application/json" });
            return res.end(
              JSON.stringify({
                message: "Server Error",
                status: 500,
                error: err.message,
              }),
            );
          }
        });
      }
    });

    // Initialize WebSocket server
    initWebSocketServer(server);
    // ///////////////////////////////////////////////////
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Main Server is Running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.log("Failed to Connect!", err);
    process.exit(1);
  }
};

StartServer();
