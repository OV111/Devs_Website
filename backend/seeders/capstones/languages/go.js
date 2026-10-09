/**
 * Capstone brief — go track (go), v1.
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
  trackId: "go",
  categoryId: "languages",
  slug: "go-concurrent-job-scheduler",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Throughput Concurrent Task Queue & Worker Pool Engine",
  summary:
    "Build a production-ready concurrent job execution engine in Go. The system handles task submission, " +
    "worker pool management, channel-based pipeline processing, graceful shutdown via context cancellation, " +
    "and real-time HTTP metrics monitoring using only standard Go library constructs.",
  stack: ["Go 1.22+", "net/http", "Goroutines & Channels", "sync/context"],

  requirements: [
    {
      id: "go-mod",
      text: "Project initialized with a valid go.mod file.",
      check: CHECKS.goModule,
    },
    {
      id: "worker-pool",
      text: "Implement a configurable worker pool using goroutines and buffered channels for job dispatching.",
    },
    {
      id: "interface-design",
      text: "Define clear interface contracts for job processors and custom error handlers.",
    },
    {
      id: "context-cancellation",
      text: "Propagate context timeouts and cancellation signals across all active worker goroutines.",
    },
    {
      id: "error-wrapping",
      text: "Implement custom error types using fmt.Errorf with %w, errors.Is, and errors.As for error classification.",
    },
    {
      id: "http-metrics",
      text: "Expose HTTP endpoints using net/http to submit jobs, query status, and view metrics encoded as JSON.",
    },
    {
      id: "generics-queue",
      text: "Implement a generic thread-safe queue data structure using Go generics and sync.RWMutex.",
    },
    {
      id: "tests",
      text: "Table-driven unit tests cover worker pool lifecycle and concurrency edge cases.",
      check: CHECKS.goTests,
    },
    {
      id: "readme",
      text: "README covers architecture layout, API usage, benchmark results, and run commands.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI workflow compiles code and executes go test -race on every push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "concurrency",
      name: "Goroutines & Channels",
      weight: 25,
      layerId: "go-5",
      description:
        "Correct channel synchronization, worker pool lifecycle, and zero race condition flags.",
    },
    {
      id: "error-handling",
      name: "Error Architecture",
      weight: 15,
      layerId: "go-4",
      description:
        "Idiomatic error handling with custom wrapping, inspection, and error unwrapping.",
    },
    {
      id: "interfaces",
      name: "Interface & Struct Design",
      weight: 15,
      layerId: "go-3",
      description:
        "Clean composition using struct embedding and small, focused interface abstractions.",
    },
    {
      id: "generics-context",
      name: "Generics & Context",
      weight: 15,
      layerId: "go-9",
      description:
        "Proper context propagation and elegant generic data structure implementation.",
    },
    {
      id: "testing",
      name: "Table-Driven Tests",
      weight: 15,
      layerId: "go-7",
      description:
        "Thorough table-driven unit tests with concurrency race testing enabled.",
    },
    {
      id: "stdlib-operability",
      name: "Standard Library & Ops",
      weight: 15,
      layerId: "go-6",
      description:
        "Effective use of net/http, encoding/json, and clean go.mod module management.",
    },
  ],

  twistPool: [
    {
      id: "priority-scheduling",
      text: "Add priority queue support where high-priority jobs jump ahead of low-priority tasks in worker channels.",
    },
    {
      id: "persistent-wal",
      text: "Implement a simple write-ahead log file on disk to recover pending jobs across process restarts.",
    },
    {
      id: "embedded-ui",
      text: "Embed static HTML/JS dashboard assets into the Go binary using go:embed for web metric visualizer.",
    },
    {
      id: "pprof-profiling",
      text: "Expose pprof HTTP diagnostic endpoints and document memory/goroutine leak analysis.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
