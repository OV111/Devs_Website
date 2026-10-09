/**
 * Capstone brief — web3-fullstack track (web3-fullstack), v1.
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
  trackId: "web3-fullstack",
  categoryId: "web3",
  slug: "web3-fullstack-marketplace-subgraph",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Full-Stack NFT Marketplace with Subgraph Indexer",
  summary:
    "Build an end-to-end decentralized application combining Solidity smart contracts, a custom GraphQL Subgraph indexer on The Graph, " +
    "and a Next.js App Router frontend with RainbowKit and SIWE authentication.",
  stack: [
    "Solidity",
    "Next.js",
    "The Graph",
    "wagmi",
    "RainbowKit",
    "Iron Session",
  ],

  requirements: [
    {
      id: "marketplace-contract",
      text: "Build a marketplace contract supporting token listings, buy offers, cancellations, and escrow transfers.",
    },
    {
      id: "subgraph-manifest",
      text: "Create a complete Subgraph indexer tracking listing events, sales, and user profile entities.",
      check: { type: "file", glob: "subgraph/subgraph.yaml" },
    },
    {
      id: "nextjs-frontend",
      text: "Build a Next.js App Router application integrating RainbowKit for wallet connectivity and listing navigation.",
      check: { type: "file", glob: "**/page.{js,jsx,ts,tsx}" },
    },
    {
      id: "graphql-query-client",
      text: "Query indexed marketplace data from the frontend using Apollo Client with filtering and pagination.",
    },
    {
      id: "siwe-iron-session",
      text: "Implement user authentication via Sign-In with Ethereum (SIWE) and Iron Session cookie management.",
    },
    {
      id: "ipfs-storage",
      text: "Upload user profile photos and listing descriptions to IPFS using Pinata API routes.",
    },
    {
      id: "hardhat-contract-tests",
      text: "Write unit tests for marketplace contract functions, fee splits, and custom errors.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "env-example",
      text: "Include an .env.example file specifying RPC URLs, Subgraph endpoints, and session secrets.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Document local chain execution, subgraph deployment, and Next.js development setup.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes contract tests and verifies Next.js application build.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "contract-architecture",
      name: "Smart Contract Architecture",
      weight: 20,
      layerId: "web3-fullstack-2",
      description:
        "Gas-efficient event emission, OpenZeppelin access controls, and custom error handling.",
    },
    {
      id: "subgraph-indexing",
      name: "Subgraph & GraphQL Indexing",
      weight: 20,
      layerId: "web3-fullstack-5",
      description:
        "Accurate AssemblyScript event mapping, clean GraphQL schema entity design, and relations.",
    },
    {
      id: "frontend-web3-stack",
      name: "Next.js & Web3 UX",
      weight: 20,
      layerId: "web3-fullstack-4",
      description:
        "Proper server/client component splits, RainbowKit integration, and real-time transaction updates.",
    },
    {
      id: "graphql-integration",
      name: "GraphQL Queries & Performance",
      weight: 15,
      layerId: "web3-fullstack-6",
      description:
        "Efficient data pagination, field filtering, and optimized Apollo Client caching.",
    },
    {
      id: "auth-session-security",
      name: "SIWE Authentication & Security",
      weight: 15,
      layerId: "web3-fullstack-8",
      description:
        "Secure SIWE challenge verification, protected API endpoints, and encrypted session cookies.",
    },
    {
      id: "testing-deploy-ops",
      name: "Testing & Full-Stack Deployment",
      weight: 10,
      layerId: "web3-fullstack-9",
      description:
        "Comprehensive contract tests, local indexing pipeline, and clean CI workflow setup.",
    },
  ],

  twistPool: [
    {
      id: "auction-house-bidding",
      text: "Add English auction bidding functionality with automated highest bid escrow and extension timers.",
    },
    {
      id: "arweave-permanent-storage",
      text: "Integrate Arweave via Bundlr for permanent metadata storage instead of IPFS.",
    },
    {
      id: "push-notifications",
      text: "Add real-time wallet notification toasts when an item listed by the user is purchased.",
    },
    {
      id: "multi-currency-support",
      text: "Allow listings and payouts in both native ETH and custom ERC-20 payment tokens.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
