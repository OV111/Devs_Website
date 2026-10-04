/**
 * Capstone brief — Ethereum Developer track (ethereum-dev), v1.
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
  trackId: "ethereum-dev",
  categoryId: "blockchain",
  slug: "ethereum-dev-event-indexer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build an Ethereum event indexer and wallet activity API",
  summary:
    "Build a small Ethereum application that watches a deployed contract and turns its " +
    "events into queryable wallet activity. The project must combine an ethers.js client, " +
    "a local Ethereum node, deterministic event processing and a useful API or CLI. " +
    "The important part is not displaying transactions — it is correctly understanding " +
    "how Ethereum state, logs, ABI encoding and confirmations fit together.",
  stack: [
    "Node.js",
    "TypeScript",
    "ethers.js",
    "Hardhat",
    "SQLite or PostgreSQL",
  ],

  requirements: [
    {
      id: "local-chain",
      text: "The project runs against a local Ethereum development network and deploys a contract that emits the events consumed by the application.",
      check: { type: "file", glob: "hardhat.config.{js,ts}" },
    },
    {
      id: "contract-events",
      text: "The contract exposes at least three meaningful events for deposits, withdrawals and account activity, with indexed fields chosen intentionally for filtering.",
    },
    {
      id: "provider-client",
      text: "The application uses an ethers.js provider for reads and a signer for transactions, with network configuration kept outside business logic.",
    },
    {
      id: "event-indexing",
      text: "The indexer discovers contract events from a configurable block range and stores enough block number, transaction hash and log information to identify each event uniquely.",
    },
    {
      id: "confirmations",
      text: "Indexed events have a documented confirmation policy, and the application does not treat an event as finalized until the configured confirmation depth has been reached.",
    },
    {
      id: "queries",
      text: "Users can query indexed activity by wallet address and retrieve paginated results ordered by block position and log index.",
    },
    {
      id: "reprocessing",
      text: "The indexer can safely process the same block range more than once without creating duplicate activity records.",
    },
    {
      id: "wallet-state",
      text: "The application can read the deployed contract's relevant state for a wallet and reconcile it against indexed activity.",
    },
    {
      id: "tests",
      text: "Automated tests cover contract interactions and the indexer's event processing, including duplicate processing and an empty-result case.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "readme",
      text: "README explains local chain setup, contract deployment, environment variables if used, indexing commands, query commands and test execution.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies, builds the project and runs the automated tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "ethereum-model",
      name: "Ethereum & EVM understanding",
      weight: 15,
      layerId: "ethereum-dev-1",
      description:
        "The implementation correctly handles accounts, transactions, blocks, confirmations and contract state rather than treating the chain as a generic database.",
    },
    {
      id: "solidity",
      name: "Smart contract design",
      weight: 15,
      layerId: "ethereum-dev-2",
      description:
        "The supporting Solidity contract uses appropriate types, visibility, events and access rules.",
    },
    {
      id: "ethers",
      name: "ethers.js integration",
      weight: 20,
      layerId: "ethereum-dev-3",
      description:
        "Providers, signers, contract calls, transactions and event listeners are used correctly with clear separation between reads and writes.",
    },
    {
      id: "indexing",
      name: "Event indexing & data integrity",
      weight: 20,
      layerId: "ethereum-dev-7",
      description:
        "Events are decoded and persisted correctly, duplicates are prevented and indexed data remains traceable to on-chain evidence.",
    },
    {
      id: "security",
      name: "Wallet & transaction safety",
      weight: 15,
      layerId: "ethereum-dev-8",
      description:
        "Signing, addresses, transaction handling and configuration avoid unsafe assumptions or accidental exposure of private credentials.",
    },
    {
      id: "testing-ops",
      name: "Testing & operability",
      weight: 15,
      layerId: "ethereum-dev-9",
      description:
        "Tests exercise integration behaviour and the repository provides a reproducible workflow suitable for CI and local development.",
    },
  ],

  twistPool: [
    {
      id: "historical-backfill",
      text: "Add a backfill command that indexes all relevant events from deployment block to the current chain head in bounded block batches without exceeding the configured batch size.",
    },
    {
      id: "live-watcher",
      text: "Add a live watcher that detects newly mined events and updates the index without requiring the user to restart the process.",
    },
    {
      id: "reorg-recovery",
      text: "Handle chain reorganisations: store each indexed event with its block hash and, when a new block's parent hash does not match the stored chain, delete the events of the orphaned blocks and re-index from the fork point. A test using Hardhat's evm_snapshot and evm_revert must show an orphaned event disappearing.",
    },
    {
      id: "abi-versioning",
      text: "Support two deployed contract versions with different event ABIs and route each event through the correct decoder based on the configured contract address and version.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
