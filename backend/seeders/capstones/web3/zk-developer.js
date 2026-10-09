/**
 * Capstone brief — zk-developer track (zk-developer), v1.
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
    {
      id: "circom-membership-circuit",
      text: "Design a Circom arithmetic circuit verifying Merkle tree membership and nullifier uniqueness without revealing identity.",
    },
    {
      id: "trusted-setup-artifacts",
      text: "Execute Powers of Tau ceremony and circuit-specific phase 2 setup to generate proving and verification keys.",
    },
    {
      id: "solidity-verifier",
      text: "Deploy the auto-generated Groth16 Verifier contract and integrate proof verification logic.",
    },
    {
      id: "nullifier-double-spend",
      text: "Enforce nullifier tracking in the smart contract to prevent double-voting and ensure anonymity.",
    },
    {
      id: "snarkjs-proof-generation",
      text: "Implement client-side proof generation scripts using snarkjs and JavaScript helper functions.",
    },
    {
      id: "circuit-unit-tests",
      text: "Write circuit unit tests using snarkjs and Chai verifying constraints and edge cases.",
      check: { type: "file", glob: "test/**/*.{js,ts}" },
    },
    {
      id: "circuit-source-file",
      text: "Include Circom source files structured correctly in the project repository.",
      check: { type: "file", glob: "circuits/**/*.circom" },
    },
    {
      id: "env-example",
      text: "Provide an .env.example configuration file for environment variables.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Document circuit constraints, trusted setup steps, and verification workflow.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow compiles circuits and runs test suites.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "circuit-design-constraints",
      name: "Circom Circuit Design & Constraints",
      weight: 25,
      layerId: "zk-developer-2",
      description:
        "Accurate constraint definition, proper use of <== and ===, and avoidance of under-constrained signals.",
    },
    {
      id: "snarkjs-setup-proofs",
      name: "snarkjs Setup & Proof Generation",
      weight: 20,
      layerId: "zk-developer-3",
      description:
        "Correct handling of trusted setup artifacts, witness calculation, and Groth16 proof generation.",
    },
    {
      id: "solidity-verification",
      name: "On-Chain Proof Verification",
      weight: 20,
      layerId: "zk-developer-4",
      description:
        "Flawless integration of Verifier.sol, public input validation, and nullifier tracking.",
    },
    {
      id: "identity-nullifiers",
      name: "Zero-Knowledge Identity & Nullifiers",
      weight: 15,
      layerId: "zk-developer-6",
      description:
        "Secure Semaphore-style commitment schemes preventing double-spending and privacy leaks.",
    },
    {
      id: "circuit-security-tests",
      name: "Circuit Security & Testing",
      weight: 10,
      layerId: "zk-developer-9",
      description:
        "Thorough testing of invalid proofs, malformed public inputs, and boundary conditions.",
    },
    {
      id: "documentation-operability",
      name: "Documentation & Operability",
      weight: 10,
      layerId: "zk-developer-10",
      description:
        "Clear instructions for compiling circuits, running ceremony scripts, and deploying contracts.",
    },
  ],

  twistPool: [
    {
      id: "noir-language-port",
      text: "Rewrite the membership verification circuit using Noir and Nargo instead of Circom.",
    },
    {
      id: "incremental-merkle-tree",
      text: "Implement an on-chain Incremental Merkle Tree supporting dynamic user registrations.",
    },
    {
      id: "zk-age-verification",
      text: "Add a ZK circuit proving a user's age exceeds a threshold based on a hashed birthdate without revealing the date.",
    },
    {
      id: "batched-proof-verifier",
      text: "Implement a batch proof verifier smart contract aggregating multiple vote proofs into a single gas-optimized verification call.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
