/**
 * Capstone brief — azure-architect track (azure-architect), v1.
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
  trackId: "azure-architect",
  categoryId: "cloud",
  slug: "azure-architect-aks-enterprise-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Azure Kubernetes Service & Landing Zone Platform",
  summary:
    "Provision a secure, enterprise-grade Azure landing zone and Azure Kubernetes Service (AKS) cluster using Bicep. " +
    "You will set up Virtual Networks with hub-and-spoke peering, configure Azure Entra ID Workload Identity, " +
    "deploy an AKS cluster with Azure CNI, provision Azure SQL Elastic Pools, and set up Log Analytics workspaces.",
  stack: [
    "Azure Bicep",
    "Azure AKS",
    "Entra ID",
    "Azure Key Vault",
    "Azure SQL",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "bicep-modules",
      text: "Infrastructure as Code is written in Bicep using modular files with parameter defaults, resource symbolic names, and output definitions.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "network-topology",
      text: "Provisions a hub-and-spoke Virtual Network architecture with Network Security Groups (NSGs) and dedicated subnets for AKS and databases.",
    },
    {
      id: "aks-cluster",
      text: "Deploys an Azure Kubernetes Service (AKS) cluster using Azure CNI networking, availability zones, and auto-scaling node pools.",
    },
    {
      id: "identity-security",
      text: "Configures Entra ID Workload Identity for pod-level authentication to Azure Key Vault without client secrets.",
    },
    {
      id: "database-layer",
      text: "Provisions an Azure SQL Database inside an Elastic Pool configured with private endpoints and active directory admin authentication.",
    },
    {
      id: "monitoring-logging",
      text: "Integrates Log Analytics workspace with Container Insights enabled for AKS cluster performance and audit logging.",
    },
    {
      id: "tests",
      text: "Includes static analysis tests or Bicep linter scripts that validate template compilation and rule compliance.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,ps1,sh}" },
    },
    {
      id: "readme",
      text: "README provides architecture diagrams, Bicep deployment parameters, az cli deployment steps, and cleanup scripts.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes parameter template file (main.bicepparam or .env.example) for environment configuration.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow uses azure/bicep-deploy or az bicep build to validate Bicep code on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "network-topology",
      name: "Virtual Network Architecture",
      weight: 20,
      layerId: "azure-architect-2",
      description:
        "Hub-and-spoke VNet configuration, subnet isolation, NSG rule accuracy, and private endpoint wiring.",
    },
    {
      id: "aks-architecture",
      name: "AKS Cluster Design",
      weight: 20,
      layerId: "azure-architect-4",
      description:
        "Azure CNI networking setup, multiple node pool configurations, and availability zone distribution.",
    },
    {
      id: "identity-security",
      name: "Identity & Key Vault Integration",
      weight: 20,
      layerId: "azure-architect-3",
      description:
        "Entra ID RBAC assignments, Workload Identity configuration, and Key Vault access policies.",
    },
    {
      id: "iac-bicep",
      name: "Bicep Engineering Quality",
      weight: 15,
      layerId: "azure-architect-6",
      description:
        "Modular Bicep structure, proper parameter files, symbolic references, and output definitions.",
    },
    {
      id: "monitoring",
      name: "Monitoring & Observability",
      weight: 15,
      layerId: "azure-architect-7",
      description:
        "Log Analytics workspace attachment, KQL diagnostic settings, and App Insights connectivity.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI",
      weight: 10,
      layerId: "azure-architect-1",
      description:
        "Clear setup commands, parameter file templates, and automated Bicep validation workflows.",
    },
  ],

  twistPool: [
    {
      id: "keda-autoscaling",
      text: "Configure KEDA (Kubernetes Event-driven Autoscaling) on AKS to scale workloads based on Azure Queue Storage message counts.",
    },
    {
      id: "app-gateway-ingress",
      text: "Provision an Azure Application Gateway Ingress Controller (AGIC) with Web Application Firewall (WAF) policies.",
    },
    {
      id: "cosmos-db-failover",
      text: "Replace Azure SQL with a multi-region Cosmos DB instance configured with custom consistency levels and automatic failover.",
    },
    {
      id: "azure-policy-guardrails",
      text: "Deploy custom Azure Policy definitions restricting public IP creation and enforcing mandatory tagging on resource groups.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
