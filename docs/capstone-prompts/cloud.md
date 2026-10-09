You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/cloud/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "cloud" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "cloud". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### aws-architect — AWS Solutions Architect
  - aws-architect-1 | Cloud and AWS Fundamentals | topics: Cloud computing models IaaS PaaS SaaS; AWS global infrastructure; IAM users groups roles policies; EC2 instance types and pricing
  - aws-architect-2 | Networking in AWS | topics: VPC design and CIDR blocks; Public and private subnets; Internet gateways and NAT gateways; Route tables and routing rules
  - aws-architect-3 | Compute and Auto Scaling | topics: EC2 launch templates and AMIs; Auto Scaling groups and policies; Application Load Balancer vs Network Load Balancer; Target groups and health checks
  - aws-architect-4 | Storage and Database Services | topics: RDS multi-AZ and read replicas; Aurora serverless and global databases; DynamoDB tables keys and indexes; EBS volume types and snapshots
  - aws-architect-5 | Security and Identity | topics: IAM policies and permission boundaries; KMS key management and rotation; Secrets Manager and Parameter Store; AWS Organizations and SCPs
  - aws-architect-6 | Infrastructure as Code with CloudFormation | topics: CloudFormation template anatomy; Parameters mappings outputs; Nested stacks and stack sets; Change sets and rollback triggers
  - aws-architect-7 | Serverless and Managed Services | topics: Lambda functions triggers and layers; API Gateway REST and HTTP APIs; SQS standard and FIFO queues; SNS topics and subscriptions
  - aws-architect-8 | High Availability and Disaster Recovery | topics: Route 53 routing policies and health checks; CloudFront distributions and origins; Multi-region active-active vs active-passive; AWS Backup policies and vaults
  - aws-architect-9 | Cost Optimization and Performance | topics: AWS Cost Explorer and budgets; Reserved instances vs savings plans; Spot instance strategies and interruption handling; Compute Optimizer recommendations
  - aws-architect-10 | Advanced Architecture and AWS Professional | topics: AWS Landing Zone and Control Tower; Service Control Policies and guardrails; AWS Service Catalog products and portfolios; Well-Architected reviews and remediation

### azure-architect — Azure Architect
  - azure-architect-1 | Azure Fundamentals | topics: Azure regions and availability zones; Resource groups and subscriptions; Azure Resource Manager model; Azure CLI and PowerShell basics
  - azure-architect-2 | Azure Networking | topics: Virtual networks and subnets; Network security groups and application security groups; Azure Load Balancer and Application Gateway; VPN Gateway site-to-site and point-to-site
  - azure-architect-3 | Identity and Access with Entra ID | topics: Entra ID tenants users and groups; Role-based access control and custom roles; Conditional access policies and MFA; Privileged Identity Management just-in-time
  - azure-architect-4 | Compute and Containers | topics: VM scale sets and autoscaling; Azure App Service tiers and deployment slots; Azure Container Instances for batch; AKS cluster creation and node pools
  - azure-architect-5 | Storage and Databases | topics: Azure Blob, File, Queue, and Table storage; Storage tiers and lifecycle management; Azure SQL Database elastic pools; Cosmos DB APIs and consistency levels
  - azure-architect-6 | Infrastructure as Code with Bicep | topics: Bicep syntax resources modules and outputs; Bicep vs ARM templates comparison; Parameter files and environment configs; Deployment scopes subscription and tenant
  - azure-architect-7 | Monitoring and Security | topics: Log Analytics workspaces and KQL; Azure Monitor metrics and alerts; Application Insights for APM; Defender for Cloud secure score
  - azure-architect-8 | High Availability and Business Continuity | topics: Availability sets vs availability zones; Azure Traffic Manager routing methods; Azure Front Door for global HTTP traffic; Azure Site Recovery replication and failover
  - azure-architect-9 | Azure Kubernetes Service Advanced | topics: AKS Azure CNI and Cilium networking; Workload identity and pod-level permissions; KEDA event-driven autoscaling; AKS node pool upgrades and maintenance windows
  - azure-architect-10 | Enterprise Architecture and Azure Landing Zones | topics: Cloud Adoption Framework phases; Enterprise-scale landing zone design; Management group hierarchy and policies; Azure Lighthouse for multi-tenant management

