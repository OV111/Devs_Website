/**
 * Capstone brief — azure-dev track (azure-dev), v1.
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
  trackId: "azure-dev",
  categoryId: "devops",
  slug: "azure-dev-serverless-bicep-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Serverless Event-Driven Platform on Azure with Bicep",
  summary:
    "Design and deploy an enterprise serverless platform on Azure using Bicep infrastructure declarations. " +
    "You will build Azure Functions, Event Grid subscriptions, Azure Blob Storage, Cosmos DB collections, " +
    "and Application Insights observability.",
  stack: [
    "Bicep",
    "Azure Functions",
    "Azure Cosmos DB",
    "Azure Event Grid",
    "Azure Pipelines",
    "Docker",
  ],

  requirements: [
    {
      id: "bicep-modules",
      text: "Bicep templates define resource groups, App Service plans, Function Apps, and Cosmos DB accounts.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "azure-functions",
      text: "Serverless Azure Functions process HTTP endpoints and Event Grid events using input/output bindings.",
      check: { type: "file", glob: "src/**/*.{js,ts,cs,py}" },
    },
    {
      id: "cosmos-db",
      text: "Cosmos DB account and container are configured with appropriate partition keys and throughput limits.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "blob-storage",
      text: "Azure Storage account containers manage lifecycle rules for static files and event backups.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "event-grid",
      text: "Event Grid topics and subscriptions route custom domain events asynchronously to serverless triggers.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "rbac-managed-identity",
      text: "System-assigned Managed Identities and Role-Based Access Control eliminate stored passwords.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "app-insights",
      text: "Application Insights is integrated with Function Apps for distributed tracing and performance telemetry.",
      check: { type: "file", glob: "**/*.bicep" },
    },
    {
      id: "azurite-local",
      text: "Docker Compose runs Azurite storage emulator for local Function execution and storage testing.",
      check: CHECKS.compose,
    },
    {
      id: "azure-pipelines",
      text: "Azure Pipelines YAML file validates Bicep files (`az bicep build`) and executes automated tests.",
      check: { type: "file", glob: "azure-pipelines*.yml" },
    },
    {
      id: "readme",
      text: "README documents local testing with Azurite, Bicep deployment commands, and Azure architecture diagrams.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "serverless-compute",
      name: "Azure Serverless Architecture",
      weight: 25,
      layerId: "azure-dev-4",
      description:
        "Efficient Azure Functions design using triggers, input/output bindings, and Durable Functions concepts.",
    },
    {
      id: "iac-bicep",
      name: "Infrastructure as Code with Bicep",
      weight: 20,
      layerId: "azure-dev-6",
      description:
        "Modular Bicep syntax utilizing parameters, outputs, modules, and target deployment scopes.",
    },
    {
      id: "data-persistence",
      name: "Cosmos DB & Blob Storage Design",
      weight: 20,
      layerId: "azure-dev-3",
      description:
        "Proper Cosmos DB partition key selection, indexing policy, and storage account tiering.",
    },
    {
      id: "identity-security",
      name: "Security & Managed Identities",
      weight: 15,
      layerId: "azure-dev-1",
      description:
        "Implementation of Managed Identities, Azure AD RBAC roles, and zero plaintext secret usage.",
    },
    {
      id: "observability-insights",
      name: "Application Insights & Telemetry",
      weight: 10,
      layerId: "azure-dev-8",
      description:
        "Configured Application Insights instrumentation key integration and Log Analytics setup.",
    },
    {
      id: "cicd-testing",
      name: "CI/CD & Documentation",
      weight: 10,
      layerId: "azure-dev-9",
      description:
        "Automated Azure Pipelines workflow, local emulator instructions, and clear setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "key-vault-secrets",
      text: "Add Azure Key Vault Bicep resources and reference Key Vault secrets dynamically inside Function App settings.",
    },
    {
      id: "aks-bicep-deployment",
      text: "Include an additional Bicep module provisioning an Azure Kubernetes Service (AKS) cluster with node pools.",
    },
    {
      id: "service-bus-dlq",
      text: "Integrate Azure Service Bus queues with dead-letter queue processing alongside Event Grid.",
    },
    {
      id: "apim-gateway",
      text: "Add an Azure API Management (APIM) Bicep template exposing and throttling serverless backend routes.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
