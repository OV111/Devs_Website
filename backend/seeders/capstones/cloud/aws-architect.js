/**
 * Capstone brief — aws-architect track (aws-architect), v1.
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
  stack: [
    "AWS CloudFormation",
    "AWS EC2 / ASG",
    "AWS ALB",
    "AWS Aurora",
    "AWS Lambda",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "vpc-topology",
      text: "CloudFormation template provisions a VPC spanning two Availability Zones with public and private subnets, NAT Gateways, and explicit route tables.",
    },
    {
      id: "compute-asg",
      text: "An Application Load Balancer routes traffic to an EC2 Auto Scaling Group running in private subnets with strict security groups.",
    },
    {
      id: "database-layer",
      text: "Deploys an Amazon Aurora PostgreSQL Multi-AZ cluster in private DB subnet groups with encrypted storage.",
    },
    {
      id: "secret-management",
      text: "Database credentials and API keys are stored in AWS Secrets Manager or Parameter Store and encrypted using a custom KMS customer master key.",
    },
    {
      id: "serverless-event",
      text: "Configures an asynchronous event pipeline where S3 file uploads trigger a Lambda function via SQS and publish status updates to SNS.",
    },
    {
      id: "cfn-structure",
      text: "Infrastructure code is structured as modular CloudFormation templates using parameters, mappings, cross-stack outputs, and nested stacks.",
    },
    {
      id: "tests",
      text: "Automated test scripts or cfn-lint static analysis checks validate CloudFormation templates for syntax correctness and security posture.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py,sh}" },
    },
    {
      id: "readme",
      text: "README documents architectural topology, parameters, deployment steps, and cleanup instructions.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example or template parameter file specifying non-sensitive stack parameters.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow validates CloudFormation syntax with cfn-lint or taskcat on every commit.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "network-design",
      name: "VPC & Network Architecture",
      weight: 20,
      layerId: "aws-architect-2",
      description:
        "Correct CIDR allocation, public/private subnet segmentation, routing tables, and NAT Gateway configuration.",
    },
    {
      id: "compute-ha",
      name: "High Availability & Scaling",
      weight: 20,
      layerId: "aws-architect-3",
      description:
        "ALB target group health checks, ASG multi-AZ scaling policies, and proper security group ingress/egress rules.",
    },
    {
      id: "storage-db",
      name: "Database & Security Posture",
      weight: 20,
      layerId: "aws-architect-4",
      description:
        "Multi-AZ Aurora configuration, encryption at rest using KMS, and parameter/secret referencing.",
    },
    {
      id: "iac-quality",
      name: "CloudFormation Engineering",
      weight: 15,
      layerId: "aws-architect-6",
      description:
        "Clean usage of parameters, outputs, intrinsic functions, export/import names, and modular stack structure.",
    },
    {
      id: "serverless-integration",
      name: "Serverless & Messaging",
      weight: 15,
      layerId: "aws-architect-7",
      description:
        "Proper IAM execution role permissions, S3 event notifications, SQS queues, and SNS topics.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI",
      weight: 10,
      layerId: "aws-architect-9",
      description:
        "Comprehensive README deployment guide and automated linting/validation CI pipeline.",
    },
  ],

  twistPool: [
    {
      id: "cloudfront-cdn",
      text: "Add a CloudFront distribution in front of the Application Load Balancer with AWS WAF rate-limiting rules attached.",
    },
    {
      id: "cross-region-dr",
      text: "Configure an S3 cross-region replication rule and a cross-region Aurora read replica for disaster recovery readiness.",
    },
    {
      id: "cost-budget-alerts",
      text: "Provision an AWS Budget resource in CloudFormation with SNS alerts triggered at 80% expected spend thresholds.",
    },
    {
      id: "route53-failover",
      text: "Set up Route 53 DNS failover routing policies pointing between primary infrastructure and a static S3 maintenance page.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
