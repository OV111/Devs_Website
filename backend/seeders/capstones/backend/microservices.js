/**
 * Capstone brief — Microservices Engineer track (microservices), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "microservices",
  categoryId: "backend",
  slug: "microservices-food-ordering",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Food ordering platform as microservices",
  summary:
    "Split a food-ordering platform into small services — orders, restaurants, payments, notifications " +
    "— that talk through an API gateway and a message broker. The point is not the number of services: " +
    "it is honest boundaries, a working saga when a step fails, and being able to see what happened.",
  stack: ["Any language", "Docker", "RabbitMQ or Kafka", "API gateway", "OpenTelemetry"],

  requirements: [
    { id: "services", text: "At least four services with their own data stores (database per service), each with a clear bounded context." },
    { id: "gateway", text: "Clients reach the system only through an API gateway that handles authentication and routing." },
    { id: "async", text: "Services communicate through a message broker for events; synchronous calls are used only where justified in the README." },
    { id: "saga", text: "Placing an order runs a saga across orders, payments and restaurants, with compensating actions when a step fails." },
    { id: "idempotency", text: "Event consumers are idempotent: redelivering a message never charges or notifies twice." },
    { id: "observability", text: "Every service has structured logs, health checks and distributed tracing across a full order." },
    { id: "containers", text: "Each service has its own Dockerfile.", check: CHECKS.dockerfile },
    { id: "tests", text: "Each service has tests; at least one end-to-end test places an order through the gateway." },
    { id: "readme", text: "README with an architecture diagram, the service list, event catalogue, and how to run everything.", check: CHECKS.readme },
    { id: "compose", text: "The whole system (services, broker, databases) starts with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI builds and tests each service on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "boundaries", name: "Service boundaries", weight: 20, layerId: "microservices-2", description: "Services follow real bounded contexts; no shared database, no chatty coupling." },
    { id: "messaging", name: "Messaging & events", weight: 20, layerId: "microservices-4", description: "Events are well named and versioned; consumers are idempotent and failures are handled." },
    { id: "saga", name: "Distributed transactions", weight: 20, layerId: "microservices-8", description: "The saga completes or compensates correctly in every failure path you can trigger." },
    { id: "edge", name: "Gateway & security", weight: 10, layerId: "microservices-7", description: "Authentication and routing live at the edge; services trust only the gateway." },
    { id: "observability", name: "Observability & resilience", weight: 15, layerId: "microservices-9", description: "One order can be followed across services; timeouts, retries and circuit breaking are deliberate." },
    { id: "delivery", name: "Containers & delivery", weight: 15, layerId: "microservices-5", description: "Small images, one-command local stack, per-service CI." },
  ],

  twistPool: [
    { id: "outbox", text: "Events are published with the transactional outbox pattern, so an order is never saved without its event (or vice versa)." },
    { id: "restaurant-timeout", text: "If a restaurant does not accept an order within 2 minutes, the saga cancels it and refunds the payment automatically." },
    { id: "event-versioning", text: "Evolve an event to v2 with a new required field while v1 consumers keep working, and show the migration." },
    { id: "kubernetes", text: "Ship Kubernetes manifests (or a Helm chart) with readiness/liveness probes, resource limits and config from ConfigMaps/Secrets." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
