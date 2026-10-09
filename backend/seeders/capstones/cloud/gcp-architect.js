/**
 * Capstone brief — gcp-architect track (gcp-architect), v1.
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
  trackId: "gcp-architect",
  categoryId: "cloud",
  slug: "gcp-architect-gke-analytics-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "GKE & Serverless Real-Time Data Processing Platform",
  summary:
    "Provision an enterprise data processing and container execution infrastructure on GCP using Terraform. " +
    "You will set up custom VPC networks, a GKE Autopilot cluster with Workload Identity, a Pub/Sub to Dataflow " +
    "pipeline loading BigQuery partitioned tables, and Cloud Run serverless internal admin services.",
  stack: [
    "Terraform",
    "Google Cloud Platform",
    "GKE",
    "BigQuery",
    "Cloud Run",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "terraform-modules",
      text: "Infrastructure is declared using modular Terraform files specifying the Google provider, remote GCS state storage, and clear outputs.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "custom-vpc",
      text: "Provisions a custom-mode VPC network with secondary IP ranges for pod/service allocations, Cloud NAT, and private Google access.",
    },
    {
      id: "gke-autopilot",
      text: "Deploys a private GKE Autopilot cluster with Workload Identity Federation enabled for service account mapping.",
    },
    {
      id: "analytics-pipeline",
      text: "Configures a Pub/Sub topic and subscription connected to a partitioned and clustered BigQuery dataset.",
    },
    {
      id: "serverless-service",
      text: "Deploys a Cloud Run microservice connected to the private VPC network via Serverless VPC Access connector.",
    },
    {
      id: "security-kms",
      text: "Enforces Secret Manager secret storage and Cloud KMS customer-managed encryption keys for BigQuery and Cloud Storage buckets.",
    },
    {
      id: "tests",
      text: "Automated test scripts or tflint / terraform validate checks verify Terraform configuration integrity.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" },
    },
    {
      id: "readme",
      text: "README documents architecture layout, Terraform variables, gcloud authentication steps, and teardown commands.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes terraform.tfvars.example or .env.example with configuration placeholders.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow executes terraform fmt, terraform validate, and tflint on pull requests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "network-architecture",
      name: "GCP VPC & Network Topology",
      weight: 20,
      layerId: "gcp-architect-2",
      description:
        "Custom VPC configuration, secondary subnet ranges for GKE, Cloud NAT setup, and firewall rules.",
    },
    {
      id: "gke-cluster",
      name: "GKE & Workload Identity",
      weight: 20,
      layerId: "gcp-architect-3",
      description:
        "Private GKE Autopilot provisioning, Workload Identity binding, and secure container access.",
    },
    {
      id: "data-analytics",
      name: "BigQuery & Ingestion Pipeline",
      weight: 20,
      layerId: "gcp-architect-4",
      description:
        "Pub/Sub topic/subscription setup, BigQuery table partitioning/clustering schema, and Dataflow alignment.",
    },
    {
      id: "iac-terraform",
      name: "Terraform Structure & Quality",
      weight: 15,
      layerId: "gcp-architect-6",
      description:
        "Clean module abstraction, remote state backend configuration, input validation, and dynamic blocks.",
    },
    {
      id: "security-kms",
      name: "Security & Secret Management",
      weight: 15,
      layerId: "gcp-architect-5",
      description:
        "Cloud KMS key ring setup, IAM role assignments using least privilege, and Secret Manager usage.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI Pipelines",
      weight: 10,
      layerId: "gcp-architect-1",
      description:
        "Detailed execution README and automated GitHub Actions Terraform validation pipeline.",
    },
  ],

  twistPool: [
    {
      id: "cloud-armor-waf",
      text: "Attach Cloud Armor WAF security policies to the HTTP(S) Load Balancer restricting access based on IP geography and OWASP rules.",
    },
    {
      id: "vpc-service-controls",
      text: "Configure VPC Service Controls perimeter enclosing BigQuery and Cloud Storage to prevent data exfiltration.",
    },
    {
      id: "eventarc-triggers",
      text: "Wire Cloud Storage file uploads to trigger Cloud Run processing functions automatically via Eventarc.",
    },
    {
      id: "anthos-policy",
      text: "Incorporate Policy Controller constraint templates enforcing resource label requirements on GKE namespaces.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
