/**
 * Capstone brief — AWS Solutions Architect track (aws-architect), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "aws-architect",
  categoryId: "cloud",
  slug: "aws-architect-multi-tier-web-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production Multi-Tier AWS Infrastructure Platform",
  summary:
    "Design and provision a highly available, multi-tier cloud platform on AWS using CloudFormation templates. " +
    "You will implement a custom VPC with public and private subnets, an Application Load Balancer targeting an " +
    "Auto Scaling group, an Aurora Multi-AZ database, serverless notification pipelines via Lambda/SQS/SNS, and " +
    "KMS-encrypted secrets management.",
  stack: ["AWS CloudFormation", "AWS EC2 / ASG", "AWS ALB", "AWS Aurora", "AWS Lambda", "GitHub Actions"],

  requirements: [
    { id: "vpc-topology", text: "CloudFormation template provisions a VPC spanning two Availability Zones with public and private subnets, NAT Gateways, and explicit route tables." },
    { id: "compute-asg", text: "An Application Load Balancer routes traffic to an EC2 Auto Scaling Group running in private subnets with strict security groups." },
    { id: "database-layer", text: "Deploys an Amazon Aurora PostgreSQL Multi-AZ cluster in private DB subnet groups with encrypted storage." },
    { id: "secret-management", text: "Database credentials and API keys are stored in AWS Secrets Manager or Parameter Store and encrypted using a custom KMS customer master key." },
    { id: "serverless-event", text: "Configures an asynchronous event pipeline where S3 file uploads trigger a Lambda function via SQS and publish status updates to SNS." },
    { id: "cfn-structure", text: "Infrastructure code is structured as modular CloudFormation templates using parameters, mappings, cross-stack outputs, and nested stacks." },
    { id: "tests", text: "Automated test scripts or cfn-lint static analysis checks validate CloudFormation templates for syntax correctness and security posture.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" } },
    { id: "readme", text: "README documents architectural topology, parameters, deployment steps, and cleanup instructions.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example or template parameter file specifying non-sensitive stack parameters.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow validates CloudFormation syntax with cfn-lint or taskcat on every commit.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "network-design", name: "VPC & Network Architecture", weight: 20, layerId: "aws-architect-2", description: "Correct CIDR allocation, public/private subnet segmentation, routing tables, and NAT Gateway configuration." },
    { id: "compute-ha", name: "High Availability & Scaling", weight: 20, layerId: "aws-architect-3", description: "ALB target group health checks, ASG multi-AZ scaling policies, and proper security group ingress/egress rules." },
    { id: "storage-db", name: "Database & Security Posture", weight: 20, layerId: "aws-architect-4", description: "Multi-AZ Aurora configuration, encryption at rest using KMS, and parameter/secret referencing." },
    { id: "iac-quality", name: "CloudFormation Engineering", weight: 15, layerId: "aws-architect-6", description: "Clean usage of parameters, outputs, intrinsic functions, export/import names, and modular stack structure." },
    { id: "serverless-integration", name: "Serverless & Messaging", weight: 15, layerId: "aws-architect-7", description: "Proper IAM execution role permissions, S3 event notifications, SQS queues, and SNS topics." },
    { id: "docs-ops", name: "Documentation & CI", weight: 10, layerId: "aws-architect-9", description: "Comprehensive README deployment guide and automated linting/validation CI pipeline." },
  ],

  twistPool: [
    { id: "cloudfront-cdn", text: "Add a CloudFront distribution in front of the Application Load Balancer with AWS WAF rate-limiting rules attached." },
    { id: "cross-region-dr", text: "Configure an S3 cross-region replication rule and a cross-region Aurora read replica for disaster recovery readiness." },
    { id: "cost-budget-alerts", text: "Provision an AWS Budget resource in CloudFormation with SNS alerts triggered at 80% expected spend thresholds." },
    { id: "route53-failover", text: "Set up Route 53 DNS failover routing policies pointing between primary infrastructure and a static S3 maintenance page." },
  ],

  rules: COMMON_RULES,/**
 * Capstone brief — Azure Architect track (azure-architect), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

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
  stack: ["Azure Bicep", "Azure AKS", "Entra ID", "Azure Key Vault", "Azure SQL", "GitHub Actions"],

  requirements: [
    { id: "bicep-modules", text: "Infrastructure as Code is written in Bicep using modular files with parameter defaults, resource symbolic names, and output definitions.", check: { type: "file", glob: "**/*.bicep" } },
    { id: "network-topology", text: "Provisions a hub-and-spoke Virtual Network architecture with Network Security Groups (NSGs) and dedicated subnets for AKS and databases." },
    { id: "aks-cluster", text: "Deploys an Azure Kubernetes Service (AKS) cluster using Azure CNI networking, availability zones, and auto-scaling node pools." },
    { id: "identity-security", text: "Configures Entra ID Workload Identity for pod-level authentication to Azure Key Vault without client secrets." },
    { id: "database-layer", text: "Provisions an Azure SQL Database inside an Elastic Pool configured with private endpoints and active directory admin authentication." },
    { id: "monitoring-logging", text: "Integrates Log Analytics workspace with Container Insights enabled for AKS cluster performance and audit logging." },
    { id: "tests", text: "Includes static analysis tests or Bicep linter scripts that validate template compilation and rule compliance.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,ps1,sh}" } },
    { id: "readme", text: "README provides architecture diagrams, Bicep deployment parameters, az cli deployment steps, and cleanup scripts.", check: CHECKS.readme },
    { id: "env-example", text: "Includes parameter template file (main.bicepparam or .env.example) for environment configuration.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow uses azure/bicep-deploy or az bicep build to validate Bicep code on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "network-topology", name: "Virtual Network Architecture", weight: 20, layerId: "azure-architect-2", description: "Hub-and-spoke VNet configuration, subnet isolation, NSG rule accuracy, and private endpoint wiring." },
    { id: "aks-architecture", name: "AKS Cluster Design", weight: 20, layerId: "azure-architect-4", description: "Azure CNI networking setup, multiple node pool configurations, and availability zone distribution." },
    { id: "identity-security", name: "Identity & Key Vault Integration", weight: 20, layerId: "azure-architect-3", description: "Entra ID RBAC assignments, Workload Identity configuration, and Key Vault access policies." },
    { id: "iac-bicep", name: "Bicep Engineering Quality", weight: 15, layerId: "azure-architect-6", description: "Modular Bicep structure, proper parameter files, symbolic references, and output definitions." },
    { id: "monitoring", name: "Monitoring & Observability", weight: 15, layerId: "azure-architect-7", description: "Log Analytics workspace attachment, KQL diagnostic settings, and App Insights connectivity." },
    { id: "docs-ops", name: "Documentation & CI", weight: 10, layerId: "azure-architect-1", description: "Clear setup commands, parameter file templates, and automated Bicep validation workflows." },
  ],

  twistPool: [
    { id: "keda-autoscaling", text: "Configure KEDA (Kubernetes Event-driven Autoscaling) on AKS to scale workloads based on Azure Queue Storage message counts." },
    { id: "app-gateway-ingress", text: "Provision an Azure Application Gateway Ingress Controller (AGIC) with Web Application Firewall (WAF) policies." },
    { id: "cosmos-db-failover", text: "Replace Azure SQL with a multi-region Cosmos DB instance configured with custom consistency levels and automatic failover." },
    { id: "azure-policy-guardrails", text: "Deploy custom Azure Policy definitions restricting public IP creation and enforcing mandatory tagging on resource groups." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — GCP Architect track (gcp-architect), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

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
  stack: ["Terraform", "Google Cloud Platform", "GKE", "BigQuery", "Cloud Run", "GitHub Actions"],

  requirements: [
    { id: "terraform-modules", text: "Infrastructure is declared using modular Terraform files specifying the Google provider, remote GCS state storage, and clear outputs.", check: { type: "file", glob: "**/*.tf" } },
    { id: "custom-vpc", text: "Provisions a custom-mode VPC network with secondary IP ranges for pod/service allocations, Cloud NAT, and private Google access." },
    { id: "gke-autopilot", text: "Deploys a private GKE Autopilot cluster with Workload Identity Federation enabled for service account mapping." },
    { id: "analytics-pipeline", text: "Configures a Pub/Sub topic and subscription connected to a partitioned and clustered BigQuery dataset." },
    { id: "serverless-service", text: "Deploys a Cloud Run microservice connected to the private VPC network via Serverless VPC Access connector." },
    { id: "security-kms", text: "Enforces Secret Manager secret storage and Cloud KMS customer-managed encryption keys for BigQuery and Cloud Storage buckets." },
    { id: "tests", text: "Automated test scripts or tflint / terraform validate checks verify Terraform configuration integrity.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" } },
    { id: "readme", text: "README documents architecture layout, Terraform variables, gcloud authentication steps, and teardown commands.", check: CHECKS.readme },
    { id: "env-example", text: "Includes terraform.tfvars.example or .env.example with configuration placeholders.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow executes terraform fmt, terraform validate, and tflint on pull requests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "network-architecture", name: "GCP VPC & Network Topology", weight: 20, layerId: "gcp-architect-2", description: "Custom VPC configuration, secondary subnet ranges for GKE, Cloud NAT setup, and firewall rules." },
    { id: "gke-cluster", name: "GKE & Workload Identity", weight: 20, layerId: "gcp-architect-3", description: "Private GKE Autopilot provisioning, Workload Identity binding, and secure container access." },
    { id: "data-analytics", name: "BigQuery & Ingestion Pipeline", weight: 20, layerId: "gcp-architect-4", description: "Pub/Sub topic/subscription setup, BigQuery table partitioning/clustering schema, and Dataflow alignment." },
    { id: "iac-terraform", name: "Terraform Structure & Quality", weight: 15, layerId: "gcp-architect-6", description: "Clean module abstraction, remote state backend configuration, input validation, and dynamic blocks." },
    { id: "security-kms", name: "Security & Secret Management", weight: 15, layerId: "gcp-architect-5", description: "Cloud KMS key ring setup, IAM role assignments using least privilege, and Secret Manager usage." },
    { id: "docs-ops", name: "Documentation & CI Pipelines", weight: 10, layerId: "gcp-architect-1", description: "Detailed execution README and automated GitHub Actions Terraform validation pipeline." },
  ],

  twistPool: [
    { id: "cloud-armor-waf", text: "Attach Cloud Armor WAF security policies to the HTTP(S) Load Balancer restricting access based on IP geography and OWASP rules." },
    { id: "vpc-service-controls", text: "Configure VPC Service Controls perimeter enclosing BigQuery and Cloud Storage to prevent data exfiltration." },
    { id: "eventarc-triggers", text: "Wire Cloud Storage file uploads to trigger Cloud Run processing functions automatically via Eventarc." },
    { id: "anthos-policy", text: "Incorporate Policy Controller constraint templates enforcing resource label requirements on GKE namespaces." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Serverless Developer track (serverless-dev), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "serverless-dev",
  categoryId: "cloud",
  slug: "serverless-dev-event-driven-e-commerce",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Event-Driven Serverless E-Commerce Processing Service",
  summary:
    "Build an event-driven order processing system using the AWS Serverless Application Model (SAM). " +
    "You will implement API Gateway HTTP APIs with Cognito auth, DynamoDB single-table design with streams, " +
    "SQS/SNS messaging fan-out, Step Functions saga orchestration, and X-Ray distributed tracing.",
  stack: ["AWS SAM", "AWS Lambda", "Amazon API Gateway", "Amazon DynamoDB", "AWS Step Functions", "GitHub Actions"],

  requirements: [
    { id: "sam-template", text: "Application infrastructure is declared using AWS SAM template format with global configuration defaults and parameters.", check: { type: "file", glob: "{template,sam}.{yml,yaml}" } },
    { id: "api-auth", text: "API Gateway HTTP API exposes endpoints protected by a Cognito User Pool JWT authorizer." },
    { id: "dynamodb-single-table", text: "Order and inventory data are persisted in a single DynamoDB table using Composite Primary Keys (PK/SK) and Secondary Indexes." },
    { id: "step-functions-saga", text: "Order fulfillment uses a Step Functions state machine with Task retry, catch error handling, and compensatory rollback steps." },
    { id: "sqs-sns-fanout", text: "Order status updates trigger DynamoDB Streams to fan out notifications through SNS topics and SQS dead-letter queues." },
    { id: "observability-xray", text: "Lambda functions use structured logging and AWS X-Ray tracing for end-to-end request tracing." },
    { id: "tests", text: "Integration tests invoke SAM functions locally or test handler business logic and DynamoDB interactions.", check: CHECKS.jsTests },
    { id: "readme", text: "README details local invocation using SAM CLI, deployment steps, environment parameters, and API routes.", check: CHECKS.readme },
    { id: "env-example", text: "Includes env.json.example or .env.example for local SAM CLI invocation parameters.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow runs sam validate, linter checks, and unit tests on code commits.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "serverless-architecture", name: "SAM Template & Architecture", weight: 20, layerId: "serverless-dev-4", description: "Correct AWS SAM resource usage, IAM execution role granularity, and local invoke capabilities." },
    { id: "database-design", name: "DynamoDB Single-Table Design", weight: 20, layerId: "serverless-dev-3", description: "Effective access pattern mapping, PK/SK partitioning, GSI usage, and stream event processing." },
    { id: "orchestration", name: "Step Functions & Saga Workflow", weight: 20, layerId: "serverless-dev-6", description: "Robust orchestration state transitions, task error catching, retries, and compensation logic." },
    { id: "event-messaging", name: "Event-Driven Fan-Out & Queues", weight: 15, layerId: "serverless-dev-5", description: "Proper SNS fan-out configuration, SQS event source mapping, and dead-letter queue handling." },
    { id: "observability-security", name: "Security & Observability", weight: 15, layerId: "serverless-dev-9", description: "Cognito JWT authorizer integration, structured correlation IDs, and active X-Ray tracing." },
    { id: "docs-ops", name: "Documentation & CI Pipelines", weight: 10, layerId: "serverless-dev-10", description: "Clear README documentation for local SAM CLI testing and automated CI workflows." },
  ],

  twistPool: [
    { id: "snapstart-optimization", text: "Configure Provisioned Concurrency or SnapStart on performance-critical Lambda handlers to eliminate cold starts." },
    { id: "presigned-urls", text: "Add an invoice generation endpoint returning S3 presigned upload/download URLs using expiring IAM credentials." },
    { id: "eventbridge-pipes", text: "Replace direct DynamoDB stream consumers with AWS EventBridge Pipes filtering events before delivery to SQS." },
    { id: "waf-rate-limit", text: "Attach an AWS WAF WebACL to the API Gateway stage enforcing rate-limiting rules per client IP address." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Cloud Native Engineer track (cloud-native), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "cloud-native",
  categoryId: "cloud",
  slug: "cloud-native-microservices-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "GitOps-Driven Microservices Platform on Kubernetes with Istio",
  summary:
    "Build a production-grade Kubernetes microservices platform using modern cloud-native patterns. " +
    "You will write multi-stage Dockerfiles, package workloads with Helm, deploy via ArgoCD GitOps, " +
    "configure Istio service mesh mTLS and traffic shifting, enforce OPA Gatekeeper security policies, " +
    "and collect metrics with Prometheus/Grafana.",
  stack: ["Kubernetes", "Helm", "ArgoCD", "Istio", "Prometheus", "GitHub Actions"],

  requirements: [
    { id: "multi-stage-docker", text: "Microservices include multi-stage Dockerfiles producing minimal, unprivileged container runtime images.", check: CHECKS.dockerfile },
    { id: "helm-chart", text: "Workloads are packaged into a custom Helm chart with configurable values, subcharts, and release templates.", check: { type: "file", glob: "**/Chart.yaml" } },
    { id: "gitops-argocd", text: "ArgoCD application manifests (or app-of-apps pattern) define automated deployment state synchronization from Git.", check: { type: "file", glob: "**/Application*.{yml,yaml}" } },
    { id: "service-mesh-istio", text: "Istio VirtualService and DestinationRule objects manage traffic shifting, canary rollouts, and strict peer mTLS." },
    { id: "k8s-security-policy", text: "Enforces Pod Security Standards and OPA Gatekeeper constraint templates restricting container root privileges." },
    { id: "prometheus-monitoring", text: "Configures ServiceMonitor resources to scrape custom metrics for visualization in Grafana dashboards." },
    { id: "tests", text: "Tests validate Helm chart template rendering and container endpoint behavior.", check: CHECKS.jsTests },
    { id: "readme", text: "README documents cluster setup, Helm installation parameters, ArgoCD sync commands, and Istio routing validation.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example or values-example.yaml template file specifying configuration variables.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow executes helm lint, kubeconform manifest validation, and container vulnerability scans on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "containerization", name: "Container & Image Optimization", weight: 15, layerId: "cloud-native-1", description: "Multi-stage builds, non-root user execution, image size reduction, and security scanning." },
    { id: "helm-packaging", name: "Kubernetes & Helm Engineering", weight: 20, layerId: "cloud-native-3", description: "Modular Helm chart design, parameter abstractions, dynamic template functions, and hooks." },
    { id: "gitops-delivery", name: "GitOps & Continuous Delivery", weight: 20, layerId: "cloud-native-7", description: "ArgoCD manifest structure, sync policies, automated rollouts, and repository structure." },
    { id: "service-mesh", name: "Service Mesh & Traffic Management", weight: 20, layerId: "cloud-native-6", description: "Istio VirtualService routing, mTLS PeerAuthentication enforcement, and circuit breaking." },
    { id: "security-policy", name: "Policy Enforcement & Security", weight: 15, layerId: "cloud-native-8", description: "OPA Gatekeeper constraint definitions, RBAC role bindings, and Pod Security Standards." },
    { id: "docs-ops", name: "Observability & Documentation", weight: 10, layerId: "cloud-native-9", description: "ServiceMonitor metrics collection, Grafana dashboard definitions, and complete setup guides." },
  ],

  twistPool: [
    { id: "flagger-canary", text: "Automate progressive canary deployments using Flagger integrated with Istio metrics and Prometheus alerts." },
    { id: "falco-runtime-security", text: "Deploy Falco runtime security rules detecting unauthorized shell executions within application pods." },
    { id: "kustomize-overlays", text: "Add Kustomize environment overlays (dev/prod) managing environment-specific resource limits and replicas." },
    { id: "opentelemetry-tracing", text: "Instrument application code with OpenTelemetry SDK sending trace spans to a Tempo or Jaeger collector." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — FinOps Engineer track (finops-engineer), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "finops-engineer",
  categoryId: "cloud",
  slug: "finops-engineer-cost-optimization-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Cloud Cost Allocation and Waste Elimination Platform",
  summary:
    "Build an automated Cloud FinOps engine that ingests cloud billing data, enforces tagging policies, " +
    "allocates Kubernetes pod costs with OpenCost, detects unattached idle resources, and provides " +
    "Pull Request cost estimation using Infracost in CI/CD pipelines.",
  stack: ["Python", "Infracost", "OpenCost / Kubecost", "AWS Cost Explorer API", "Docker", "GitHub Actions"],

  requirements: [
    { id: "billing-ingestion", text: "Ingests cloud billing exports or Cost Explorer reports into normalized FOCUS (FinOps Open Cost and Usage Specification) format." },
    { id: "tag-enforcement", text: "Automates detection of untagged resources and executes compliance checks against team/environment tagging taxonomy." },
    { id: "idle-waste-remediation", text: "Script identifies unattached EBS volumes, unassociated Elastic IPs, and idle EC2/VM instances, emitting remediation actions." },
    { id: "k8s-cost-allocation", text: "Integrates OpenCost or Kubecost metrics to break down Kubernetes cluster expenses by namespace, pod, and service label." },
    { id: "infracost-ci", text: "Integrates Infracost into GitHub Actions pull requests to generate real-time cost impact comments for IaC changes." },
    { id: "unit-metrics-dashboard", text: "Calculates key cloud business unit metrics (e.g. cost per active user, cost per API transaction) exported to JSON/CSV reports." },
    { id: "tests", text: "Pytest suite verifies billing normalization logic, tag parser regex rules, and idle resource calculation algorithms.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details tagging taxonomy rules, Infracost setup in CI/CD, FinOps KPI definitions, and execution commands.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example with API keys, threshold configurations, and mock billing dataset paths.", check: CHECKS.envExample },
    { id: "docker", text: "Dockerfile packages the FinOps analysis engine and reporting utilities for container execution.", check: CHECKS.dockerfile },
    { id: "ci", text: "A GitHub Actions workflow runs code linting, unit tests, and Infracost cost estimation checks.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "billing-normalization", name: "Billing Data & FOCUS Standards", weight: 20, layerId: "finops-engineer-7", description: "Accurate ingestion of billing data, schema mapping to FOCUS standards, and unit metric calculation." },
    { id: "tagging-governance", name: "Tagging Policy Enforcement", weight: 20, layerId: "finops-engineer-3", description: "Comprehensive taxonomy validation, automated compliance checks, and resource ownership attribution." },
    { id: "waste-elimination", name: "Idle Resource & Waste Remediation", weight: 20, layerId: "finops-engineer-5", description: "Accurate detection of unattached disks, unused IPs, and over-provisioned instances with automated recommendations." },
    { id: "k8s-costing", name: "Container & Kubernetes Costing", weight: 15, layerId: "finops-engineer-8", description: "Effective OpenCost integration, namespace allocation breakdown, and bin-packing efficiency metrics." },
    { id: "infracost-automation", name: "Infracost & IaC Integration", weight: 15, layerId: "finops-engineer-9", description: "Seamless CI/CD Pull Request integration commenting on estimated monthly cost delta." },
    { id: "docs-ops", name: "Documentation & Executive Reporting", weight: 10, layerId: "finops-engineer-10", description: "Clear README setup instructions, FinOps maturity matrix commentary, and executive dashboard exports." },
  ],

  twistPool: [
    { id: "auto-scheduler-lambda", text: "Implement a Lambda routine that automatically stops non-production development instances during off-peak weekend hours." },
    { id: "commitment-recommendation", text: "Build a recommendation algorithm analyzing usage logs to propose optimal AWS Savings Plans or Reserved Instance purchases." },
    { id: "anomaly-slack-alerts", text: "Add spending anomaly detection that sends immediate Webhook alerts to Slack when daily service costs spike over 25%." },
    { id: "multi-cloud-billing", text: "Extend billing normalization logic to process both AWS Cost and Usage Reports (CUR) and Azure Cost Management exports simultaneously." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — Multi-Cloud Architect track (multi-cloud-architect), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

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
  stack: ["Terraform", "AWS EKS", "Azure AKS", "ArgoCD", "OpenTelemetry", "GitHub Actions"],

  requirements: [
    { id: "terraform-multi-provider", text: "Infrastructure code uses Terraform multi-provider configurations (AWS and Azure providers) with provider aliases and remote state locking.", check: { type: "file", glob: "**/*.tf" } },
    { id: "cross-cloud-vpn", text: "Establishes secure IPSec VPN connectivity between AWS VPC and Azure VNet with BGP dynamic routing configuration." },
    { id: "eks-aks-clusters", text: "Provisions equivalent EKS and AKS Kubernetes clusters with matching network CNI subnets and OIDC provider integration." },
    { id: "argocd-applicationsets", text: "Deploys ArgoCD ApplicationSets targeting both AWS and Azure Kubernetes clusters for consistent multi-cluster application delivery.", check: { type: "file", glob: "**/ApplicationSet*.{yml,yaml}" } },
    { id: "opentelemetry-collector", text: "Configures OpenTelemetry Collector daemonsets exporting unified trace spans and metrics to a vendor-neutral backend." },
    { id: "cross-cloud-dr", text: "Configures Velero backup locations using object storage replication between S3 and Azure Blob for cross-cloud cluster state recovery." },
    { id: "tests", text: "Automated test scripts or tflint / terraform validate checks verify Terraform module syntax and multi-provider parameters.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" } },
    { id: "readme", text: "README documents multi-cloud architecture topology, provider authentication setup, GitOps synchronization, and failover steps.", check: CHECKS.readme },
    { id: "env-example", text: "Includes terraform.tfvars.example or .env.example with placeholders for AWS and Azure credentials.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow runs terraform fmt, terraform validate, and tflint on every pull request.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "multi-cloud-iac", name: "Multi-Cloud IaC Engineering", weight: 20, layerId: "multi-cloud-architect-2", description: "Modular Terraform design using provider aliases, clean workspace separation, and cross-cloud dependency wiring." },
    { id: "cross-cloud-networking", name: "Cross-Cloud Network Connectivity", weight: 20, layerId: "multi-cloud-architect-3", description: "Secure IPSec VPN tunnel configuration, BGP routing, CIDR planning without overlapping ranges, and security policies." },
    { id: "k8s-gitops", name: "Multi-Cloud Kubernetes & GitOps", weight: 20, layerId: "multi-cloud-architect-5", description: "Symmetrical cluster provisioning across EKS and AKS, OIDC configuration, and ArgoCD ApplicationSet deployment." },
    { id: "observability", name: "Unified Observability Strategy", weight: 15, layerId: "multi-cloud-architect-7", description: "OpenTelemetry Collector pipeline design, vendor-neutral metric collection, and multi-cloud dashboards." },
    { id: "disaster-recovery", name: "Disaster Recovery & Backup", weight: 15, layerId: "multi-cloud-architect-9", description: "Velero cross-cloud backup configuration, data replication, and clear failover verification procedures." },
    { id: "docs-ops", name: "Documentation & CI Automation", weight: 10, layerId: "multi-cloud-architect-10", description: "Comprehensive architectural documentation, cloud credentials setup guide, and automated CI pipelines." },
  ],

  twistPool: [
    { id: "opa-policy-code", text: "Implement OPA/Rego policies enforcing consistent resource naming conventions and mandatory tags across both AWS and Azure resources." },
    { id: "dns-traffic-failover", text: "Configure Route 53 or Cloudflare Health Checks to perform automatic global DNS failover between EKS and AKS ingress endpoints." },
    { id: "focus-cost-normalization", text: "Incorporate a script normalizing cost report exports from both AWS CUR and Azure Cost Management into FOCUS schema." },
    { id: "gcp-third-cloud", text: "Extend the Terraform code to provision a third standby GKE cluster in GCP connected to the existing cross-cloud mesh." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Cloud Migration Specialist track (cloud-migration), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "cloud-migration",
  categoryId: "cloud",
  slug: "cloud-migration-monolith-modernization",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "On-Premises Monolith Migration and Strangler Fig Modernization",
  summary:
    "Plan and execute an end-to-end cloud migration of a legacy on-premises web application and database. " +
    "You will write automation scripts to assess legacy dependencies, set up a secure hub-and-spoke landing zone, " +
    "migrate relational databases to AWS Aurora PostgreSQL using DMS with Change Data Capture (CDC), and implement " +
    "the Strangler Fig pattern using API Gateway routing.",
  stack: ["Python", "AWS DMS", "AWS CloudFormation or Terraform", "Docker", "AWS API Gateway", "GitHub Actions"],

  requirements: [
    { id: "assessment-script", text: "Script performs automated discovery on simulated on-premises configurations, generating dependency maps and TCO analysis." },
    { id: "landing-zone-setup", text: "Provisions a target AWS hub-and-spoke landing zone with transit gateway routing, private endpoints, and AD Connector integration." },
    { id: "dms-replication", text: "Configures AWS Database Migration Service (DMS) tasks with Schema Conversion Tool rules and continuous Change Data Capture (CDC)." },
    { id: "strangler-fig-routing", text: "Configures API Gateway / ALB reverse proxy routing applying the Strangler Fig pattern to incrementally redirect endpoints from legacy to microservices." },
    { id: "containerized-replatform", text: "Replatforms legacy application components into Docker containers running on Amazon ECS or AWS App Runner." },
    { id: "cutover-playbook", text: "Automation scripts execute database validation checks and DNS cutover verification during final migration window." },
    { id: "tests", text: "Pytest suite verifies database migration schema fidelity, CDC sequence validation, and API proxy routing rules.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README presents 7Rs decision rationale, migration wave plan, TCO comparison tables, and cutover execution playbook.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example with source/target database connection strings and migration parameter settings.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow executes automated code linting, unit tests, and migration script syntax checks.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "migration-strategy", name: "Assessment & Strategy (7Rs)", weight: 15, layerId: "cloud-migration-1", description: "Thorough discovery dependency mapping, sound 7Rs migration strategy choice, and realistic TCO calculation." },
    { id: "landing-zone", name: "Landing Zone Architecture", weight: 20, layerId: "cloud-migration-3", description: "Hub-and-spoke network design, transit gateway peering, AD integration, and secure hybrid access." },
    { id: "database-migration", name: "Database Migration & CDC", weight: 25, layerId: "cloud-migration-5", description: "Effective DMS replication task setup, schema transformation rules, and zero-downtime CDC synchronization." },
    { id: "modernization", name: "Application Modernization & Strangler Fig", weight: 15, layerId: "cloud-migration-7", description: "Incremental traffic routing via API Gateway/ALB, containerization of legacy assets, and microservice decoupling." },
    { id: "tests", name: "Validation & Testing", weight: 15, layerId: "cloud-migration-9", description: "Data integrity verification, cutover validation testing, and automated migration scripts." },
    { id: "docs-ops", name: "Playbook & Program Governance", weight: 10, layerId: "cloud-migration-10", description: "Detailed cutover playbook, rollback steps, wave planning documentation, and CI workflows." },
  ],

  twistPool: [
    { id: "mgn-block-replication", text: "Incorporate AWS Application Migration Service (MGN) agent scripts for continuous block-level server rehosting." },
    { id: "zero-downtime-dns", text: "Implement Route 53 weighted routing policy automation for progressive percentage-based cutover." },
    { id: "rollback-automation", text: "Add an automated rollback script triggered by post-cutover error threshold spikes in CloudWatch." },
    { id: "heterogeneous-schema", text: "Configure Schema Conversion Tool (SCT) rule actions translating legacy Oracle/SQL Server stored procedures to PostgreSQL PL/pgSQL." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Edge Computing Engineer track (edge-engineer), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "edge-engineer",
  categoryId: "cloud",
  slug: "edge-engineer-global-routing-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Edge-Native API Gateway & State Management Platform",
  summary:
    "Build a distributed, low-latency edge computing application deployed on Cloudflare Workers. " +
    "You will write worker handlers using Wrangler CLI, manage state with Workers KV and Durable Objects, " +
    "compile Rust/WASM modules for edge computation, configure edge WAF rate-limiting rules, " +
    "and perform AI inference at the edge using Workers AI.",
  stack: ["TypeScript", "Cloudflare Workers", "Wrangler CLI", "WebAssembly / Rust", "Workers KV", "GitHub Actions"],

  requirements: [
    { id: "worker-runtime", text: "Edge worker is implemented in TypeScript using Cloudflare Workers runtime API with Wrangler configuration files.", check: { type: "file", glob: "wrangler.{toml,json}" } },
    { id: "kv-storage", text: "Utilizes Cloudflare Workers KV namespaces for fast key-value lookup and caching with eventual consistency rules." },
    { id: "durable-objects", text: "Implements a Durable Object class for stateful coordination, real-time rate limiting, or WebSocket hibernation." },
    { id: "wasm-module", text: "Compiles a Rust or AssemblyScript module into WebAssembly (WASM) and integrates WASM bindings inside the edge worker." },
    { id: "edge-security", text: "Configures Cloudflare WAF custom rules, geolocation headers verification, and bot detection checks at the edge." },
    { id: "workers-ai", text: "Invokes Cloudflare Workers AI model catalog endpoints for low-latency text classification or embeddings at the edge." },
    { id: "tests", text: "Unit and integration tests run against Miniflare or Vitest worker test harness to verify edge endpoint handling.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains Wrangler CLI commands, KV bindings setup, WASM compilation steps, and edge deployment procedures.", check: CHECKS.readme },
    { id: "env-example", text: "Includes wrangler.example.toml or .env.example with binding configurations and account ID placeholders.", check: CHECKS.envExample },
    { id: "ci", text: "A GitHub Actions workflow builds WASM modules, runs Wrangler dry-run deployment validations, and executes tests on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "edge-runtime", name: "Cloudflare Workers & Architecture", weight: 20, layerId: "edge-engineer-2", description: "Proper usage of Workers fetch handlers, response streaming, Wrangler configuration, and environment bindings." },
    { id: "state-management", name: "KV & Durable Objects State", weight: 20, layerId: "edge-engineer-3", description: "Effective KV key design, caching policies, and Durable Object state persistence or WebSocket handling." },
    { id: "wasm-integration", name: "WebAssembly at the Edge", weight: 15, layerId: "edge-engineer-4", description: "Correct WASM module compilation, memory passing interface, and performance enhancement at the edge." },
    { id: "edge-security-ai", name: "Edge Security & Workers AI", weight: 20, layerId: "edge-engineer-6", description: "Custom WAF rule logic, rate-limiting algorithms, and integration of Workers AI models for edge inference." },
    { id: "tests", name: "Testing", weight: 15, layerId: "edge-engineer-2", description: "Thorough test coverage using Vitest/Miniflare for edge request routing, KV mocks, and WASM function execution." },
    { id: "docs-ops", name: "Documentation & CI Pipelines", weight: 10, layerId: "edge-engineer-10", description: "Clear setup guide for Wrangler development, WASM build commands, and automated CI workflows." },
  ],

  twistPool: [
    { id: "nextjs-middleware", text: "Integrate Vercel Edge Functions or Next.js middleware for dynamic geolocation-based content personalization." },
    { id: "cache-stampede-prevention", text: "Implement request coalescing (single-flight pattern) in Workers KV to prevent cache stampedes on hot cache keys." },
    { id: "image-transformation", text: "Incorporate edge-side dynamic image resizing and WebP/AVIF format conversion using Cloudflare Images or Workers." },
    { id: "mqtt-iot-broker", text: "Extend Durable Objects to act as a lightweight MQTT Pub/Sub broker handling persistent edge IoT client connections." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Observability Engineer track (observability-engineer), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "observability-engineer",
  categoryId: "cloud",
  slug: "observability-engineer-telemetry-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Full-Stack Observability Platform with OpenTelemetry, Prometheus, and Grafana",
  summary:
    "Design and deploy an end-to-end cloud-native observability platform. You will instrument microservices " +
    "using the OpenTelemetry SDK, route telemetry through an OpenTelemetry Collector pipeline, scrape metrics with " +
    "Prometheus, aggregate logs with Loki, correlate distributed traces with Jaeger/Tempo, build Grafana dashboards, " +
    "and configure multi-window burn rate alerts based on Service Level Objectives (SLOs).",
  stack: ["OpenTelemetry", "Prometheus", "Grafana", "Loki", "Docker", "GitHub Actions"],

  requirements: [
    { id: "otel-collector-pipeline", text: "Configures an OpenTelemetry Collector pipeline with receivers (OTLP), processors (batch, memory_limiter, attributes), and exporters." },
    { id: "app-instrumentation", text: "Microservices are instrumented with OpenTelemetry SDK sending trace context (W3C Trace Context) and custom RED metrics." },
    { id: "prometheus-metrics", text: "Prometheus scrapes collector metrics, defines PromQL recording rules, and establishes multi-window burn rate alerting rules." },
    { id: "loki-log-aggregation", text: "Configures Loki log ingestion with Promtail/OTel pipeline stages, regex/JSON parsing, and trace-to-log correlation IDs." },
    { id: "grafana-dashboards", text: "Declarative Grafana dashboards as code visualize RED/USE metrics, distributed trace timelines, and Loki logs." },
    { id: "slo-error-budgets", text: "Calculates Service Level Indicators (SLIs) and tracks Error Budgets with automated alert notifications on budget exhaustion." },
    { id: "tests", text: "Pytest or Node test suite verifies OpenTelemetry trace context propagation, LogQL/PromQL rule syntax, and collector pipeline configuration.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py}" } },
    { id: "readme", text: "README documents telemetry architecture, OTel collector pipeline topology, SLO target definitions, and Grafana dashboard execution.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example with configuration placeholders for telemetry endpoints, retention windows, and alert webhooks.", check: CHECKS.envExample },
    { id: "docker", text: "Docker Compose environment starts the microservices, OTel Collector, Prometheus, Loki, Jaeger/Tempo, and Grafana.", check: CHECKS.compose },
    { id: "ci", text: "A GitHub Actions workflow executes linting checks, PromQL rule validations, and automated unit tests on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "otel-pipeline", name: "OpenTelemetry & Collector Pipeline", weight: 20, layerId: "observability-engineer-6", description: "Correct OTel Collector receiver/processor/exporter configuration, OTLP protocol routing, and metadata enrichment." },
    { id: "metrics-promql", name: "Prometheus Metrics & PromQL", weight: 20, layerId: "observability-engineer-2", description: "Effective RED/USE metric instrumentation, recording rules, scrape configs, and accurate PromQL aggregations." },
    { id: "tracing-logging", name: "Distributed Tracing & Loki Logging", weight: 20, layerId: "observability-engineer-4", description: "W3C trace context propagation across microservices, span attributes, and Loki trace ID correlation." },
    { id: "slos-alerting", name: "SLOs, Error Budgets & Alerting", weight: 15, layerId: "observability-engineer-7", description: "Precise SLI/SLO mathematical formulations, error budget tracking, and multi-burn-rate alerting rules." },
    { id: "tests", name: "Testing & Validation", weight: 15, layerId: "observability-engineer-1", description: "Automated unit tests verifying trace header propagation, log parsing pipelines, and metric scrape assertions." },
    { id: "docs-ops", name: "Dashboarding & Infrastructure", weight: 10, layerId: "observability-engineer-3", description: "Clean Docker Compose deployment, declarative Grafana dashboards as code, and complete README documentation." },
  ],

  twistPool: [
    { id: "thanos-long-term", text: "Integrate Thanos sidecar and store components for long-term Prometheus metrics archiving in S3/Object storage." },
    { id: "ebpf-auto-instrumentation", text: "Incorporate eBPF-based auto-instrumentation (e.g. Beyla or Pixie) for transparent network-level telemetry collection." },
    { id: "mimir-multi-tenancy", text: "Configure Grafana Mimir for scalable, multi-tenant metric isolation across separate team namespaces." },
    { id: "datadog-agent-fallback", text: "Add a dual-export pipeline in OTel Collector forwarding a secondary copy of metrics and traces to Datadog endpoints." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};