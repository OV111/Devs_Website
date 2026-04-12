import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

import http from "http";
import process from "process";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./config/db.js";
import { createApp } from "./app.js";
import initWebSocketServer from "./websocket/index.js";
import NotificationWorker from "./workers/notificationWorker.js";

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
    const server = http.createServer(app);

    initWebSocketServer(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Main Server is Running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.log("Failed to Connect!", err);
    process.exit(1);
  }
};

startServer();
