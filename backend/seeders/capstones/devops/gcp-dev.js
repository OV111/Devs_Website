/**
 * Capstone brief — gcp-dev track (gcp-dev), v1.
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
  trackId: "gcp-dev",
  categoryId: "devops",
  slug: "gcp-dev-cloudrun-pubsub-data-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cloud Run and Pub/Sub Event-Driven Pipeline on GCP",
  summary:
    "Build a containerized event-driven data ingestion pipeline on Google Cloud Platform using Terraform. " +
    "You will implement serverless Cloud Run services, Pub/Sub topic subscriptions with dead-lettering, " +
    "Firestore document storage, BigQuery analytics tables, and Cloud Monitoring dashboards.",
  stack: [
    "Terraform",
    "Google Cloud Run",
    "GCP Pub/Sub",
    "BigQuery",
    "Firestore",
    "Docker",
  ],

  requirements: [
    {
      id: "tf-gcp-provision",
      text: "Terraform modules declare Cloud Run services, Pub/Sub topics, Firestore databases, and BigQuery datasets.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "cloud-run-app",
      text: "Containerized application service runs on Cloud Run with health check endpoints and concurrency configuration.",
      check: CHECKS.dockerfile,
    },
    {
      id: "pubsub-messaging",
      text: "Pub/Sub topic and push subscription routes messages to Cloud Run endpoints with dead-letter topic retries.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "firestore-storage",
      text: "Application stores real-time transaction state in Firestore document collections.",
      check: { type: "file", glob: "src/**/*.{js,ts,py,go}" },
    },
    {
      id: "bigquery-analytics",
      text: "BigQuery partitioned tables receive streamed event records for analytical processing.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "gcp-iam-workload",
      text: "IAM service accounts utilize strict role bindings following the principle of least privilege.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "local-emulators",
      text: "Docker Compose provisions GCP Pub/Sub and BigQuery emulators for end-to-end offline local testing.",
      check: CHECKS.compose,
    },
    {
      id: "unit-tests",
      text: "Automated unit tests exercise event parsing, payload validation, and database operations.",
      check: CHECKS.jsTests,
    },
    {
      id: "ci-pipeline",
      text: "GitHub Actions workflow executes terraform validate, lints Dockerfiles, and runs test suites.",
      check: CHECKS.ci,
    },
    {
      id: "readme",
      text: "README documents local emulator execution, GCP architecture diagrams, and cost-optimization choices.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "gcp-architecture",
      name: "GCP Compute & Serverless Arch",
      weight: 25,
      layerId: "gcp-dev-2",
      description:
        "Efficient Cloud Run service containerization, autoscaling configuration, and stateless request handling.",
    },
    {
      id: "iac-terraform",
      name: "IaC & Resource Provisioning",
      weight: 20,
      layerId: "gcp-dev-9",
      description:
        "Clean modular Terraform HCL structures managing GCP resources declaratively.",
    },
    {
      id: "storage-analytics",
      name: "Storage & BigQuery Analytics",
      weight: 20,
      layerId: "gcp-dev-6",
      description:
        "Effective BigQuery table partitioning/clustering design and reliable Firestore state persistence.",
    },
    {
      id: "messaging-pubsub",
      name: "Pub/Sub Messaging & Resiliency",
      weight: 15,
      layerId: "gcp-dev-4",
      description:
        "Proper push subscription routing, message ordering setup, and dead-letter queue handling.",
    },
    {
      id: "security-iam",
      name: "GCP Security & IAM",
      weight: 10,
      layerId: "gcp-dev-1",
      description:
        "Least privilege service accounts, Workload Identity configuration, and secret management.",
    },
    {
      id: "testing-docs",
      name: "Local Testing & Documentation",
      weight: 10,
      layerId: "gcp-dev-8",
      description:
        "Comprehensive setup guide using emulators and automated CI validation checks.",
    },
  ],

  twistPool: [
    {
      id: "cloud-build-trigger",
      text: "Configure Cloud Build triggers via Terraform to build container images and push to Artifact Registry on commit.",
    },
    {
      id: "cloud-storage-lifecycle",
      text: "Add Cloud Storage bucket resources with lifecycle transition rules to archive raw event payloads to Coldline storage.",
    },
    {
      id: "gke-workload-identity",
      text: "Provide alternative GKE Deployment manifests using Workload Identity to interact with Pub/Sub securely.",
    },
    {
      id: "log-based-metrics",
      text: "Define Cloud Logging log-based metric resources and alerts triggering when event processing errors spike.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
