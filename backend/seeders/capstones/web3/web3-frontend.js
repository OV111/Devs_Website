/**
 * Capstone brief — web3-frontend track (web3-frontend), v1.
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
    {
      id: "rainbowkit-connect",
      text: "Integrate RainbowKit for wallet connection with customized chain choices and wallet modal controls.",
    },
    {
      id: "viem-client",
      text: "Configure viem public clients to perform low-level RPC calls, address formatting, and BigInt parsing.",
    },
    {
      id: "read-balances",
      text: "Fetch and display native ETH and batch ERC-20 balances using wagmi hooks with real-time UI formatting.",
    },
    {
      id: "write-transaction",
      text: "Implement token transfer and approval flows with transaction simulation, gas estimation, and pending receipt tracking.",
    },
    {
      id: "network-switcher",
      text: "Detect wrong networks and allow seamless chain switching using wagmi network hooks.",
    },
    {
      id: "siwe-auth",
      text: "Implement EIP-4361 Sign-In with Ethereum auth flow using message signing, nonces, and session verification.",
    },
    {
      id: "frontend-tests",
      text: "Include unit and component tests verifying hook states and wallet integration mocks.",
      check: CHECKS.jsTests,
    },
    {
      id: "env-config",
      text: "Store RPC endpoints and API credentials in environment variables with example setup.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Provide detailed instructions for running the application locally and running tests.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow builds the frontend and executes test scripts.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "wagmi-viem-arch",
      name: "viem & wagmi Integration Architecture",
      weight: 25,
      layerId: "web3-frontend-3",
      description:
        "Uses hooks correctly, manages BigInt safely, and structures wagmi config efficiently.",
    },
    {
      id: "data-fetching",
      name: "On-Chain Data Fetching & State",
      weight: 20,
      layerId: "web3-frontend-5",
      description:
        "Handles batch queries, cache freshness, event watching, and smooth data loading states.",
    },
    {
      id: "tx-management",
      name: "Transaction Flow & Feedback",
      weight: 15,
      layerId: "web3-frontend-6",
      description:
        "Simulates calls, gives transaction updates, and handles user cancellations or rejections.",
    },
    {
      id: "siwe-security",
      name: "SIWE Authentication",
      weight: 15,
      layerId: "web3-frontend-8",
      description:
        "Correct EIP-4361 formatting, challenge-response validation, and secure session state handling.",
    },
    {
      id: "testing-quality",
      name: "Frontend Testing & Code Quality",
      weight: 15,
      layerId: "web3-frontend-9",
      description:
        "Mocks blockchain hooks effectively in Vitest and tests user component workflows.",
    },
    {
      id: "multi-chain-ux",
      name: "Multi-Chain & Wallet UX",
      weight: 10,
      layerId: "web3-frontend-7",
      description:
        "Clear chain switching, customized RainbowKit styling, and wrong-network overlays.",
    },
  ],

  twistPool: [
    {
      id: "gasless-permit",
      text: "Implement ERC-2612 permit signing so users can sign an off-chain approval message instead of a standard approval transaction.",
    },
    {
      id: "event-stream-feed",
      text: "Add a live activity feed streaming real-time contract events via WebSocket event listeners.",
    },
    {
      id: "custom-theme-builder",
      text: "Provide an in-app theme toggle dynamically altering RainbowKit and UI dark/light design parameters.",
    },
    {
      id: "transaction-history-cache",
      text: "Persist transaction status and past user activity across page reloads using browser local storage.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
