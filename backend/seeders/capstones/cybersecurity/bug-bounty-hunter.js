/**
 * Capstone brief — bug-bounty-hunter track (bug-bounty-hunter), v1.
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
  trackId: "bug-bounty-hunter",
  categoryId: "cybersecurity",
  slug: "bug-bounty-hunter-recon-automation",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Bug Bounty Recon Pipeline & Vulnerability Scanner",
  summary:
    "Build a Python security reconnaissance framework that automates passive/active subdomain enumeration, " +
    "tech stack fingerprinting, custom Nuclei template checks, and generates triage-ready vulnerability reports.",
  stack: ["Python", "Nuclei", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "subdomain-enum",
      text: "Integrate multiple passive and active subdomain enumeration sources with automatic deduplication and wildcard filtering.",
    },
    {
      id: "http-probing",
      text: "Probe discovered hosts to capture HTTP response headers, status codes, page titles, and web technology fingerprints.",
    },
    {
      id: "nuclei-integration",
      text: "Integrate Nuclei engine execution supporting targeted custom YAML vulnerability template scanning within defined scopes.",
    },
    {
      id: "scope-enforcement",
      text: "Implement strict IP/CIDR and domain regex scope validation to prevent scanning out-of-scope targets.",
    },
    {
      id: "idor-api-fuzzer",
      text: "Build an API parameter fuzzer that detects Insecure Direct Object References (IDOR) and broken authorization flaws.",
    },
    {
      id: "vulnerability-reports",
      text: "Output findings as structured Markdown bug bounty reports complete with reproduction steps, CVSS v3 score, and curl POCs.",
      check: { type: "file", glob: ["docs/**/*.md", "reports/*.md"] },
    },
    {
      id: "custom-nuclei-templates",
      text: "Include custom Nuclei YAML templates targeting specific misconfigurations and exposed sensitive endpoints.",
      check: { type: "file", glob: "**/*.yaml" },
    },
    {
      id: "tests",
      text: "Unit tests verify scope matching, subdomain parser logic, and report formatting utilities.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README outlines installation, safe harbor rules, program scope configuration, and example CLI runs.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Containerize the scanner tool and dependencies with a production Dockerfile.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "CI pipeline runs code linting, unit tests, and validates custom Nuclei templates.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No active bug bounty program target credentials or private tokens are committed.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "recon-methodology",
      name: "Reconnaissance & Surface Mapping",
      weight: 25,
      layerId: "bug-bounty-hunter-2",
      description:
        "Efficiency and thoroughness of subdomain discovery, probing, and tech stack fingerprinting.",
    },
    {
      id: "vuln-discovery",
      name: "Vulnerability Identification",
      weight: 20,
      layerId: "bug-bounty-hunter-5",
      description:
        "Logic and accuracy in identifying authorization flaws (IDOR), API issues, and server misconfigurations.",
    },
    {
      id: "template-engineering",
      name: "Custom Scanning & Fuzzing",
      weight: 15,
      layerId: "bug-bounty-hunter-6",
      description:
        "Quality, precision, and low false-positive design of custom Nuclei templates and parameter fuzzers.",
    },
    {
      id: "scope-safety",
      name: "Scope Control & Rules of Engagement",
      weight: 15,
      layerId: "bug-bounty-hunter-1",
      description:
        "Strict enforcement of authorized target boundaries and safe scanning practices.",
    },
    {
      id: "code-testing",
      name: "Code Quality & Test Coverage",
      weight: 15,
      layerId: "bug-bounty-hunter-10",
      description:
        "Clean Python structure, reliable CLI interface, error handling, and robust unit tests.",
    },
    {
      id: "report-quality",
      name: "Report Quality & Documentation",
      weight: 10,
      layerId: "bug-bounty-hunter-10",
      description:
        "High-impact Markdown bug reports with clear reproduction steps, remediation guidance, and setup docs.",
    },
  ],

  twistPool: [
    {
      id: "graphql-introspection-fuzzer",
      text: "Add a GraphQL scanner module that tests endpoints for enabled introspection, query depth limits, and injection vectors.",
    },
    {
      id: "slack-discord-alerts",
      text: "Implement webhook notifications sending real-time alerts to Slack/Discord when new subdomains or high-severity vulnerabilities are found.",
    },
    {
      id: "js-secret-miner",
      text: "Build an automated JavaScript asset analyzer that downloads client-side JS files and extracts hidden API keys and endpoint paths.",
    },
    {
      id: "s3-bucket-checker",
      text: "Add a cloud storage checker that identifies public AWS S3 buckets or Azure blobs linked to discovered subdomains.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
