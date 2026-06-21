import { Queue } from "bullmq";
import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });
const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
};

// REDIS_ENABLED=false disables the queue without removing code
const REDIS_ENABLED = process.env.REDIS_ENABLED !== "false";

const notificationQueue = REDIS_ENABLED
  ? new Queue("notifications", { connection })
  : { add: () => Promise.resolve() };

export default notificationQueue;
