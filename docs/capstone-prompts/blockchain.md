You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/blockchain/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "blockchain" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "blockchain". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "src/**/*.sol" or "contracts/**/*.sol" for Solidity, "test/**/*.t.sol" for Foundry tests, "test/**/*.{js,ts}" for Hardhat tests, "foundry.toml" or "hardhat.config.{js,ts}" for the toolchain, "Anchor.toml" and "programs/**/*.rs" for Solana/Anchor, "**/Move.toml" and "**/sources/**/*.move" for Move, "go.mod" and "**/*_test.go" for Go/Cosmos, "Cargo.toml" for Rust. Globs match paths from the repo root; use **/ when the folder can vary.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### smart-contract — Smart Contract Dev
  - smart-contract-1 | Blockchain and Solidity Foundations | topics: What a smart contract is; EVM execution model and gas; Solidity value and reference types; State variables and functions
  - smart-contract-2 | Contract Structure and Data Patterns | topics: Structs and enums; Arrays and dynamic storage; Mappings and nested mappings; Constructor patterns
  - smart-contract-3 | Local Development with Foundry | topics: Installing and configuring Foundry; Project layout and remappings; Compiling with forge build; Running a local Anvil node
  - smart-contract-4 | Token Standards with OpenZeppelin | topics: ERC20 fungible tokens; ERC721 non-fungible tokens; ERC1155 multi-token standard; Inheritance and overrides
  - smart-contract-5 | Testing and Coverage with Forge | topics: Writing test contracts; Assertions and cheatcodes; Setup and fixtures; Testing reverts and events
  - smart-contract-6 | Hardhat and JavaScript Tooling | topics: Hardhat project setup; Tasks and the console; Testing with ethers.js; Network configuration
  - smart-contract-7 | Advanced Solidity Patterns | topics: Library contracts and using for; Upgradeable proxy patterns; Storage layout and slots; Reentrancy guards
  - smart-contract-8 | Gas Optimization and EVM Internals | topics: Storage versus memory costs; Packing variables into slots; Custom errors over strings; Loop and calldata optimization
  - smart-contract-9 | Building a DeFi Protocol | topics: Staking and reward math; Price oracles with Chainlink; Collateral and liquidations; Fee mechanisms
  - smart-contract-10 | Auditing and Mainnet Deployment | topics: Self-audit checklists; Static analysis with Slither; Verifying source on Etherscan; Deployment scripts and secrets

### ethereum-dev — Ethereum Developer
  - ethereum-dev-1 | Ethereum and the EVM | topics: Accounts and balances; Transactions and gas; Blocks and finality; The EVM state machine
  - ethereum-dev-2 | Writing Smart Contracts in Solidity | topics: Types and storage; Functions and visibility; Events and modifiers; Inheritance basics
  - ethereum-dev-3 | Connecting Apps with ethers.js | topics: Providers and signers; Reading contract state; Sending transactions; Listening to events
  - ethereum-dev-4 | Running Nodes with Geth | topics: Execution versus consensus clients; Syncing modes; The JSON-RPC API; Managing accounts and keystores
  - ethereum-dev-5 | Token Standards and Contract Composition | topics: ERC20 and ERC721 interfaces; Approvals and allowances; Cross-contract calls; Interfaces and abstract contracts
  - ethereum-dev-6 | EVM Deep Dive | topics: Stack, memory, and storage; Common opcodes; Calldata and ABI encoding; Function selectors
  - ethereum-dev-7 | Indexing and Off-Chain Data | topics: Event-driven indexing; Subgraph manifests; Mapping handlers; GraphQL queries
  - ethereum-dev-8 | Wallets, Signatures, and Security | topics: ECDSA signatures; EIP-191 and EIP-712 signing; Permit and gasless approvals; Nonce management
  - ethereum-dev-9 | Testing and CI for dApps | topics: Unit and integration tests; Mainnet forking; Mocking providers; Fuzz and property testing
  - ethereum-dev-10 | Mainnet Deployment and Operations | topics: Deployment scripts and secrets; Contract verification; Gas and nonce management in production; Monitoring and alerting

