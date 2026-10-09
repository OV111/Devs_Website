/**
 * Capstone brief — mlops track (mlops), v1.
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
  trackId: "mlops",
  categoryId: "aiml",
  slug: "mlops-automated-retraining-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated ML Pipeline, Drift Detection, and Deployment Platform",
  summary:
    "Build a production-grade MLOps infrastructure featuring data and model versioning with DVC, " +
    "experiment tracking with MLflow, automated validation gates with Great Expectations, drift monitoring, " +
    "and continuous deployment of containerized inference endpoints via GitHub Actions.",
  stack: [
    "Python",
    "DVC",
    "MLflow",
    "Great Expectations",
    "FastAPI",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "dvc-data-versioning",
      text: "Data versioning configuration tracks dataset iterations and pipeline stages with DVC.",
    },
    {
      id: "data-validation",
      text: "Integrates Great Expectations suites to validate raw data quality before training and inference steps.",
    },
    {
      id: "experiment-registry",
      text: "MLflow logs training runs, parameters, evaluation metrics, and registers candidate models to the MLflow Model Registry.",
    },
    {
      id: "drift-detection",
      text: "Implements automated data and concept drift detection (using Evidently or custom statistical tests) on incoming inference data.",
    },
    {
      id: "fastapi-serving",
      text: "FastAPI inference service loads registered models from MLflow and exposes a REST API for real-time predictions.",
    },
    {
      id: "orchestration-retrain",
      text: "Automated script triggers retraining and candidate evaluation when data drift exceeds predefined thresholds.",
    },
    {
      id: "tests",
      text: "Pytest suite validates pipeline stage outputs, data expectation assertions, and model serving routes.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details DVC workflow setup, MLflow tracking configuration, drift detection alerts, and deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configurations for MLflow remote tracking, storage endpoints, and threshold settings.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Docker Compose setup runs the MLflow server, local feature storage, and the FastAPI model serving container.",
      check: CHECKS.compose,
    },
    {
      id: "ci-cd",
      text: "GitHub Actions CI/CD workflow runs automated tests, validates model performance gates, and builds deployment containers.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "reproducibility",
      name: "Data & Model Versioning",
      weight: 20,
      layerId: "mlops-2",
      description:
        "Effective DVC integration, clear artifact versioning, and fully reproducible pipeline definitions.",
    },
    {
      id: "data-quality",
      name: "Data Validation & Quality",
      weight: 15,
      layerId: "mlops-4",
      description:
        "Comprehensive Great Expectations check suites preventing bad data from entering training or inference.",
    },
    {
      id: "experimentation",
      name: "Experiment Tracking & Registry",
      weight: 20,
      layerId: "mlops-3",
      description:
        "Systematic logging of metrics, hyperparameters, artifacts, and proper usage of MLflow model registry stages.",
    },
    {
      id: "monitoring-drift",
      name: "Drift Monitoring & Retraining",
      weight: 20,
      layerId: "mlops-9",
      description:
        "Accurate detection of data distribution shifts and reliable automated retraining triggers.",
    },
    {
      id: "cicd-tests",
      name: "CI/CD & Automated Testing",
      weight: 15,
      layerId: "mlops-7",
      description:
        "Robust GitHub Actions workflow with model validation gates, unit tests, and automated build processes.",
    },
    {
      id: "docs-ops",
      name: "Operability & Documentation",
      weight: 10,
      layerId: "mlops-5",
      description:
        "Clean containerization setup and clear instructions for running and maintaining the pipeline.",
    },
  ],

  twistPool: [
    {
      id: "feast-integration",
      text: "Integrate Feast feature store for unified online feature serving during inference and offline feature retrieval for training.",
    },
    {
      id: "canary-deployment",
      text: "Implement traffic splitting in FastAPI to support canary deployments between v1 and v2 model versions.",
    },
    {
      id: "airflow-dag",
      text: "Package the data processing, validation, and training stages into an Apache Airflow DAG for scheduled orchestration.",
    },
    {
      id: "prometheus-metrics",
      text: "Expose custom Prometheus metrics from FastAPI for tracking inference latency, request throughput, and prediction drift.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
