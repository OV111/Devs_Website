/**
 * Capstone brief — rust track (rust), v1.
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
  trackId: "rust",
  categoryId: "languages",
  slug: "rust-kv-storage-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Thread-Safe Persistent Key-Value Storage Engine",
  summary:
    "Build a persistent, thread-safe key-value database engine in Rust. You will model storage structures, " +
    "enforce strict compile-time ownership and borrowing rules, implement custom iterator traits, write robust error types, " +
    "and build multi-threaded async command handling.",
  stack: ["Rust Edition 2021", "Cargo", "thiserror", "Tokio / Async"],

  requirements: [
    {
      id: "cargo-manifest",
      text: "Repository contains a valid Cargo.toml manifest file.",
      check: CHECKS.cargo,
    },
    {
      id: "ownership-borrowing",
      text: "Storage reader/writer API enforces strict compile-time ownership and borrowing guarantees.",
    },
    {
      id: "structs-enums",
      text: "Model commands and database entries using Rust enums with rich payload data and dynamic matching.",
    },
    {
      id: "custom-iterator",
      text: "Implement the Iterator trait for key range scanning over database entries.",
    },
    {
      id: "trait-generics",
      text: "Define storage backend traits to decouple memory storage from file disk storage.",
    },
    {
      id: "error-handling",
      text: "Define custom error types using the thiserror crate and propagate failures with the ? operator.",
    },
    {
      id: "concurrency",
      text: "Share state safely across thread and async task boundaries using Arc, Mutex/RwLock, or mpsc channels.",
    },
    {
      id: "integration-tests",
      text: "Include integration test suites under the tests/ directory testing persistence and concurrent access.",
      check: { type: "file", glob: "tests/**/*.rs" },
    },
    {
      id: "readme",
      text: "README documents memory safety guarantees, benchmark instructions, and usage setup.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow executes cargo test, cargo clippy, and cargo fmt checks.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "ownership-lifetimes",
      name: "Ownership, Borrowing & Lifetimes",
      weight: 25,
      layerId: "rust-2",
      description:
        "Clean borrowing and lifetime mechanics without superfluous clones or unsafe hacks.",
    },
    {
      id: "error-handling",
      name: "Error Systems & Propagation",
      weight: 15,
      layerId: "rust-6",
      description:
        "Idiomatic error handling using custom types, thiserror, and the ? operator.",
    },
    {
      id: "traits-generics",
      name: "Traits & Generic Abstractions",
      weight: 15,
      layerId: "rust-5",
      description:
        "Elegantly designed traits and generics with clean bounds for storage drivers.",
    },
    {
      id: "concurrency-async",
      name: "Concurrency & Async Rust",
      weight: 15,
      layerId: "rust-9",
      description:
        "Safe multi-threaded data sharing using Arc/Mutex and async runtime integration.",
    },
    {
      id: "structs-enums-iters",
      name: "Types & Iterators",
      weight: 15,
      layerId: "rust-4",
      description:
        "Effective use of Enums, Option/Result pattern matching, and Iterator implementations.",
    },
    {
      id: "testing-ecosystem",
      name: "Testing & Code Quality",
      weight: 15,
      layerId: "rust-10",
      description:
        "Thorough unit/integration tests, zero clippy warnings, and clean project structure.",
    },
  ],

  twistPool: [
    {
      id: "wal-compaction",
      text: "Implement a log-structured append file with background log compaction to clean up stale key updates.",
    },
    {
      id: "in-memory-lru",
      text: "Add an LRU cache layer around the persistent file engine using Rc/RefCell or Box smart pointers.",
    },
    {
      id: "transactions",
      text: "Support atomic multi-key read-write transaction sessions with rollback capabilities upon error.",
    },
    {
      id: "snapshots",
      text: "Provide a point-in-time snapshot export function that yields consistent point-in-time database views.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