### solana-dev — Solana Developer
  - solana-dev-1 | Solana Architecture and Accounts | topics: Accounts and ownership; Programs versus data; Rent and lamports; Transactions and instructions
  - solana-dev-2 | Rust for Solana | topics: Ownership and borrowing; Structs and enums; Traits and generics; Result and error handling
  - solana-dev-3 | Native Solana Programs | topics: Program entrypoints; Processing instructions; Account validation; Cross-program invocation
  - solana-dev-4 | Building with Anchor | topics: Anchor program structure; Account contexts and constraints; Instruction handlers; PDAs in Anchor
  - solana-dev-5 | SPL Tokens | topics: Mint and token accounts; Associated token accounts; Minting and burning; Transfers and delegates
  - solana-dev-6 | Client Integration with web3.js | topics: Connection and RPC; Building and sending transactions; Wallet adapter integration; Using the Anchor TypeScript client
  - solana-dev-7 | Testing Solana Programs | topics: Anchor test framework; Local validator testing; TypeScript integration tests; Rust unit tests
  - solana-dev-8 | Advanced Program Design | topics: Cross-program invocation patterns; PDA signing; Account reallocation; Compute unit budgeting
  - solana-dev-9 | Security and Auditing on Solana | topics: Account validation pitfalls; Signer and owner checks; Arithmetic overflow; PDA seed collisions
  - solana-dev-10 | Mainnet Deployment and Operations | topics: Program deployment and buffers; Upgrade authority management; Priority fees in production; RPC provider selection

### blockchain-core — Blockchain Core Dev
  - blockchain-core-1 | Distributed Systems Foundations | topics: Hash functions and Merkle trees; Public key cryptography; Distributed system models; Failure and partition tolerance
  - blockchain-core-2 | Building a Minimal Blockchain | topics: Block structure and headers; Chaining by hash; Transaction encoding; Genesis blocks
  - blockchain-core-3 | Rust for Systems Programming | topics: Ownership and lifetimes; Traits and generics; Error handling; Async with Tokio
  - blockchain-core-4 | Peer-to-Peer Networking | topics: Peer discovery; Gossip protocols; Message serialization; Connection management
  - blockchain-core-5 | Consensus Fundamentals | topics: Safety and liveness; Byzantine fault tolerance; Proof of work; Proof of stake basics
  - blockchain-core-6 | Byzantine Fault Tolerant Consensus | topics: PBFT and its phases; Tendermint consensus; Validator sets and voting power; View changes
  - blockchain-core-7 | State and Storage Engines | topics: Account versus UTXO state; Merkle Patricia tries; Key-value databases; State pruning
  - blockchain-core-8 | Transaction Pool and Execution | topics: Mempool design; Fee prioritization; Nonce and replay handling; Deterministic execution
  - blockchain-core-9 | Security and Resilience | topics: Eclipse and Sybil attacks; Long-range attacks; Denial of service mitigation; Equivocation detection
  - blockchain-core-10 | Testnet Launch and Operations | topics: Genesis configuration; Validator onboarding; Telemetry and metrics; Upgrade coordination

### blockchain-security — Blockchain Security
  - blockchain-security-1 | Smart Contract Security Mindset | topics: Threat modeling basics; Trust assumptions; Common vulnerability classes; Reading code critically
  - blockchain-security-2 | Solidity Internals for Auditors | topics: Storage layout; Function selectors and calldata; Delegatecall and context; Integer behavior
  - blockchain-security-3 | Common Vulnerability Patterns | topics: Reentrancy; Access control flaws; Oracle manipulation; Unchecked external calls
  - blockchain-security-4 | Static Analysis with Slither | topics: Running Slither; Interpreting detectors; Filtering false positives; Inheritance and call graphs
  - blockchain-security-5 | Fuzzing with Echidna | topics: Property-based testing; Writing invariants; Configuring Echidna; Foundry invariant tests
  - blockchain-security-6 | Manual Review Methodology | topics: Scoping an engagement; Reading specs and invariants; Note taking and tracking; Cross-function analysis
  - blockchain-security-7 | DeFi-Specific Attack Vectors | topics: Flash loan attacks; Price oracle manipulation; Liquidity and slippage abuse; Reward accounting bugs
  - blockchain-security-8 | Formal Verification and Symbolic Execution | topics: Symbolic execution basics; Writing formal specifications; Using Halmos; Bounded model checking
  - blockchain-security-9 | Reporting and Disclosure | topics: Report structure; Writing clear findings; Risk ratings; Recommended fixes
  - blockchain-security-10 | Competitive Auditing and Continuous Monitoring | topics: Competitive audit platforms; Triage under time pressure; Post-deployment monitoring; On-chain alerting

