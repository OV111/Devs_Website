/**
 * Capstone brief — manual track (manual), v1.
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
  trackId: "manual",
  categoryId: "qa",
  slug: "manual-qa-test-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Comprehensive Manual Testing Portfolio & Test Suite",
  summary:
    "Design and execute an end-to-end QA strategy for a web application. You will create structured test plans, " +
    "write detailed test cases using black-box techniques, construct Postman API collections, validate SQL database state, " +
    "and conduct accessibility and session-based exploratory audits.",
  stack: ["Markdown", "Postman", "SQL", "TestRail / Jira Format"],

  requirements: [
    {
      id: "test-plan",
      text: "Write a comprehensive Master Test Plan document detailing test scope, strategy, environments, and risk analysis.",
      check: { type: "file", glob: "**/docs/test-plan.md" },
    },
    {
      id: "test-cases",
      text: "Design at least 20 structured test cases using equivalence partitioning and boundary value analysis.",
      check: { type: "file", glob: "**/test-cases/*.md" },
    },
    {
      id: "bug-reports",
      text: "Document realistic defect reports complete with steps to reproduce, expected/actual results, severity, and priority.",
      check: { type: "file", glob: "**/bug-reports/*.md" },
    },
    {
      id: "postman-collection",
      text: "Create a Postman collection containing API test requests, environments, and JavaScript test assertions.",
      check: { type: "file", glob: "**/*.postman_collection.json" },
    },
    {
      id: "sql-validation",
      text: "Write SQL query scripts to perform data integrity checks comparing UI outcomes against backend tables.",
      check: { type: "file", glob: "**/sql/*.sql" },
    },
    {
      id: "exploratory-charter",
      text: "Document an exploratory testing charter with session notes, SFDPOT heuristics, and discovered edge cases.",
      check: { type: "file", glob: "**/docs/exploratory-session.md" },
    },
    {
      id: "accessibility-audit",
      text: "Perform a manual accessibility and WCAG 2.1 AA audit with documented keyboard and screen reader findings.",
      check: { type: "file", glob: "**/docs/accessibility-audit.md" },
    },
    {
      id: "matrix-traceability",
      text: "Build a Requirements Traceability Matrix (RTM) linking requirements to test cases and defects.",
      check: { type: "file", glob: "**/docs/rtm.md" },
    },
    {
      id: "readme",
      text: "Provide a project overview explaining test execution instructions, API collection usage, and SQL setups.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-validation",
      text: "Include a GitHub Actions workflow that validates Postman collections using Newman CLI.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "design-techniques",
      name: "Test Case Design",
      weight: 25,
      layerId: "manual-2",
      description:
        "Effective application of black-box design techniques like boundary value analysis and equivalence partitioning.",
    },
    {
      id: "defect-reporting",
      name: "Bug Quality & Tracking",
      weight: 20,
      layerId: "manual-3",
      description:
        "Clear, reproducible defect reports with accurate severity/priority classifications and logs.",
    },
    {
      id: "api-testing",
      name: "API & Postman Testing",
      weight: 15,
      layerId: "manual-5",
      description:
        "Well-structured Postman collections using environment variables and dynamic assertions.",
    },
    {
      id: "database-qa",
      name: "Database Validation",
      weight: 15,
      layerId: "manual-6",
      description:
        "Accurate SQL scripts that thoroughly test backend schema integrity and state consistency.",
    },
    {
      id: "exploratory-a11y",
      name: "Exploratory & Accessibility",
      weight: 15,
      layerId: "manual-8",
      description:
        "Structured exploratory session charters and systematic WCAG compliance evaluation.",
    },
    {
      id: "strategy-process",
      name: "Strategy & Process",
      weight: 10,
      layerId: "manual-1",
      description:
        "Comprehensive test planning, traceability mapping, and organized project documentation.",
    },
  ],

  twistPool: [
    {
      id: "decision-tables",
      text: "Include a complex multi-factor business rule scenario fully modeled and tested via a Decision Table matrix.",
    },
    {
      id: "localization-testing",
      text: "Conduct a localization (l10n) audit assessing UI character encoding, date formats, and layout overflow.",
    },
    {
      id: "state-transition",
      text: "Map an intricate user lifecycle flow using state transition diagrams and corresponding test cases.",
    },
    {
      id: "release-signoff",
      text: "Create an executive QA Sign-Off report including defect density metrics and release entry/exit criteria.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
