You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (12 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/cybersecurity/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "cybersecurity" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "cybersecurity". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### malware-analyst — Malware Analyst
  - malware-analyst-1 | Foundations of Malware Analysis | topics: Windows process and memory model; x86 and x64 assembly basics; PE file format structure; Static vs dynamic analysis overview
  - malware-analyst-2 | Static Analysis Techniques | topics: Extracting printable strings from binaries; Analyzing PE imports and exports; Identifying packers and obfuscation; Writing basic YARA signatures
  - malware-analyst-3 | Dynamic Analysis and Sandboxing | topics: Safe detonation environment setup; Monitoring file system and registry changes; Capturing network indicators (IPs, domains); Using Cuckoo Sandbox for automated reports
  - malware-analyst-4 | Disassembly with Ghidra | topics: Ghidra project setup and binary import; Navigating the disassembly and decompiler views; Identifying functions and control flow; Renaming and annotating code
  - malware-analyst-5 | Anti-Analysis Techniques | topics: Debugger detection methods (IsDebuggerPresent, NtQueryInformationProcess); VM and sandbox detection artifacts; Timing-based evasion techniques; Manual unpacking of packed binaries
  - malware-analyst-6 | Rootkits and Kernel-Mode Malware | topics: Windows kernel architecture overview; Kernel driver structure and signing; Direct Kernel Object Manipulation (DKOM); Hooking SSDT and IRP handlers
  - malware-analyst-7 | Scripting and Automation for Analysis | topics: Python pefile library for PE parsing; Automating IOC extraction scripts; Writing Ghidra Python analysis scripts; Bulk YARA scanning pipelines
  - malware-analyst-8 | Malware Families and Campaign Analysis | topics: Anatomy of major malware families; Mapping behaviors to ATT&CK techniques; Tracking threat actor TTPs; Pivoting on infrastructure indicators
  - malware-analyst-9 | Memory Forensics and Advanced Evasion | topics: Process injection variants (hollowing, herpaderping, doppelganging); Reflective DLL loading; Fileless malware execution chains; Volatility plugins for injection detection
  - malware-analyst-10 | Production Malware Analysis Operations | topics: Designing a malware analysis lab at scale; Integrating CAPE with MISP and OpenCTI; Detection rule development from analysis output; Sample triage and priority queue management

### grc-analyst — GRC Analyst
  - grc-analyst-1 | Introduction to GRC and Compliance | topics: What is GRC and why it matters; Governance structures and accountability; Compliance vs security mindset; Overview of major frameworks (ISO, NIST, SOC 2)
  - grc-analyst-2 | NIST Cybersecurity Framework | topics: CSF Core, Tiers, and Profiles; NIST SP 800-53 control catalog; Conducting a CSF-based gap assessment; Mapping controls to business outcomes
  - grc-analyst-3 | ISO 27001 Information Security Management | topics: ISO 27001 structure and clause requirements; Defining ISMS scope and boundaries; Risk assessment and Statement of Applicability; Annex A control selection and justification
  - grc-analyst-4 | SOC 2 Trust Services Criteria | topics: Trust Services Criteria (Security, Availability, Confidentiality, Privacy, Processing Integrity); SOC 2 Type I vs Type II differences; Selecting in-scope systems and services; Control design vs operating effectiveness
  - grc-analyst-5 | Risk Management and Risk Registers | topics: Risk identification techniques and workshops; Qualitative likelihood and impact scoring; Introduction to FAIR quantitative risk analysis; Building and maintaining a risk register
  - grc-analyst-6 | Policy Development and Management | topics: Policy hierarchy (policy, standard, procedure, guideline); Writing clear and enforceable security policies; Managing policy review and approval workflows; Exception request and waiver processes
  - grc-analyst-7 | Third-Party and Vendor Risk Management | topics: Vendor risk tiering and inherent risk classification; Using SIG and CAIQ questionnaires; Reviewing vendor SOC 2 reports and certifications; Security requirements in contracts and BAAs
  - grc-analyst-8 | Audit Management and Evidence Programs | topics: Audit lifecycle (planning, fieldwork, reporting, closure); Writing clear and actionable audit findings; Evidence collection and artifact management; Using Vanta or Drata for continuous compliance
  - grc-analyst-9 | Privacy Regulations and Data Governance | topics: GDPR principles and lawful bases for processing; CCPA and US state privacy law landscape; Data mapping and Records of Processing Activities (RoPA); Conducting DPIAs for high-risk processing
  - grc-analyst-10 | Integrated GRC Program Leadership | topics: Unified control framework and control mapping; Building a GRC platform (ServiceNow GRC, Archer); Executive and board-level security reporting; Developing GRC program metrics and OKRs

### security-architect — Security Architect
  - security-architect-1 | Security Architecture Fundamentals | topics: Role of a security architect vs engineer vs analyst; Core security design principles (least privilege, defense in depth, fail-safe defaults); SABSA and TOGAF architecture frameworks overview; Security architecture documentation artifacts
  - security-architect-2 | Threat Modeling | topics: Threat modeling process and when to apply it; Drawing accurate Data Flow Diagrams (DFDs); STRIDE threat enumeration per element; PASTA risk-centric threat modeling
  - security-architect-3 | Identity and Access Management Architecture | topics: Identity lifecycle management (joiner-mover-leaver); Authentication protocols (SAML, OIDC, OAuth 2.0); Single Sign-On architecture patterns; MFA methods and assurance levels
  - security-architect-4 | Network Security Architecture | topics: Defense-in-depth network layering; Firewall architecture and rule design principles; DMZ patterns for public-facing services; Network segmentation and micro-segmentation
  - security-architect-5 | Cloud Security Architecture | topics: Cloud shared responsibility model; AWS Security Hub and Azure Security Center; Identity and access in cloud (roles, policies, managed identity); Cloud network security (VPC, security groups, NSGs)
  - security-architect-6 | Zero Trust Architecture | topics: Zero Trust principles (verify explicitly, least privilege, assume breach); NIST SP 800-207 Zero Trust Architecture; Identity-centric perimeter vs network-centric perimeter; Device health and posture verification
  - security-architect-7 | Application Security Architecture | topics: OWASP Top 10 and ASVS framework; Security requirements definition; Secure SDLC integration points; Secrets management architecture (Vault, KMS)
  - security-architect-8 | Cryptography in Architecture | topics: Symmetric vs asymmetric cryptography in system design; TLS 1.3 configuration and certificate management; PKI design, CA hierarchy, and certificate lifecycle; Key management systems and HSM integration
  - security-architect-9 | Security Architecture Review and Governance | topics: Architecture review board (ARB) setup and process; Tiered review process based on risk level; Security design pattern library creation; Risk acceptance and exception frameworks
  - security-architect-10 | Enterprise Security Architecture Leadership | topics: Aligning security architecture to business strategy; Building and communicating a multi-year security roadmap; Architecture metrics and maturity measurement; Resilience and business continuity architecture

### threat-hunter — Threat Hunter
  - threat-hunter-1 | Threat Hunting Foundations | topics: Threat hunting vs incident response vs detection engineering; The threat hunting maturity model; Intelligence-driven vs technique-driven hunting; Introduction to SIEM platforms
  - threat-hunter-2 | MITRE ATT&CK Framework for Hunters | topics: ATT&CK matrix structure (tactics, techniques, sub-techniques); Using ATT&CK Navigator for coverage mapping; Mapping observed behaviors to ATT&CK; Top techniques used by tracked threat groups
  - threat-hunter-3 | Windows Event Log Analysis | topics: Critical Windows Event IDs for security (4624, 4688, 7045, etc.); Sysmon configuration and deployment; PowerShell Script Block logging and transcription; Command-line auditing and process creation logging
  - threat-hunter-4 | SIEM Hunting with Splunk or Elastic | topics: SPL and KQL fundamentals for security use cases; Searching, filtering, and aggregating security events; Statistical hunting techniques (rare, outlier, baseline deviation); Building hunt dashboards and saved searches
  - threat-hunter-5 | Network Traffic Analysis for Hunting | topics: Network baseline establishment and anomaly detection; Identifying C2 beaconing patterns; DNS query analysis for tunneling and DGA detection; TLS certificate and JA3 fingerprinting
  - threat-hunter-6 | Endpoint Detection and Response (EDR) Hunting | topics: EDR telemetry sources and query languages; Process tree analysis for suspicious chains; Hunting with CrowdStrike Falcon or MDE Advanced Hunting; Detecting Living-off-the-Land (LotL) techniques
  - threat-hunter-7 | Threat Intelligence Integration | topics: Types of threat intelligence (strategic, tactical, operational); STIX/TAXII protocol and data model; Consuming threat feeds in MISP and OpenCTI; IOC-based vs TTP-based hunting trade-offs
  - threat-hunter-8 | Detection Engineering and Sigma Rules | topics: Sigma rule syntax and structure; Converting hunt queries to Sigma rules; Sigma backends for Splunk, Elastic, and QRadar; Detection as Code: versioning and CI/CD for rules
  - threat-hunter-9 | Advanced Adversary Simulation and Purple Teaming | topics: Atomic Red Team test execution and logging; MITRE Caldera adversary emulation platform; Purple team exercise planning and scope; Mapping simulation results to detection gaps
  - threat-hunter-10 | Hunt Program Operations and Leadership | topics: Hunt program framework and maturity model; Hunt campaign planning and tracking; KPIs: dwell time, hypothesis validation rate, detection uplift; Hunt playbook library development

### forensics-analyst — Digital Forensics Analyst
  - forensics-analyst-1 | Digital Forensics Fundamentals | topics: Forensic investigation lifecycle; Chain of custody documentation and evidence handling; Forensic soundness and write-blocking; Legal and jurisdictional considerations
  - forensics-analyst-2 | Disk Imaging and Acquisition | topics: Forensic imaging formats (RAW/dd, E01, AFF); Hardware and software write-blocking; Acquiring with FTK Imager and Guymager; Cryptographic hash verification (MD5, SHA-256)
  - forensics-analyst-3 | File System Forensics | topics: NTFS structures (MFT, $LogFile, $USN journal); File metadata and MAC times (Modified, Accessed, Created); Deleted file recovery techniques; File carving from unallocated space
  - forensics-analyst-4 | Windows Artifact Analysis | topics: Windows Registry forensic artifacts (UserAssist, RecentDocs, MRU); Prefetch file analysis for program execution evidence; LNK file and jump list analysis; Windows Event Log forensic review
  - forensics-analyst-5 | Memory Forensics with Volatility | topics: Memory acquisition methods and tools (WinPmem, LiME); Volatility 3 setup and profile identification; Process list and process tree analysis (pslist, pstree); Detecting process injection (malfind, cmdline)
  - forensics-analyst-6 | Network Forensics | topics: Full packet capture collection and preservation; Protocol analysis and session reconstruction; File carving from network captures; Identifying C2 and exfiltration patterns in PCAP
  - forensics-analyst-7 | Mobile and Cloud Forensics | topics: iOS and Android acquisition methods (logical, filesystem, physical); Mobile artifact categories (call logs, messages, app data, location); Cloud forensics concepts and challenges; AWS CloudTrail log analysis for intrusion evidence
  - forensics-analyst-8 | Malware Forensics and Anti-Forensics Detection | topics: Detecting log clearing events and tampered logs; Timestamp analysis and MACE manipulation detection; Detecting evidence of file wiping tools; Steganography detection techniques
  - forensics-analyst-9 | Forensic Reporting and Expert Testimony | topics: Technical report structure for forensic cases; Writing findings for legal vs executive audiences; Maintaining investigative notes and documentation; Expert witness qualification and standards
  - forensics-analyst-10 | Enterprise DFIR Operations | topics: Remote forensic collection at scale with Velociraptor; Building forensic triage workflows for SOC escalations; DFIR playbook development for common scenarios; Evidence management and retention policies

### bug-bounty-hunter — Bug Bounty Hunter
  - bug-bounty-hunter-1 | Bug Bounty Foundations and Ethics | topics: What bug bounty programs are and how they work; Reading and respecting program scope and rules; Safe harbor and legal protections for hunters; Responsible disclosure vs full disclosure
  - bug-bounty-hunter-2 | Reconnaissance and Attack Surface Mapping | topics: Passive vs active reconnaissance trade-offs; Subdomain enumeration with Amass and Subfinder; Port and service scanning within authorized scope; Technology fingerprinting with Wappalyzer and Whatweb
  - bug-bounty-hunter-3 | Web Vulnerability Fundamentals with Burp Suite | topics: Burp Suite proxy setup and browser configuration; Intercepting and modifying HTTP requests; Using Repeater for manual vulnerability testing; Sitemap and crawling within authorized scope
  - bug-bounty-hunter-4 | OWASP Top 10 in Practice | topics: Injection attacks (SQLi, command injection, SSTI); Broken authentication and session management; Cross-Site Scripting (XSS) - reflected, stored, DOM; Insecure Direct Object References (IDOR)
  - bug-bounty-hunter-5 | Authentication and Authorization Bugs | topics: IDOR discovery methodology and horizontal vs vertical privilege escalation; Testing multi-step workflows for authorization gaps; OAuth 2.0 common vulnerabilities (open redirect, state bypass, token leakage); JWT algorithm confusion and signature bypass
  - bug-bounty-hunter-6 | Fuzzing and Automated Vulnerability Discovery | topics: Directory and parameter fuzzing with ffuf; Nuclei template-based scanning within authorized scope; Parameter discovery with Param Miner; High-speed fuzzing with Turbo Intruder
  - bug-bounty-hunter-7 | Server-Side Vulnerabilities | topics: Server-Side Request Forgery (SSRF) identification and exploitation; Cloud metadata endpoint abuse via SSRF; XML External Entity (XXE) injection; Insecure deserialization identification and gadget chains
  - bug-bounty-hunter-8 | API Security Testing | topics: OWASP API Security Top 10 overview; REST API testing methodology with Burp and Postman; GraphQL introspection and injection testing; Excessive data exposure in API responses
  - bug-bounty-hunter-9 | Business Logic and High-Impact Chaining | topics: Business logic flaw identification methodology; Common logic flaws (price manipulation, workflow bypass, race conditions); Race condition testing and exploitation; Chaining low-severity bugs for maximum impact
  - bug-bounty-hunter-10 | Advanced Techniques and Program Scaling | topics: Building a personal bug bounty automation pipeline; Program selection and ROI analysis; Continuous monitoring for new assets and changes; Writing top-tier reports that maximize bounty rewards

### pentester — Penetration Tester
  - pentester-1 | Networking and OS Fundamentals | topics: OSI model; TCP/IP stack; Linux command line basics; Windows CLI basics
  - pentester-2 | Security Concepts and Ethics | topics: CIA Triad; CVE and CVSS scoring; Responsible disclosure; Legal authorization requirements
  - pentester-3 | Kali Linux and Lab Setup | topics: Installing Kali Linux; VirtualBox network modes; Vulnerable VMs setup; Basic Nmap scans
  - pentester-4 | Reconnaissance and OSINT | topics: Passive vs active recon; OSINT sources; DNS enumeration; Port and service scanning
  - pentester-5 | Vulnerability Scanning | topics: Nessus scan types; OpenVAS setup; Web server scanning with Nikto; Nmap scripting engine
  - pentester-6 | Exploitation with Metasploit | topics: Metasploit architecture; Selecting and configuring exploits; Payload types; Post-exploitation basics
  - pentester-7 | Web Application Pentesting | topics: OWASP Top 10; Burp Suite proxy setup; SQL injection; Cross-site scripting
  - pentester-8 | Password Attacks and Privilege Escalation | topics: Hash identification; Dictionary and brute-force attacks; Linux privesc techniques; Windows privesc techniques
  - pentester-9 | Reporting and Pentest Methodology | topics: PTES phases; Risk rating findings; Executive summary writing; Technical findings format
  - pentester-10 | Advanced Exploitation and OSCP Prep | topics: Stack-based buffer overflows; Active Directory enumeration; Kerberoasting; Pass-the-hash

### soc-analyst — SOC Analyst
  - soc-analyst-1 | IT and Networking Foundations | topics: TCP/IP fundamentals; DNS and HTTP protocols; Common ports and services; Packet analysis basics
  - soc-analyst-2 | Security Fundamentals | topics: CIA Triad; Threat actors and motives; MITRE ATT&CK framework; Indicators of compromise
  - soc-analyst-3 | Log Analysis | topics: Windows Event IDs; Linux auth logs; Apache access logs; Log parsing with grep and awk
  - soc-analyst-4 | SIEM Fundamentals | topics: SIEM architecture; Log ingestion and parsing; Search queries; Creating dashboards
  - soc-analyst-5 | IDS and IPS | topics: IDS vs IPS; Snort rule syntax; Suricata deployment; Alert categories
  - soc-analyst-6 | Threat Intelligence | topics: Threat intel types; IOC feeds; VirusTotal analysis; MISP platform basics
  - soc-analyst-7 | Incident Triage and Response | topics: Alert triage process; Severity classification; Escalation criteria; Incident documentation
  - soc-analyst-8 | Malware Analysis Basics | topics: Static vs dynamic analysis; PE header analysis; Sandboxing with Any.run; Extracting strings
  - soc-analyst-9 | Advanced SIEM and Detection Engineering | topics: Advanced Splunk SPL queries; Writing Sigma rules; YARA rule syntax; KQL for Microsoft Sentinel
  - soc-analyst-10 | Threat Hunting and SOC Maturity | topics: Threat hunting methodology; Hypothesis development; Hunting with ATT&CK; Documenting hunt results

### appsec-engineer — AppSec Engineer
  - appsec-engineer-1 | Secure Development Foundations | topics: HTTP request and response cycle; REST API basics; Authentication flows; Source control with Git
  - appsec-engineer-2 | OWASP Top 10 | topics: Injection flaws; Broken authentication; Insecure deserialization; SSRF
  - appsec-engineer-3 | Static Analysis and SAST | topics: SAST tool types; Running Semgrep rules; SonarQube setup; Interpreting findings
  - appsec-engineer-4 | Dynamic Analysis and DAST | topics: DAST vs SAST; OWASP ZAP automated scan; Burp Suite active scanner; API endpoint fuzzing
  - appsec-engineer-5 | Threat Modeling | topics: STRIDE methodology; Data flow diagrams; Trust boundaries; Threat enumeration
  - appsec-engineer-6 | Secure Code Review | topics: Input validation patterns; SQL injection in code; Insecure crypto usage; Auth and session flaws
  - appsec-engineer-7 | API Security | topics: OWASP API Top 10; JWT vulnerabilities; Broken object level authorization; API fuzzing techniques
  - appsec-engineer-8 | DevSecOps and CI/CD Security | topics: CI/CD pipeline stages; Adding SAST to GitHub Actions; Software composition analysis; Container image scanning
  - appsec-engineer-9 | Vulnerability Management and Triage | topics: CVSS scoring; Risk-based prioritization; Writing developer-friendly findings; SLA and remediation tracking
  - appsec-engineer-10 | Advanced AppSec Program Leadership | topics: OWASP SAMM maturity model; Security champions program; AppSec metrics and KPIs; Coordinating third-party pentests

### red-team — Red Team Operator
  - red-team-1 | Foundations and Legal Framework | topics: Rules of engagement; Scope definition; Authorization documents; Deconfliction procedures
  - red-team-2 | Pentesting Prerequisites | topics: Network scanning; Exploitation basics; Web app testing; Password attacks
  - red-team-3 | OPSEC and Tradecraft | topics: OPSEC principles; Avoiding log artifacts; Redirector infrastructure; Domain fronting basics
  - red-team-4 | Command and Control | topics: C2 architecture; Beacon configuration; Listener types; Payload staging
  - red-team-5 | Active Directory Attacks | topics: AD enumeration with BloodHound; Kerberoasting; AS-REP roasting; Pass-the-hash
  - red-team-6 | Phishing and Initial Access | topics: Phishing campaign setup; Evilginx reverse proxy; Payload delivery methods; HTML smuggling
  - red-team-7 | Evasion and AV Bypass | topics: AMSI bypass techniques; Shellcode injection methods; EDR hook evasion; Payload obfuscation
  - red-team-8 | Lateral Movement and Persistence | topics: WMI lateral movement; SMB-based movement; Scheduled task persistence; Registry run key persistence
  - red-team-9 | Reporting and Adversary Emulation | topics: Adversary emulation plans; ATT&CK Navigator mapping; Attack path narrative; Executive summary writing
  - red-team-10 | Advanced Adversary Simulation | topics: APT campaign emulation; Custom C2 implant development; Purple team exercises; TIBER-EU methodology

### blue-team — Blue Team Defender
  - blue-team-1 | Networking and OS Security Basics | topics: TCP/IP fundamentals; Windows security model; Linux hardening basics; Firewall rule logic
  - blue-team-2 | Hardening and Secure Configuration | topics: CIS Benchmark application; Windows Group Policy hardening; Linux hardening with Lynis; Disabling unnecessary services
  - blue-team-3 | Log Analysis and Monitoring | topics: Windows Event IDs for security; Syslog centralization; Elastic Stack setup; Creating log alerts
  - blue-team-4 | EDR and Endpoint Security | topics: EDR architecture; Sysmon deployment and config; Endpoint alert triage; Behavioral detection rules
  - blue-team-5 | Network Defense | topics: Network segmentation; IDS/IPS with Suricata; Zeek network logging; NetFlow analysis
  - blue-team-6 | Incident Response | topics: IR lifecycle phases; Evidence preservation; Memory acquisition; Containment strategies
  - blue-team-7 | Digital Forensics | topics: Disk image acquisition; File system forensics; Memory forensics with Volatility; Artifact collection with KAPE
  - blue-team-8 | Threat Intelligence Integration | topics: STIX and TAXII standards; MISP platform setup; IOC ingestion into SIEM; Threat intel sharing
  - blue-team-9 | Detection Engineering | topics: Sigma rule writing; YARA rule development; ATT&CK coverage mapping; Alert tuning and baselining
  - blue-team-10 | Blue Team Program Maturity | topics: SOAR platform automation; SOC KPIs and metrics; Purple team exercises; Tabletop exercise design

### cloud-security — Cloud Security Engineer
  - cloud-security-1 | Cloud Computing Fundamentals | topics: IaaS PaaS SaaS differences; Shared responsibility model; AWS global infrastructure; Cloud pricing basics
  - cloud-security-2 | Identity and Access Management | topics: IAM users roles and policies; Policy evaluation logic; Cross-account roles; Service control policies
  - cloud-security-3 | Network Security in the Cloud | topics: VPC design patterns; Security group rules; Network ACL differences; Private vs public subnets
  - cloud-security-4 | Cloud Security Posture Management | topics: CSPM concepts; CIS cloud benchmarks; Security Hub setup; Findings prioritization
  - cloud-security-5 | Data Security and Encryption | topics: Encryption key management; S3 bucket encryption policies; Secrets rotation; AWS Macie for data discovery
  - cloud-security-6 | Logging, Monitoring, and Alerting | topics: CloudTrail configuration; CloudWatch log groups; GuardDuty findings; EventBridge alert routing
  - cloud-security-7 | Zero Trust Architecture | topics: Zero Trust principles; Microsegmentation; Mutual TLS; Identity-aware proxies
  - cloud-security-8 | Container and Kubernetes Security | topics: Container image hardening; Kubernetes RBAC; Pod security standards; Runtime threat detection with Falco
  - cloud-security-9 | Cloud Incident Response | topics: Cloud IR methodology; Preserving CloudTrail evidence; Isolating compromised resources; IAM forensics
  - cloud-security-10 | Cloud Security Architecture and Governance | topics: AWS Organizations setup; Service control policies; AWS Landing Zone; Cloud security benchmarks
