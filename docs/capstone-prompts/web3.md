You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/web3/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "web3" instead):

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
1. trackId = the track id exactly as given below. categoryId = "web3". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### dapp-developer — dApp Developer
  - dapp-developer-1 | Web and Blockchain Fundamentals | topics: How HTTP and DNS work; What a blockchain is; Nodes, miners, and validators; Public vs private keys
  - dapp-developer-2 | Solidity Basics | topics: State variables and functions; Value types vs reference types; Visibility modifiers; Constructor and fallback functions
  - dapp-developer-3 | Ethereum Developer Toolchain | topics: Hardhat project setup; Compiling contracts; Deploying to localhost; Writing Hardhat scripts
  - dapp-developer-4 | Connecting React to Ethereum with ethers.js | topics: ethers.js Provider and Signer; Connecting MetaMask via window.ethereum; Reading contract state; Sending transactions from React
  - dapp-developer-5 | Smart Contract Patterns and ERC Standards | topics: ERC-20 token standard; ERC-721 NFT standard; Ownable and access control; Pausable pattern
  - dapp-developer-6 | Testing Smart Contracts | topics: Unit testing with Hardhat + Chai; Testing events and reverts; Simulating time with evm_increaseTime; Fixtures and beforeEach setup
  - dapp-developer-7 | Testnets, IPFS, and Contract Verification | topics: Alchemy and Infura RPC endpoints; Deploying to Sepolia testnet; Etherscan contract verification via Hardhat; IPFS content addressing
  - dapp-developer-8 | dApp UX - Transactions, Errors, and State | topics: Transaction lifecycle states; Handling MetaMask rejection errors; Waiting for confirmations; Chain ID detection and switching
  - dapp-developer-9 | Smart Contract Security Fundamentals | topics: Reentrancy attacks; Integer overflow and underflow; Access control flaws; Front-running and MEV
  - dapp-developer-10 | Mainnet Deployment and Production Readiness | topics: Mainnet deployment checklist; Gas optimization before launch; Tenderly monitoring and alerts; Gnosis Safe multisig setup

### web3-frontend — Web3 Frontend
  - web3-frontend-1 | Web and Ethereum Fundamentals for Frontend Devs | topics: Ethereum accounts and transactions; JSON-RPC methods like eth_call and eth_sendTransaction; How injected providers work; React project setup with Vite
  - web3-frontend-2 | viem - Low-Level Ethereum Client | topics: Creating a publicClient; Reading contract data with readContract; Encoding calldata; Handling BigInt in JavaScript
  - web3-frontend-3 | wagmi - React Hooks for Ethereum | topics: WagmiProvider setup; useAccount and useConnect hooks; useReadContract and useWriteContract; useWaitForTransactionReceipt
  - web3-frontend-4 | RainbowKit - Wallet Connection UI | topics: RainbowKit ConnectButton; Custom theme with lightTheme and darkTheme; Restricting to specific chains; Adding custom wallets
  - web3-frontend-5 | Reading and Displaying On-Chain Data | topics: useReadContracts for batch reads; watchContractEvent for live updates; React Query cache and stale time; Formatting BigInt for display
  - web3-frontend-6 | Writing Transactions and User Flows | topics: useWriteContract and simulate first; useWaitForTransactionReceipt polling; Gas estimation and limits; User rejection error handling
  - web3-frontend-7 | Multi-Chain and Network Handling | topics: Defining custom chains in viem; useSwitchChain hook; Chain-specific contract address mapping; Detecting wrong network and showing warnings
  - web3-frontend-8 | Signatures, Auth, and Sign-In with Ethereum | topics: EIP-4361 SIWE message format; useSignMessage hook; Nonce generation and storage; Server-side SIWE verification
  - web3-frontend-9 | Performance, Accessibility, and Testing | topics: Mocking wagmi hooks in Vitest; Testing wallet connect flows; Mock Service Worker for RPC calls; Lighthouse performance audit
  - web3-frontend-10 | Production Build, Security, and Deployment | topics: Hiding RPC keys via proxy API routes; Content Security Policy for dApps; Vercel deployment and environment variables; Bundle analysis with vite-bundle-visualizer

