/**
 * Capstone brief — appsec-engineer track (appsec-engineer), v1.
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
  trackId: "appsec-engineer",
  categoryId: "cybersecurity",
  slug: "appsec-engineer-devsecops-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated DevSecOps Pipeline & Secure Software Gateway",
  summary:
    "Build an automated DevSecOps pipeline integration containing custom Semgrep SAST rules, container scanning, " +
    "dependency vulnerability checks (SCA), dynamic API fuzzing, and a centralized vulnerability triage dashboard.",
  stack: ["Node.js or Python", "Semgrep", "Trivy", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "sast-integration",
      text: "Integrate Semgrep static analysis into CI with custom rules targeting project-specific security flaws (e.g., custom auth bypass, hardcoded secrets).",
    },
    {
      id: "custom-semgrep-rules",
      text: "Write at least 3 custom Semgrep YAML rules detecting OWASP Top 10 vulnerabilities in code.",
      check: { type: "file", glob: "**/*.yml" },
    },
    {
      id: "sca-dependency-scan",
      text: "Automate Software Composition Analysis (SCA) checking dependencies against known CVE databases with configurable failure thresholds.",
    },
    {
      id: "container-image-scan",
      text: "Incorporate Trivy container image scanning in CI to block builds containing critical vulnerabilities.",
    },
    {
      id: "dast-api-fuzzer",
      text: "Build an automated DAST / API fuzzing module executing OWASP ZAP or custom HTTP checks against deployed endpoints.",
    },
    {
      id: "vulnerability-triage-api",
      text: "Provide a backend API service that ingests SAST, SCA, and DAST JSON scan results and calculates risk scores.",
    },
    {
      id: "threat-model-doc",
      text: "Document an enterprise Application Threat Model using STRIDE methodology for the target API.",
      check: { type: "file", glob: ["docs/**/*.md", "**/threat-model.md"] },
    },
    {
      id: "tests",
      text: "Unit tests cover vulnerability aggregation logic, CVSS risk calculations, and report generation utilities.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README explains setup, local scanner execution, CI integration steps, and vulnerability triage workflows.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Triage dashboard service and target application run via Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI workflow enforces security gates (SAST, SCA, container scan) on every pull request.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No production API keys, database secrets, or credentials committed.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "sast-rule-engineering",
      name: "SAST & Rule Customization",
      weight: 25,
      layerId: "appsec-engineer-3",
      description:
        "Precision, syntax correctness, and low false-positive rate of custom Semgrep SAST rules.",
    },
    {
      id: "pipeline-security",
      name: "DevSecOps & CI/CD Security Gates",
      weight: 20,
      layerId: "appsec-engineer-8",
      description:
        "Seamless integration of automated security gates (SAST, SCA, container scanning) into GitHub Actions.",
    },
    {
      id: "dast-api-security",
      name: "DAST & API Security Testing",
      weight: 15,
      layerId: "appsec-engineer-7",
      description:
        "Effective dynamic scanning and API fuzzing coverage against active endpoints.",
    },
    {
      id: "vulnerability-management",
      name: "Triage & Risk Scoring",
      weight: 15,
      layerId: "appsec-engineer-9",
      description:
        "Design of vulnerability ingestion backend, CVSS risk scoring, and deduplication logic.",
    },
    {
      id: "testing-code-quality",
      name: "Code Quality & Test Coverage",
      weight: 15,
      layerId: "appsec-engineer-1",
      description:
        "Modular code organization, clear REST endpoints, and robust unit tests.",
    },
    {
      id: "threat-modeling-docs",
      name: "Threat Modeling & Documentation",
      weight: 10,
      layerId: "appsec-engineer-5",
      description:
        "Clarity of STRIDE threat model document, setup guide, and developer remediation advice.",
    },
  ],

  twistPool: [
    {
      id: "sarif-github-security-export",
      text: "Format all scanner findings into standard SARIF (Static Analysis Results Interchange Format) to upload directly to GitHub Code Security.",
    },
    {
      id: "secret-entropy-detector",
      text: "Add a high-entropy secret scanner module checking Git commit diffs for exposed API keys and private certificates.",
    },
    {
      id: "software-bill-of-materials",
      text: "Generate an automated CycloneDX or SPDX Software Bill of Materials (SBOM) during the build phase.",
    },
    {
      id: "auto-remediation-prs",
      text: "Implement a script that automatically opens GitHub Pull Requests to bump vulnerable dependency versions identified by SCA.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
