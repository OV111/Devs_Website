/**
 * Capstone brief — Cosmos Developer track (cosmos-dev), v1.
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
  trackId: "cosmos-dev",
  categoryId: "blockchain",
  slug: "cosmos-dev-community-grants",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Cosmos community grants chain",
  summary:
    "Build a small Cosmos SDK application chain for community grants. Accounts can submit " +
    "grant proposals, members can vote, and approved grants can be funded from a module-owned " +
    "pool. Implement the core state and message flow in Go, expose gRPC queries and run the " +
    "chain locally. The project should demonstrate Cosmos SDK architecture rather than simply " +
    "wrapping an existing chain API.",
  stack: ["Go", "Cosmos SDK", "CometBFT", "Protocol Buffers", "gRPC"],

  requirements: [
    {
      id: "grant-module",
      text: "The chain contains a custom grants module with persistent state, a keeper and message handlers for creating proposals, voting and executing approved grants.",
      check: { type: "file", glob: "x/**/module.go" },
    },
    {
      id: "proposal-state",
      text: "Each proposal records its proposer, recipient, requested amount, voting state and enough metadata to enforce its lifecycle.",
    },
    {
      id: "voting",
      text: "Only eligible accounts can vote, each eligible account can vote once per proposal, and voting results are calculated deterministically.",
    },
    {
      id: "funding",
      text: "The module tracks a grant funding pool and rejects execution when the approved grant cannot be funded by the available module balance.",
    },
    {
      id: "authorization",
      text: "Message handlers validate the signer against the action being performed and reject unauthorized state changes.",
    },
    {
      id: "queries",
      text: "The module exposes gRPC queries for an individual proposal and a paginated collection of proposals.",
      check: { type: "file", glob: "proto/**/*.proto" },
    },
    {
      id: "cli",
      text: "The project exposes usable transaction or query commands for creating proposals, voting and reading proposal state.",
    },
    {
      id: "local-chain",
      text: "The application can be built and started as a local Cosmos SDK chain with deterministic development configuration.",
    },
    {
      id: "tests",
      text: "Go tests cover proposal creation, authorization, voting, insufficient funding and successful execution.",
      check: { type: "file", glob: "**/*_test.go" },
    },
    {
      id: "go-module",
      text: "The repository contains a reproducible Go module definition with the Cosmos SDK dependencies required by the application.",
      check: { type: "file", glob: "go.mod" },
    },
    {
      id: "readme",
      text: "README explains how to build and start the chain, create accounts, submit transactions, query proposals and run tests.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the Go application and runs its tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "cosmos-foundations",
      name: "Cosmos architecture",
      weight: 15,
      layerId: "cosmos-dev-1",
      description:
        "The application correctly models an app chain, Cosmos SDK runtime and CometBFT boundary.",
    },
    {
      id: "go",
      name: "Go implementation",
      weight: 15,
      layerId: "cosmos-dev-2",
      description:
        "Go packages, interfaces, structs and error handling are idiomatic and maintainable.",
    },
    {
      id: "sdk",
      name: "SDK architecture",
      weight: 25,
      layerId: "cosmos-dev-3",
      description:
        "BaseApp, module state, keepers and transaction processing are used according to the Cosmos SDK runtime model.",
    },
    {
      id: "module",
      name: "Custom module",
      weight: 20,
      layerId: "cosmos-dev-4",
      description:
        "Messages, handlers, keeper logic and query services form a coherent module with correct state transitions.",
    },
    {
      id: "testing",
      name: "Testing & correctness",
      weight: 15,
      layerId: "cosmos-dev-9",
      description:
        "Tests exercise successful and failing state transitions and protect important module invariants.",
    },
    {
      id: "operations",
      name: "Operations & documentation",
      weight: 10,
      layerId: "cosmos-dev-10",
      description:
        "The chain can be built and operated locally with clear setup and execution documentation.",
    },
  ],

  twistPool: [
    {
      id: "delegation-votes",
      text: "Base voting power on a configurable delegation amount recorded by the module, and ensure proposal results use voting power rather than one-vote-per-address.",
    },
    {
      id: "proposal-expiry",
      text: "Add an automatic proposal expiration rule that prevents voting and execution after the configured deadline, with tests for both pre-deadline and expired states.",
    },
    {
      id: "grant-stream",
      text: "Allow an approved grant to release its funds in multiple scheduled installments, with each installment executable only once and the total never exceeding the approved amount.",
    },
    {
      id: "emergency-pause",
      text: "Add a governance-controlled emergency pause parameter that prevents new grant executions while leaving proposal queries and voting available.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
