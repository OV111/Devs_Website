You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/devops/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "devops" instead):

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
1. trackId = the track id exactly as given below. categoryId = "devops". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
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
11. CLOUD / INFRASTRUCTURE: no live cloud account, no billable resources and no paid SaaS (no Datadog, no managed Kubernetes, no real domain). Everything must validate locally (terraform validate, cfn-lint, bicep build, helm lint, LocalStack, Azurite, kind, Miniflare, docker compose), and CI must run those checks with no cloud credentials. State the real-deploy steps as README documentation, not as a graded requirement. Optional twists must also be free.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### cloud — Cloud Engineer
  - cloud-1 | Linux & Networking Foundations | topics: Linux file system, permissions, users & groups; Shell scripting — variables, loops, functions, cron; Networking — IP addressing, subnets, CIDR, routing; DNS, load balancers, reverse proxies
  - cloud-2 | AWS Core Services | topics: IAM — users, roles, policies, least-privilege principle; VPC — subnets, security groups, NACLs, internet gateways; EC2 — instance types, AMIs, key pairs, user data scripts; S3 — buckets, objects, policies, versioning, lifecycle rules
  - cloud-3 | Infrastructure as Code — Terraform | topics: Terraform architecture — providers, resources, state; HCL syntax — blocks, arguments, expressions, locals; Core workflow — init, plan, apply, destroy; Variables, outputs & modules
  - cloud-4 | Containers with Docker | topics: Container concepts — images, layers, registry, runtime; Dockerfile best practices — multi-stage builds, layer caching; Docker Compose for local multi-service development; Networking between containers
  - cloud-5 | Kubernetes | topics: K8s architecture — control plane, nodes, pods, services; Deployments, ReplicaSets, rolling updates; Services — ClusterIP, NodePort, LoadBalancer; ConfigMaps & Secrets
  - cloud-6 | CI/CD Pipelines | topics: GitHub Actions — workflows, jobs, steps, secrets, matrix builds; CI pipeline — lint, test, build Docker image, push to ECR; CD with ArgoCD — GitOps, app sync, health checks; Terraform in CI — plan on PR, apply on merge
  - cloud-7 | Monitoring & Observability | topics: Three pillars of observability — metrics, logs, traces; Prometheus — scraping, PromQL, alerting rules; Grafana — dashboards, data sources, alerting; Loki + Promtail — log aggregation
  - cloud-8 | Security & Cost Optimization | topics: IAM — least privilege, permission boundaries, service accounts; HashiCorp Vault — secrets engine, dynamic credentials; Network security — private subnets, VPN, WAF; Image scanning — Trivy, ECR native scanning
  - cloud-9 | Multi-Region Architecture and Disaster Recovery | topics: Active-active vs active-passive multi-region topologies; Route 53 latency and failover routing policies; Aurora Global Database and cross-region read replicas; S3 Cross-Region Replication and object consistency
  - cloud-10 | FinOps, Platform Engineering and SRE Practices | topics: FinOps framework and cloud cost allocation tagging strategies; AWS Cost Explorer, Budgets, and Savings Plans optimization; Internal developer platforms and Backstage scaffolding; Golden-path templates and platform-team operating models

### cicd — CI/CD Engineer
  - cicd-1 | CI/CD Foundations | topics: What CI and CD mean and how they differ; Version control workflows and branching; Pipeline stages and triggers; Build artifacts and caching basics
  - cicd-2 | Build and Test Automation | topics: Defining build steps and matrices; Running unit and integration tests; Dependency caching for speed; Building container images in CI
  - cicd-3 | Pipeline as Code with Jenkins | topics: Jenkins architecture and agents; Declarative versus scripted pipelines; Writing a Jenkinsfile; Stages, steps, and post actions
  - cicd-4 | Artifact Management and Versioning | topics: Semantic versioning strategies; Tagging container images; Publishing to artifact registries; Immutable artifacts and provenance
  - cicd-5 | Deployment Strategies | topics: Environment promotion flows; Blue-green deployments; Canary releases; Rolling updates
  - cicd-6 | GitOps with ArgoCD | topics: GitOps principles and workflow; ArgoCD applications and sync; Declarative manifests in Git; Automated drift detection
  - cicd-7 | Secrets and Security in Pipelines | topics: Storing and rotating secrets; OIDC federation for cloud access; Least privilege for runners; Dependency and image scanning
  - cicd-8 | Pipeline Observability and Metrics | topics: DORA metrics and lead time; Pipeline duration tracking; Failure rate dashboards; Flaky test detection
  - cicd-9 | Scaling and Reusable Pipelines | topics: Reusable workflows and composite actions; Shared Jenkins libraries; Self-hosted runner scaling; Templating and policy enforcement
  - cicd-10 | Production Delivery Operations | topics: Multi-environment release governance; Progressive delivery automation; Incident handling for failed deploys; Disaster recovery for pipelines