### chain-architect — Chain Architect
  - chain-architect-1 | Application-Specific Blockchain Concepts | topics: Monolithic versus modular chains; Application-specific chains; Framework comparison; Sovereignty and shared security
  - chain-architect-2 | Consensus and Tendermint | topics: BFT consensus phases; Validators and voting power; Block finality; The ABCI interface
  - chain-architect-3 | Building Modules with Cosmos SDK | topics: SDK module structure; Keepers and state; Messages and handlers; Queries and gRPC
  - chain-architect-4 | Building Pallets with Substrate | topics: FRAME runtime model; Writing a pallet; Storage items and extrinsics; Events and errors
  - chain-architect-5 | Tokenomics and Governance Design | topics: Staking and inflation; Validator economics; On-chain governance; Parameter changes
  - chain-architect-6 | Cross-Chain Communication | topics: The IBC protocol; Light clients and proofs; Channels and packets; Token transfers across chains
  - chain-architect-7 | Modular Architecture and Data Availability | topics: Execution and settlement separation; Data availability layers; Sovereign rollups; Shared security models
  - chain-architect-8 | Performance and Scalability | topics: Block size and time tuning; Mempool optimization; Parallel execution; State growth management
  - chain-architect-9 | Security and Validator Operations | topics: Key management and sentries; Double-sign protection; Slashing parameters; DDoS mitigation
  - chain-architect-10 | Mainnet Launch and Upgrades | topics: Genesis ceremony; Validator onboarding; Coordinated upgrades; Governance-driven changes

### bitcoin-dev — Bitcoin Developer
  - bitcoin-dev-1 | Bitcoin Fundamentals | topics: The UTXO model; Transactions and inputs; Proof of work and mining; Keys and addresses
  - bitcoin-dev-2 | Keys, Addresses, and Wallets | topics: Elliptic curve keys; Address formats; BIP32 hierarchical wallets; BIP39 mnemonics
  - bitcoin-dev-3 | Bitcoin Script | topics: Stack-based execution; Opcodes; Pay to public key hash; Pay to script hash
  - bitcoin-dev-4 | Transactions and PSBT | topics: Transaction serialization; Signature hashing; Fee estimation; Building PSBTs
  - bitcoin-dev-5 | Running Bitcoin Core | topics: Installing Bitcoin Core; Initial block download; The RPC interface; Wallet RPCs
  - bitcoin-dev-6 | Bitcoin Core Internals in C++ | topics: Codebase structure; Validation and consensus code; The mempool implementation; Networking layer
  - bitcoin-dev-7 | Taproot and Advanced Scripting | topics: Schnorr signatures; Taproot outputs; Tapscript; Key path and script path spends
  - bitcoin-dev-8 | Lightning Network Fundamentals | topics: Payment channels; HTLCs; Commitment transactions; Routing and gossip
  - bitcoin-dev-9 | Building Lightning Applications | topics: Lightning node APIs; Invoices and BOLT11; Sending and receiving; Channel management
  - bitcoin-dev-10 | Production Deployment and Security | topics: Hardened node deployment; Cold and hot wallet design; Backups and recovery; Lightning channel backups

