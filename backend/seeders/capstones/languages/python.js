/**
 * Capstone brief — python track (python), v1.
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
  trackId: "python",
  categoryId: "languages",
  slug: "python-async-task-runner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Async Task Execution Engine & Dependency Pipeline",
  summary:
    "Build a robust asynchronous task execution engine in pure Python. The engine parses task dependency " +
    "graphs, manages concurrent execution using asyncio and worker threads, handles retries with backoff, " +
    "and streams execution state back to a CLI client.",
  stack: ["Python 3.11+", "asyncio", "pytest", "mypy"],

  requirements: [
    {
      id: "task-graph",
      text: "Parse and validate task definitions with dependency resolution using topological sorting; cycle detection must raise a custom exception.",
    },
    {
      id: "execution-engine",
      text: "Execute independent tasks concurrently using asyncio tasks and thread worker pools for blocking I/O bound jobs.",
    },
    {
      id: "retry-backoff",
      text: "Support configurable task retry limits with exponential backoff and jitter upon task failure.",
    },
    {
      id: "context-manager",
      text: "Provide custom context managers for execution state, logging timing, resource allocation, and dynamic cleanup.",
    },
    {
      id: "custom-generators",
      text: "Implement custom iterators/generators to yield real-time task status events during execution runs.",
    },
    {
      id: "type-hints",
      text: "All public modules must pass strict static type analysis using mypy annotations, Generics, and Protocols.",
    },
    {
      id: "pyproject",
      text: "Project uses standard packaging configuration with pyproject.toml.",
      check: { type: "file", glob: "pyproject.toml" },
    },
    {
      id: "tests",
      text: "Unit and integration tests written in pytest cover async execution, cycle failures, and retry behavior.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README provides architecture details, setup guide, and test execution instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI pipeline runs pytest and mypy on every push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness & Concurrency",
      weight: 25,
      layerId: "python-8",
      description:
        "Does the engine correctly schedule task graphs concurrently without deadlocks, handling async tasks properly?",
    },
    {
      id: "architecture",
      name: "OOP & Protocols",
      weight: 15,
      layerId: "python-3",
      description:
        "Clean class structure, proper use of dunder methods, properties, and protocol types.",
    },
    {
      id: "error-handling",
      name: "Error & Flow Control",
      weight: 15,
      layerId: "python-5",
      description:
        "Custom exception hierarchies and robust context management for execution resources.",
    },
    {
      id: "type-safety",
      name: "Type System Usage",
      weight: 15,
      layerId: "python-9",
      description:
        "Comprehensive type annotations, correct use of Generics/Protocols, and clean mypy checks.",
    },
    {
      id: "tests",
      name: "Testing Quality",
      weight: 15,
      layerId: "python-7",
      description:
        "Comprehensive pytest suite using fixtures, parametrization, and async test coverage.",
    },
    {
      id: "docs-ops",
      name: "Packaging & Operability",
      weight: 15,
      layerId: "python-10",
      description:
        "Proper pyproject packaging setup, clear usage instructions, and working CI automation.",
    },
  ],

  twistPool: [
    {
      id: "dynamic-caching",
      text: "Add task output caching using functools or custom persistent cache so duplicate inputs reuse prior run outputs.",
    },
    {
      id: "rate-limiting",
      text: "Implement token-bucket rate limiting per task tag to throttle concurrent execution of resource-heavy tasks.",
    },
    {
      id: "cancellation",
      text: "Support graceful cancellation of running and pending tasks when a single task fails in 'fail-fast' mode.",
    },
    {
      id: "telemetry-export",
      text: "Export execution metrics (durations, memory use, failures) to JSON/CSV files using generator pipelines.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
