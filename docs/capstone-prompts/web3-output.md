/**
 * Capstone brief — Web3 Data / Indexer track (web3-indexer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "web3-indexer",
  categoryId: "web3",
  slug: "web3-indexer-defi-analytics-subgraph",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "DeFi Protocol Analytics Subgraph & Indexer",
  summary:
    "Build a production-grade custom GraphQL indexer using The Graph (AssemblyScript) or Ponder (TypeScript) to index decentralized exchange " +
    "swaps, liquidity mints, burns, and protocol volume metrics.",
  stack: ["TypeScript", "AssemblyScript", "The Graph", "GraphQL", "Ponder"],

  requirements: [
    { id: "subgraph-manifest-config", text: "Configure subgraph.yaml or Ponder config specifying contract addresses, ABIs, and start blocks.", check: { type: "file", glob: "{subgraph.yaml,ponder.config.ts}" } },
    { id: "graphql-schema", text: "Define robust GraphQL schema entities tracking accounts, pools, swap transactions, and historical volume aggregates." },
    { id: "event-handlers", text: "Implement AssemblyScript or TypeScript event handlers processing Transfer, Swap, Mint, and Burn events." },
    { id: "derived-relations", text: "Establish entity relationships using @derivedFrom or relational foreign keys for cross-entity queries." },
    { id: "matchstick-tests", text: "Write unit tests using Matchstick framework verifying event mapping logic and entity store updates.", check: { type: "file", glob: "tests/**/*.test.ts" } },
    { id: "query-pagination", text: "Support advanced GraphQL querying with pagination (first, skip), sorting (orderBy), and filtering (where)." },
    { id: "env-example", text: "Provide an .env.example file containing RPC provider keys and deployment credentials.", check: CHECKS.envExample },
    { id: "readme", text: "Document local graph node setup, code generation, schema migration, and GraphQL query examples.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow executes code generation, build compilation, and indexer unit tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "schema-entity-design", name: "GraphQL Schema & Entity Design", weight: 25, layerId: "web3-indexer-2", description: "Clean entity relationships, correct use of BigInt and Bytes types, and optimized index fields." },
    { id: "event-mapping-logic", name: "Event Handlers & Indexing Logic", weight: 25, layerId: "web3-indexer-3", description: "Accurate AssemblyScript/TypeScript event parsing, state updates, and store load/save operations." },
    { id: "advanced-indexing-patterns", name: "Advanced Indexing Patterns", weight: 15, layerId: "web3-indexer-4", description: "Proper use of call handlers, block aggregations, or dynamic data source templates." },
    { id: "matchstick-testing", name: "Indexer Testing & Matchstick", weight: 15, layerId: "web3-indexer-9", description: "Comprehensive unit tests verifying event mapping correctness and assertion coverage." },
    { id: "graphql-query-performance", name: "GraphQL Querying & Optimization", weight: 10, layerId: "web3-indexer-6", description: "Efficient filtering, sorting, pagination, and query complexity handling." },
    { id: "deployment-operability", name: "Deployment & Operability", weight: 10, layerId: "web3-indexer-10", description: "Clear manifest setup, environment configuration, and clean deployment scripts." },
  ],

  twistPool: [
    { id: "ponder-typescript-migration", text: "Implement the indexer using Ponder (TypeScript-native indexing) instead of AssemblyScript." },
    { id: "multi-chain-aggregation", text: "Configure multi-chain data indexing combining events from both Ethereum mainnet and an L2 network." },
    { id: "realtime-websocket-subscriptions", text: "Enable GraphQL WebSocket subscriptions for live real-time updates on high-value swaps." },
    { id: "time-series-bucket-aggregation", text: "Aggregate swap data into hourly and daily financial snapshot entities for charting." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — ZK Developer track (zk-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "zk-developer",
  categoryId: "web3",
  slug: "zk-developer-private-voting-credential",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Private Voting Credential System with ZK Proofs",
  summary:
    "Build a zero-knowledge private voting application using Circom circuits, snarkjs proof generation, and Solidity verifier contracts. " +
    "Voters prove membership in an authorized group via Merkle trees and submit anonymous votes using nullifiers to prevent double-voting.",
  stack: ["Circom", "snarkjs", "Solidity", "Hardhat", "TypeScript"],

  requirements: [
    { id: "circom-membership-circuit", text: "Design a Circom arithmetic circuit verifying Merkle tree membership and nullifier uniqueness without revealing identity." },
    { id: "trusted-setup-artifacts", text: "Execute Powers of Tau ceremony and circuit-specific phase 2 setup to generate proving and verification keys." },
    { id: "solidity-verifier", text: "Deploy the auto-generated Groth16 Verifier contract and integrate proof verification logic." },
    { id: "nullifier-double-spend", text: "Enforce nullifier tracking in the smart contract to prevent double-voting and ensure anonymity." },
    { id: "snarkjs-proof-generation", text: "Implement client-side proof generation scripts using snarkjs and JavaScript helper functions." },
    { id: "circuit-unit-tests", text: "Write circuit unit tests using snarkjs and Chai verifying constraints and edge cases.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "circuit-source-file", text: "Include Circom source files structured correctly in the project repository.", check: { type: "file", glob: "circuits/**/*.circom" } },
    { id: "env-example", text: "Provide an .env.example configuration file for environment variables.", check: CHECKS.envExample },
    { id: "readme", text: "Document circuit constraints, trusted setup steps, and verification workflow.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow compiles circuits and runs test suites.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "circuit-design-constraints", name: "Circom Circuit Design & Constraints", weight: 25, layerId: "zk-developer-2", description: "Accurate constraint definition, proper use of <== and ===, and avoidance of under-constrained signals." },
    { id: "snarkjs-setup-proofs", name: "snarkjs Setup & Proof Generation", weight: 20, layerId: "zk-developer-3", description: "Correct handling of trusted setup artifacts, witness calculation, and Groth16 proof generation." },
    { id: "solidity-verification", name: "On-Chain Proof Verification", weight: 20, layerId: "zk-developer-4", description: "Flawless integration of Verifier.sol, public input validation, and nullifier tracking." },
    { id: "identity-nullifiers", name: "Zero-Knowledge Identity & Nullifiers", weight: 15, layerId: "zk-developer-6", description: "Secure Semaphore-style commitment schemes preventing double-spending and privacy leaks." },
    { id: "circuit-security-tests", name: "Circuit Security & Testing", weight: 10, layerId: "zk-developer-9", description: "Thorough testing of invalid proofs, malformed public inputs, and boundary conditions." },
    { id: "documentation-operability", name: "Documentation & Operability", weight: 10, layerId: "zk-developer-10", description: "Clear instructions for compiling circuits, running ceremony scripts, and deploying contracts." },
  ],

  twistPool: [
    { id: "noir-language-port", text: "Rewrite the membership verification circuit using Noir and Nargo instead of Circom." },
    { id: "incremental-merkle-tree", text: "Implement an on-chain Incremental Merkle Tree supporting dynamic user registrations." },
    { id: "zk-age-verification", text: "Add a ZK circuit proving a user's age exceeds a threshold based on a hashed birthdate without revealing the date." },
    { id: "batched-proof-verifier", text: "Implement a batch proof verifier smart contract aggregating multiple vote proofs into a single gas-optimized verification call." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — DAO Developer track (dao-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
    { id: "erc20-votes", text: "Implement an ERC-20 governance token with historical voting checkpoints and self-delegation." },
    { id: "oz-governor", text: "Deploy an OpenZeppelin Governor contract configuring voting delay, voting period, and quorum fractions." },
    { id: "timelock-controller", text: "Integrate TimelockController to enforce execution delays on successful governance proposals." },
    { id: "dao-treasury", text: "Build a treasury contract owned exclusively by the TimelockController for asset management." },
    { id: "snapshot-integration", text: "Configure off-chain voting support with EIP-712 signed messages and Snapshot strategy verification." },
    { id: "hardhat-tests", text: "Hardhat test suite verifies proposal lifecycles, vote weight checkpoints, and execution delays.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "frontend-governance-ui", text: "Build a React frontend allowing users to delegate votes, create proposals, and cast ballots." },
    { id: "env-example", text: "Include an .env.example file specifying deployment keys and RPC endpoints.", check: CHECKS.envExample },
    { id: "readme", text: "Document governance parameters, testing instructions, and proposal deployment steps.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow executes contract compilation and Hardhat test runs.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "governance-token-mechanics", name: "ERC-20Votes & Delegation", weight: 25, layerId: "dao-developer-2", description: "Accurate checkpointing, historical voting power queries, and delegation mechanics." },
    { id: "governor-timelock-arch", name: "Governor & Timelock Architecture", weight: 25, layerId: "dao-developer-3", description: "Correct proposal lifecycle states (Pending, Active, Succeeded, Queued, Executed) and delay enforcement." },
    { id: "treasury-security", name: "DAO Treasury & Access Control", weight: 15, layerId: "dao-developer-5", description: "Secures treasury funds behind governance control and prevents unauthorized withdrawals." },
    { id: "offchain-snapshot", name: "Off-Chain Voting & Signatures", weight: 15, layerId: "dao-developer-4", description: "Proper EIP-712 typed data hashing and signature verification for off-chain voting strategies." },
    { id: "dao-testing", name: "Governance Testing & Edge Cases", weight: 10, layerId: "dao-developer-9", description: "Tests cover flash loan governance attacks, quorum manipulation, and execution failures." },
    { id: "frontend-ux", name: "Governance Frontend UX", weight: 10, layerId: "dao-developer-7", description: "Clear proposal displays, intuitive voting power indicators, and smooth transaction feedback." },
  ],

  twistPool: [
    { id: "quadratic-voting", text: "Implement a quadratic voting calculation module where voting cost scales with the square of votes cast." },
    { id: "emergency-veto-guardian", text: "Add an emergency veto guardian role capable of canceling malicious proposals during the timelock window." },
    { id: "multisig-treasury-fallback", text: "Require a Gnosis Safe multi-sig secondary sign-off for treasury disbursements exceeding specific thresholds." },
    { id: "streamed-salaries", text: "Deploy a continuous token streaming contract allowing the DAO to fund contributors block-by-block." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — GameFi Developer track (gamefi-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
    { id: "erc1155-game-items", text: "Build an ERC-1155 contract for game weapons, armor, and consumable items with batch minting." },
    { id: "chainlink-vrf-loot", text: "Integrate Chainlink VRF v2/v2.5 for provably fair loot box opening and trait generation." },
    { id: "reward-emission", text: "Implement an ERC-20 reward token contract emitting tokens based on gameplay achievements." },
    { id: "signed-score-submission", text: "Enforce anti-cheat score submission using ECDSA server signatures verified on-chain." },
    { id: "item-marketplace", text: "Create an in-game marketplace contract supporting order listings, escrow, and ERC-2981 royalty payouts." },
    { id: "hardhat-game-tests", text: "Write Hardhat unit tests covering VRF callbacks, score verification, and marketplace swaps.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "unity-web-bridge", text: "Provide a React frontend or JavaScript bridge module communicating web3 transactions to the game view." },
    { id: "env-example", text: "Provide an .env.example file containing VRF subscription IDs, key hashes, and signers.", check: CHECKS.envExample },
    { id: "readme", text: "Document contract compilation, VRF setup, and local gameplay testing steps.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow compiles smart contracts and runs test suites.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "item-token-economics", name: "Game Asset Contracts & ERC-1155", weight: 20, layerId: "gamefi-developer-4", description: "Efficient batch minting, metadata item mappings, and token balance management." },
    { id: "vrf-randomness", name: "Verifiable Randomness Mechanics", weight: 20, layerId: "gamefi-developer-5", description: "Correct Chainlink VRF request and fulfillment flow preventing front-running exploits." },
    { id: "p2e-rewards", name: "Play-to-Earn & Reward Calculations", weight: 20, layerId: "gamefi-developer-6", description: "On-chain score verification, reward rate scaling, and withdrawal cooldowns." },
    { id: "marketplace-trading", name: "On-Chain Item Marketplace", weight: 15, layerId: "gamefi-developer-7", description: "Escrow handling, order matching, fee deduction, and royalty distributions." },
    { id: "anti-cheat-security", name: "Game Security & Anti-Cheat Guards", weight: 15, layerId: "gamefi-developer-9", description: "Protects against signature replay, replay attacks, reentrancy, and flash loan reward drains." },
    { id: "web3-game-integration", name: "Game UI & Web3 Integration", weight: 10, layerId: "gamefi-developer-3", description: "Clean wallet interaction flow, asset inventory display, and transaction feedback." },
  ],

  twistPool: [
    { id: "nft-hero-staking", text: "Implement an NFT hero staking vault where idle characters earn passive in-game currency." },
    { id: "durability-crafting", text: "Add item durability degradation mechanics requiring players to burn ERC-20 tokens to repair items." },
    { id: "commit-reveal-pvp", text: "Build a commit-reveal PvP battle engine preventing turn manipulation." },
    { id: "layer2-bridge", text: "Add cross-chain bridge wrapper interfaces for bridging items between L1 and L2 networks." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Wallet Developer track (wallet-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "wallet-developer",
  categoryId: "web3",
  slug: "wallet-developer-browser-extension-wallet",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Non-Custodial Web3 Browser Extension Wallet",
  summary:
    "Build a non-custodial EVM browser extension wallet that implements EIP-1193, secure key storage, EIP-712 message signing, " +
    "EIP-1559 transaction construction, and WalletConnect v2 session pairing.",
  stack: ["TypeScript", "ethers.js", "EIP-1193", "EIP-712", "WalletConnect"],

  requirements: [
    { id: "key-derivation-storage", text: "Encrypted keystore generation and recovery phrase import using Web Crypto API in background workers." },
    { id: "eip1193-provider", text: "Inject an EIP-1193 provider object into Web pages enabling eth_requestAccounts and wallet_switchEthereumChain." },
    { id: "tx-construction", text: "Construct EIP-1559 Type 2 transactions with accurate gas fee calculations and nonce tracking." },
    { id: "eip712-signing", text: "Implement EIP-712 typed message hashing and signing with user approval modal previews." },
    { id: "walletconnect-v2", text: "Integrate WalletConnect v2 protocol client for dApp pairing and remote session approvals." },
    { id: "phishing-simulation", text: "Implement a transaction pre-simulation check highlighting risk warnings and token allowance changes." },
    { id: "unit-tests", text: "Comprehensive unit tests covering cryptography helpers, EIP-712 serialization, and provider RPC methods.", check: CHECKS.jsTests },
    { id: "manifest-config", text: "Valid Web Extension Manifest V3 configuration separating background, content, and popup scripts.", check: { type: "file", glob: "**/manifest.json" } },
    { id: "readme", text: "Explain build commands, extension loading in developer mode, and security considerations.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow builds the extension bundle and runs test suites.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "key-crypto-security", name: "Key Management & Cryptography", weight: 25, layerId: "wallet-developer-3", description: "Secure Web Crypto API key storage, safe memory handling, and AES-GCM keystore encryption." },
    { id: "eip1193-compliance", name: "EIP-1193 Injected Provider", weight: 20, layerId: "wallet-developer-2", description: "Correct provider events, standard JSON-RPC response formats, and account isolation." },
    { id: "tx-signing-gas", name: "Transaction Construction & Gas", weight: 15, layerId: "wallet-developer-4", description: "Accurate EIP-1559 gas calculations, nonce synchronization, and balance checking." },
    { id: "eip712-walletconnect", name: "EIP-712 & WalletConnect Protocol", weight: 15, layerId: "wallet-developer-6", description: "Structured typed data parsing, domain hashing, and reliable WalletConnect v2 pairing." },
    { id: "phishing-security", name: "Security Warnings & Phishing Prevention", weight: 15, layerId: "wallet-developer-8", description: "Transaction simulation alerts, unhandled RPC errors, and address poisoning checks." },
    { id: "multi-chain-architecture", name: "Multi-Chain Architecture & Testing", weight: 10, layerId: "wallet-developer-9", description: "Smooth EVM chain switching, provider context updates, and automated extension test mocks." },
  ],

  twistPool: [
    { id: "erc4337-paymaster", text: "Add ERC-4337 Account Abstraction UserOperation creation with gas sponsorship via paymaster RPC." },
    { id: "hardware-wallet-hid", text: "Add WebHID hardware wallet signing integration for Ledger devices." },
    { id: "contact-address-book", text: "Provide an address book feature with ENS name resolution and checksum verification." },
    { id: "custom-rpc-health", text: "Build a dynamic RPC node rotator that automatically switches endpoints when latencies spike." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Web3 Full Stack track (web3-fullstack), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["Solidity", "Next.js", "The Graph", "wagmi", "RainbowKit", "Iron Session"],

  requirements: [
    { id: "marketplace-contract", text: "Build a marketplace contract supporting token listings, buy offers, cancellations, and escrow transfers." },
    { id: "subgraph-manifest", text: "Create a complete Subgraph indexer tracking listing events, sales, and user profile entities.", check: { type: "file", glob: "subgraph/subgraph.yaml" } },
    { id: "nextjs-frontend", text: "Build a Next.js App Router application integrating RainbowKit for wallet connectivity and listing navigation.", check: { type: "file", glob: "**/page.{js,jsx,ts,tsx}" } },
    { id: "graphql-query-client", text: "Query indexed marketplace data from the frontend using Apollo Client with filtering and pagination." },
    { id: "siwe-iron-session", text: "Implement user authentication via Sign-In with Ethereum (SIWE) and Iron Session cookie management." },
    { id: "ipfs-storage", text: "Upload user profile photos and listing descriptions to IPFS using Pinata API routes." },
    { id: "hardhat-contract-tests", text: "Write unit tests for marketplace contract functions, fee splits, and custom errors.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "env-example", text: "Include an .env.example file specifying RPC URLs, Subgraph endpoints, and session secrets.", check: CHECKS.envExample },
    { id: "readme", text: "Document local chain execution, subgraph deployment, and Next.js development setup.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow executes contract tests and verifies Next.js application build.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "contract-architecture", name: "Smart Contract Architecture", weight: 20, layerId: "web3-fullstack-2", description: "Gas-efficient event emission, OpenZeppelin access controls, and custom error handling." },
    { id: "subgraph-indexing", name: "Subgraph & GraphQL Indexing", weight: 20, layerId: "web3-fullstack-5", description: "Accurate AssemblyScript event mapping, clean GraphQL schema entity design, and relations." },
    { id: "frontend-web3-stack", name: "Next.js & Web3 UX", weight: 20, layerId: "web3-fullstack-4", description: "Proper server/client component splits, RainbowKit integration, and real-time transaction updates." },
    { id: "graphql-integration", name: "GraphQL Queries & Performance", weight: 15, layerId: "web3-fullstack-6", description: "Efficient data pagination, field filtering, and optimized Apollo Client caching." },
    { id: "auth-session-security", name: "SIWE Authentication & Security", weight: 15, layerId: "web3-fullstack-8", description: "Secure SIWE challenge verification, protected API endpoints, and encrypted session cookies." },
    { id: "testing-deploy-ops", name: "Testing & Full-Stack Deployment", weight: 10, layerId: "web3-fullstack-9", description: "Comprehensive contract tests, local indexing pipeline, and clean CI workflow setup." },
  ],

  twistPool: [
    { id: "auction-house-bidding", text: "Add English auction bidding functionality with automated highest bid escrow and extension timers." },
    { id: "arweave-permanent-storage", text: "Integrate Arweave via Bundlr for permanent metadata storage instead of IPFS." },
    { id: "push-notifications", text: "Add real-time wallet notification toasts when an item listed by the user is purchased." },
    { id: "multi-currency-support", text: "Allow listings and payouts in both native ETH and custom ERC-20 payment tokens." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — NFT Developer track (nft-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
    { id: "erc721-contract", text: "Implement an ERC-721 contract with max supply limits, per-wallet minting caps, and owner withdrawal logic." },
    { id: "merkle-allowlist", text: "Integrate Merkle tree root verification for gated presale minting phases." },
    { id: "erc2981-royalties", text: "Implement the ERC-2981 NFT Royalty Standard specifying royalty basis points and recipient address." },
    { id: "onchain-svg", text: "Generate SVG artwork strings and Base64 encoded metadata JSON entirely on-chain in Solidity." },
    { id: "erc1155-edition", text: "Deploy a companion ERC-1155 multi-token contract for batch-minting promotional items or passes." },
    { id: "hardhat-tests", text: "Hardhat test suite verifies Merkle proof checks, supply cap enforcement, and royalty queries.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "ipfs-metadata", text: "Store off-chain fallback assets on IPFS and configure tokenURI pointing to IPFS gateways." },
    { id: "react-mint-app", text: "Build a React frontend connecting via wagmi to display collection stats, Merkle proof status, and minting UI." },
    { id: "readme", text: "Include instructions for contract compilation, test runner execution, and IPFS setup.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow runs linter and Hardhat tests on every commit.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "nft-contract-logic", name: "ERC Standards & Contract Mechanics", weight: 25, layerId: "nft-developer-2", description: "Enforces supply caps, token approvals, mint phases, and owner withdrawal functionality." },
    { id: "allowlist-minting", name: "Allowlist & Mint Mechanics", weight: 20, layerId: "nft-developer-4", description: "Secure Merkle proof verification preventing double-mints and wallet cap bypasses." },
    { id: "onchain-generative", name: "On-Chain SVG & Metadata", weight: 15, layerId: "nft-developer-7", description: "Clean Base64 encoding and dynamic SVG generation directly within smart contract execution." },
    { id: "royalties-standards", name: "Royalties & Standards Compliance", weight: 15, layerId: "nft-developer-6", description: "Proper implementation of ERC-2981 interfaces and marketplace compatibility." },
    { id: "nft-testing-security", name: "Contract Testing & Security", weight: 15, layerId: "nft-developer-9", description: "Tests cover reentrancy guards during safe transfers, Merkle claims, and supply bounds." },
    { id: "dapp-integration", name: "Frontend Minting Experience", weight: 10, layerId: "nft-developer-8", description: "Smooth Web3 wallet interaction, proof generation on client side, and live collection updates." },
  ],

  twistPool: [
    { id: "chainlink-vrf-traits", text: "Integrate Chainlink VRF to randomize metadata trait assignments at the moment of token minting." },
    { id: "delayed-reveal", text: "Implement a delayed reveal mechanism where unrevealed placeholder metadata is updated by the owner after sellout." },
    { id: "stake-for-rewards", text: "Build an NFT staking contract where holders lock their NFTs to accumulate soft-utility ERC-20 tokens." },
    { id: "opensea-operator-filter", text: "Integrate OpenSea Operator Filter Registry to restrict transfers on zero-royalty marketplaces." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — DeFi Developer track (defi-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
    { id: "amm-pair-math", text: "Implement constant-product x*y=k exchange math, swap fees, and slippage protections." },
    { id: "lp-tokens", text: "Mint LP tokens proportionally on liquidity deposit and burn them on liquidity withdrawal." },
    { id: "chainlink-oracle", text: "Integrate Chainlink AggregatorV3 price feeds with staleness and validation checks." },
    { id: "erc4626-vault", text: "Build an ERC-4626 compliant yield vault to auto-compound rewards and issue shares." },
    { id: "flash-loan-provider", text: "Implement a flash loan function adhering to callback interface patterns with fee enforcement." },
    { id: "foundry-unit-tests", text: "Provide comprehensive Foundry unit tests asserting mathematical correctness and state changes.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "foundry-fuzz-tests", text: "Implement invariant and fuzz testing in Foundry to verify constant-product invariants under randomized inputs.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "foundry-config", text: "Configure foundry.toml for optimizer settings and remappings.", check: { type: "file", glob: "foundry.toml" } },
    { id: "readme", text: "Document project installation, forge test instructions, and mathematical specs in README.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow executes forge test and forge fmt checks.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "amm-math-correctness", name: "AMM Math & Token Mechanics", weight: 25, layerId: "defi-developer-4", description: "Accurate implementation of x*y=k curves, fee deductions, and proportional LP shares." },
    { id: "foundry-testing", name: "Foundry Testing & Fuzzing", weight: 20, layerId: "defi-developer-3", description: "Extensive test coverage utilizing forge fuzz runs, invariant tests, and edge case assertions." },
    { id: "oracle-integration", name: "Price Oracle Safety", weight: 15, layerId: "defi-developer-5", description: "Proper integration of Chainlink price feeds, handling staleness, round IDs, and zero-price protection." },
    { id: "vault-standard", name: "ERC-4626 Yield Vault Implementation", weight: 15, layerId: "defi-developer-8", description: "Adheres strictly to the ERC-4626 tokenized vault standard for share pricing and transfers." },
    { id: "flash-loan-logic", name: "Flash Loan Execution", weight: 15, layerId: "defi-developer-7", description: "Clean callback execution, balance verification, and protection against unauthorized callbacks." },
    { id: "security-patterns", name: "DeFi Security & Guards", weight: 10, layerId: "defi-developer-9", description: "Uses checks-effects-interactions, reentrancy guards, and SafeERC20 operations." },
  ],

  twistPool: [
    { id: "twap-oracle", text: "Incorporate an on-chain Time-Weighted Average Price (TWAP) calculation module into the AMM pair." },
    { id: "liquidation-bot-helper", text: "Build a helper smart contract that executes atomic arbitrage flash swaps when price discrepancies occur." },
    { id: "dynamic-fee-tier", text: "Adjust swap fees dynamically based on recent block volatility metrics." },
    { id: "timelock-admin", text: "Add an OpenZeppelin TimelockController to govern protocol parameter updates and fee collection." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Web3 Frontend track (web3-frontend), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "web3-frontend",
  categoryId: "web3",
  slug: "web3-frontend-token-dashboard",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Chain Portfolio & Token Swap Dashboard",
  summary:
    "Build a Web3 frontend application using viem, wagmi, and RainbowKit. " +
    "The dashboard lets users connect their wallet, inspect multi-chain ERC-20 balances, execute simulated token swaps, and authenticate via Sign-In with Ethereum (SIWE).",
  stack: ["React", "Vite", "viem", "wagmi", "RainbowKit", "TypeScript"],

  requirements: [
    { id: "rainbowkit-connect", text: "Integrate RainbowKit for wallet connection with customized chain choices and wallet modal controls." },
    { id: "viem-client", text: "Configure viem public clients to perform low-level RPC calls, address formatting, and BigInt parsing." },
    { id: "read-balances", text: "Fetch and display native ETH and batch ERC-20 balances using wagmi hooks with real-time UI formatting." },
    { id: "write-transaction", text: "Implement token transfer and approval flows with transaction simulation, gas estimation, and pending receipt tracking." },
    { id: "network-switcher", text: "Detect wrong networks and allow seamless chain switching using wagmi network hooks." },
    { id: "siwe-auth", text: "Implement EIP-4361 Sign-In with Ethereum auth flow using message signing, nonces, and session verification." },
    { id: "frontend-tests", text: "Include unit and component tests verifying hook states and wallet integration mocks.", check: CHECKS.jsTests },
    { id: "env-config", text: "Store RPC endpoints and API credentials in environment variables with example setup.", check: CHECKS.envExample },
    { id: "readme", text: "Provide detailed instructions for running the application locally and running tests.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow builds the frontend and executes test scripts.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "wagmi-viem-arch", name: "viem & wagmi Integration Architecture", weight: 25, layerId: "web3-frontend-3", description: "Uses hooks correctly, manages BigInt safely, and structures wagmi config efficiently." },
    { id: "data-fetching", name: "On-Chain Data Fetching & State", weight: 20, layerId: "web3-frontend-5", description: "Handles batch queries, cache freshness, event watching, and smooth data loading states." },
    { id: "tx-management", name: "Transaction Flow & Feedback", weight: 15, layerId: "web3-frontend-6", description: "Simulates calls, gives transaction updates, and handles user cancellations or rejections." },
    { id: "siwe-security", name: "SIWE Authentication", weight: 15, layerId: "web3-frontend-8", description: "Correct EIP-4361 formatting, challenge-response validation, and secure session state handling." },
    { id: "testing-quality", name: "Frontend Testing & Code Quality", weight: 15, layerId: "web3-frontend-9", description: "Mocks blockchain hooks effectively in Vitest and tests user component workflows." },
    { id: "multi-chain-ux", name: "Multi-Chain & Wallet UX", weight: 10, layerId: "web3-frontend-7", description: "Clear chain switching, customized RainbowKit styling, and wrong-network overlays." },
  ],

  twistPool: [
    { id: "gasless-permit", text: "Implement ERC-2612 permit signing so users can sign an off-chain approval message instead of a standard approval transaction." },
    { id: "event-stream-feed", text: "Add a live activity feed streaming real-time contract events via WebSocket event listeners." },
    { id: "custom-theme-builder", text: "Provide an in-app theme toggle dynamically altering RainbowKit and UI dark/light design parameters." },
    { id: "transaction-history-cache", text: "Persist transaction status and past user activity across page reloads using browser local storage." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — dApp Developer track (dapp-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "dapp-developer",
  categoryId: "web3",
  slug: "dapp-developer-crowdfunding-dapp",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Decentralized Crowdfunding Platform with On-Chain Vaults",
  summary:
    "Build a production-grade decentralized crowdfunding platform consisting of audited smart contracts and a React dApp interface. " +
    "Campaign creators set goals and deadlines, backers fund projects with ETH, and successful campaigns unlock funds safely while failed ones allow instant refunds.",
  stack: ["Solidity", "Hardhat", "React", "ethers.js", "MetaMask"],

  requirements: [
    { id: "factory-contract", text: "Factory contract deploys and tracks individual campaign instances with ownership access control." },
    { id: "campaign-logic", text: "Campaign contract handles contributions, milestone funding target checks, and state transitions (Active, Successful, Expired)." },
    { id: "withdraw-refund", text: "Only campaign creators can withdraw funds upon reaching goal; backers can withdraw refunds if goal is missed after deadline." },
    { id: "events", text: "Contracts emit detailed events for contribution, withdrawal, refund, and campaign state change." },
    { id: "hardhat-tests", text: "Hardhat unit tests cover campaign deployment, goal completion, refund flow, and failure reverts.", check: { type: "file", glob: "test/**/*.t.{js,ts}" } },
    { id: "deployment-script", text: "Deployment script deploys factory and test campaigns to local network or testnet.", check: { type: "file", glob: "scripts/**/*.{js,ts}" } },
    { id: "wallet-connect", text: "React frontend connects MetaMask via ethers.js provider and signer, displaying account address and balance." },
    { id: "dapp-campaign-ui", text: "Frontend reads on-chain campaign status, allows ETH contributions, and handles transaction states with error messaging." },
    { id: "readme", text: "README explains architecture, local test execution, and deployment steps.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow compiles contracts and runs Hardhat tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Contract Mechanics & Correctness", weight: 25, layerId: "dapp-developer-2", description: "Enforces campaign deadlines, funding limits, state checks, and accurate ETH accounting." },
    { id: "contract-testing", name: "Smart Contract Testing", weight: 20, layerId: "dapp-developer-6", description: "Comprehensive Mocha/Chai tests covering success, edge cases, time shifts, and revert scenarios." },
    { id: "toolchain-deployment", name: "Toolchain & Deployment Scripts", weight: 15, layerId: "dapp-developer-3", description: "Clean Hardhat setup, automated deployment scripts, and testnet deployment scripts." },
    { id: "web3-frontend", name: "Frontend & Web3 Integration", weight: 15, layerId: "dapp-developer-4", description: "Smooth MetaMask connection, readable account states, live data loading, and event updates." },
    { id: "ux-error-handling", name: "Transaction UX & Error Handling", weight: 15, layerId: "dapp-developer-8", description: "Handles transaction lifecycles, user rejections, network changes, and gas errors cleanly." },
    { id: "security-access", name: "Security & Access Control", weight: 10, layerId: "dapp-developer-9", description: "Protects against reentrancy, unauthorized withdrawals, and broken state changes." },
  ],

  twistPool: [
    { id: "milestone-payouts", text: "Fund releases are split into 3 milestone releases. Backers must vote on-chain to approve each milestone payout before funds unlock." },
    { id: "nft-backer-badges", text: "Mint a tiered ERC-721 backer NFT badge automatically to contributors depending on the level of ETH contributed." },
    { id: "pausable-factory", text: "Add an emergency pause mechanism using OpenZeppelin Pausable where the protocol owner can halt new campaign creation." },
    { id: "yield-vault", text: "Deposit pending campaign funds into a mock lending vault contract to earn interest while campaigns are active." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};