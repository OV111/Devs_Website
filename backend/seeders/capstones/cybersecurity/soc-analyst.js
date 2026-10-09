/**
 * Capstone brief — soc-analyst track (soc-analyst), v1.
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
  trackId: "soc-analyst",
  categoryId: "cybersecurity",
  slug: "soc-analyst-detection-triage-siem",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "SOC Incident Triage Pipeline & SIEM Detection Suite",
  summary:
    "Build a automated SOC incident triage platform that ingests multi-source logs, parses intrusion alerts, " +
    "evaluates incident severity using MITRE ATT&CK context, and automates initial response playbooks.",
  stack: [
    "Python",
    "Elasticsearch or OpenSearch",
    "Suricata",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "multi-source-ingestion",
      text: "Ingest and normalize logs from multiple sources (Windows Event logs, Suricata IDS alerts, Apache access logs, Linux auth.log).",
    },
    {
      id: "alert-triage-engine",
      text: "Implement an automated triage engine scoring alerts based on asset criticality, indicator confidence, and threat severity.",
    },
    {
      id: "suricata-rule-suite",
      text: "Provide custom Suricata IDS rules detecting web attacks, reverse shell activity, and malicious user agents.",
      check: { type: "file", glob: "**/*.rules" },
    },
    {
      id: "soar-playbook-automation",
      text: "Build automated Python response playbooks (e.g., auto-isolate IP, revoke compromised user token, generate ticket summary).",
    },
    {
      id: "dashboards-queries",
      text: "Provide structured SIEM search queries and dashboard definitions for top incident indicators and log volume spikes.",
      check: { type: "file", glob: ["**/*.json", "queries/*.spl"] },
    },
    {
      id: "ir-playbook-docs",
      text: "Document formal Incident Response (IR) playbooks covering containment, eradication, and post-incident review procedures.",
      check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] },
    },
    {
      id: "tests",
      text: "Unit tests verify log normalization schemas, alert scoring formulas, and playbook execution triggers.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details architecture setup, log replay instructions, alert rule testing, and playbook execution.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Deploy log collector, storage engine, and triage backend via Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI runs linter checks, validates Suricata rule syntax, and executes python unit tests.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No live production network credentials, private keys, or internal IP data committed.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "incident-triage",
      name: "Incident Triage & Classification",
      weight: 25,
      layerId: "soc-analyst-7",
      description:
        "Precision of alert scoring algorithms, triage logic, and escalation criteria.",
    },
    {
      id: "log-parsing",
      name: "Log Analysis & SIEM Integration",
      weight: 20,
      layerId: "soc-analyst-3",
      description:
        "Normalization and parsing fidelity across heterogeneous log sources.",
    },
    {
      id: "ids-detection",
      name: "IDS Rule Development",
      weight: 15,
      layerId: "soc-analyst-5",
      description:
        "Quality, accuracy, and performance of custom Suricata detection rules.",
    },
    {
      id: "soar-automation",
      name: "Response Automation & Playbooks",
      weight: 15,
      layerId: "soc-analyst-10",
      description:
        "Effectiveness and safety of automated response scripts and playbook orchestration.",
    },
    {
      id: "code-and-tests",
      name: "Code Quality & Test Isolation",
      weight: 15,
      layerId: "soc-analyst-4",
      description:
        "Modular Python code structure, clear data schemas, and comprehensive test coverage.",
    },
    {
      id: "documentation-clarity",
      name: "Documentation & Incident Playbooks",
      weight: 10,
      layerId: "soc-analyst-7",
      description:
        "Quality of IR documentation, setup instructions, and incident walkthrough guides.",
    },
  ],

  twistPool: [
    {
      id: "virustotal-enrichment",
      text: "Add an automated IOC enrichment module querying VirusTotal API for file hashes and extracted IP addresses.",
    },
    {
      id: "misp-threat-intel-sync",
      text: "Integrate MISP platform synchronization to pull fresh threat indicators directly into the alert scoring pipeline.",
    },
    {
      id: "telegram-slack-bot",
      text: "Implement an interactive alert notification bot (Slack or Telegram) allowing analysts to trigger containment actions directly.",
    },
    {
      id: "forensic-pcap-extractor",
      text: "Automate PCAP packet extraction around Suricata alert timestamps to attach relevant raw network streams to incidents.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
