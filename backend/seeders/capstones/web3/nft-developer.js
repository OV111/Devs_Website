/**
 * Capstone brief — nft-developer track (nft-developer), v1.
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
  trackId: "nft-developer",
  categoryId: "web3",
  slug: "nft-developer-generative-collection",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Generative On-Chain NFT Collection & Minting dApp",
  summary:
    "Build a full-stack NFT minting collection featuring on-chain SVG generation, allowlist Merkle proof verification, " +
    "ERC-2981 royalty standards, and an interactive React minting gallery connected to IPFS metadata.",
  stack: ["Solidity", "Hardhat", "React", "wagmi", "IPFS", "OpenZeppelin"],

  requirements: [
    {
      id: "erc721-contract",
      text: "Implement an ERC-721 contract with max supply limits, per-wallet minting caps, and owner withdrawal logic.",
    },
    {
      id: "merkle-allowlist",
      text: "Integrate Merkle tree root verification for gated presale minting phases.",
    },
    {
      id: "erc2981-royalties",
      text: "Implement the ERC-2981 NFT Royalty Standard specifying royalty basis points and recipient address.",
    },
    {
      id: "onchain-svg",
      text: "Generate SVG artwork strings and Base64 encoded metadata JSON entirely on-chain in Solidity.",
    },
    {
      id: "erc1155-edition",
      text: "Deploy a companion ERC-1155 multi-token contract for batch-minting promotional items or passes.",
    },
    {
      id: "hardhat-tests",
      text: "Hardhat test suite verifies Merkle proof checks, supply cap enforcement, and royalty queries.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "ipfs-metadata",
      text: "Store off-chain fallback assets on IPFS and configure tokenURI pointing to IPFS gateways.",
    },
    {
      id: "react-mint-app",
      text: "Build a React frontend connecting via wagmi to display collection stats, Merkle proof status, and minting UI.",
    },
    {
      id: "readme",
      text: "Include instructions for contract compilation, test runner execution, and IPFS setup.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow runs linter and Hardhat tests on every commit.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "nft-contract-logic",
      name: "ERC Standards & Contract Mechanics",
      weight: 25,
      layerId: "nft-developer-2",
      description:
        "Enforces supply caps, token approvals, mint phases, and owner withdrawal functionality.",
    },
    {
      id: "allowlist-minting",
      name: "Allowlist & Mint Mechanics",
      weight: 20,
      layerId: "nft-developer-4",
      description:
        "Secure Merkle proof verification preventing double-mints and wallet cap bypasses.",
    },
    {
      id: "onchain-generative",
      name: "On-Chain SVG & Metadata",
      weight: 15,
      layerId: "nft-developer-7",
      description:
        "Clean Base64 encoding and dynamic SVG generation directly within smart contract execution.",
    },
    {
      id: "royalties-standards",
      name: "Royalties & Standards Compliance",
      weight: 15,
      layerId: "nft-developer-6",
      description:
        "Proper implementation of ERC-2981 interfaces and marketplace compatibility.",
    },
    {
      id: "nft-testing-security",
      name: "Contract Testing & Security",
      weight: 15,
      layerId: "nft-developer-9",
      description:
        "Tests cover reentrancy guards during safe transfers, Merkle claims, and supply bounds.",
    },
    {
      id: "dapp-integration",
      name: "Frontend Minting Experience",
      weight: 10,
      layerId: "nft-developer-8",
      description:
        "Smooth Web3 wallet interaction, proof generation on client side, and live collection updates.",
    },
  ],

  twistPool: [
    {
      id: "chainlink-vrf-traits",
      text: "Integrate Chainlink VRF to randomize metadata trait assignments at the moment of token minting.",
    },
    {
      id: "delayed-reveal",
      text: "Implement a delayed reveal mechanism where unrevealed placeholder metadata is updated by the owner after sellout.",
    },
    {
      id: "stake-for-rewards",
      text: "Build an NFT staking contract where holders lock their NFTs to accumulate soft-utility ERC-20 tokens.",
    },
    {
      id: "opensea-operator-filter",
      text: "Integrate OpenSea Operator Filter Registry to restrict transfers on zero-royalty marketplaces.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
