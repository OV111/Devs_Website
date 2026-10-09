/**
 * Capstone brief — ds-data-engineer track (ds-data-engineer), v1.
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
  trackId: "ds-data-engineer",
  categoryId: "datascience",
  slug: "ds-data-engineer-lakehouse-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production ETL Lakehouse and dbt Transformation Engine",
  summary:
    "Design and build an automated batch data pipeline: ingest raw JSON logs via PySpark/Python, land Parquet files, " +
    "model star-schema marts with dbt, enforce quality checks, and orchestrate execution via Apache Airflow.",
  stack: [
    "Python",
    "PySpark",
    "dbt",
    "PostgreSQL or DuckDB",
    "Apache Airflow",
    "Docker",
  ],

  requirements: [
    {
      id: "ingestion-pyspark",
      text: "Build a PySpark or Python ingestion job that reads raw multi-file JSON datasets, handles corrupt records, and writes partitioned Parquet files.",
      check: { type: "file", glob: ["src/ingest/*.py", "jobs/ingest.py"] },
    },
    {
      id: "dimensional-model",
      text: "Design dbt models implementing staging layers, Type-2 Slowly Changing Dimensions (SCD Type 2), and dimensional star-schema data marts.",
      check: { type: "file", glob: ["dbt/models/**/*.sql", "models/**/*.sql"] },
    },
    {
      id: "incremental-logic",
      text: "Write incremental dbt models using unique keys and high-watermark timestamps to handle append/merge patterns efficiently.",
      check: {
        type: "file",
        glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"],
      },
    },
    {
      id: "data-quality-gates",
      text: "Define dbt tests (schema assertions and singular custom SQL checks) that halt pipeline execution on data freshness or integrity failure.",
      check: {
        type: "file",
        glob: [
          "dbt/tests/**/*.sql",
          "dbt/models/schema.yml",
          "models/**/*.yml",
        ],
      },
    },
    {
      id: "airflow-orchestration",
      text: "Create an Apache Airflow DAG defining task dependencies across ingestion, transformation, and quality validation tasks with retry policies.",
      check: { type: "file", glob: ["dags/*.py", "airflow/dags/*.py"] },
    },
    {
      id: "containerization",
      text: "Provision a Docker Compose environment orchestrating local database storage, Airflow services, and runner execution.",
      check: {
        type: "file",
        glob: ["docker-compose.yml", "docker-compose.yaml", "compose.yml"],
      },
    },
    {
      id: "environment-config",
      text: "Manage database connection strings and environment configurations without hardcoding credentials.",
      check: { type: "file", glob: ".env.example" },
    },
    {
      id: "tests",
      text: "Write pytest suite testing custom PySpark transform functions and pipeline helper modules.",
      check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] },
    },
    {
      id: "readme",
      text: "Provide detailed instructions on launching Docker Compose, seeding raw data, running Airflow DAGs, and executing dbt docs.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Set up GitHub Actions to validate dbt syntax, lint SQL/Python files, and execute pytest suites.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "pipeline-architecture",
      name: "Data Architecture & Ingestion",
      weight: 20,
      layerId: "ds-data-engineer-1",
      description:
        "Evaluates PySpark ingest efficiency, Parquet partitioning choices, and error record routing.",
    },
    {
      id: "dbt-modeling",
      name: "Dimensional Modeling & dbt",
      weight: 25,
      layerId: "ds-data-engineer-2",
      description:
        "Assesses star schema correctness, SCD Type 2 handling, staging abstraction, and surrogate key usage.",
    },
    {
      id: "incremental-cdc",
      name: "Incremental Processing",
      weight: 15,
      layerId: "ds-data-engineer-9",
      description:
        "Checks incremental dbt strategies, high-watermark filtering logic, and deduplication efficiency.",
    },
    {
      id: "orchestration-ops",
      name: "Workflow Orchestration",
      weight: 15,
      layerId: "ds-data-engineer-6",
      description:
        "Evaluates Airflow DAG design, idempotency, retry mechanisms, and task dependency structure.",
    },
    {
      id: "data-quality",
      name: "Data Quality & Validation",
      weight: 15,
      layerId: "ds-data-engineer-8",
      description:
        "Measures coverage of generic/singular dbt tests, freshness bounds, and pipeline failure gates.",
    },
    {
      id: "devops-docs",
      name: "Containerization & Reproducibility",
      weight: 10,
      layerId: "ds-data-engineer-10",
      description:
        "Checks Docker environment reliability, CI workflow integration, and step-by-step setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "cdc-deletion-handling",
      text: "Extend the dbt incremental model to capture explicit deletion records (hard deletes) coming from raw source change logs.",
    },
    {
      id: "dlq-routing-twist",
      text: "Build a Dead Letter Queue (DLQ) pattern in PySpark that routes malformed JSON events to a separate quarantine folder without stopping the job.",
    },
    {
      id: "great-expectations-twist",
      text: "Integrate a Great Expectations checkpoint step into the Airflow DAG right after raw landing and prior to running dbt transformations.",
    },
    {
      id: "backfill-macro-twist",
      text: "Write a reusable dbt macro that accepts start and end date parameters to run deterministic historical data backfills.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
