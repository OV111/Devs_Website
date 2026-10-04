/**
 * Capstone brief — Python Backend track (python-backend), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * Note: this track's first layers have short ids (py-1 … py-8).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "python-backend",
  categoryId: "backend",
  slug: "python-backend-event-booking",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Event booking API with background workers",
  summary:
    "Build the backend for booking seats at events: correct under concurrent bookings, with slow work " +
    "(confirmation emails, releasing unpaid holds) moved to a Celery worker. The hard part is not the " +
    "endpoints — it is never selling the same seat twice.",
  stack: ["Python", "FastAPI", "SQLAlchemy (async)", "PostgreSQL", "Celery", "Redis"],

  requirements: [
    { id: "auth", text: "Users register and log in with hashed passwords and JWT; organisers and attendees have different permissions." },
    { id: "events", text: "Organisers create events with a seat capacity; attendees list upcoming events with pagination." },
    { id: "booking", text: "Booking a seat is atomic: two concurrent requests for the last seat can never both succeed." },
    { id: "validation", text: "All input is validated with Pydantic models; invalid input returns 422 with clear errors, never a 500." },
    { id: "background", text: "Confirmation emails (a stub that logs is fine) are sent from a Celery task, not inside the request." },
    { id: "migrations", text: "The schema is managed with migrations (Alembic or equivalent)." },
    { id: "deps", text: "Dependencies are pinned in requirements.txt or pyproject.toml.", check: { type: "file", glob: "{requirements.txt,pyproject.toml}" } },
    { id: "tests", text: "pytest covers auth, booking and the concurrency rule.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README explains setup, environment variables, running the worker and the tests.", check: CHECKS.readme },
    { id: "docker", text: "API, worker, PostgreSQL and Redis start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs lint and tests on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "py-3", description: "Endpoints, permissions and your twist work as specified, including edge cases." },
    { id: "data", name: "Data & transactions", weight: 15, layerId: "py-4", description: "Models, constraints and transactions make double-booking impossible, not just unlikely." },
    { id: "async", name: "Async & background work", weight: 15, layerId: "py-6", description: "async is used correctly, and slow work runs in Celery with retries where they make sense." },
    { id: "security", name: "Security basics", weight: 15, layerId: "py-5", description: "Hashing, token handling, role checks and no secrets in the repository." },
    { id: "tests", name: "Tests", weight: 15, layerId: "py-7", description: "pytest exercises real behaviour, including the concurrency rule and failure paths." },
    { id: "ops", name: "Docs & operability", weight: 15, layerId: "py-8", description: "Someone new can run the whole stack, worker included, from the README alone." },
  ],

  twistPool: [
    { id: "seat-holds", text: "A booking first places a 10-minute hold. Unpaid holds are released automatically by a scheduled Celery task." },
    { id: "waitlist", text: "Sold-out events have a waitlist. When a booking is cancelled, the first person waiting is promoted automatically and notified." },
    { id: "group-booking", text: "Group bookings of up to 6 seats are all-or-nothing: either every seat is booked or none is." },
    { id: "cancellation-window", text: "Cancellations are free until 48 hours before the event and refused after; the rule is enforced server-side with timezone-correct times." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
