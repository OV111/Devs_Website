/**
 * Capstone brief — kotlin track (kotlin), v1.
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
  trackId: "kotlin",
  categoryId: "languages",
  slug: "kotlin-ktor-reactive-backend",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Asynchronous Coroutine-Driven Ktor Web API",
  summary:
    "Build a production-ready asynchronous web service in Kotlin using Ktor framework. " +
    "You will harness Kotlin Coroutines and Flows for non-blocking execution, exploit extension functions and scope operators, " +
    "enforce strict null-safety, and manage dependency injection with Koin.",
  stack: ["Kotlin 1.9+", "Ktor", "Kotlin Coroutines", "Koin", "MockK"],

  requirements: [
    {
      id: "build-gradle",
      text: "Project uses Gradle with Kotlin DSL build script.",
      check: { type: "file", glob: "build.gradle.kts" },
    },
    {
      id: "null-safety",
      text: "Leverage Kotlin nullability features (safe calls, Elvis operator, smart casts) without forcing non-null assertion (!!) calls.",
    },
    {
      id: "sealed-classes",
      text: "Model API responses and state hierarchies using Sealed Classes and Data Classes with destructuring.",
    },
    {
      id: "scope-functions",
      text: "Use scope functions (let, run, with, apply, also) idiomaticaly across domain services.",
    },
    {
      id: "coroutines-flow",
      text: "Implement asynchronous service calls using suspend functions, CoroutineScope, and reactive Flows.",
    },
    {
      id: "extension-dsl",
      text: "Build custom domain extensions and higher-order builder DSL functions with dynamic receiver Lambdas.",
    },
    {
      id: "ktor-koin",
      text: "Configure Ktor web server routes, JSON serialization, and Koin dependency injection modules.",
    },
    {
      id: "kotlin-test",
      text: "Unit and coroutine test suites written with JUnit 5, MockK, and runTest coroutine testing harnesses.",
      check: { type: "file", glob: "src/test/**/*.kt" },
    },
    {
      id: "readme",
      text: "README explains setup instructions, routing structure, coroutine design choices, and test suite execution.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI pipeline builds project with Gradle and runs tests on JDK 17+.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "coroutines-async",
      name: "Coroutines & Structured Concurrency",
      weight: 25,
      layerId: "kotlin-6",
      description:
        "Proper usage of suspend functions, coroutine dispatchers, cancellation, and reactive Flow streams.",
    },
    {
      id: "null-type-system",
      name: "Null Safety & Type System",
      weight: 15,
      layerId: "kotlin-2",
      description:
        "Clean usage of nullability tools, Elvis operator, smart casts, and complete avoidance of explicit !! casts.",
    },
    {
      id: "ktor-di",
      name: "Ktor & Ecosystem Integration",
      weight: 15,
      layerId: "kotlin-10",
      description:
        "Effective Ktor plugin routing, kotlinx.serialization, and structured Koin dependency injection.",
    },
    {
      id: "extensions-dsl",
      name: "Extensions & DSL Idioms",
      weight: 15,
      layerId: "kotlin-5",
      description:
        "Clean extension functions, infix notation, and intuitive lambda-with-receiver DSL patterns.",
    },
    {
      id: "oop-functional",
      name: "OOP, Collections & Lambdas",
      weight: 15,
      layerId: "kotlin-4",
      description:
        "Effective collection pipelines (map, filter, flatMap), scope functions, and data class structures.",
    },
    {
      id: "testing",
      name: "Testing with MockK & Coroutines",
      weight: 15,
      layerId: "kotlin-7",
      description:
        "Comprehensive test suite testing suspend functions reliably using runTest and MockK.",
    },
  ],

  twistPool: [
    {
      id: "websocket-feed",
      text: "Add a real-time WebSocket route streaming live metric updates using Kotlin Coroutine Channels/Flows.",
    },
    {
      id: "custom-plugin",
      text: "Implement a custom Ktor application feature plugin for request execution timing and header logging.",
    },
    {
      id: "circuit-breaker",
      text: "Implement a coroutine-based Circuit Breaker state machine protecting external outgoing HTTP integration calls.",
    },
    {
      id: "cache-delegate",
      text: "Create a property delegate storing dynamic computed properties in an expiring memory cache.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