### defi-developer — DeFi Developer
  - defi-developer-1 | Web and Blockchain Fundamentals for DeFi | topics: How Ethereum transactions work; Gas and EVM execution model; Smart contract state and storage slots; ERC-20 token standard
  - defi-developer-2 | Solidity for DeFi - Core Patterns | topics: Solidity interfaces and abstract contracts; Low-level call and delegatecall; ERC-20 safeTransfer pattern; Reentrancy and checks-effects-interactions
  - defi-developer-3 | Foundry - Professional Smart Contract Toolchain | topics: forge init and project structure; Writing Foundry tests with Test and assertEq; Mainnet forking with Anvil; Fuzzing with forge test --fuzz-runs
  - defi-developer-4 | Building Automated Market Makers | topics: x*y=k invariant formula; Swap fee calculation; Mint and burn LP tokens; Price impact and slippage
  - defi-developer-5 | Price Oracles and External Data | topics: Chainlink AggregatorV3Interface; Reading price feeds on-chain; Oracle staleness checks; Uniswap V3 TWAP calculation
  - defi-developer-6 | Lending and Borrowing Protocols | topics: Collateral ratio and health factor; Interest rate models; Liquidation bonus and thresholds; cToken and aToken share models
  - defi-developer-7 | Flash Loans | topics: Flash loan callback pattern; Aave flash loan interface; Uniswap V3 flash swap; Arbitrage between two AMMs
  - defi-developer-8 | Yield Strategies and Vaults | topics: ERC-4626 vault standard; Deposit and withdraw share math; Yield strategy composition; Harvesting and compounding rewards
  - defi-developer-9 | DeFi Security and Attack Vectors | topics: Reentrancy attack variants; Price oracle manipulation; Governance attack via flash loans; Sandwich and front-running attacks
  - defi-developer-10 | Mainnet Deployment and Protocol Launch | topics: Pre-launch audit checklist; Timelock controller for parameter changes; Gnosis Safe multisig for protocol admin; Tenderly alerts on protocol health

### nft-developer — NFT Developer
  - nft-developer-1 | Web and Blockchain Basics for NFT Developers | topics: Blockchain immutability and provenance; Fungible vs non-fungible tokens; What metadata means for NFTs; How wallets own tokens
  - nft-developer-2 | Solidity and ERC-721 Standard | topics: ERC-721 interface functions; ownerOf and balanceOf; mint and safeMint functions; Approval and transferFrom
  - nft-developer-3 | NFT Metadata and IPFS | topics: NFT metadata JSON schema; Uploading images to IPFS via Pinata; Pinning metadata JSON files; Setting tokenURI in contracts
  - nft-developer-4 | NFT Minting Mechanics | topics: Max supply and counter pattern; Allowlist with Merkle proof verification; Public and presale phases; Per-wallet mint limits with mapping
  - nft-developer-5 | ERC-1155 Multi-Token Standard | topics: ERC-1155 vs ERC-721 tradeoffs; Batch mint and batch transfer; balanceOfBatch function; Metadata URI with id substitution
  - nft-developer-6 | NFT Royalties and Marketplace Integration | topics: ERC-2981 royaltyInfo function; Royalty basis points math; OpenSea operator filter registry; Marketplace-specific royalty enforcement
  - nft-developer-7 | On-Chain Generative NFTs and SVG Art | topics: Generating SVG strings in Solidity; Base64 encoding for data URIs; On-chain attribute randomness with blockhash; Chainlink VRF for verifiable randomness
  - nft-developer-8 | NFT Frontend with React and ethers.js | topics: Connecting MetaMask with wagmi; Mint button with transaction state; Fetching tokenURI and rendering metadata; Gallery view with paginated NFTs
  - nft-developer-9 | NFT Contract Security and Testing | topics: Reentrancy in ERC-721 safe transfers; Supply cap bypass via batch mint; Merkle proof front-running; Metadata URI manipulation
  - nft-developer-10 | Mainnet Launch and Collection Operations | topics: Mainnet deployment with Hardhat; Etherscan contract verification; OpenSea collection setup and metadata; Gnosis Safe for team fund management

