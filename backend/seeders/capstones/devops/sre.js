/**
 * Capstone brief — sre track (sre), v1.
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
  trackId: "sre",
  categoryId: "devops",
  slug: "sre-resilient-telemetry-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Resilient Microservice with Telemetry, SLOs, and Alerting",
  summary:
    "Develop a highly available Go backend service engineered for reliability. You will implement " +
    "resilience patterns (circuit breakers, rate limiting, graceful shutdown), export custom Prometheus metrics, " +
    "configure Grafana SLO dashboards, and simulate automated incident alerting with runbooks.",
  stack: [
    "Go",
    "Prometheus",
    "Grafana",
    "Alertmanager",
    "OpenTelemetry",
    "Docker Compose",
  ],

  requirements: [
    {
      id: "go-module",
      text: "Go service uses a clean module structure with standard dependency management.",
      check: CHECKS.goModule,
    },
    {
      id: "go-tests",
      text: "Unit and integration tests verify core service functionality and resiliency logic.",
      check: CHECKS.goTests,
    },
    {
      id: "resilience-patterns",
      text: "Service implements configurable request timeouts, exponential backoff retries, and circuit breaking for downstream calls.",
    },
    {
      id: "graceful-shutdown",
      text: "Service handles SIGINT/SIGTERM signals to complete in-flight requests and shut down cleanly.",
    },
    {
      id: "prometheus-exporter",
      text: "Exposes standard Prometheus metrics (/metrics) for HTTP latency histograms, error rates, and active connections.",
    },
    {
      id: "prom-alerts",
      text: "Prometheus alert rules evaluate burn rates against 99.9% availability and latency SLO targets.",
      check: { type: "file", glob: "prometheus/*.{yml,yaml}" },
    },
    {
      id: "grafana-dashboards",
      text: "Provisioned Grafana dashboard JSON visualizes the four golden signals and error budget consumption.",
      check: { type: "file", glob: "grafana/**/*.json" },
    },
    {
      id: "docker-environment",
      text: "Docker Compose provisions the Go application, Prometheus, Alertmanager, and Grafana in a unified network.",
      check: CHECKS.compose,
    },
    {
      id: "ci-pipeline",
      text: "GitHub Actions runs Go linting, unit tests, and race condition detection on every pull request.",
      check: CHECKS.ci,
    },
    {
      id: "runbook-docs",
      text: "Repository contains an incident response runbook and post-mortem template alongside setup docs.",
      check: { type: "file", glob: ["docs/*.md", "README.md"] },
    },
  ],

  rubric: [
    {
      id: "go-resilience",
      name: "Reliability & Resilience Code",
      weight: 25,
      layerId: "sre-8",
      description:
        "Proper Go implementation of timeouts, retries, circuit breakers, rate limiting, and graceful shutdown.",
    },
    {
      id: "telemetry-metrics",
      name: "Metrics & OpenTelemetry Instrumentation",
      weight: 20,
      layerId: "sre-2",
      description:
        "Accurate HTTP latency histograms, counter metrics, and tracing instrumentation.",
    },
    {
      id: "slo-alerting",
      name: "SLOs & Burn Rate Alerting",
      weight: 20,
      layerId: "sre-4",
      description:
        "Well-defined Service Level Objectives and multi-window burn rate alerts configured in Prometheus.",
    },
    {
      id: "visualization",
      name: "Dashboarding & Golden Signals",
      weight: 15,
      layerId: "sre-3",
      description:
        "Grafana dashboards clearly displaying latency, traffic, errors, saturation, and error budget tracking.",
    },
    {
      id: "incident-readiness",
      name: "Incident Management & Runbooks",
      weight: 10,
      layerId: "sre-7",
      description:
        "Detailed, actionable runbooks for firing alerts and structured post-mortem document templates.",
    },
    {
      id: "testing-ci",
      name: "Testing & CI Integration",
      weight: 10,
      layerId: "sre-9",
      description:
        "Automated test suite with race detector enabled running seamlessly in CI workflows.",
    },
  ],

  twistPool: [
    {
      id: "load-shedding",
      text: "Implement adaptive load shedding when system concurrency exceeds a threshold, returning HTTP 530/503.",
    },
    {
      id: "chaos-injection",
      text: "Add an optional HTTP endpoint or flag that injects artificial latency and random 500 errors to test alert firing.",
    },
    {
      id: "opentelemetry-tracing",
      text: "Integrate OpenTelemetry Jaeger tracing headers and span context propagation across internal calls.",
    },
    {
      id: "thanos-config",
      text: "Add a Thanos sidecar container and configuration block to support long-term metric storage aggregation.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
