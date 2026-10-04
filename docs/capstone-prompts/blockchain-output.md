/**
 * Capstone brief — Smart Contract Dev track (smart-contract), v1.
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
  trackId: "smart-contract",
  categoryId: "blockchain",
  slug: "smart-contract-testnet-escrow",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a trust-minimized milestone escrow",
  summary:
    "Build a Solidity escrow protocol for milestone-based payments where funds are " +
    "locked until predefined milestones are approved or a dispute path resolves them. " +
    "Deploy and test it locally with Foundry. The contract must make its trust assumptions " +
    "explicit and enforce authorization, accounting and withdrawal rules on-chain.",
  stack: ["Solidity", "Foundry", "OpenZeppelin", "Anvil"],

  requirements: [
    { id: "escrow-creation", text: "A payer can create an escrow with a recipient, total amount, milestone amounts and a deadline, and the contract rejects invalid milestone totals." },
    { id: "milestone-state", text: "Each milestone has an explicit lifecycle state, and state transitions are enforced so a milestone cannot be approved, disputed or released twice." },
    { id: "funding", text: "The payer can fund an escrow with native testnet ETH, and the contract rejects underfunded or overfunded escrow states according to the documented funding rules." },
    { id: "authorization", text: "Only the payer and recipient can perform the actions assigned to them, and no third party can release escrow funds by calling a privileged function." },
    { id: "withdrawals", text: "Released milestone funds can be withdrawn exactly once by the entitled recipient, while undistributed funds remain accounted for by the contract." },
    { id: "disputes", text: "A dispute mechanism exists for an active milestone and resolves through an explicitly defined on-chain rule that determines who receives the disputed amount." },
    { id: "events", text: "Creation, funding, milestone transitions, disputes and withdrawals emit events containing enough indexed data for an off-chain client to reconstruct escrow activity." },
    { id: "tests", text: "Foundry tests cover successful flows, unauthorized calls, invalid state transitions, incorrect payment amounts and withdrawal edge cases.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "readme", text: "README explains the escrow state machine, trust assumptions, setup, local deployment and commands for running the test suite.", check: { type: "file", glob: "README.md" } },
    { id: "toolchain", text: "The repository contains a reproducible Foundry project configuration that can compile the contracts with forge build.", check: { type: "file", glob: "foundry.toml" } },
    { id: "ci", text: "A CI workflow installs the required toolchain and runs the project's contract tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "solidity-correctness", name: "Contract correctness", weight: 25, layerId: "smart-contract-1", description: "State variables, functions and value handling correctly implement the escrow lifecycle and accounting rules." },
    { id: "data-model", name: "Data model & state transitions", weight: 15, layerId: "smart-contract-2", description: "Structs, enums, mappings and lifecycle transitions form a coherent model without contradictory or unreachable states." },
    { id: "foundry-workflow", name: "Foundry development", weight: 10, layerId: "smart-contract-3", description: "The project has a reproducible Foundry layout, compiles cleanly and is straightforward to run locally." },
    { id: "openzeppelin", name: "Contract composition", weight: 10, layerId: "smart-contract-4", description: "OpenZeppelin components are used appropriately where they solve a real contract concern rather than being added superficially." },
    { id: "testing", name: "Testing & failure cases", weight: 20, layerId: "smart-contract-5", description: "Tests demonstrate expected behaviour, reverts, events and adversarial authorization/state-transition cases." },
    { id: "security-gas", name: "Security & EVM efficiency", weight: 20, layerId: "smart-contract-8", description: "The implementation avoids obvious reentrancy and accounting hazards and makes sensible choices around storage, calldata, errors and loops." },
  ],

  twistPool: [
    { id: "deadline-refund", text: "If a milestone remains unresolved after its deadline, the payer can reclaim only that unresolved milestone's funds, while already released milestones remain final." },
    { id: "partial-approval", text: "The recipient can request a partial milestone release, but the released amount must never exceed the milestone's remaining balance and the remainder must stay claimable under the documented rules." },
    { id: "arbiter-role", text: "Each escrow may optionally name an independent arbiter who can resolve a disputed milestone, but the arbiter must have no authority over undisputed milestones or unrelated escrows." },
    { id: "cancellation", text: "Before any milestone is released, the payer and recipient can mutually cancel the escrow, after which all remaining funds become withdrawable according to the documented cancellation split." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Ethereum Developer track (ethereum-dev), v1.
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
  trackId: "ethereum-dev",
  categoryId: "blockchain",
  slug: "ethereum-dev-event-indexer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build an Ethereum event indexer and wallet activity API",
  summary:
    "Build a small Ethereum application that watches a deployed contract and turns its " +
    "events into queryable wallet activity. The project must combine an ethers.js client, " +
    "a local Ethereum node, deterministic event processing and a useful API or CLI. " +
    "The important part is not displaying transactions — it is correctly understanding " +
    "how Ethereum state, logs, ABI encoding and confirmations fit together.",
  stack: ["Node.js", "TypeScript", "ethers.js", "Hardhat", "SQLite or PostgreSQL"],

  requirements: [
    { id: "local-chain", text: "The project runs against a local Ethereum development network and deploys a contract that emits the events consumed by the application.", check: { type: "file", glob: "hardhat.config.{js,ts}" } },
    { id: "contract-events", text: "The contract exposes at least three meaningful events for deposits, withdrawals and account activity, with indexed fields chosen intentionally for filtering." },
    { id: "provider-client", text: "The application uses an ethers.js provider for reads and a signer for transactions, with network configuration kept outside business logic." },
    { id: "event-indexing", text: "The indexer discovers contract events from a configurable block range and stores enough block number, transaction hash and log information to identify each event uniquely." },
    { id: "confirmations", text: "Indexed events have a documented confirmation policy, and the application does not treat an event as finalized until the configured confirmation depth has been reached." },
    { id: "queries", text: "Users can query indexed activity by wallet address and retrieve paginated results ordered by block position and log index." },
    { id: "reprocessing", text: "The indexer can safely process the same block range more than once without creating duplicate activity records." },
    { id: "wallet-state", text: "The application can read the deployed contract's relevant state for a wallet and reconcile it against indexed activity." },
    { id: "tests", text: "Automated tests cover contract interactions and the indexer's event processing, including duplicate processing and an empty-result case.", check: { type: "file", glob: "test/**/*.{js,ts}" } },
    { id: "readme", text: "README explains local chain setup, contract deployment, environment variables if used, indexing commands, query commands and test execution.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs dependencies, builds the project and runs the automated tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "ethereum-model", name: "Ethereum & EVM understanding", weight: 15, layerId: "ethereum-dev-1", description: "The implementation correctly handles accounts, transactions, blocks, confirmations and contract state rather than treating the chain as a generic database." },
    { id: "solidity", name: "Smart contract design", weight: 15, layerId: "ethereum-dev-2", description: "The supporting Solidity contract uses appropriate types, visibility, events and access rules." },
    { id: "ethers", name: "ethers.js integration", weight: 20, layerId: "ethereum-dev-3", description: "Providers, signers, contract calls, transactions and event listeners are used correctly with clear separation between reads and writes." },
    { id: "indexing", name: "Event indexing & data integrity", weight: 20, layerId: "ethereum-dev-7", description: "Events are decoded and persisted correctly, duplicates are prevented and indexed data remains traceable to on-chain evidence." },
    { id: "security", name: "Wallet & transaction safety", weight: 15, layerId: "ethereum-dev-8", description: "Signing, addresses, transaction handling and configuration avoid unsafe assumptions or accidental exposure of private credentials." },
    { id: "testing-ops", name: "Testing & operability", weight: 15, layerId: "ethereum-dev-9", description: "Tests exercise integration behaviour and the repository provides a reproducible workflow suitable for CI and local development." },
  ],

  twistPool: [
    { id: "historical-backfill", text: "Add a backfill command that indexes all relevant events from deployment block to the current chain head in bounded block batches without exceeding the configured batch size." },
    { id: "live-watcher", text: "Add a live watcher that detects newly mined events and updates the index without requiring the user to restart the process." },
    { id: "reorg-recovery", text: "Add a local-chain reorganization simulation or equivalent recovery mechanism so the indexer can remove or invalidate events from blocks that are no longer part of the canonical chain." },
    { id: "abi-versioning", text: "Support two deployed contract versions with different event ABIs and route each event through the correct decoder based on the configured contract address and version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
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
    { id: "treasury-state", text: "The program initializes a treasury account that records its authority, membership configuration and total tracked deposits." },
    { id: "membership", text: "Users can register as members through an instruction that creates and validates the member account associated with their wallet." },
    { id: "deposit", text: "Members can deposit SOL into the treasury, and the program updates the member and treasury accounting consistently with the lamports actually transferred." },
    { id: "proposal", text: "A registered member can create a spending proposal containing a recipient, amount and voting deadline, and invalid amounts or expired deadlines are rejected." },
    { id: "voting", text: "Only registered members can vote once per proposal, and the program records enough state to prevent duplicate votes." },
    { id: "execution", text: "A proposal can execute only after its documented approval condition is satisfied and its voting period has ended, with the treasury balance checked before transfer." },
    { id: "pda-validation", text: "Program-derived accounts used for treasury, membership, proposals or votes are derived deterministically and validated by Anchor account constraints or equivalent explicit checks." },
    { id: "client", text: "A TypeScript client can initialize the treasury and demonstrate member registration, deposit, proposal creation, voting and proposal execution against a local validator." },
    { id: "tests", text: "Automated Anchor tests cover successful treasury flows, unauthorized instructions, duplicate voting, invalid amounts and failed execution conditions.", check: { type: "file", glob: "tests/**/*.ts" } },
    { id: "program", text: "The repository contains an Anchor program with Rust source implementing the treasury instructions.", check: { type: "file", glob: "programs/**/src/**/*.rs" } },
    { id: "readme", text: "README explains the account model, PDA seeds, local validator setup, program deployment, client usage and test commands.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs the required Rust, Solana and Anchor dependencies and runs the project's automated tests.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "accounts", name: "Solana account model", weight: 20, layerId: "solana-dev-1", description: "Program and data accounts, ownership, lamports and instruction account relationships are modeled correctly." },
    { id: "rust", name: "Rust implementation", weight: 15, layerId: "solana-dev-2", description: "Rust types, ownership, borrowing and Result-based error handling are used clearly and correctly." },
    { id: "program-design", name: "Program architecture", weight: 20, layerId: "solana-dev-3", description: "Instruction processing, account validation and state transitions are coherent and deterministic." },
    { id: "anchor", name: "Anchor design", weight: 15, layerId: "solana-dev-4", description: "Anchor contexts, constraints, handlers and PDAs are used deliberately rather than bypassed with fragile manual assumptions." },
    { id: "client", name: "Client integration", weight: 10, layerId: "solana-dev-6", description: "The client constructs, signs, sends and confirms transactions while correctly reading program state." },
    { id: "security-testing", name: "Security & testing", weight: 20, layerId: "solana-dev-7", description: "Tests and implementation cover authorization, duplicate actions, invalid accounts and important failure paths." },
  ],

  twistPool: [
    { id: "member-weight", text: "Give each member a fixed voting weight recorded at registration, and calculate proposal approval from total voting weight rather than raw member count." },
    { id: "proposal-expiry", text: "Allow an unexecuted approved proposal to expire after a configurable execution window, after which it can no longer transfer treasury funds." },
    { id: "recipient-approval", text: "Require the proposal recipient to explicitly accept a proposal before execution, and prevent execution when the recipient has rejected it." },
    { id: "withdrawal-quota", text: "Allow members to withdraw their deposited SOL only when they have no outstanding proposal obligations, enforcing the documented withdrawal accounting entirely through program state." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Blockchain Core Dev track (blockchain-core), v1.
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
  trackId: "blockchain-core",
  categoryId: "blockchain",
  slug: "blockchain-core-payment-chain",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a minimal peer-to-peer blockchain",
  summary:
    "Build a small educational blockchain node in Rust that accepts transactions, " +
    "mines or validates blocks, persists chain state and communicates with peers. " +
    "The implementation should expose the core mechanics rather than hide them behind " +
    "a blockchain framework: hashing, transaction encoding, block validation, networking " +
    "and deterministic state updates must be visible and testable.",
  stack: ["Rust", "Tokio", "Serde", "SHA-256"],

  requirements: [
    { id: "transactions", text: "The node defines a deterministic transaction format with sender, recipient, amount and nonce fields and rejects malformed or invalid transactions before they enter the transaction pool." },
    { id: "blocks", text: "Each block contains a deterministic header with a parent hash, timestamp, block height and transaction commitment, and the block hash is derived from its encoded contents." },
    { id: "genesis", text: "The node creates a deterministic genesis block and rejects chains whose genesis block or parent relationships do not match the configured chain identity." },
    { id: "validation", text: "A received block is validated for parent linkage, height, transaction validity and block hash before it can become part of the local canonical chain." },
    { id: "state", text: "The node maintains deterministic account balances and nonces and applies valid transactions in block order without allowing negative balances or nonce reuse." },
    { id: "mempool", text: "The transaction pool accepts valid transactions, rejects duplicate or stale nonces and removes transactions after they are included in an accepted block." },
    { id: "p2p", text: "Nodes can discover or connect to configured peers and exchange serialized blocks and transactions over asynchronous network connections.", check: { type: "file", glob: "src/**/*.rs" } },
    { id: "persistence", text: "The node persists enough blockchain state to restart without losing the canonical chain and account state.", check: { type: "file", glob: "src/**/*.rs" } },
    { id: "tests", text: "Automated Rust tests cover transaction validation, deterministic hashing, block validation, state transitions and at least one peer-to-peer message flow.", check: { type: "file", glob: "tests/**/*.rs" } },
    { id: "cargo", text: "The repository contains a reproducible Rust project configuration with its dependencies and package metadata.", check: { type: "file", glob: "Cargo.toml" } },
    { id: "readme", text: "README explains the protocol rules, message format, local node setup, how to run multiple nodes and how to execute the tests.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the Rust project and runs its automated tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "protocol-model", name: "Blockchain protocol model", weight: 20, layerId: "blockchain-core-1", description: "Hashes, cryptographic identities, deterministic encoding and distributed-system assumptions are represented correctly." },
    { id: "chain", name: "Blockchain implementation", weight: 20, layerId: "blockchain-core-2", description: "Blocks, headers, transaction encoding, genesis handling and hash chaining form a coherent validated chain." },
    { id: "rust", name: "Rust systems implementation", weight: 15, layerId: "blockchain-core-3", description: "Ownership, lifetimes, traits, errors and asynchronous execution are used appropriately for a systems project." },
    { id: "networking", name: "Peer-to-peer networking", weight: 15, layerId: "blockchain-core-4", description: "Peer connections and serialized protocol messages are handled reliably without coupling networking to consensus logic." },
    { id: "state", name: "State & execution", weight: 15, layerId: "blockchain-core-7", description: "Transaction execution and persisted state are deterministic, validated and recoverable across restarts." },
    { id: "testing", name: "Testing & resilience", weight: 15, layerId: "blockchain-core-9", description: "Tests exercise malformed data, invalid transitions and network failures rather than only the happy path." },
  ],

  twistPool: [
    { id: "proof-of-work", text: "Add a configurable proof-of-work rule requiring block hashes to satisfy a target difficulty, and make block validation enforce that rule for received blocks." },
    { id: "fork-choice", text: "Support temporary competing branches and implement a deterministic fork-choice rule that selects the canonical chain while rebuilding account state when the canonical branch changes." },
    { id: "peer-gossip", text: "Add duplicate-safe gossip for transactions and blocks so a message received from one peer can propagate to other peers without creating forwarding loops." },
    { id: "snapshot-recovery", text: "Add a state snapshot export and import mechanism that verifies the snapshot's chain height and commitment before restoring account state." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Blockchain Security track (blockchain-security), v1.
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
  trackId: "blockchain-security",
  categoryId: "blockchain",
  slug: "blockchain-security-vault-audit",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Audit and harden a vulnerable token vault",
  summary:
    "Build a small intentionally vulnerable Solidity token vault, then perform a structured " +
    "security review and harden it. Your repository must preserve the vulnerable version as " +
    "an auditable baseline, demonstrate exploit tests against the flaws you identify, and " +
    "provide a fixed implementation with tests proving the fixes. The goal is to show that " +
    "you can move from threat model to concrete finding to reproducible exploit to remediation.",
  stack: ["Solidity", "Foundry", "OpenZeppelin", "Slither"],

  requirements: [
    { id: "threat-model", text: "The repository documents the vault's assets, privileged roles, trust assumptions, external dependencies and security invariants before the code review." },
    { id: "vulnerable-baseline", text: "A separate baseline implementation intentionally contains at least three documented security flaws spanning different vulnerability classes." },
    { id: "findings", text: "A security report identifies each baseline flaw with affected code, attack preconditions, concrete impact, reproduction steps and a remediation approach.", check: { type: "file", glob: "docs/**/*.md" } },
    { id: "exploit-tests", text: "Foundry tests reproduce each documented vulnerability against the baseline contract and demonstrate the security-relevant state change or loss.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "hardened-vault", text: "The hardened implementation prevents the documented attacks using explicit authorization, accounting, external-call and oracle assumptions appropriate to the chosen design." },
    { id: "regression-tests", text: "The hardened implementation has regression tests proving that each previously exploitable path now fails or produces the intended safe result.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "static-analysis", text: "The repository includes a reproducible Slither analysis configuration or documented command and records how relevant findings were triaged.", check: { type: "file", glob: "slither.config.json" } },
    { id: "manual-review", text: "The review covers cross-function interactions and explicitly checks at least one invariant that cannot be established by a single-function inspection." },
    { id: "tests", text: "The final automated suite covers both normal vault behaviour and adversarial cases including unauthorized access, malformed inputs and repeated calls.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "readme", text: "README explains how to build the contracts, run exploit and regression tests, run static analysis and understand the baseline versus hardened implementations.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the contracts and runs the automated security tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "threat-model", name: "Threat modeling", weight: 15, layerId: "blockchain-security-1", description: "Assets, trust boundaries, attacker capabilities and security invariants are concrete and connected to the implementation." },
    { id: "solidity-internals", name: "Solidity internals", weight: 15, layerId: "blockchain-security-2", description: "The review demonstrates accurate reasoning about storage, calldata, selectors, delegatecall and integer behaviour where relevant." },
    { id: "vulnerability-analysis", name: "Vulnerability analysis", weight: 20, layerId: "blockchain-security-3", description: "Findings identify realistic exploit paths and distinguish root causes from symptoms." },
    { id: "static-analysis", name: "Static analysis", weight: 10, layerId: "blockchain-security-4", description: "Slither results are reproduced, relevant findings are interpreted and false positives are distinguished from actionable issues." },
    { id: "fuzzing-testing", name: "Fuzzing & security testing", weight: 20, layerId: "blockchain-security-5", description: "Exploit and regression tests meaningfully exercise security properties and do not merely assert successful deployment." },
    { id: "reporting", name: "Manual review & reporting", weight: 20, layerId: "blockchain-security-6", description: "The engagement is organized around explicit invariants and the final report communicates evidence, impact and remediation precisely." },
  ],

  twistPool: [
    { id: "oracle-path", text: "Add a mock price oracle to the baseline vault and demonstrate an oracle-manipulation attack, then harden the price-dependent operation with a documented freshness and validation rule." },
    { id: "upgrade-path", text: "Make the baseline vault upgradeable and include a delegatecall or storage-layout flaw in the review, then harden the upgrade mechanism with explicit authority and storage compatibility checks." },
    { id: "flash-loan-path", text: "Add a mock flash-loan provider and a price-dependent vault operation that is exploitable within one transaction, then add a regression test and mitigation that addresses the attack's actual mechanism." },
    { id: "formal-property", text: "Specify one critical vault invariant in a machine-checkable form and use a bounded or symbolic verification tool to demonstrate that the hardened implementation satisfies it for the configured verification scope." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Chain Architect track (chain-architect), v1.
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
  trackId: "chain-architect",
  categoryId: "blockchain",
  slug: "chain-architect-local-appchain",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Design and prototype an application-specific chain",
  summary:
    "Build a small application-specific blockchain prototype and document the architecture " +
    "as if you were preparing it for a production team. The prototype should implement a " +
    "custom Cosmos SDK module or equivalent framework-based chain component, define validator " +
    "and governance parameters, expose queries and demonstrate how the chain would handle " +
    "upgrades and cross-chain communication. Focus on architectural boundaries and operational " +
    "trade-offs rather than building a generic token.",
  stack: ["Go", "Cosmos SDK", "CometBFT", "Protocol Buffers", "gRPC"],

  requirements: [
    { id: "chain-purpose", text: "The project defines a concrete application-specific use case and documents why a dedicated chain is used instead of deploying the same logic as a contract on an existing chain." },
    { id: "module", text: "The chain contains a custom Cosmos SDK module with its own state, message types, message handlers and keeper logic.", check: { type: "file", glob: "x/**/module.go" } },
    { id: "state", text: "The module persists deterministic application state and exposes a query path for reading that state.", check: { type: "file", glob: "proto/**/*.proto" } },
    { id: "messages", text: "At least two transaction messages mutate module state, and handlers validate authorization and input before committing state changes." },
    { id: "queries", text: "The module exposes gRPC query definitions and handlers for retrieving individual and collection-level application state.", check: { type: "file", glob: "proto/**/*.proto" } },
    { id: "consensus", text: "The architecture documents validator voting power, block finality and the role of CometBFT in the application chain." },
    { id: "governance", text: "The chain defines at least two governance-controlled parameters and documents how a valid parameter change propagates into runtime behaviour." },
    { id: "upgrade", text: "The repository documents and prototypes a versioned upgrade path that changes module or chain behaviour without silently corrupting existing state." },
    { id: "tests", text: "Go tests cover module state transitions, message validation and query behaviour, including at least one unauthorized or invalid request.", check: { type: "file", glob: "**/*_test.go" } },
    { id: "go-module", text: "The repository contains a reproducible Go module definition and dependency configuration.", check: { type: "file", glob: "go.mod" } },
    { id: "readme", text: "README explains how to build and run the chain locally, execute transactions and queries, run tests and inspect the custom module." , check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the Go project and runs its tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "architecture", name: "Application-chain architecture", weight: 20, layerId: "chain-architect-1", description: "The chain's purpose, sovereignty model and framework choices are coherent and technically justified." },
    { id: "consensus", name: "Consensus architecture", weight: 15, layerId: "chain-architect-2", description: "Validator voting power, BFT finality and consensus/application boundaries are represented accurately." },
    { id: "cosmos-module", name: "Cosmos SDK module", weight: 25, layerId: "chain-architect-3", description: "Module state, keepers, messages, handlers and queries follow the framework's runtime model correctly." },
    { id: "token-governance", name: "Token & governance design", weight: 10, layerId: "chain-architect-5", description: "Governance-controlled parameters and validator economics are explicit and internally consistent." },
    { id: "cross-chain", name: "Cross-chain architecture", weight: 10, layerId: "chain-architect-6", description: "The proposed cross-chain boundary correctly identifies packets, channels, proofs and trust assumptions." },
    { id: "operations", name: "Operations & upgrades", weight: 20, layerId: "chain-architect-10", description: "The upgrade path, local deployment, testing and operational documentation show how the chain could be maintained safely." },
  ],

  twistPool: [
    { id: "ibc-module", text: "Add an IBC-facing message flow that sends an application packet to a connected test chain or a deterministic mock, and document the channel, packet and acknowledgement lifecycle." },
    { id: "staking-parameter", text: "Add a chain parameter controlling validator eligibility or minimum stake, and implement a governance-driven parameter update with tests proving the new value affects validator admission logic." },
    { id: "fee-market", text: "Add a configurable transaction fee policy to the application module, including parameter validation and tests proving insufficient-fee messages are rejected." },
    { id: "state-migration", text: "Implement a concrete state migration from module version one to version two, including a test that initializes version-one state and verifies the migrated representation and preserved values." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Bitcoin Developer track (bitcoin-dev), v1.
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
  trackId: "bitcoin-dev",
  categoryId: "blockchain",
  slug: "bitcoin-dev-psbt-vault",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Bitcoin PSBT multisignature vault",
  summary:
    "Build a Bitcoin application that creates and coordinates a small multisignature " +
    "vault using PSBTs on Bitcoin Signet or regtest only. The application must construct " +
    "transactions from UTXOs, estimate fees, produce and combine PSBTs, verify signatures " +
    "and broadcast only after the required approvals are present. No real funds are required " +
    "or permitted; the project should make Bitcoin's UTXO and transaction model explicit.",
  stack: ["Bitcoin Core", "JavaScript", "bitcoinjs-lib", "PSBT", "regtest or Signet"],

  requirements: [
    { id: "utxo-selection", text: "The application discovers spendable UTXOs and selects inputs for a requested payment while tracking each input's outpoint, value and required spending data." },
    { id: "psbt-creation", text: "The application creates a PSBT containing selected inputs, destination outputs and a change output when required, without silently dropping value." },
    { id: "fees", text: "Fee calculation is explicit and the application rejects transactions whose selected inputs cannot cover outputs plus the configured fee." },
    { id: "multisig", text: "The vault requires the configured number of distinct signer approvals before a transaction can be finalized." },
    { id: "signatures", text: "The application verifies that signatures correspond to the intended PSBT transaction and expected signer keys before finalization." },
    { id: "combine", text: "Separate signer PSBTs can be combined into one transaction proposal without losing valid partial signatures or changing the transaction being approved." },
    { id: "broadcast", text: "The application broadcasts a transaction only after required signatures are present and the final transaction passes the application's validation checks." },
    { id: "rpc", text: "The project integrates with Bitcoin Core RPC for wallet or chain queries and transaction submission against regtest or Signet only." },
    { id: "tests", text: "Automated tests cover UTXO selection, fee calculation, PSBT combination, insufficient signatures and successful finalization.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts}" } },
    { id: "readme", text: "README explains Bitcoin network selection, Bitcoin Core setup, vault configuration, PSBT workflow, testing and how to run the application locally.", check: { type: "file", glob: "README.md" } },
    { id: "env", text: "RPC credentials and other local configuration are supplied through environment variables and an example configuration file is provided.", check: { type: "file", glob: ".env.example" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs the automated tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "bitcoin-model", name: "Bitcoin fundamentals", weight: 20, layerId: "bitcoin-dev-1", description: "The application correctly reasons about UTXOs, inputs, outputs, confirmations, keys and network-specific addresses." },
    { id: "wallet-keys", name: "Keys & wallet handling", weight: 15, layerId: "bitcoin-dev-2", description: "Key material and wallet-derived information are handled correctly and the vault's signer model is explicit." },
    { id: "script", name: "Bitcoin Script", weight: 15, layerId: "bitcoin-dev-3", description: "The chosen spending policy and script/address assumptions are correctly reflected in transaction construction and validation." },
    { id: "psbt", name: "Transactions & PSBT", weight: 25, layerId: "bitcoin-dev-4", description: "PSBT creation, fee calculation, signing, combination and finalization preserve the exact transaction intent." },
    { id: "core-rpc", name: "Bitcoin Core integration", weight: 10, layerId: "bitcoin-dev-5", description: "RPC interaction is reliable, network-aware and appropriately separated from transaction-building logic." },
    { id: "security", name: "Production security concepts", weight: 15, layerId: "bitcoin-dev-10", description: "The vault documents key custody, backup, recovery and broadcast safety boundaries and avoids exposing signing secrets." },
  ],

  twistPool: [
    { id: "timelocked-recovery", text: "Add a recovery transaction path that becomes valid only after a configured relative or absolute timelock, and test that it cannot be spent before the lock condition." },
    { id: "coin-control", text: "Add manual coin-control support that lets an operator select specific UTXOs while enforcing that the resulting transaction still satisfies fee, output and change accounting." },
    { id: "taproot-vault", text: "Implement the vault using a Taproot output with a documented key-path or script-path spending policy and demonstrate the selected spending path on regtest." },
    { id: "descriptor-policy", text: "Represent the vault's spending policy with a Bitcoin Core descriptor and verify that discovered UTXOs correspond to the configured descriptor before they can be selected." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Cosmos Developer track (cosmos-dev), v1.
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
  trackId: "cosmos-dev",
  categoryId: "blockchain",
  slug: "cosmos-dev-community-grants",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Cosmos community grants chain",
  summary:
    "Build a small Cosmos SDK application chain for community grants. Accounts can submit " +
    "grant proposals, members can vote, and approved grants can be funded from a module-owned " +
    "pool. Implement the core state and message flow in Go, expose gRPC queries and run the " +
    "chain locally. The project should demonstrate Cosmos SDK architecture rather than simply " +
    "wrapping an existing chain API.",
  stack: ["Go", "Cosmos SDK", "CometBFT", "Protocol Buffers", "gRPC"],

  requirements: [
    { id: "grant-module", text: "The chain contains a custom grants module with persistent state, a keeper and message handlers for creating proposals, voting and executing approved grants." },
    { id: "proposal-state", text: "Each proposal records its proposer, recipient, requested amount, voting state and enough metadata to enforce its lifecycle." },
    { id: "voting", text: "Only eligible accounts can vote, each eligible account can vote once per proposal, and voting results are calculated deterministically." },
    { id: "funding", text: "The module tracks a grant funding pool and rejects execution when the approved grant cannot be funded by the available module balance." },
    { id: "authorization", text: "Message handlers validate the signer against the action being performed and reject unauthorized state changes." },
    { id: "queries", text: "The module exposes gRPC queries for an individual proposal and a paginated collection of proposals.", check: { type: "file", glob: "proto/**/*.proto" } },
    { id: "cli", text: "The project exposes usable transaction or query commands for creating proposals, voting and reading proposal state." },
    { id: "local-chain", text: "The application can be built and started as a local Cosmos SDK chain with deterministic development configuration." },
    { id: "tests", text: "Go tests cover proposal creation, authorization, voting, insufficient funding and successful execution.", check: { type: "file", glob: "**/*_test.go" } },
    { id: "go-module", text: "The repository contains a reproducible Go module definition with the Cosmos SDK dependencies required by the application.", check: { type: "file", glob: "go.mod" } },
    { id: "readme", text: "README explains how to build and start the chain, create accounts, submit transactions, query proposals and run tests.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the Go application and runs its tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "cosmos-foundations", name: "Cosmos architecture", weight: 15, layerId: "cosmos-dev-1", description: "The application correctly models an app chain, Cosmos SDK runtime and CometBFT boundary." },
    { id: "go", name: "Go implementation", weight: 15, layerId: "cosmos-dev-2", description: "Go packages, interfaces, structs and error handling are idiomatic and maintainable." },
    { id: "sdk", name: "SDK architecture", weight: 25, layerId: "cosmos-dev-3", description: "BaseApp, module state, keepers and transaction processing are used according to the Cosmos SDK runtime model." },
    { id: "module", name: "Custom module", weight: 20, layerId: "cosmos-dev-4", description: "Messages, handlers, keeper logic and query services form a coherent module with correct state transitions." },
    { id: "testing", name: "Testing & correctness", weight: 15, layerId: "cosmos-dev-9", description: "Tests exercise successful and failing state transitions and protect important module invariants." },
    { id: "operations", name: "Operations & documentation", weight: 10, layerId: "cosmos-dev-10", description: "The chain can be built and operated locally with clear setup and execution documentation." },
  ],

  twistPool: [
    { id: "delegation-votes", text: "Base voting power on a configurable delegation amount recorded by the module, and ensure proposal results use voting power rather than one-vote-per-address." },
    { id: "proposal-expiry", text: "Add an automatic proposal expiration rule that prevents voting and execution after the configured deadline, with tests for both pre-deadline and expired states." },
    { id: "grant-stream", text: "Allow an approved grant to release its funds in multiple scheduled installments, with each installment executable only once and the total never exceeding the approved amount." },
    { id: "emergency-pause", text: "Add a governance-controlled emergency pause parameter that prevents new grant executions while leaving proposal queries and voting available." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Move Developer track (move-developer), v1.
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
  trackId: "move-developer",
  categoryId: "blockchain",
  slug: "move-developer-membership-dao",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Move membership and proposal system",
  summary:
    "Build a Move-based membership system for a small on-chain organization. Members receive " +
    "non-copyable membership resources, can create proposals and vote, and approved proposals " +
    "can execute a defined action. Use Move's resource model, abilities, capabilities and " +
    "abort semantics deliberately. The project must run on a supported local Move development " +
    "environment and include tests that demonstrate both successful resource movement and rejected actions.",
  stack: ["Move", "Aptos CLI", "Move Prover"],

  requirements: [
    { id: "membership-resource", text: "The project defines a membership resource that cannot be copied or duplicated and is associated with its owning account." },
    { id: "membership", text: "An initialization or registration function creates membership only when its documented authorization conditions are satisfied." },
    { id: "proposal", text: "Members can create proposals containing a destination, action data or amount, voting deadline and unique proposal identifier." },
    { id: "voting", text: "Only current members can vote, each member can vote at most once per proposal, and duplicate votes abort." },
    { id: "execution", text: "A proposal executes only when its documented approval and timing conditions are satisfied, and execution cannot occur twice." },
    { id: "capability", text: "Any privileged operation is guarded by an explicit capability or resource that cannot be obtained by an unauthorized account through a public entry function." },
    { id: "resources", text: "The implementation uses Move resource semantics and abilities intentionally, with state transitions that do not create unintended copies of protected assets." },
    { id: "abort-handling", text: "Invalid callers, duplicate actions, invalid amounts and invalid proposal states abort with documented error conditions." },
    { id: "tests", text: "Move tests cover membership creation, unauthorized access, duplicate voting, failed execution and a complete successful proposal lifecycle.", check: { type: "file", glob: "**/sources/**/*.move" } },
    { id: "move-manifest", text: "The repository contains a Move package manifest defining the package and its dependencies.", check: { type: "file", glob: "**/Move.toml" } },
    { id: "readme", text: "README explains the chosen Move network, package setup, publishing or deployment commands, entry functions, state model and test commands.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs the required Move tooling and runs the project's Move tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "language", name: "Move language model", weight: 20, layerId: "move-developer-1", description: "Modules, functions, visibility and primitive types are used correctly and the resource-oriented design is clear." },
    { id: "resources", name: "Resources & abilities", weight: 20, layerId: "move-developer-2", description: "Ownership, abilities, moves, references and protected resources are handled according to Move's semantics." },
    { id: "platform", name: "Move platform implementation", weight: 15, layerId: "move-developer-3", description: "The package is structured and deployed according to the selected Move platform's account and module model." },
    { id: "assets", name: "Asset design", weight: 15, layerId: "move-developer-5", description: "Any membership or value-bearing assets use appropriate resource and metadata patterns without accidental duplication or loss." },
    { id: "testing", name: "Testing & specifications", weight: 15, layerId: "move-developer-6", description: "Tests verify successful resource flows and abort conditions, with specifications used where they add meaningful guarantees." },
    { id: "security", name: "Security & access control", weight: 15, layerId: "move-developer-9", description: "Capabilities, authorization, arithmetic and abort handling prevent unauthorized or invalid state transitions." },
  ],

  twistPool: [
    { id: "weighted-voting", text: "Assign each member a fixed voting weight stored in on-chain state and require proposal approval to use the sum of voting weights rather than member count." },
    { id: "membership-expiry", text: "Give memberships an explicit expiration timestamp and prevent expired members from creating proposals or voting until they renew under the documented renewal rules." },
    { id: "generic-vault", text: "Add a generic resource vault that can custody a Move asset type and release it only when an approved proposal authorizes the withdrawal." },
    { id: "proposer-bond", text: "Require a member to lock a proposal bond when creating a proposal and return or forfeit that resource according to whether the proposal reaches its documented outcome." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
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
  stack: ["Solidity", "Foundry", "Next.js", "ethers.js", "Ethereum L1 testnet", "EVM L2 testnet"],

  requirements: [
    { id: "l1-escrow", text: "An L1 testnet contract accepts test ETH deposits and records the depositor, amount and unique deposit identifier." },
    { id: "l2-contract", text: "An L2 testnet contract represents deposited balances and allows users to lock testnet funds in a marketplace escrow." },
    { id: "deployment", text: "The repository contains reproducible Foundry deployment scripts for the L1 and L2 contracts with network-specific configuration separated from contract logic.", check: { type: "file", glob: "script/**/*.s.sol" } },
    { id: "network-switching", text: "The frontend detects the active network and provides a controlled flow for switching between the configured L1 and L2 networks.", check: { type: "file", glob: "app/**/*.{js,ts,jsx,tsx}" } },
    { id: "bridge-flow", text: "The application displays the deposit and withdrawal lifecycle using transaction hashes and explicit states rather than treating a submitted transaction as final." },
    { id: "escrow", text: "A buyer can create an escrow for a testnet purchase and release or cancel it according to documented authorization and state-transition rules." },
    { id: "l2-gas", text: "The application handles L2 transaction fees and gas estimates without assuming that L1 and L2 fee accounting are identical." },
    { id: "withdrawal", text: "A user can initiate an L2 withdrawal and the application records the pending state until the configured withdrawal completion condition is satisfied." },
    { id: "tests", text: "Automated tests cover contract authorization, escrow lifecycle, invalid state transitions and at least one cross-layer transaction workflow.", check: { type: "file", glob: "test/**/*.t.sol" } },
    { id: "readme", text: "README documents the selected testnets, required test funds, contract deployment, environment variables, frontend setup and L1/L2 workflow.", check: { type: "file", glob: "README.md" } },
    { id: "env", text: "RPC URLs, private keys and contract addresses are configured through environment variables with an example configuration file and no secrets committed.", check: { type: "file", glob: ".env.example" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs the project's automated contract or application tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "l2-model", name: "Layer 2 architecture", weight: 15, layerId: "layer2-dev-1", description: "The application accurately distinguishes L1 settlement from L2 execution and explains the selected rollup model." },
    { id: "deployment", name: "L2 deployment", weight: 10, layerId: "layer2-dev-2", description: "Contracts and configuration are deployed reproducibly to the selected testnet environments." },
    { id: "cross-layer", name: "Cross-layer messaging", weight: 20, layerId: "layer2-dev-5", description: "Deposits, withdrawals and message state are modeled with explicit lifecycle and trust assumptions." },
    { id: "l2-contract", name: "L2-aware contracts", weight: 20, layerId: "layer2-dev-6", description: "Contract logic accounts for L2-specific gas, block/time assumptions and transaction behaviour." },
    { id: "frontend", name: "Multi-network dApp", weight: 20, layerId: "layer2-dev-7", description: "The frontend handles wallet networks, transaction states and cross-layer lifecycle information clearly." },
    { id: "security-ops", name: "Security & operations", weight: 15, layerId: "layer2-dev-9", description: "The design documents bridge, upgrade and sequencing assumptions and avoids unsafe handling of testnet credentials or cross-layer state." },
  ],

  twistPool: [
    { id: "forced-inclusion", text: "Document and prototype an escape-hatch transaction path that lets a user submit an L2 action through the configured L1 mechanism when the normal sequencer path is unavailable." },
    { id: "message-replay", text: "Add unique message identifiers and replay protection so the same simulated cross-layer message cannot be executed twice on the destination contract." },
    { id: "sequencer-status", text: "Add a sequencer-status indicator that distinguishes normal operation, delayed block production and unavailable RPC responses, without presenting an unavailable RPC as proof that the sequencer itself is down." },
    { id: "timelocked-upgrade", text: "Add a timelocked upgrade administrator for one L2 contract, requiring an announced implementation change to remain pending for a configured delay before execution." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};