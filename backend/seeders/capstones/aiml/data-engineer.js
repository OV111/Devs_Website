/**
 * Capstone brief — data-engineer track (data-engineer), v1.
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
  trackId: "data-engineer",
  categoryId: "aiml",
  slug: "data-engineer-streaming-analytics-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Real-Time Streaming and Batch Lakehouse Analytics Platform",
  summary:
    "Design and implement a modern hybrid data platform combining real-time streaming with Kafka, " +
    "batch ETL processing with PySpark/DuckDB, dimensional modeling with dbt, and orchestration " +
    "via Apache Airflow inside a containerized lakehouse architecture.",
  stack: [
    "Python",
    "Apache Kafka",
    "PySpark",
    "dbt",
    "Apache Airflow",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "kafka-streaming",
      text: "Kafka producer simulates continuous event streams and a PySpark structured streaming job consumes events into raw object storage.",
    },
    {
      id: "lakehouse-storage",
      text: "Data is stored in Delta Lake or Parquet format with appropriate partitioning schemas for efficient querying.",
    },
    {
      id: "dbt-transformations",
      text: "dbt models transform raw data into a dimensional star schema with staging, intermediate, and mart layers.",
    },
    {
      id: "dbt-tests",
      text: "Includes dbt data test assertions for uniqueness, non-null values, referential integrity, and custom business logic.",
    },
    {
      id: "airflow-dag",
      text: "Apache Airflow DAG orchestrates batch ingestion, Spark transformations, dbt runs, and data quality validations.",
    },
    {
      id: "data-quality-checks",
      text: "Data quality checks validate schema compliance and row counts before loading data into analytical marts.",
    },
    {
      id: "tests",
      text: "Pytest suite tests Spark transformations, schema parsers, custom DAG operators, and Kafka consumer logic.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details architecture topology, star schema layout, local infrastructure setup, and Airflow DAG deployment.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configuration for storage paths, database credentials, and Kafka broker urls.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Docker Compose environment starts Kafka brokers, Airflow scheduler/webserver, and local storage buckets.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes code linting, dbt model compilation, and automated tests on repository push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "streaming-architecture",
      name: "Streaming & Ingestion",
      weight: 20,
      layerId: "data-engineer-5",
      description:
        "Correct Kafka event publishing/consuming, stream offset management, and Parquet/Delta Lake ingestion.",
    },
    {
      id: "data-modeling",
      name: "Dimensional Modeling & dbt",
      weight: 20,
      layerId: "data-engineer-7",
      description:
        "Clean star schema design, modular dbt transformations, proper materialization choices, and comprehensive test coverage.",
    },
    {
      id: "batch-processing",
      name: "Distributed Processing",
      weight: 20,
      layerId: "data-engineer-4",
      description:
        "Efficient PySpark processing, correct handling of partitions, joins, and memory management.",
    },
    {
      id: "orchestration",
      name: "Orchestration & Workflow",
      weight: 15,
      layerId: "data-engineer-6",
      description:
        "Robust Airflow DAG design with explicit task dependencies, retries, sensors, and failure alerts.",
    },
    {
      id: "tests",
      name: "Testing & Data Quality",
      weight: 15,
      layerId: "data-engineer-9",
      description:
        "Thorough unit testing of Python transforms and comprehensive dbt automated quality checks.",
    },
    {
      id: "docs-ops",
      name: "Infrastructure & Documentation",
      weight: 10,
      layerId: "data-engineer-10",
      description:
        "Reproducible Docker infrastructure setup and clear documentation of pipeline lineage and architecture.",
    },
  ],

  twistPool: [
    {
      id: "iceberg-support",
      text: "Configure Apache Iceberg as the lakehouse table format supporting schema evolution and time-travel queries.",
    },
    {
      id: "cdc-integration",
      text: "Implement Change Data Capture (CDC) streaming using Debezium or mock database binlog events.",
    },
    {
      id: "great-expectations",
      text: "Incorporate Great Expectations validation checkpoints directly into the Airflow DAG pipeline execution.",
    },
    {
      id: "data-catalog",
      text: "Automate lineage generation and export dbt documentation catalog artifacts to an accessible static web host.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
