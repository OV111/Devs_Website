/**
 * Capstone brief — red-team track (red-team), v1.
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
    {
      id: "c2-teamserver",
      text: "Build a multi-client C2 teamserver handling beacon check-ins, task queuing, and encrypted session management over HTTP/HTTPS.",
    },
    {
      id: "beacon-implant",
      text: "Implement a lightweight beacon implant supporting configurable sleep/jitter timing, system info gathering, and command execution.",
    },
    {
      id: "encrypted-channel",
      text: "Secure all C2 communications using AES-256 or ChaCha20 encryption with dynamic key exchange to prevent plain-text analysis.",
    },
    {
      id: "post-exploitation-modules",
      text: "Include post-exploitation modules for process enumeration, token manipulation/impersonation, and persistence mechanisms.",
    },
    {
      id: "ad-enumeration-tool",
      text: "Develop a custom Active Directory / LDAP enumeration script to discover high-privilege users and trust relationships.",
    },
    {
      id: "emulation-plan",
      text: "Provide a machine-readable adversary emulation plan mapping operations directly to MITRE ATT&CK tactics.",
      check: { type: "file", glob: ["docs/**/*.md", "emulation/*.yml"] },
    },
    {
      id: "implant-code",
      text: "Provide the standalone implant source code written in Go, C, or Python.",
      check: { type: "file", glob: "**/*.{go,c,py}" },
    },
    {
      id: "tests",
      text: "Unit tests verify packet encryption/decryption, task queue handling, and command serialization.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details teamserver setup, listener configuration, rules of engagement, and legal authorization safeguards.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Containerize the C2 teamserver and redirector environment using Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI workflow validates code syntax, executes unit tests, and verifies docker build status.",
      check: CHECKS.ci,
    },
    {
      id: "no-secrets",
      text: "No actual live infrastructure domain keys or real target credentials are committed.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "c2-architecture",
      name: "C2 Framework & Protocol Design",
      weight: 25,
      layerId: "red-team-4",
      description:
        "Design of C2 server, listener infrastructure, encrypted beacon communications, and jitter control.",
    },
    {
      id: "adversary-emulation",
      name: "Adversary Emulation & Mapping",
      weight: 20,
      layerId: "red-team-9",
      description:
        "Fidelity of adversary campaign execution and precise mapping to the MITRE ATT&CK framework.",
    },
    {
      id: "active-directory-attacks",
      name: "Active Directory Tradecraft",
      weight: 15,
      layerId: "red-team-5",
      description:
        "Depth and effectiveness of AD enumeration, Kerberos attack vectors, or lateral movement tradecraft.",
    },
    {
      id: "evasion-tradecraft",
      name: "OPSEC & Evasion Mechanics",
      weight: 15,
      layerId: "red-team-3",
      description:
        "Implementation of operational security principles, payload staging, and anti-analysis design.",
    },
    {
      id: "code-quality-tests",
      name: "Software Engineering & Tests",
      weight: 15,
      layerId: "red-team-4",
      description:
        "Modular code architecture, robust encryption logic, and comprehensive unit test suites.",
    },
    {
      id: "governance-docs",
      name: "Rules of Engagement & Documentation",
      weight: 10,
      layerId: "red-team-1",
      description:
        "Clear operational guides, deconfliction procedures, and complete setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "malleable-c2-profiles",
      text: "Add support for malleable C2 profile parsing to dynamically customize HTTP headers, URIs, and payload body structures.",
    },
    {
      id: "amsi-etw-bypass",
      text: "Implement an optional memory patch module in the implant to bypass AMSI (Antimalware Scan Interface) and disable ETW logging.",
    },
    {
      id: "domain-fronting-redirector",
      text: "Architect a HTTP redirector simulation module using Nginx/Apache to proxy C2 traffic and obfuscate the backend teamserver IP.",
    },
    {
      id: "dll-sideloading-generator",
      text: "Include an automated payload generator producing DLL sideloading artifacts for execute-assembly scenarios.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
