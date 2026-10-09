/**
 * Capstone brief — blue-team track (blue-team), v1.
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
  trackId: "blue-team",
  categoryId: "cybersecurity",
  slug: "blue-team-defense-hardening-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Blue Team Defense & Hardening Orchestration Engine",
  summary:
    "Build an automated defensive security framework featuring infrastructure CIS benchmark hardening scripts, " +
    "Sysmon event telemetry pipelines, custom Sigma detection rules, and an automated incident containment engine.",
  stack: [
    "Python",
    "Bash or PowerShell",
    "Elasticsearch or OpenSearch",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "hardening-automation",
      text: "Develop system hardening scripts enforcing CIS Benchmark standards on Linux/Windows hosts (disabling legacy protocols, configuring firewall rules).",
    },
    {
      id: "sysmon-telemetry",
      text: "Provide optimized Sysmon XML configuration files capturing process creation, network connections, and raw disk access.",
      check: { type: "file", glob: "**/*.xml" },
    },
    {
      id: "detection-engineering",
      text: "Write custom Sigma detection rules targeting privilege escalation, persistence, and lateral movement techniques.",
      check: { type: "file", glob: "**/*.yml" },
    },
    {
      id: "containment-automation",
      text: "Build automated response scripts capable of isolating compromised endpoints, terminating rogue processes, and blocking IPs.",
    },
    {
      id: "network-defense-suricata",
      text: "Incorporate Suricata network IDS rules targeting Command & Control beaconing and exploit payloads.",
      check: { type: "file", glob: "**/*.rules" },
    },
    {
      id: "security-baseline-audit",
      text: "Build an automated security audit script evaluating host posture against baseline security standards and producing compliance pass/fail scores.",
    },
    {
      id: "ir-playbooks",
      text: "Provide documented Incident Response playbooks outlining containment strategies, evidence acquisition, and recovery.",
      check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] },
    },
    {
      id: "tests",
      text: "Unit tests verify security rule syntax, audit script execution logic, and automated containment parsers.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details host hardening deployment, SIEM telemetry integration, and incident simulation procedures.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Deploy defensive SIEM storage, log ingestion pipeline, and audit runner using Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI workflow executes static code analysis, validates Sigma/Suricata rule syntax, and runs unit tests.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No sensitive network credentials or internal infrastructure keys are committed.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "hardening-quality",
      name: "System Hardening & Configuration",
      weight: 25,
      layerId: "blue-team-2",
      description:
        "Thoroughness and effectiveness of CIS benchmark hardening scripts and OS security configurations.",
    },
    {
      id: "detection-engineering",
      name: "Detection Engineering & Telemetry",
      weight: 20,
      layerId: "blue-team-9",
      description:
        "Precision of Sysmon profiles, custom Sigma rules, and Suricata IDS network signatures.",
    },
    {
      id: "incident-containment",
      name: "Incident Containment & Response",
      weight: 15,
      layerId: "blue-team-6",
      description:
        "Reliability, speed, and safety of automated endpoint containment and network isolation scripts.",
    },
    {
      id: "audit-automation",
      name: "Audit & Baseline Compliance",
      weight: 15,
      layerId: "blue-team-2",
      description:
        "Accuracy of baseline security posture evaluation scripts and structured compliance scoring.",
    },
    {
      id: "code-testing",
      name: "Code Quality & Test Isolation",
      weight: 15,
      layerId: "blue-team-3",
      description:
        "Modular Python/shell script engineering, robust error handling, and comprehensive test suites.",
    },
    {
      id: "playbook-docs",
      name: "Playbooks & Program Maturity",
      weight: 10,
      layerId: "blue-team-10",
      description:
        "Quality of incident response playbooks, clear setup instructions, and architecture documentation.",
    },
  ],

  twistPool: [
    {
      id: "soar-webhook-integration",
      text: "Build a SOAR webhook integration that receives alert triggers from SIEM and automatically executes endpoint network isolation.",
    },
    {
      id: "yara-memory-scanner-agent",
      text: "Deploy an automated memory scanner agent executing custom YARA rules periodically to detect volatile fileless malware.",
    },
    {
      id: "zeek-network-fingerprinting",
      text: "Integrate Zeek log parsing to extract HTTP headers and DNS queries for network baselining and anomaly detection.",
    },
    {
      id: "purple-team-validation-script",
      text: "Provide an automated purple team validation script that triggers benign attack telemetry to test rule efficacy.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
