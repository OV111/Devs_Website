/**
 * Capstone brief — forensics-analyst track (forensics-analyst), v1.
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
  trackId: "forensics-analyst",
  categoryId: "cybersecurity",
  slug: "forensics-analyst-dfir-triage",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Digital Forensics Triage & Memory Analysis Pipeline",
  summary:
    "Build a Python forensic triage toolkit that parses NTFS $MFT artifacts, extracts Windows Registry activity, " +
    "automates Volatility 3 memory analysis, generates timelines, and maintains verifiable evidentiary chain of custody.",
  stack: ["Python", "Volatility 3", "pytsk3", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "mft-parser",
      text: "Parse NTFS $MFT files to extract MACB timestamps, file metadata, and detect timestomping anomalies.",
    },
    {
      id: "registry-artifacts",
      text: "Extract user execution and persistence evidence from Windows Registry hives (UserAssist, Run keys, ShimCache, Amcache).",
    },
    {
      id: "volatility-automation",
      text: "Automate Volatility 3 execution to analyze RAM dumps for process injection, hidden DLLs, and rogue network sockets.",
    },
    {
      id: "timeline-generator",
      text: "Aggregate multi-source forensic artifacts into a consolidated, normalized super-timeline (CSV/JSON).",
    },
    {
      id: "chain-of-custody",
      text: "Maintain verifiable evidentiary logs recording file acquisition hashes (SHA-256), examiner notes, and cryptographic integrity verifications.",
    },
    {
      id: "pcap-carver",
      text: "Extract transmitted files and HTTP/DNS network session artifacts from associated packet captures (PCAP).",
    },
    {
      id: "forensic-report",
      text: "Generate a comprehensive executive and technical forensic investigation report based on processed evidence.",
      check: { type: "file", glob: ["docs/**/*.md", "**/forensic-report.md"] },
    },
    {
      id: "tests",
      text: "Unit tests verify $MFT record parsing, Registry key extraction, and super-timeline sorting algorithms.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details installation, evidence acquisition commands, forensic soundness practices, and test execution.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Pipeline environment with required forensic libraries and Volatility 3 packaged via Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI runs code linters and unit tests on mock artifact files.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No sensitive case data, real PII, or internal credentials committed to repository.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "file-system-forensics",
      name: "File System & Artifact Parsing",
      weight: 25,
      layerId: "forensics-analyst-3",
      description:
        "Accuracy of NTFS $MFT, Prefetch, and Registry artifact extraction and timestomping detection.",
    },
    {
      id: "memory-forensics",
      name: "Memory Analysis & Volatility",
      weight: 20,
      layerId: "forensics-analyst-5",
      description:
        "Effective automated memory investigation detecting process injection, rootkits, and network artifacts.",
    },
    {
      id: "timeline-reconstruction",
      name: "Super-Timeline Reconstruction",
      weight: 15,
      layerId: "forensics-analyst-4",
      description:
        "Fidelity, normalization, and chronological accuracy of multi-source forensic timeline aggregation.",
    },
    {
      id: "forensic-integrity",
      name: "Chain of Custody & Integrity",
      weight: 15,
      layerId: "forensics-analyst-1",
      description:
        "Strict preservation of cryptographic verification hashes and formal evidence handling procedures.",
    },
    {
      id: "automation-testing",
      name: "Code Quality & Test Verification",
      weight: 15,
      layerId: "forensics-analyst-10",
      description:
        "Modular Python design, graceful handling of corrupt artifacts, and robust test coverage.",
    },
    {
      id: "forensic-reporting",
      name: "Documentation & Reporting",
      weight: 10,
      layerId: "forensics-analyst-9",
      description:
        "Professional technical report quality, actionable conclusions, and reproducible analysis setup.",
    },
  ],

  twistPool: [
    {
      id: "browser-history-forensics",
      text: "Add a dedicated parser for Chrome/Firefox SQLite databases to extract web history, downloads, and search queries into the timeline.",
    },
    {
      id: "usn-journal-carving",
      text: "Implement parsing of the NTFS $UsnJrnl ($J data stream) to track deleted files and file system changes missed by$MFT alone.",
    },
    {
      id: "yara-memory-scanner",
      text: "Integrate custom YARA signature scanning directly across unallocated memory spaces and extracted process memory dumps.",
    },
    {
      id: "velociraptor-artifact-exporter",
      text: "Write custom Velociraptor VQL artifact definitions to streamline remote triage collection feeding into this pipeline.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
