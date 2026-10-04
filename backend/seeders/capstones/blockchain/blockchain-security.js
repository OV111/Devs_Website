/**
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
    {
      id: "threat-model",
      text: "The repository documents the vault's assets, privileged roles, trust assumptions, external dependencies and security invariants before the code review.",
    },
    {
      id: "vulnerable-baseline",
      text: "A separate baseline implementation intentionally contains at least three documented security flaws spanning different vulnerability classes.",
    },
    {
      id: "findings",
      text: "A security report identifies each baseline flaw with affected code, attack preconditions, concrete impact, reproduction steps and a remediation approach.",
      check: {
        type: "file",
        glob: ["docs/**/*.md", "**/{audit,findings,report,security}*.md"],
      },
    },
    {
      id: "exploit-tests",
      text: "Foundry tests reproduce each documented vulnerability against the baseline contract and demonstrate the security-relevant state change or loss.",
    },
    {
      id: "hardened-vault",
      text: "The hardened implementation prevents the documented attacks using explicit authorization, accounting, external-call and oracle assumptions appropriate to the chosen design.",
    },
    {
      id: "regression-tests",
      text: "The hardened implementation has regression tests proving that each previously exploitable path now fails or produces the intended safe result.",
    },
    {
      id: "static-analysis",
      text: "The repository includes a reproducible Slither analysis configuration or documented command and records how relevant findings were triaged.",
    },
    {
      id: "manual-review",
      text: "The review covers cross-function interactions and explicitly checks at least one invariant that cannot be established by a single-function inspection.",
    },
    {
      id: "tests",
      text: "The final automated suite covers both normal vault behaviour and adversarial cases including unauthorized access, malformed inputs and repeated calls.",
      check: { type: "file", glob: "test/**/*.t.sol" },
    },
    {
      id: "readme",
      text: "README explains how to build the contracts, run exploit and regression tests, run static analysis and understand the baseline versus hardened implementations.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the contracts and runs the automated security tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "threat-model",
      name: "Threat modeling",
      weight: 15,
      layerId: "blockchain-security-1",
      description:
        "Assets, trust boundaries, attacker capabilities and security invariants are concrete and connected to the implementation.",
    },
    {
      id: "solidity-internals",
      name: "Solidity internals",
      weight: 15,
      layerId: "blockchain-security-2",
      description:
        "The review demonstrates accurate reasoning about storage, calldata, selectors, delegatecall and integer behaviour where relevant.",
    },
    {
      id: "vulnerability-analysis",
      name: "Vulnerability analysis",
      weight: 20,
      layerId: "blockchain-security-3",
      description:
        "Findings identify realistic exploit paths and distinguish root causes from symptoms.",
    },
    {
      id: "static-analysis",
      name: "Static analysis",
      weight: 10,
      layerId: "blockchain-security-4",
      description:
        "Slither results are reproduced, relevant findings are interpreted and false positives are distinguished from actionable issues.",
    },
    {
      id: "fuzzing-testing",
      name: "Fuzzing & security testing",
      weight: 20,
      layerId: "blockchain-security-5",
      description:
        "Exploit and regression tests meaningfully exercise security properties and do not merely assert successful deployment.",
    },
    {
      id: "reporting",
      name: "Manual review & reporting",
      weight: 20,
      layerId: "blockchain-security-6",
      description:
        "The engagement is organized around explicit invariants and the final report communicates evidence, impact and remediation precisely.",
    },
  ],

  twistPool: [
    {
      id: "oracle-path",
      text: "Add a mock price oracle to the baseline vault and demonstrate an oracle-manipulation attack, then harden the price-dependent operation with a documented freshness and validation rule.",
    },
    {
      id: "upgrade-path",
      text: "Make the baseline vault upgradeable and include a delegatecall or storage-layout flaw in the review, then harden the upgrade mechanism with explicit authority and storage compatibility checks.",
    },
    {
      id: "flash-loan-path",
      text: "Add a mock flash-loan provider and a price-dependent vault operation that is exploitable within one transaction, then add a regression test and mitigation that addresses the attack's actual mechanism.",
    },
    {
      id: "formal-property",
      text: "Express one critical vault invariant (for example, total shares are always backed by assets) as a Foundry stateful invariant test with a handler contract: it must fail against the vulnerable vault and pass against the hardened one.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
