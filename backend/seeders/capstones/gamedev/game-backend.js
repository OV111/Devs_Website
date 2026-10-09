/**
 * Capstone brief — game-backend track (game-backend), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the roadmap layer that teaches it, for weak-spot tracking.
 * - Bump `version` for any change that affects grading; never edit a
 *   published version in place (attempts point at the exact brief document).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "game-backend",
  categoryId: "gamedev",
  slug: "game-backend-authoritative-multiplayer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Authoritative Game Server, Matchmaking & Real-Time State Service",
  summary:
    "Build an authoritative real-time game server and microservice suite in Node.js and WebSockets, " +
    "featuring JWT authentication, Redis matchmaking/leaderboards, PostgreSQL storage, and Docker deployment.",
  stack: [
    "Node.js",
    "Express",
    "WebSockets / Socket.io",
    "Redis",
    "PostgreSQL",
    "Docker",
  ],

  requirements: [
    {
      id: "auth-service",
      text: "Implement user account registration, login, and secure JWT-based socket connection authentication.",
    },
    {
      id: "authoritative-loop",
      text: "Run an authoritative server game loop (e.g., 20Hz tick rate) that validates player inputs and broadcasts state updates.",
    },
    {
      id: "matchmaking-queue",
      text: "Build a skill-based or FIFO matchmaking queue using Redis data structures that pairs players into dynamic room instances.",
    },
    {
      id: "leaderboard-redis",
      text: "Maintain real-time global player rankings using Redis Sorted Sets with paginated rank lookups.",
    },
    {
      id: "database-persistence",
      text: "Store player profiles, inventory, currency balances, and match history persistently in PostgreSQL or MongoDB.",
    },
    {
      id: "input-validation-anticheat",
      text: "Enforce strict server-side validation on player move speeds and action cooldowns to prevent speed/teleport hacks.",
    },
    {
      id: "docker-compose",
      text: "Containerize the application and database dependencies so the whole stack boots with docker-compose up.",
      check: CHECKS.compose,
    },
    {
      id: "env-example",
      text: "Provide a configuration template file (.env.example) with all necessary database and secret key variables.",
      check: CHECKS.envExample,
    },
    {
      id: "tests",
      text: "Integration and unit tests verify auth middleware, matchmaking logic, and authoritative game state calculations.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README documents API endpoints, WebSocket event protocols, environment setup, and deployment guides.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI pipeline executes linter, runs test suites, and verifies container build steps on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "websocket-authoritative",
      name: "Real-Time Server & Authoritative Loop",
      weight: 20,
      layerId: "game-backend-6",
      description:
        "Reliable WebSocket synchronization, fixed server tick rate, and robust server-authoritative state processing.",
    },
    {
      id: "matchmaking-queues",
      name: "Matchmaking & Redis Caching",
      weight: 20,
      layerId: "game-backend-7",
      description:
        "Effective lobby allocation, Redis queue manipulation, and performant sorted set leaderboards.",
    },
    {
      id: "auth-persistence",
      name: "Auth & Database Persistence",
      weight: 15,
      layerId: "game-backend-4",
      description:
        "Secure JWT handling, schema normalization, index optimization, and persistent match record storage.",
    },
    {
      id: "anticheat-security",
      name: "Server Validation & Anti-Cheat",
      weight: 15,
      layerId: "game-backend-10",
      description:
        "Thorough input sanitization, rate limiting, and physics bounds checks to defeat malicious client inputs.",
    },
    {
      id: "ops-containerization",
      name: "DevOps & Containerization",
      weight: 15,
      layerId: "game-backend-9",
      description:
        "Clean Dockerfile/Compose setup, environment variable management, and reliable single-command orchestration.",
    },
    {
      id: "docs-testing",
      name: "Testing & Documentation",
      weight: 15,
      layerId: "game-backend-1",
      description:
        "Complete unit/integration test coverage, well-defined WebSocket event specs, and clear setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "reconnection-state-recovery",
      text: "Implement a session token system allowing disconnected players to seamlessly reconnect and resume state within 30 seconds.",
    },
    {
      id: "delta-compression",
      text: "Compress WebSocket state broadcasts by calculating and transmitting binary bit-packed state deltas instead of full JSON objects.",
    },
    {
      id: "playtab-integration",
      text: "Integrate a third-party game service SDK (e.g., PlayFab or Nakama) to handle player inventory purchase transactions.",
    },
    {
      id: "distributed-pubsub",
      text: "Scale real-time room communication horizontally using Redis Pub/Sub across multiple Node.js server worker processes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
