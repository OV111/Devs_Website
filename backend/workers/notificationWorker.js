import { Worker } from "bullmq";
import { createNotification } from "../services/notificationService.js";
import connectDB from "../config/db.js";
import { getWss } from "../websocket/index.js";
import { redisConnection } from "../config/redis.js";
import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

// REDIS_ENABLED=false disables the worker without removing code
const REDIS_ENABLED = process.env.REDIS_ENABLED !== "false";

if (!REDIS_ENABLED) {
  console.log("Redis disabled — NotificationWorker not started.");
}

const NotificationWorker = REDIS_ENABLED ? new Worker(
  "notifications",
  async (job) => {
    const { type, actorId, targetUserId } = job.data;
    // Cheap guard before touching the DB; createNotification re-checks for
    // any other caller.
    if (!type || !actorId || !targetUserId) return;
    if (actorId === targetUserId) return;
    try {
      const db = await connectDB();
      const newNotification = await createNotification(db, { type, actorId, targetUserId });

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
  { connection: redisConnection },
) : null;

if (NotificationWorker) {
  NotificationWorker.on("ready", () => {
    console.log("Redis connected successfully!");
  });
}

export default NotificationWorker;
