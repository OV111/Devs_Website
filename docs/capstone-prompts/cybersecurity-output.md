/**
 * Capstone brief — Malware Analyst track (malware-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "malware-analyst",
  categoryId: "cybersecurity",
  slug: "malware-analyst-triager-toolkit",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated PE Malware Triage and YARA Rule Engine",
  summary:
    "Build a production-ready Python command-line triage pipeline that inspects suspicious PE binaries, " +
    "parses structural anomalies, extracts IOCs, matches YARA signatures, and outputs actionable threat reports.",
  stack: ["Python", "pefile", "yara-python", "GitHub Actions"],

  requirements: [
    { id: "pe-parsing", text: "Parse PE headers, sections, export/import tables, and compile timestamps using pefile without crashing on malformed inputs." },
    { id: "string-ioc-extraction", text: "Extract printable ASCII/Unicode strings and use regex to identify network IOCs (IPs, domains, URLs) and crypto wallet addresses." },
    { id: "yara-engine", text: "Scan samples against a structured directory of custom YARA rules and output matched rule tags, meta fields, and match strings." },
    { id: "packer-detection", text: "Detect packing indicators by calculating section entropy and flags for known packer signatures or high-entropy anomalies." },
    { id: "json-report", text: "Generate structured JSON triage reports containing metadata, hashes (MD5, SHA256, ssdeep), PE features, and matched IOCs." },
    { id: "cli-interface", text: "Provide a CLI interface supporting single-file scan and directory recursive batch triage with configurable output paths." },
    { id: "ghidra-script", text: "Include a Ghidra Python analysis script that auto-annotates identified string references and imported APIs in a sample.", check: { type: "file", glob: "**/*.py" } },
    { id: "tests", text: "Unit tests verify PE header extraction, entropy calculations, and YARA match parsers on benign mock/sample binaries.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "yara-rules", text: "Provide a curated set of custom YARA rules covering persistence, injection APIs, and anti-analysis checks.", check: { type: "file", glob: "**/*.yar" } },
    { id: "readme", text: "README documents environment setup, usage, sample analysis walk-through, and lab safety recommendations.", check: CHECKS.readme },
    { id: "ci", text: "A CI workflow runs static code checks and unit tests on every commit.", check: CHECKS.ci },
    { id: "no-secrets", text: "No real malicious binaries, live API keys, or secrets are stored in the git history.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "pe-analysis", name: "PE & Static Analysis", weight: 25, layerId: "malware-analyst-2", description: "Accurate extraction of PE headers, section entropy calculation, and robust string/IOC parsing." },
    { id: "yara-crafting", name: "YARA Rule Engineering", weight: 20, layerId: "malware-analyst-2", description: "Quality, specificity, and condition structure of custom YARA rules to minimize false positives." },
    { id: "automation-scripting", name: "Automation & Scripting", weight: 15, layerId: "malware-analyst-7", description: "Effective use of pefile and Ghidra Python automation to streamline triage workflows." },
    { id: "anti-analysis-detection", name: "Evasion & Anomaly Identification", weight: 15, layerId: "malware-analyst-5", description: "Identification of debugger detection APIs, packing signatures, and suspicious section attributes." },
    { id: "code-quality", name: "Code Structure & Reliability", weight: 15, layerId: "malware-analyst-7", description: "Graceful error handling for corrupted binaries, modular code design, and test coverage." },
    { id: "documentation-reporting", name: "Reporting & Operability", weight: 10, layerId: "malware-analyst-10", description: "Clear README, structured JSON output schemas, and reproducible analysis lab guidance." },
  ],

  twistPool: [
    { id: "capesandbox-integration", text: "Add an optional submission module that posts samples to a CAPE Sandbox API and appends dynamic execution tags to the final report." },
    { id: "imphash-ssdeep", text: "Calculate and compare Import Hashes (imphash) and fuzzy hashes (ssdeep) across a directory of samples to cluster related malware variants." },
    { id: "deobfuscation-decoder", text: "Implement automated decoding routines for common obfuscation patterns like XOR encoding and Base64 string blobs embedded in PE sections." },
    { id: "misp-export", text: "Add an export flag to convert extracted triage findings into a valid MISP event JSON payload for threat intelligence sharing." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — GRC Analyst track (grc-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "grc-analyst",
  categoryId: "cybersecurity",
  slug: "grc-analyst-compliance-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise GRC Compliance & Unified Risk Management Engine",
  summary:
    "Build an automated GRC audit management platform and control mapping engine that ingests evidence, " +
    "evaluates compliance against NIST CSF, ISO 27001, and SOC 2, and maintains an interactive risk register.",
  stack: ["Node.js", "Express", "PostgreSQL", "Docker", "GitHub Actions"],

  requirements: [
    { id: "control-mapping", text: "Implement a cross-framework mapping table linking NIST CSF controls to ISO 27001 Annex A and SOC 2 Trust Services Criteria." },
    { id: "risk-register", text: "Provide full CRUD for risk items including inherent/residual scoring (likelihood x impact), threat vectors, and risk owners." },
    { id: "vendor-tiering", text: "Assess third-party vendors via customizable questionnaires, mapping score responses to inherent risk tiers (High, Medium, Low)." },
    { id: "policy-lifecycle", text: "Implement policy document versioning, approval workflows, exception tracking with expiration dates, and owner assignment." },
    { id: "audit-evidence", text: "Support evidence collection tracking by linking operational artifacts to specific security controls with status indicators." },
    { id: "gap-assessment-api", text: "Provide REST API endpoints to generate compliance maturity gap scores per framework category." },
    { id: "tests", text: "Integration tests cover control mapping lookups, risk score calculations, and vendor tiering logic.", check: CHECKS.jsTests },
    { id: "readme", text: "README details framework scope, API setup, database migrations, and a sample risk assessment walkthrough.", check: CHECKS.readme },
    { id: "docker", text: "API backend and PostgreSQL database run seamlessly via Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow executes test suites and linting on every push.", check: CHECKS.ci },
    { id: "env-example", text: "Environment setup uses an .env.example file with no hardcoded credentials.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "framework-mastery", name: "Framework Alignment & Mapping", weight: 25, layerId: "grc-analyst-2", description: "Accuracy and completeness of NIST CSF, ISO 27001, and SOC 2 control mappings." },
    { id: "risk-scoring", name: "Risk Management Methodology", weight: 20, layerId: "grc-analyst-5", description: "Rigorous implementation of risk scoring, threshold definitions, and residual risk evaluation." },
    { id: "policy-governance", name: "Governance & Vendor Workflow", weight: 15, layerId: "grc-analyst-7", description: "Effective design of third-party risk classification and policy exception lifecycle management." },
    { id: "architecture-design", name: "System Structure & Data Design", weight: 15, layerId: "grc-analyst-10", description: "Clean API separation, normalized relational models, and structured audit trail schemas." },
    { id: "testing-reliability", name: "Validation & Test Coverage", weight: 15, layerId: "grc-analyst-8", description: "Comprehensive test suite verifying risk calculations, control mappings, and access controls." },
    { id: "operability-documentation", name: "Documentation & Deployment", weight: 10, layerId: "grc-analyst-8", description: "Clear deployment instructions, sample evaluation datasets, and actionable operational guides." },
  ],

  twistPool: [
    { id: "fair-quantitative-risk", text: "Integrate a FAIR (Factor Analysis of Information Risk) quantitative simulation module estimating loss event frequency and magnitude." },
    { id: "soc2-type2-evidence-scheduler", text: "Add automated evidence renewal tracking that flags stale control evidence older than 90 days for SOC 2 Type II audit readiness." },
    { id: "gdpr-ropa-generator", text: "Implement a Data Privacy module to construct Records of Processing Activities (RoPA) and flag high-risk activities requiring a DPIA." },
    { id: "jira-remediation-sync", text: "Integrate a webhook notification service that auto-creates remediation action items in Jira/GitHub Issues when risk scores exceed thresholds." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Security Architect track (security-architect), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the rubric layer that teaches it, for weak-spot tracking.
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
    { id: "threat-model-spec", text: "Provide a machine-readable JSON/YAML STRIDE threat model document specifying components, trust boundaries, and mitigations." },
    { id: "terraform-architecture", text: "Define modular Terraform configurations implementing 3-tier network segmentation (Public, App, Database) with isolated security groups.", check: { type: "file", glob: "**/*.tf" } },
    { id: "iam-least-privilege", text: "Specify strict RBAC/ABAC role policies in Terraform with explicitly scoped permissions enforcing least privilege." },
    { id: "vault-secrets-engine", text: "Integrate HashiCorp Vault for dynamic database credentials and transit engine data encryption at rest." },
    { id: "zero-trust-proxy", text: "Implement an architectural policy enforcement point (PEP) validating device posture headers and OIDC tokens per request." },
    { id: "automated-threat-parser", text: "Build a Python utility that parses the threat model YAML file and validates that every high risk has a mapped security control." },
    { id: "tests", text: "Automated tests validate Terraform syntax/policy compliance and threat parser execution.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "architecture-diagram", text: "Provide comprehensive architectural Data Flow Diagrams (DFDs) illustrating trust boundaries and security controls.", check: { type: "file", glob: ["docs/**/*.md", "**/architecture*.md"] } },
    { id: "readme", text: "README details architecture design principles, Vault setup, Terraform deployment, and threat model methodology.", check: CHECKS.readme },
    { id: "docker", text: "Run local HashiCorp Vault and application simulation environment using Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI pipeline runs terraform validate/fmt and threat model validation scripts on every pull request.", check: CHECKS.ci },
    { id: "no-secrets", text: "No hardcoded private keys, certificates, or tokens are committed in git history.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "architecture-design", name: "Zero Trust Architecture Design", weight: 25, layerId: "security-architect-6", description: "Depth of Zero Trust implementation, network segmentation, and strict trust boundary enforcement." },
    { id: "threat-modeling", name: "STRIDE Threat Modeling Quality", weight: 20, layerId: "security-architect-2", description: "Completeness of DFDs, threat identification rigor, and accuracy of control mappings." },
    { id: "secrets-crypto", name: "Crypto & Secrets Management", weight: 15, layerId: "security-architect-8", description: "Proper use of HashiCorp Vault, dynamic secrets rotation, and TLS certificate lifecycle management." },
    { id: "iac-guardrails", name: "Infrastructure as Code Security", weight: 15, layerId: "security-architect-5", description: "Quality, modularity, and security posture of Terraform scripts and cloud security controls." },
    { id: "verification-automation", name: "Validation & Automated Checks", weight: 15, layerId: "security-architect-7", description: "Effective automated threat parser and Infrastructure as Code security verification tests." },
    { id: "documentation-clarity", name: "Documentation & Diagrams", weight: 10, layerId: "security-architect-1", description: "Clear architectural design rationale, comprehensive DFD visuals, and complete setup instructions." },
  ],

  twistPool: [
    { id: "pki-mTLS-enforcement", text: "Implement automated mTLS certificate issue and enforcement between microservices using a Vault-backed private CA." },
    { id: "opa-policy-as-code", text: "Write Open Policy Agent (OPA) / Rego rules to evaluate Terraform plan outputs against organizational compliance standards in CI." },
    { id: "aws-security-hub-exporter", text: "Construct a security telemetry ingestion module that maps architecture state findings to AWS Security Finding Format (ASFF)." },
    { id: "break-glass-approval", text: "Architect a emergency temporary privilege elevation mechanism ('break-glass') with mandatory audit logging and time-based auto-revocation." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — Threat Hunter track (threat-hunter), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Python", "Elasticsearch or DuckDB", "Sigma", "Docker", "GitHub Actions"],

  requirements: [
    { id: "log-ingestion", text: "Parse Windows Sysmon Event Logs (Events 1, 3, 7, 8, 10, 11) and web proxy logs into normalized security events." },
    { id: "sigma-converter", text: "Build a converter that compiles valid Sigma rules into executable SQL or Elasticsearch/DuckDB queries." },
    { id: "mitre-mapping", text: "Tag every rule detection with corresponding MITRE ATT&CK tactics, techniques, and sub-techniques." },
    { id: "anomaly-analytics", text: "Implement statistical outlier detection (e.g., rare process execution paths, high entropy domain requests, beaconing intervals)." },
    { id: "threat-intel-enrichment", text: "Enrich extracted network indicators against STIX/TAXII threat feeds or local IOC blocklists." },
    { id: "hunt-playbooks", text: "Provide structured threat hunt playbooks documenting hypothesis, logs required, ATT&CK technique, and verification steps.", check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] } },
    { id: "sigma-rule-suite", text: "Include a curated suite of custom Sigma rules targeting Living-off-the-Land binaries (LotL) and process injection.", check: { type: "file", glob: "**/*.yml" } },
    { id: "tests", text: "Unit tests verify log parsing accuracy, Sigma conversion logic, and anomaly detection statistical outputs.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README documents hunt setup, architecture, test log execution walk-through, and detection verification.", check: CHECKS.readme },
    { id: "docker", text: "Environment, log store, and hunt engine run via Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow executes unit tests and validates Sigma rule syntax on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No API keys, credentials, or sensitive network dumps are committed in git history.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "mitre-hunting", name: "ATT&CK Mapping & Hunt Analytics", weight: 25, layerId: "threat-hunter-2", description: "Precision of behavior hypotheses, statistical anomaly models, and ATT&CK matrix technique coverage." },
    { id: "sigma-engineering", name: "Sigma Rule Engineering", weight: 20, layerId: "threat-hunter-8", description: "Correctness of custom Sigma rules, query conversion fidelity, and low false-positive rates." },
    { id: "log-telemetry", name: "Log Telemetry & Event Parsing", weight: 15, layerId: "threat-hunter-3", description: "Comprehensive parsing of Windows Sysmon, Event Logs, and network proxy logs." },
    { id: "threat-intel-integration", name: "Threat Intelligence Correlation", weight: 15, layerId: "threat-hunter-7", description: "Effective enrichment of hunt findings using STIX/TAXII threat intelligence indicators." },
    { id: "code-and-testing", name: "Code Quality & Test Isolation", weight: 15, layerId: "threat-hunter-4", description: "Modular Python pipeline architecture, clear abstractions, and rigorous unit testing." },
    { id: "docs-playbooks", name: "Playbooks & Documentation", weight: 10, layerId: "threat-hunter-10", description: "Actionable hunt playbooks, clear step-by-step setup guide, and reproducible test cases." },
  ],

  twistPool: [
    { id: "ja3-fingerprinting", text: "Add a TLS network log analyzer that extracts JA3/JA3S client fingerprints to identify unauthorized C2 communication frameworks." },
    { id: "atomic-red-team-runner", text: "Integrate an automated test runner executing Atomic Red Team telemetry simulation scripts to validate rule coverage." },
    { id: "powershell-deobfuscation", text: "Implement automated AST parsing and string deobfuscation for logged PowerShell Script Block events (Event ID 4104)." },
    { id: "attack-navigator-export", text: "Generate a custom MITRE ATT&CK Navigator JSON layer file dynamically reflecting current hunt rule detection coverage." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Digital Forensics Analyst track (forensics-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    "Build a Python forensic triage toolkit that parses NTFS \$MFT artifacts, extracts Windows Registry activity, " +
    "automates Volatility 3 memory analysis, generates timelines, and maintains verifiable evidentiary chain of custody.",
  stack: ["Python", "Volatility 3", "pytsk3", "Docker", "GitHub Actions"],

  requirements: [
    { id: "mft-parser", text: "Parse NTFS \$MFT files to extract MACB timestamps, file metadata, and detect timestomping anomalies." },
    { id: "registry-artifacts", text: "Extract user execution and persistence evidence from Windows Registry hives (UserAssist, Run keys, ShimCache, Amcache)." },
    { id: "volatility-automation", text: "Automate Volatility 3 execution to analyze RAM dumps for process injection, hidden DLLs, and rogue network sockets." },
    { id: "timeline-generator", text: "Aggregate multi-source forensic artifacts into a consolidated, normalized super-timeline (CSV/JSON)." },
    { id: "chain-of-custody", text: "Maintain verifiable evidentiary logs recording file acquisition hashes (SHA-256), examiner notes, and cryptographic integrity verifications." },
    { id: "pcap-carver", text: "Extract transmitted files and HTTP/DNS network session artifacts from associated packet captures (PCAP)." },
    { id: "forensic-report", text: "Generate a comprehensive executive and technical forensic investigation report based on processed evidence.", check: { type: "file", glob: ["docs/**/*.md", "**/forensic-report.md"] } },
    { id: "tests", text: "Unit tests verify \$MFT record parsing, Registry key extraction, and super-timeline sorting algorithms.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details installation, evidence acquisition commands, forensic soundness practices, and test execution.", check: CHECKS.readme },
    { id: "docker", text: "Pipeline environment with required forensic libraries and Volatility 3 packaged via Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI runs code linters and unit tests on mock artifact files.", check: CHECKS.ci },
    { id: "no-secrets", text: "No sensitive case data, real PII, or internal credentials committed to repository.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "file-system-forensics", name: "File System & Artifact Parsing", weight: 25, layerId: "forensics-analyst-3", description: "Accuracy of NTFS \$MFT, Prefetch, and Registry artifact extraction and timestomping detection." },
    { id: "memory-forensics", name: "Memory Analysis & Volatility", weight: 20, layerId: "forensics-analyst-5", description: "Effective automated memory investigation detecting process injection, rootkits, and network artifacts." },
    { id: "timeline-reconstruction", name: "Super-Timeline Reconstruction", weight: 15, layerId: "forensics-analyst-4", description: "Fidelity, normalization, and chronological accuracy of multi-source forensic timeline aggregation." },
    { id: "forensic-integrity", name: "Chain of Custody & Integrity", weight: 15, layerId: "forensics-analyst-1", description: "Strict preservation of cryptographic verification hashes and formal evidence handling procedures." },
    { id: "automation-testing", name: "Code Quality & Test Verification", weight: 15, layerId: "forensics-analyst-10", description: "Modular Python design, graceful handling of corrupt artifacts, and robust test coverage." },
    { id: "forensic-reporting", name: "Documentation & Reporting", weight: 10, layerId: "forensics-analyst-9", description: "Professional technical report quality, actionable conclusions, and reproducible analysis setup." },
  ],

  twistPool: [
    { id: "browser-history-forensics", text: "Add a dedicated parser for Chrome/Firefox SQLite databases to extract web history, downloads, and search queries into the timeline." },
    { id: "usn-journal-carving", text: "Implement parsing of the NTFS \$UsnJrnl ($J data stream) to track deleted files and file system changes missed by$MFT alone." },
    { id: "yara-memory-scanner", text: "Integrate custom YARA signature scanning directly across unallocated memory spaces and extracted process memory dumps." },
    { id: "velociraptor-artifact-exporter", text: "Write custom Velociraptor VQL artifact definitions to streamline remote triage collection feeding into this pipeline." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Bug Bounty Hunter track (bug-bounty-hunter), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "subdomain-enum", text: "Integrate multiple passive and active subdomain enumeration sources with automatic deduplication and wildcard filtering." },
    { id: "http-probing", text: "Probe discovered hosts to capture HTTP response headers, status codes, page titles, and web technology fingerprints." },
    { id: "nuclei-integration", text: "Integrate Nuclei engine execution supporting targeted custom YAML vulnerability template scanning within defined scopes." },
    { id: "scope-enforcement", text: "Implement strict IP/CIDR and domain regex scope validation to prevent scanning out-of-scope targets." },
    { id: "idor-api-fuzzer", text: "Build an API parameter fuzzer that detects Insecure Direct Object References (IDOR) and broken authorization flaws." },
    { id: "vulnerability-reports", text: "Output findings as structured Markdown bug bounty reports complete with reproduction steps, CVSS v3 score, and curl POCs.", check: { type: "file", glob: ["docs/**/*.md", "reports/*.md"] } },
    { id: "custom-nuclei-templates", text: "Include custom Nuclei YAML templates targeting specific misconfigurations and exposed sensitive endpoints.", check: { type: "file", glob: "**/*.yaml" } },
    { id: "tests", text: "Unit tests verify scope matching, subdomain parser logic, and report formatting utilities.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README outlines installation, safe harbor rules, program scope configuration, and example CLI runs.", check: CHECKS.readme },
    { id: "docker", text: "Containerize the scanner tool and dependencies with a production Dockerfile.", check: CHECKS.dockerfile },
    { id: "ci", text: "CI pipeline runs code linting, unit tests, and validates custom Nuclei templates.", check: CHECKS.ci },
    { id: "no-secrets", text: "No active bug bounty program target credentials or private tokens are committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "recon-methodology", name: "Reconnaissance & Surface Mapping", weight: 25, layerId: "bug-bounty-hunter-2", description: "Efficiency and thoroughness of subdomain discovery, probing, and tech stack fingerprinting." },
    { id: "vuln-discovery", name: "Vulnerability Identification", weight: 20, layerId: "bug-bounty-hunter-5", description: "Logic and accuracy in identifying authorization flaws (IDOR), API issues, and server misconfigurations." },
    { id: "template-engineering", name: "Custom Scanning & Fuzzing", weight: 15, layerId: "bug-bounty-hunter-6", description: "Quality, precision, and low false-positive design of custom Nuclei templates and parameter fuzzers." },
    { id: "scope-safety", name: "Scope Control & Rules of Engagement", weight: 15, layerId: "bug-bounty-hunter-1", description: "Strict enforcement of authorized target boundaries and safe scanning practices." },
    { id: "code-testing", name: "Code Quality & Test Coverage", weight: 15, layerId: "bug-bounty-hunter-10", description: "Clean Python structure, reliable CLI interface, error handling, and robust unit tests." },
    { id: "report-quality", name: "Report Quality & Documentation", weight: 10, layerId: "bug-bounty-hunter-10", description: "High-impact Markdown bug reports with clear reproduction steps, remediation guidance, and setup docs." },
  ],

  twistPool: [
    { id: "graphql-introspection-fuzzer", text: "Add a GraphQL scanner module that tests endpoints for enabled introspection, query depth limits, and injection vectors." },
    { id: "slack-discord-alerts", text: "Implement webhook notifications sending real-time alerts to Slack/Discord when new subdomains or high-severity vulnerabilities are found." },
    { id: "js-secret-miner", text: "Build an automated JavaScript asset analyzer that downloads client-side JS files and extracts hidden API keys and endpoint paths." },
    { id: "s3-bucket-checker", text: "Add a cloud storage checker that identifies public AWS S3 buckets or Azure blobs linked to discovered subdomains." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Penetration Tester track (pentester), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "pentester",
  categoryId: "cybersecurity",
  slug: "pentester-vulnerable-lab-and-report",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Vulnerable Target Lab Architecture & Penetration Test Report",
  summary:
    "Design and deploy a multi-tiered vulnerable laboratory environment (web API, Linux host, Active Directory domain), " +
    "execute a full-scope penetration test, and deliver a professional technical report with working exploit scripts.",
  stack: ["Python", "Docker", "Bash", "GitHub Actions"],

  requirements: [
    { id: "lab-architecture", text: "Deploy a multi-container lab environment containing at least two vulnerable targets (web application and internal service)." },
    { id: "web-vulnerabilities", text: "Incorporate web application vulnerabilities (SQL injection, authenticated RCE, broken access control) in the target containers." },
    { id: "privilege-escalation", text: "Implement local privilege escalation vectors on the Linux target (SUDO misconfiguration, vulnerable SUID binary, or cron flaw)." },
    { id: "exploit-automation", text: "Provide custom Python exploit scripts that reliably exploit web and privilege escalation vulnerabilities to obtain proof-of-concept flags." },
    { id: "recon-suite", text: "Write custom Nmap/NSE scripts or Python recon modules to map ports, service banners, and vulnerable endpoints." },
    { id: "pentest-report", text: "Deliver a formal penetration test report including executive summary, scope, CVSS v3 ratings, remediation recommendations, and attack chains.", check: { type: "file", glob: ["docs/**/*.md", "**/pentest-report.md"] } },
    { id: "exploit-code", text: "Include custom Python exploit scripts targeting the lab vulnerabilities with clear CLI arguments.", check: { type: "file", glob: "**/*.py" } },
    { id: "tests", text: "Unit tests verify exploit script parameter validation, network helper routines, and report parsing logic.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details lab deployment steps, rules of engagement, target scope definition, and exploit execution procedures.", check: CHECKS.readme },
    { id: "docker", text: "Deploy the entire vulnerable lab infrastructure using Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow checks script syntax, runs unit tests, and verifies docker-compose setup.", check: CHECKS.ci },
    { id: "no-secrets", text: "No actual production network credentials or external target scopes are committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "pentest-methodology", name: "Pentest Execution & Attack Chains", weight: 25, layerId: "pentester-9", description: "Rigor of testing methodology, logical vulnerability chaining, and reliable exploitation execution." },
    { id: "web-exploitation", name: "Web Application & Service Exploitation", weight: 20, layerId: "pentester-7", description: "Quality of custom web exploit payloads (SQLi, RCE, IDOR) and understanding of vulnerability mechanics." },
    { id: "privilege-escalation", name: "Privilege Escalation & Post-Exploitation", weight: 15, layerId: "pentester-8", description: "Design and exploitation of internal host misconfigurations and privilege escalation vectors." },
    { id: "custom-tooling", name: "Scripting & Tool Development", weight: 15, layerId: "pentester-6", description: "Clean, reliable Python exploit and recon scripts with proper error handling and argument parsing." },
    { id: "testing-code-quality", name: "Code Quality & Verification", weight: 15, layerId: "pentester-3", description: "Maintainable code structure, docker environment isolation, and comprehensive unit tests." },
    { id: "reporting-quality", name: "Professional Reporting & Remediation", weight: 10, layerId: "pentester-9", description: "Clarity of executive summary, precise technical findings, CVSS scoring, and actionable remediation guidance." },
  ],

  twistPool: [
    { id: "active-directory-kerberoast", text: "Add a simulated Active Directory container to the lab with a Kerberoastable service account and implement a custom ticket extraction script." },
    { id: "metasploit-module", text: "Package one of the web vulnerabilities into a custom, fully functional Metasploit Ruby module (`.rb`)." },
    { id: "buffer-overflow-poc", text: "Include a standalone vulnerable C binary on the Linux target and write a Python buffer overflow script overcoming basic stack protections." },
    { id: "command-c2-listener", text: "Build a lightweight custom Python reverse shell Command & Control (C2) listener handling multi-client sessions." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — SOC Analyst track (soc-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Python", "Elasticsearch or OpenSearch", "Suricata", "Docker", "GitHub Actions"],

  requirements: [
    { id: "multi-source-ingestion", text: "Ingest and normalize logs from multiple sources (Windows Event logs, Suricata IDS alerts, Apache access logs, Linux auth.log)." },
    { id: "alert-triage-engine", text: "Implement an automated triage engine scoring alerts based on asset criticality, indicator confidence, and threat severity." },
    { id: "suricata-rule-suite", text: "Provide custom Suricata IDS rules detecting web attacks, reverse shell activity, and malicious user agents.", check: { type: "file", glob: "**/*.rules" } },
    { id: "soar-playbook-automation", text: "Build automated Python response playbooks (e.g., auto-isolate IP, revoke compromised user token, generate ticket summary)." },
    { id: "dashboards-queries", text: "Provide structured SIEM search queries and dashboard definitions for top incident indicators and log volume spikes.", check: { type: "file", glob: ["**/*.json", "queries/*.spl"] } },
    { id: "ir-playbook-docs", text: "Document formal Incident Response (IR) playbooks covering containment, eradication, and post-incident review procedures.", check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] } },
    { id: "tests", text: "Unit tests verify log normalization schemas, alert scoring formulas, and playbook execution triggers.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details architecture setup, log replay instructions, alert rule testing, and playbook execution.", check: CHECKS.readme },
    { id: "docker", text: "Deploy log collector, storage engine, and triage backend via Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI runs linter checks, validates Suricata rule syntax, and executes python unit tests.", check: CHECKS.ci },
    { id: "no-secrets", text: "No live production network credentials, private keys, or internal IP data committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "incident-triage", name: "Incident Triage & Classification", weight: 25, layerId: "soc-analyst-7", description: "Precision of alert scoring algorithms, triage logic, and escalation criteria." },
    { id: "log-parsing", name: "Log Analysis & SIEM Integration", weight: 20, layerId: "soc-analyst-3", description: "Normalization and parsing fidelity across heterogeneous log sources." },
    { id: "ids-detection", name: "IDS Rule Development", weight: 15, layerId: "soc-analyst-5", description: "Quality, accuracy, and performance of custom Suricata detection rules." },
    { id: "soar-automation", name: "Response Automation & Playbooks", weight: 15, layerId: "soc-analyst-10", description: "Effectiveness and safety of automated response scripts and playbook orchestration." },
    { id: "code-and-tests", name: "Code Quality & Test Isolation", weight: 15, layerId: "soc-analyst-4", description: "Modular Python code structure, clear data schemas, and comprehensive test coverage." },
    { id: "documentation-clarity", name: "Documentation & Incident Playbooks", weight: 10, layerId: "soc-analyst-7", description: "Quality of IR documentation, setup instructions, and incident walkthrough guides." },
  ],

  twistPool: [
    { id: "virustotal-enrichment", text: "Add an automated IOC enrichment module querying VirusTotal API for file hashes and extracted IP addresses." },
    { id: "misp-threat-intel-sync", text: "Integrate MISP platform synchronization to pull fresh threat indicators directly into the alert scoring pipeline." },
    { id: "telegram-slack-bot", text: "Implement an interactive alert notification bot (Slack or Telegram) allowing analysts to trigger containment actions directly." },
    { id: "forensic-pcap-extractor", text: "Automate PCAP packet extraction around Suricata alert timestamps to attach relevant raw network streams to incidents." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — AppSec Engineer track (appsec-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "sast-integration", text: "Integrate Semgrep static analysis into CI with custom rules targeting project-specific security flaws (e.g., custom auth bypass, hardcoded secrets)." },
    { id: "custom-semgrep-rules", text: "Write at least 3 custom Semgrep YAML rules detecting OWASP Top 10 vulnerabilities in code.", check: { type: "file", glob: "**/*.yml" } },
    { id: "sca-dependency-scan", text: "Automate Software Composition Analysis (SCA) checking dependencies against known CVE databases with configurable failure thresholds." },
    { id: "container-image-scan", text: "Incorporate Trivy container image scanning in CI to block builds containing critical vulnerabilities." },
    { id: "dast-api-fuzzer", text: "Build an automated DAST / API fuzzing module executing OWASP ZAP or custom HTTP checks against deployed endpoints." },
    { id: "vulnerability-triage-api", text: "Provide a backend API service that ingests SAST, SCA, and DAST JSON scan results and calculates risk scores." },
    { id: "threat-model-doc", text: "Document an enterprise Application Threat Model using STRIDE methodology for the target API.", check: { type: "file", glob: ["docs/**/*.md", "**/threat-model.md"] } },
    { id: "tests", text: "Unit tests cover vulnerability aggregation logic, CVSS risk calculations, and report generation utilities.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, local scanner execution, CI integration steps, and vulnerability triage workflows.", check: CHECKS.readme },
    { id: "docker", text: "Triage dashboard service and target application run via Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow enforces security gates (SAST, SCA, container scan) on every pull request.", check: CHECKS.ci },
    { id: "no-secrets", text: "No production API keys, database secrets, or credentials committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "sast-rule-engineering", name: "SAST & Rule Customization", weight: 25, layerId: "appsec-engineer-3", description: "Precision, syntax correctness, and low false-positive rate of custom Semgrep SAST rules." },
    { id: "pipeline-security", name: "DevSecOps & CI/CD Security Gates", weight: 20, layerId: "appsec-engineer-8", description: "Seamless integration of automated security gates (SAST, SCA, container scanning) into GitHub Actions." },
    { id: "dast-api-security", name: "DAST & API Security Testing", weight: 15, layerId: "appsec-engineer-7", description: "Effective dynamic scanning and API fuzzing coverage against active endpoints." },
    { id: "vulnerability-management", name: "Triage & Risk Scoring", weight: 15, layerId: "appsec-engineer-9", description: "Design of vulnerability ingestion backend, CVSS risk scoring, and deduplication logic." },
    { id: "testing-code-quality", name: "Code Quality & Test Coverage", weight: 15, layerId: "appsec-engineer-1", description: "Modular code organization, clear REST endpoints, and robust unit tests." },
    { id: "threat-modeling-docs", name: "Threat Modeling & Documentation", weight: 10, layerId: "appsec-engineer-5", description: "Clarity of STRIDE threat model document, setup guide, and developer remediation advice." },
  ],

  twistPool: [
    { id: "sarif-github-security-export", text: "Format all scanner findings into standard SARIF (Static Analysis Results Interchange Format) to upload directly to GitHub Code Security." },
    { id: "secret-entropy-detector", text: "Add a high-entropy secret scanner module checking Git commit diffs for exposed API keys and private certificates." },
    { id: "software-bill-of-materials", text: "Generate an automated CycloneDX or SPDX Software Bill of Materials (SBOM) during the build phase." },
    { id: "auto-remediation-prs", text: "Implement a script that automatically opens GitHub Pull Requests to bump vulnerable dependency versions identified by SCA." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,/**
 * Capstone brief — Red Team Operator track (red-team), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "red-team",
  categoryId: "cybersecurity",
  slug: "red-team-c2-framework-and-emulation",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Custom Command & Control (C2) Framework & Adversary Emulation Suite",
  summary:
    "Build a custom Command & Control (C2) framework featuring an encrypted teamserver, HTTP/HTTPS beacon implants, " +
    "stealthy post-exploitation modules, and automated adversary emulation plans targeting Active Directory concepts.",
  stack: ["Python", "Go or C", "Docker", "GitHub Actions"],

  requirements: [
    { id: "c2-teamserver", text: "Build a multi-client C2 teamserver handling beacon check-ins, task queuing, and encrypted session management over HTTP/HTTPS." },
    { id: "beacon-implant", text: "Implement a lightweight beacon implant supporting configurable sleep/jitter timing, system info gathering, and command execution." },
    { id: "encrypted-channel", text: "Secure all C2 communications using AES-256 or ChaCha20 encryption with dynamic key exchange to prevent plain-text analysis." },
    { id: "post-exploitation-modules", text: "Include post-exploitation modules for process enumeration, token manipulation/impersonation, and persistence mechanisms." },
    { id: "ad-enumeration-tool", text: "Develop a custom Active Directory / LDAP enumeration script to discover high-privilege users and trust relationships." },
    { id: "emulation-plan", text: "Provide a machine-readable adversary emulation plan mapping operations directly to MITRE ATT&CK tactics.", check: { type: "file", glob: ["docs/**/*.md", "emulation/*.yml"] } },
    { id: "implant-code", text: "Provide the standalone implant source code written in Go, C, or Python.", check: { type: "file", glob: "**/*.{go,c,py}" } },
    { id: "tests", text: "Unit tests verify packet encryption/decryption, task queue handling, and command serialization.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details teamserver setup, listener configuration, rules of engagement, and legal authorization safeguards.", check: CHECKS.readme },
    { id: "docker", text: "Containerize the C2 teamserver and redirector environment using Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow validates code syntax, executes unit tests, and verifies docker build status.", check: CHECKS.ci },
    { id: "no-secrets", text: "No actual live infrastructure domain keys or real target credentials are committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "c2-architecture", name: "C2 Framework & Protocol Design", weight: 25, layerId: "red-team-4", description: "Design of C2 server, listener infrastructure, encrypted beacon communications, and jitter control." },
    { id: "adversary-emulation", name: "Adversary Emulation & Mapping", weight: 20, layerId: "red-team-9", description: "Fidelity of adversary campaign execution and precise mapping to the MITRE ATT&CK framework." },
    { id: "active-directory-attacks", name: "Active Directory Tradecraft", weight: 15, layerId: "red-team-5", description: "Depth and effectiveness of AD enumeration, Kerberos attack vectors, or lateral movement tradecraft." },
    { id: "evasion-tradecraft", name: "OPSEC & Evasion Mechanics", weight: 15, layerId: "red-team-3", description: "Implementation of operational security principles, payload staging, and anti-analysis design." },
    { id: "code-quality-tests", name: "Software Engineering & Tests", weight: 15, layerId: "red-team-4", description: "Modular code architecture, robust encryption logic, and comprehensive unit test suites." },
    { id: "governance-docs", name: "Rules of Engagement & Documentation", weight: 10, layerId: "red-team-1", description: "Clear operational guides, deconfliction procedures, and complete setup documentation." },
  ],

  twistPool: [
    { id: "malleable-c2-profiles", text: "Add support for malleable C2 profile parsing to dynamically customize HTTP headers, URIs, and payload body structures." },
    { id: "amsi-etw-bypass", text: "Implement an optional memory patch module in the implant to bypass AMSI (Antimalware Scan Interface) and disable ETW logging." },
    { id: "domain-fronting-redirector", text: "Architect a HTTP redirector simulation module using Nginx/Apache to proxy C2 traffic and obfuscate the backend teamserver IP." },
    { id: "dll-sideloading-generator", text: "Include an automated payload generator producing DLL sideloading artifacts for execute-assembly scenarios." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
};

/**
 * Capstone brief — Blue Team Defender track (blue-team), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Python", "Bash or PowerShell", "Elasticsearch or OpenSearch", "Docker", "GitHub Actions"],

  requirements: [
    { id: "hardening-automation", text: "Develop system hardening scripts enforcing CIS Benchmark standards on Linux/Windows hosts (disabling legacy protocols, configuring firewall rules)." },
    { id: "sysmon-telemetry", text: "Provide optimized Sysmon XML configuration files capturing process creation, network connections, and raw disk access.", check: { type: "file", glob: "**/*.xml" } },
    { id: "detection-engineering", text: "Write custom Sigma detection rules targeting privilege escalation, persistence, and lateral movement techniques.", check: { type: "file", glob: "**/*.yml" } },
    { id: "containment-automation", text: "Build automated response scripts capable of isolating compromised endpoints, terminating rogue processes, and blocking IPs." },
    { id: "network-defense-suricata", text: "Incorporate Suricata network IDS rules targeting Command & Control beaconing and exploit payloads.", check: { type: "file", glob: "**/*.rules" } },
    { id: "security-baseline-audit", text: "Build an automated security audit script evaluating host posture against baseline security standards and producing compliance pass/fail scores." },
    { id: "ir-playbooks", text: "Provide documented Incident Response playbooks outlining containment strategies, evidence acquisition, and recovery.", check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] } },
    { id: "tests", text: "Unit tests verify security rule syntax, audit script execution logic, and automated containment parsers.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details host hardening deployment, SIEM telemetry integration, and incident simulation procedures.", check: CHECKS.readme },
    { id: "docker", text: "Deploy defensive SIEM storage, log ingestion pipeline, and audit runner using Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI workflow executes static code analysis, validates Sigma/Suricata rule syntax, and runs unit tests.", check: CHECKS.ci },
    { id: "no-secrets", text: "No sensitive network credentials or internal infrastructure keys are committed.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "hardening-quality", name: "System Hardening & Configuration", weight: 25, layerId: "blue-team-2", description: "Thoroughness and effectiveness of CIS benchmark hardening scripts and OS security configurations." },
    { id: "detection-engineering", name: "Detection Engineering & Telemetry", weight: 20, layerId: "blue-team-9", description: "Precision of Sysmon profiles, custom Sigma rules, and Suricata IDS network signatures." },
    { id: "incident-containment", name: "Incident Containment & Response", weight: 15, layerId: "blue-team-6", description: "Reliability, speed, and safety of automated endpoint containment and network isolation scripts." },
    { id: "audit-automation", name: "Audit & Baseline Compliance", weight: 15, layerId: "blue-team-2", description: "Accuracy of baseline security posture evaluation scripts and structured compliance scoring." },
    { id: "code-testing", name: "Code Quality & Test Isolation", weight: 15, layerId: "blue-team-3", description: "Modular Python/shell script engineering, robust error handling, and comprehensive test suites." },
    { id: "playbook-docs", name: "Playbooks & Program Maturity", weight: 10, layerId: "blue-team-10", description: "Quality of incident response playbooks, clear setup instructions, and architecture documentation." },
  ],

  twistPool: [
    { id: "soar-webhook-integration", text: "Build a SOAR webhook integration that receives alert triggers from SIEM and automatically executes endpoint network isolation." },
    { id: "yara-memory-scanner-agent", text: "Deploy an automated memory scanner agent executing custom YARA rules periodically to detect volatile fileless malware." },
    { id: "zeek-network-fingerprinting", text: "Integrate Zeek log parsing to extract HTTP headers and DNS queries for network baselining and anomaly detection." },
    { id: "purple-team-validation-script", text: "Provide an automated purple team validation script that triggers benign attack telemetry to test rule efficacy." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — Cloud Security Engineer track (cloud-security), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "cloud-security",
  categoryId: "cybersecurity",
  slug: "cloud-security-iam-posture-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cloud Infrastructure Security & Automated Posture Governance Engine",
  summary:
    "Design and deploy hardened AWS/Cloud Infrastructure as Code (IaC) using Terraform, implement an automated IAM " +
    "least-privilege policy analyzer, parse CloudTrail security logs, and enforce compliance policy guardrails.",
  stack: ["Terraform", "Python", "AWS LocalStack or Docker", "GitHub Actions"],

  requirements: [
    { id: "iac-hardening", text: "Define secure Terraform infrastructure modules configuring VPC network isolation, private subnets, S3 encryption, and Security Groups.", check: { type: "file", glob: "**/*.tf" } },
    { id: "iam-least-privilege-analyzer", text: "Build a Python utility that parses AWS IAM policies and flags overly permissive wildcards (* permissions or * resources)." },
    { id: "cloudtrail-log-auditor", text: "Parse AWS CloudTrail event logs to identify anomalous API actions (e.g., Root account activity, security group modifications, unauthorized S3 access)." },
    { id: "policy-as-code", text: "Implement Policy as Code guardrails (using Open Policy Agent / Rego or Checkov) to evaluate Terraform plan files prior to deployment.", check: { type: "file", glob: "**/*.rego" } },
    { id: "kms-key-rotation", text: "Configure AWS KMS customer managed keys with enforced automatic key rotation and scoped key usage policies in Terraform." },
    { id: "cloud-incident-playbook", text: "Provide documented incident response procedures for compromised cloud credentials and S3 bucket data exposure.", check: { type: "file", glob: ["docs/**/*.md", "playbooks/*.md"] } },
    { id: "tests", text: "Unit tests verify IAM policy parser rules, CloudTrail alert logic, and Terraform validation utilities.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README documents architecture layout, LocalStack / AWS deployment steps, Policy-as-Code checks, and audit scripts.", check: CHECKS.readme },
    { id: "docker", text: "Run local cloud simulation environment (LocalStack) and policy checker tools using Docker Compose.", check: CHECKS.compose },
    { id: "ci", text: "CI pipeline executes Terraform validation, Policy as Code checks, and Python unit tests on every pull request.", check: CHECKS.ci },
    { id: "no-secrets", text: "No real AWS access keys, secret keys, or cloud credentials committed in git repository.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "cloud-architecture", name: "Cloud Architecture & IaC Hardening", weight: 25, layerId: "cloud-security-1", description: "Quality, security posture, and network isolation of Terraform cloud infrastructure modules." },
    { id: "iam-governance", name: "IAM & Least Privilege Analysis", weight: 20, layerId: "cloud-security-2", description: "Rigor of automated IAM policy analysis, wildcard detection, and privilege evaluation logic." },
    { id: "policy-as-code", name: "Policy as Code & Guardrails", weight: 15, layerId: "cloud-security-2", description: "Implementation of automated OPA/Rego compliance policies blocking insecure IaC deployments." },
    { id: "cloud-telemetry", name: "Cloud Audit & Log Analytics", weight: 15, layerId: "cloud-security-2", description: "Accuracy and completeness of CloudTrail event parsing and anomaly identification." },
    { id: "testing-code-quality", name: "Code Engineering & Testing", weight: 15, layerId: "cloud-security-2", description: "Modular Python code, clean Terraform module organization, and thorough test coverage." },
    { id: "docs-and-operability", name: "Documentation & Response Playbooks", weight: 10, layerId: "cloud-security-1", description: "Quality of cloud incident response playbooks, LocalStack deployment instructions, and setup guides." },
  ],

  twistPool: [
    { id: "auto-remediation-lambda", text: "Develop an automated remediation script that immediately revokes public access blocks on S3 buckets whenever a misconfiguration is detected." },
    { id: "guardduty-asff-converter", text: "Build an event pipeline converting raw CloudTrail alerts into standard Security Finding Format (ASFF) for SIEM ingestion." },
    { id: "container-ecs-security", text: "Add Terraform modules for an AWS ECS/EKS container cluster enforcing read-only root filesystems and task execution roles." },
    { id: "drift-detection-engine", text: "Implement a drift detection module comparing live cloud resource configurations against state files to identify unrecorded manual changes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};