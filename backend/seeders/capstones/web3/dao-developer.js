/**
 * Capstone brief — dao-developer track (dao-developer), v1.
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
  trackId: "dao-developer",
  categoryId: "web3",
  slug: "dao-developer-governance-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "On-Chain DAO Governance Framework & Treasury",
  summary:
    "Build a complete decentralized autonomous organization (DAO) governance system using OpenZeppelin Governor and ERC-20Votes. " +
    "Members delegate voting power, submit governance proposals, vote on-chain, and execute timelocked treasury expenditures.",
  stack: ["Solidity", "Hardhat", "OpenZeppelin", "Governor", "React"],

  requirements: [
    {
      id: "erc20-votes",
      text: "Implement an ERC-20 governance token with historical voting checkpoints and self-delegation.",
    },
    {
      id: "oz-governor",
      text: "Deploy an OpenZeppelin Governor contract configuring voting delay, voting period, and quorum fractions.",
    },
    {
      id: "timelock-controller",
      text: "Integrate TimelockController to enforce execution delays on successful governance proposals.",
    },
    {
      id: "dao-treasury",
      text: "Build a treasury contract owned exclusively by the TimelockController for asset management.",
    },
    {
      id: "snapshot-integration",
      text: "Configure off-chain voting support with EIP-712 signed messages and Snapshot strategy verification.",
    },
    {
      id: "hardhat-tests",
      text: "Hardhat test suite verifies proposal lifecycles, vote weight checkpoints, and execution delays.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "frontend-governance-ui",
      text: "Build a React frontend allowing users to delegate votes, create proposals, and cast ballots.",
    },
    {
      id: "env-example",
      text: "Include an .env.example file specifying deployment keys and RPC endpoints.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Document governance parameters, testing instructions, and proposal deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes contract compilation and Hardhat test runs.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "governance-token-mechanics",
      name: "ERC-20Votes & Delegation",
      weight: 25,
      layerId: "dao-developer-2",
      description:
        "Accurate checkpointing, historical voting power queries, and delegation mechanics.",
    },
    {
      id: "governor-timelock-arch",
      name: "Governor & Timelock Architecture",
      weight: 25,
      layerId: "dao-developer-3",
      description:
        "Correct proposal lifecycle states (Pending, Active, Succeeded, Queued, Executed) and delay enforcement.",
    },
    {
      id: "treasury-security",
      name: "DAO Treasury & Access Control",
      weight: 15,
      layerId: "dao-developer-5",
      description:
        "Secures treasury funds behind governance control and prevents unauthorized withdrawals.",
    },
    {
      id: "offchain-snapshot",
      name: "Off-Chain Voting & Signatures",
      weight: 15,
      layerId: "dao-developer-4",
      description:
        "Proper EIP-712 typed data hashing and signature verification for off-chain voting strategies.",
    },
    {
      id: "dao-testing",
      name: "Governance Testing & Edge Cases",
      weight: 10,
      layerId: "dao-developer-9",
      description:
        "Tests cover flash loan governance attacks, quorum manipulation, and execution failures.",
    },
    {
      id: "frontend-ux",
      name: "Governance Frontend UX",
      weight: 10,
      layerId: "dao-developer-7",
      description:
        "Clear proposal displays, intuitive voting power indicators, and smooth transaction feedback.",
    },
  ],

  twistPool: [
    {
      id: "quadratic-voting",
      text: "Implement a quadratic voting calculation module where voting cost scales with the square of votes cast.",
    },
    {
      id: "emergency-veto-guardian",
      text: "Add an emergency veto guardian role capable of canceling malicious proposals during the timelock window.",
    },
    {
      id: "multisig-treasury-fallback",
      text: "Require a Gnosis Safe multi-sig secondary sign-off for treasury disbursements exceeding specific thresholds.",
    },
    {
      id: "streamed-salaries",
      text: "Deploy a continuous token streaming contract allowing the DAO to fund contributors block-by-block.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
