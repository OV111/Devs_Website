/**
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
  stack: [
    "Bitcoin Core",
    "JavaScript",
    "bitcoinjs-lib",
    "PSBT",
    "regtest or Signet",
  ],

  requirements: [
    {
      id: "utxo-selection",
      text: "The application discovers spendable UTXOs and selects inputs for a requested payment while tracking each input's outpoint, value and required spending data.",
    },
    {
      id: "psbt-creation",
      text: "The application creates a PSBT containing selected inputs, destination outputs and a change output when required, without silently dropping value.",
    },
    {
      id: "fees",
      text: "Fee calculation is explicit and the application rejects transactions whose selected inputs cannot cover outputs plus the configured fee.",
    },
    {
      id: "multisig",
      text: "The vault requires the configured number of distinct signer approvals before a transaction can be finalized.",
    },
    {
      id: "signatures",
      text: "The application verifies that signatures correspond to the intended PSBT transaction and expected signer keys before finalization.",
    },
    {
      id: "combine",
      text: "Separate signer PSBTs can be combined into one transaction proposal without losing valid partial signatures or changing the transaction being approved.",
    },
    {
      id: "broadcast",
      text: "The application broadcasts a transaction only after required signatures are present and the final transaction passes the application's validation checks.",
    },
    {
      id: "rpc",
      text: "The project integrates with Bitcoin Core RPC for wallet or chain queries and transaction submission against regtest or Signet only.",
    },
    {
      id: "tests",
      text: "Automated tests cover UTXO selection, fee calculation, PSBT combination, insufficient signatures and successful finalization.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts}" },
    },
    {
      id: "readme",
      text: "README explains Bitcoin network selection, Bitcoin Core setup, vault configuration, PSBT workflow, testing and how to run the application locally.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "env",
      text: "RPC credentials and other local configuration are supplied through environment variables and an example configuration file is provided.",
      check: { type: "file", glob: ".env.example" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs the automated tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "bitcoin-model",
      name: "Bitcoin fundamentals",
      weight: 20,
      layerId: "bitcoin-dev-1",
      description:
        "The application correctly reasons about UTXOs, inputs, outputs, confirmations, keys and network-specific addresses.",
    },
    {
      id: "wallet-keys",
      name: "Keys & wallet handling",
      weight: 15,
      layerId: "bitcoin-dev-2",
      description:
        "Key material and wallet-derived information are handled correctly and the vault's signer model is explicit.",
    },
    {
      id: "script",
      name: "Bitcoin Script",
      weight: 15,
      layerId: "bitcoin-dev-3",
      description:
        "The chosen spending policy and script/address assumptions are correctly reflected in transaction construction and validation.",
    },
    {
      id: "psbt",
      name: "Transactions & PSBT",
      weight: 25,
      layerId: "bitcoin-dev-4",
      description:
        "PSBT creation, fee calculation, signing, combination and finalization preserve the exact transaction intent.",
    },
    {
      id: "core-rpc",
      name: "Bitcoin Core integration",
      weight: 10,
      layerId: "bitcoin-dev-5",
      description:
        "RPC interaction is reliable, network-aware and appropriately separated from transaction-building logic.",
    },
    {
      id: "security",
      name: "Production security concepts",
      weight: 15,
      layerId: "bitcoin-dev-10",
      description:
        "The vault documents key custody, backup, recovery and broadcast safety boundaries and avoids exposing signing secrets.",
    },
  ],

  twistPool: [
    {
      id: "timelocked-recovery",
      text: "Add a recovery transaction path that becomes valid only after a configured relative or absolute timelock, and test that it cannot be spent before the lock condition.",
    },
    {
      id: "coin-control",
      text: "Add manual coin-control support that lets an operator select specific UTXOs while enforcing that the resulting transaction still satisfies fee, output and change accounting.",
    },
    {
      id: "taproot-vault",
      text: "Implement the vault using a Taproot output with a documented key-path or script-path spending policy and demonstrate the selected spending path on regtest.",
    },
    {
      id: "descriptor-policy",
      text: "Represent the vault's spending policy with a Bitcoin Core descriptor and verify that discovered UTXOs correspond to the configured descriptor before they can be selected.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
