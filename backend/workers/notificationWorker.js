import { Worker } from "bullmq";
import { ObjectId } from "mongodb";
import connectDB from "../config/db.js";
import { getWss } from "../websocket/index.js";
import process from "process";

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

const NotificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { type, actorId, targetUserId } = job.data;
    if (!type || !actorId || !targetUserId) return;
    if (actorId === targetUserId) return;
    try {
      const db = await connectDB();
      const users = db.collection("users");
      const notifications = db.collection("notifications");
      const actor = await users.findOne({ _id: new ObjectId(actorId) }, { projection: { username: 1, firstName: 1, lastName: 1 } });

      const newNotification = {
        type,
        actorId,
        targetUserId,
        read: false,
        createdAt: new Date(),
        senderUsername: actor?.username,
        senderName: actor?.firstName + " " + actor?.lastName,
      };
      await notifications.insertOne(newNotification);

      const wss = getWss();
      if (wss) {
        for (const client of wss.clients) {
          if (client.userId === targetUserId && client.readyState === 1) {
            client.send(
              JSON.stringify({ type: "notification", data: newNotification }),
            );
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error occurred while processing notification:", err);
      throw err;
    }
  },
  { connection },
);

NotificationWorker.on("ready", () => {
  console.log("Redis connected successfully!");
});

export default NotificationWorker;
