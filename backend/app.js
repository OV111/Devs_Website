import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
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
import libraryRoutes from "./routes/library.routes.js";
import aiAgentRoutes from "./routes/aiAgent.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import examRoutes from "./routes/exam.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import codingChallengeRoutes from "./modules/coding-challenges/index.js";
import billingRoutes, { handleBillingWebhook } from "./modules/billing/index.js";
import masteryRoutes from "./modules/mastery/index.js";
import contactRoutes from "./modules/contact/index.js";
import capstoneRoutes from "./modules/capstone/index.js";
import teamsRoutes from "./modules/teams/index.js";
import recruiterRoutes from "./modules/recruiter/index.js";
import { notFound } from "./middleware/notFound.js";

export function createApp(db) {
  const app = express();

  app.locals.db = db;

  // Render (and Railway) put exactly one proxy in front of the app. Trusting
  // that single hop makes req.ip the real client IP, so the rate limiters key
  // per user instead of lumping everyone under the proxy's IP. Don't use
  // `true`: that trusts any client-sent X-Forwarded-For, letting an attacker
  // spoof a fresh IP per request and walk straight past the limits.
  app.set("trust proxy", 1);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Security headers for everything below. Mounted after /api-docs on purpose:
  // helmet's default CSP blocks the inline scripts Swagger UI relies on.
  app.use(helmet());

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  // Polar's webhook signature is computed over the exact request bytes, so this
  // route needs the body UNPARSED. It must be registered before express.json(),
  // which would consume the stream and leave only a parsed object behind.
  app.post(
    "/api/billing/webhook",
    express.raw({ type: "application/json" }),
    handleBillingWebhook,
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
  app.use("/library", libraryRoutes);

  app.use(authRoutes);
  app.use(postRoutes);
  app.use("/my-profile", profileRoutes);
  app.use(userRoutes);
  app.use("/search", searchRoutes);
  app.use(accountRoutes);
  app.use("/api/ai-agent", aiAgentRoutes);
  app.use("/api/roadmaps", roadmapRoutes);
  app.use("/api/exams", examRoutes);
  app.use("/api/challenges", codingChallengeRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/mastery", masteryRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/capstone", capstoneRoutes);
  app.use("/api/teams", teamsRoutes);
  app.use("/api/recruiter", recruiterRoutes);
  app.use("/api/admin", analyticsRoutes);

  app.use(notFound)
  return app;
}
