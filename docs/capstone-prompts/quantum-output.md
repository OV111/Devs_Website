/**
 * Capstone brief — Quantum Simulation track (quantum-simulation), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["Python", "PySCF", "Qiskit Nature or OpenFermion", "Docker", "GitHub Actions"],

  requirements: [
    { id: "fermionic-mapping", text: "Transforms molecular electronic Hamiltonians and Fermi-Hubbard spin systems into qubit operators using Jordan-Wigner and Bravyi-Kitaev mappings." },
    { id: "vqe-solver", text: "Implements Variational Quantum Eigensolver (VQE) with UCCSD and hardware-efficient ansatzes to calculate molecular dissociation curves." },
    { id: "trotter-evolution", text: "Constructs real-time dynamics circuits using 1st and 2nd order Suzuki-Trotter product formula decompositions." },
    { id: "quantum-phase-estimation", text: "Includes a Quantum Phase Estimation (QPE) subroutine for high-precision molecular eigenvalue estimation." },
    { id: "excited-states", text: "Implements Quantum Subspace Expansion (QSE) or Equation of Motion (QEoM) methods to compute molecular excited state energy gaps." },
    { id: "noise-mitigated-expectation", text: "Applies symmetry verification post-processing and Zero-Noise Extrapolation (ZNE) to expectation values calculated under simulated device noise." },
    { id: "exact-diagonalization", text: "Provides classical Full Configuration Interaction (FCI) / exact diagonalization benchmarking to calculate simulation energy errors." },
    { id: "tests", text: "Unit tests verifying Jordan-Wigner anti-commutation relations, Trotter step unitarity, and VQE energy convergence within chemical accuracy (1.6 mHa).", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README detailing second-quantization derivations, molecular geometry settings, Trotter error bounds, and execution instructions.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile configuring computational chemistry libraries (PySCF, OpenFermion, Qiskit Nature) and test runners.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running unit tests and chemistry convergence checks on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "vqe-uccsd", name: "VQE & Variational Ansatz Construction", weight: 25, layerId: "quantum-simulation-3", description: "Accurate implementation of UCCSD, parameter optimization loops, and ground state energy estimation." },
    { id: "second-quantization", name: "Fermionic Mappings & Second Quantization", weight: 20, layerId: "quantum-simulation-2", description: "Correct creation/annihilation operator transformations into Pauli strings via Jordan-Wigner." },
    { id: "hamiltonian-dynamics", name: "Real-Time Dynamics & Trotterization", weight: 15, layerId: "quantum-simulation-4", description: "Proper construction of Trotter-Suzuki product formulas and evolution error management." },
    { id: "excited-states-qpe", name: "Excited States & Phase Estimation", weight: 15, layerId: "quantum-simulation-5", description: "Correct calculation of energy spectra using Quantum Phase Estimation and QSE/QEoM methods." },
    { id: "testing", name: "Chemical Accuracy & Unit Testing", weight: 15, layerId: "quantum-simulation-9", description: "Rigorous test coverage asserting energy outputs remain within chemical accuracy of FCI." },
    { id: "documentation", name: "Documentation & Operability", weight: 10, layerId: "quantum-simulation-1", description: "Clear instructions for molecular configuration, execution pipelines, and scientific background." },
  ],

  twistPool: [
    { id: "tdvqe-time-dependent", text: "Implement Time-Dependent VQE (TDVQE) using McLachlan's variational principle for real-time quantum dynamics." },
    { id: "active-space-reduction", text: "Incorporate active space freezing heuristics to simulate larger molecules by truncating inactive core orbitals." },
    { id: "heisenberg-spin-chain", text: "Add a 1D Heisenberg XXZ spin chain lattice model simulation tracking magnetization order parameters across phase transitions." },
    { id: "lcu-simulation", text: "Implement Linear Combination of Unitaries (LCU) Taylor series Hamiltonian evolution circuits instead of Trotter decomposition." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Optimization track (quantum-optimization), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "quantum-optimization",
  categoryId: "quantum",
  slug: "quantum-optimization-qubo-qaoa-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Combinatorial Optimization Engine: QUBO, QAOA, and Quantum Annealing",
  summary:
    "Build a quantum-assisted combinatorial optimization platform that formulates complex NP-hard problems (Max-Cut, Portfolio, VRP) " +
    "into QUBO and Ising models, solving them via QAOA parameter optimization and D-Wave quantum annealing simulation.",
  stack: ["Python", "Qiskit Optimization or D-Wave Ocean SDK", "NetworkX", "Docker", "GitHub Actions"],

  requirements: [
    { id: "qubo-converter", text: "Implements automated mapping of combinatorial graph problems (Max-Cut and TSP/VRP) into Ising Hamiltonians and QUBO matrices." },
    { id: "qaoa-solver", text: "Constructs QAOA circuits with customizable depth p, cost Hamiltonians, and X/XY mixer operators." },
    { id: "parameter-optimizer", text: "Executes classical optimization (COBYLA, SPSA) on QAOA parameters gamma and beta to find ground state energy levels." },
    { id: "annealing-simulator", text: "Simulates quantum annealing on D-Wave Pegasus topology graphs with configurable schedule rates and transverse field ramps." },
    { id: "constraint-penalty", text: "Implements quadratic penalty multiplier formulations for constrained combinatorial optimization problems." },
    { id: "classical-benchmarker", text: "Compares quantum optimization solution quality (approximation ratio and time-to-solution) against classical branch-and-bound / brute-force solvers." },
    { id: "portfolio-finance-module", text: "Includes a Markowitz mean-variance portfolio optimization module with cardinality and budget penalty terms mapped to QUBO." },
    { id: "tests", text: "Automated test suite verifying QUBO matrix construction accuracy, QAOA ground state convergence on small graphs, and penalty term validity.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README detailing problem mappings, QUBO mathematical derivations, QAOA parameter landscapes, and usage guides.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile provisioning optimization dependencies (Qiskit, Ocean SDK, NetworkX) and execution scripts.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running unit tests and benchmark suite verification on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "qubo-formulation", name: "QUBO Mapping & Ising Formulations", weight: 25, layerId: "quantum-optimization-2", description: "Correct translation of combinatorial objective functions and constraints into QUBO matrices." },
    { id: "qaoa-implementation", name: "QAOA Circuit & Mixer Optimization", weight: 20, layerId: "quantum-optimization-4", description: "Accurate QAOA ansatz construction, mixer selection, and classical parameter loop convergence." },
    { id: "annealing-theory", name: "Quantum Annealing & Topology Modeling", weight: 15, layerId: "quantum-optimization-3", description: "Proper formulation of transverse-field annealing schedules and minor embedding considerations." },
    { id: "domain-applications", name: "Finance & Logistics Application Mapping", weight: 15, layerId: "quantum-optimization-7", description: "Effective modeling of real-world portfolio and vehicle routing constraints into quadratic penalties." },
    { id: "testing", name: "Validation & Benchmarking Tests", weight: 15, layerId: "quantum-optimization-9", description: "Tests validating approximation ratios, ground state energy convergence, and classical comparisons." },
    { id: "documentation", name: "Documentation & Technical Clarity", weight: 10, layerId: "quantum-optimization-1", description: "Clear explanation of penalty parameter tuning, execution commands, and optimization landscapes." },
  ],

  twistPool: [
    { id: "rqaoa-recursive", text: "Implement Recursive QAOA (RQAOA) to eliminate variables iteratively and solve large-scale instances beyond circuit capacity." },
    { id: "counterdiabatic-driving", text: "Incorporate counterdiabatic driving terms into the QAOA mixer to prevent non-adiabatic transitions at low circuit depths." },
    { id: "cvar-risk-aggregation", text: "Implement Conditional Value at Risk (CVaR) expectation aggregation instead of standard mean expectation in the QAOA cost function." },
    { id: "job-shop-scheduling", text: "Add a job shop scheduling problem (JSSP) parser and converter that transforms resource precedence constraints into QUBO penalization terms." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Hardware Engineer track (quantum-hardware), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["Python", "Qiskit Dynamics / Qiskit Pulse", "NumPy", "SciPy", "Docker", "GitHub Actions"],

  requirements: [
    { id: "transmon-hamiltonian", text: "Models transmon qubit Hamiltonian including Duffing oscillator anharmonicity and drive terms." },
    { id: "pulse-generator", text: "Generates calibrated microwave pulses (Gaussian, DRAG) to reduce leakage into higher energy states (|2>)." },
    { id: "rabi-ramsey-sim", text: "Simulates Rabi oscillation, T1 relaxation decay, and T2 Ramsey / Spin Echo decay experiments." },
    { id: "dispersive-readout", text: "Implements dispersive cavity readout simulation, processing IQ plane raw signals into state discrimination clusters (|0> vs |1>)." },
    { id: "crosstalk-characterization", text: "Quantifies parasitic ZZ crosstalk coupling between neighboring qubits via joint Ramsey pulse sequences." },
    { id: "auto-calibration-engine", text: "Automates multi-stage calibration pipeline: frequency search -> Rabi amplitude sweep -> DRAG parameter optimization -> state classification." },
    { id: "drift-tracker", text: "Tracks qubit frequency drift over time and updates gate calibration parameters dynamically." },
    { id: "tests", text: "Unit tests verifying Hamiltonian pulse integrations, IQ classification accuracy, and calibration sweep convergence.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README documenting physics equations, pulse schedule diagrams, calibration pipeline flow, and execution.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile encapsulating Python pulse simulation dependencies and test runners.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running unit tests and pulse synthesis validations on code push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "pulse-design", name: "Pulse Design & DRAG Envelope Optimization", weight: 25, layerId: "quantum-hardware-3", description: "Accurate pulse synthesis, Rabi frequency control, and leakage minimization using DRAG." },
    { id: "calibration-automation", name: "Calibration Pipeline & Drift Control", weight: 20, layerId: "quantum-hardware-8", description: "Robust automated pipeline conducting parameter sweeps and tracking environmental drift." },
    { id: "physics-modeling", name: "Transmon Physics & Anharmonicity", weight: 15, layerId: "quantum-hardware-2", description: "Correct Hamiltonian formulation for Josephson junction / Duffing oscillator systems." },
    { id: "readout-discrimination", name: "Dispersive Readout & IQ Processing", weight: 15, layerId: "quantum-hardware-4", description: "Proper IQ measurement signal processing and machine learning/GMM state discrimination." },
    { id: "benchmarking-crosstalk", name: "Benchmarking & Crosstalk Analysis", weight: 15, layerId: "quantum-hardware-5", description: "Effective characterization of T1, T2, Spin Echo, and two-qubit ZZ crosstalk interactions." },
    { id: "documentation", name: "Documentation & Technical Quality", weight: 10, layerId: "quantum-hardware-9", description: "Detailed physical explanations, clean pulse plotting utilities, and clear setup steps." },
  ],

  twistPool: [
    { id: "cross-resonance-gate", text: "Implement a two-qubit Cross-Resonance (CR) pulse sequence optimization for all-microwave CNOT gate synthesis." },
    { id: "trapped-ion-molmer-sorensen", text: "Add a trapped-ion module simulating laser-driven Mølmer-Sørensen entangling gate pulse schedules." },
    { id: "bayesian-calibration", text: "Use Bayesian optimization for automated pulse parameter estimation instead of grid sweeps to accelerate calibration time." },
    { id: "cryogenic-thermal-model", text: "Model thermal population changes at 15 mK and calculate thermal state readout noise budgets." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Researcher track (quantum-researcher), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["Python", "Qiskit or Stim", "PyMatching", "SciPy", "Docker", "GitHub Actions"],

  requirements: [
    { id: "lindblad-solver", text: "Implements a Lindblad master equation solver for open quantum system density matrix evolution under T1 and T2 relaxation." },
    { id: "stabilizer-code", text: "Constructs 9-qubit Shor code and distance-3 planar surface code syndrome extraction circuits." },
    { id: "syndrome-decoding", text: "Integrates Minimum Weight Perfect Matching (MWPM) decoding using PyMatching to process error syndromes." },
    { id: "noise-channels", text: "Models depolarizing, bit-flip, and phase-flip noise channels across multi-round syndrome extraction cycles." },
    { id: "logical-error-rate", text: "Calculates logical qubit error rates vs physical error rates to locate the fault-tolerant threshold." },
    { id: "nonlocality-checker", text: "Includes a module evaluating Bell-CHSH inequality violations and quantum mutual information / Von Neumann entropy metrics." },
    { id: "paper-reproduction-cli", text: "CLI runner that reproduces a benchmark error-threshold curve plot and outputs structured JSON simulation metrics." },
    { id: "tests", text: "Automated test suite verifying Lindblad trace preservation, syndrome parity extraction, and MWPM graph decoder outputs.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README explaining quantum theoretical formulations, Lindbladian math, surface code layouts, and simulation execution.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile containerizing all scientific packages (Stim, PyMatching, SciPy) and execution entry points.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running unit tests and scientific sanity checks on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "surface-code-decoding", name: "Surface Codes & Fault Tolerance", weight: 25, layerId: "quantum-researcher-5", description: "Accurate stabilizer syndrome extraction, error graph construction, and MWPM decoder performance." },
    { id: "open-systems-math", name: "Open Quantum Systems & Lindbladians", weight: 20, layerId: "quantum-researcher-9", description: "Correct formulation of density matrices, Lindblad operators, and relaxation trajectory dynamics." },
    { id: "qec-theory", name: "Quantum Error Correction Theory", weight: 15, layerId: "quantum-researcher-3", description: "Rigorous setup of 3-qubit, 9-qubit Shor, and stabilizer formalism rules." },
    { id: "information-theory", name: "Quantum Information Metrics", weight: 15, layerId: "quantum-researcher-2", description: "Proper calculation of Von Neumann entropy, quantum mutual information, and nonlocality bounds." },
    { id: "testing", name: "Simulation Sanity & Unit Testing", weight: 15, layerId: "quantum-researcher-1", description: "Tests verifying density trace preservation, positive semi-definiteness, and syndrome correctness." },
    { id: "reproducibility", name: "Research Reproducibility & Docs", weight: 10, layerId: "quantum-researcher-10", description: "Clear CLI execution, clean scientific plots, and LaTeX/markdown theoretical derivations in docs." },
  ],

  twistPool: [
    { id: "qsharp-verification", text: "Include a auxiliary Q# program verification module verifying circuit adjoint/controlled functor correctness." },
    { id: "magic-state-distillation", text: "Implement a 15-to-1 magic state distillation circuit model calculating T-gate error reduction yield." },
    { id: "toric-code-periodic", text: "Extend surface code layout to periodic boundary conditions (Toric Code topology) and compare threshold shifts." },
    { id: "pulse-level-hamiltonian", text: "Add pulse-level Schrödinger equation solver using Magnus expansion to model gate execution errors from first principles." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Cryptography track (quantum-crypto), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "quantum-crypto",
  categoryId: "quantum",
  slug: "quantum-crypto-qkd-pqc-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Quantum Key Distribution Simulator and Post-Quantum Security Gateway",
  summary:
    "Build an end-to-end quantum security simulator that implements BB84 key exchange over noisy optical channels with eavesdropper detection, " +
    "paired with a post-quantum cryptographic (PQC) proxy gateway utilizing ML-KEM (Kyber) key encapsulation.",
  stack: ["Python", "liboqs / oqs-python", "Qiskit or SimulaQron", "Docker", "GitHub Actions"],

  requirements: [
    { id: "bb84-protocol", text: "Implements BB84 QKD protocol simulation including random basis choice, qubit transmission, sifting, and raw key generation." },
    { id: "eavesdropper-detection", text: "Simulates Eve intercept-resend attacks and calculates quantum bit error rate (QBER) to detect eavesdropping thresholds." },
    { id: "error-reconciliation", text: "Implements cascade error reconciliation and privacy amplification to produce secure final shared keys." },
    { id: "pqc-kem-integration", text: "Integrates NIST-standardized lattice key encapsulation (ML-KEM / Kyber) for classical channel protection via liboqs." },
    { id: "qrng-entropy-source", text: "Includes a quantum random number generator (QRNG) module simulating projective measurements for non-deterministic key generation." },
    { id: "tls-hybrid-proxy", text: "Implements a local proxy server that negotiates hybrid quantum-safe (Kyber + ECDH) session keys for client-server traffic." },
    { id: "auth-and-otp", text: "Provides quantum message authentication and one-time pad (OTP) encryption for sensitive payload transmission." },
    { id: "tests", text: "Automated test suite verifying QBER thresholds, PQC key agreement, and OTP encryption/decryption cycles.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README detailing protocol architecture, QBER math, PQC integration steps, and setup instructions.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile or Docker Compose setting up the QKD simulator nodes and PQC proxy environment.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running linting and automated cryptographic tests.", check: CHECKS.ci },
    { id: "env-example", text: "Environment config file defining channel attenuation parameters, noise ratios, and PQC algorithm parameters.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "qkd-implementation", name: "Quantum Key Distribution & Sifting", weight: 25, layerId: "quantum-crypto-2", description: "Accurate implementation of BB84 sifting, channel noise, QBER calculation, and privacy amplification." },
    { id: "pqc-integration", name: "Post-Quantum Cryptography Integration", weight: 20, layerId: "quantum-crypto-4", description: "Correct implementation of lattice-based KEM primitives and hybrid TLS session negotiation." },
    { id: "crypto-security", name: "Quantum Threat Defense & Authentication", weight: 15, layerId: "quantum-crypto-7", description: "Proper use of QRNG sources, quantum message authentication, and unhackable OTP boundaries." },
    { id: "code-structure", name: "Architecture & Network Simulation", weight: 15, layerId: "quantum-crypto-8", description: "Modular design separating Alice/Bob/Eve nodes, network sockets, and cryptographic primitives." },
    { id: "testing", name: "Cryptographic & Protocol Testing", weight: 15, layerId: "quantum-crypto-6", description: "Comprehensive tests validating noise thresholds, eavesdropper alerts, and key consistency." },
    { id: "documentation", name: "Documentation & Operability", weight: 10, layerId: "quantum-crypto-1", description: "Clear explanation of quantum threat models, mathematical security proofs, and setup guides." },
  ],

  twistPool: [
    { id: "e91-entanglement-qkd", text: "Implement Ekert91 (E91) QKD protocol based on entangled Bell pairs and CHSH inequality violation verification." },
    { id: "pqc-signature-sphincs", text: "Add stateless hash-based digital signature verification (SLH-DSA / SPHINCS+) for firmware/message signing." },
    { id: "cv-qkd-simulation", text: "Add Continuous-Variable QKD (CV-QKD) simulation using Gaussian-modulated coherent states instead of discrete single photons." },
    { id: "secret-sharing-threshold", text: "Implement a quantum secret sharing (QSS) scheme distributing a secret key across 3 receiver nodes requiring majority threshold reconstruction." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum ML track (quantum-ml), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["Python", "PennyLane", "PyTorch or TensorFlow", "Docker", "GitHub Actions"],

  requirements: [
    { id: "data-encoding", text: "Implements multiple data encoding strategies (angle encoding, amplitude encoding, and IQP feature maps)." },
    { id: "vqc-architecture", text: "Builds a Variational Quantum Classifier (VQC) with parameterized strongly entangling layers and customizable loss functions." },
    { id: "parameter-shift", text: "Uses the parameter-shift rule to calculate exact gradients of quantum nodes during optimization." },
    { id: "quantum-kernel", text: "Implements a Quantum Support Vector Classifier (QSVC) using a fidelity-based quantum feature kernel matrix." },
    { id: "hybrid-pipeline", text: "Combines a classical PyTorch/TensorFlow linear feature extractor with a quantum circuit layer in a unified end-to-end model." },
    { id: "evaluation-metrics", text: "Logs classification accuracy, loss curves, confusion matrices, and model expressibility metrics." },
    { id: "noise-mitigation", text: "Supports simulated device noise training and applies Zero-Noise Extrapolation (ZNE) to expectation values." },
    { id: "tests", text: "Tests cover data encoding output dimensions, parameter-shift gradient validity, and loss convergence.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README describes architecture diagrams, model training steps, and hyperparameter choices.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile provisions Python environment, PennyLane dependencies, and evaluation scripts.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow executes code formatting, linting, and automated unit tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "qml-architecture", name: "QML Architecture & Encoding", weight: 25, layerId: "quantum-ml-3", description: "Correct implementation of parameterized variational circuits, ansatz designs, and encoding routines." },
    { id: "hybrid-integration", name: "Hybrid Optimization & Gradients", weight: 20, layerId: "quantum-ml-1", description: "Effective combination of classical ML frameworks with PennyLane parameter-shift updates." },
    { id: "kernel-methods", name: "Quantum Kernels & Feature Maps", weight: 15, layerId: "quantum-ml-4", description: "Accurate evaluation of quantum kernel matrices and SVM integration." },
    { id: "noise-handling", name: "Hardware Noise & Mitigation", weight: 15, layerId: "quantum-ml-9", description: "Proper noise model simulation and application of mitigation strategies like ZNE." },
    { id: "testing", name: "Validation & Testing", weight: 15, layerId: "quantum-ml-5", description: "Comprehensive tests for gradient calculations, state normalization, and model convergence." },
    { id: "reproducibility", name: "Documentation & Operability", weight: 10, layerId: "quantum-ml-8", description: "Clear instructions to run training pipelines, reproduce benchmarks, and configure models." },
  ],

  twistPool: [
    { id: "qgan-generator", text: "Add a Quantum Generative Adversarial Network (QGAN) module that generates synthetic samples matching a target probability distribution." },
    { id: "qnlp-sentence-circuit", text: "Implement a Quantum Natural Language Processing (QNLP) classification pipeline using Lambeq or grammatical syntax circuits." },
    { id: "barren-plateau-mitigation", text: "Incorporate layer-wise initialization heuristics to prevent barren plateaus in deep variational ansatzes." },
    { id: "projected-quantum-kernel", text: "Implement projected quantum kernels to reduce high-dimensional state space collapse on classical projections." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Algorithms track (quantum-algorithms), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
    { id: "qft-module", text: "Implements n-qubit Quantum Fourier Transform (QFT) and Inverse QFT circuits with automated phase estimation capabilities." },
    { id: "grover-search", text: "Constructs Grover search circuits with configurable oracle boolean functions and optimal iteration count calculations." },
    { id: "hhl-solver", text: "Implements the HHL algorithm for solving sparse 2x2 or 4x4 linear systems of equations." },
    { id: "oracle-builder", text: "Provides a functional oracle generator that converts user-defined phase or marking criteria into quantum gates." },
    { id: "resource-estimator", text: "Calculates gate depth, CNOT count, and Clifford+T gate resource estimates for varying qubit sizes." },
    { id: "classical-verifier", text: "Includes a classical simulation engine to verify quantum results against exact numerical solutions." },
    { id: "cli-benchmarker", text: "Command-line interface or execution script to run algorithmic performance benchmarks across varying input sizes." },
    { id: "tests", text: "Automated test suite verifying correct outputs for QFT, Grover marking, and HHL linear system solutions.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README detailing mathematical background, algorithmic execution steps, and resource scaling formulas.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile packaging the benchmarking environment and algorithm execution scripts.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow running linting and automated algorithm tests on code push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "algorithmic-correctness", name: "Algorithm & Oracle Implementation", weight: 25, layerId: "quantum-algorithms-3", description: "Accurate implementation of QFT, Grover iterations, Phase Estimation, and HHL subroutines." },
    { id: "linear-algebra", name: "Mathematical Foundations & Verification", weight: 20, layerId: "quantum-algorithms-1", description: "Correct matrix formulations, continuous phase calculations, and numerical verifications." },
    { id: "resource-analysis", name: "Resource Estimation & Decomposition", weight: 15, layerId: "quantum-algorithms-10", description: "Precise counting of gate depths and Clifford+T trade-offs under fault-tolerant assumptions." },
    { id: "code-structure", name: "Software Structure & Modularity", weight: 15, layerId: "quantum-algorithms-2", description: "Modular separation of circuit construction, oracle synthesis, and analytical reporting." },
    { id: "testing", name: "Test Coverage & Edge Cases", weight: 15, layerId: "quantum-algorithms-5", description: "Robust unit tests validating edge-case inputs, bad condition numbers, and state overlaps." },
    { id: "documentation", name: "Documentation & Benchmarking", weight: 10, layerId: "quantum-algorithms-7", description: "Clear explanation of mathematical proofs, usage guides, and execution performance." },
  ],

  twistPool: [
    { id: "shor-period-finder", text: "Add a 15-factoring order-finding module leveraging modular exponentiation circuits and continued fractions post-processing." },
    { id: "trotter-simulation", text: "Implement a 1D spin chain Hamiltonian simulation module using first-order and second-order Trotter-Suzuki decompositions." },
    { id: "quantum-walk", text: "Add a discrete-time quantum random walk simulator on arbitrary graph topologies with hitting time measurements." },
    { id: "barren-plateau-detector", text: "Include a variance measurement utility for parameterized ansatzes to detect barren plateaus in high-dimensional landscapes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Quantum Developer track (quantum-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "quantum-developer",
  categoryId: "quantum",
  slug: "quantum-developer-job-runner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Quantum Circuit Execution & Analytics REST Service",
  summary:
    "Build an asynchronous REST service that constructs, transpiles, and executes parameterized quantum circuits " +
    "via Qiskit. The platform handles job queuing, noisy simulator backends, and classical post-processing of measurement results.",
  stack: ["Python", "Qiskit", "FastAPI or Flask", "Docker", "GitHub Actions"],

  requirements: [
    { id: "circuit-factory", text: "Implements parameterized quantum circuit templates (e.g. Bell state, GHZ state, and a custom parameterized ansatz) using Qiskit." },
    { id: "api-endpoints", text: "REST API endpoints allow clients to submit circuit execution jobs, query job status, and fetch measurement probability distributions." },
    { id: "backend-provider", text: "Executes circuits against Aer simulators with configurable shot counts and noise models mimicking real hardware topology." },
    { id: "transpilation", text: "Applies circuit optimization passes and transpilation targeted to specified qubit coupling maps before execution." },
    { id: "job-queue", text: "Asynchronous job execution engine processes circuit submissions in background workers without blocking the API." },
    { id: "error-mitigation", text: "Implements measurement readout error mitigation post-processing on raw shot outcome counts." },
    { id: "validation", text: "Validates input requests (qubit count limits, parameter bounds, shot limits) and returns 400 JSON errors for invalid payloads." },
    { id: "tests", text: "Unit and integration tests verify circuit construction logic, job API routes, and backend execution results.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README provides complete setup instructions, API endpoint documentation, and backend configuration steps.", check: CHECKS.readme },
    { id: "docker", text: "Dockerfile or Docker Compose builds and starts the API server and worker environment.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow runs linter and unit tests on push.", check: CHECKS.ci },
    { id: "env-example", text: "Environment configuration template provided for API keys and backend selection.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "circuit-design", name: "Circuit Construction & Transpilation", weight: 25, layerId: "quantum-developer-2", description: "Correct implementation of parameterized circuits and targeted transpilation passes." },
    { id: "architecture", name: "Software Architecture & API", weight: 20, layerId: "quantum-developer-10", description: "Clean separation between API routing, asynchronous job workers, and Qiskit execution layers." },
    { id: "noise-mitigation", name: "Noise & Error Handling", weight: 15, layerId: "quantum-developer-7", description: "Proper configuration of Aer noise models and post-processing readout error correction." },
    { id: "testing", name: "Quantum & API Testing", weight: 15, layerId: "quantum-developer-9", description: "Comprehensive test suite covering circuit logic, mocked backends, and HTTP endpoints." },
    { id: "robustness", name: "Validation & Error Responses", weight: 10, layerId: "quantum-developer-4", description: "Robust handling of invalid parameters, shot noise limits, and backend failures." },
    { id: "operability", name: "Documentation & Operations", weight: 15, layerId: "quantum-developer-8", description: "Clear execution instructions, environment variable management, and containerization." },
  ],

  twistPool: [
    { id: "dynamic-decoupling", text: "Add an optional dynamic decoupling pass during transpilation to inject echo pulses into idle qubit time slots." },
    { id: "ibm-runtime-bridge", text: "Integrate a real IBM Quantum account backend fallback when runtime credentials are provided in the request." },
    { id: "state-vector-exporter", text: "Expose an endpoint to return the exact statevector or density matrix for noiseless simulation runs up to 10 qubits." },
    { id: "custom-gate-decomposition", text: "Implement a custom unitary matrix submission endpoint that decomposes the matrix into standard basis gates." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};