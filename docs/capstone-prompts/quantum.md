You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (8 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/quantum/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "quantum" instead):

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
1. trackId = the track id exactly as given below. categoryId = "quantum". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
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

### quantum-developer — Quantum Developer
  - quantum-developer-1 | Foundations of Quantum Computing | topics: Qubit representation; Superposition principle; Entanglement basics; Bra-ket notation
  - quantum-developer-2 | Qiskit Setup and First Circuits | topics: Qiskit installation; QuantumCircuit API; Single-qubit gates; Multi-qubit gates
  - quantum-developer-3 | Quantum Gates and Unitary Operations | topics: Pauli gates X Y Z; Phase and T gates; CNOT and CZ gates; Toffoli gate
  - quantum-developer-4 | Quantum Measurement and Probability | topics: Projective measurement; Born rule; Shot noise; Density matrices
  - quantum-developer-5 | Quantum Algorithms Primer | topics: Deutsch-Jozsa algorithm; Bernstein-Vazirani algorithm; Simon's algorithm; Oracle construction
  - quantum-developer-6 | Variational Quantum Circuits | topics: Parameterized circuits; Ansatz design; VQE overview; QAOA overview
  - quantum-developer-7 | Quantum Error and Noise | topics: Bit-flip and phase-flip errors; Depolarizing noise; T1 and T2 relaxation; Aer noise models
  - quantum-developer-8 | Running on IBM Quantum Hardware | topics: IBM Quantum account setup; Qiskit Runtime primitives; Circuit transpilation; Qubit coupling maps
  - quantum-developer-9 | Quantum Software Engineering Patterns | topics: Unit testing quantum circuits; Mocking quantum backends; Circuit optimization passes; Quantum software design patterns
  - quantum-developer-10 | End-to-End Quantum Application Development | topics: Problem formulation for quantum; Quantum-classical interface design; REST API for quantum jobs; Result interpretation and visualization

### quantum-algorithms — Quantum Algorithms
  - quantum-algorithms-1 | Mathematical Prerequisites for Quantum Algorithms | topics: Complex vector spaces; Tensor products; Inner products and norms; Unitary matrices
  - quantum-algorithms-2 | Query Complexity and Oracle Models | topics: Oracle model definition; Decision vs function problems; Deutsch algorithm; Deutsch-Jozsa algorithm
  - quantum-algorithms-3 | Quantum Fourier Transform | topics: Classical DFT definition; QFT circuit construction; Phase estimation algorithm; QFT on n qubits
  - quantum-algorithms-4 | Shor's Factoring Algorithm | topics: RSA cryptography overview; Period finding reduction; Continued fractions algorithm; Quantum order finding
  - quantum-algorithms-5 | Grover's Search Algorithm | topics: Amplitude amplification; Oracle inversion about mean; Geometric rotation picture; Optimal iteration count
  - quantum-algorithms-6 | Quantum Walk Algorithms | topics: Classical random walks; Discrete quantum walks; Continuous-time quantum walks; Hitting time analysis
  - quantum-algorithms-7 | HHL and Quantum Linear Systems | topics: Linear systems problem formulation; Phase estimation subroutine in HHL; Controlled rotations for inversion; Sparsity and condition number requirements
  - quantum-algorithms-8 | Variational and Hybrid Algorithms | topics: VQE algorithm; QAOA algorithm; Ansatz expressibility; Barren plateaus in depth
  - quantum-algorithms-9 | Quantum Simulation Algorithms | topics: Hamiltonian simulation problem; Trotter-Suzuki decomposition; Product formula error bounds; LCU method
  - quantum-algorithms-10 | Fault-Tolerant Algorithm Design and Resource Estimation | topics: Clifford + T gate set; T-gate resource estimation; Magic state distillation overhead; Surface code requirements

### quantum-ml — Quantum ML
  - quantum-ml-1 | Classical ML and Quantum Computing Basics | topics: Supervised learning recap; Loss functions and gradients; Quantum state encoding; PennyLane installation
  - quantum-ml-2 | Data Encoding Strategies | topics: Basis encoding; Amplitude encoding; Angle encoding; IQP encoding
  - quantum-ml-3 | Variational Quantum Classifiers | topics: VQC architecture; StronglyEntanglingLayers; Parameter shift rule; Binary and multiclass encoding
  - quantum-ml-4 | Quantum Kernels and Support Vector Machines | topics: Kernel methods recap; Quantum feature map circuits; Fidelity kernel; Projected quantum kernel
  - quantum-ml-5 | Quantum Neural Networks | topics: QNN architecture design; Expressibility metric; Entangling power; Barren plateaus in QNNs
  - quantum-ml-6 | Quantum Generative Models | topics: Classical GAN recap; Quantum GAN architecture; Quantum Boltzmann machines; Born machine training
  - quantum-ml-7 | Quantum Natural Language Processing | topics: DisCoCat framework; Pregroup grammars; lambeq library; Quantum sentence circuits
  - quantum-ml-8 | Quantum Transfer Learning | topics: Transfer learning fundamentals; Hybrid classical-quantum architectures; Quantum layer as fine-tuning head; Dress and undress techniques
  - quantum-ml-9 | Quantum ML on Real Hardware | topics: Running PennyLane on IBM Q; Noise impact on QML models; Noise-aware training strategies; Zero-noise extrapolation for QML
  - quantum-ml-10 | Quantum Advantage in ML and Research Frontiers | topics: Quantum advantage criteria in ML; Dequantization theorems; Classical simulation limits; QML on non-Euclidean data

