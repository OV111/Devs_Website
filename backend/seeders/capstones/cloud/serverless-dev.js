/**
 * Capstone brief — serverless-dev track (serverless-dev), v1.
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
  stack: [
    "AWS SAM",
    "AWS Lambda",
    "Amazon API Gateway",
    "Amazon DynamoDB",
    "AWS Step Functions",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "sam-template",
      text: "Application infrastructure is declared using AWS SAM template format with global configuration defaults and parameters.",
      check: { type: "file", glob: "{template,sam}.{yml,yaml}" },
    },
    {
      id: "api-auth",
      text: "API Gateway HTTP API exposes endpoints protected by a Cognito User Pool JWT authorizer.",
    },
    {
      id: "dynamodb-single-table",
      text: "Order and inventory data are persisted in a single DynamoDB table using Composite Primary Keys (PK/SK) and Secondary Indexes.",
    },
    {
      id: "step-functions-saga",
      text: "Order fulfillment uses a Step Functions state machine with Task retry, catch error handling, and compensatory rollback steps.",
    },
    {
      id: "sqs-sns-fanout",
      text: "Order status updates trigger DynamoDB Streams to fan out notifications through SNS topics and SQS dead-letter queues.",
    },
    {
      id: "observability-xray",
      text: "Lambda functions use structured logging and AWS X-Ray tracing for end-to-end request tracing.",
    },
    {
      id: "tests",
      text: "Integration tests invoke SAM functions locally or test handler business logic and DynamoDB interactions.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README details local invocation using SAM CLI, deployment steps, environment parameters, and API routes.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes env.json.example or .env.example for local SAM CLI invocation parameters.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow runs sam validate, linter checks, and unit tests on code commits.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "serverless-architecture",
      name: "SAM Template & Architecture",
      weight: 20,
      layerId: "serverless-dev-4",
      description:
        "Correct AWS SAM resource usage, IAM execution role granularity, and local invoke capabilities.",
    },
    {
      id: "database-design",
      name: "DynamoDB Single-Table Design",
      weight: 20,
      layerId: "serverless-dev-3",
      description:
        "Effective access pattern mapping, PK/SK partitioning, GSI usage, and stream event processing.",
    },
    {
      id: "orchestration",
      name: "Step Functions & Saga Workflow",
      weight: 20,
      layerId: "serverless-dev-6",
      description:
        "Robust orchestration state transitions, task error catching, retries, and compensation logic.",
    },
    {
      id: "event-messaging",
      name: "Event-Driven Fan-Out & Queues",
      weight: 15,
      layerId: "serverless-dev-5",
      description:
        "Proper SNS fan-out configuration, SQS event source mapping, and dead-letter queue handling.",
    },
    {
      id: "observability-security",
      name: "Security & Observability",
      weight: 15,
      layerId: "serverless-dev-9",
      description:
        "Cognito JWT authorizer integration, structured correlation IDs, and active X-Ray tracing.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI Pipelines",
      weight: 10,
      layerId: "serverless-dev-10",
      description:
        "Clear README documentation for local SAM CLI testing and automated CI workflows.",
    },
  ],

  twistPool: [
    {
      id: "snapstart-optimization",
      text: "Configure Provisioned Concurrency or SnapStart on performance-critical Lambda handlers to eliminate cold starts.",
    },
    {
      id: "presigned-urls",
      text: "Add an invoice generation endpoint returning S3 presigned upload/download URLs using expiring IAM credentials.",
    },
    {
      id: "eventbridge-pipes",
      text: "Replace direct DynamoDB stream consumers with AWS EventBridge Pipes filtering events before delivery to SQS.",
    },
    {
      id: "waf-rate-limit",
      text: "Attach an AWS WAF WebACL to the API Gateway stage enforcing rate-limiting rules per client IP address.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