### gcp-architect — GCP Architect
  - gcp-architect-1 | GCP Fundamentals | topics: GCP resource hierarchy projects folders org; IAM roles members and policies; Compute Engine VM instances and machine types; Cloud Storage buckets and object lifecycle
  - gcp-architect-2 | GCP Networking | topics: GCP VPC and subnets auto vs custom mode; Shared VPC and VPC Network Peering; Cloud Load Balancing types and use cases; Cloud Armor WAF and DDoS protection
  - gcp-architect-3 | Google Kubernetes Engine | topics: GKE cluster modes Standard vs Autopilot; Node pools and node auto-provisioning; Workload Identity Federation for pods; GKE Config Connector for GCP resources
  - gcp-architect-4 | Data and Analytics with BigQuery | topics: BigQuery datasets tables and schemas; BigQuery partitioning clustering and cost; Pub/Sub topics and subscriptions; Dataflow streaming and batch pipelines
  - gcp-architect-5 | Security and Compliance | topics: Cloud KMS key rings and keys; Secret Manager versions and rotation; VPC Service Controls access policies; Organization Policy constraints
  - gcp-architect-6 | Infrastructure as Code with Terraform on GCP | topics: Terraform Google provider resources; GCP service account for Terraform; Remote state in Cloud Storage; Terraform modules for GCP patterns
  - gcp-architect-7 | Serverless and App Modernization | topics: Cloud Run containers and scaling to zero; Cloud Functions gen1 vs gen2; Eventarc triggers and event routing; Cloud Tasks and Cloud Scheduler
  - gcp-architect-8 | Reliability and Observability | topics: Cloud Monitoring metrics and dashboards; Alerting policies and notification channels; Cloud Logging log sinks and exclusions; Cloud Trace and distributed tracing
  - gcp-architect-9 | Cost Optimization and Resource Management | topics: Billing export to BigQuery; Cost breakdown by project service label; Committed use discounts for compute; Sustained use discounts mechanics
  - gcp-architect-10 | Professional Cloud Architect and Enterprise Patterns | topics: GCP landing zone with Cloud Foundation Toolkit; Anthos Config Management and Policy Controller; Anthos Service Mesh for multi-cluster traffic; Google Cloud Architecture Framework pillars

### serverless-dev — Serverless Developer
  - serverless-dev-1 | Serverless Fundamentals | topics: Serverless model benefits and trade-offs; Lambda function anatomy handler runtime; IAM execution roles and least privilege; Lambda triggers and event sources
  - serverless-dev-2 | API Gateway and HTTP APIs | topics: REST vs HTTP API in API Gateway; Lambda proxy integration; CORS configuration; API keys and usage plans
  - serverless-dev-3 | Data Storage for Serverless | topics: DynamoDB single-table design; DynamoDB Streams for change data capture; S3 event notifications and presigned URLs; Connection reuse in Lambda for external services
  - serverless-dev-4 | AWS SAM and Local Development | topics: SAM template resources and globals; sam build sam local invoke and start-api; Environment variables and configuration; SAM policy templates
  - serverless-dev-5 | Event-Driven Patterns with SQS and SNS | topics: SQS standard vs FIFO queues; Lambda event source mapping for SQS; Dead-letter queues and redrive policies; SNS fan-out to multiple SQS queues
  - serverless-dev-6 | Orchestration with Step Functions | topics: Step Functions Standard vs Express workflows; Task catch retry and error handling; Parallel and map states; Wait for callback pattern
  - serverless-dev-7 | Performance and Cold Starts | topics: Lambda cold start causes and measurement; Provisioned concurrency configuration; Lambda SnapStart for Java runtimes; Lambda Layers for shared dependencies
  - serverless-dev-8 | Security for Serverless Applications | topics: Least privilege Lambda execution roles; Cognito user pools and identity pools; JWT validation in Lambda authorizers; WAF rules and managed rule groups on API Gateway
  - serverless-dev-9 | Observability and Debugging | topics: AWS X-Ray tracing and service maps; Lambda Insights for enhanced metrics; AWS Lambda Powertools for Python and TypeScript; Structured logging with correlation IDs
  - serverless-dev-10 | Production Serverless Architecture | topics: AWS Serverless Application Lens review; Multi-stage SAM and CDK deployments; Lambda traffic shifting with aliases; EventBridge Pipes for integration

