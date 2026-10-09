/**
 * Capstone brief — quantum-hardware track (quantum-hardware), v1.
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
  trackId: "quantum-hardware",
  categoryId: "quantum",
  slug: "quantum-hardware-calibration-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Superconducting Qubit Pulse Control & Automated Calibration Pipeline",
  summary:
    "Build a quantum hardware calibration and pulse-level control framework using Qiskit Pulse or Qblox/LabOne simulation. " +
    "Simulate transmon Rabi oscillations, DRAG pulse envelope tuning, dispersive readout state discrimination, and automated T1/T2 Ramsey calibration sequences.",
  stack: [
    "Python",
    "Qiskit Dynamics / Qiskit Pulse",
    "NumPy",
    "SciPy",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "transmon-hamiltonian",
      text: "Models transmon qubit Hamiltonian including Duffing oscillator anharmonicity and drive terms.",
    },
    {
      id: "pulse-generator",
      text: "Generates calibrated microwave pulses (Gaussian, DRAG) to reduce leakage into higher energy states (|2>).",
    },
    {
      id: "rabi-ramsey-sim",
      text: "Simulates Rabi oscillation, T1 relaxation decay, and T2 Ramsey / Spin Echo decay experiments.",
    },
    {
      id: "dispersive-readout",
      text: "Implements dispersive cavity readout simulation, processing IQ plane raw signals into state discrimination clusters (|0> vs |1>).",
    },
    {
      id: "crosstalk-characterization",
      text: "Quantifies parasitic ZZ crosstalk coupling between neighboring qubits via joint Ramsey pulse sequences.",
    },
    {
      id: "auto-calibration-engine",
      text: "Automates multi-stage calibration pipeline: frequency search -> Rabi amplitude sweep -> DRAG parameter optimization -> state classification.",
    },
    {
      id: "drift-tracker",
      text: "Tracks qubit frequency drift over time and updates gate calibration parameters dynamically.",
    },
    {
      id: "tests",
      text: "Unit tests verifying Hamiltonian pulse integrations, IQ classification accuracy, and calibration sweep convergence.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README documenting physics equations, pulse schedule diagrams, calibration pipeline flow, and execution.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile encapsulating Python pulse simulation dependencies and test runners.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running unit tests and pulse synthesis validations on code push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "pulse-design",
      name: "Pulse Design & DRAG Envelope Optimization",
      weight: 25,
      layerId: "quantum-hardware-3",
      description:
        "Accurate pulse synthesis, Rabi frequency control, and leakage minimization using DRAG.",
    },
    {
      id: "calibration-automation",
      name: "Calibration Pipeline & Drift Control",
      weight: 20,
      layerId: "quantum-hardware-8",
      description:
        "Robust automated pipeline conducting parameter sweeps and tracking environmental drift.",
    },
    {
      id: "physics-modeling",
      name: "Transmon Physics & Anharmonicity",
      weight: 15,
      layerId: "quantum-hardware-2",
      description:
        "Correct Hamiltonian formulation for Josephson junction / Duffing oscillator systems.",
    },
    {
      id: "readout-discrimination",
      name: "Dispersive Readout & IQ Processing",
      weight: 15,
      layerId: "quantum-hardware-4",
      description:
        "Proper IQ measurement signal processing and machine learning/GMM state discrimination.",
    },
    {
      id: "benchmarking-crosstalk",
      name: "Benchmarking & Crosstalk Analysis",
      weight: 15,
      layerId: "quantum-hardware-5",
      description:
        "Effective characterization of T1, T2, Spin Echo, and two-qubit ZZ crosstalk interactions.",
    },
    {
      id: "documentation",
      name: "Documentation & Technical Quality",
      weight: 10,
      layerId: "quantum-hardware-9",
      description:
        "Detailed physical explanations, clean pulse plotting utilities, and clear setup steps.",
    },
  ],

  twistPool: [
    {
      id: "cross-resonance-gate",
      text: "Implement a two-qubit Cross-Resonance (CR) pulse sequence optimization for all-microwave CNOT gate synthesis.",
    },
    {
      id: "trapped-ion-molmer-sorensen",
      text: "Add a trapped-ion module simulating laser-driven Mølmer-Sørensen entangling gate pulse schedules.",
    },
    {
      id: "bayesian-calibration",
      text: "Use Bayesian optimization for automated pulse parameter estimation instead of grid sweeps to accelerate calibration time.",
    },
    {
      id: "cryogenic-thermal-model",
      text: "Model thermal population changes at 15 mK and calculate thermal state readout noise budgets.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
