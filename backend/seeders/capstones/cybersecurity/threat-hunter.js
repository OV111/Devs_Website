/**
 * Capstone brief — threat-hunter track (threat-hunter), v1.
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
  trackId: "threat-hunter",
  categoryId: "cybersecurity",
  slug: "threat-hunter-log-hunting-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Threat Hunting Engine & Sigma Detection Suite",
  summary:
    "Build a Python threat hunting platform that ingests Windows Sysmon, EVTX, and proxy logs, detects anomalous behaviors " +
    "and MITRE ATT&CK TTPs, translates custom Sigma rules into executable queries, and correlates threat feeds.",
  stack: [
    "Python",
    "Elasticsearch or DuckDB",
    "Sigma",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "log-ingestion",
      text: "Parse Windows Sysmon Event Logs (Events 1, 3, 7, 8, 10, 11) and web proxy logs into normalized security events.",
    },
    {
      id: "sigma-converter",
      text: "Build a converter that compiles valid Sigma rules into executable SQL or Elasticsearch/DuckDB queries.",
    },
    {
      id: "mitre-mapping",
      text: "Tag every rule detection with corresponding MITRE ATT&CK tactics, techniques, and sub-techniques.",
    },
    {
      id: "anomaly-analytics",
      text: "Implement statistical outlier detection (e.g., rare process execution paths, high entropy domain requests, beaconing intervals).",
    },
    {
      id: "threat-intel-enrichment",
      text: "Enrich extracted network indicators against STIX/TAXII threat feeds or local IOC blocklists.",
    },
    {
      id: "hunt-playbooks",
      text: "Provide structured threat hunt playbooks documenting hypothesis, logs required, ATT&CK technique, and verification steps.",
      check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] },
    },
    {
      id: "sigma-rule-suite",
      text: "Include a curated suite of custom Sigma rules targeting Living-off-the-Land binaries (LotL) and process injection.",
      check: { type: "file", glob: "**/*.yml" },
    },
    {
      id: "tests",
      text: "Unit tests verify log parsing accuracy, Sigma conversion logic, and anomaly detection statistical outputs.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README documents hunt setup, architecture, test log execution walk-through, and detection verification.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Environment, log store, and hunt engine run via Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI workflow executes unit tests and validates Sigma rule syntax on every push.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No API keys, credentials, or sensitive network dumps are committed in git history.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "mitre-hunting",
      name: "ATT&CK Mapping & Hunt Analytics",
      weight: 25,
      layerId: "threat-hunter-2",
      description:
        "Precision of behavior hypotheses, statistical anomaly models, and ATT&CK matrix technique coverage.",
    },
    {
      id: "sigma-engineering",
      name: "Sigma Rule Engineering",
      weight: 20,
      layerId: "threat-hunter-8",
      description:
        "Correctness of custom Sigma rules, query conversion fidelity, and low false-positive rates.",
    },
    {
      id: "log-telemetry",
      name: "Log Telemetry & Event Parsing",
      weight: 15,
      layerId: "threat-hunter-3",
      description:
        "Comprehensive parsing of Windows Sysmon, Event Logs, and network proxy logs.",
    },
    {
      id: "threat-intel-integration",
      name: "Threat Intelligence Correlation",
      weight: 15,
      layerId: "threat-hunter-7",
      description:
        "Effective enrichment of hunt findings using STIX/TAXII threat intelligence indicators.",
    },
    {
      id: "code-and-testing",
      name: "Code Quality & Test Isolation",
      weight: 15,
      layerId: "threat-hunter-4",
      description:
        "Modular Python pipeline architecture, clear abstractions, and rigorous unit testing.",
    },
    {
      id: "docs-playbooks",
      name: "Playbooks & Documentation",
      weight: 10,
      layerId: "threat-hunter-10",
      description:
        "Actionable hunt playbooks, clear step-by-step setup guide, and reproducible test cases.",
    },
  ],

  twistPool: [
    {
      id: "ja3-fingerprinting",
      text: "Add a TLS network log analyzer that extracts JA3/JA3S client fingerprints to identify unauthorized C2 communication frameworks.",
    },
    {
      id: "atomic-red-team-runner",
      text: "Integrate an automated test runner executing Atomic Red Team telemetry simulation scripts to validate rule coverage.",
    },
    {
      id: "powershell-deobfuscation",
      text: "Implement automated AST parsing and string deobfuscation for logged PowerShell Script Block events (Event ID 4104).",
    },
    {
      id: "attack-navigator-export",
      text: "Generate a custom MITRE ATT&CK Navigator JSON layer file dynamically reflecting current hunt rule detection coverage.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
