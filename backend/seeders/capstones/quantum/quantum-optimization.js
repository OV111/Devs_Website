/**
 * Capstone brief — quantum-optimization track (quantum-optimization), v1.
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
  stack: [
    "Python",
    "Qiskit Optimization or D-Wave Ocean SDK",
    "NetworkX",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "qubo-converter",
      text: "Implements automated mapping of combinatorial graph problems (Max-Cut and TSP/VRP) into Ising Hamiltonians and QUBO matrices.",
    },
    {
      id: "qaoa-solver",
      text: "Constructs QAOA circuits with customizable depth p, cost Hamiltonians, and X/XY mixer operators.",
    },
    {
      id: "parameter-optimizer",
      text: "Executes classical optimization (COBYLA, SPSA) on QAOA parameters gamma and beta to find ground state energy levels.",
    },
    {
      id: "annealing-simulator",
      text: "Simulates quantum annealing on D-Wave Pegasus topology graphs with configurable schedule rates and transverse field ramps.",
    },
    {
      id: "constraint-penalty",
      text: "Implements quadratic penalty multiplier formulations for constrained combinatorial optimization problems.",
    },
    {
      id: "classical-benchmarker",
      text: "Compares quantum optimization solution quality (approximation ratio and time-to-solution) against classical branch-and-bound / brute-force solvers.",
    },
    {
      id: "portfolio-finance-module",
      text: "Includes a Markowitz mean-variance portfolio optimization module with cardinality and budget penalty terms mapped to QUBO.",
    },
    {
      id: "tests",
      text: "Automated test suite verifying QUBO matrix construction accuracy, QAOA ground state convergence on small graphs, and penalty term validity.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README detailing problem mappings, QUBO mathematical derivations, QAOA parameter landscapes, and usage guides.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile provisioning optimization dependencies (Qiskit, Ocean SDK, NetworkX) and execution scripts.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running unit tests and benchmark suite verification on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "qubo-formulation",
      name: "QUBO Mapping & Ising Formulations",
      weight: 25,
      layerId: "quantum-optimization-2",
      description:
        "Correct translation of combinatorial objective functions and constraints into QUBO matrices.",
    },
    {
      id: "qaoa-implementation",
      name: "QAOA Circuit & Mixer Optimization",
      weight: 20,
      layerId: "quantum-optimization-4",
      description:
        "Accurate QAOA ansatz construction, mixer selection, and classical parameter loop convergence.",
    },
    {
      id: "annealing-theory",
      name: "Quantum Annealing & Topology Modeling",
      weight: 15,
      layerId: "quantum-optimization-3",
      description:
        "Proper formulation of transverse-field annealing schedules and minor embedding considerations.",
    },
    {
      id: "domain-applications",
      name: "Finance & Logistics Application Mapping",
      weight: 15,
      layerId: "quantum-optimization-7",
      description:
        "Effective modeling of real-world portfolio and vehicle routing constraints into quadratic penalties.",
    },
    {
      id: "testing",
      name: "Validation & Benchmarking Tests",
      weight: 15,
      layerId: "quantum-optimization-9",
      description:
        "Tests validating approximation ratios, ground state energy convergence, and classical comparisons.",
    },
    {
      id: "documentation",
      name: "Documentation & Technical Clarity",
      weight: 10,
      layerId: "quantum-optimization-1",
      description:
        "Clear explanation of penalty parameter tuning, execution commands, and optimization landscapes.",
    },
  ],

  twistPool: [
    {
      id: "rqaoa-recursive",
      text: "Implement Recursive QAOA (RQAOA) to eliminate variables iteratively and solve large-scale instances beyond circuit capacity.",
    },
    {
      id: "counterdiabatic-driving",
      text: "Incorporate counterdiabatic driving terms into the QAOA mixer to prevent non-adiabatic transitions at low circuit depths.",
    },
    {
      id: "cvar-risk-aggregation",
      text: "Implement Conditional Value at Risk (CVaR) expectation aggregation instead of standard mean expectation in the QAOA cost function.",
    },
    {
      id: "job-shop-scheduling",
      text: "Add a job shop scheduling problem (JSSP) parser and converter that transforms resource precedence constraints into QUBO penalization terms.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
