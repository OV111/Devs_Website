/**
 * Capstone brief — infra track (infra), v1.
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
  trackId: "infra",
  categoryId: "devops",
  slug: "infra-multi-env-automation-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Multi-Environment Infrastructure Automation with Terraform and Ansible",
  summary:
    "Build a production-grade infrastructure orchestration framework combining modular Terraform " +
    "declarations with Ansible configuration management. You will provision isolated staging and " +
    "production environments locally using LocalStack or Docker, enforce policy checks, and manage remote state.",
  stack: ["Terraform", "Ansible", "Pulumi", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "tf-modules",
      text: "Terraform configurations use reusable local modules for networking, compute, and storage abstraction.",
      check: { type: "file", glob: "terraform/**/*.tf" },
    },
    {
      id: "ansible-playbooks",
      text: "Ansible playbooks and roles configure system packages, users, firewalls, and service dependencies idempotently.",
      check: { type: "file", glob: "ansible/**/*.{yml,yaml}" },
    },
    {
      id: "environment-isolation",
      text: "Directory layout enforces clear workspace/environment separation between staging and production stages.",
      check: { type: "file", glob: "terraform/environments/**/*.tf" },
    },
    {
      id: "state-backend",
      text: "Configures remote state backend settings with state locking mechanisms and encrypted data storage.",
      check: { type: "file", glob: "terraform/**/*.tf" },
    },
    {
      id: "pulumi-stack",
      text: "Provides a Pulumi infrastructure program demonstrating programmatic IaC resource creation for a auxiliary service.",
      check: { type: "file", glob: "pulumi/**/*.{js,ts,py,go,yaml}" },
    },
    {
      id: "iac-testing",
      text: "Infrastructure code includes automated linting (tflint, ansible-lint) and policy-as-code validation rules.",
      check: CHECKS.ci,
    },
    {
      id: "docker-local",
      text: "Docker Compose sets up local target nodes/containers and local backend infrastructure for testing playbooks.",
      check: CHECKS.compose,
    },
    {
      id: "env-example",
      text: "Templates required variables and credentials in .env.example with zero committed secrets.",
      check: CHECKS.envExample,
    },
    {
      id: "ci-pipeline",
      text: "GitHub Actions pipeline executes formatting checks, terraform plan, and ansible playbook linting automatically.",
      check: CHECKS.ci,
    },
    {
      id: "readme",
      text: "README documents local provisioning workflow, drift detection execution, and disaster recovery restoration.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "iac-modularization",
      name: "Modular Provisioning & Design",
      weight: 25,
      layerId: "infra-3",
      description:
        "Well-structured Terraform code using reusable local modules, strict variable validations, and explicit outputs.",
    },
    {
      id: "config-management",
      name: "Configuration Management",
      weight: 20,
      layerId: "infra-4",
      description:
        "Idempotent Ansible playbooks and structured roles configuring target host states reliably.",
    },
    {
      id: "programmatic-iac",
      name: "Programmatic IaC & Abstraction",
      weight: 15,
      layerId: "infra-6",
      description:
        "Clean implementation of Pulumi stack resources adhering to software engineering practices.",
    },
    {
      id: "state-security",
      name: "State Isolation & Secrets",
      weight: 15,
      layerId: "infra-7",
      description:
        "Safe state locking setup, clean secret handling, and clear environment boundary isolation.",
    },
    {
      id: "testing-policy",
      name: "IaC Testing & Policy as Code",
      weight: 15,
      layerId: "infra-8",
      description:
        "Automated linting, policy enforcement, and plan output inspection integrated into CI.",
    },
    {
      id: "operations-dr",
      name: "Day-2 Operations & Docs",
      weight: 10,
      layerId: "infra-10",
      description:
        "Comprehensive documentation covering drift remediation, backup routines, and teardown instructions.",
    },
  ],

  twistPool: [
    {
      id: "drift-detection-script",
      text: "Add a scheduled pipeline script that runs terraform plan -detailed-exitcode to notify on out-of-band drift.",
    },
    {
      id: "vault-ansible-lookup",
      text: "Integrate HashiCorp Vault lookup dynamic secrets inside Ansible playbooks for database credentials during provisioning.",
    },
    {
      id: "opa-conftest",
      text: "Implement OpenPolicyAgent / Conftest rego policy checks in CI to reject open security groups or missing tags.",
    },
    {
      id: "terratest-integration",
      text: "Add automated Go-based Terratest or Python-based pytest integration tests that validate active docker infrastructure.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
