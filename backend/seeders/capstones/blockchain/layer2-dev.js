/**
 * Capstone brief — Layer 2 Developer track (layer2-dev), v1.
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
  trackId: "layer2-dev",
  categoryId: "blockchain",
  slug: "layer2-dev-cross-layer-marketplace",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build an L1-L2 escrow marketplace",
  summary:
    "Build a testnet-only dApp that demonstrates a complete L1-to-L2 asset lifecycle. " +
    "Users deposit test ETH through an L1 escrow, interact with an application contract on " +
    "the L2, and initiate a withdrawal back toward L1. The frontend must understand multiple " +
    "networks, track transaction state and clearly distinguish confirmed L2 actions from " +
    "withdrawals that remain pending. No real money may be used.",
  stack: [
    "Solidity",
    "Foundry",
    "Next.js",
    "ethers.js",
    "Ethereum L1 testnet",
    "EVM L2 testnet",
  ],

  requirements: [
    {
      id: "l1-escrow",
      text: "An L1 testnet contract accepts test ETH deposits and records the depositor, amount and unique deposit identifier.",
    },
    {
      id: "l2-contract",
      text: "An L2 testnet contract represents deposited balances and allows users to lock testnet funds in a marketplace escrow.",
    },
    {
      id: "deployment",
      text: "The repository contains reproducible Foundry deployment scripts for the L1 and L2 contracts with network-specific configuration separated from contract logic.",
      check: { type: "file", glob: "script/**/*.s.sol" },
    },
    {
      id: "network-switching",
      text: "The frontend detects the active network and provides a controlled flow for switching between the configured L1 and L2 networks.",
      check: { type: "file", glob: "**/{app,pages,src}/**/*.{js,ts,jsx,tsx}" },
    },
    {
      id: "bridge-flow",
      text: "The application displays the deposit and withdrawal lifecycle using transaction hashes and explicit states rather than treating a submitted transaction as final.",
    },
    {
      id: "escrow",
      text: "A buyer can create an escrow for a testnet purchase and release or cancel it according to documented authorization and state-transition rules.",
    },
    {
      id: "l2-gas",
      text: "The application handles L2 transaction fees and gas estimates without assuming that L1 and L2 fee accounting are identical.",
    },
    {
      id: "withdrawal",
      text: "A user can initiate an L2 withdrawal and the application records the pending state until the configured withdrawal completion condition is satisfied.",
    },
    {
      id: "tests",
      text: "Automated tests cover contract authorization, escrow lifecycle, invalid state transitions and at least one cross-layer transaction workflow.",
      check: { type: "file", glob: "test/**/*.t.sol" },
    },
    {
      id: "readme",
      text: "README documents the selected testnets, required test funds, contract deployment, environment variables, frontend setup and L1/L2 workflow.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "env",
      text: "RPC URLs, private keys and contract addresses are configured through environment variables with an example configuration file and no secrets committed.",
      check: { type: "file", glob: ".env.example" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs the project's automated contract or application tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "l2-model",
      name: "Layer 2 architecture",
      weight: 15,
      layerId: "layer2-dev-1",
      description:
        "The application accurately distinguishes L1 settlement from L2 execution and explains the selected rollup model.",
    },
    {
      id: "deployment",
      name: "L2 deployment",
      weight: 10,
      layerId: "layer2-dev-2",
      description:
        "Contracts and configuration are deployed reproducibly to the selected testnet environments.",
    },
    {
      id: "cross-layer",
      name: "Cross-layer messaging",
      weight: 20,
      layerId: "layer2-dev-5",
      description:
        "Deposits, withdrawals and message state are modeled with explicit lifecycle and trust assumptions.",
    },
    {
      id: "l2-contract",
      name: "L2-aware contracts",
      weight: 20,
      layerId: "layer2-dev-6",
      description:
        "Contract logic accounts for L2-specific gas, block/time assumptions and transaction behaviour.",
    },
    {
      id: "frontend",
      name: "Multi-network dApp",
      weight: 20,
      layerId: "layer2-dev-7",
      description:
        "The frontend handles wallet networks, transaction states and cross-layer lifecycle information clearly.",
    },
    {
      id: "security-ops",
      name: "Security & operations",
      weight: 15,
      layerId: "layer2-dev-9",
      description:
        "The design documents bridge, upgrade and sequencing assumptions and avoids unsafe handling of testnet credentials or cross-layer state.",
    },
  ],

  twistPool: [
    {
      id: "forced-inclusion",
      text: "Add an escape hatch: users can enqueue an L2 action on an L1 contract and, once a configured delay passes without the sequencer including it, anyone can trigger it on the L2 contract (simulated in tests by advancing time).",
    },
    {
      id: "message-replay",
      text: "Add unique message identifiers and replay protection so the same simulated cross-layer message cannot be executed twice on the destination contract.",
    },
    {
      id: "sequencer-status",
      text: "Add a sequencer-status indicator that distinguishes normal operation, delayed block production and unavailable RPC responses, without presenting an unavailable RPC as proof that the sequencer itself is down.",
    },
    {
      id: "timelocked-upgrade",
      text: "Add a timelocked upgrade administrator for one L2 contract, requiring an announced implementation change to remain pending for a configured delay before execution.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
