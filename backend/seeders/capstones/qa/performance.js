/**
 * Capstone brief — performance track (performance), v1.
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
  trackId: "performance",
  categoryId: "qa",
  slug: "performance-load-testing-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Distributed Load & Performance Testing Suite",
  summary:
    "Design, script, and execute a comprehensive performance testing suite using k6. " +
    "You will simulate realistic load patterns, establish SLO threshold gates, profile server-side bottlenecks, " +
    "and publish real-time telemetry metrics to a Grafana dashboard.",
  stack: [
    "k6",
    "JavaScript",
    "Docker",
    "Prometheus",
    "Grafana",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "k6-scripting",
      text: "Modular k6 test scripts covering key user journeys with custom checks and dynamic parameterization.",
      check: { type: "file", glob: "**/scripts/*.js" },
    },
    {
      id: "load-scenarios",
      text: "Define virtual user profiles and stages for ramp-up, steady-state load, stress, and spike scenarios.",
      check: { type: "file", glob: "**/scenarios/*.js" },
    },
    {
      id: "slo-thresholds",
      text: "Configure explicit k6 thresholds asserting response time percentiles (p90, p95, p99) and error rates.",
    },
    {
      id: "test-data-feeders",
      text: "Incorporate external CSV or JSON test data parameterization for multi-user authentication loads.",
      check: { type: "file", glob: "**/data/*.{csv,json}" },
    },
    {
      id: "custom-metrics",
      text: "Implement custom k6 Trend, Counter, and Rate metrics to measure domain-specific operation latencies.",
    },
    {
      id: "observability",
      text: "Provide Docker Compose setup configuring Grafana and Prometheus/InfluxDB to visualize live execution telemetry.",
      check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" },
    },
    {
      id: "dashboard-config",
      text: "Export Grafana dashboard configuration JSON files monitoring throughput, response percentiles, and errors.",
      check: { type: "file", glob: "**/dashboards/*.json" },
    },
    {
      id: "bottleneck-analysis",
      text: "Write an in-depth performance analysis report detailing identified system bottlenecks and tuning solutions.",
      check: { type: "file", glob: "**/docs/analysis-report.md" },
    },
    {
      id: "readme",
      text: "README clearly outlines environment setup, load generation instructions, and threshold interpretation guidelines.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions workflow that executes automated k6 performance regression checks against thresholds.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "script-design",
      name: "k6 Script Architecture",
      weight: 25,
      layerId: "performance-3",
      description:
        "Modular JavaScript k6 code structure, parameterization, dynamic think times, and custom metrics.",
    },
    {
      id: "scenario-modeling",
      name: "Load Scenario Modeling",
      weight: 20,
      layerId: "performance-7",
      description:
        "Accurate modeling of realistic traffic patterns including ramp-up, spike tests, and soak tests.",
    },
    {
      id: "slo-thresholds",
      name: "SLO & Threshold Design",
      weight: 15,
      layerId: "performance-9",
      description:
        "Rigorous definition of percentile latency requirements (p90/p95/p99) and failure gates.",
    },
    {
      id: "observability",
      name: "Telemetry & Dashboards",
      weight: 15,
      layerId: "performance-5",
      description:
        "Effective Grafana integration visualizing real-time test execution and system performance indicators.",
    },
    {
      id: "analysis-report",
      name: "Analysis & Recommendations",
      weight: 15,
      layerId: "performance-6",
      description:
        "Depth of root-cause analysis in identifying CPU, database, memory, or network bottlenecks.",
    },
    {
      id: "ci-automation",
      name: "Continuous Performance",
      weight: 10,
      layerId: "performance-10",
      description:
        "Automated pipeline execution enforcing performance budgets and failure thresholds on push.",
    },
  ],

  twistPool: [
    {
      id: "soak-test-leak",
      text: "Include an extended duration soak test script designed to identify memory leaks and database resource exhaustion over time.",
    },
    {
      id: "network-throttling",
      text: "Simulate packet drops and latency degradation at the load generator level to measure resilience under poor network conditions.",
    },
    {
      id: "distributed-execution",
      text: "Configure distributed load generation across multiple worker instances or containers to achieve high concurrency.",
    },
    {
      id: "chaos-during-load",
      text: "Inject background server errors or service restarts during a steady-state load run and analyze system recovery times.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
