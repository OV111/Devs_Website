import Redis from "ioredis";
import process from "node:process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const REDIS_ENABLED = process.env.REDIS_ENABLED !== "false";

// BullMQ requires this; ioredis' default retry limit makes blocking commands fail.
const OPTIONS = { maxRetriesPerRequest: null };

/**
 * The ONE Redis connection the app uses (login throttling, the notification
 * queue and its worker). Building it in one place is what keeps credentials
 * consistent — the queue used to build its own connection without the password.
 *
 * Hosted Redis (Render Key Value, Upstash, Railway) hands out a single URL that
 * carries host, port, password and TLS, so REDIS_URL wins when present; the
 * host/port/password variables remain for local Docker Redis.
 */
export const redisConnection = !REDIS_ENABLED
  ? null
  : process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, OPTIONS)
    : new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        ...OPTIONS,
      });
