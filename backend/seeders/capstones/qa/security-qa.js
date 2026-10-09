/**
 * Capstone brief — security-qa track (security-qa), v1.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "security-qa",
  categoryId: "qa",
  slug: "security-qa-dast-vulnerability-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated DAST & Security Regression Suite",
  summary:
    "Design and implement an automated web security testing framework using OWASP ZAP, Python, and Selenium/Playwright. " +
    "You will audit target web services for OWASP Top 10 vulnerabilities, construct custom security regression scripts, " +
    "threat-model application boundaries, and build a zero-tolerance security gate into a CI/CD pipeline.",
  stack: [
    "Python",
    "OWASP ZAP",
    "Selenium or Playwright",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "zap-automation",
      text: "Configure OWASP ZAP daemon and spider scripts to automate active and passive security scanning.",
      check: { type: "file", glob: "**/zap/*.py" },
    },
    {
      id: "auth-scan-context",
      text: "Script authenticated scanning logic handling JWT bearer tokens or session cookies within ZAP automation.",
    },
    {
      id: "injection-tests",
      text: "Write custom automated test scripts verifying resilience against SQL injection, XSS, and command execution.",
      check: { type: "file", glob: "**/tests/test_injection*.py" },
    },
    {
      id: "authz-bola-tests",
      text: "Implement security regression tests validating Broken Object Level Authorization (BOLA) and privilege escalation.",
      check: { type: "file", glob: "**/tests/test_authorization*.py" },
    },
    {
      id: "threat-model",
      text: "Produce a STRIDE threat model document mapping data flow diagrams, trust boundaries, and mitigation controls.",
      check: { type: "file", glob: "**/docs/threat-model.md" },
    },
    {
      id: "security-report",
      text: "Generate structured JSON/HTML vulnerability assessment reports categorizing findings by OWASP risk scores.",
      check: { type: "file", glob: "**/reports/*.{json,html}" },
    },
    {
      id: "zap-proxy-fixture",
      text: "Route browser test automation traffic through ZAP local proxy to capture hidden API endpoints during execution.",
    },
    {
      id: "rate-limit-check",
      text: "Include automated scripts testing endpoint throttling, brute-force protections, and rate-limit bypasses.",
    },
    {
      id: "readme",
      text: "README covers local target setup, ZAP context configuration, security scan triggers, and vulnerability reporting.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "docker",
      text: "Containerize the security scanner and target application environment using Docker Compose.",
      check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions pipeline running headless DAST scans and breaking builds on high-severity vulnerabilities.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "env-example",
      text: "Provide an environment variable configuration file template masking sensitive API credentials and scanning keys.",
      check: { type: "file", glob: ".env.example" },
    },
  ],

  rubric: [
    {
      id: "dast-execution",
      name: "DAST & ZAP Integration",
      weight: 25,
      layerId: "security-qa-3",
      description:
        "Effective automation of OWASP ZAP scanning, including authentication contexts and session token management.",
    },
    {
      id: "injection-auth",
      name: "Vulnerability Test Design",
      weight: 20,
      layerId: "security-qa-4",
      description:
        "Depth of custom regression tests covering SQLi, XSS, CSRF, and authorization escalation vectors.",
    },
    {
      id: "api-security",
      name: "API Security & Authorization",
      weight: 15,
      layerId: "security-qa-7",
      description:
        "Thorough validation of OWASP API security issues such as BOLA, mass assignment, and rate limiting.",
    },
    {
      id: "threat-modeling",
      name: "Threat Modeling & Risk",
      weight: 15,
      layerId: "security-qa-9",
      description:
        "Clarity and detail of the STRIDE threat model, risk scoring, and security control mapping.",
    },
    {
      id: "ci-security-gate",
      name: "CI/CD Pipeline Security Gate",
      weight: 15,
      layerId: "security-qa-10",
      description:
        "Integration of containerized DAST runs into CI with automated build failure thresholds on findings.",
    },
    {
      id: "docs-reporting",
      name: "Documentation & Findings",
      weight: 10,
      layerId: "security-qa-8",
      description:
        "Clear vulnerability reporting, reproducible proof-of-concepts, and remediation guidelines.",
    },
  ],

  twistPool: [
    {
      id: "jwt-fuzzing",
      text: "Incorporate automated JWT security checks testing algorithm substitution (none-alg), signature stripping, and expired tokens.",
    },
    {
      id: "cors-csrf-audit",
      text: "Add dedicated automated verification of CORS wildcards, credentialed origin headers, and anti-CSRF token enforcement.",
    },
    {
      id: "security-headers-gate",
      text: "Build an automated audit module validating HTTP security headers (CSP, HSTS, X-Frame-Options) across all routes.",
    },
    {
      id: "dependency-sast-mix",
      text: "Integrate static dependency vulnerability scanning alongside DAST execution in the CI pipeline.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
