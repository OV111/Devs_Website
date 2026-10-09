/**
 * Capstone brief — swift track (swift), v1.
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
  trackId: "swift",
  categoryId: "languages",
  slug: "swift-vapor-async-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Server-Side Swift Async Task & Notification Backend",
  summary:
    "Build a production-grade server-side REST API service using Vapor in modern Swift 5.10+/6. " +
    "You will harness modern Swift Concurrency (async/await, Actors, TaskGroups), model data using value semantics and protocol abstractions, " +
    "enforce strict optional handling, and package the project clean with Swift Package Manager (SPM).",
  stack: [
    "Swift 5.10+",
    "Vapor",
    "Swift Package Manager",
    "XCTest / Swift Testing",
  ],

  requirements: [
    {
      id: "package-swift",
      text: "Project structured as a valid Swift package containing Package.swift manifest.",
      check: { type: "file", glob: "Package.swift" },
    },
    {
      id: "optionals-guard",
      text: "Safe handling of optionals using optional binding (if let), guard let early exits, and nil coalescing.",
    },
    {
      id: "structs-classes",
      text: "Design model entities leveraging value semantics (structs) and explicit reference types (classes).",
    },
    {
      id: "protocols-generics",
      text: "Abstract data repositories using protocols, protocol extensions, and generic type constraints.",
    },
    {
      id: "functional-collections",
      text: "Process data collections using functional operators (map, compactMap, filter, reduce).",
    },
    {
      id: "async-actors",
      text: "Process concurrent requests using async/await, TaskGroups, and Actor isolation to prevent data races.",
    },
    {
      id: "vapor-routing",
      text: "Implement Vapor web routing middleware, request validation, and JSON Codable serialization.",
    },
    {
      id: "swift-testing",
      text: "Comprehensive async unit tests written using XCTest or Swift Testing @Test macros.",
      check: { type: "file", glob: "Tests/**/*.swift" },
    },
    {
      id: "readme",
      text: "README details SPM build steps, Vapor execution instructions, and concurrency design choices.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI compiles and tests Swift package on Linux/macOS.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "async-concurrency",
      name: "Swift Concurrency & Actors",
      weight: 25,
      layerId: "swift-6",
      description:
        "Mastery of async/await, TaskGroup parallel processing, and actor-isolated shared state.",
    },
    {
      id: "optionals-value-semantics",
      name: "Optionals & Value Semantics",
      weight: 15,
      layerId: "swift-2",
      description:
        "Safe unwrapping using guard/if let, proper choice of structs vs classes, and clean immutability.",
    },
    {
      id: "protocols-generics",
      name: "Protocols & Generics",
      weight: 15,
      layerId: "swift-4",
      description:
        "Decoupled architecture utilizing protocol conformance, extensions, and generic bounds.",
    },
    {
      id: "server-side-vapor",
      name: "Server-Side Swift & Vapor",
      weight: 15,
      layerId: "swift-10",
      description:
        "Clean Vapor controller routes, request middleware, async handlers, and Codable models.",
    },
    {
      id: "testing",
      name: "Async Testing & XCTest",
      weight: 15,
      layerId: "swift-8",
      description:
        "Thorough async unit testing coverage utilizing protocol mocks and Swift Testing assertions.",
    },
    {
      id: "package-spm",
      name: "SPM & Ecosystem",
      weight: 15,
      layerId: "swift-7",
      description:
        "Clean Package.swift setup, modular targets, and automated CI test execution.",
    },
  ],

  twistPool: [
    {
      id: "custom-macro",
      text: "Add a custom Swift Attached Macro that automatically generates JSON validation methods for request DTOs.",
    },
    {
      id: "actor-rate-limiter",
      text: "Implement an Actor-based sliding window rate-limiter protecting incoming API endpoint traffic.",
    },
    {
      id: "event-stream",
      text: "Expose an AsyncStream endpoint streaming real-time status notifications to connected clients.",
    },
    {
      id: "fluent-migration",
      text: "Integrate Fluent ORM with SQLite database migrations for persistent task history storage.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
