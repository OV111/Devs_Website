/**
 * Capstone brief — quantum-ml track (quantum-ml), v1.
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
  trackId: "quantum-ml",
  categoryId: "quantum",
  slug: "quantum-ml-classification-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Hybrid Quantum-Classical Classification Platform",
  summary:
    "Develop a hybrid quantum machine learning framework in PennyLane that trains variational quantum classifiers (VQC) " +
    "and quantum kernel SVMs on dataset benchmarks, evaluating parameter shift gradient updates and noise resilience.",
  stack: [
    "Python",
    "PennyLane",
    "PyTorch or TensorFlow",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "data-encoding",
      text: "Implements multiple data encoding strategies (angle encoding, amplitude encoding, and IQP feature maps).",
    },
    {
      id: "vqc-architecture",
      text: "Builds a Variational Quantum Classifier (VQC) with parameterized strongly entangling layers and customizable loss functions.",
    },
    {
      id: "parameter-shift",
      text: "Uses the parameter-shift rule to calculate exact gradients of quantum nodes during optimization.",
    },
    {
      id: "quantum-kernel",
      text: "Implements a Quantum Support Vector Classifier (QSVC) using a fidelity-based quantum feature kernel matrix.",
    },
    {
      id: "hybrid-pipeline",
      text: "Combines a classical PyTorch/TensorFlow linear feature extractor with a quantum circuit layer in a unified end-to-end model.",
    },
    {
      id: "evaluation-metrics",
      text: "Logs classification accuracy, loss curves, confusion matrices, and model expressibility metrics.",
    },
    {
      id: "noise-mitigation",
      text: "Supports simulated device noise training and applies Zero-Noise Extrapolation (ZNE) to expectation values.",
    },
    {
      id: "tests",
      text: "Tests cover data encoding output dimensions, parameter-shift gradient validity, and loss convergence.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README describes architecture diagrams, model training steps, and hyperparameter choices.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile provisions Python environment, PennyLane dependencies, and evaluation scripts.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes code formatting, linting, and automated unit tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "qml-architecture",
      name: "QML Architecture & Encoding",
      weight: 25,
      layerId: "quantum-ml-3",
      description:
        "Correct implementation of parameterized variational circuits, ansatz designs, and encoding routines.",
    },
    {
      id: "hybrid-integration",
      name: "Hybrid Optimization & Gradients",
      weight: 20,
      layerId: "quantum-ml-1",
      description:
        "Effective combination of classical ML frameworks with PennyLane parameter-shift updates.",
    },
    {
      id: "kernel-methods",
      name: "Quantum Kernels & Feature Maps",
      weight: 15,
      layerId: "quantum-ml-4",
      description:
        "Accurate evaluation of quantum kernel matrices and SVM integration.",
    },
    {
      id: "noise-handling",
      name: "Hardware Noise & Mitigation",
      weight: 15,
      layerId: "quantum-ml-9",
      description:
        "Proper noise model simulation and application of mitigation strategies like ZNE.",
    },
    {
      id: "testing",
      name: "Validation & Testing",
      weight: 15,
      layerId: "quantum-ml-5",
      description:
        "Comprehensive tests for gradient calculations, state normalization, and model convergence.",
    },
    {
      id: "reproducibility",
      name: "Documentation & Operability",
      weight: 10,
      layerId: "quantum-ml-8",
      description:
        "Clear instructions to run training pipelines, reproduce benchmarks, and configure models.",
    },
  ],

  twistPool: [
    {
      id: "qgan-generator",
      text: "Add a Quantum Generative Adversarial Network (QGAN) module that generates synthetic samples matching a target probability distribution.",
    },
    {
      id: "qnlp-sentence-circuit",
      text: "Implement a Quantum Natural Language Processing (QNLP) classification pipeline using Lambeq or grammatical syntax circuits.",
    },
    {
      id: "barren-plateau-mitigation",
      text: "Incorporate layer-wise initialization heuristics to prevent barren plateaus in deep variational ansatzes.",
    },
    {
      id: "projected-quantum-kernel",
      text: "Implement projected quantum kernels to reduce high-dimensional state space collapse on classical projections.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