### web3-fullstack — Web3 Full Stack
  - web3-fullstack-1 | Web and Blockchain Fundamentals | topics: Traditional vs decentralized architecture; Role of smart contracts as backend; What an indexer does and why it is needed; JSON-RPC and WebSocket providers
  - web3-fullstack-2 | Solidity Smart Contract Development | topics: Solidity data types and visibility; Events and indexed parameters; OpenZeppelin access control; Custom errors for gas efficiency
  - web3-fullstack-3 | Hardhat - Contract Testing and Deployment | topics: Hardhat project configuration; Writing and running Mocha tests; Deploying with Hardhat Ignition or scripts; Storing deployed addresses per network
  - web3-fullstack-4 | Next.js Frontend with wagmi and RainbowKit | topics: Next.js app router setup; Configuring WagmiProvider with Next.js; Server vs client component split; RainbowKit ConnectButton in Next.js
  - web3-fullstack-5 | The Graph - Subgraph Development | topics: Subgraph manifest and schema; Defining GraphQL entities; Writing event handlers in AssemblyScript; Deploying to the hosted service or Subgraph Studio
  - web3-fullstack-6 | Querying Subgraphs from the Frontend | topics: Apollo Client setup in Next.js; Writing and executing GraphQL queries; Pagination with first and skip; Filtering and ordering in GraphQL
  - web3-fullstack-7 | File Storage - IPFS and Arweave | topics: Uploading files to IPFS via Pinata API; Arweave and Bundlr for permanent storage; Generating metadata JSON and pinning; Displaying IPFS content via gateways
  - web3-fullstack-8 | Authentication and User Profiles | topics: SIWE message signing and verification; Iron Session for JWT-free session cookies; Next.js API routes for auth endpoints; Protecting pages with middleware
  - web3-fullstack-9 | Testing, Performance, and Security | topics: Playwright E2E tests for wallet flows; Mocking wagmi hooks in Vitest; Smart contract audit with Slither; Lighthouse performance and accessibility
  - web3-fullstack-10 | Mainnet Launch and Production Operations | topics: Mainnet contract deployment and verification; Publishing subgraph to The Graph Network; Vercel production deployment with env vars; Tenderly production monitoring

### wallet-developer — Wallet Developer
  - wallet-developer-1 | Web and Cryptography Fundamentals | topics: Public and private key cryptography; secp256k1 elliptic curve; keccak-256 hashing; ECDSA digital signatures
  - wallet-developer-2 | EIP-1193 - The Ethereum Provider API | topics: EIP-1193 provider interface; eth_requestAccounts and wallet_switchEthereumChain; Listening to accountsChanged and chainChanged events; eth_sendTransaction payload structure
  - wallet-developer-3 | Key Management and Secure Storage | topics: ethers.js Wallet keystore encryption; Web Crypto API for browser-native crypto; Secure key storage patterns in browsers; Hardware wallet communication via U2F or HID
  - wallet-developer-4 | Transaction Construction and Signing | topics: EIP-1559 transaction type 2 fields; maxFeePerGas and maxPriorityFeePerGas; Nonce management and race conditions; Gas estimation with eth_estimateGas
  - wallet-developer-5 | WalletConnect Protocol | topics: WalletConnect v2 protocol overview; AppKit setup and configuration; Session proposal and approval flow; Sending requests over WalletConnect sessions
  - wallet-developer-6 | Message Signing - EIP-712 Typed Data | topics: EIP-712 domain and type definitions; Typed data hashing and signing; MetaMask eth_signTypedData_v4; Permit EIP-2612 for gasless approvals
  - wallet-developer-7 | Account Abstraction - ERC-4337 | topics: UserOperation structure and fields; EntryPoint contract interface; Bundler and mempool for 4337; Paymaster for gas sponsorship
  - wallet-developer-8 | Phishing Prevention and User Security | topics: Address poisoning attacks; Transaction simulation before signing; Allowance risk warnings; MetaMask Snaps for custom security
  - wallet-developer-9 | Multi-Chain and Cross-Chain Wallet Support | topics: EVM chain ID registry; Custom chain configuration in viem; Detecting and switching chains; Cross-chain bridge integration patterns
  - wallet-developer-10 | Production Wallet Security Audit and Launch | topics: Browser extension security model; Content script and background page isolation; Secure context and HTTPS requirements; Key extraction threat modeling

