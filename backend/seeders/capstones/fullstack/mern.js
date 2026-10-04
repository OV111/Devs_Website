/**
 * Capstone brief — MERN Developer track (mern), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 *
 * ⚠ Do not publish until the MERN layer exams exist: a capstone unlocks only
 * after every layer exam of the track is passed, and as of 2026-10-03 the
 * mern track has no exam banks (examSeeder.js SEED_CONFIG has it commented out).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "mern",
  categoryId: "fullstack",
  slug: "mern-task-board",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Collaborative task board",
  summary:
    "Build a full-stack task board (boards, columns, cards) that a small team could actually use: a " +
    "React client talking to an Express API backed by MongoDB, with auth, real server state handling on " +
    "the client, and both halves tested and deployable.",
  stack: ["MongoDB", "Express", "React", "Node.js", "React Query"],

  requirements: [
    { id: "auth", text: "Users sign up and log in; tokens are refreshed without forcing a new login, and protected pages redirect when logged out." },
    { id: "boards", text: "Users create boards with columns and cards; cards can be edited, moved between columns and deleted." },
    { id: "ownership", text: "The API enforces that only board members can read or change a board — hiding buttons in the UI is not enough." },
    { id: "server-state", text: "The client fetches and mutates server data through React Query (or an equivalent cache), with loading and error states everywhere." },
    { id: "validation", text: "The API validates every request body and returns consistent JSON errors; the client shows them to the user." },
    { id: "client", text: "A React client lives in the repository.", check: { type: "file", glob: "{client,frontend,web}/**/*.{jsx,tsx}" } },
    { id: "server", text: "An Express API lives in the repository.", check: { type: "file", glob: "{server,backend,api}/**/*.{js,ts,mjs}" } },
    { id: "tests", text: "API tests and React Testing Library component tests cover auth, board access and moving a card.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, running both halves and the tests, and how it is deployed.", check: CHECKS.readme },
    { id: "ci", text: "CI runs lint and tests for client and server on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "mern-8", description: "The full flow works end to end, including your twist and its edge cases." },
    { id: "frontend", name: "Frontend quality", weight: 15, layerId: "mern-4", description: "Components, state and hooks are well structured; the UI handles loading, empty and error states." },
    { id: "backend", name: "Backend & data", weight: 15, layerId: "mern-6", description: "Clear API structure and a MongoDB model that fits the access patterns, with sensible indexes." },
    { id: "security", name: "Security basics", weight: 15, layerId: "mern-7", description: "Hashing, token handling, server-side membership checks, no secrets in the repository." },
    { id: "tests", name: "Tests", weight: 15, layerId: "mern-9", description: "Both halves are tested on real behaviour, including failure paths." },
    { id: "deploy", name: "Docs & deployment", weight: 15, layerId: "mern-10", description: "Someone new can run it locally and understands how it is deployed." },
  ],

  twistPool: [
    { id: "ordering", text: "Card order within a column is persisted; reordering many cards never rewrites every card in the column." },
    { id: "roles", text: "Boards are shared with viewer or editor roles; viewers can never change anything, enforced by the API." },
    { id: "activity", text: "Each board has an activity feed (who moved or edited which card, and when), paginated." },
    { id: "optimistic", text: "Moving a card updates the UI instantly and rolls back with a visible message if the server rejects the change." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