### quantum-crypto — Quantum Cryptography
  - quantum-crypto-1 | Classical Cryptography and Quantum Threats | topics: RSA and ECC overview; Shor's threat to public key crypto; Grover's threat to symmetric crypto; Harvest-now-decrypt-later attacks
  - quantum-crypto-2 | BB84 Quantum Key Distribution | topics: BB84 protocol steps; Conjugate bases; Sifting and reconciliation; Eavesdropper detection rate
  - quantum-crypto-3 | Advanced QKD Protocols | topics: E91 Ekert protocol; B92 two-state protocol; Six-state QKD; Continuous-variable QKD
  - quantum-crypto-4 | Lattice-Based Cryptography | topics: Lattice definition and properties; Shortest vector problem SVP; Learning with errors LWE; Ring-LWE variant
  - quantum-crypto-5 | Hash-Based and Code-Based Signatures | topics: Merkle tree signatures; XMSS stateful hash signatures; SPHINCS+ stateless signatures; McEliece code-based KEM
  - quantum-crypto-6 | Quantum Random Number Generation | topics: Randomness sources in quantum mechanics; QRNG vs PRNG; Certified randomness expansion; Device-independent QRNG
  - quantum-crypto-7 | Quantum Authentication and Secret Sharing | topics: Quantum message authentication; Quantum one-time pad; Quantum secret sharing; Threshold schemes
  - quantum-crypto-8 | Post-Quantum TLS and Protocol Migration | topics: TLS 1.3 overview; PQ hybrid key exchange; liboqs and OQS-OpenSSL; Kyber in TLS
  - quantum-crypto-9 | Security Proofs in Quantum Settings | topics: Classical random oracle model; Quantum random oracle model QROM; Quantum adversary model; Reduction-based security proofs
  - quantum-crypto-10 | Quantum Cryptography Research and Deployment | topics: Global QKD network deployments; Satellite QKD - Micius experiments; NIST PQC standard finalists analysis; Enterprise crypto migration strategy

### quantum-researcher — Quantum Researcher
  - quantum-researcher-1 | Quantum Mechanics for Quantum Computing Research | topics: Hilbert space formalism; Hermitian operators and observables; Spectral theorem; Density operator formalism
  - quantum-researcher-2 | Quantum Information Theory | topics: Von Neumann entropy; Quantum mutual information; Entanglement entropy; Holevo bound
  - quantum-researcher-3 | Quantum Error Correction Theory | topics: Classical error correction recap; 3-qubit bit-flip code; 9-qubit Shor code; Stabilizer formalism
  - quantum-researcher-4 | Hamiltonian Engineering and Quantum Control | topics: Schrodinger equation for quantum gates; Magnus expansion; Rotating wave approximation; Pulse-level control basics
  - quantum-researcher-5 | Surface Codes and Topological Error Correction | topics: Toric code construction; Surface code boundaries; Syndrome measurement circuits; MWPM decoding algorithm
  - quantum-researcher-6 | Q# and Quantum Program Verification | topics: Q# language syntax; Quantum development kit setup; Qubit allocation and operations; Adjoint and controlled functors
  - quantum-researcher-7 | Quantum Complexity and Computational Models | topics: BQP complexity class; QMA and quantum witnesses; QCMA class; Quantum PCP conjecture
  - quantum-researcher-8 | Quantum Communication and Nonlocality | topics: Bell inequalities; CHSH game; Tsirelson bound; Quantum teleportation
  - quantum-researcher-9 | Open Quantum Systems and Decoherence | topics: Lindblad master equation; Markovian approximation; Lindblad operators; T1 and T2 processes in Lindblad form
  - quantum-researcher-10 | Research Frontiers and Original Contribution | topics: Reading quantum research papers; Identifying open problems; Proof techniques in QC research; arXiv preprint workflow

