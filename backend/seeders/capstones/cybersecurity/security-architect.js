/**
 * Capstone brief — security-architect track (security-architect), v1.
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
  trackId: "security-architect",
  categoryId: "cybersecurity",
  slug: "security-architect-zerotrust-blueprint",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Zero Trust Enterprise Reference Architecture & Guardrails",
  summary:
    "Design and validate an enterprise cloud security architecture featuring a Zero Trust network layout, " +
    "automated Threat Modeling parser (STRIDE), HashiCorp Vault secrets integration, and Terraform guardrails.",
  stack: ["Terraform", "Python", "HashiCorp Vault", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "threat-model-spec",
      text: "Provide a machine-readable JSON/YAML STRIDE threat model document specifying components, trust boundaries, and mitigations.",
    },
    {
      id: "terraform-architecture",
      text: "Define modular Terraform configurations implementing 3-tier network segmentation (Public, App, Database) with isolated security groups.",
      check: { type: "file", glob: "**/*.tf" },
    },
    {
      id: "iam-least-privilege",
      text: "Specify strict RBAC/ABAC role policies in Terraform with explicitly scoped permissions enforcing least privilege.",
    },
    {
      id: "vault-secrets-engine",
      text: "Integrate HashiCorp Vault for dynamic database credentials and transit engine data encryption at rest.",
    },
    {
      id: "zero-trust-proxy",
      text: "Implement an architectural policy enforcement point (PEP) validating device posture headers and OIDC tokens per request.",
    },
    {
      id: "automated-threat-parser",
      text: "Build a Python utility that parses the threat model YAML file and validates that every high risk has a mapped security control.",
    },
    {
      id: "tests",
      text: "Automated tests validate Terraform syntax/policy compliance and threat parser execution.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "architecture-diagram",
      text: "Provide comprehensive architectural Data Flow Diagrams (DFDs) illustrating trust boundaries and security controls.",
      check: { type: "file", glob: ["docs/**/*.md", "**/architecture*.md"] },
    },
    {
      id: "readme",
      text: "README details architecture design principles, Vault setup, Terraform deployment, and threat model methodology.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Run local HashiCorp Vault and application simulation environment using Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI pipeline runs terraform validate/fmt and threat model validation scripts on every pull request.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No hardcoded private keys, certificates, or tokens are committed in git history.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "architecture-design",
      name: "Zero Trust Architecture Design",
      weight: 25,
      layerId: "security-architect-6",
      description:
        "Depth of Zero Trust implementation, network segmentation, and strict trust boundary enforcement.",
    },
    {
      id: "threat-modeling",
      name: "STRIDE Threat Modeling Quality",
      weight: 20,
      layerId: "security-architect-2",
      description:
        "Completeness of DFDs, threat identification rigor, and accuracy of control mappings.",
    },
    {
      id: "secrets-crypto",
      name: "Crypto & Secrets Management",
      weight: 15,
      layerId: "security-architect-8",
      description:
        "Proper use of HashiCorp Vault, dynamic secrets rotation, and TLS certificate lifecycle management.",
    },
    {
      id: "iac-guardrails",
      name: "Infrastructure as Code Security",
      weight: 15,
      layerId: "security-architect-5",
      description:
        "Quality, modularity, and security posture of Terraform scripts and cloud security controls.",
    },
    {
      id: "verification-automation",
      name: "Validation & Automated Checks",
      weight: 15,
      layerId: "security-architect-7",
      description:
        "Effective automated threat parser and Infrastructure as Code security verification tests.",
    },
    {
      id: "documentation-clarity",
      name: "Documentation & Diagrams",
      weight: 10,
      layerId: "security-architect-1",
      description:
        "Clear architectural design rationale, comprehensive DFD visuals, and complete setup instructions.",
    },
  ],

  twistPool: [
    {
      id: "pki-mTLS-enforcement",
      text: "Implement automated mTLS certificate issue and enforcement between microservices using a Vault-backed private CA.",
    },
    {
      id: "opa-policy-as-code",
      text: "Write Open Policy Agent (OPA) / Rego rules to evaluate Terraform plan outputs against organizational compliance standards in CI.",
    },
    {
      id: "aws-security-hub-exporter",
      text: "Construct a security telemetry ingestion module that maps architecture state findings to AWS Security Finding Format (ASFF).",
    },
    {
      id: "break-glass-approval",
      text: "Architect a emergency temporary privilege elevation mechanism ('break-glass') with mandatory audit logging and time-based auto-revocation.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