### gamefi-developer — GameFi Developer
  - gamefi-developer-1 | Web, Blockchain, and Game Design Fundamentals | topics: GameFi and play-to-earn model; On-chain vs off-chain game state; NFT items and characters; Token economics in games
  - gamefi-developer-2 | Solidity Basics for Game Contracts | topics: Solidity data types and structs; ERC-20 for in-game currency; ERC-721 for unique characters or items; Mappings for player state
  - gamefi-developer-3 | Unity and web3.js Integration | topics: Unity WebGL build configuration; Calling JavaScript from Unity with jslib; Connecting MetaMask from Unity WebGL; Reading NFT ownership in game
  - gamefi-developer-4 | NFT Game Assets - ERC-1155 and Metadata | topics: ERC-1155 for game items; Batch mint for loot drops; Item metadata with attributes; IPFS metadata storage via Pinata
  - gamefi-developer-5 | Randomness and Loot Generation | topics: Why blockhash randomness is exploitable; Chainlink VRF v2 and v2.5; VRF subscription management; Requesting and fulfilling randomness
  - gamefi-developer-6 | Play-to-Earn Reward Mechanics | topics: On-chain score submission; Per-block reward emission; NFT staking for passive rewards; Anti-bot cooldowns and commit-reveal
  - gamefi-developer-7 | On-Chain Marketplace for Game Items | topics: Marketplace listing and order struct; ERC-1155 setApprovalForAll; Order matching and escrow; ERC-2981 royalty on game item sales
  - gamefi-developer-8 | Layer 2 for GameFi - Low Gas and Fast Finality | topics: Why L2 matters for games; Deploying to Polygon and Arbitrum; Official bridge contracts and UI; Gas cost comparison L1 vs L2
  - gamefi-developer-9 | GameFi Security and Anti-Cheat | topics: Score submission with server signature; Sybil attack resistance with per-wallet limits; Reentrancy in reward claims; Flash loan attacks on staking rewards
  - gamefi-developer-10 | Mainnet Launch and Live Game Operations | topics: Mainnet deployment checklist for games; Unity WebGL production build optimization; Tenderly alerts for reward contract events; Gnosis Safe for treasury management

### dao-developer — DAO Developer
  - dao-developer-1 | Web, Blockchain, and DAO Fundamentals | topics: What is a DAO and why it exists; On-chain vs off-chain governance; Token-weighted voting mechanics; Quorum and proposal thresholds
  - dao-developer-2 | Governance Tokens - ERC-20 with Voting | topics: ERC-20Votes and ERC-20Permit extensions; Delegation and self-delegation; Historical vote balance checkpointing; getPastVotes for proposal snapshots
  - dao-developer-3 | OpenZeppelin Governor Framework | topics: OpenZeppelin Governor modules; GovernorVotes and GovernorQuorum; Proposal lifecycle - Pending, Active, Succeeded, Queued, Executed; TimelockController configuration
  - dao-developer-4 | Snapshot - Off-Chain Voting | topics: Snapshot space configuration; Voting strategies - token, delegation, NFT; How Snapshot stores votes on IPFS; EIP-712 signature in Snapshot votes
  - dao-developer-5 | DAO Treasury Management | topics: Treasury contract patterns; Gnosis Safe as DAO treasury; Governance-gated fund releases; Multi-sig approval thresholds
  - dao-developer-6 | Aragon Framework | topics: Aragon OSx architecture; DAO and plugin structure; TokenVoting plugin setup; Permission management with ACL
  - dao-developer-7 | DAO Frontend and Governance UI | topics: Displaying active and past proposals; Voting power and delegation UI; Proposal creation form; Transaction feedback for vote and delegate
  - dao-developer-8 | Advanced Voting Mechanisms | topics: Quadratic voting math and implementation; Sybil resistance for quadratic voting; Conviction voting curve; Optimistic approval patterns
  - dao-developer-9 | DAO Security and Attack Vectors | topics: Flash loan governance attacks; Proposal front-running and griefing; Timelock bypass scenarios; Quorum and threshold manipulation
  - dao-developer-10 | Mainnet DAO Launch and Operations | topics: Token distribution and genesis event; Mainnet Governor and timelock deployment; Tally or Boardroom integration; Community proposal process documentation

