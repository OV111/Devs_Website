/**
 * Capstone brief — Go Developer track (go-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "go-dev",
  categoryId: "backend",
  slug: "go-dev-inventory-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Inventory service with concurrent stock reservations",
  summary:
    "Build a Go service that tracks product stock across warehouses and lets other services reserve " +
    "items. Many reservations arrive at once, so correctness under concurrency is the core of the work — " +
    "together with the idiomatic Go that keeps it readable.",
  stack: ["Go", "Chi or Gin", "PostgreSQL", "pgx / sqlc", "slog", "Docker"],

  requirements: [
    { id: "auth", text: "Calls are authenticated with a JWT middleware; only admins can change stock levels." },
    { id: "stock", text: "Products and per-warehouse stock can be created, listed (paginated) and adjusted through a REST API." },
    { id: "reserve", text: "Reserving items is atomic: concurrent reservations can never drive stock below zero." },
    { id: "validation", text: "Requests are validated; errors are returned as consistent JSON with correct status codes." },
    { id: "timeouts", text: "Every request and database call uses context deadlines; a slow database never hangs a handler." },
    { id: "observability", text: "Structured logging with slog, a /healthz endpoint, and graceful shutdown that finishes in-flight requests." },
    { id: "module", text: "The project is a Go module with a conventional layout (cmd/, internal/).", check: CHECKS.goModule },
    { id: "tests", text: "Table-driven tests cover handlers (httptest) and the reservation rule, including a concurrent test run with -race.", check: CHECKS.goTests },
    { id: "readme", text: "README explains setup, configuration and how to run the tests.", check: CHECKS.readme },
    { id: "docker", text: "A multi-stage Dockerfile builds a small image; the service and PostgreSQL start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs go vet, a linter and the tests with -race on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "go-dev-5", description: "The API, the reservation rule and your twist behave as specified, including edge cases." },
    { id: "concurrency", name: "Concurrency", weight: 20, layerId: "go-dev-4", description: "Goroutines, channels, locks or transactions are used correctly; no races, no leaks." },
    { id: "design", name: "Idiomatic design", weight: 15, layerId: "go-dev-3", description: "Small interfaces, clear packages, explicit errors — code another Go developer reads easily." },
    { id: "data", name: "Data access", weight: 10, layerId: "go-dev-6", description: "Pooling, transactions and queries are handled deliberately." },
    { id: "tests", name: "Tests", weight: 15, layerId: "go-dev-8", description: "Table-driven tests on real behaviour, including failures and the race detector." },
    { id: "ops", name: "Observability & delivery", weight: 15, layerId: "go-dev-9", description: "Logs, health checks, shutdown and the container image are production-minded." },
  ],

  twistPool: [
    { id: "expiring-holds", text: "Reservations expire after 15 minutes unless confirmed; a background goroutine releases them and stops cleanly on shutdown." },
    { id: "multi-warehouse", text: "A reservation can be fulfilled from several warehouses, nearest first, and is still all-or-nothing." },
    { id: "idempotency", text: "Reservation requests carry an Idempotency-Key; repeating a request never reserves twice." },
    { id: "low-stock-events", text: "When stock drops below a threshold, an event is published to a channel consumed by a worker that records an alert." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
