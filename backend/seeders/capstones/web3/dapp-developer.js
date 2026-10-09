/**
 * Capstone brief — dapp-developer track (dapp-developer), v1.
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
    {
      id: "factory-contract",
      text: "Factory contract deploys and tracks individual campaign instances with ownership access control.",
    },
    {
      id: "campaign-logic",
      text: "Campaign contract handles contributions, milestone funding target checks, and state transitions (Active, Successful, Expired).",
    },
    {
      id: "withdraw-refund",
      text: "Only campaign creators can withdraw funds upon reaching goal; backers can withdraw refunds if goal is missed after deadline.",
    },
    {
      id: "events",
      text: "Contracts emit detailed events for contribution, withdrawal, refund, and campaign state change.",
    },
    {
      id: "hardhat-tests",
      text: "Hardhat unit tests cover campaign deployment, goal completion, refund flow, and failure reverts.",
      check: { type: "file", glob: "test/**/*.t.{js,ts}" },
    },
    {
      id: "deployment-script",
      text: "Deployment script deploys factory and test campaigns to local network or testnet.",
      check: { type: "file", glob: "scripts/**/*.{js,ts}" },
    },
    {
      id: "wallet-connect",
      text: "React frontend connects MetaMask via ethers.js provider and signer, displaying account address and balance.",
    },
    {
      id: "dapp-campaign-ui",
      text: "Frontend reads on-chain campaign status, allows ETH contributions, and handles transaction states with error messaging.",
    },
    {
      id: "readme",
      text: "README explains architecture, local test execution, and deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow compiles contracts and runs Hardhat tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Contract Mechanics & Correctness",
      weight: 25,
      layerId: "dapp-developer-2",
      description:
        "Enforces campaign deadlines, funding limits, state checks, and accurate ETH accounting.",
    },
    {
      id: "contract-testing",
      name: "Smart Contract Testing",
      weight: 20,
      layerId: "dapp-developer-6",
      description:
        "Comprehensive Mocha/Chai tests covering success, edge cases, time shifts, and revert scenarios.",
    },
    {
      id: "toolchain-deployment",
      name: "Toolchain & Deployment Scripts",
      weight: 15,
      layerId: "dapp-developer-3",
      description:
        "Clean Hardhat setup, automated deployment scripts, and testnet deployment scripts.",
    },
    {
      id: "web3-frontend",
      name: "Frontend & Web3 Integration",
      weight: 15,
      layerId: "dapp-developer-4",
      description:
        "Smooth MetaMask connection, readable account states, live data loading, and event updates.",
    },
    {
      id: "ux-error-handling",
      name: "Transaction UX & Error Handling",
      weight: 15,
      layerId: "dapp-developer-8",
      description:
        "Handles transaction lifecycles, user rejections, network changes, and gas errors cleanly.",
    },
    {
      id: "security-access",
      name: "Security & Access Control",
      weight: 10,
      layerId: "dapp-developer-9",
      description:
        "Protects against reentrancy, unauthorized withdrawals, and broken state changes.",
    },
  ],

  twistPool: [
    {
      id: "milestone-payouts",
      text: "Fund releases are split into 3 milestone releases. Backers must vote on-chain to approve each milestone payout before funds unlock.",
    },
    {
      id: "nft-backer-badges",
      text: "Mint a tiered ERC-721 backer NFT badge automatically to contributors depending on the level of ETH contributed.",
    },
    {
      id: "pausable-factory",
      text: "Add an emergency pause mechanism using OpenZeppelin Pausable where the protocol owner can halt new campaign creation.",
    },
    {
      id: "yield-vault",
      text: "Deposit pending campaign funds into a mock lending vault contract to earn interest while campaigns are active.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