### zk-developer — ZK Developer
  - zk-developer-1 | Web, Math, and ZK Fundamentals | topics: What a zero-knowledge proof proves; Completeness, soundness, and zero-knowledge properties; Finite fields and modular arithmetic; Polynomial representations of computation
  - zk-developer-2 | Circom - Arithmetic Circuit Language | topics: Circom syntax and signal types; Constraints with <==, --> and ===; Template and component model; Multiplier and comparator circuits
  - zk-developer-3 | snarkjs - Groth16 Proof Generation | topics: Powers of Tau ceremony; Phase 2 circuit-specific setup; Generating proving and verification keys; Creating proofs with snarkjs groth16 prove
  - zk-developer-4 | On-Chain Proof Verification with Solidity | topics: Auto-generated Groth16 Verifier.sol; Calling verifyProof from Solidity; Encoding proof as uint256 array; Nullifier hashes for double-spend prevention
  - zk-developer-5 | Noir - Rust-Like ZK Language | topics: Noir syntax and types; Private and public inputs in Noir; Writing and running Nargo tests; Noir standard library functions
  - zk-developer-6 | ZK Identity and Private Credentials | topics: Merkle tree membership proofs; Semaphore identity and commitment scheme; Nullifier hash for anonymous actions; Group membership without revealing identity
  - zk-developer-7 | PLONK and Universal Trusted Setup | topics: PLONK constraint system; Universal vs circuit-specific trusted setup; KZG polynomial commitments; PLONK proof generation with snarkjs
  - zk-developer-8 | ZK Rollup Concepts and zkEVM | topics: ZK rollup architecture; Validity proof vs fraud proof rollups; zkEVM types - bytecode compatible, language compatible; Deploying to Polygon zkEVM testnet
  - zk-developer-9 | Circuit Security and Soundness Testing | topics: Under-constrained signal vulnerabilities; Unchecked arithmetic overflow in circuits; circomspect static analyzer; Groth16 trusted setup security assumptions
  - zk-developer-10 | Mainnet Deployment and ZK Application Launch | topics: Organizing a public Powers of Tau ceremony; Verifying ceremony contributions; Mainnet verifier and application contract deployment; Proof generation SDK for end users

### web3-indexer — Web3 Data / Indexer
  - web3-indexer-1 | Web, Blockchain, and Data Fundamentals | topics: Why on-chain data needs indexing; Smart contract events and logs; Log topics and data encoding; GraphQL vs REST for blockchain data
  - web3-indexer-2 | GraphQL Schema Design for Blockchain Data | topics: GraphQL type definitions and scalars; Entity relationships with @derivedFrom; BigInt and Bytes types in The Graph; Indexed vs non-indexed query fields
  - web3-indexer-3 | Building Your First Subgraph | topics: graph init and project scaffold; subgraph.yaml manifest configuration; Writing handlers in AssemblyScript; Entity store operations - save, load, remove
  - web3-indexer-4 | Advanced Subgraph Patterns | topics: Call handlers for non-event contract calls; Block handlers for per-block aggregation; Data source templates for factory contracts; Dynamic data source instantiation
  - web3-indexer-5 | Ponder - TypeScript-Native Indexing | topics: Ponder project setup and config; Writing event handlers in TypeScript; Schema definition with Ponder schema; Local development with hot reload
  - web3-indexer-6 | Querying and Optimizing GraphQL APIs | topics: Pagination with first, skip, and cursor; Filtering with where clauses; Sorting with orderBy and orderDirection; Query complexity and depth limits
  - web3-indexer-7 | Real-Time Data - Subscriptions and WebSockets | topics: GraphQL subscription syntax; WebSocket transport for subscriptions; The Graph subscription support; Combining subscriptions with initial query
  - web3-indexer-8 | Multi-Chain Indexing | topics: Deploying subgraphs to multiple networks; Chain ID filtering in schema and queries; Cross-chain entity aggregation patterns; Separate vs unified subgraph for multi-chain
  - web3-indexer-9 | Subgraph Testing and Performance | topics: Matchstick test framework setup; Mocking events and contract calls in tests; Asserting entity field values in Matchstick; Query latency profiling
  - web3-indexer-10 | Production Deployment on The Graph Network | topics: Publishing to The Graph Network vs hosted service; GRT curation signal mechanics; Indexer selection and query routing; Subgraph versioning and migration
