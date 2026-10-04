/**
 * Capstone brief — Chain Architect track (chain-architect), v1.
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
  trackId: "chain-architect",
  categoryId: "blockchain",
  slug: "chain-architect-local-appchain",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Design and prototype an application-specific chain",
  summary:
    "Build a small application-specific blockchain prototype and document the architecture " +
    "as if you were preparing it for a production team. The prototype should implement a " +
    "custom Cosmos SDK module or equivalent framework-based chain component, define validator " +
    "and governance parameters, expose queries and demonstrate how the chain would handle " +
    "upgrades and cross-chain communication. Focus on architectural boundaries and operational " +
    "trade-offs rather than building a generic token.",
  stack: ["Go", "Cosmos SDK", "CometBFT", "Protocol Buffers", "gRPC"],

  requirements: [
    {
      id: "chain-purpose",
      text: "The project defines a concrete application-specific use case and documents why a dedicated chain is used instead of deploying the same logic as a contract on an existing chain.",
    },
    {
      id: "module",
      text: "The chain contains a custom Cosmos SDK module with its own state, message types, message handlers and keeper logic.",
      check: { type: "file", glob: "x/**/module.go" },
    },
    {
      id: "state",
      text: "The module persists deterministic application state and exposes a query path for reading that state.",
      check: { type: "file", glob: "proto/**/*.proto" },
    },
    {
      id: "messages",
      text: "At least two transaction messages mutate module state, and handlers validate authorization and input before committing state changes.",
    },
    {
      id: "queries",
      text: "The module exposes gRPC query definitions and handlers for retrieving individual and collection-level application state.",
    },
    {
      id: "consensus",
      text: "The architecture documents validator voting power, block finality and the role of CometBFT in the application chain.",
    },
    {
      id: "governance",
      text: "The chain defines at least two governance-controlled parameters and documents how a valid parameter change propagates into runtime behaviour.",
    },
    {
      id: "upgrade",
      text: "The repository documents and prototypes a versioned upgrade path that changes module or chain behaviour without silently corrupting existing state.",
    },
    {
      id: "tests",
      text: "Go tests cover module state transitions, message validation and query behaviour, including at least one unauthorized or invalid request.",
      check: { type: "file", glob: "**/*_test.go" },
    },
    {
      id: "go-module",
      text: "The repository contains a reproducible Go module definition and dependency configuration.",
      check: { type: "file", glob: "go.mod" },
    },
    {
      id: "readme",
      text: "README explains how to build and run the chain locally, execute transactions and queries, run tests and inspect the custom module.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the Go project and runs its tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "architecture",
      name: "Application-chain architecture",
      weight: 20,
      layerId: "chain-architect-1",
      description:
        "The chain's purpose, sovereignty model and framework choices are coherent and technically justified.",
    },
    {
      id: "consensus",
      name: "Consensus architecture",
      weight: 15,
      layerId: "chain-architect-2",
      description:
        "Validator voting power, BFT finality and consensus/application boundaries are represented accurately.",
    },
    {
      id: "cosmos-module",
      name: "Cosmos SDK module",
      weight: 25,
      layerId: "chain-architect-3",
      description:
        "Module state, keepers, messages, handlers and queries follow the framework's runtime model correctly.",
    },
    {
      id: "token-governance",
      name: "Token & governance design",
      weight: 10,
      layerId: "chain-architect-5",
      description:
        "Governance-controlled parameters and validator economics are explicit and internally consistent.",
    },
    {
      id: "cross-chain",
      name: "Cross-chain architecture",
      weight: 10,
      layerId: "chain-architect-6",
      description:
        "The proposed cross-chain boundary correctly identifies packets, channels, proofs and trust assumptions.",
    },
    {
      id: "operations",
      name: "Operations & upgrades",
      weight: 20,
      layerId: "chain-architect-10",
      description:
        "The upgrade path, local deployment, testing and operational documentation show how the chain could be maintained safely.",
    },
  ],

  twistPool: [
    {
      id: "ibc-module",
      text: "Add an IBC-facing message flow that sends an application packet to a connected test chain or a deterministic mock, and document the channel, packet and acknowledgement lifecycle.",
    },
    {
      id: "staking-parameter",
      text: "Add a chain parameter controlling validator eligibility or minimum stake, and implement a governance-driven parameter update with tests proving the new value affects validator admission logic.",
    },
    {
      id: "fee-market",
      text: "Add a minimum gas price parameter that governance can update, plus an ante handler that rejects underpriced transactions. Tests must cover rejection below the minimum, acceptance at the minimum and the effect of a parameter update.",
    },
    {
      id: "state-migration",
      text: "Implement a concrete state migration from module version one to version two, including a test that initializes version-one state and verifies the migrated representation and preserved values.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
