/**
 * Capstone brief — Blockchain Core Dev track (blockchain-core), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "blockchain-core",
  categoryId: "blockchain",
  slug: "blockchain-core-payment-chain",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a minimal peer-to-peer blockchain",
  summary:
    "Build a small educational blockchain node in Rust that accepts transactions, " +
    "mines or validates blocks, persists chain state and communicates with peers. " +
    "The implementation should expose the core mechanics rather than hide them behind " +
    "a blockchain framework: hashing, transaction encoding, block validation, networking " +
    "and deterministic state updates must be visible and testable.",
  stack: ["Rust", "Tokio", "Serde", "SHA-256"],

  requirements: [
    {
      id: "transactions",
      text: "The node defines a deterministic transaction format with sender, recipient, amount and nonce fields and rejects malformed or invalid transactions before they enter the transaction pool.",
    },
    {
      id: "blocks",
      text: "Each block contains a deterministic header with a parent hash, timestamp, block height and transaction commitment, and the block hash is derived from its encoded contents.",
    },
    {
      id: "genesis",
      text: "The node creates a deterministic genesis block and rejects chains whose genesis block or parent relationships do not match the configured chain identity.",
    },
    {
      id: "validation",
      text: "A received block is validated for parent linkage, height, transaction validity and block hash before it can become part of the local canonical chain.",
    },
    {
      id: "state",
      text: "The node maintains deterministic account balances and nonces and applies valid transactions in block order without allowing negative balances or nonce reuse.",
    },
    {
      id: "mempool",
      text: "The transaction pool accepts valid transactions, rejects duplicate or stale nonces and removes transactions after they are included in an accepted block.",
    },
    {
      id: "p2p",
      text: "Nodes can discover or connect to configured peers and exchange serialized blocks and transactions over asynchronous network connections.",
    },
    {
      id: "persistence",
      text: "The node persists enough blockchain state to restart without losing the canonical chain and account state.",
    },
    {
      id: "tests",
      text: "Automated Rust tests cover transaction validation, deterministic hashing, block validation, state transitions and at least one peer-to-peer message flow.",
      check: { type: "file", glob: "tests/**/*.rs" },
    },
    {
      id: "cargo",
      text: "The repository contains a reproducible Rust project configuration with its dependencies and package metadata.",
      check: { type: "file", glob: "Cargo.toml" },
    },
    {
      id: "readme",
      text: "README explains the protocol rules, message format, local node setup, how to run multiple nodes and how to execute the tests.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the Rust project and runs its automated tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "protocol-model",
      name: "Blockchain protocol model",
      weight: 20,
      layerId: "blockchain-core-1",
      description:
        "Hashes, cryptographic identities, deterministic encoding and distributed-system assumptions are represented correctly.",
    },
    {
      id: "chain",
      name: "Blockchain implementation",
      weight: 20,
      layerId: "blockchain-core-2",
      description:
        "Blocks, headers, transaction encoding, genesis handling and hash chaining form a coherent validated chain.",
    },
    {
      id: "rust",
      name: "Rust systems implementation",
      weight: 15,
      layerId: "blockchain-core-3",
      description:
        "Ownership, lifetimes, traits, errors and asynchronous execution are used appropriately for a systems project.",
    },
    {
      id: "networking",
      name: "Peer-to-peer networking",
      weight: 15,
      layerId: "blockchain-core-4",
      description:
        "Peer connections and serialized protocol messages are handled reliably without coupling networking to consensus logic.",
    },
    {
      id: "state",
      name: "State & execution",
      weight: 15,
      layerId: "blockchain-core-7",
      description:
        "Transaction execution and persisted state are deterministic, validated and recoverable across restarts.",
    },
    {
      id: "testing",
      name: "Testing & resilience",
      weight: 15,
      layerId: "blockchain-core-9",
      description:
        "Tests exercise malformed data, invalid transitions and network failures rather than only the happy path.",
    },
  ],

  twistPool: [
    {
      id: "proof-of-work",
      text: "Add a configurable proof-of-work rule requiring block hashes to satisfy a target difficulty, and make block validation enforce that rule for received blocks.",
    },
    {
      id: "fork-choice",
      text: "Support temporary forks: keep competing branches and adopt the longest valid chain as canonical (ties broken deterministically), rebuilding account state when the head switches. A test must force at least one head switch.",
    },
    {
      id: "peer-gossip",
      text: "Add duplicate-safe gossip for transactions and blocks so a message received from one peer can propagate to other peers without creating forwarding loops.",
    },
    {
      id: "snapshot-recovery",
      text: "Add a state snapshot export and import mechanism that verifies the snapshot's chain height and commitment before restoring account state.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
