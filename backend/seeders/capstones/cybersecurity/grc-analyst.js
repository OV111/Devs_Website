/**
 * Capstone brief — grc-analyst track (grc-analyst), v1.
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
    {
      id: "control-mapping",
      text: "Implement a cross-framework mapping table linking NIST CSF controls to ISO 27001 Annex A and SOC 2 Trust Services Criteria.",
    },
    {
      id: "risk-register",
      text: "Provide full CRUD for risk items including inherent/residual scoring (likelihood x impact), threat vectors, and risk owners.",
    },
    {
      id: "vendor-tiering",
      text: "Assess third-party vendors via customizable questionnaires, mapping score responses to inherent risk tiers (High, Medium, Low).",
    },
    {
      id: "policy-lifecycle",
      text: "Implement policy document versioning, approval workflows, exception tracking with expiration dates, and owner assignment.",
    },
    {
      id: "audit-evidence",
      text: "Support evidence collection tracking by linking operational artifacts to specific security controls with status indicators.",
    },
    {
      id: "gap-assessment-api",
      text: "Provide REST API endpoints to generate compliance maturity gap scores per framework category.",
    },
    {
      id: "tests",
      text: "Integration tests cover control mapping lookups, risk score calculations, and vendor tiering logic.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README details framework scope, API setup, database migrations, and a sample risk assessment walkthrough.",
      check: CHECKS.readme,
    },
    {
      id: "docker",
      text: "API backend and PostgreSQL database run seamlessly via Docker Compose.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "CI workflow executes test suites and linting on every push.",
      check: CHECKS.ci,
    },
    {
      id: "env-example",
      text: "Environment setup uses an .env.example file with no hardcoded credentials.",
      check: CHECKS.envExample,
    },
  ],

  rubric: [
    {
      id: "framework-mastery",
      name: "Framework Alignment & Mapping",
      weight: 25,
      layerId: "grc-analyst-2",
      description:
        "Accuracy and completeness of NIST CSF, ISO 27001, and SOC 2 control mappings.",
    },
    {
      id: "risk-scoring",
      name: "Risk Management Methodology",
      weight: 20,
      layerId: "grc-analyst-5",
      description:
        "Rigorous implementation of risk scoring, threshold definitions, and residual risk evaluation.",
    },
    {
      id: "policy-governance",
      name: "Governance & Vendor Workflow",
      weight: 15,
      layerId: "grc-analyst-7",
      description:
        "Effective design of third-party risk classification and policy exception lifecycle management.",
    },
    {
      id: "architecture-design",
      name: "System Structure & Data Design",
      weight: 15,
      layerId: "grc-analyst-10",
      description:
        "Clean API separation, normalized relational models, and structured audit trail schemas.",
    },
    {
      id: "testing-reliability",
      name: "Validation & Test Coverage",
      weight: 15,
      layerId: "grc-analyst-8",
      description:
        "Comprehensive test suite verifying risk calculations, control mappings, and access controls.",
    },
    {
      id: "operability-documentation",
      name: "Documentation & Deployment",
      weight: 10,
      layerId: "grc-analyst-8",
      description:
        "Clear deployment instructions, sample evaluation datasets, and actionable operational guides.",
    },
  ],

  twistPool: [
    {
      id: "fair-quantitative-risk",
      text: "Integrate a FAIR (Factor Analysis of Information Risk) quantitative simulation module estimating loss event frequency and magnitude.",
    },
    {
      id: "soc2-type2-evidence-scheduler",
      text: "Add automated evidence renewal tracking that flags stale control evidence older than 90 days for SOC 2 Type II audit readiness.",
    },
    {
      id: "gdpr-ropa-generator",
      text: "Implement a Data Privacy module to construct Records of Processing Activities (RoPA) and flag high-risk activities requiring a DPIA.",
    },
    {
      id: "jira-remediation-sync",
      text: "Integrate a webhook notification service that auto-creates remediation action items in Jira/GitHub Issues when risk scores exceed thresholds.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
