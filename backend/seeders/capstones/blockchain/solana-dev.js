/**
 * Capstone brief — Solana Developer track (solana-dev), v1.
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
  trackId: "solana-dev",
  categoryId: "blockchain",
  slug: "solana-dev-community-treasury",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Solana community treasury program",
  summary:
    "Build an Anchor-based Solana program that manages a small community treasury. " +
    "Members can deposit SOL, propose spending requests and vote on them, while the " +
    "program enforces account ownership, signer requirements and treasury accounting. " +
    "Run the project locally and provide a client that demonstrates the complete lifecycle. " +
    "The capstone should make account relationships and PDA design visible in the code.",
  stack: ["Rust", "Solana", "Anchor", "TypeScript", "Solana web3.js"],

  requirements: [
    {
      id: "treasury-state",
      text: "The program initializes a treasury account that records its authority, membership configuration and total tracked deposits.",
    },
    {
      id: "membership",
      text: "Users can register as members through an instruction that creates and validates the member account associated with their wallet.",
    },
    {
      id: "deposit",
      text: "Members can deposit SOL into the treasury, and the program updates the member and treasury accounting consistently with the lamports actually transferred.",
    },
    {
      id: "proposal",
      text: "A registered member can create a spending proposal containing a recipient, amount and voting deadline, and invalid amounts or expired deadlines are rejected.",
    },
    {
      id: "voting",
      text: "Only registered members can vote once per proposal, and the program records enough state to prevent duplicate votes.",
    },
    {
      id: "execution",
      text: "A proposal can execute only after its documented approval condition is satisfied and its voting period has ended, with the treasury balance checked before transfer.",
    },
    {
      id: "pda-validation",
      text: "Program-derived accounts used for treasury, membership, proposals or votes are derived deterministically and validated by Anchor account constraints or equivalent explicit checks.",
    },
    {
      id: "client",
      text: "A TypeScript client can initialize the treasury and demonstrate member registration, deposit, proposal creation, voting and proposal execution against a local validator.",
    },
    {
      id: "tests",
      text: "Automated Anchor tests cover successful treasury flows, unauthorized instructions, duplicate voting, invalid amounts and failed execution conditions.",
      check: { type: "file", glob: "tests/**/*.ts" },
    },
    {
      id: "program",
      text: "The repository contains an Anchor program with Rust source implementing the treasury instructions.",
      check: { type: "file", glob: "programs/**/src/**/*.rs" },
    },
    {
      id: "readme",
      text: "README explains the account model, PDA seeds, local validator setup, program deployment, client usage and test commands.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs the required Rust, Solana and Anchor dependencies and runs the project's automated tests.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "accounts",
      name: "Solana account model",
      weight: 20,
      layerId: "solana-dev-1",
      description:
        "Program and data accounts, ownership, lamports and instruction account relationships are modeled correctly.",
    },
    {
      id: "rust",
      name: "Rust implementation",
      weight: 15,
      layerId: "solana-dev-2",
      description:
        "Rust types, ownership, borrowing and Result-based error handling are used clearly and correctly.",
    },
    {
      id: "program-design",
      name: "Program architecture",
      weight: 20,
      layerId: "solana-dev-3",
      description:
        "Instruction processing, account validation and state transitions are coherent and deterministic.",
    },
    {
      id: "anchor",
      name: "Anchor design",
      weight: 15,
      layerId: "solana-dev-4",
      description:
        "Anchor contexts, constraints, handlers and PDAs are used deliberately rather than bypassed with fragile manual assumptions.",
    },
    {
      id: "client",
      name: "Client integration",
      weight: 10,
      layerId: "solana-dev-6",
      description:
        "The client constructs, signs, sends and confirms transactions while correctly reading program state.",
    },
    {
      id: "security-testing",
      name: "Security & testing",
      weight: 20,
      layerId: "solana-dev-7",
      description:
        "Tests and implementation cover authorization, duplicate actions, invalid accounts and important failure paths.",
    },
  ],

  twistPool: [
    {
      id: "member-weight",
      text: "Give each member a fixed voting weight recorded at registration, and calculate proposal approval from total voting weight rather than raw member count.",
    },
    {
      id: "proposal-expiry",
      text: "Allow an unexecuted approved proposal to expire after a configurable execution window, after which it can no longer transfer treasury funds.",
    },
    {
      id: "recipient-approval",
      text: "Require the proposal recipient to explicitly accept a proposal before execution, and prevent execution when the recipient has rejected it.",
    },
    {
      id: "withdrawal-quota",
      text: "Members can withdraw their unused deposit at any time, but SOL they locked as a bond on their own open proposal stays locked until that proposal executes or expires; the program rejects any withdrawal that would dip into locked funds.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
