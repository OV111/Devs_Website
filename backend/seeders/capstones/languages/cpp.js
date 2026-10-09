/**
 * Capstone brief — cpp track (cpp), v1.
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
  trackId: "cpp",
  categoryId: "languages",
  slug: "cpp-high-performance-event-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Performance In-Memory Event Processing Engine",
  summary:
    "Build a modern C++20/23 multi-threaded in-memory event dispatching engine. " +
    "You will implement lock-free or fine-grained thread synchronization, smart pointer memory management, " +
    "STL algorithms with ranges, modern RAII resource encapsulation, and CMake build configuration.",
  stack: ["C++20/23", "CMake", "std::thread / std::atomic", "AddressSanitizer"],

  requirements: [
    {
      id: "cmake-build",
      text: "Project configured with modern CMake setup defining targets, compile flags, and include paths.",
      check: { type: "file", glob: "{CMakeLists.txt,**/CMakeLists.txt}" },
    },
    {
      id: "raii-management",
      text: "All system resources (threads, sockets, files) strictly encapsulated via RAII and move semantics.",
    },
    {
      id: "smart-pointers",
      text: "Zero explicit new/delete operators; memory allocated strictly using std::unique_ptr, std::shared_ptr, and std::make_unique.",
    },
    {
      id: "stl-ranges",
      text: "Process event sequences using modern C++ STL algorithms, std::optional, std::variant, and ranges.",
    },
    {
      id: "templates-generics",
      text: "Implement generic event dispatch queues using C++ class and function templates with variadic expansion.",
    },
    {
      id: "concurrency",
      text: "Manage worker processing threads safely using std::mutex, std::condition_variable, or std::atomic flags.",
    },
    {
      id: "sanitizer-clean",
      text: "Code must compile with -Wall -Wextra and execute clean of memory errors under AddressSanitizer (ASan).",
    },
    {
      id: "tests",
      text: "Unit test suite exercises event pipeline execution and thread safety.",
      check: { type: "file", glob: "**/*.{cpp,cc,cxx}" },
    },
    {
      id: "readme",
      text: "README details CMake build commands, thread design, and profiling instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI compiles project with CMake and runs test suites on Linux.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "modern-memory",
      name: "RAII & Smart Pointers",
      weight: 20,
      layerId: "cpp-6",
      description:
        "Flawless ownership semantics using smart pointers with explicit zero-leak RAII wrappers.",
    },
    {
      id: "concurrency",
      name: "C++ Threading & Concurrency",
      weight: 20,
      layerId: "cpp-8",
      description:
        "Safe multi-threaded pipeline using mutexes, condition variables, and atomic operations without deadlocks.",
    },
    {
      id: "classes-move-semantics",
      name: "Classes, OOP & Move Semantics",
      weight: 15,
      layerId: "cpp-3",
      description:
        "Clean move constructors, assignment operators, and RAII class encapsulations.",
    },
    {
      id: "stl-modern-features",
      name: "STL, Lambdas & Ranges",
      weight: 15,
      layerId: "cpp-7",
      description:
        "Idiomatic modern C++ usage including ranges, structured bindings, std::optional, and lambdas.",
    },
    {
      id: "templates",
      name: "Templates & Generics",
      weight: 15,
      layerId: "cpp-5",
      description:
        "Clean template abstraction allowing strongly typed event payload handlers.",
    },
    {
      id: "build-tooling",
      name: "CMake & Sanitizers",
      weight: 15,
      layerId: "cpp-10",
      description:
        "Modern CMake targets, clean compiler warnings, ASan validation, and documentation.",
    },
  ],

  twistPool: [
    {
      id: "lockfree-ringbuffer",
      text: "Implement a single-producer single-consumer lock-free ring buffer using std::atomic acquire/release semantics.",
    },
    {
      id: "event-replay",
      text: "Add event logging and deterministic replay capability to recover system state from binary logs.",
    },
    {
      id: "custom-allocator",
      text: "Implement a custom fixed-size memory pool allocator to avoid heap allocation overhead during event burst runs.",
    },
    {
      id: "batching",
      text: "Implement dynamic event micro-batching to optimize thread wakeup frequency under high queue pressure.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
