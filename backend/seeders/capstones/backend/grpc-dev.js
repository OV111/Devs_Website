/**
 * Capstone brief — gRPC Engineer track (grpc-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "grpc-dev",
  categoryId: "backend",
  slug: "grpc-dev-ride-tracking",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Real-time ride tracking with gRPC streaming",
  summary:
    "Build the backend of a ride-hailing app in gRPC: drivers stream their location, riders follow a " +
    "trip live, and a dispatcher matches requests to drivers. Streaming, deadlines and errors are where " +
    "gRPC differs from REST — and they are what this capstone is about.",
  stack: ["Go or Node.js", "gRPC", "Protocol Buffers", "Buf", "Envoy or grpc-gateway"],

  requirements: [
    { id: "contracts", text: "Services are defined in .proto files with versioned packages and documented messages.", check: CHECKS.proto },
    { id: "client-stream", text: "Drivers report location through a client-streaming RPC." },
    { id: "server-stream", text: "Riders follow their trip through a server-streaming RPC that ends cleanly when the trip finishes." },
    { id: "dispatch", text: "A unary RPC requests a ride and assigns the nearest available driver; two riders can never get the same driver." },
    { id: "auth", text: "Authentication through metadata, enforced by an interceptor; drivers and riders have different permissions." },
    { id: "errors", text: "Correct status codes and rich error details; every call sets a deadline and cancellation propagates." },
    { id: "lint", text: "Protos are linted and breaking changes detected with Buf.", check: { type: "file", glob: "buf.{yaml,yml}" } },
    { id: "tests", text: "Tests cover each RPC type, including deadline expiry and unauthenticated calls." },
    { id: "readme", text: "README explains the services, how to generate code, run the system and call it (grpcurl examples).", check: CHECKS.readme },
    { id: "docker", text: "The services start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs buf lint, buf breaking and the tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "contracts", name: "Contract design", weight: 20, layerId: "grpc-dev-2", description: "Messages and services are well designed, documented and evolvable." },
    { id: "streaming", name: "Streaming", weight: 25, layerId: "grpc-dev-4", description: "Each streaming RPC handles flow control, client disconnects and completion correctly." },
    { id: "correctness", name: "Correctness", weight: 15, layerId: "grpc-dev-3", description: "Dispatch and your twist behave as specified, including concurrent requests." },
    { id: "interceptors", name: "Interceptors & auth", weight: 15, layerId: "grpc-dev-7", description: "Cross-cutting concerns live in interceptors; permissions are enforced per RPC." },
    { id: "errors", name: "Errors & deadlines", weight: 15, layerId: "grpc-dev-8", description: "Status codes, error details, deadlines and cancellation are used correctly." },
    { id: "delivery", name: "Tooling & delivery", weight: 10, layerId: "grpc-dev-10", description: "Buf, code generation and the local stack are reproducible." },
  ],

  twistPool: [
    { id: "gateway", text: "Expose the ride-request RPC as REST/JSON through grpc-gateway or Envoy, generated from the same proto." },
    { id: "bidi-chat", text: "Add a bidirectional-streaming chat between rider and driver for the duration of the trip." },
    { id: "reconnect", text: "A rider whose stream drops can resume following the trip from the last position received, without gaps." },
    { id: "surge", text: "Pricing applies surge when requests outnumber drivers in an area; the quote is returned with the ride and locked for 2 minutes." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