### sre — Site Reliability Engineer
  - sre-1 | SRE Fundamentals | topics: What SRE is and how it relates to DevOps; Error budgets and risk tolerance; Toil and automation; Service level indicators and objectives
  - sre-2 | Metrics and Monitoring with Prometheus | topics: Metric types and exposition format; Scraping and service discovery; PromQL querying basics; Instrumenting applications
  - sre-3 | Dashboards and Visualization with Grafana | topics: Building panels and dashboards; Templating and variables; Visualizing SLIs and SLOs; Annotations and time ranges
  - sre-4 | Service Level Objectives | topics: Choosing meaningful SLIs; Setting realistic SLO targets; Error budget calculation; Burn rate alerting
  - sre-5 | Alerting and On-Call with PagerDuty | topics: Alertmanager routing and grouping; Integrating PagerDuty; Escalation policies and schedules; Actionable versus noisy alerts
  - sre-6 | Logging and Distributed Tracing | topics: Structured logging practices; Log aggregation and querying; Distributed tracing concepts; Instrumenting with OpenTelemetry
  - sre-7 | Incident Management | topics: Incident command roles; Severity classification; Communication during incidents; Writing and using runbooks
  - sre-8 | Reliability Engineering in Go | topics: Timeouts, retries, and backoff; Circuit breakers and bulkheads; Graceful shutdown and health checks; Rate limiting and load shedding
  - sre-9 | Capacity Planning and Chaos Engineering | topics: Load testing and benchmarking; Capacity forecasting from metrics; Autoscaling strategies; Chaos experiments and hypotheses
  - sre-10 | Operating Reliability at Scale | topics: Long-term metrics storage with Thanos; Federated and multi-cluster monitoring; Reducing toil through automation; Reliability reviews and scorecards

### infra — Infrastructure Dev
  - infra-1 | Linux and Infrastructure Basics | topics: Linux filesystem and permissions; Process and service management; Shell scripting with Bash; Networking fundamentals
  - infra-2 | Infrastructure as Code Concepts | topics: Declarative versus imperative IaC; Idempotency and desired state; State and drift concepts; Provider and resource model
  - infra-3 | Provisioning with Terraform | topics: HCL syntax and expressions; Variables, outputs, and locals; Resource dependencies; Data sources
  - infra-4 | Configuration Management with Ansible | topics: Inventories and hosts; Playbooks and tasks; Modules and idempotency; Variables and templates
  - infra-5 | Reusable Modules and Roles | topics: Terraform modules and composition; Ansible roles and galaxy; Input validation and defaults; Versioning shared modules
  - infra-6 | Programmatic IaC with Pulumi | topics: Pulumi programming model; Languages and SDKs; Stacks and configuration; Resource graph and dependencies
  - infra-7 | State, Secrets, and Remote Backends | topics: Remote state backends; State locking and consistency; Importing existing resources; Managing secrets with Vault
  - infra-8 | Infrastructure CI/CD and Testing | topics: Plan and apply in pipelines; Policy as code and validation; Linting and formatting checks; Automated infrastructure tests
  - infra-9 | Multi-Environment and Multi-Cloud | topics: Environment isolation strategies; Workspaces and directory layouts; Promoting changes across stages; Provider abstractions
  - infra-10 | Operating Infrastructure in Production | topics: Drift detection and remediation; Disaster recovery and backups; Scaling and capacity changes; Patching and maintenance windows

### kubernetes — Kubernetes Engineer
  - kubernetes-1 | Containers and Docker Fundamentals | topics: Container versus virtual machine; Images, layers, and registries; Writing Dockerfiles; Container networking and volumes
  - kubernetes-2 | Kubernetes Core Concepts | topics: Cluster architecture and components; Pods and containers; ReplicaSets and Deployments; Services and basic networking
  - kubernetes-3 | Configuration and Storage | topics: ConfigMaps and Secrets; Environment and volume injection; PersistentVolumes and claims; Storage classes
  - kubernetes-4 | Packaging with Helm | topics: Charts and templates; Values and overrides; Releases and upgrades; Template functions and helpers
  - kubernetes-5 | Networking and Ingress | topics: Cluster networking model; Service types in depth; Ingress controllers and rules; DNS and service discovery
  - kubernetes-6 | Service Mesh with Istio | topics: Service mesh architecture; Sidecar proxies and Envoy; Traffic routing and splitting; Mutual TLS and security
  - kubernetes-7 | Security and RBAC | topics: Authentication and authorization; Role-based access control; Service accounts; Pod security standards
  - kubernetes-8 | Observability and Autoscaling | topics: Metrics server and resource metrics; Horizontal pod autoscaling; Vertical and cluster autoscaling; Monitoring with Prometheus
  - kubernetes-9 | GitOps and Cluster Delivery | topics: GitOps workflow for clusters; Declarative app delivery; Helm with GitOps tools; Progressive delivery
  - kubernetes-10 | Production Cluster Operations | topics: Cluster upgrades and versioning; etcd backup and restore; Disaster recovery; Multi-tenancy and quotas

