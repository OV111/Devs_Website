/**
 * Capstone brief — Platform Engineer track (platform-engineer), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "platform-engineer",
  categoryId: "devops",
  slug: "platform-engineer-backstage-crossplane-idp",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Internal Developer Platform with Backstage, Crossplane, and GitOps",
  summary:
    "Construct an Internal Developer Platform (IDP) enabling self-service infrastructure and service scaffolding. " +
    "You will integrate Backstage software catalog templates, Crossplane custom resource abstractions, " +
    "ArgoCD App-of-Apps GitOps delivery, OPA admission guardrails, and golden signal dashboards.",
  stack: ["Backstage", "Crossplane", "ArgoCD", "Kubernetes", "Helm", "GitHub Actions"],

  requirements: [
    { id: "backstage-catalog", text: "Backstage configuration catalog defines software entity models, component relationships, and TechDocs specs.", check: { type: "file", glob: "catalog-info.yaml" } },
    { id: "software-templates", text: "Backstage Software Templates scaffold golden-path microservices complete with CI/CD workflows and Dockerfiles.", check: { type: "file", glob: "templates/**/template.yaml" } },
    { id: "crossplane-compositions", text: "Crossplane Compositions and Custom Resource Definitions (XRDs) abstract infrastructure provisioning for developers.", check: { type: "file", glob: "crossplane/**/*.yaml" } },
    { id: "argocd-app-of-apps", text: "ArgoCD App-of-Apps pattern orchestrates platform component releases and tenant workload deployments declaratively.", check: { type: "file", glob: "gitops/**/app-of-apps.yaml" } },
    { id: "helm-golden-path", text: "A standardized Helm chart acts as a golden-path base template for all self-serviced application workloads.", check: { type: "file", glob: "charts/**/Chart.yaml" } },
    { id: "opa-guardrails", text: "Policy-as-code rules reject non-compliant self-service requests missing required tags or exceeding resource limits.", check: { type: "file", glob: "policies/*.rego" } },
    { id: "golden-signals-dashboard", text: "Grafana dashboard templates visualize platform-wide golden signals and self-service adoption metrics.", check: { type: "file", glob: "dashboards/*.json" } },
    { id: "docker-compose", text: "Docker Compose boots local development environment with Backstage, kind cluster scripts, and mock GitOps repo.", check: CHECKS.compose },
    { id: "ci-validation", text: "GitHub Actions workflow validates template syntax, runs rego policy tests, and lints Helm charts on pull requests.", check: CHECKS.ci },
    { id: "readme", text: "README documents platform architecture, developer onboarding onboarding guide, and self-service provisioning workflow.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "developer-portal", name: "Developer Portal & Scaffolding", weight: 25, layerId: "platform-engineer-5", description: "Effective Backstage catalog setup and fully working software templates producing golden-path microservices." },
    { id: "self-service-apis", name: "Self-Service APIs & Operators", weight: 20, layerId: "platform-engineer-7", description: "Clean Crossplane compositions hiding infrastructure complexity behind developer-friendly abstractions." },
    { id: "gitops-delivery", name: "GitOps Platform Delivery", weight: 20, layerId: "platform-engineer-6", description: "Robust App-of-Apps pattern implementation in ArgoCD handling multi-tenant workload propagation." },
    { id: "governance-security", name: "Policy, Guardrails & RBAC", weight: 15, layerId: "platform-engineer-9", description: "Enforcement of OPA policies for self-serviced resources and multi-tenant namespace isolation." },
    { id: "observability-dx", name: "Platform Observability & DX", weight: 10, layerId: "platform-engineer-8", description: "Platform-wide golden signal dashboards, TechDocs integration, and low developer cognitive load." },
    { id: "operations-docs", name: "Platform Operations & Onboarding", weight: 10, layerId: "platform-engineer-10", description: "Comprehensive documentation covering team onboarding, platform versioning, and operational runbooks." },
  ],

  twistPool: [
    { id: "scorecard-plugin", text: "Integrate a custom Backstage TechInsights / Scorecard configuration scoring component production-readiness." },
    { id: "ephemeral-environments", text: "Extend Software Templates to dynamically provision ephemeral pull-request environments via ArgoCD." },
    { id: "cost-allocation-exporter", text: "Implement a platform cost allocation sidecar exporting per-team compute usage metrics to Prometheus." },
    { id: "keda-autoscaling-template", text: "Embed KEDA (Kubernetes Event-driven Autoscaling) scaled objects inside the golden-path Helm chart template." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — DevSecOps Engineer track (devsecops), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "devsecops",
  categoryId: "devops",
  slug: "devsecops-automated-security-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated DevSecOps Security Pipeline and Policy Engine",
  summary:
    "Construct a secure delivery pipeline embedding automated security guardrails at every layer. " +
    "You will integrate dependency scanning (Snyk), static analysis (SonarQube/Semgrep), container scanning (Trivy), " +
    "dynamic API scanning (OWASP ZAP), OPA policy enforcement, and Vault dynamic secrets management.",
  stack: ["Snyk", "Trivy", "SonarQube", "HashiCorp Vault", "Open Policy Agent", "GitHub Actions"],

  requirements: [
    { id: "sca-scanning", text: "Pipeline executes Software Composition Analysis (SCA) to block builds with critical CVE vulnerabilities.", check: CHECKS.ci },
    { id: "sast-analysis", text: "Static application security testing (SAST) checks code against OWASP Top 10 rules and fails on quality gates.", check: CHECKS.ci },
    { id: "container-scanning", text: "Trivy scans Docker container images and infrastructure-as-code manifests for misconfigurations.", check: CHECKS.ci },
    { id: "vault-secrets", text: "Application authenticates with HashiCorp Vault to dynamically fetch database credentials at runtime.", check: { type: "file", glob: "config/**/*.json" } },
    { id: "opa-policy", text: "Open Policy Agent (OPA) Rego rules enforce admission control and IaC security compliance.", check: { type: "file", glob: "policies/*.rego" } },
    { id: "dast-scanning", text: "Dynamic Application Security Testing (DAST) runs OWASP ZAP baseline API security scans against active test instances.", check: CHECKS.ci },
    { id: "sbom-generation", text: "Pipeline generates a Software Bill of Materials (SBOM) in CycloneDX or SPDX format during build.", check: CHECKS.ci },
    { id: "docker-hardening", text: "Dockerfile implements multi-stage builds, non-root user execution, and read-only filesystems.", check: CHECKS.dockerfile },
    { id: "compose-local", text: "Docker Compose spins up target application, local Vault server, and OPA policy engine for offline validation.", check: CHECKS.compose },
    { id: "readme", text: "README documents threat model, security posture, vulnerability remediation workflows, and local scanning guide.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "pipeline-security", name: "Pipeline Security Integration", weight: 25, layerId: "devsecops-6", description: "Seamless CI integration of SAST, SCA, and DAST stages with automated build breakage on critical severity." },
    { id: "container-iac-security", name: "Container & IaC Hardening", weight: 20, layerId: "devsecops-4", description: "Hardened Dockerfiles, minimal base images, non-root execution, and Trivy container vulnerability fixes." },
    { id: "secrets-management", name: "Vault & Secrets Engineering", weight: 20, layerId: "devsecops-5", description: "Dynamic database credentials, secret rotation mechanisms, and zero committed hardcoded credentials." },
    { id: "policy-as-code", name: "Policy as Code & Guardrails", weight: 15, layerId: "devsecops-8", description: "Comprehensive Rego policies for OPA verifying Kubernetes/IaC compliance standards." },
    { id: "supply-chain", name: "Supply Chain & SBOM", weight: 10, layerId: "devsecops-9", description: "Automated generation and verification of SBOM artifacts and artifact provenance." },
    { id: "threat-modeling-docs", name: "Threat Modeling & Documentation", weight: 10, layerId: "devsecops-1", description: "Clear threat model diagram, vulnerability triage guidelines, and operational runbooks." },
  ],

  twistPool: [
    { id: "cosign-image-signing", text: "Sign built container images with Cosign and add an OPA policy enforcing signature validation before deploy." },
    { id: "falco-runtime-rules", text: "Provide Falco runtime security rules detecting unexpected shell spawns inside running app containers." },
    { id: "defectdojo-export", text: "Add a pipeline script exporting scan results from Trivy and Snyk directly into a DefectDojo vulnerability dashboard." },
    { id: "vault-pki-mtls", text: "Configure Vault PKI secrets engine to dynamically issue mTLS client certificates for service communication." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Azure Specialist track (azure-dev), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

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
  stack: ["Bicep", "Azure Functions", "Azure Cosmos DB", "Azure Event Grid", "Azure Pipelines", "Docker"],

  requirements: [
    { id: "bicep-modules", text: "Bicep templates define resource groups, App Service plans, Function Apps, and Cosmos DB accounts.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "azure-functions", text: "Serverless Azure Functions process HTTP endpoints and Event Grid events using input/output bindings.", check: { type: "file", glob: "src/**/*.{js,ts,cs,py}" } },
    { id: "cosmos-db", text: "Cosmos DB account and container are configured with appropriate partition keys and throughput limits.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "blob-storage", text: "Azure Storage account containers manage lifecycle rules for static files and event backups.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "event-grid", text: "Event Grid topics and subscriptions route custom domain events asynchronously to serverless triggers.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "rbac-managed-identity", text: "System-assigned Managed Identities and Role-Based Access Control eliminate stored passwords.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "app-insights", text: "Application Insights is integrated with Function Apps for distributed tracing and performance telemetry.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "azurite-local", text: "Docker Compose runs Azurite storage emulator for local Function execution and storage testing.", check: CHECKS.compose },
    { id: "azure-pipelines", text: "Azure Pipelines YAML file validates Bicep files (`az bicep build`) and executes automated tests.", check: { type: "file", glob: "azure-pipelines*.yml" } },
    { id: "readme", text: "README documents local testing with Azurite, Bicep deployment commands, and Azure architecture diagrams.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "serverless-compute", name: "Azure Serverless Architecture", weight: 25, layerId: "azure-dev-4", description: "Efficient Azure Functions design using triggers, input/output bindings, and Durable Functions concepts." },
    { id: "iac-bicep", name: "Infrastructure as Code with Bicep", weight: 20, layerId: "azure-dev-6", description: "Modular Bicep syntax utilizing parameters, outputs, modules, and target deployment scopes." },
    { id: "data-persistence", name: "Cosmos DB & Blob Storage Design", weight: 20, layerId: "azure-dev-3", description: "Proper Cosmos DB partition key selection, indexing policy, and storage account tiering." },
    { id: "identity-security", name: "Security & Managed Identities", weight: 15, layerId: "azure-dev-1", description: "Implementation of Managed Identities, Azure AD RBAC roles, and zero plaintext secret usage." },
    { id: "observability-insights", name: "Application Insights & Telemetry", weight: 10, layerId: "azure-dev-8", description: "Configured Application Insights instrumentation key integration and Log Analytics setup." },
    { id: "cicd-testing", name: "CI/CD & Documentation", weight: 10, layerId: "azure-dev-9", description: "Automated Azure Pipelines workflow, local emulator instructions, and clear setup documentation." },
  ],

  twistPool: [
    { id: "key-vault-secrets", text: "Add Azure Key Vault Bicep resources and reference Key Vault secrets dynamically inside Function App settings." },
    { id: "aks-bicep-deployment", text: "Include an additional Bicep module provisioning an Azure Kubernetes Service (AKS) cluster with node pools." },
    { id: "service-bus-dlq", text: "Integrate Azure Service Bus queues with dead-letter queue processing alongside Event Grid." },
    { id: "apim-gateway", text: "Add an Azure API Management (APIM) Bicep template exposing and throttling serverless backend routes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — GCP Specialist track (gcp-dev), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

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
  stack: ["Terraform", "Google Cloud Run", "GCP Pub/Sub", "BigQuery", "Firestore", "Docker"],

  requirements: [
    { id: "tf-gcp-provision", text: "Terraform modules declare Cloud Run services, Pub/Sub topics, Firestore databases, and BigQuery datasets.", check: { type: "file", glob: "**/*.tf" } },
    { id: "cloud-run-app", text: "Containerized application service runs on Cloud Run with health check endpoints and concurrency configuration.", check: CHECKS.dockerfile },
    { id: "pubsub-messaging", text: "Pub/Sub topic and push subscription routes messages to Cloud Run endpoints with dead-letter topic retries.", check: { type: "file", glob: "**/*.tf" } },
    { id: "firestore-storage", text: "Application stores real-time transaction state in Firestore document collections.", check: { type: "file", glob: "src/**/*.{js,ts,py,go}" } },
    { id: "bigquery-analytics", text: "BigQuery partitioned tables receive streamed event records for analytical processing.", check: { type: "file", glob: "**/*.tf" } },
    { id: "gcp-iam-workload", text: "IAM service accounts utilize strict role bindings following the principle of least privilege.", check: { type: "file", glob: "**/*.tf" } },
    { id: "local-emulators", text: "Docker Compose provisions GCP Pub/Sub and BigQuery emulators for end-to-end offline local testing.", check: CHECKS.compose },
    { id: "unit-tests", text: "Automated unit tests exercise event parsing, payload validation, and database operations.", check: CHECKS.jsTests },
    { id: "ci-pipeline", text: "GitHub Actions workflow executes terraform validate, lints Dockerfiles, and runs test suites.", check: CHECKS.ci },
    { id: "readme", text: "README documents local emulator execution, GCP architecture diagrams, and cost-optimization choices.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "gcp-architecture", name: "GCP Compute & Serverless Arch", weight: 25, layerId: "gcp-dev-2", description: "Efficient Cloud Run service containerization, autoscaling configuration, and stateless request handling." },
    { id: "iac-terraform", name: "IaC & Resource Provisioning", weight: 20, layerId: "gcp-dev-9", description: "Clean modular Terraform HCL structures managing GCP resources declaratively." },
    { id: "storage-analytics", name: "Storage & BigQuery Analytics", weight: 20, layerId: "gcp-dev-6", description: "Effective BigQuery table partitioning/clustering design and reliable Firestore state persistence." },
    { id: "messaging-pubsub", name: "Pub/Sub Messaging & Resiliency", weight: 15, layerId: "gcp-dev-4", description: "Proper push subscription routing, message ordering setup, and dead-letter queue handling." },
    { id: "security-iam", name: "GCP Security & IAM", weight: 10, layerId: "gcp-dev-1", description: "Least privilege service accounts, Workload Identity configuration, and secret management." },
    { id: "testing-docs", name: "Local Testing & Documentation", weight: 10, layerId: "gcp-dev-8", description: "Comprehensive setup guide using emulators and automated CI validation checks." },
  ],

  twistPool: [
    { id: "cloud-build-trigger", text: "Configure Cloud Build triggers via Terraform to build container images and push to Artifact Registry on commit." },
    { id: "cloud-storage-lifecycle", text: "Add Cloud Storage bucket resources with lifecycle transition rules to archive raw event payloads to Coldline storage." },
    { id: "gke-workload-identity", text: "Provide alternative GKE Deployment manifests using Workload Identity to interact with Pub/Sub securely." },
    { id: "log-based-metrics", text: "Define Cloud Logging log-based metric resources and alerts triggering when event processing errors spike." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — AWS Specialist track (aws-dev), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "aws-dev",
  categoryId: "devops",
  slug: "aws-dev-serverless-event-driven-api",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Serverless Event-Driven Architecture on AWS (LocalStack)",
  summary:
    "Architect and deploy a fully serverless backend on AWS using CloudFormation/SAM or Terraform with LocalStack. " +
    "You will implement API Gateway endpoints, Lambda functions, DynamoDB tables with streams, SQS/SNS messaging, " +
    "and CloudWatch observability.",
  stack: ["AWS CloudFormation", "AWS Lambda", "DynamoDB", "SQS", "LocalStack", "GitHub Actions"],

  requirements: [
    { id: "cfn-template", text: "Infrastructure declared completely in CloudFormation/SAM or Terraform templates without manual setup.", check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" } },
    { id: "api-gateway", text: "REST or HTTP API Gateway routes requests to Lambda handler functions with request validation.", check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" } },
    { id: "lambda-handlers", text: "Serverless Lambda handlers process requests, interact with DynamoDB, and send messages to SQS.", check: { type: "file", glob: "src/**/*.{js,ts,py,go}" } },
    { id: "dynamodb-streams", text: "DynamoDB table uses single-table design principles and processes record updates via stream triggers.", check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" } },
    { id: "sqs-sns-decoupling", text: "SQS queues and SNS topics provide asynchronous decoupling and dead-letter queue (DLQ) error handling.", check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" } },
    { id: "cloudwatch-metrics", text: "CloudWatch alarms monitor Lambda error rates, DLQ message counts, and API Gateway 5xx latency.", check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" } },
    { id: "compose-localstack", text: "Docker Compose spins up LocalStack to emulate AWS serverless services locally.", check: CHECKS.compose },
    { id: "unit-tests", text: "Automated unit tests cover Lambda handler logic and message serialization rules.", check: CHECKS.jsTests },
    { id: "ci-pipeline", text: "GitHub Actions workflow lints CloudFormation templates (cfn-lint), runs tests, and validates local SAM build.", check: CHECKS.ci },
    { id: "readme", text: "README documents AWS SAM/LocalStack local deployment, testing steps, and architecture diagram.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "serverless-arch", name: "Serverless & Compute Architecture", weight: 25, layerId: "aws-dev-4", description: "Efficient Lambda handler design, proper event triggering, and clean runtime management." },
    { id: "iac-cloudformation", name: "IaC & AWS Provisioning", weight: 20, layerId: "aws-dev-6", description: "Clean CloudFormation/SAM templates with proper parameters, outputs, and stack modularity." },
    { id: "data-messaging", name: "DynamoDB & Async Messaging", weight: 20, layerId: "aws-dev-7", description: "Effective DynamoDB schema, Stream event integration, and reliable SQS DLQ handling." },
    { id: "security-iam", name: "AWS Security & Least Privilege", weight: 15, layerId: "aws-dev-5", description: "Granular IAM execution roles per Lambda function and secure VPC/service endpoints." },
    { id: "observability", name: "CloudWatch Observability", weight: 10, layerId: "aws-dev-8", description: "Structured logging, custom metrics, and CloudWatch alarms monitoring error budgets." },
    { id: "ci-testing", name: "CI Automation & Documentation", weight: 10, layerId: "aws-dev-9", description: "Automated template linting, unit testing in CI, and thorough setup documentation." },
  ],

  twistPool: [
    { id: "xray-tracing", text: "Enable AWS X-Ray active tracing across API Gateway and Lambda functions to capture full request trace graphs." },
    { id: "s3-event-processing", text: "Add an S3 bucket with object-created notification triggers driving automated image/document processing in Lambda." },
    { id: "cognito-auth-mock", text: "Configure API Gateway with a Cognito User Pool authorizer or JWT authorizer mock verifying auth headers." },
    { id: "eventbridge-bus", text: "Replace direct SNS messaging with a custom EventBridge event bus with rule filtering for domain events." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Kubernetes Engineer track (kubernetes), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "kubernetes",
  categoryId: "devops",
  slug: "kubernetes-production-platform-cluster",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production-Grade Microservice Platform on Kubernetes",
  summary:
    "Design and deploy a resilient microservice application platform on Kubernetes (kind/minikube). " +
    "You will craft multi-stage Dockerfiles, Helm charts, Ingress routing rules, Istio service mesh mTLS policies, " +
    "RBAC permissions, Horizontal Pod Autoscalers, and GitOps sync manifests.",
  stack: ["Kubernetes", "Docker", "Helm", "Istio", "ArgoCD", "GitHub Actions"],

  requirements: [
    { id: "dockerfile", text: "Multi-stage Dockerfile builds secure, non-root, minimal container images for microservices.", check: CHECKS.dockerfile },
    { id: "k8s-workloads", text: "Manifests define Deployments, ClusterIP Services, ConfigMaps, and Secrets with explicit resource requests and limits.", check: { type: "file", glob: "k8s/**/*.yaml" } },
    { id: "helm-chart", text: "A custom Helm chart abstracts application configuration with templates, helpers, and environment value overrides.", check: { type: "file", glob: "charts/**/Chart.yaml" } },
    { id: "ingress-networking", text: "Ingress resources configure host-based routing, path rewriting, and TLS secret termination.", check: { type: "file", glob: "k8s/**/ingress*.yaml" } },
    { id: "istio-mesh", text: "Istio VirtualService, DestinationRule, and PeerAuthentication manifests enforce strict mTLS and canary traffic splitting.", check: { type: "file", glob: "istio/**/*.yaml" } },
    { id: "rbac-security", text: "Role, ClusterRole, and RoleBinding objects restrict ServiceAccount permissions using the principle of least privilege.", check: { type: "file", glob: "k8s/**/rbac*.yaml" } },
    { id: "autoscaling", text: "HorizontalPodAutoscaler (HPA) manifests scale workloads based on CPU and Memory usage thresholds.", check: { type: "file", glob: "k8s/**/hpa*.yaml" } },
    { id: "argocd-gitops", text: "ArgoCD Application manifests automate continuous deployment and drift detection from this repository.", check: { type: "file", glob: "gitops/**/*.yaml" } },
    { id: "ci-validation", text: "GitHub Actions workflow executes kube-linter, helm lint, and validates manifest syntax on PRs.", check: CHECKS.ci },
    { id: "readme", text: "README provides step-by-step instructions to spin up a local kind cluster, install dependencies, and verify traffic routing.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "workload-architecture", name: "K8s Workload Architecture", weight: 25, layerId: "kubernetes-2", description: "Properly configured Pod specs with health probes, resource limits, anti-affinity, and configuration injection." },
    { id: "packaging-helm", name: "Helm Packaging & Templating", weight: 15, layerId: "kubernetes-4", description: "Modular Helm chart design using helpers, input schema validation, and clean parameterization." },
    { id: "networking-mesh", name: "Ingress & Istio Service Mesh", weight: 20, layerId: "kubernetes-6", description: "Effective VirtualService traffic routing, canary splits, and PeerAuthentication mTLS enforcement." },
    { id: "security-rbac", name: "Cluster Security & RBAC", weight: 15, layerId: "kubernetes-7", description: "Strict Role-Based Access Control, standard Pod Security Standards, and non-root container specs." },
    { id: "autoscaling-ops", name: "Autoscaling & Operations", weight: 15, layerId: "kubernetes-8", description: "Correct HPA configuration and operational resilience under simulated load." },
    { id: "gitops-docs", name: "GitOps Delivery & Docs", weight: 10, layerId: "kubernetes-9", description: "Clean ArgoCD GitOps workflow setup and clear cluster setup/teardown instructions." },
  ],

  twistPool: [
    { id: "etcd-backup-script", text: "Include an automated cron job manifest and script that performs etcd snapshot backups to simulated S3 storage." },
    { id: "network-policy-lockdown", text: "Implement strict NetworkPolicy objects blocking cross-namespace traffic except explicitly allowed ports." },
    { id: "custom-prometheus-rule", text: "Add PrometheusRule custom resources defining firing alerts for pod crash loops and high memory utilization." },
    { id: "pvc-storage-class", text: "Configure a dynamic PersistentVolumeClaim using a local StorageClass for stateful application data preservation." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Infrastructure Dev track (infra), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "infra",
  categoryId: "devops",
  slug: "infra-multi-env-automation-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Environment Infrastructure Automation with Terraform and Ansible",
  summary:
    "Build a production-grade infrastructure orchestration framework combining modular Terraform " +
    "declarations with Ansible configuration management. You will provision isolated staging and " +
    "production environments locally using LocalStack or Docker, enforce policy checks, and manage remote state.",
  stack: ["Terraform", "Ansible", "Pulumi", "Docker", "GitHub Actions"],

  requirements: [
    { id: "tf-modules", text: "Terraform configurations use reusable local modules for networking, compute, and storage abstraction.", check: { type: "file", glob: "terraform/**/*.tf" } },
    { id: "ansible-playbooks", text: "Ansible playbooks and roles configure system packages, users, firewalls, and service dependencies idempotently.", check: { type: "file", glob: "ansible/**/*.{yml,yaml}" } },
    { id: "environment-isolation", text: "Directory layout enforces clear workspace/environment separation between staging and production stages.", check: { type: "file", glob: "terraform/environments/**/*.tf" } },
    { id: "state-backend", text: "Configures remote state backend settings with state locking mechanisms and encrypted data storage.", check: { type: "file", glob: "terraform/**/*.tf" } },
    { id: "pulumi-stack", text: "Provides a Pulumi infrastructure program demonstrating programmatic IaC resource creation for a auxiliary service.", check: { type: "file", glob: "pulumi/**/*.{js,ts,py,go,yaml}" } },
    { id: "iac-testing", text: "Infrastructure code includes automated linting (tflint, ansible-lint) and policy-as-code validation rules.", check: CHECKS.ci },
    { id: "docker-local", text: "Docker Compose sets up local target nodes/containers and local backend infrastructure for testing playbooks.", check: CHECKS.compose },
    { id: "env-example", text: "Templates required variables and credentials in .env.example with zero committed secrets.", check: CHECKS.envExample },
    { id: "ci-pipeline", text: "GitHub Actions pipeline executes formatting checks, terraform plan, and ansible playbook linting automatically.", check: CHECKS.ci },
    { id: "readme", text: "README documents local provisioning workflow, drift detection execution, and disaster recovery restoration.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "iac-modularization", name: "Modular Provisioning & Design", weight: 25, layerId: "infra-3", description: "Well-structured Terraform code using reusable local modules, strict variable validations, and explicit outputs." },
    { id: "config-management", name: "Configuration Management", weight: 20, layerId: "infra-4", description: "Idempotent Ansible playbooks and structured roles configuring target host states reliably." },
    { id: "programmatic-iac", name: "Programmatic IaC & Abstraction", weight: 15, layerId: "infra-6", description: "Clean implementation of Pulumi stack resources adhering to software engineering practices." },
    { id: "state-security", name: "State Isolation & Secrets", weight: 15, layerId: "infra-7", description: "Safe state locking setup, clean secret handling, and clear environment boundary isolation." },
    { id: "testing-policy", name: "IaC Testing & Policy as Code", weight: 15, layerId: "infra-8", description: "Automated linting, policy enforcement, and plan output inspection integrated into CI." },
    { id: "operations-dr", name: "Day-2 Operations & Docs", weight: 10, layerId: "infra-10", description: "Comprehensive documentation covering drift remediation, backup routines, and teardown instructions." },
  ],

  twistPool: [
    { id: "drift-detection-script", text: "Add a scheduled pipeline script that runs terraform plan -detailed-exitcode to notify on out-of-band drift." },
    { id: "vault-ansible-lookup", text: "Integrate HashiCorp Vault lookup dynamic secrets inside Ansible playbooks for database credentials during provisioning." },
    { id: "opa-conftest", text: "Implement OpenPolicyAgent / Conftest rego policy checks in CI to reject open security groups or missing tags." },
    { id: "terratest-integration", text: "Add automated Go-based Terratest or Python-based pytest integration tests that validate active docker infrastructure." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Site Reliability Engineer track (sre), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "sre",
  categoryId: "devops",
  slug: "sre-resilient-telemetry-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Resilient Microservice with Telemetry, SLOs, and Alerting",
  summary:
    "Develop a highly available Go backend service engineered for reliability. You will implement " +
    "resilience patterns (circuit breakers, rate limiting, graceful shutdown), export custom Prometheus metrics, " +
    "configure Grafana SLO dashboards, and simulate automated incident alerting with runbooks.",
  stack: ["Go", "Prometheus", "Grafana", "Alertmanager", "OpenTelemetry", "Docker Compose"],

  requirements: [
    { id: "go-module", text: "Go service uses a clean module structure with standard dependency management.", check: CHECKS.goModule },
    { id: "go-tests", text: "Unit and integration tests verify core service functionality and resiliency logic.", check: CHECKS.goTests },
    { id: "resilience-patterns", text: "Service implements configurable request timeouts, exponential backoff retries, and circuit breaking for downstream calls." },
    { id: "graceful-shutdown", text: "Service handles SIGINT/SIGTERM signals to complete in-flight requests and shut down cleanly." },
    { id: "prometheus-exporter", text: "Exposes standard Prometheus metrics (/metrics) for HTTP latency histograms, error rates, and active connections." },
    { id: "prom-alerts", text: "Prometheus alert rules evaluate burn rates against 99.9% availability and latency SLO targets.", check: { type: "file", glob: "prometheus/*.{yml,yaml}" } },
    { id: "grafana-dashboards", text: "Provisioned Grafana dashboard JSON visualizes the four golden signals and error budget consumption.", check: { type: "file", glob: "grafana/**/*.json" } },
    { id: "docker-environment", text: "Docker Compose provisions the Go application, Prometheus, Alertmanager, and Grafana in a unified network.", check: CHECKS.compose },
    { id: "ci-pipeline", text: "GitHub Actions runs Go linting, unit tests, and race condition detection on every pull request.", check: CHECKS.ci },
    { id: "runbook-docs", text: "Repository contains an incident response runbook and post-mortem template alongside setup docs.", check: { type: "file", glob: ["docs/*.md", "README.md"] } },
  ],

  rubric: [
    { id: "go-resilience", name: "Reliability & Resilience Code", weight: 25, layerId: "sre-8", description: "Proper Go implementation of timeouts, retries, circuit breakers, rate limiting, and graceful shutdown." },
    { id: "telemetry-metrics", name: "Metrics & OpenTelemetry Instrumentation", weight: 20, layerId: "sre-2", description: "Accurate HTTP latency histograms, counter metrics, and tracing instrumentation." },
    { id: "slo-alerting", name: "SLOs & Burn Rate Alerting", weight: 20, layerId: "sre-4", description: "Well-defined Service Level Objectives and multi-window burn rate alerts configured in Prometheus." },
    { id: "visualization", name: "Dashboarding & Golden Signals", weight: 15, layerId: "sre-3", description: "Grafana dashboards clearly displaying latency, traffic, errors, saturation, and error budget tracking." },
    { id: "incident-readiness", name: "Incident Management & Runbooks", weight: 10, layerId: "sre-7", description: "Detailed, actionable runbooks for firing alerts and structured post-mortem document templates." },
    { id: "testing-ci", name: "Testing & CI Integration", weight: 10, layerId: "sre-9", description: "Automated test suite with race detector enabled running seamlessly in CI workflows." },
  ],

  twistPool: [
    { id: "load-shedding", text: "Implement adaptive load shedding when system concurrency exceeds a threshold, returning HTTP 530/503." },
    { id: "chaos-injection", text: "Add an optional HTTP endpoint or flag that injects artificial latency and random 500 errors to test alert firing." },
    { id: "opentelemetry-tracing", text: "Integrate OpenTelemetry Jaeger tracing headers and span context propagation across internal calls." },
    { id: "thanos-config", text: "Add a Thanos sidecar container and configuration block to support long-term metric storage aggregation." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — CI/CD Engineer track (cicd), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "cicd",
  categoryId: "devops",
  slug: "cicd-enterprise-gitops-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise GitOps Release Pipeline with GitHub Actions and ArgoCD",
  summary:
    "Build an end-to-end multi-environment delivery pipeline using GitHub Actions, Jenkins, and ArgoCD. " +
    "You will automate build steps, dependency caching, container scanning, semantic versioning, and " +
    "declarative GitOps application synchronization for progressive deployments.",
  stack: ["GitHub Actions", "Jenkins", "ArgoCD", "Docker", "Helm", "Shell"],

  requirements: [
    { id: "build-matrix", text: "GitHub Actions workflow builds and tests code across a matrix of runtime versions using cached dependencies.", check: CHECKS.ci },
    { id: "jenkinsfile", text: "A Declarative Jenkinsfile defines build, test, image tag, and security scan stages with post actions.", check: { type: "file", glob: "Jenkinsfile" } },
    { id: "semver-tagging", text: "Automated tagging step calculates semantic versioning and tags container images pushed to a local registry.", check: CHECKS.ci },
    { id: "helm-chart", text: "A custom Helm chart packages the application with parameterized values for staging and production environments.", check: { type: "file", glob: "charts/**/Chart.yaml" } },
    { id: "argocd-app", text: "Declarative ArgoCD Application manifests define automated sync policies and drift detection for environment promotion.", check: { type: "file", glob: "gitops/**/*.yaml" } },
    { id: "security-scans", text: "Pipeline runs static analysis, dependency vulnerability scans, and container image security checks.", check: CHECKS.ci },
    { id: "dockerfile", text: "Optimized Dockerfile creates reproducible minimal runtime images for application releases.", check: CHECKS.dockerfile },
    { id: "compose-runner", text: "Docker Compose boots a local testing environment including Jenkins agent and local container registry.", check: CHECKS.compose },
    { id: "env-example", text: "An .env.example file lists all configuration keys needed for local execution and OIDC pipeline authentication.", check: CHECKS.envExample },
    { id: "readme", text: "README documents pipeline architecture, release workflow, rollback steps, and local ArgoCD simulation instructions.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "pipeline-automation", name: "Pipeline Architecture & Automation", weight: 25, layerId: "cicd-2", description: "Efficient multi-stage build workflows with caching, dynamic matrix builds, and clean stage transitions." },
    { id: "jenkins-integration", name: "Jenkins & Scripted Workflows", weight: 15, layerId: "cicd-3", description: "Properly structured Jenkinsfile with robust post actions, error handling, and parallel steps." },
    { id: "artifact-versioning", name: "Artifact & Version Management", weight: 15, layerId: "cicd-4", description: "Strict semantic versioning policies, immutable image tagging, and registry management." },
    { id: "gitops-delivery", name: "GitOps & Deployment Strategy", weight: 20, layerId: "cicd-6", description: "Clean ArgoCD application declarations with automated drift detection and multi-environment promotion." },
    { id: "pipeline-security", name: "Pipeline Security & Secrets", weight: 15, layerId: "cicd-7", description: "Inclusion of dependency scanning, least-privilege runner roles, and zero exposed credentials." },
    { id: "ops-observability", name: "Observability & Documentation", weight: 10, layerId: "cicd-8", description: "Tracking DORA/pipeline metrics, clear failure remediation steps, and comprehensive setup docs." },
  ],

  twistPool: [
    { id: "canary-flagger", text: "Add progressive canary release manifests using Helm and mock traffic metrics to simulate automated rollback on errors." },
    { id: "reusable-action", text: "Package security scanning into a custom reusable GitHub Composite Action referenced by the main pipeline." },
    { id: "cosign-signing", text: "Add container image signing using Cosign/Sigstore keyless flow in CI and verify signatures prior to deployment." },
    { id: "dora-metrics-exporter", text: "Write a script or step that logs pipeline duration and deployment status formatted for Prometheus DORA metrics ingestion." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Cloud Engineer track (cloud), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "cloud",
  categoryId: "devops",
  slug: "cloud-multi-tier-iac-observability",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production-grade multi-tier Cloud Infrastructure with Terraform & LocalStack",
  summary:
    "Design and provision a production-ready, highly available multi-tier cloud infrastructure " +
    "using Terraform, Docker, LocalStack, and Prometheus/Grafana. You will build a complete " +
    "automated workflow featuring IAM least-privilege policies, containerized services, and CI validation.",
  stack: ["Terraform", "AWS / LocalStack", "Docker", "Prometheus", "Grafana", "GitHub Actions"],

  requirements: [
    { id: "vpc-network", text: "Terraform provisions a VPC with public and private subnets across 2 AZs, NAT gateways, and isolated routing tables.", check: { type: "file", glob: "**/*.tf" } },
    { id: "iam-security", text: "IAM policies and roles follow least-privilege access for app services and state access without hardcoded credentials.", check: { type: "file", glob: "**/*.tf" } },
    { id: "s3-backend", text: "S3 bucket configuration includes versioning, encryption at rest, and lifecycle management rules.", check: { type: "file", glob: "**/*.tf" } },
    { id: "docker-build", text: "Multi-stage Dockerfile builds a lightweight containerized application with layer caching.", check: CHECKS.dockerfile },
    { id: "compose-local", text: "Docker Compose provisions a local multi-container environment running LocalStack, the app, Prometheus, and Grafana.", check: CHECKS.compose },
    { id: "k8s-manifests", text: "Kubernetes manifests define a Deployment, ClusterIP Service, and ConfigMap for the application workload.", check: { type: "file", glob: "k8s/*.{yml,yaml}" } },
    { id: "monitoring", text: "Prometheus scrapers collect metrics from the app and Grafana loads pre-configured dashboard JSON files.", check: { type: "file", glob: "monitoring/**/*.{yml,yaml,json}" } },
    { id: "ci-pipeline", text: "A CI workflow validates Terraform code formatting, runs terraform validate, lints Dockerfiles, and checks K8s manifests.", check: CHECKS.ci },
    { id: "env-example", text: "A template environment file specifies required AWS and deployment variables without containing real secrets.", check: CHECKS.envExample },
    { id: "readme", text: "README documents local deployment steps using LocalStack, architecture diagrams, and disaster recovery procedures.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "network-iac", name: "IaC & Architecture", weight: 25, layerId: "cloud-3", description: "Modular Terraform code properly structuring VPCs, IAM roles, S3 buckets, and multi-AZ layouts." },
    { id: "containerization", name: "Container & K8s Packaging", weight: 20, layerId: "cloud-4", description: "Multi-stage Docker build efficiency and well-structured Kubernetes manifests with ConfigMaps." },
    { id: "observability", name: "Monitoring & Alerting", weight: 15, layerId: "cloud-7", description: "Effective Prometheus scraping rules and pre-built Grafana dashboards visualizing core metrics." },
    { id: "security-cost", name: "Security & FinOps Practices", weight: 15, layerId: "cloud-8", description: "Strict IAM least privilege, zero hardcoded secrets, and clear cloud resource lifecycle rules." },
    { id: "ci-validation", name: "CI/CD & Automation", weight: 15, layerId: "cloud-6", description: "Automated testing pipeline executing terraform validate, linting, and synthetic local verification." },
    { id: "docs-dr", name: "Documentation & DR Plan", weight: 10, layerId: "cloud-9", description: "Comprehensive README covering local setup, architecture specs, and failover/DR strategy." },
  ],

  twistPool: [
    { id: "cross-region-s3", text: "Configure Terraform to manage S3 Cross-Region Replication to a secondary simulated LocalStack region with object lock enabled." },
    { id: "cost-budgets", text: "Add AWS Budgets Terraform resources with alerting thresholds and export FinOps cost-allocation tags across all resources." },
    { id: "trivy-scan", text: "Integrate Trivy container image scanning into the local Makefile and CI workflow to block images with critical CVEs." },
    { id: "loki-logging", text: "Integrate Loki and Promtail into the Docker Compose setup to collect and aggregate container logs alongside Prometheus metrics." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};