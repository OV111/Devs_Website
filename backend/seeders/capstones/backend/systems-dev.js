/**
 * Capstone brief — Systems Dev track (systems-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "systems-dev",
  categoryId: "backend",
  slug: "systems-dev-kv-store",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Networked key-value store from scratch",
  summary:
    "Build a small Redis-like key-value server in C, C++ or Rust: a TCP protocol, many concurrent " +
    "clients, persistence to disk, and numbers that prove its performance. No frameworks — sockets, " +
    "threads or an event loop, and memory you manage deliberately.",
  stack: ["C, C++ or Rust", "Linux", "TCP sockets", "perf"],

  requirements: [
    { id: "protocol", text: "A documented text or binary protocol over TCP with at least GET, SET, DEL and EXPIRE." },
    { id: "concurrency", text: "Serves many clients concurrently (threads or non-blocking I/O with epoll/kqueue) without data races." },
    { id: "persistence", text: "Data survives a restart through an append-only log or snapshots, and a crash mid-write never corrupts it." },
    { id: "memory", text: "No leaks or undefined behaviour: the test suite runs clean under AddressSanitizer and UndefinedBehaviorSanitizer (or Miri for Rust)." },
    { id: "client", text: "A small CLI client to talk to the server." },
    { id: "benchmark", text: "A benchmark reports throughput and latency percentiles for concurrent clients; results and the profiling that informed one optimisation are in the README." },
    { id: "build", text: "A reproducible build (CMake, Make or Cargo).", check: { type: "file", glob: "{CMakeLists.txt,Makefile,Cargo.toml}" } },
    { id: "tests", text: "Automated tests cover the protocol, expiry, persistence recovery and concurrent access.", check: { type: "file", glob: "{test,tests}/**/*" } },
    { id: "readme", text: "README explains the design, the protocol, how to build, run, test and benchmark.", check: CHECKS.readme },
    { id: "ci", text: "CI builds with warnings as errors and runs the tests, including a sanitizer build, on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 20, layerId: "systems-dev-7", description: "The protocol, expiry, persistence and your twist behave as specified under load." },
    { id: "memory", name: "Memory & resource safety", weight: 20, layerId: "systems-dev-2", description: "Ownership of memory and file descriptors is clear; sanitizers come back clean." },
    { id: "concurrency", name: "Concurrency", weight: 20, layerId: "systems-dev-6", description: "Synchronisation is correct and minimal; no races, deadlocks or busy-waiting." },
    { id: "os", name: "OS interface", weight: 10, layerId: "systems-dev-5", description: "System calls, signals and file I/O are used correctly, including partial reads and writes." },
    { id: "performance", name: "Performance", weight: 15, layerId: "systems-dev-8", description: "Claims are backed by benchmarks and profiles, not intuition." },
    { id: "verification", name: "Testing & tooling", weight: 15, layerId: "systems-dev-10", description: "Tests, sanitizers and (ideally) fuzzing give confidence in the parser and storage." },
  ],

  twistPool: [
    { id: "replication", text: "A replica can follow the primary over the network and serve reads, catching up after a disconnect." },
    { id: "lru", text: "The server has a memory limit and evicts least-recently-used keys in O(1) per operation when it is reached." },
    { id: "pubsub", text: "Add SUBSCRIBE/PUBLISH channels; slow subscribers must not block publishers or other clients." },
    { id: "fuzzing", text: "Fuzz the protocol parser (libFuzzer, AFL or cargo-fuzz), fix what it finds, and commit the corpus and a regression test." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