### quantum-hardware — Quantum Hardware Engineer
  - quantum-hardware-1 | Physics of Quantum Hardware Platforms | topics: Superconducting qubit types; Transmon qubit physics; Ion trap fundamentals; Photonic quantum computing
  - quantum-hardware-2 | Superconducting Qubit Circuit Theory | topics: LC oscillator quantization; Josephson junction physics; Cooper pair box qubit; Transmon regime
  - quantum-hardware-3 | Quantum Gate Implementation and Pulse Design | topics: Rabi oscillations; Microwave pulse shaping; DRAG pulses for leakage reduction; Cross-resonance gate
  - quantum-hardware-4 | Qubit Readout and State Discrimination | topics: Dispersive readout mechanism; Cavity-qubit coupling for readout; IQ plane measurement; State discrimination algorithms
  - quantum-hardware-5 | Quantum Characterization and Benchmarking | topics: Rabi experiment; T1 measurement; T2 Ramsey and echo; Quantum process tomography
  - quantum-hardware-6 | Crosstalk and Hardware Error Characterization | topics: ZZ crosstalk coupling; Simultaneous gate errors; Leakage to higher levels; Crosstalk characterization protocols
  - quantum-hardware-7 | Trapped Ion Hardware Engineering | topics: Paul trap mechanics; Laser cooling methods; Raman transitions; Molmer-Sorensen gate
  - quantum-hardware-8 | Quantum Hardware Calibration Pipelines | topics: Calibration pipeline architecture; Frequency drift tracking; Automated gate recalibration; Bayesian optimization for calibration
  - quantum-hardware-9 | Cryogenic Engineering and Hardware Integration | topics: Dilution refrigerator operation; Cryogenic wiring and filtering; Microwave engineering at millikelvin; Thermal anchoring stages
  - quantum-hardware-10 | Scaling Quantum Hardware and Next-Generation Architectures | topics: Modular quantum computing architectures; 3D integration for superconducting qubits; Quantum interconnects via photons; Neutral atom reconfigurable arrays

### quantum-optimization — Quantum Optimization
  - quantum-optimization-1 | Classical Optimization Foundations | topics: Combinatorial optimization landscape; NP-hard problem taxonomy; Traveling salesman problem; Max-Cut problem
  - quantum-optimization-2 | Ising Model and QUBO Formulations | topics: Ising model definition; QUBO formulation; Penalty terms for constraints; Max-Cut as Ising
  - quantum-optimization-3 | Quantum Annealing and D-Wave Systems | topics: Adiabatic quantum computation; Transverse-field Ising Hamiltonian; Annealing schedule design; D-Wave QPU topology - Pegasus
  - quantum-optimization-4 | QAOA Theory and Implementation | topics: QAOA ansatz construction; Cost and mixer Hamiltonians; QAOA p=1 analysis; Parameter optimization landscape
  - quantum-optimization-5 | QAOA Variants and Mixer Designs | topics: Grover mixer for constrained problems; X-mixer vs XY-mixer; Recursive QAOA RQAOA; Constraint-preserving mixers
  - quantum-optimization-6 | Variational Quantum Optimization Beyond QAOA | topics: Quantum imaginary time evolution QITE; FALQON algorithm; Counterdiabatic driving; Variational fast forwarding
  - quantum-optimization-7 | Quantum Optimization for Finance | topics: Markowitz portfolio optimization; Mean-variance to QUBO; Cardinality constraints; Risk measures CVaR
  - quantum-optimization-8 | Quantum Optimization for Logistics | topics: Vehicle routing problem; VRP to QUBO conversion; Job shop scheduling; Bin packing QUBO
  - quantum-optimization-9 | Quantum Optimization Benchmarking and Limits | topics: Benchmarking methodology design; Instance hardness metrics; Comparison to Gurobi and CPLEX; QA vs QAOA performance
  - quantum-optimization-10 | Quantum Optimization Research and Applications | topics: Open problems in quantum optimization; Quantum advantage thresholds; Overcoming barren plateaus in optimization; Quantum-inspired classical algorithms

### quantum-simulation — Quantum Simulation
  - quantum-simulation-1 | Quantum Simulation Fundamentals | topics: Feynman's simulation proposal; Exponential classical simulation cost; First vs second quantization; Quantum simulation use cases
  - quantum-simulation-2 | Second Quantization and Fermionic Systems | topics: Creation and annihilation operators; Fock space construction; Molecular Hamiltonian; Jordan-Wigner transformation
  - quantum-simulation-3 | Variational Quantum Eigensolver | topics: VQE algorithm derivation; Expectation value estimation; UCCSD ansatz; Hardware-efficient ansatz
  - quantum-simulation-4 | Hamiltonian Simulation Methods | topics: Product formula Trotter methods; First vs second order Trotter; Suzuki-Trotter higher orders; Linear combination of unitaries LCU
  - quantum-simulation-5 | Quantum Phase Estimation for Simulation | topics: QPE algorithm for eigenvalues; Controlled unitary evolution; QPE precision and qubit count; Iterative phase estimation
  - quantum-simulation-6 | Excited States and Quantum Subspace Expansion | topics: Excited state simulation challenges; Quantum equation of motion QEOM; Quantum subspace expansion QSE; Folded spectrum method
  - quantum-simulation-7 | Quantum Dynamics and Real-Time Simulation | topics: Real-time vs imaginary time evolution; Variational real-time dynamics; McLachlan variational principle; Time-dependent VQE TDVQE
  - quantum-simulation-8 | Condensed Matter Quantum Simulation | topics: Hubbard model simulation; Fermi-Hubbard mapping to qubits; Heisenberg spin chain; Quantum phase transitions
  - quantum-simulation-9 | Noise-Aware Quantum Simulation | topics: Noise impact on energy estimates; Zero-noise extrapolation for simulation; Probabilistic error cancellation; Symmetry verification post-processing
  - quantum-simulation-10 | Towards Quantum Advantage in Simulation | topics: Quantum advantage criteria for simulation; Current simulation records on hardware; Catalysis and strongly correlated systems; Active space approximations