### cloud-native — Cloud Native Engineer
  - cloud-native-1 | Containers and Docker Fundamentals | topics: Container vs VM architecture; Dockerfile instructions and best practices; Multi-stage builds for smaller images; Docker volumes and bind mounts
  - cloud-native-2 | Kubernetes Fundamentals | topics: Kubernetes architecture control plane and nodes; Pods ReplicaSets and Deployments; Services ClusterIP NodePort LoadBalancer; ConfigMaps and Secrets
  - cloud-native-3 | Helm and Package Management | topics: Helm chart structure templates and values; Helm templating with Go templates; Chart dependencies and subcharts; Helm lifecycle hooks pre-install post-upgrade
  - cloud-native-4 | Kubernetes Networking and Ingress | topics: Ingress controllers nginx and Traefik; Ingress rules TLS and path routing; NetworkPolicy for pod-to-pod isolation; CNI plugins Calico Cilium Flannel
  - cloud-native-5 | Kubernetes Storage and Stateful Workloads | topics: PersistentVolumes and PersistentVolumeClaims; Storage classes and dynamic provisioning; StatefulSets stable network identities; CSI drivers for cloud storage
  - cloud-native-6 | Service Mesh with Istio | topics: Istio architecture control plane and data plane; VirtualService and DestinationRule; Mutual TLS with PeerAuthentication; Traffic shifting and canary releases
  - cloud-native-7 | GitOps and Continuous Delivery | topics: GitOps principles and benefits; ArgoCD applications and app-of-apps pattern; Flux Kustomization and HelmRelease; Kustomize bases and overlays
  - cloud-native-8 | Security and Policy Enforcement | topics: Kubernetes RBAC roles and role bindings; Pod Security Standards baseline restricted; OPA Gatekeeper constraints and templates; Falco rules and alert channels
  - cloud-native-9 | Observability for Kubernetes | topics: Prometheus scraping and relabeling; ServiceMonitor and PodMonitor with Prometheus Operator; Grafana dashboards and alerting rules; OpenTelemetry SDK instrumentation
  - cloud-native-10 | Production Cloud Native Platform Engineering | topics: Platform engineering concepts and IDP; Backstage developer portal setup; Golden path templates and scaffolding; CNCF landscape project selection

### finops-engineer — FinOps Engineer
  - finops-engineer-1 | FinOps Fundamentals | topics: FinOps framework phases and personas; Cloud billing models on-demand reserved spot; Variable cost model vs fixed cost; Unit economics and cost per transaction
  - finops-engineer-2 | Cloud Billing and Cost Visibility | topics: AWS Cost Explorer filters and grouping; Azure Cost Management and budgets; GCP billing export to BigQuery; Cost allocation tags and labels
  - finops-engineer-3 | Tagging and Cost Allocation | topics: Tagging taxonomy design team env cost-center; AWS Tag Policies and enforcement; Azure Policy for required tags; GCP label requirements via Organization Policy
  - finops-engineer-4 | Commitments and Rate Optimization | topics: AWS savings plans compute vs instance; AWS reserved instances types and terms; Azure reserved VM instances and AHB; GCP committed use discounts 1 and 3 year
  - finops-engineer-5 | Right-Sizing and Waste Elimination | topics: EC2 right-sizing with Compute Optimizer; Azure Advisor cost recommendations; GCP Recommender API; Identifying idle and unattached resources
  - finops-engineer-6 | Budget Management and Governance | topics: AWS Budgets actions and notifications; Azure budget alerts and action groups; GCP budget alerts and programmatic response; Cost anomaly detection and thresholds
  - finops-engineer-7 | Unit Economics and Metrics | topics: Defining meaningful unit cost metrics; FOCUS FinOps Open Cost and Usage Specification; Connecting cost data to business metrics; Cost per environment and per feature
  - finops-engineer-8 | Kubernetes and Container Cost Allocation | topics: Kubernetes cost allocation challenges; OpenCost and Kubecost setup; Namespace and label-based cost reports; Node efficiency and bin packing
  - finops-engineer-9 | FinOps Tooling and Automation | topics: Infracost in CI/CD pull request comments; Cloud management platforms overview; Automated right-sizing with Lambda; Cost estimation in Terraform plans
  - finops-engineer-10 | FinOps at Scale and Organizational Maturity | topics: FinOps run phase capabilities and KPIs; Executive cloud cost reporting frameworks; Cloud economics and total cost of ownership; Establishing a cloud center of excellence

