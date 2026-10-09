/**
 * Capstone brief — quantum-crypto track (quantum-crypto), v1.
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
  trackId: "quantum-crypto",
  categoryId: "quantum",
  slug: "quantum-crypto-qkd-pqc-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Quantum Key Distribution Simulator and Post-Quantum Security Gateway",
  summary:
    "Build an end-to-end quantum security simulator that implements BB84 key exchange over noisy optical channels with eavesdropper detection, " +
    "paired with a post-quantum cryptographic (PQC) proxy gateway utilizing ML-KEM (Kyber) key encapsulation.",
  stack: [
    "Python",
    "liboqs / oqs-python",
    "Qiskit or SimulaQron",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "bb84-protocol",
      text: "Implements BB84 QKD protocol simulation including random basis choice, qubit transmission, sifting, and raw key generation.",
    },
    {
      id: "eavesdropper-detection",
      text: "Simulates Eve intercept-resend attacks and calculates quantum bit error rate (QBER) to detect eavesdropping thresholds.",
    },
    {
      id: "error-reconciliation",
      text: "Implements cascade error reconciliation and privacy amplification to produce secure final shared keys.",
    },
    {
      id: "pqc-kem-integration",
      text: "Integrates NIST-standardized lattice key encapsulation (ML-KEM / Kyber) for classical channel protection via liboqs.",
    },
    {
      id: "qrng-entropy-source",
      text: "Includes a quantum random number generator (QRNG) module simulating projective measurements for non-deterministic key generation.",
    },
    {
      id: "tls-hybrid-proxy",
      text: "Implements a local proxy server that negotiates hybrid quantum-safe (Kyber + ECDH) session keys for client-server traffic.",
    },
    {
      id: "auth-and-otp",
      text: "Provides quantum message authentication and one-time pad (OTP) encryption for sensitive payload transmission.",
    },
    {
      id: "tests",
      text: "Automated test suite verifying QBER thresholds, PQC key agreement, and OTP encryption/decryption cycles.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README detailing protocol architecture, QBER math, PQC integration steps, and setup instructions.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "Dockerfile or Docker Compose setting up the QKD simulator nodes and PQC proxy environment.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow running linting and automated cryptographic tests.",
      check: CHECKS.ci,
    },
    {
      id: "env-example",
      text: "Environment config file defining channel attenuation parameters, noise ratios, and PQC algorithm parameters.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "qkd-implementation",
      name: "Quantum Key Distribution & Sifting",
      weight: 25,
      layerId: "quantum-crypto-2",
      description:
        "Accurate implementation of BB84 sifting, channel noise, QBER calculation, and privacy amplification.",
    },
    {
      id: "pqc-integration",
      name: "Post-Quantum Cryptography Integration",
      weight: 20,
      layerId: "quantum-crypto-4",
      description:
        "Correct implementation of lattice-based KEM primitives and hybrid TLS session negotiation.",
    },
    {
      id: "crypto-security",
      name: "Quantum Threat Defense & Authentication",
      weight: 15,
      layerId: "quantum-crypto-7",
      description:
        "Proper use of QRNG sources, quantum message authentication, and unhackable OTP boundaries.",
    },
    {
      id: "code-structure",
      name: "Architecture & Network Simulation",
      weight: 15,
      layerId: "quantum-crypto-8",
      description:
        "Modular design separating Alice/Bob/Eve nodes, network sockets, and cryptographic primitives.",
    },
    {
      id: "testing",
      name: "Cryptographic & Protocol Testing",
      weight: 15,
      layerId: "quantum-crypto-6",
      description:
        "Comprehensive tests validating noise thresholds, eavesdropper alerts, and key consistency.",
    },
    {
      id: "documentation",
      name: "Documentation & Operability",
      weight: 10,
      layerId: "quantum-crypto-1",
      description:
        "Clear explanation of quantum threat models, mathematical security proofs, and setup guides.",
    },
  ],

  twistPool: [
    {
      id: "e91-entanglement-qkd",
      text: "Implement Ekert91 (E91) QKD protocol based on entangled Bell pairs and CHSH inequality violation verification.",
    },
    {
      id: "pqc-signature-sphincs",
      text: "Add stateless hash-based digital signature verification (SLH-DSA / SPHINCS+) for firmware/message signing.",
    },
    {
      id: "cv-qkd-simulation",
      text: "Add Continuous-Variable QKD (CV-QKD) simulation using Gaussian-modulated coherent states instead of discrete single photons.",
    },
    {
      id: "secret-sharing-threshold",
      text: "Implement a quantum secret sharing (QSS) scheme distributing a secret key across 3 receiver nodes requiring majority threshold reconstruction.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