### cosmos-dev — Cosmos Developer
  - cosmos-dev-1 | Cosmos Ecosystem Fundamentals | topics: The Cosmos vision; App chains versus shared chains; The Cosmos SDK and Tendermint; The ABCI interface
  - cosmos-dev-2 | Go for Cosmos Development | topics: Go modules and packages; Interfaces and structs; Error handling; Protocol buffers
  - cosmos-dev-3 | Cosmos SDK Architecture | topics: BaseApp and the runtime; Modules and keepers; Stores and the state tree; AnteHandlers
  - cosmos-dev-4 | Building Custom Modules | topics: Defining messages; Keeper logic and state; Message handlers; Query services
  - cosmos-dev-5 | Tokens, Staking, and Governance | topics: The bank module; Staking and delegation; Distribution and rewards; On-chain governance
  - cosmos-dev-6 | Inter-Blockchain Communication | topics: IBC architecture; Light clients; Connections and channels; Packet lifecycle
  - cosmos-dev-7 | CosmWasm Smart Contracts | topics: The CosmWasm module; Contract structure in Rust; Instantiate, execute, and query; Contract storage
  - cosmos-dev-8 | Clients, Tooling, and Frontends | topics: Connecting with CosmJS; Signing and broadcasting; Wallet integration with Keplr; Querying state
  - cosmos-dev-9 | Testing and Upgrades | topics: Unit and integration tests; Simulation testing; Upgrade modules; Migration handlers
  - cosmos-dev-10 | Mainnet Launch and Operations | topics: Genesis ceremony; Validator onboarding; Relayer operations; Monitoring and telemetry

### move-developer — Move Developer
  - move-developer-1 | Move Language Foundations | topics: Resource-oriented programming; Modules and scripts; Primitive types; Functions and visibility
  - move-developer-2 | Resources and Abilities | topics: The four abilities; Resources versus copyable types; Ownership and moves; References and borrowing
  - move-developer-3 | Building on Aptos | topics: The Aptos account model; Global storage operations; Publishing modules; Entry functions
  - move-developer-4 | Building on Sui | topics: The Sui object model; Owned versus shared objects; Object ownership transfer; Entry functions on Sui
  - move-developer-5 | Tokens and Digital Assets | topics: Fungible asset standards; Non-fungible tokens; Minting and burning; Asset metadata
  - move-developer-6 | Testing and the Move Prover | topics: Writing unit tests; Test-only code; Move specification language; Writing specifications
  - move-developer-7 | Composability and Generics | topics: Generic types and functions; Phantom type parameters; Capability patterns; Witness patterns
  - move-developer-8 | Frontend and SDK Integration | topics: TypeScript SDK setup; Building transactions; Wallet connection; Reading on-chain state
  - move-developer-9 | Security and Auditing in Move | topics: Access control patterns; Capability leakage; Arithmetic and abort handling; Reentrancy considerations
  - move-developer-10 | Mainnet Deployment and Upgrades | topics: Module publishing to mainnet; Upgrade policies; Compatibility checks; Managing upgrade authority

### layer2-dev — Layer 2 Developer
  - layer2-dev-1 | Scaling and Layer 2 Foundations | topics: The blockchain scaling trilemma; Layer 1 versus layer 2; Rollups overview; Optimistic versus zk rollups
  - layer2-dev-2 | Deploying to Layer 2 Networks | topics: EVM equivalence; Connecting to L2 testnets; Deploying with Foundry; Bridging test funds
  - layer2-dev-3 | Optimistic Rollups in Depth | topics: Transaction batching; State commitments; Fraud proofs; The challenge window
  - layer2-dev-4 | Zero-Knowledge Rollups | topics: Validity proofs; SNARKs and STARKs at a high level; Proof generation and verification; zkEVM concepts
  - layer2-dev-5 | Bridges and Cross-Layer Messaging | topics: Native bridge architecture; Deposits and withdrawals; Cross-domain messaging; Message passing contracts
  - layer2-dev-6 | L2-Aware Contract Development | topics: L1 versus L2 gas accounting; Calldata cost optimization; Block and time assumptions; Account abstraction on L2
  - layer2-dev-7 | Building a dApp Across Layers | topics: Multi-network frontends; Switching chains in the wallet; Tracking bridge transactions; Handling withdrawal delays
  - layer2-dev-8 | Running and Customizing a Rollup | topics: Rollup stack overview; Configuring a chain; Running a sequencer; Setting up a batcher and proposer
  - layer2-dev-9 | Layer 2 Security and Decentralization | topics: Sequencer centralization risks; Escape hatches and forced inclusion; Upgrade keys and timelocks; Data availability assurances
  - layer2-dev-10 | Production Deployment and Operations | topics: Mainnet L2 deployment; Contract verification on L2; Bridge monitoring; Sequencer and prover monitoring
