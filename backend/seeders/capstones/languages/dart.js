/**
 * Capstone brief — dart track (dart), v1.
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
  trackId: "dart",
  categoryId: "languages",
  slug: "dart-async-data-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Reactive Asynchronous Data Streaming & Caching Library",
  summary:
    "Build a pure Dart asynchronous event processing and caching library. " +
    "You will leverage Dart sound null safety, non-blocking asynchronous Streams and Futures, " +
    "OOP inheritance with mixins, functional collection operations, and dynamic extension methods.",
  stack: ["Dart 3.0+", "pubspec", "test package", "Isolates"],

  requirements: [
    {
      id: "pubspec",
      text: "Repository contains a valid pubspec.yaml file defining package metadata.",
      check: { type: "file", glob: "pubspec.yaml" },
    },
    {
      id: "sound-null-safety",
      text: "Comply with Dart sound null safety; unhandled null assignment warnings or dynamic casts are forbidden.",
    },
    {
      id: "class-mixins",
      text: "Define domain abstractions using abstract classes, factory constructors, and reusable mixins.",
    },
    {
      id: "generics-extension",
      text: "Provide custom extension methods on dynamic generic collection types.",
    },
    {
      id: "async-streams",
      text: "Implement event pipelines using Futures, async/await, and StreamController transformation streams.",
    },
    {
      id: "isolates-concurrency",
      text: "Offload heavy background data serialization or encryption work to separate Dart Isolates.",
    },
    {
      id: "custom-exceptions",
      text: "Throw custom domain Exception types captured through try-catch-on blocks.",
    },
    {
      id: "dart-tests",
      text: "Unit test suite using package:test covering asynchronous Streams and Futures logic.",
      check: { type: "file", glob: "test/**/*_test.dart" },
    },
    {
      id: "readme",
      text: "README documents package setup, stream usage examples, isolate design, and test execution.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI executes dart analyze and dart test on every commit.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "async-streams",
      name: "Futures & Stream Pipelines",
      weight: 25,
      layerId: "dart-1",
      description:
        "Effective design of non-blocking async operations, StreamControllers, and stream transformers.",
    },
    {
      id: "sound-null-safety",
      name: "Null Safety & Type System",
      weight: 15,
      layerId: "dart-1",
      description:
        "Strict sound null safety adherence, proper late/required flags, and complete avoidance of untyped dynamic.",
    },
    {
      id: "isolates-concurrency",
      name: "Isolates & Concurrency",
      weight: 15,
      layerId: "dart-1",
      description:
        "Correct multi-threaded work processing via Isolate.spawn and receive/send ports.",
    },
    {
      id: "oop-mixins",
      name: "OOP, Mixins & Generics",
      weight: 15,
      layerId: "dart-1",
      description:
        "Clean class hierarchies using mixins, abstract interfaces, and generic constraints.",
    },
    {
      id: "testing",
      name: "Package Testing & Mocking",
      weight: 15,
      layerId: "dart-1",
      description:
        "Thorough unit testing of async Streams and Isolates using package:test.",
    },
    {
      id: "package-tooling",
      name: "Dart Tooling & Analysis",
      weight: 15,
      layerId: "dart-1",
      description:
        "Valid pubspec setup, zero dart analyze warnings, and complete setup docs.",
    },
  ],

  twistPool: [
    {
      id: "lru-cache-stream",
      text: "Add an in-memory LRU stream cache layer that replays recent stream events to new subscribers.",
    },
    {
      id: "circuit-breaker",
      text: "Implement an async Circuit Breaker stream transformer that halts execution on repetitive stream errors.",
    },
    {
      id: "file-persistence",
      text: "Persist stream snapshots to disk using dart:io File streaming with atomic write operations.",
    },
    {
      id: "debounce-transformer",
      text: "Build a custom StreamTransformer that debounces rapid event pushes by a configurable duration.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
