/**
 * Capstone brief — quantum-developer track (quantum-developer), v1.
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
    {
      id: "circuit-factory",
      text: "Implements parameterized quantum circuit templates (e.g. Bell state, GHZ state, and a custom parameterized ansatz) using Qiskit.",
    },
    {
      id: "api-endpoints",
      text: "REST API endpoints allow clients to submit circuit execution jobs, query job status, and fetch measurement probability distributions.",
    },
    {
      id: "backend-provider",
      text: "Executes circuits against Aer simulators with configurable shot counts and noise models mimicking real hardware topology.",
    },
    {
      id: "transpilation",
      text: "Applies circuit optimization passes and transpilation targeted to specified qubit coupling maps before execution.",
    },
    {
      id: "job-queue",
      text: "Asynchronous job execution engine processes circuit submissions in background workers without blocking the API.",
    },
    {
      id: "error-mitigation",
      text: "Implements measurement readout error mitigation post-processing on raw shot outcome counts.",
    },
    {
      id: "validation",
      text: "Validates input requests (qubit count limits, parameter bounds, shot limits) and returns 400 JSON errors for invalid payloads.",
    },
    {
      id: "tests",
      text: "Unit and integration tests verify circuit construction logic, job API routes, and backend execution results.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README provides complete setup instructions, API endpoint documentation, and backend configuration steps.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile or Docker Compose builds and starts the API server and worker environment.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow runs linter and unit tests on push.",
      check: CHECKS.ci,
    },
    {
      id: "env-example",
      text: "Environment configuration template provided for API keys and backend selection.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "circuit-design",
      name: "Circuit Construction & Transpilation",
      weight: 25,
      layerId: "quantum-developer-2",
      description:
        "Correct implementation of parameterized circuits and targeted transpilation passes.",
    },
    {
      id: "architecture",
      name: "Software Architecture & API",
      weight: 20,
      layerId: "quantum-developer-10",
      description:
        "Clean separation between API routing, asynchronous job workers, and Qiskit execution layers.",
    },
    {
      id: "noise-mitigation",
      name: "Noise & Error Handling",
      weight: 15,
      layerId: "quantum-developer-7",
      description:
        "Proper configuration of Aer noise models and post-processing readout error correction.",
    },
    {
      id: "testing",
      name: "Quantum & API Testing",
      weight: 15,
      layerId: "quantum-developer-9",
      description:
        "Comprehensive test suite covering circuit logic, mocked backends, and HTTP endpoints.",
    },
    {
      id: "robustness",
      name: "Validation & Error Responses",
      weight: 10,
      layerId: "quantum-developer-4",
      description:
        "Robust handling of invalid parameters, shot noise limits, and backend failures.",
    },
    {
      id: "operability",
      name: "Documentation & Operations",
      weight: 15,
      layerId: "quantum-developer-8",
      description:
        "Clear execution instructions, environment variable management, and containerization.",
    },
  ],

  twistPool: [
    {
      id: "dynamic-decoupling",
      text: "Add an optional dynamic decoupling pass during transpilation to inject echo pulses into idle qubit time slots.",
    },
    {
      id: "ibm-runtime-bridge",
      text: "Integrate a real IBM Quantum account backend fallback when runtime credentials are provided in the request.",
    },
    {
      id: "state-vector-exporter",
      text: "Expose an endpoint to return the exact statevector or density matrix for noiseless simulation runs up to 10 qubits.",
    },
    {
      id: "custom-gate-decomposition",
      text: "Implement a custom unitary matrix submission endpoint that decomposes the matrix into standard basis gates.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
