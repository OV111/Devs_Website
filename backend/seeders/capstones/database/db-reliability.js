/**
 * Capstone brief — db-reliability track (db-reliability), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "db-reliability",
  categoryId: "database",
  slug: "db-reliability-ops-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Database Reliability Platform: Monitoring, Zero-Downtime Migrations & DR Chaos",
  summary:
    "Build a production-grade Database Reliability Engineering platform. Configure Prometheus golden signals monitoring, " +
    "automated backup validation pipelines, replication lag alerting, zero-downtime schema migrations with gh-ost/pt-online-schema-change, " +
    "and Chaos Engineering disaster recovery suites.",
  stack: [
    "PostgreSQL or MySQL",
    "Prometheus",
    "Grafana",
    "gh-ost",
    "Docker Compose",
    "Bash",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "observability-stack",
      text: "Deploy Prometheus and Grafana connected to postgres_exporter or mysqldump_exporter tracking golden signals (latency, traffic, errors, saturation).",
      check: CHECKS.compose,
    },
    {
      id: "prometheus-alerts",
      text: "Define Prometheus alert rules for high replication lag, connection saturation (>85%), disk space exhaustion, and high slow query rate.",
      check: { type: "file", glob: "**/alerts.yml" },
    },
    {
      id: "backup-validation",
      text: "Create an automated backup validation script that restores the latest physical/logical backup into a isolated container and verifies checksum integrity.",
      check: { type: "file", glob: "**/scripts/validate_backup.sh" },
    },
    {
      id: "zero-downtime-migration",
      text: "Provide a zero-downtime online schema change script (using gh-ost or pt-online-schema-change) that alters a table schema during live writes.",
      check: { type: "file", glob: "**/scripts/online_migration.sh" },
    },
    {
      id: "ha-failover-runbook",
      text: "Configure HA failover (Patroni/ProxySQL) and write executable runbooks for database incident recovery scenarios.",
      check: { type: "file", glob: ["**/runbooks/*.md", "docs/runbooks/*.md"] },
    },
    {
      id: "chaos-experiments",
      text: "Write an automated chaos test script simulating network partitions, packet loss, or process kills and verifying automatic cluster recovery.",
      check: { type: "file", glob: "**/scripts/chaos_test.sh" },
    },
    {
      id: "security-audit",
      text: "Configure TLS for network transit, enable database audit logging, and provide dynamic secret fetching scripts via HashiCorp Vault or environment variables.",
      check: { type: "file", glob: "**/vault_secrets.sh" },
    },
    {
      id: "capacity-model",
      text: "Provide a capacity forecasting script/spreadsheet calculation that projects disk space and connection limits based on exporter metrics.",
      check: { type: "file", glob: "**/capacity_model.py" },
    },
    {
      id: "readme",
      text: "README describes SLO/SLA error budgets, monitoring setup, disaster recovery drill execution, and blameless postmortem templates.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow executes backup validation scripts and lints Prometheus alerting rules.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "reliability-slo",
      name: "SLOs & Error Budgets",
      weight: 15,
      layerId: "db-reliability-1",
      description:
        "Are database reliability SLOs clearly defined and backed by actionable alerting rules?",
    },
    {
      id: "monitoring-alerting",
      name: "Monitoring & Observability",
      weight: 20,
      layerId: "db-reliability-2",
      description:
        "Are Prometheus exporters and Grafana dashboards configured for all four golden signals?",
    },
    {
      id: "backup-validation",
      name: "Backup Validation Pipelines",
      weight: 20,
      layerId: "db-reliability-3",
      description:
        "Is automated backup restoration and checksum verification reliably executed?",
    },
    {
      id: "ha-failover",
      name: "HA & Replication Resilience",
      weight: 15,
      layerId: "db-reliability-5",
      description:
        "Do HA mechanisms survive network partitions and handle replication lag spikes?",
    },
    {
      id: "schema-migrations",
      name: "Zero-Downtime Migration Ops",
      weight: 15,
      layerId: "db-reliability-8",
      description:
        "Are online schema migration tools configured to alter schemas without table locking?",
    },
    {
      id: "chaos-dr",
      name: "Chaos Testing & DR Runbooks",
      weight: 15,
      layerId: "db-reliability-10",
      description:
        "Are chaos recovery drills functional and supported by clear incident runbooks?",
    },
  ],

  twistPool: [
    {
      id: "vault-dynamic-secrets",
      text: "Integrate a live HashiCorp Vault instance to issue short-lived dynamic database credentials rotated every hour.",
    },
    {
      id: "toxiproxy-network-simulation",
      text: "Incorporate Toxiproxy into the chaos suite to simulate specific latency degradation and TCP connection resets.",
    },
    {
      id: "auto-remediation-script",
      text: "Build an automated remediation daemon that catches replication lag alerts and automatically terminates long-running analytical queries.",
    },
    {
      id: "postmortem-report-template",
      text: "Include a completed blameless postmortem document analyzing a simulated 30-minute outage drill.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
