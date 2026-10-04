/**
 * Capstone brief — PERN Developer track (pern), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "pern",
  categoryId: "fullstack",
  slug: "pern-expense-planner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Shared expense planner",
  summary:
    "Build a full-stack expense planner where users can create groups, record expenses, split costs, and " +
    "settle balances: a React client talking to an Express API backed by PostgreSQL, with authenticated access, " +
    "transaction-safe financial operations, validation, tests, and a deployable setup.",
  stack: ["PostgreSQL", "Express", "React", "Node.js", "Prisma", "Zod"],

  requirements: [
    { id: "auth", text: "Users can register and log in; protected pages require authentication, and authentication state is preserved across page refreshes." },
    { id: "groups", text: "Authenticated users can create expense groups, invite existing users, and leave groups they belong to." },
    { id: "expenses", text: "Group members can create, edit and delete expenses with an amount, description, payer and participants." },
    { id: "splits", text: "Each expense records how its amount is split between participants, and the API rejects splits whose amounts do not equal the expense total." },
    { id: "balances", text: "The application calculates each member's net balance from the group's expenses and clearly shows who owes whom." },
    { id: "authorization", text: "Only group members can read group data, and only permitted members can change expenses; authorization is enforced by the API rather than only the UI." },
    { id: "transactions", text: "Database writes that create or update an expense and its participant splits are atomic, so a failed operation cannot leave partial financial data." },
    { id: "validation", text: "API request bodies are validated with Zod or an equivalent schema layer, and invalid requests return consistent JSON errors." },
    { id: "client", text: "A React client lives in the repository.", check: { type: "file", glob: "**/*.{jsx,tsx}" } },
    { id: "tests", text: "Unit and integration tests cover authentication, group authorization, expense validation and balance calculations.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, database migrations and seeding, running the client and API, tests, and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs the project's lint and test commands on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "pern-8", description: "The application correctly persists expenses, splits and balances, including invalid and failure cases." },
    { id: "frontend", name: "Frontend quality", weight: 15, layerId: "pern-4", description: "React routing, state and server-state handling are structured clearly, with useful loading, empty and error states." },
    { id: "backend", name: "Backend & API", weight: 15, layerId: "pern-5", description: "Routes, middleware, controllers and API responses are organized consistently and follow REST conventions." },
    { id: "database", name: "Database & data access", weight: 15, layerId: "pern-7", description: "The PostgreSQL schema, indexes and transactions fit the application's relational access patterns." },
    { id: "security", name: "Security & validation", weight: 15, layerId: "pern-9", description: "Authentication, authorization, password handling and input validation are enforced server-side." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "pern-10", description: "Tests cover real behaviour and the project has a reproducible CI and deployment setup." },
  ],

  twistPool: [
    { id: "recurring", text: "Users can mark an expense as recurring and generate the next occurrence from a dedicated action without duplicating the original expense's identifier or split records." },
    { id: "settlements", text: "Members can record a settlement payment between two group members, and settlements are included in the balance calculation without modifying historical expenses." },
    { id: "categories", text: "Expenses can be assigned to categories, and each group has a category summary showing total spending for every category." },
    { id: "currency", text: "Expenses can be entered in different currencies; each stores the exchange rate used at creation, and balances are shown in the group currency without ever recomputing past expenses with today's rate." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
