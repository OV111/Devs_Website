import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

import http from "http";
import process from "process";
import { v2 as cloudinary } from "cloudinary";

import connectDB, { closeDB } from "./config/db.js";
import { redisConnection } from "./config/redis.js";
import { createApp } from "./app.js";
import initWebSocketServer from "./websocket/index.js";
import NotificationWorker from "./workers/notificationWorker.js";
import notificationQueue from "./queues/notificationQueue.js";
import { assertJwtSecrets } from "./utils/jwtToken.js";
import { healthHandler } from "./utils/health.js";
import { createShutdown } from "./utils/shutdown.js";

// Fail fast at boot instead of the first login attempt hitting a missing-secret error.
assertJwtSecrets();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const db = await connectDB();
    const app = createApp(db);
    const health = healthHandler(db);

    // /healthz is answered before Express, so it is unaffected by maintenance
    // mode, CORS, auth or any middleware — the platform asks "can this process
    // reach its database?", nothing else.
    const server = http.createServer((req, res) => {
      if (req.url === "/healthz" && (req.method === "GET" || req.method === "HEAD")) {
        return health(req, res);
      }
      return app(req, res);
    });

    const wss = initWebSocketServer(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Main Server is Running at http://0.0.0.0:${PORT}`);
    });

    const shutdown = createShutdown({
      server,
      wss,
      // Worker first (stop pulling jobs), then the queue and Redis it uses,
      // MongoDB last because everything above may still write to it.
      closers: [
        ["notification worker", async () => NotificationWorker?.close()],
        ["notification queue", async () => notificationQueue.close?.()],
        ["redis", async () => redisConnection?.quit()],
        ["mongodb", closeDB],
      ],
    });
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.log("Failed to Connect!", err);
    process.exit(1);
  }
};

startServer();
