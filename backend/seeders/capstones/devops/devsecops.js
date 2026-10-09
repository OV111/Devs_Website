/**
 * Capstone brief — devsecops track (devsecops), v1.
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
  trackId: "devsecops",
  categoryId: "devops",
  slug: "devsecops-automated-security-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated DevSecOps Security Pipeline and Policy Engine",
  summary:
    "Construct a secure delivery pipeline embedding automated security guardrails at every layer. " +
    "You will integrate dependency scanning (Snyk), static analysis (SonarQube/Semgrep), container scanning (Trivy), " +
    "dynamic API scanning (OWASP ZAP), OPA policy enforcement, and Vault dynamic secrets management.",
  stack: [
    "Snyk",
    "Trivy",
    "SonarQube",
    "HashiCorp Vault",
    "Open Policy Agent",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "sca-scanning",
      text: "Pipeline executes Software Composition Analysis (SCA) to block builds with critical CVE vulnerabilities.",
      check: CHECKS.ci,
    },
    {
      id: "sast-analysis",
      text: "Static application security testing (SAST) checks code against OWASP Top 10 rules and fails on quality gates.",
      check: CHECKS.ci,
    },
    {
      id: "container-scanning",
      text: "Trivy scans Docker container images and infrastructure-as-code manifests for misconfigurations.",
      check: CHECKS.ci,
    },
    {
      id: "vault-secrets",
      text: "Application authenticates with HashiCorp Vault to dynamically fetch database credentials at runtime.",
      check: { type: "file", glob: "config/**/*.json" },
    },
    {
      id: "opa-policy",
      text: "Open Policy Agent (OPA) Rego rules enforce admission control and IaC security compliance.",
      check: { type: "file", glob: "policies/*.rego" },
    },
    {
      id: "dast-scanning",
      text: "Dynamic Application Security Testing (DAST) runs OWASP ZAP baseline API security scans against active test instances.",
      check: CHECKS.ci,
    },
    {
      id: "sbom-generation",
      text: "Pipeline generates a Software Bill of Materials (SBOM) in CycloneDX or SPDX format during build.",
      check: CHECKS.ci,
    },
    {
      id: "docker-hardening",
      text: "Dockerfile implements multi-stage builds, non-root user execution, and read-only filesystems.",
      check: CHECKS.dockerfile,
    },
    {
      id: "compose-local",
      text: "Docker Compose spins up target application, local Vault server, and OPA policy engine for offline validation.",
      check: CHECKS.compose,
    },
    {
      id: "readme",
      text: "README documents threat model, security posture, vulnerability remediation workflows, and local scanning guide.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "pipeline-security",
      name: "Pipeline Security Integration",
      weight: 25,
      layerId: "devsecops-6",
      description:
        "Seamless CI integration of SAST, SCA, and DAST stages with automated build breakage on critical severity.",
    },
    {
      id: "container-iac-security",
      name: "Container & IaC Hardening",
      weight: 20,
      layerId: "devsecops-4",
      description:
        "Hardened Dockerfiles, minimal base images, non-root execution, and Trivy container vulnerability fixes.",
    },
    {
      id: "secrets-management",
      name: "Vault & Secrets Engineering",
      weight: 20,
      layerId: "devsecops-5",
      description:
        "Dynamic database credentials, secret rotation mechanisms, and zero committed hardcoded credentials.",
    },
    {
      id: "policy-as-code",
      name: "Policy as Code & Guardrails",
      weight: 15,
      layerId: "devsecops-8",
      description:
        "Comprehensive Rego policies for OPA verifying Kubernetes/IaC compliance standards.",
    },
    {
      id: "supply-chain",
      name: "Supply Chain & SBOM",
      weight: 10,
      layerId: "devsecops-9",
      description:
        "Automated generation and verification of SBOM artifacts and artifact provenance.",
    },
    {
      id: "threat-modeling-docs",
      name: "Threat Modeling & Documentation",
      weight: 10,
      layerId: "devsecops-1",
      description:
        "Clear threat model diagram, vulnerability triage guidelines, and operational runbooks.",
    },
  ],

  twistPool: [
    {
      id: "cosign-image-signing",
      text: "Sign built container images with Cosign and add an OPA policy enforcing signature validation before deploy.",
    },
    {
      id: "falco-runtime-rules",
      text: "Provide Falco runtime security rules detecting unexpected shell spawns inside running app containers.",
    },
    {
      id: "defectdojo-export",
      text: "Add a pipeline script exporting scan results from Trivy and Snyk directly into a DefectDojo vulnerability dashboard.",
    },
    {
      id: "vault-pki-mtls",
      text: "Configure Vault PKI secrets engine to dynamically issue mTLS client certificates for service communication.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
