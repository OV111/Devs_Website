/**
 * Capstone brief — aws-dev track (aws-dev), v1.
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
  stack: [
    "AWS CloudFormation",
    "AWS Lambda",
    "DynamoDB",
    "SQS",
    "LocalStack",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "cfn-template",
      text: "Infrastructure declared completely in CloudFormation/SAM or Terraform templates without manual setup.",
      check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" },
    },
    {
      id: "api-gateway",
      text: "REST or HTTP API Gateway routes requests to Lambda handler functions with request validation.",
      check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" },
    },
    {
      id: "lambda-handlers",
      text: "Serverless Lambda handlers process requests, interact with DynamoDB, and send messages to SQS.",
      check: { type: "file", glob: "src/**/*.{js,ts,py,go}" },
    },
    {
      id: "dynamodb-streams",
      text: "DynamoDB table uses single-table design principles and processes record updates via stream triggers.",
      check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" },
    },
    {
      id: "sqs-sns-decoupling",
      text: "SQS queues and SNS topics provide asynchronous decoupling and dead-letter queue (DLQ) error handling.",
      check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" },
    },
    {
      id: "cloudwatch-metrics",
      text: "CloudWatch alarms monitor Lambda error rates, DLQ message counts, and API Gateway 5xx latency.",
      check: { type: "file", glob: "**/*.{yaml,yml,json,tf}" },
    },
    {
      id: "compose-localstack",
      text: "Docker Compose spins up LocalStack to emulate AWS serverless services locally.",
      check: CHECKS.compose,
    },
    {
      id: "unit-tests",
      text: "Automated unit tests cover Lambda handler logic and message serialization rules.",
      check: CHECKS.jsTests,
    },
    {
      id: "ci-pipeline",
      text: "GitHub Actions workflow lints CloudFormation templates (cfn-lint), runs tests, and validates local SAM build.",
      check: CHECKS.ci,
    },
    {
      id: "readme",
      text: "README documents AWS SAM/LocalStack local deployment, testing steps, and architecture diagram.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "serverless-arch",
      name: "Serverless & Compute Architecture",
      weight: 25,
      layerId: "aws-dev-4",
      description:
        "Efficient Lambda handler design, proper event triggering, and clean runtime management.",
    },
    {
      id: "iac-cloudformation",
      name: "IaC & AWS Provisioning",
      weight: 20,
      layerId: "aws-dev-6",
      description:
        "Clean CloudFormation/SAM templates with proper parameters, outputs, and stack modularity.",
    },
    {
      id: "data-messaging",
      name: "DynamoDB & Async Messaging",
      weight: 20,
      layerId: "aws-dev-7",
      description:
        "Effective DynamoDB schema, Stream event integration, and reliable SQS DLQ handling.",
    },
    {
      id: "security-iam",
      name: "AWS Security & Least Privilege",
      weight: 15,
      layerId: "aws-dev-5",
      description:
        "Granular IAM execution roles per Lambda function and secure VPC/service endpoints.",
    },
    {
      id: "observability",
      name: "CloudWatch Observability",
      weight: 10,
      layerId: "aws-dev-8",
      description:
        "Structured logging, custom metrics, and CloudWatch alarms monitoring error budgets.",
    },
    {
      id: "ci-testing",
      name: "CI Automation & Documentation",
      weight: 10,
      layerId: "aws-dev-9",
      description:
        "Automated template linting, unit testing in CI, and thorough setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "xray-tracing",
      text: "Enable AWS X-Ray active tracing across API Gateway and Lambda functions to capture full request trace graphs.",
    },
    {
      id: "s3-event-processing",
      text: "Add an S3 bucket with object-created notification triggers driving automated image/document processing in Lambda.",
    },
    {
      id: "cognito-auth-mock",
      text: "Configure API Gateway with a Cognito User Pool authorizer or JWT authorizer mock verifying auth headers.",
    },
    {
      id: "eventbridge-bus",
      text: "Replace direct SNS messaging with a custom EventBridge event bus with rule filtering for domain events.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
