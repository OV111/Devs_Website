/**
 * Capstone brief — c track (c), v1.
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
  trackId: "c",
  categoryId: "languages",
  slug: "c-networked-key-value-store",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Process Concurrent In-Memory Cache & Storage Server",
  summary:
    "Build a low-level concurrent network cache server in POSIX C. " +
    "You will implement custom dynamic dynamic array and hash table data structures, manage memory strictly via malloc/free, " +
    "handle multi-process process fork/exec calls, manage sockets with non-blocking I/O, and build automated Makefile targets.",
  stack: [
    "C11",
    "GCC / Clang",
    "POSIX Threads / Sockets",
    "Valgrind",
    "Make / CMake",
  ],

  requirements: [
    {
      id: "makefile",
      text: "Project includes a Makefile or CMakeLists.txt with rules compiling with -Wall -Wextra flags.",
      check: { type: "file", glob: ["Makefile", "CMakeLists.txt"] },
    },
    {
      id: "manual-memory",
      text: "All dynamic allocations strictly managed with malloc/calloc/realloc/free; zero memory leaks reported by Valgrind.",
    },
    {
      id: "custom-hashtable",
      text: "Implement a custom dynamic Hash Table with collision resolution (chaining or open addressing) using structs and function pointers.",
    },
    {
      id: "string-manipulation",
      text: "Safe string parsing and buffer bounds checking using standard library functions without buffer overflows.",
    },
    {
      id: "file-persistence",
      text: "Implement binary or text snapshot persistence using fopen, fwrite, and fread with complete error handling.",
    },
    {
      id: "systems-sockets",
      text: "Implement a POSIX TCP socket server handling client requests via non-blocking sockets or fork worker processes.",
    },
    {
      id: "signals-process",
      text: "Handle process termination signals (SIGINT, SIGTERM) gracefully to flush cache snapshots and clean up allocated memory.",
    },
    {
      id: "tests",
      text: "C unit test suite covering dynamic data structures and command parser logic.",
      check: { type: "file", glob: "**/*.c" },
    },
    {
      id: "readme",
      text: "README documents compilation steps, socket protocols, memory verification commands, and Valgrind execution.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI compiles C project on Linux with GCC and executes test suite.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "memory-pointers",
      name: "Pointers & Memory Management",
      weight: 25,
      layerId: "c-2",
      description:
        "Zero memory leaks or dangling pointers verified via Valgrind memcheck; disciplined manual memory management.",
    },
    {
      id: "systems-sockets",
      name: "Systems Programming & Sockets",
      weight: 20,
      layerId: "c-9",
      description:
        "Proper process controls (fork/exec/waitpid), signal handling, and robust TCP socket communication.",
    },
    {
      id: "data-structures",
      name: "Dynamic Data Structures",
      weight: 15,
      layerId: "c-8",
      description:
        "Flawless implementation of pointers, dynamic memory arrays, and chaining hash tables.",
    },
    {
      id: "c-stdlib-io",
      name: "Standard Library & File I/O",
      weight: 15,
      layerId: "c-5",
      description:
        "Robust file reading/writing, robust string manipulation, and error checking with errno.",
    },
    {
      id: "build-debug",
      name: "Makefiles & Debugging",
      weight: 15,
      layerId: "c-7",
      description:
        "Clean build targets in Makefile/CMake, disciplined compiler warning flags, and debugging capabilities.",
    },
    {
      id: "docs-testing",
      name: "Documentation & Testing",
      weight: 10,
      layerId: "c-6",
      description:
        "Clear modular design splitting .c and .h files, comprehensive test runner, and usage docs.",
    },
  ],

  twistPool: [
    {
      id: "lru-eviction",
      text: "Implement LRU (Least Recently Used) cache eviction using a doubly linked list combined with the hash table.",
    },
    {
      id: "epoll-multiplexing",
      text: "Refactor socket connection handling to use epoll / select I/O multiplexing instead of multi-processing.",
    },
    {
      id: "shared-memory",
      text: "Implement shared memory buffers using mmap / shm_open to share cached data across fork child processes.",
    },
    {
      id: "binary-protocol",
      text: "Implement a compact custom binary serialization wire format for client requests instead of plain text.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
