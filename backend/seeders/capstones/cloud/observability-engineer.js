/**
 * Capstone brief — observability-engineer track (observability-engineer), v1.
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
import { CHECKS, COMMON_RULES, NO_LIVE_ACCOUNT_RULE } from "../shared.js";

export default {
  trackId: "observability-engineer",
  categoryId: "cloud",
  slug: "observability-engineer-telemetry-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Full-Stack Observability Platform with OpenTelemetry, Prometheus, and Grafana",
  summary:
    "Design and deploy an end-to-end cloud-native observability platform. You will instrument microservices " +
    "using the OpenTelemetry SDK, route telemetry through an OpenTelemetry Collector pipeline, scrape metrics with " +
    "Prometheus, aggregate logs with Loki, correlate distributed traces with Jaeger/Tempo, build Grafana dashboards, " +
    "and configure multi-window burn rate alerts based on Service Level Objectives (SLOs).",
  stack: [
    "OpenTelemetry",
    "Prometheus",
    "Grafana",
    "Loki",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "otel-collector-pipeline",
      text: "Configures an OpenTelemetry Collector pipeline with receivers (OTLP), processors (batch, memory_limiter, attributes), and exporters.",
    },
    {
      id: "app-instrumentation",
      text: "Microservices are instrumented with OpenTelemetry SDK sending trace context (W3C Trace Context) and custom RED metrics.",
    },
    {
      id: "prometheus-metrics",
      text: "Prometheus scrapes collector metrics, defines PromQL recording rules, and establishes multi-window burn rate alerting rules.",
    },
    {
      id: "loki-log-aggregation",
      text: "Configures Loki log ingestion with Promtail/OTel pipeline stages, regex/JSON parsing, and trace-to-log correlation IDs.",
    },
    {
      id: "grafana-dashboards",
      text: "Declarative Grafana dashboards as code visualize RED/USE metrics, distributed trace timelines, and Loki logs.",
    },
    {
      id: "slo-error-budgets",
      text: "Calculates Service Level Indicators (SLIs) and tracks Error Budgets with automated alert notifications on budget exhaustion.",
    },
    {
      id: "tests",
      text: "Pytest or Node test suite verifies OpenTelemetry trace context propagation, LogQL/PromQL rule syntax, and collector pipeline configuration.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py}" },
    },
    {
      id: "readme",
      text: "README documents telemetry architecture, OTel collector pipeline topology, SLO target definitions, and Grafana dashboard execution.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configuration placeholders for telemetry endpoints, retention windows, and alert webhooks.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Docker Compose environment starts the microservices, OTel Collector, Prometheus, Loki, Jaeger/Tempo, and Grafana.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow executes linting checks, PromQL rule validations, and automated unit tests on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "otel-pipeline",
      name: "OpenTelemetry & Collector Pipeline",
      weight: 20,
      layerId: "observability-engineer-6",
      description:
        "Correct OTel Collector receiver/processor/exporter configuration, OTLP protocol routing, and metadata enrichment.",
    },
    {
      id: "metrics-promql",
      name: "Prometheus Metrics & PromQL",
      weight: 20,
      layerId: "observability-engineer-2",
      description:
        "Effective RED/USE metric instrumentation, recording rules, scrape configs, and accurate PromQL aggregations.",
    },
    {
      id: "tracing-logging",
      name: "Distributed Tracing & Loki Logging",
      weight: 20,
      layerId: "observability-engineer-4",
      description:
        "W3C trace context propagation across microservices, span attributes, and Loki trace ID correlation.",
    },
    {
      id: "slos-alerting",
      name: "SLOs, Error Budgets & Alerting",
      weight: 15,
      layerId: "observability-engineer-7",
      description:
        "Precise SLI/SLO mathematical formulations, error budget tracking, and multi-burn-rate alerting rules.",
    },
    {
      id: "tests",
      name: "Testing & Validation",
      weight: 15,
      layerId: "observability-engineer-1",
      description:
        "Automated unit tests verifying trace header propagation, log parsing pipelines, and metric scrape assertions.",
    },
    {
      id: "docs-ops",
      name: "Dashboarding & Infrastructure",
      weight: 10,
      layerId: "observability-engineer-3",
      description:
        "Clean Docker Compose deployment, declarative Grafana dashboards as code, and complete README documentation.",
    },
  ],

  twistPool: [
    {
      id: "thanos-long-term",
      text: "Integrate Thanos sidecar and store components for long-term Prometheus metrics archiving in S3/Object storage.",
    },
    {
      id: "ebpf-auto-instrumentation",
      text: "Incorporate eBPF-based auto-instrumentation (e.g. Beyla or Pixie) for transparent network-level telemetry collection.",
    },
    {
      id: "mimir-multi-tenancy",
      text: "Configure Grafana Mimir for scalable, multi-tenant metric isolation across separate team namespaces.",
    },
    {
      id: "datadog-agent-fallback",
      text: "Add a dual-export pipeline in the OTel Collector that forwards a second copy of metrics and traces to another OTLP backend, such as a local Jaeger or Grafana Tempo container.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
