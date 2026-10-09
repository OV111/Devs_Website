/**
 * Capstone brief — wallet-developer track (wallet-developer), v1.
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
    {
      id: "key-derivation-storage",
      text: "Encrypted keystore generation and recovery phrase import using Web Crypto API in background workers.",
    },
    {
      id: "eip1193-provider",
      text: "Inject an EIP-1193 provider object into Web pages enabling eth_requestAccounts and wallet_switchEthereumChain.",
    },
    {
      id: "tx-construction",
      text: "Construct EIP-1559 Type 2 transactions with accurate gas fee calculations and nonce tracking.",
    },
    {
      id: "eip712-signing",
      text: "Implement EIP-712 typed message hashing and signing with user approval modal previews.",
    },
    {
      id: "walletconnect-v2",
      text: "Integrate WalletConnect v2 protocol client for dApp pairing and remote session approvals.",
    },
    {
      id: "phishing-simulation",
      text: "Implement a transaction pre-simulation check highlighting risk warnings and token allowance changes.",
    },
    {
      id: "unit-tests",
      text: "Comprehensive unit tests covering cryptography helpers, EIP-712 serialization, and provider RPC methods.",
      check: CHECKS.jsTests,
    },
    {
      id: "manifest-config",
      text: "Valid Web Extension Manifest V3 configuration separating background, content, and popup scripts.",
      check: { type: "file", glob: "**/manifest.json" },
    },
    {
      id: "readme",
      text: "Explain build commands, extension loading in developer mode, and security considerations.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow builds the extension bundle and runs test suites.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "key-crypto-security",
      name: "Key Management & Cryptography",
      weight: 25,
      layerId: "wallet-developer-3",
      description:
        "Secure Web Crypto API key storage, safe memory handling, and AES-GCM keystore encryption.",
    },
    {
      id: "eip1193-compliance",
      name: "EIP-1193 Injected Provider",
      weight: 20,
      layerId: "wallet-developer-2",
      description:
        "Correct provider events, standard JSON-RPC response formats, and account isolation.",
    },
    {
      id: "tx-signing-gas",
      name: "Transaction Construction & Gas",
      weight: 15,
      layerId: "wallet-developer-4",
      description:
        "Accurate EIP-1559 gas calculations, nonce synchronization, and balance checking.",
    },
    {
      id: "eip712-walletconnect",
      name: "EIP-712 & WalletConnect Protocol",
      weight: 15,
      layerId: "wallet-developer-6",
      description:
        "Structured typed data parsing, domain hashing, and reliable WalletConnect v2 pairing.",
    },
    {
      id: "phishing-security",
      name: "Security Warnings & Phishing Prevention",
      weight: 15,
      layerId: "wallet-developer-8",
      description:
        "Transaction simulation alerts, unhandled RPC errors, and address poisoning checks.",
    },
    {
      id: "multi-chain-architecture",
      name: "Multi-Chain Architecture & Testing",
      weight: 10,
      layerId: "wallet-developer-9",
      description:
        "Smooth EVM chain switching, provider context updates, and automated extension test mocks.",
    },
  ],

  twistPool: [
    {
      id: "erc4337-paymaster",
      text: "Add ERC-4337 Account Abstraction UserOperation creation with gas sponsorship via paymaster RPC.",
    },
    {
      id: "hardware-wallet-hid",
      text: "Add WebHID hardware wallet signing integration for Ledger devices.",
    },
    {
      id: "contact-address-book",
      text: "Provide an address book feature with ENS name resolution and checksum verification.",
    },
    {
      id: "custom-rpc-health",
      text: "Build a dynamic RPC node rotator that automatically switches endpoints when latencies spike.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
