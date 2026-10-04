/**
 * Capstone brief — DB Engineer track (db-engineer), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * Unlike the API capstones, the deliverable here is the database itself:
 * schema, queries, evidence of performance work, and operations scripts.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "db-engineer",
  categoryId: "backend",
  slug: "db-engineer-multitenant-orders",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-tenant orders database, designed and operated",
  summary:
    "Design, tune and operate the PostgreSQL database for a multi-tenant shop: customers, products, " +
    "orders and payments for many stores in one database. You are judged on the model, on proof that " +
    "your indexes work, and on whether someone could run, back up and restore it from your repository.",
  stack: ["PostgreSQL", "SQL", "Redis", "Docker"],

  requirements: [
    { id: "model", text: "A normalised schema (to 3NF, with any denormalisation justified in writing) with primary keys, foreign keys and CHECK constraints." },
    { id: "migrations", text: "The schema is built only from ordered SQL migration files.", check: { type: "file", glob: "**/migrations/**/*.sql" } },
    { id: "seed", text: "A seed script generates realistic volume: at least 100,000 orders across several tenants." },
    { id: "queries", text: "At least five business queries (e.g. revenue per tenant per month, top customers) live as .sql files.", check: { type: "file", glob: "**/queries/**/*.sql" } },
    { id: "explain", text: "For your three slowest queries, EXPLAIN ANALYZE output before and after indexing is committed and explained in the README." },
    { id: "cache", text: "One hot read (e.g. a product page) is cached in Redis with a documented invalidation rule." },
    { id: "security", text: "Separate database roles for the application, read-only analytics and migrations; the application role cannot drop tables." },
    { id: "backup", text: "Backup and restore scripts, with the restore tested end to end and documented." },
    { id: "tests", text: "Automated tests check constraints and key queries against a real database.", check: { type: "file", glob: "{test,tests}/**/*" } },
    { id: "readme", text: "README explains setup, the model and its trade-offs, and how to run migrations, seed, tests, backup and restore.", check: CHECKS.readme },
    { id: "docker", text: "PostgreSQL and Redis start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI applies the migrations to a fresh database and runs the tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "modeling", name: "Data modeling", weight: 25, layerId: "db-engineer-3", description: "Entities, keys and constraints model the domain correctly; trade-offs are deliberate and explained." },
    { id: "sql", name: "SQL quality", weight: 15, layerId: "db-engineer-2", description: "Queries are correct, readable and set-based, including your twist's requirements." },
    { id: "performance", name: "Indexing & performance", weight: 20, layerId: "db-engineer-8", description: "Indexes are justified by EXPLAIN evidence, not guesses; before/after numbers are real." },
    { id: "security", name: "Security & roles", weight: 15, layerId: "db-engineer-10", description: "Least-privilege roles, no secrets in the repository, tenant data cannot leak between tenants." },
    { id: "operations", name: "Operations", weight: 10, layerId: "db-engineer-9", description: "Backup, restore and migration procedures work and are documented for someone on call." },
    { id: "verification", name: "Tests & documentation", weight: 15, layerId: "db-engineer-4", description: "Tests prove the constraints and queries; the README lets a newcomer run everything." },
  ],

  twistPool: [
    { id: "row-level-security", text: "Tenant isolation is enforced by PostgreSQL row-level security, so even a buggy query from the application role cannot read another tenant's rows." },
    { id: "price-history", text: "Product prices change over time; every order keeps the exact price paid, and you can query any product's price on any past date." },
    { id: "multi-currency", text: "Stores sell in different currencies; revenue reports convert using the exchange rate snapshot stored at the time of each order." },
    { id: "materialized-report", text: "Monthly sales per tenant come from a materialized view refreshed nightly without blocking reads, with the refresh strategy documented." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
