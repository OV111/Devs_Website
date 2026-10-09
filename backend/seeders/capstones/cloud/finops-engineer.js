/**
 * Capstone brief — finops-engineer track (finops-engineer), v1.
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
  stack: [
    "Python",
    "Infracost",
    "OpenCost / Kubecost",
    "AWS Cost Explorer API",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "billing-ingestion",
      text: "Ingests cloud billing exports or Cost Explorer reports into normalized FOCUS (FinOps Open Cost and Usage Specification) format.",
    },
    {
      id: "tag-enforcement",
      text: "Automates detection of untagged resources and executes compliance checks against team/environment tagging taxonomy.",
    },
    {
      id: "idle-waste-remediation",
      text: "Script identifies unattached EBS volumes, unassociated Elastic IPs, and idle EC2/VM instances, emitting remediation actions.",
    },
    {
      id: "k8s-cost-allocation",
      text: "Integrates OpenCost or Kubecost metrics to break down Kubernetes cluster expenses by namespace, pod, and service label.",
    },
    {
      id: "infracost-ci",
      text: "Integrates Infracost into GitHub Actions pull requests to generate real-time cost impact comments for IaC changes.",
    },
    {
      id: "unit-metrics-dashboard",
      text: "Calculates key cloud business unit metrics (e.g. cost per active user, cost per API transaction) exported to JSON/CSV reports.",
    },
    {
      id: "tests",
      text: "Pytest suite verifies billing normalization logic, tag parser regex rules, and idle resource calculation algorithms.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details tagging taxonomy rules, Infracost setup in CI/CD, FinOps KPI definitions, and execution commands.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with API keys, threshold configurations, and mock billing dataset paths.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Dockerfile packages the FinOps analysis engine and reporting utilities for container execution.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow runs code linting, unit tests, and Infracost cost estimation checks.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "billing-normalization",
      name: "Billing Data & FOCUS Standards",
      weight: 20,
      layerId: "finops-engineer-7",
      description:
        "Accurate ingestion of billing data, schema mapping to FOCUS standards, and unit metric calculation.",
    },
    {
      id: "tagging-governance",
      name: "Tagging Policy Enforcement",
      weight: 20,
      layerId: "finops-engineer-3",
      description:
        "Comprehensive taxonomy validation, automated compliance checks, and resource ownership attribution.",
    },
    {
      id: "waste-elimination",
      name: "Idle Resource & Waste Remediation",
      weight: 20,
      layerId: "finops-engineer-5",
      description:
        "Accurate detection of unattached disks, unused IPs, and over-provisioned instances with automated recommendations.",
    },
    {
      id: "k8s-costing",
      name: "Container & Kubernetes Costing",
      weight: 15,
      layerId: "finops-engineer-8",
      description:
        "Effective OpenCost integration, namespace allocation breakdown, and bin-packing efficiency metrics.",
    },
    {
      id: "infracost-automation",
      name: "Infracost & IaC Integration",
      weight: 15,
      layerId: "finops-engineer-9",
      description:
        "Seamless CI/CD Pull Request integration commenting on estimated monthly cost delta.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Executive Reporting",
      weight: 10,
      layerId: "finops-engineer-10",
      description:
        "Clear README setup instructions, FinOps maturity matrix commentary, and executive dashboard exports.",
    },
  ],

  twistPool: [
    {
      id: "auto-scheduler-lambda",
      text: "Implement a Lambda routine that automatically stops non-production development instances during off-peak weekend hours.",
    },
    {
      id: "commitment-recommendation",
      text: "Build a recommendation algorithm analyzing usage logs to propose optimal AWS Savings Plans or Reserved Instance purchases.",
    },
    {
      id: "anomaly-slack-alerts",
      text: "Add spending anomaly detection that sends immediate Webhook alerts to Slack when daily service costs spike over 25%.",
    },
    {
      id: "multi-cloud-billing",
      text: "Extend billing normalization logic to process both AWS Cost and Usage Reports (CUR) and Azure Cost Management exports simultaneously.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
