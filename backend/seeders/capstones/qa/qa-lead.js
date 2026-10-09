/**
 * Capstone brief — qa-lead track (qa-lead), v1.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "qa-lead",
  categoryId: "qa",
  slug: "qa-lead-quality-strategy-portfolio",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Quality Strategy & QA Governance Portfolio",
  summary:
    "Design and publish an end-to-end quality engineering strategy and governance framework for a multi-team release. " +
    "You will craft comprehensive test strategies, model risk-based test coverage, design team onboarding and mentorship structures, " +
    "build quality metric dashboards, run Three Amigos workshops, and author incident post-mortems.",
  stack: ["Markdown", "YAML", "GitHub Actions", "JSON / Metrics Schemas"],

  requirements: [
    {
      id: "test-strategy",
      text: "Publish an organizational Test Strategy document detailing scope, environment strategies, and automation pyramid governance.",
      check: { type: "file", glob: "**/docs/test-strategy.md" },
    },
    {
      id: "risk-testing-matrix",
      text: "Construct a Risk-Based Testing matrix mapping high-risk application components to mitigation activities and coverage goals.",
      check: { type: "file", glob: "**/docs/risk-matrix.md" },
    },
    {
      id: "team-onboarding-plan",
      text: "Create a 30-60-90 day onboarding and mentorship framework for new QA engineering hires using the SBI feedback model.",
      check: { type: "file", glob: "**/docs/onboarding-mentorship.md" },
    },
    {
      id: "metrics-dashboard-spec",
      text: "Build a quality metrics specification documenting leading/lagging indicators, defect escape rates, and cycle time targets.",
      check: { type: "file", glob: "**/docs/quality-metrics.md" },
    },
    {
      id: "three-amigos-charter",
      text: "Document a Three Amigos session facilitation template including Definition of Ready (DoR) and Definition of Done (DoD) criteria.",
      check: { type: "file", glob: "**/docs/three-amigos-charter.md" },
    },
    {
      id: "automation-governance",
      text: "Write code review guidelines and automation architecture standards for cross-team test repositories.",
      check: { type: "file", glob: "**/docs/automation-standards.md" },
    },
    {
      id: "incident-postmortem",
      text: "Produce a blameless post-mortem report for a simulated major production incident including 5-Whys root cause analysis.",
      check: { type: "file", glob: "**/docs/postmortem.md" },
    },
    {
      id: "qa-roadmap",
      text: "Author an annual Quality Engineering Strategic Roadmap including tooling evaluations, budget forecasts, and ROI calculations.",
      check: { type: "file", glob: "**/docs/annual-roadmap.md" },
    },
    {
      id: "readme",
      text: "README summarizes the quality portfolio structure, stakeholder communication plan, and implementation guidelines.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-policy-checker",
      text: "Provide a GitHub Actions workflow that automatically validates documentation completeness and markdown formatting.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "strategy-planning",
      name: "Test Strategy & Risk Planning",
      weight: 25,
      layerId: "qa-lead-2",
      description:
        "Depth and clarity of the overall test strategy, environment planning, and risk-based test allocation.",
    },
    {
      id: "team-leadership",
      name: "Team Leadership & Mentorship",
      weight: 20,
      layerId: "qa-lead-3",
      description:
        "Quality of onboarding plans, 1-on-1 feedback frameworks, and talent development structures.",
    },
    {
      id: "metrics-governance",
      name: "QA Metrics & Automation Governance",
      weight: 15,
      layerId: "qa-lead-4",
      description:
        "Actionable quality indicators (defect escape rate, cycle time) and robust test code review standards.",
    },
    {
      id: "agile-process",
      name: "Agile Ceremonies & Shift-Left",
      weight: 15,
      layerId: "qa-lead-5",
      description:
        "Effective facilitation of Three Amigos sessions, DoR/DoD enforcement, and shift-left quality integration.",
    },
    {
      id: "incident-rca",
      name: "Incident Management & RCA",
      weight: 15,
      layerId: "qa-lead-8",
      description:
        "Thoroughness of blameless post-mortem execution, severity classification, and 5-Whys root cause analysis.",
    },
    {
      id: "strategic-roadmap",
      name: "Strategic Vision & Executive Communication",
      weight: 10,
      layerId: "qa-lead-10",
      description:
        "Strategic vision in annual QA roadmap planning, tool procurement evaluation, and executive presentation.",
    },
  ],

  twistPool: [
    {
      id: "quality-champions-program",
      text: "Design a cross-functional Quality Champions program charter to train non-QA developers in testing practices.",
    },
    {
      id: "vendor-evaluation-matrix",
      text: "Include a formal build-vs-buy vendor evaluation decision matrix for enterprise test management software.",
    },
    {
      id: "release-go-no-go",
      text: "Produce a formal Release Sign-Off executive dashboard template detailing release risk waivers and exit criteria.",
    },
    {
      id: "compliance-audit-checklist",
      text: "Build an audit-readiness compliance checklist mapping test artifacts to SOC2 / ISO 27001 regulatory controls.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
