/**
 * Capstone brief — Security Dev track (security-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 *
 * Shape of this one: the learner hardens a deliberately small app they build
 * themselves and documents it like a security engineer — threat model,
 * findings, fixes and the tests that prove each fix.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "security-dev",
  categoryId: "backend",
  slug: "security-dev-hardened-file-share",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Secure file-sharing service, threat-modelled and tested",
  summary:
    "Build a small file-sharing web service and secure it the way a security engineer would: threat " +
    "model first, then authentication, authorisation, encryption and secure defaults — each control " +
    "backed by a test that fails if it is removed. The documentation is part of the work.",
  stack: ["Any web stack", "PostgreSQL", "Docker"],

  requirements: [
    { id: "threat-model", text: "A STRIDE threat model (THREAT_MODEL.md) with assets, trust boundaries, threats and the control for each.", check: { type: "file", glob: "**/THREAT_MODEL.md" } },
    { id: "auth", text: "Passwords hashed with argon2 or bcrypt, login rate limited, sessions or tokens expire and can be revoked." },
    { id: "authz", text: "Object-level authorisation: a user can never download, list or delete another user's file by changing an id." },
    { id: "uploads", text: "Uploads are validated (type and size), stored outside the web root with random names, and never executed." },
    { id: "crypto", text: "Files are encrypted at rest with AES-GCM; keys come from configuration, never from the repository." },
    { id: "headers", text: "Security headers, a strict CSP, correct CORS and CSRF protection where cookies are used." },
    { id: "logging", text: "Security-relevant events (logins, failures, permission denials) are logged without secrets or file contents." },
    { id: "tests", text: "Security tests prove each control — e.g. an IDOR attempt is refused, an oversize upload is rejected." },
    { id: "devsecops", text: "CI runs dependency scanning, secret scanning and a SAST tool, and fails on high-severity findings.", check: CHECKS.ci },
    { id: "readme", text: "README explains setup, the security architecture and how to run the security tests.", check: CHECKS.readme },
    { id: "docker", text: "The service starts with one command.", check: CHECKS.compose },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "threat-model", name: "Threat modeling", weight: 15, layerId: "security-dev-8", description: "Threats are specific to this system and every one maps to a real control." },
    { id: "authn", name: "Authentication", weight: 15, layerId: "security-dev-3", description: "Credentials, sessions and tokens are handled to current best practice." },
    { id: "authz", name: "Authorisation", weight: 20, layerId: "security-dev-4", description: "Object-level checks are enforced on every path; least privilege throughout." },
    { id: "secure-coding", name: "Secure coding", weight: 20, layerId: "security-dev-6", description: "Input validation, output encoding, safe file handling, no injection." },
    { id: "crypto", name: "Cryptography", weight: 10, layerId: "security-dev-5", description: "The right primitives used correctly; keys managed outside the code." },
    { id: "verification", name: "Security testing & DevSecOps", weight: 20, layerId: "security-dev-9", description: "Tests prove the controls; the pipeline catches vulnerable dependencies and leaked secrets." },
  ],

  twistPool: [
    { id: "share-links", text: "Files can be shared through signed, expiring links that can be revoked early; a tampered or expired link is refused." },
    { id: "mfa", text: "Accounts can enable TOTP two-factor authentication, with recovery codes stored hashed." },
    { id: "audit-log", text: "Every file access is written to a tamper-evident audit log (each entry hash-chained to the previous one)." },
    { id: "malware-scan", text: "Uploads are quarantined until a scanner (ClamAV or a stub with the same interface) marks them clean." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
