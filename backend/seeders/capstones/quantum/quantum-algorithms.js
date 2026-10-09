/**
 * Capstone brief — quantum-algorithms track (quantum-algorithms), v1.
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
  trackId: "quantum-algorithms",
  categoryId: "quantum",
  slug: "quantum-algorithms-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Quantum Algorithm Evaluation and Resource Estimation Suite",
  summary:
    "Build an algorithmic benchmarking engine that implements core quantum algorithms (QFT, Grover, Phase Estimation, and HHL), " +
    "validates oracle queries, and computes fault-tolerant gate resource profiles (Clifford+T counts).",
  stack: ["Python", "Qiskit or Cirq", "NumPy", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "qft-module",
      text: "Implements n-qubit Quantum Fourier Transform (QFT) and Inverse QFT circuits with automated phase estimation capabilities.",
    },
    {
      id: "grover-search",
      text: "Constructs Grover search circuits with configurable oracle boolean functions and optimal iteration count calculations.",
    },
    {
      id: "hhl-solver",
      text: "Implements the HHL algorithm for solving sparse 2x2 or 4x4 linear systems of equations.",
    },
    {
      id: "oracle-builder",
      text: "Provides a functional oracle generator that converts user-defined phase or marking criteria into quantum gates.",
    },
    {
      id: "resource-estimator",
      text: "Calculates gate depth, CNOT count, and Clifford+T gate resource estimates for varying qubit sizes.",
    },
    {
      id: "classical-verifier",
      text: "Includes a classical simulation engine to verify quantum results against exact numerical solutions.",
    },
    {
      id: "cli-benchmarker",
      text: "Command-line interface or execution script to run algorithmic performance benchmarks across varying input sizes.",
    },
    {
      id: "tests",
      text: "Automated test suite verifying correct outputs for QFT, Grover marking, and HHL linear system solutions.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README detailing mathematical background, algorithmic execution steps, and resource scaling formulas.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile packaging the benchmarking environment and algorithm execution scripts.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running linting and automated algorithm tests on code push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "algorithmic-correctness",
      name: "Algorithm & Oracle Implementation",
      weight: 25,
      layerId: "quantum-algorithms-3",
      description:
        "Accurate implementation of QFT, Grover iterations, Phase Estimation, and HHL subroutines.",
    },
    {
      id: "linear-algebra",
      name: "Mathematical Foundations & Verification",
      weight: 20,
      layerId: "quantum-algorithms-1",
      description:
        "Correct matrix formulations, continuous phase calculations, and numerical verifications.",
    },
    {
      id: "resource-analysis",
      name: "Resource Estimation & Decomposition",
      weight: 15,
      layerId: "quantum-algorithms-10",
      description:
        "Precise counting of gate depths and Clifford+T trade-offs under fault-tolerant assumptions.",
    },
    {
      id: "code-structure",
      name: "Software Structure & Modularity",
      weight: 15,
      layerId: "quantum-algorithms-2",
      description:
        "Modular separation of circuit construction, oracle synthesis, and analytical reporting.",
    },
    {
      id: "testing",
      name: "Test Coverage & Edge Cases",
      weight: 15,
      layerId: "quantum-algorithms-5",
      description:
        "Robust unit tests validating edge-case inputs, bad condition numbers, and state overlaps.",
    },
    {
      id: "documentation",
      name: "Documentation & Benchmarking",
      weight: 10,
      layerId: "quantum-algorithms-7",
      description:
        "Clear explanation of mathematical proofs, usage guides, and execution performance.",
    },
  ],

  twistPool: [
    {
      id: "shor-period-finder",
      text: "Add a 15-factoring order-finding module leveraging modular exponentiation circuits and continued fractions post-processing.",
    },
    {
      id: "trotter-simulation",
      text: "Implement a 1D spin chain Hamiltonian simulation module using first-order and second-order Trotter-Suzuki decompositions.",
    },
    {
      id: "quantum-walk",
      text: "Add a discrete-time quantum random walk simulator on arbitrary graph topologies with hitting time measurements.",
    },
    {
      id: "barren-plateau-detector",
      text: "Include a variance measurement utility for parameterized ansatzes to detect barren plateaus in high-dimensional landscapes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