### aws-dev — AWS Specialist
  - aws-dev-1 | AWS Cloud Fundamentals | topics: Regions and availability zones; IAM users, roles, and policies; Shared responsibility model; VPC basics
  - aws-dev-2 | Compute with EC2 | topics: Instance types and pricing; AMIs and user data; Security groups and key pairs; EBS volumes and snapshots
  - aws-dev-3 | Storage with S3 | topics: Buckets and objects; Storage classes and lifecycle; Bucket policies and access; Versioning and encryption
  - aws-dev-4 | Serverless with Lambda | topics: Lambda functions and runtimes; Event sources and triggers; API Gateway integration; DynamoDB basics
  - aws-dev-5 | Networking and Security | topics: Subnets and route tables; Internet and NAT gateways; Security groups versus NACLs; VPC peering and endpoints
  - aws-dev-6 | Infrastructure as Code with CloudFormation | topics: Template structure and resources; Parameters, mappings, and outputs; Stacks and change sets; Nested and cross-stack references
  - aws-dev-7 | Databases and Messaging | topics: RDS engines and Multi-AZ; DynamoDB data modeling; Read replicas and backups; SQS and SNS messaging
  - aws-dev-8 | Observability and Operations | topics: CloudWatch metrics and alarms; Logs and log insights; Distributed tracing with X-Ray; Auditing with CloudTrail
  - aws-dev-9 | CI/CD on AWS | topics: CodePipeline stages; CodeBuild build specs; CodeDeploy strategies; Deploying via CloudFormation
  - aws-dev-10 | Production Architecture and Scaling | topics: Well-Architected Framework; High availability across zones; Disaster recovery strategies; Cost optimization

### gcp-dev — GCP Specialist
  - gcp-dev-1 | GCP Cloud Fundamentals | topics: Projects and resource hierarchy; IAM roles and members; Regions and zones; VPC basics
  - gcp-dev-2 | Compute and Cloud Run | topics: Compute Engine basics; Containers on Cloud Run; Serverless request handling; Scaling to zero
  - gcp-dev-3 | Storage and Databases | topics: Cloud Storage buckets; Storage classes and lifecycle; Cloud SQL managed databases; Firestore document model
  - gcp-dev-4 | Messaging with Pub/Sub | topics: Topics and subscriptions; Push and pull delivery; Ordering and deduplication; Dead-letter topics
  - gcp-dev-5 | Networking and Security | topics: Subnets and firewall rules; Cloud Load Balancing; Private Google Access; VPC peering and Shared VPC
  - gcp-dev-6 | Data Analytics with BigQuery | topics: Datasets and tables; SQL queries at scale; Streaming inserts; Partitioning and clustering
  - gcp-dev-7 | Kubernetes with GKE | topics: GKE cluster types; Node pools and autoscaling; Deploying workloads; Workload Identity
  - gcp-dev-8 | Observability and Operations | topics: Cloud Monitoring metrics and alerts; Cloud Logging and log-based metrics; Distributed tracing; Uptime checks
  - gcp-dev-9 | Infrastructure as Code and CI/CD | topics: Provisioning GCP with Terraform; Cloud Build pipelines; Artifact Registry; Deploying to Cloud Run and GKE
  - gcp-dev-10 | Production Architecture and Scaling | topics: Google Cloud Architecture Framework; Multi-region high availability; Disaster recovery; Cost optimization

