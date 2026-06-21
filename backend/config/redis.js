import Redis from "ioredis";
import process from "node:process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const REDIS_ENABLED = process.env.REDIS_ENABLED !== "false";

export const redisConnection = REDIS_ENABLED
  ? new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null, // required by BullMQ
    })
  : null;