/**
 * Capstone brief — automation track (automation), v1.
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
  trackId: "automation",
  categoryId: "qa",
  slug: "automation-e2e-testing-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "End-to-End & API Test Automation Framework",
  summary:
    "Build an enterprise-grade automated testing suite using Python, Playwright, and Pytest. " +
    "You will design a Page Object Model architecture, integrate REST API validation, implement custom fixtures, " +
    "and execute containerized test runs in a GitHub Actions pipeline.",
  stack: ["Python", "Playwright", "Pytest", "Docker", "GitHub Actions"],

  requirements: [
    {
      id: "pytest-fixtures",
      text: "Organize test suite configuration, browser contexts, and API clients using Pytest fixtures in conftest.py.",
      check: { type: "file", glob: "**/conftest.py" },
    },
    {
      id: "pom-architecture",
      text: "Implement Page Object Model (POM) design pattern with reusable BasePage and component classes for UI flows.",
      check: { type: "file", glob: "**/pages/*.py" },
    },
    {
      id: "e2e-ui-tests",
      text: "Automate E2E UI workflows including multi-step form submissions, navigation, and state validation.",
      check: { type: "file", glob: "**/tests/test_ui*.py" },
    },
    {
      id: "api-integration",
      text: "Include automated REST API test coverage using HTTP requests, asserting status codes and JSON schema schemas.",
      check: { type: "file", glob: "**/tests/test_api*.py" },
    },
    {
      id: "data-driven",
      text: "Implement data-driven testing using Pytest parameterization reading test cases from JSON or CSV files.",
      check: { type: "file", glob: "**/data/*.{json,csv}" },
    },
    {
      id: "network-mocking",
      text: "Interceptors and mocks are used in Playwright to simulate network errors and edge-case API responses.",
    },
    {
      id: "visual-testing",
      text: "Include visual snapshot comparison checks for key pages or UI components.",
    },
    {
      id: "custom-reporting",
      text: "Generate structured HTML or JUnit XML test execution reports and artifact logs.",
    },
    {
      id: "readme",
      text: "README provides instructions for running tests locally, configuring environments, and execution options.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "docker",
      text: "Provide a Dockerfile to run the Playwright test suite in a standardized container environment.",
      check: { type: "file", glob: "Dockerfile" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions workflow that executes UI and API tests in parallel and archives test reports.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "env-example",
      text: "Configuration settings and base URLs are driven by environment variables with an template provided.",
      check: { type: "file", glob: ".env.example" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness & Coverage",
      weight: 25,
      layerId: "automation-5",
      description:
        "Automated E2E and API scenarios reliably cover functional flows, edge cases, and custom twist rules.",
    },
    {
      id: "architecture",
      name: "Framework Architecture",
      weight: 20,
      layerId: "automation-4",
      description:
        "Clean Page Object Model implementation, separation of concerns, and clean abstraction layers.",
    },
    {
      id: "fixtures-hooks",
      name: "Fixtures & Test Setup",
      weight: 15,
      layerId: "automation-9",
      description:
        "Effective use of Pytest fixtures, scoping, dynamic configurations, and clean teardown execution.",
    },
    {
      id: "api-testing",
      name: "API & Data Validation",
      weight: 15,
      layerId: "automation-6",
      description:
        "Comprehensive API tests validating HTTP codes, response payloads, and JSON schema boundaries.",
    },
    {
      id: "ci-containerization",
      name: "CI/CD & Execution",
      weight: 15,
      layerId: "automation-10",
      description:
        "Containerized execution and parallel pipeline runs on GitHub Actions with uploaded test artifacts.",
    },
    {
      id: "docs-reporting",
      name: "Documentation & Logs",
      weight: 10,
      layerId: "automation-7",
      description:
        "Clear README documentation, structured log outputs, and readable test execution reports.",
    },
  ],

  twistPool: [
    {
      id: "auth-session-reuse",
      text: "Inject authenticated browser state across UI tests via storageState files to eliminate repetitive login steps.",
    },
    {
      id: "database-validation",
      text: "Integrate direct database query assertions (SQLite or PostgreSQL) to verify backend persistence after UI actions.",
    },
    {
      id: "network-throttling",
      text: "Simulate poor network conditions (3G latency) during E2E scenarios and assert graceful loading states.",
    },
    {
      id: "multi-browser-matrix",
      text: "Run automated visual and functional cross-browser regression matrices across Chromium, Firefox, and WebKit.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