### multi-cloud-architect — Multi-Cloud Architect
  - multi-cloud-architect-1 | Multi-Cloud Strategy Fundamentals | topics: Multi-cloud vs poly-cloud vs hybrid cloud; Vendor lock-in risks and mitigation; Cloud provider service comparison matrix; Networking topology across clouds
  - multi-cloud-architect-2 | Terraform for Multi-Cloud IaC | topics: Terraform multi-provider configuration; Provider aliases for multiple accounts; Module design for cloud-agnostic patterns; Terraform workspaces for environment isolation
  - multi-cloud-architect-3 | Multi-Cloud Networking | topics: VPN between AWS and Azure and GCP; Private connectivity with dedicated interconnects; Multi-cloud DNS resolution; Network security policy consistency
  - multi-cloud-architect-4 | Multi-Cloud Identity and Security | topics: Identity federation with SAML and OIDC; Okta or Entra ID as central IdP; AWS IAM Identity Center SSO; Cross-cloud RBAC mapping
  - multi-cloud-architect-5 | Multi-Cloud Kubernetes | topics: EKS vs AKS vs GKE feature comparison; Cluster API provider for each cloud; Unified kubectl context management; Consistent GitOps with ArgoCD ApplicationSets
  - multi-cloud-architect-6 | Multi-Cloud Data and Storage Patterns | topics: Object storage comparison S3 Blob GCS; Cross-cloud data replication patterns; Open table formats Delta Lake Iceberg; Multi-cloud data lakehouse architecture
  - multi-cloud-architect-7 | Multi-Cloud Observability | topics: OpenTelemetry collector for multi-cloud; Vendor-neutral instrumentation strategy; Centralized Prometheus with Thanos or Cortex; Grafana unified dashboards for all clouds
  - multi-cloud-architect-8 | Multi-Cloud Cost Management | topics: FOCUS specification for normalized billing data; Multi-cloud cost management platforms; Unified tagging taxonomy across providers; Cross-cloud chargeback and showback
  - multi-cloud-architect-9 | Disaster Recovery and Business Continuity | topics: Multi-cloud DR patterns active-active vs active-passive; Velero for cross-cloud Kubernetes backup; DNS-based traffic failover across clouds; Data synchronization and RPO targets
  - multi-cloud-architect-10 | Enterprise Multi-Cloud Governance | topics: Policy as code with OPA across clouds; Cloud Custodian for multi-cloud automation; CSPM tools for unified security posture; Terraform Enterprise or Spacelift for governance

### cloud-migration — Cloud Migration Specialist
  - cloud-migration-1 | Migration Fundamentals and Strategy | topics: 7Rs migration strategies rehost replatform refactor; Migration business case and ROI; Total cost of ownership comparison; Migration risk assessment matrix
  - cloud-migration-2 | Discovery and Portfolio Assessment | topics: AWS Application Discovery Service agent vs agentless; Azure Migrate discovery and assessment; Dependency mapping and visualization; Performance baseline collection
  - cloud-migration-3 | Landing Zone and Foundation Setup | topics: Landing zone design principles; Hub-and-spoke network topology for migration; Directory service integration AD Connector; Centralized logging and audit trails
  - cloud-migration-4 | Lift and Shift Migration | topics: AWS Application Migration Service MGN setup; Continuous block-level replication; Test migrations and cutover planning; Azure Migrate VM assessment and migration
  - cloud-migration-5 | Database Migration | topics: AWS Database Migration Service architecture; Schema Conversion Tool for heterogeneous migrations; Continuous data replication with CDC; Azure Database Migration Service
  - cloud-migration-6 | Replatforming and Modernization | topics: Replatforming patterns and decision criteria; Migrating to managed databases RDS Aurora; Containerizing existing apps for ECS; App Service migration for .NET apps
  - cloud-migration-7 | Refactoring and Application Modernization | topics: Strangler fig pattern for monolith decomposition; Domain-driven design for microservice boundaries; Event sourcing and CQRS patterns; Database per service pattern
  - cloud-migration-8 | Data Center Exit and Decommissioning | topics: Data center exit planning and timeline; Asset tracking and decommission checklist; Workload stability validation criteria; License reclamation and software inventory
  - cloud-migration-9 | Post-Migration Optimization | topics: Post-migration performance benchmarking; Right-sizing based on cloudwatch metrics; Reserved instance and savings plan purchases; Well-Architected review post-migration
  - cloud-migration-10 | Migration Program Management at Scale | topics: Migration program governance framework; Wave planning and dependency management; Cloud center of excellence structure; Migration velocity tracking and KPIs

