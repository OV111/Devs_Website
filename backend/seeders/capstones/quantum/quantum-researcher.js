/**
 * Capstone brief — quantum-researcher track (quantum-researcher), v1.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "quantum-researcher",
  categoryId: "quantum",
  slug: "quantum-researcher-error-correction-sim",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Surface Code Error Correction and Decoherence Simulator",
  summary:
    "Develop an open quantum system and surface code simulation toolkit to study density matrix decoherence (Lindblad equation), " +
    "syndrome measurement cycles, and Minimum Weight Perfect Matching (MWPM) error decoding.",
  stack: [
    "Python",
    "Qiskit or Stim",
    "PyMatching",
    "SciPy",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "lindblad-solver",
      text: "Implements a Lindblad master equation solver for open quantum system density matrix evolution under T1 and T2 relaxation.",
    },
    {
      id: "stabilizer-code",
      text: "Constructs 9-qubit Shor code and distance-3 planar surface code syndrome extraction circuits.",
    },
    {
      id: "syndrome-decoding",
      text: "Integrates Minimum Weight Perfect Matching (MWPM) decoding using PyMatching to process error syndromes.",
    },
    {
      id: "noise-channels",
      text: "Models depolarizing, bit-flip, and phase-flip noise channels across multi-round syndrome extraction cycles.",
    },
    {
      id: "logical-error-rate",
      text: "Calculates logical qubit error rates vs physical error rates to locate the fault-tolerant threshold.",
    },
    {
      id: "nonlocality-checker",
      text: "Includes a module evaluating Bell-CHSH inequality violations and quantum mutual information / Von Neumann entropy metrics.",
    },
    {
      id: "paper-reproduction-cli",
      text: "CLI runner that reproduces a benchmark error-threshold curve plot and outputs structured JSON simulation metrics.",
    },
    {
      id: "tests",
      text: "Automated test suite verifying Lindblad trace preservation, syndrome parity extraction, and MWPM graph decoder outputs.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README explaining quantum theoretical formulations, Lindbladian math, surface code layouts, and simulation execution.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile containerizing all scientific packages (Stim, PyMatching, SciPy) and execution entry points.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running unit tests and scientific sanity checks on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "surface-code-decoding",
      name: "Surface Codes & Fault Tolerance",
      weight: 25,
      layerId: "quantum-researcher-5",
      description:
        "Accurate stabilizer syndrome extraction, error graph construction, and MWPM decoder performance.",
    },
    {
      id: "open-systems-math",
      name: "Open Quantum Systems & Lindbladians",
      weight: 20,
      layerId: "quantum-researcher-9",
      description:
        "Correct formulation of density matrices, Lindblad operators, and relaxation trajectory dynamics.",
    },
    {
      id: "qec-theory",
      name: "Quantum Error Correction Theory",
      weight: 15,
      layerId: "quantum-researcher-3",
      description:
        "Rigorous setup of 3-qubit, 9-qubit Shor, and stabilizer formalism rules.",
    },
    {
      id: "information-theory",
      name: "Quantum Information Metrics",
      weight: 15,
      layerId: "quantum-researcher-2",
      description:
        "Proper calculation of Von Neumann entropy, quantum mutual information, and nonlocality bounds.",
    },
    {
      id: "testing",
      name: "Simulation Sanity & Unit Testing",
      weight: 15,
      layerId: "quantum-researcher-1",
      description:
        "Tests verifying density trace preservation, positive semi-definiteness, and syndrome correctness.",
    },
    {
      id: "reproducibility",
      name: "Research Reproducibility & Docs",
      weight: 10,
      layerId: "quantum-researcher-10",
      description:
        "Clear CLI execution, clean scientific plots, and LaTeX/markdown theoretical derivations in docs.",
    },
  ],

  twistPool: [
    {
      id: "qsharp-verification",
      text: "Include a auxiliary Q# program verification module verifying circuit adjoint/controlled functor correctness.",
    },
    {
      id: "magic-state-distillation",
      text: "Implement a 15-to-1 magic state distillation circuit model calculating T-gate error reduction yield.",
    },
    {
      id: "toric-code-periodic",
      text: "Extend surface code layout to periodic boundary conditions (Toric Code topology) and compare threshold shifts.",
    },
    {
      id: "pulse-level-hamiltonian",
      text: "Add pulse-level Schrödinger equation solver using Magnus expansion to model gate execution errors from first principles.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
