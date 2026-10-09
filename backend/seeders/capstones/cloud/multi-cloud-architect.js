/**
 * Capstone brief — multi-cloud-architect track (multi-cloud-architect), v1.
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
  trackId: "multi-cloud-architect",
  categoryId: "cloud",
  slug: "multi-cloud-architect-cross-cloud-mesh",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Cloud Kubernetes & Disaster Recovery Platform",
  summary:
    "Design and provision a resilient, multi-cloud platform across AWS (EKS) and Azure (AKS) using Terraform. " +
    "You will automate cross-cloud IPSec VPN tunnels, configure unified OIDC identity federation, deploy ArgoCD " +
    "ApplicationSets for cross-cluster GitOps delivery, collect central metrics with OpenTelemetry, and establish " +
    "Velero cross-cloud backup and failover procedures.",
  stack: [
    "Terraform",
    "AWS EKS",
    "Azure AKS",
    "ArgoCD",
    "OpenTelemetry",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "terraform-multi-provider",
      text: "Infrastructure code uses Terraform multi-provider configurations (AWS and Azure providers) with provider aliases and remote state locking.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "cross-cloud-vpn",
      text: "Establishes secure IPSec VPN connectivity between AWS VPC and Azure VNet with BGP dynamic routing configuration.",
    },
    {
      id: "eks-aks-clusters",
      text: "Provisions equivalent EKS and AKS Kubernetes clusters with matching network CNI subnets and OIDC provider integration.",
    },
    {
      id: "argocd-applicationsets",
      text: "Deploys ArgoCD ApplicationSets targeting both AWS and Azure Kubernetes clusters for consistent multi-cluster application delivery.",
      check: { type: "file", glob: "**/ApplicationSet*.{yml,yaml}" },
    },
    {
      id: "opentelemetry-collector",
      text: "Configures OpenTelemetry Collector daemonsets exporting unified trace spans and metrics to a vendor-neutral backend.",
    },
    {
      id: "cross-cloud-dr",
      text: "Configures Velero backup locations using object storage replication between S3 and Azure Blob for cross-cloud cluster state recovery.",
    },
    {
      id: "tests",
      text: "Automated test scripts or tflint / terraform validate checks verify Terraform module syntax and multi-provider parameters.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" },
    },
    {
      id: "readme",
      text: "README documents multi-cloud architecture topology, provider authentication setup, GitOps synchronization, and failover steps.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes terraform.tfvars.example or .env.example with placeholders for AWS and Azure credentials.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow runs terraform fmt, terraform validate, and tflint on every pull request.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "multi-cloud-iac",
      name: "Multi-Cloud IaC Engineering",
      weight: 20,
      layerId: "multi-cloud-architect-2",
      description:
        "Modular Terraform design using provider aliases, clean workspace separation, and cross-cloud dependency wiring.",
    },
    {
      id: "cross-cloud-networking",
      name: "Cross-Cloud Network Connectivity",
      weight: 20,
      layerId: "multi-cloud-architect-3",
      description:
        "Secure IPSec VPN tunnel configuration, BGP routing, CIDR planning without overlapping ranges, and security policies.",
    },
    {
      id: "k8s-gitops",
      name: "Multi-Cloud Kubernetes & GitOps",
      weight: 20,
      layerId: "multi-cloud-architect-5",
      description:
        "Symmetrical cluster provisioning across EKS and AKS, OIDC configuration, and ArgoCD ApplicationSet deployment.",
    },
    {
      id: "observability",
      name: "Unified Observability Strategy",
      weight: 15,
      layerId: "multi-cloud-architect-7",
      description:
        "OpenTelemetry Collector pipeline design, vendor-neutral metric collection, and multi-cloud dashboards.",
    },
    {
      id: "disaster-recovery",
      name: "Disaster Recovery & Backup",
      weight: 15,
      layerId: "multi-cloud-architect-9",
      description:
        "Velero cross-cloud backup configuration, data replication, and clear failover verification procedures.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI Automation",
      weight: 10,
      layerId: "multi-cloud-architect-10",
      description:
        "Comprehensive architectural documentation, cloud credentials setup guide, and automated CI pipelines.",
    },
  ],

  twistPool: [
    {
      id: "opa-policy-code",
      text: "Implement OPA/Rego policies enforcing consistent resource naming conventions and mandatory tags across both AWS and Azure resources.",
    },
    {
      id: "dns-traffic-failover",
      text: "Configure Route 53 or Cloudflare Health Checks to perform automatic global DNS failover between EKS and AKS ingress endpoints.",
    },
    {
      id: "focus-cost-normalization",
      text: "Incorporate a script normalizing cost report exports from both AWS CUR and Azure Cost Management into FOCUS schema.",
    },
    {
      id: "gcp-third-cloud",
      text: "Extend the Terraform code to provision a third standby GKE cluster in GCP connected to the existing cross-cloud mesh.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