### edge-engineer — Edge Computing Engineer
  - edge-engineer-1 | Edge Computing Fundamentals | topics: Edge computing vs cloud computing; CDN points of presence and caching; DNS resolution and anycast routing; HTTP caching headers and Cache-Control
  - edge-engineer-2 | Cloudflare Workers Basics | topics: Cloudflare Workers runtime model; Fetch event handler and request response; Wrangler CLI for local dev and deployment; Environment variables and secrets
  - edge-engineer-3 | Edge Storage and State | topics: Cloudflare KV eventual consistency model; KV namespaces and key-value patterns; Durable Objects for stateful coordination; Durable Objects WebSocket hibernation
  - edge-engineer-4 | WebAssembly at the Edge | topics: WebAssembly concepts and binary format; Compiling Rust to WASM with wasm-pack; AssemblyScript for TypeScript developers; WASM in Cloudflare Workers and Workers WASM bindings
  - edge-engineer-5 | Edge Functions on Vercel and Netlify | topics: Vercel Edge Functions vs serverless functions; Next.js middleware for edge routing; Netlify Edge Functions with Deno runtime; Geolocation and personalization at edge
  - edge-engineer-6 | Edge Security and WAF | topics: WAF rule sets and custom rules; DDoS protection layers 3 4 and 7; Bot score and bot fight mode; Rate limiting at the edge
  - edge-engineer-7 | CDN Performance Optimization | topics: Cache key design and variation rules; Edge-side image transformation and WebP conversion; HTTP/3 and QUIC protocol benefits; Resource hints prefetch preconnect
  - edge-engineer-8 | Edge AI and Inference | topics: Edge AI inference trade-offs vs cloud; Cloudflare Workers AI model catalog; ONNX model format and runtime; Text classification and embedding at edge
  - edge-engineer-9 | IoT and Edge Protocols | topics: MQTT protocol pub/sub and QoS levels; AWS Greengrass local compute and ML; Azure IoT Edge modules and routes; WebSocket connections through Durable Objects
  - edge-engineer-10 | Production Edge Architecture | topics: Multi-CDN strategy and DNS-based failover; Edge observability with Workers Analytics Engine; Request coalescing and cache stampede prevention; Cloudflare Pages and Workers combined deployments

### observability-engineer — Observability Engineer
  - observability-engineer-1 | Observability Fundamentals | topics: Three pillars metrics logs traces; Observability vs monitoring distinction; Black-box vs white-box monitoring; RED method rate errors duration
  - observability-engineer-2 | Prometheus Metrics | topics: Prometheus architecture and data model; Four metric types counter gauge histogram summary; Scrape configs and service discovery; PromQL operators functions and aggregations
  - observability-engineer-3 | Grafana Dashboards and Alerting | topics: Grafana panel types and when to use each; Dashboard variables and template queries; Dashboard as code with Grafonnet; Grafana unified alerting architecture
  - observability-engineer-4 | Distributed Tracing | topics: Distributed tracing concepts spans and traces; W3C Trace Context propagation; OpenTelemetry SDK instrumentation; Auto-instrumentation vs manual spans
  - observability-engineer-5 | Log Management with Loki | topics: Loki architecture and chunk storage; Promtail scrape configs and pipeline stages; LogQL filter and metric queries; Log parsing with regex and JSON stage
  - observability-engineer-6 | OpenTelemetry Collector and Pipelines | topics: OTel Collector architecture receivers processors exporters; OTLP protocol and transport formats; Batch and memory limiter processors; Attribute processing and data enrichment
  - observability-engineer-7 | SLOs and Error Budgets | topics: SLI SLO SLA definitions and hierarchy; Choosing meaningful SLIs for user journeys; Error budget calculation and policies; Multi-window multi-burn-rate alerts
  - observability-engineer-8 | Datadog and Commercial Observability | topics: Datadog Agent installation and configuration; APM tracing and service catalog; Datadog log management and parsing; Infrastructure metrics and host maps
  - observability-engineer-9 | Observability for Kubernetes | topics: kube-state-metrics for Kubernetes object metrics; cAdvisor container resource usage; Prometheus Operator CRDs ServiceMonitor PodMonitor; Kubernetes control plane monitoring
  - observability-engineer-10 | Production Observability Platform Engineering | topics: Thanos architecture for long-term storage; Grafana Mimir for scalable Prometheus; Multi-tenant observability with tenant isolation; Observability as code with Terraform and Jsonnet
