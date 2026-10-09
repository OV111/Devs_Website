/**
 * Capstone brief — chaos-engineer track (chaos-engineer), v1.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "chaos-engineer",
  categoryId: "qa",
  slug: "chaos-engineer-resilience-testing",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cloud-Native Chaos Engineering & Resilience Suite",
  summary:
    "Design, automate, and execute targeted chaos experiments against a microservices architecture using LitmusChaos and Toxiproxy. " +
    "You will formulate steady-state hypotheses, inject network latency and pod failures, monitor resilience via Prometheus and Grafana, " +
    "and construct automated rollback safeguards in CI/CD.",
  stack: [
    "Kubernetes",
    "LitmusChaos",
    "Toxiproxy",
    "Prometheus",
    "Grafana",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "steady-state-hypothesis",
      text: "Formulate and document steady-state hypotheses, blast radius bounds, and abort criteria for all experiments.",
      check: { type: "file", glob: "**/docs/experiments/*.md" },
    },
    {
      id: "litmus-chaosengine",
      text: "Author LitmusChaos ChaosEngine and ChaosExperiment custom resource definitions (CRDs) for pod and resource attacks.",
      check: { type: "file", glob: "**/chaos/*.{yml,yaml}" },
    },
    {
      id: "network-fault-injection",
      text: "Configure Toxiproxy stubs or network latency/packet loss injection to simulate service dependency failures.",
      check: { type: "file", glob: "**/network/*.{js,py,json,yml,yaml}" },
    },
    {
      id: "database-chaos",
      text: "Script a stateful service fault experiment such as primary database failover, connection pool exhaustion, or disk IO saturation.",
      check: { type: "file", glob: "**/experiments/db_chaos*.py" },
    },
    {
      id: "telemetry-prometheus",
      text: "Instrument application or load generator with Prometheus metrics to measure SLI/SLO recovery during chaos.",
      check: { type: "file", glob: "**/monitoring/prometheus*.{yml,yaml}" },
    },
    {
      id: "grafana-dashboard",
      text: "Export a Grafana dashboard JSON configuration visualizing system behavior before, during, and after fault injection.",
      check: { type: "file", glob: "**/dashboards/*.json" },
    },
    {
      id: "automated-rollback",
      text: "Implement automated safety checks that trigger instant experiment abort and system rollback if SLO thresholds are breached.",
    },
    {
      id: "gameday-report",
      text: "Document a GameDay execution report detailing MTTR metrics, root cause analysis, and architectural hardening recommendations.",
      check: { type: "file", glob: "**/docs/gameday-report.md" },
    },
    {
      id: "readme",
      text: "README details local Minikube/Kind cluster setup, LitmusChaos operator installation, and experiment execution commands.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "docker-compose",
      text: "Provide Docker Compose or Helm configurations to deploy the microservice stack and telemetry exporters.",
      check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions workflow executing automated chaos experiments on schedule or pull request.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "experiment-design",
      name: "Chaos Hypothesis & Design",
      weight: 25,
      layerId: "chaos-engineer-2",
      description:
        "Quality of steady-state hypotheses, blast radius controls, and risk mitigation planning.",
    },
    {
      id: "k8s-litmus",
      name: "Kubernetes & LitmusChaos Execution",
      weight: 20,
      layerId: "chaos-engineer-5",
      description:
        "Correct CRD structure, pod failure automation, and Kubernetes cluster fault injection.",
    },
    {
      id: "network-resilience",
      name: "Network & Dependency Faults",
      weight: 15,
      layerId: "chaos-engineer-7",
      description:
        "Effective simulation of network latency, circuit breaker testing, and Toxiproxy fault injection.",
    },
    {
      id: "observability",
      name: "Observability & SLI/SLO Metrics",
      weight: 15,
      layerId: "chaos-engineer-6",
      description:
        "Clear visualization of impact and recovery trajectories on Grafana dashboards via Prometheus.",
    },
    {
      id: "safety-automation",
      name: "Automated Safety & Rollbacks",
      weight: 15,
      layerId: "chaos-engineer-10",
      description:
        "Robust automated abort triggers preventing catastrophic failure and verifying auto-healing.",
    },
    {
      id: "reporting-gameday",
      name: "GameDay Reporting & Analysis",
      weight: 10,
      layerId: "chaos-engineer-9",
      description:
        "Actionable root cause analysis, precise MTTR tracking, and system architecture recommendations.",
    },
  ],

  twistPool: [
    {
      id: "cpu-memory-stress",
      text: "Include node-level resource starvation experiments (CPU hog and memory pressure) asserting auto-scaling pod behavior.",
    },
    {
      id: "opentelemetry-tracing",
      text: "Integrate distributed tracing with Jaeger to trace latency cascades across microservice boundaries during chaos.",
    },
    {
      id: "redis-cache-failure",
      text: "Inject cache failure scenarios (Redis pod eviction) to verify graceful fallback to primary database persistence.",
    },
    {
      id: "pagerduty-webhook",
      text: "Simulate PagerDuty incident alerting webhooks triggered when availability SLO thresholds drop during an experiment.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
