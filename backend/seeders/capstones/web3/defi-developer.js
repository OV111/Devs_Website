/**
 * Capstone brief — defi-developer track (defi-developer), v1.
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
  trackId: "defi-developer",
  categoryId: "web3",
  slug: "defi-developer-decentralized-amm",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Market Maker (AMM) with Yield Vaults",
  summary:
    "Build a constant-product Automated Market Maker (AMM) token exchange and yield vault system using Solidity and Foundry. " +
    "Engineers implement swap routing based on x*y=k, liquidity provider token minting, Chainlink oracle pricing checks, and ERC-4626 vault strategies.",
  stack: ["Solidity", "Foundry", "Chainlink", "ERC-4626", "Anvil"],

  requirements: [
    {
      id: "amm-pair-math",
      text: "Implement constant-product x*y=k exchange math, swap fees, and slippage protections.",
    },
    {
      id: "lp-tokens",
      text: "Mint LP tokens proportionally on liquidity deposit and burn them on liquidity withdrawal.",
    },
    {
      id: "chainlink-oracle",
      text: "Integrate Chainlink AggregatorV3 price feeds with staleness and validation checks.",
    },
    {
      id: "erc4626-vault",
      text: "Build an ERC-4626 compliant yield vault to auto-compound rewards and issue shares.",
    },
    {
      id: "flash-loan-provider",
      text: "Implement a flash loan function adhering to callback interface patterns with fee enforcement.",
    },
    {
      id: "foundry-unit-tests",
      text: "Provide comprehensive Foundry unit tests asserting mathematical correctness and state changes.",
      check: { type: "file", glob: "test/**/*.t.sol" },
    },
    {
      id: "foundry-fuzz-tests",
      text: "Implement invariant and fuzz testing in Foundry to verify constant-product invariants under randomized inputs.",
      check: { type: "file", glob: "test/**/*.t.sol" },
    },
    {
      id: "foundry-config",
      text: "Configure foundry.toml for optimizer settings and remappings.",
      check: { type: "file", glob: "foundry.toml" },
    },
    {
      id: "readme",
      text: "Document project installation, forge test instructions, and mathematical specs in README.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes forge test and forge fmt checks.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "amm-math-correctness",
      name: "AMM Math & Token Mechanics",
      weight: 25,
      layerId: "defi-developer-4",
      description:
        "Accurate implementation of x*y=k curves, fee deductions, and proportional LP shares.",
    },
    {
      id: "foundry-testing",
      name: "Foundry Testing & Fuzzing",
      weight: 20,
      layerId: "defi-developer-3",
      description:
        "Extensive test coverage utilizing forge fuzz runs, invariant tests, and edge case assertions.",
    },
    {
      id: "oracle-integration",
      name: "Price Oracle Safety",
      weight: 15,
      layerId: "defi-developer-5",
      description:
        "Proper integration of Chainlink price feeds, handling staleness, round IDs, and zero-price protection.",
    },
    {
      id: "vault-standard",
      name: "ERC-4626 Yield Vault Implementation",
      weight: 15,
      layerId: "defi-developer-8",
      description:
        "Adheres strictly to the ERC-4626 tokenized vault standard for share pricing and transfers.",
    },
    {
      id: "flash-loan-logic",
      name: "Flash Loan Execution",
      weight: 15,
      layerId: "defi-developer-7",
      description:
        "Clean callback execution, balance verification, and protection against unauthorized callbacks.",
    },
    {
      id: "security-patterns",
      name: "DeFi Security & Guards",
      weight: 10,
      layerId: "defi-developer-9",
      description:
        "Uses checks-effects-interactions, reentrancy guards, and SafeERC20 operations.",
    },
  ],

  twistPool: [
    {
      id: "twap-oracle",
      text: "Incorporate an on-chain Time-Weighted Average Price (TWAP) calculation module into the AMM pair.",
    },
    {
      id: "liquidation-bot-helper",
      text: "Build a helper smart contract that executes atomic arbitrage flash swaps when price discrepancies occur.",
    },
    {
      id: "dynamic-fee-tier",
      text: "Adjust swap fees dynamically based on recent block volatility metrics.",
    },
    {
      id: "timelock-admin",
      text: "Add an OpenZeppelin TimelockController to govern protocol parameter updates and fee collection.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
