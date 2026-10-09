/**
 * Capstone brief — cloud-security track (cloud-security), v1.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "cloud-security",
  categoryId: "cybersecurity",
  slug: "cloud-security-iam-posture-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cloud Infrastructure Security & Automated Posture Governance Engine",
  summary:
    "Design and deploy hardened AWS/Cloud Infrastructure as Code (IaC) using Terraform, implement an automated IAM " +
    "least-privilege policy analyzer, parse CloudTrail security logs, and enforce compliance policy guardrails.",
  stack: ["Terraform", "Python", "AWS LocalStack or Docker", "GitHub Actions"],

  requirements: [
    {
      id: "iac-hardening",
      text: "Define secure Terraform infrastructure modules configuring VPC network isolation, private subnets, S3 encryption, and Security Groups.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "iam-least-privilege-analyzer",
      text: "Build a Python utility that parses AWS IAM policies and flags overly permissive wildcards (* permissions or * resources).",
    },
    {
      id: "cloudtrail-log-auditor",
      text: "Parse AWS CloudTrail event logs to identify anomalous API actions (e.g., Root account activity, security group modifications, unauthorized S3 access).",
    },
    {
      id: "policy-as-code",
      text: "Implement Policy as Code guardrails (using Open Policy Agent / Rego or Checkov) to evaluate Terraform plan files prior to deployment.",
      check: { type: "file", glob: "**/*.rego" },
    },
    {
      id: "kms-key-rotation",
      text: "Configure AWS KMS customer managed keys with enforced automatic key rotation and scoped key usage policies in Terraform.",
    },
    {
      id: "cloud-incident-playbook",
      text: "Provide documented incident response procedures for compromised cloud credentials and S3 bucket data exposure.",
      check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] },
    },
    {
      id: "tests",
      text: "Unit tests verify IAM policy parser rules, CloudTrail alert logic, and Terraform validation utilities.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README documents architecture layout, LocalStack / AWS deployment steps, Policy-as-Code checks, and audit scripts.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Run local cloud simulation environment (LocalStack) and policy checker tools using Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI pipeline executes Terraform validation, Policy as Code checks, and Python unit tests on every pull request.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No real AWS access keys, secret keys, or cloud credentials committed in git repository.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "cloud-architecture",
      name: "Cloud Architecture & IaC Hardening",
      weight: 25,
      layerId: "cloud-security-1",
      description:
        "Quality, security posture, and network isolation of Terraform cloud infrastructure modules.",
    },
    {
      id: "iam-governance",
      name: "IAM & Least Privilege Analysis",
      weight: 20,
      layerId: "cloud-security-2",
      description:
        "Rigor of automated IAM policy analysis, wildcard detection, and privilege evaluation logic.",
    },
    {
      id: "policy-as-code",
      name: "Policy as Code & Guardrails",
      weight: 15,
      layerId: "cloud-security-2",
      description:
        "Implementation of automated OPA/Rego compliance policies blocking insecure IaC deployments.",
    },
    {
      id: "cloud-telemetry",
      name: "Cloud Audit & Log Analytics",
      weight: 15,
      layerId: "cloud-security-2",
      description:
        "Accuracy and completeness of CloudTrail event parsing and anomaly identification.",
    },
    {
      id: "testing-code-quality",
      name: "Code Engineering & Testing",
      weight: 15,
      layerId: "cloud-security-2",
      description:
        "Modular Python code, clean Terraform module organization, and thorough test coverage.",
    },
    {
      id: "docs-and-operability",
      name: "Documentation & Response Playbooks",
      weight: 10,
      layerId: "cloud-security-1",
      description:
        "Quality of cloud incident response playbooks, LocalStack deployment instructions, and setup guides.",
    },
  ],

  twistPool: [
    {
      id: "auto-remediation-lambda",
      text: "Develop an automated remediation script that immediately revokes public access blocks on S3 buckets whenever a misconfiguration is detected.",
    },
    {
      id: "guardduty-asff-converter",
      text: "Build an event pipeline converting raw CloudTrail alerts into standard Security Finding Format (ASFF) for SIEM ingestion.",
    },
    {
      id: "container-ecs-security",
      text: "Add Terraform modules for an AWS ECS/EKS container cluster enforcing read-only root filesystems and task execution roles.",
    },
    {
      id: "drift-detection-engine",
      text: "Implement a drift detection module comparing live cloud resource configurations against state files to identify unrecorded manual changes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
