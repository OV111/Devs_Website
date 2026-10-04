/**
 * Capstone brief — Rust Developer track (rust-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "rust-dev",
  categoryId: "backend",
  slug: "rust-dev-paste-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Async paste and snippet service",
  summary:
    "Build a Pastebin-style service in Rust: users store code snippets, share them by link and set " +
    "expiry. The point is idiomatic async Rust — clear ownership, real error types instead of unwrap(), " +
    "and compile-time-checked database access.",
  stack: ["Rust", "Tokio", "Axum", "SQLx", "PostgreSQL", "serde"],

  requirements: [
    { id: "auth", text: "Users register and log in (argon2 password hashing, token auth); only the owner can edit or delete a paste." },
    { id: "pastes", text: "Create, read, update and delete pastes with a language tag; public pastes are listed with pagination." },
    { id: "errors", text: "A single application error type maps to HTTP responses; no unwrap() or expect() on request paths." },
    { id: "validation", text: "Request bodies are typed with serde and validated (size limits, allowed languages); bad input returns 4xx." },
    { id: "db", text: "Database access uses SQLx with migrations; queries are checked at compile time." },
    { id: "graceful", text: "Structured tracing logs, a health endpoint and graceful shutdown on SIGTERM." },
    { id: "manifest", text: "A Cargo project (workspace allowed) with dependencies declared deliberately.", check: CHECKS.cargo },
    { id: "tests", text: "Integration tests in tests/ exercise the HTTP API, including ownership and validation failures.", check: { type: "file", glob: "tests/**/*.rs" } },
    { id: "readme", text: "README explains setup, configuration, migrations and how to run the tests.", check: CHECKS.readme },
    { id: "docker", text: "A multi-stage Dockerfile; the service and PostgreSQL start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs cargo fmt --check, clippy (warnings as errors) and the tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "rust-dev-7", description: "The API and your twist work, including edge cases." },
    { id: "ownership", name: "Ownership & idioms", weight: 15, layerId: "rust-dev-2", description: "Borrowing and ownership are used naturally — no needless clones or fights with the borrow checker." },
    { id: "errors", name: "Error handling & types", weight: 15, layerId: "rust-dev-3", description: "Errors are modelled with types and propagated with ?, never swallowed or unwrapped." },
    { id: "async", name: "Async correctness", weight: 15, layerId: "rust-dev-6", description: "Tasks, shared state and blocking work are handled correctly in Tokio." },
    { id: "data", name: "Data access", weight: 10, layerId: "rust-dev-8", description: "SQLx queries, migrations and transactions are used deliberately." },
    { id: "tests", name: "Tests & delivery", weight: 20, layerId: "rust-dev-9", description: "Integration tests cover real behaviour; the project builds, lints and ships cleanly." },
  ],

  twistPool: [
    { id: "burn-after-read", text: "A paste can be 'burn after reading': the first successful read deletes it, and two simultaneous reads can never both see it." },
    { id: "expiry-sweeper", text: "Pastes expire; a background Tokio task deletes expired pastes on an interval and stops cleanly on shutdown." },
    { id: "rate-limit", text: "Anonymous paste creation is rate limited per IP with a token bucket you implement, shared safely across tasks." },
    { id: "revisions", text: "Editing a paste keeps its previous revisions; users can list them and view a diff between two revisions." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
