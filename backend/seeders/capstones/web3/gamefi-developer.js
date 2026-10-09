/**
 * Capstone brief — gamefi-developer track (gamefi-developer), v1.
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
  trackId: "gamefi-developer",
  categoryId: "web3",
  slug: "gamefi-developer-dungeon-crawler",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "On-Chain Dungeon Crawler Game & NFT Item Economy",
  summary:
    "Build an on-chain action RPG game ecosystem. The system features ERC-1155 gear items, Chainlink VRF verifiable loot drops, " +
    "server-signed play-to-earn score reward payouts, and an in-game item marketplace.",
  stack: ["Solidity", "Hardhat", "Chainlink VRF", "ERC-1155", "React"],

  requirements: [
    {
      id: "erc1155-game-items",
      text: "Build an ERC-1155 contract for game weapons, armor, and consumable items with batch minting.",
    },
    {
      id: "chainlink-vrf-loot",
      text: "Integrate Chainlink VRF v2/v2.5 for provably fair loot box opening and trait generation.",
    },
    {
      id: "reward-emission",
      text: "Implement an ERC-20 reward token contract emitting tokens based on gameplay achievements.",
    },
    {
      id: "signed-score-submission",
      text: "Enforce anti-cheat score submission using ECDSA server signatures verified on-chain.",
    },
    {
      id: "item-marketplace",
      text: "Create an in-game marketplace contract supporting order listings, escrow, and ERC-2981 royalty payouts.",
    },
    {
      id: "hardhat-game-tests",
      text: "Write Hardhat unit tests covering VRF callbacks, score verification, and marketplace swaps.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "unity-web-bridge",
      text: "Provide a React frontend or JavaScript bridge module communicating web3 transactions to the game view.",
    },
    {
      id: "env-example",
      text: "Provide an .env.example file containing VRF subscription IDs, key hashes, and signers.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Document contract compilation, VRF setup, and local gameplay testing steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow compiles smart contracts and runs test suites.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "item-token-economics",
      name: "Game Asset Contracts & ERC-1155",
      weight: 20,
      layerId: "gamefi-developer-4",
      description:
        "Efficient batch minting, metadata item mappings, and token balance management.",
    },
    {
      id: "vrf-randomness",
      name: "Verifiable Randomness Mechanics",
      weight: 20,
      layerId: "gamefi-developer-5",
      description:
        "Correct Chainlink VRF request and fulfillment flow preventing front-running exploits.",
    },
    {
      id: "p2e-rewards",
      name: "Play-to-Earn & Reward Calculations",
      weight: 20,
      layerId: "gamefi-developer-6",
      description:
        "On-chain score verification, reward rate scaling, and withdrawal cooldowns.",
    },
    {
      id: "marketplace-trading",
      name: "On-Chain Item Marketplace",
      weight: 15,
      layerId: "gamefi-developer-7",
      description:
        "Escrow handling, order matching, fee deduction, and royalty distributions.",
    },
    {
      id: "anti-cheat-security",
      name: "Game Security & Anti-Cheat Guards",
      weight: 15,
      layerId: "gamefi-developer-9",
      description:
        "Protects against signature replay, replay attacks, reentrancy, and flash loan reward drains.",
    },
    {
      id: "web3-game-integration",
      name: "Game UI & Web3 Integration",
      weight: 10,
      layerId: "gamefi-developer-3",
      description:
        "Clean wallet interaction flow, asset inventory display, and transaction feedback.",
    },
  ],

  twistPool: [
    {
      id: "nft-hero-staking",
      text: "Implement an NFT hero staking vault where idle characters earn passive in-game currency.",
    },
    {
      id: "durability-crafting",
      text: "Add item durability degradation mechanics requiring players to burn ERC-20 tokens to repair items.",
    },
    {
      id: "commit-reveal-pvp",
      text: "Build a commit-reveal PvP battle engine preventing turn manipulation.",
    },
    {
      id: "layer2-bridge",
      text: "Add cross-chain bridge wrapper interfaces for bridging items between L1 and L2 networks.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
