/**
 * Capstone brief — quantum-simulation track (quantum-simulation), v1.
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
  trackId: "quantum-simulation",
  categoryId: "quantum",
  slug: "quantum-simulation-vqe-hamiltonian",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Molecular Energy and Condensed Matter Quantum Simulator",
  summary:
    "Build a quantum simulation framework using PySCF and Qiskit Nature or OpenFermion that computes electronic ground state energies " +
    "of small molecules (H2, LiH) via VQE and simulates real-time time-evolution of Fermi-Hubbard lattice Hamiltonians using Suzuki-Trotter formulas.",
  stack: [
    "Python",
    "PySCF",
    "Qiskit Nature or OpenFermion",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "fermionic-mapping",
      text: "Transforms molecular electronic Hamiltonians and Fermi-Hubbard spin systems into qubit operators using Jordan-Wigner and Bravyi-Kitaev mappings.",
    },
    {
      id: "vqe-solver",
      text: "Implements Variational Quantum Eigensolver (VQE) with UCCSD and hardware-efficient ansatzes to calculate molecular dissociation curves.",
    },
    {
      id: "trotter-evolution",
      text: "Constructs real-time dynamics circuits using 1st and 2nd order Suzuki-Trotter product formula decompositions.",
    },
    {
      id: "quantum-phase-estimation",
      text: "Includes a Quantum Phase Estimation (QPE) subroutine for high-precision molecular eigenvalue estimation.",
    },
    {
      id: "excited-states",
      text: "Implements Quantum Subspace Expansion (QSE) or Equation of Motion (QEoM) methods to compute molecular excited state energy gaps.",
    },
    {
      id: "noise-mitigated-expectation",
      text: "Applies symmetry verification post-processing and Zero-Noise Extrapolation (ZNE) to expectation values calculated under simulated device noise.",
    },
    {
      id: "exact-diagonalization",
      text: "Provides classical Full Configuration Interaction (FCI) / exact diagonalization benchmarking to calculate simulation energy errors.",
    },
    {
      id: "tests",
      text: "Unit tests verifying Jordan-Wigner anti-commutation relations, Trotter step unitarity, and VQE energy convergence within chemical accuracy (1.6 mHa).",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README detailing second-quantization derivations, molecular geometry settings, Trotter error bounds, and execution instructions.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile configuring computational chemistry libraries (PySCF, OpenFermion, Qiskit Nature) and test runners.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running unit tests and chemistry convergence checks on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "vqe-uccsd",
      name: "VQE & Variational Ansatz Construction",
      weight: 25,
      layerId: "quantum-simulation-3",
      description:
        "Accurate implementation of UCCSD, parameter optimization loops, and ground state energy estimation.",
    },
    {
      id: "second-quantization",
      name: "Fermionic Mappings & Second Quantization",
      weight: 20,
      layerId: "quantum-simulation-2",
      description:
        "Correct creation/annihilation operator transformations into Pauli strings via Jordan-Wigner.",
    },
    {
      id: "hamiltonian-dynamics",
      name: "Real-Time Dynamics & Trotterization",
      weight: 15,
      layerId: "quantum-simulation-4",
      description:
        "Proper construction of Trotter-Suzuki product formulas and evolution error management.",
    },
    {
      id: "excited-states-qpe",
      name: "Excited States & Phase Estimation",
      weight: 15,
      layerId: "quantum-simulation-5",
      description:
        "Correct calculation of energy spectra using Quantum Phase Estimation and QSE/QEoM methods.",
    },
    {
      id: "testing",
      name: "Chemical Accuracy & Unit Testing",
      weight: 15,
      layerId: "quantum-simulation-9",
      description:
        "Rigorous test coverage asserting energy outputs remain within chemical accuracy of FCI.",
    },
    {
      id: "documentation",
      name: "Documentation & Operability",
      weight: 10,
      layerId: "quantum-simulation-1",
      description:
        "Clear instructions for molecular configuration, execution pipelines, and scientific background.",
    },
  ],

  twistPool: [
    {
      id: "tdvqe-time-dependent",
      text: "Implement Time-Dependent VQE (TDVQE) using McLachlan's variational principle for real-time quantum dynamics.",
    },
    {
      id: "active-space-reduction",
      text: "Incorporate active space freezing heuristics to simulate larger molecules by truncating inactive core orbitals.",
    },
    {
      id: "heisenberg-spin-chain",
      text: "Add a 1D Heisenberg XXZ spin chain lattice model simulation tracking magnetization order parameters across phase transitions.",
    },
    {
      id: "lcu-simulation",
      text: "Implement Linear Combination of Unitaries (LCU) Taylor series Hamiltonian evolution circuits instead of Trotter decomposition.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
