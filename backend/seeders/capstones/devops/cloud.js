/**
 * Capstone brief — cloud track (cloud), v1.
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
  trackId: "cloud",
  categoryId: "devops",
  slug: "cloud-multi-tier-iac-observability",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Production-grade multi-tier Cloud Infrastructure with Terraform & LocalStack",
  summary:
    "Design and provision a production-ready, highly available multi-tier cloud infrastructure " +
    "using Terraform, Docker, LocalStack, and Prometheus/Grafana. You will build a complete " +
    "automated workflow featuring IAM least-privilege policies, containerized services, and CI validation.",
  stack: [
    "Terraform",
    "AWS / LocalStack",
    "Docker",
    "Prometheus",
    "Grafana",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "vpc-network",
      text: "Terraform provisions a VPC with public and private subnets across 2 AZs, NAT gateways, and isolated routing tables.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "iam-security",
      text: "IAM policies and roles follow least-privilege access for app services and state access without hardcoded credentials.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "s3-backend",
      text: "S3 bucket configuration includes versioning, encryption at rest, and lifecycle management rules.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "docker-build",
      text: "Multi-stage Dockerfile builds a lightweight containerized application with layer caching.",
      check: CHECKS.dockerfile,
    },
    {
      id: "compose-local",
      text: "Docker Compose provisions a local multi-container environment running LocalStack, the app, Prometheus, and Grafana.",
      check: CHECKS.compose,
    },
    {
      id: "k8s-manifests",
      text: "Kubernetes manifests define a Deployment, ClusterIP Service, and ConfigMap for the application workload.",
      check: { type: "file", glob: "k8s/*.{yml,yaml}" },
    },
    {
      id: "monitoring",
      text: "Prometheus scrapers collect metrics from the app and Grafana loads pre-configured dashboard JSON files.",
      check: { type: "file", glob: "monitoring/**/*.{yml,yaml,json}" },
    },
    {
      id: "ci-pipeline",
      text: "A CI workflow validates Terraform code formatting, runs terraform validate, lints Dockerfiles, and checks K8s manifests.",
      check: CHECKS.ci,
    },
    {
      id: "env-example",
      text: "A template environment file specifies required AWS and deployment variables without containing real secrets.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "README documents local deployment steps using LocalStack, architecture diagrams, and disaster recovery procedures.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "network-iac",
      name: "IaC & Architecture",
      weight: 25,
      layerId: "cloud-3",
      description:
        "Modular Terraform code properly structuring VPCs, IAM roles, S3 buckets, and multi-AZ layouts.",
    },
    {
      id: "containerization",
      name: "Container & K8s Packaging",
      weight: 20,
      layerId: "cloud-4",
      description:
        "Multi-stage Docker build efficiency and well-structured Kubernetes manifests with ConfigMaps.",
    },
    {
      id: "observability",
      name: "Monitoring & Alerting",
      weight: 15,
      layerId: "cloud-7",
      description:
        "Effective Prometheus scraping rules and pre-built Grafana dashboards visualizing core metrics.",
    },
    {
      id: "security-cost",
      name: "Security & FinOps Practices",
      weight: 15,
      layerId: "cloud-8",
      description:
        "Strict IAM least privilege, zero hardcoded secrets, and clear cloud resource lifecycle rules.",
    },
    {
      id: "ci-validation",
      name: "CI/CD & Automation",
      weight: 15,
      layerId: "cloud-6",
      description:
        "Automated testing pipeline executing terraform validate, linting, and synthetic local verification.",
    },
    {
      id: "docs-dr",
      name: "Documentation & DR Plan",
      weight: 10,
      layerId: "cloud-9",
      description:
        "Comprehensive README covering local setup, architecture specs, and failover/DR strategy.",
    },
  ],

  twistPool: [
    {
      id: "cross-region-s3",
      text: "Configure Terraform to manage S3 Cross-Region Replication to a secondary simulated LocalStack region with object lock enabled.",
    },
    {
      id: "cost-budgets",
      text: "Add AWS Budgets Terraform resources with alerting thresholds and export FinOps cost-allocation tags across all resources.",
    },
    {
      id: "trivy-scan",
      text: "Integrate Trivy container image scanning into the local Makefile and CI workflow to block images with critical CVEs.",
    },
    {
      id: "loki-logging",
      text: "Integrate Loki and Promtail into the Docker Compose setup to collect and aggregate container logs alongside Prometheus metrics.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
