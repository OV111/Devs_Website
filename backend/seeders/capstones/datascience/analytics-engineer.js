/**
 * Capstone brief — analytics-engineer track (analytics-engineer), v1.
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
  trackId: "analytics-engineer",
  categoryId: "datascience",
  slug: "analytics-engineer-saas-metrics-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production Analytics Platform with dbt Core and Semantic Layer",
  summary:
    "Build a production analytics platform for SaaS recurring revenue and product analytics: engineer staged dbt models, " +
    "define dbt Semantic Layer metric specs, implement custom tests, and set up automated Airflow orchestration.",
  stack: [
    "dbt",
    "SQL",
    "Snowflake or DuckDB",
    "Looker/LookML or Metabase",
    "Apache Airflow",
  ],

  requirements: [
    {
      id: "dbt-staging-marts",
      text: "Structure a modular dbt project with staging, intermediate, and dimensional mart layers transforming raw SaaS event logs.",
      check: { type: "file", glob: ["dbt/models/**/*.sql", "models/**/*.sql"] },
    },
    {
      id: "advanced-sql-windowing",
      text: "Implement advanced SQL models for user sessionization, date spine generation, and monthly active subscription tracking.",
      check: {
        type: "file",
        glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"],
      },
    },
    {
      id: "semantic-layer-metrics",
      text: "Define dbt Semantic Layer metric configuration files for MRR, net retention, and active subscriber metrics with defined grain time intervals.",
      check: { type: "file", glob: ["dbt/models/**/*.yml", "models/**/*.yml"] },
    },
    {
      id: "dbt-data-contracts",
      text: "Implement schema tests (unique, not_null, accepted_values), custom generic dbt tests, and enforce data contracts on core dimensional models.",
      check: {
        type: "file",
        glob: ["dbt/tests/**/*.sql", "dbt/models/**/*.yml", "tests/**/*.sql"],
      },
    },
    {
      id: "incremental-strategy",
      text: "Build optimized incremental dbt models with explicit unique keys and merge strategies for high-frequency user telemetry events.",
      check: {
        type: "file",
        glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"],
      },
    },
    {
      id: "looker-bi-semantic-layer",
      text: "Create LookML view files and Explores (or Metabase data model queries) reflecting the underlying dbt star schema metrics.",
      check: {
        type: "file",
        glob: ["looker/**/*.lkml", "semantic/**/*.sql", "dashboards/*"],
      },
    },
    {
      id: "airflow-dbt-orchestration",
      text: "Construct an Apache Airflow DAG using DbtRunOperator / BashOperator to trigger daily dbt builds and automated testing pipelines.",
      check: { type: "file", glob: ["dags/*.py", "airflow/dags/*.py"] },
    },
    {
      id: "tests",
      text: "Automate Python/SQL integration scripts that validate dbt execution output, metric consistency, and pipeline success.",
      check: {
        type: "file",
        glob: ["tests/test_*.py", "**/test_*.py", "tests/*.sql"],
      },
    },
    {
      id: "readme",
      text: "Provide detailed instructions on setting up dbt profiles, executing dbt build commands, generating dbt docs, and running Airflow.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Configure GitHub Actions for slim CI testing that compares modified dbt models against production state artifacts.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "dbt-project-structure",
      name: "dbt Modeling & Architecture",
      weight: 25,
      layerId: "analytics-engineer-2",
      description:
        "Evaluates staging separation, ref() lineage graph, materialization choices, and model modularity.",
    },
    {
      id: "advanced-sql-logic",
      name: "Advanced Analytics SQL",
      weight: 20,
      layerId: "analytics-engineer-3",
      description:
        "Assesses window function usage, date spines, sessionization algorithms, and subscription churn calculation logic.",
    },
    {
      id: "data-quality-testing",
      name: "dbt Testing & Contracts",
      weight: 15,
      layerId: "analytics-engineer-4",
      description:
        "Measures schema test coverage, custom generic SQL tests, data contracts, and failure handling.",
    },
    {
      id: "incremental-performance",
      name: "Incremental Processing & Performance",
      weight: 15,
      layerId: "analytics-engineer-6",
      description:
        "Evaluates incremental merge strategies, partition pruning alignment, and query efficiency.",
    },
    {
      id: "semantic-layer-bi",
      name: "Semantic Layer & Metric Definitions",
      weight: 15,
      layerId: "analytics-engineer-8",
      description:
        "Checks metric definitions (dbt MetricFlow/LookML), time grain configurations, and BI layer integration.",
    },
    {
      id: "ci-orchestration-ops",
      name: "CI/CD & Orchestration",
      weight: 10,
      layerId: "analytics-engineer-9",
      description:
        "Evaluates slim CI state comparison setup, Airflow DAG workflow design, and operational documentation.",
    },
  ],

  twistPool: [
    {
      id: "snapshot-scd-twist",
      text: "Add dbt snapshots to track slowly changing dimensions (SCD Type 2) on user subscription plan changes over time.",
    },
    {
      id: "unit-testing-twist",
      text: "Implement dbt unit tests using mock seed datasets to verify complex transformation logic independent of database state.",
    },
    {
      id: "zero-copy-clone-twist",
      text: "Modify CI workflow to create isolated zero-copy dynamic schema staging environments in Snowflake for PR validation.",
    },
    {
      id: "audit-logging-twist",
      text: "Implement dbt macro hooks that write pipeline execution run times and row counts into a dedicated metadata audit table.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