### azure-dev — Azure Specialist
  - azure-dev-1 | Azure Cloud Fundamentals | topics: Subscriptions and resource groups; Azure Active Directory basics; Regions and availability zones; Role-based access control
  - azure-dev-2 | Compute and App Services | topics: Virtual machines and scale sets; App Service web apps; Azure Functions basics; Deployment slots
  - azure-dev-3 | Storage and Databases | topics: Blob storage and containers; Storage tiers and lifecycle; Azure SQL Database; Cosmos DB models
  - azure-dev-4 | Serverless with Azure Functions | topics: Triggers and bindings; Durable Functions; Event Grid events; Service Bus messaging
  - azure-dev-5 | Networking and Security | topics: Virtual networks and subnets; Network security groups; Load Balancer and Application Gateway; Private endpoints
  - azure-dev-6 | Infrastructure as Code with Bicep | topics: Bicep syntax and resources; Parameters and variables; Modules and reuse; Deployment scopes
  - azure-dev-7 | Kubernetes with AKS | topics: AKS cluster provisioning; Node pools and autoscaling; Deploying workloads; Azure AD integration
  - azure-dev-8 | Observability and Operations | topics: Azure Monitor metrics and alerts; Application Insights tracing; Log Analytics queries; Dashboards and workbooks
  - azure-dev-9 | CI/CD with Azure DevOps | topics: Repos and boards; Azure Pipelines YAML; Build and release stages; Deploying Bicep templates
  - azure-dev-10 | Production Architecture and Scaling | topics: Azure Well-Architected Framework; Multi-region high availability; Disaster recovery; Cost optimization

### devsecops — DevSecOps Engineer
  - devsecops-1 | Security Fundamentals for DevOps | topics: CIA triad and threat modeling; Common vulnerability classes; OWASP Top Ten; Shift-left security mindset
  - devsecops-2 | Dependency and SCA Scanning with Snyk | topics: Software composition analysis; Scanning dependencies with Snyk; Understanding CVEs and severity; License compliance
  - devsecops-3 | Static Analysis with SonarQube | topics: Static application security testing; Quality gates and rules; Detecting security hotspots; Code smells and coverage
  - devsecops-4 | Container and Image Security with Trivy | topics: Image vulnerability scanning; Base image hardening; Scanning IaC with Trivy; Misconfiguration detection
  - devsecops-5 | Secrets Management with Vault | topics: Vault architecture and auth methods; Static and dynamic secrets; Encryption as a service; Secret rotation
  - devsecops-6 | Secure CI/CD Pipelines | topics: Pipeline threat modeling; Least privilege for runners; OIDC for cloud access; Integrating security scans
  - devsecops-7 | Dynamic Testing and Runtime Security | topics: Dynamic application security testing; Scanning APIs with ZAP; Runtime threat detection; Behavioral monitoring with Falco
  - devsecops-8 | Policy as Code and Compliance | topics: Policy as code concepts; Open Policy Agent and Rego; Admission control policies; IaC policy scanning
  - devsecops-9 | Supply Chain Security | topics: Supply chain attack vectors; Software bill of materials; Artifact signing with Sigstore; Provenance and attestation
  - devsecops-10 | Security Operations at Scale | topics: Centralized logging and SIEM; Vulnerability management programs; Incident response playbooks; Security metrics and reporting

### platform-engineer — Platform Engineer
  - platform-engineer-1 | Platform Engineering Foundations | topics: What an internal developer platform is; Cognitive load and golden paths; Platform as a product; Self-service principles
  - platform-engineer-2 | Kubernetes as a Platform Base | topics: Cluster architecture for platforms; Workloads and namespaces; Multi-tenancy basics; Packaging with Helm
  - platform-engineer-3 | Infrastructure as Code for Platforms | topics: Terraform for platform infrastructure; Reusable infrastructure modules; Environment provisioning; State and backends
  - platform-engineer-4 | Developer Portals with Backstage | topics: Backstage architecture; Software catalog; Component and entity model; TechDocs documentation
  - platform-engineer-5 | Golden Paths and Templates | topics: Software templates and scaffolding; Backstage software templates; Standardized repository setup; Embedding CI/CD in templates
  - platform-engineer-6 | GitOps Delivery with ArgoCD | topics: GitOps for platform delivery; ArgoCD applications and projects; App of apps pattern; Multi-cluster delivery
  - platform-engineer-7 | Self-Service APIs and Operators | topics: Custom resource definitions; Operators and controllers; Provisioning with Crossplane; Platform abstractions and claims
  - platform-engineer-8 | Observability and Golden Signals | topics: Platform-wide metrics and logs; Golden signals dashboards; Tracing across services; Self-service alerting
  - platform-engineer-9 | Policy, Security, and Governance | topics: Policy as code for platforms; Admission control guardrails; Secrets management for tenants; Role-based access control
  - platform-engineer-10 | Operating the Platform at Scale | topics: Platform reliability and SLOs; Onboarding many teams; Versioning platform capabilities; Measuring adoption and DX
