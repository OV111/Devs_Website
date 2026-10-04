/**
 * Capstone brief — Smart Contract Dev track (smart-contract), v1.
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
  trackId: "smart-contract",
  categoryId: "blockchain",
  slug: "smart-contract-testnet-escrow",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a trust-minimized milestone escrow",
  summary:
    "Build a Solidity escrow protocol for milestone-based payments where funds are " +
    "locked until predefined milestones are approved or a dispute path resolves them. " +
    "Deploy and test it locally with Foundry. The contract must make its trust assumptions " +
    "explicit and enforce authorization, accounting and withdrawal rules on-chain.",
  stack: ["Solidity", "Foundry", "OpenZeppelin", "Anvil"],

  requirements: [
    {
      id: "escrow-creation",
      text: "A payer can create an escrow with a recipient, total amount, milestone amounts and a deadline, and the contract rejects invalid milestone totals.",
    },
    {
      id: "milestone-state",
      text: "Each milestone has an explicit lifecycle state, and state transitions are enforced so a milestone cannot be approved, disputed or released twice.",
    },
    {
      id: "funding",
      text: "The payer can fund an escrow with native testnet ETH, and the contract rejects underfunded or overfunded escrow states according to the documented funding rules.",
    },
    {
      id: "authorization",
      text: "Only the payer and recipient can perform the actions assigned to them, and no third party can release escrow funds by calling a privileged function.",
    },
    {
      id: "withdrawals",
      text: "Released milestone funds can be withdrawn exactly once by the entitled recipient, while undistributed funds remain accounted for by the contract.",
    },
    {
      id: "disputes",
      text: "A dispute mechanism exists for an active milestone and resolves through an explicitly defined on-chain rule that determines who receives the disputed amount.",
    },
    {
      id: "events",
      text: "Creation, funding, milestone transitions, disputes and withdrawals emit events containing enough indexed data for an off-chain client to reconstruct escrow activity.",
    },
    {
      id: "tests",
      text: "Foundry tests cover successful flows, unauthorized calls, invalid state transitions, incorrect payment amounts and withdrawal edge cases.",
      check: { type: "file", glob: "test/**/*.t.sol" },
    },
    {
      id: "readme",
      text: "README explains the escrow state machine, trust assumptions, setup, local deployment and commands for running the test suite.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "toolchain",
      text: "The repository contains a reproducible Foundry project configuration that can compile the contracts with forge build.",
      check: { type: "file", glob: "foundry.toml" },
    },
    {
      id: "ci",
      text: "A CI workflow installs the required toolchain and runs the project's contract tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "solidity-correctness",
      name: "Contract correctness",
      weight: 25,
      layerId: "smart-contract-1",
      description:
        "State variables, functions and value handling correctly implement the escrow lifecycle and accounting rules.",
    },
    {
      id: "data-model",
      name: "Data model & state transitions",
      weight: 15,
      layerId: "smart-contract-2",
      description:
        "Structs, enums, mappings and lifecycle transitions form a coherent model without contradictory or unreachable states.",
    },
    {
      id: "foundry-workflow",
      name: "Foundry development",
      weight: 10,
      layerId: "smart-contract-3",
      description:
        "The project has a reproducible Foundry layout, compiles cleanly and is straightforward to run locally.",
    },
    {
      id: "openzeppelin",
      name: "Contract composition",
      weight: 10,
      layerId: "smart-contract-4",
      description:
        "OpenZeppelin components are used appropriately where they solve a real contract concern rather than being added superficially.",
    },
    {
      id: "testing",
      name: "Testing & failure cases",
      weight: 20,
      layerId: "smart-contract-5",
      description:
        "Tests demonstrate expected behaviour, reverts, events and adversarial authorization/state-transition cases.",
    },
    {
      id: "security-gas",
      name: "Security & EVM efficiency",
      weight: 20,
      layerId: "smart-contract-8",
      description:
        "The implementation avoids obvious reentrancy and accounting hazards and makes sensible choices around storage, calldata, errors and loops.",
    },
  ],

  twistPool: [
    {
      id: "deadline-refund",
      text: "If a milestone remains unresolved after its deadline, the payer can reclaim only that unresolved milestone's funds, while already released milestones remain final.",
    },
    {
      id: "partial-approval",
      text: "The recipient can request a partial milestone release, but the released amount must never exceed the milestone's remaining balance and the remainder must stay claimable under the documented rules.",
    },
    {
      id: "arbiter-role",
      text: "Each escrow may optionally name an independent arbiter who can resolve a disputed milestone, but the arbiter must have no authority over undisputed milestones or unrelated escrows.",
    },
    {
      id: "cancellation",
      text: "Before any milestone is released, the payer and recipient can mutually cancel the escrow, after which all remaining funds become withdrawable according to the documented cancellation split.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
