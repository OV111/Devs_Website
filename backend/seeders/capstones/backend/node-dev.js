/**
 * Capstone brief — Node.js Developer track (node-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist (the seeder refuses to publish an
 * unreviewed brief). Shape notes: see api-dev.js.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "node-dev",
  categoryId: "backend",
  slug: "node-dev-link-shortener",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Link shortener with click analytics",
  summary:
    "Build a production-style URL shortener: fast redirects served from a cache, clicks recorded " +
    "asynchronously through a job queue so a redirect never waits on analytics, and the operational " +
    "basics a real service needs — structured logs, health checks and a clean shutdown.",
  stack: ["Node.js", "Fastify", "Prisma", "PostgreSQL", "Redis", "BullMQ"],

  requirements: [
    { id: "auth", text: "Users register and log in; only a link's owner can edit, delete or see its analytics." },
    { id: "shorten", text: "Create short links with generated codes that never collide; invalid URLs are rejected with a 400." },
    { id: "redirect", text: "Redirects are served from Redis on a cache hit and fall back to the database on a miss." },
    { id: "async-clicks", text: "Each click is recorded through a BullMQ job; the redirect response never waits for it." },
    { id: "analytics", text: "An endpoint returns clicks per day for a link, aggregated in the database, not in application code." },
    { id: "rate-limit", text: "Link creation and auth endpoints are rate limited." },
    { id: "ops", text: "Structured JSON logging, a /health endpoint that checks the database and Redis, and graceful shutdown that drains the queue worker." },
    { id: "schema", text: "The data model is defined in a Prisma schema with migrations.", check: { type: "file", glob: "**/schema.prisma" } },
    { id: "tests", text: "Tests cover link creation, redirects (hit and miss) and owner-only access.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, how to run the worker and the tests.", check: CHECKS.readme },
    { id: "docker", text: "API, worker, PostgreSQL and Redis start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs lint and tests on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "node-dev-4", description: "Shortening, redirects, analytics and your twist all work, including edge cases." },
    { id: "architecture", name: "Architecture", weight: 15, layerId: "node-dev-7", description: "Routes, services and data access are separated; validation and errors are handled in one place." },
    { id: "async", name: "Async work & caching", weight: 15, layerId: "node-dev-9", description: "The queue and cache are used correctly: no lost clicks, no stale redirects after a link changes." },
    { id: "security", name: "Security basics", weight: 15, layerId: "node-dev-6", description: "Hashing, tokens, ownership checks, rate limits, no open redirect to unsafe schemes." },
    { id: "tests", name: "Tests", weight: 15, layerId: "node-dev-8", description: "Tests exercise real behaviour including failure paths, with the queue and cache handled deliberately." },
    { id: "operability", name: "Operability", weight: 15, layerId: "node-dev-10", description: "Logs, health checks and shutdown behave like a service you could run in production." },
  ],

  twistPool: [
    { id: "custom-alias", text: "Users can choose a custom alias. Reserved words (api, admin, health…) are refused and a taken alias returns a clear 409." },
    { id: "expiry", text: "Links can expire. Expired links return 410 Gone, and a scheduled job removes links expired for more than 30 days." },
    { id: "password", text: "A link can be password-protected: visitors must enter the password before redirecting, and failed attempts are rate limited." },
    { id: "daily-rollup", text: "A nightly job rolls raw clicks into daily totals so the analytics endpoint never scans raw click rows older than one day." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
