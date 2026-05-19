import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import process from "process";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import userRoutes from "./routes/user.routes.js";
import searchRoutes from "./routes/search.routes.js";
import accountRoutes from "./routes/account.routes.js";
import blogRoutes from "./routes/blogs.routes.js";

export function createApp(db) {
  const app = express();

  app.locals.db = db;

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    const maintenance = process.env.MAINTENANCE_MODE === "true";
    if (maintenance) {
      return res.status(503).json({ message: "Server is under Maintenance" });
    }
    next();
  });

  app.use("/blogs", blogRoutes);

  app.use(authRoutes);
  app.use(postRoutes);
  app.use("/my-profile", profileRoutes);
  app.use(userRoutes);
  app.use("/search", searchRoutes);
  app.use(accountRoutes);

  return app;
}
