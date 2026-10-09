/**
 * Capstone brief — sdet track (sdet), v1.
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
  trackId: "sdet",
  categoryId: "qa",
  slug: "sdet-enterprise-automation-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Test Engineering Framework & Quality Pipeline",
  summary:
    "Build a production-grade test engineering framework in Java using Selenium, REST Assured, and Cucumber BDD. " +
    "You will implement core design patterns (Singleton, Factory, Builder), write JUnit 5/Mockito integration tests, " +
    "spin up real container dependencies with Testcontainers, and govern quality gates in a CI/CD pipeline.",
  stack: [
    "Java",
    "Selenium WebDriver",
    "REST Assured",
    "Cucumber",
    "JUnit 5",
    "Testcontainers",
    "Maven",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "design-patterns",
      text: "Implement Singleton for WebDriver management, Factory for browser instantiation, and Builder pattern for test data creation.",
      check: { type: "file", glob: "src/main/**/*.java" },
    },
    {
      id: "bdd-cucumber",
      text: "Write structured Gherkin feature files with Given/When/Then scenarios and step definitions mapping UI and API behaviors.",
      check: { type: "file", glob: "src/test/resources/**/*.feature" },
    },
    {
      id: "ui-automation",
      text: "Build Page Object Model classes with Fluent Interface pattern and explicit synchronization waits.",
      check: { type: "file", glob: "src/test/**/*.java" },
    },
    {
      id: "api-automation",
      text: "Include REST Assured API tests with POJO serialization/deserialization via Jackson.",
      check: { type: "file", glob: "src/test/**/*.java" },
    },
    {
      id: "testcontainers",
      text: "Integrate Testcontainers to spin up isolated database or wiremock containers during integration tests.",
      check: { type: "file", glob: "src/test/**/Test*Container*.java" },
    },
    {
      id: "unit-mockito",
      text: "Write unit and controller tests using JUnit 5 parameterized tests and Mockito dynamic mocking.",
      check: { type: "file", glob: "src/test/**/Mock*.java" },
    },
    {
      id: "retry-listener",
      text: "Implement custom TestNG/JUnit listeners and retry analyzers to handle flaky tests and capture failure screenshots.",
    },
    {
      id: "synthetic-data",
      text: "Use Java Faker or custom generators for on-demand synthetic test data instantiation.",
    },
    {
      id: "pom-xml",
      text: "Configure Maven pom.xml with profiles for parallel execution, plugins, and dependencies.",
      check: { type: "file", glob: "pom.xml" },
    },
    {
      id: "readme",
      text: "README details framework architecture, design patterns used, container requirements, and test runner triggers.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions pipeline executing multi-threaded parallel test matrices and archiving reports.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "env-example",
      text: "Provide an environment configuration file template for database credentials, base URLs, and browser settings.",
      check: { type: "file", glob: ".env.example" },
    },
  ],

  rubric: [
    {
      id: "patterns-architecture",
      name: "Design Patterns & Code Quality",
      weight: 25,
      layerId: "sdet-5",
      description:
        "Correct implementation of software design patterns (Singleton, Factory, Builder, Fluent Interface) in framework design.",
    },
    {
      id: "bdd-gherkin",
      name: "BDD & Test Design",
      weight: 20,
      layerId: "sdet-7",
      description:
        "Readable Gherkin features, clean Cucumber step definition bindings, and reusable step components.",
    },
    {
      id: "integration-containers",
      name: "Integration Testing & Testcontainers",
      weight: 15,
      layerId: "sdet-6",
      description:
        "Effective use of Testcontainers and Mockito for isolated, deterministic, and repeatable test environments.",
    },
    {
      id: "ui-api-automation",
      name: "UI & API Automation Core",
      weight: 15,
      layerId: "sdet-2",
      description:
        "Robust Selenium explicitly-waited UI tests combined with REST Assured API validation.",
    },
    {
      id: "ci-governance",
      name: "CI Pipeline & Parallel Execution",
      weight: 15,
      layerId: "sdet-10",
      description:
        "Parallel test execution setup in GitHub Actions with robust reporting and retry listeners.",
    },
    {
      id: "data-env-management",
      name: "Test Data & Documentation",
      weight: 10,
      layerId: "sdet-8",
      description:
        "Clean synthetic data generation strategy and comprehensive architecture documentation.",
    },
  ],

  twistPool: [
    {
      id: "gatling-performance-mix",
      text: "Integrate a Gatling Java DSL performance test scenario executing within the Maven build lifecycle.",
    },
    {
      id: "zap-dast-maven",
      text: "Configure the OWASP ZAP Maven plugin to run automated security scans as part of the integration test suite.",
    },
    {
      id: "db-seeding-teardown",
      text: "Implement direct database seeding and automatic state cleanup before and after each test suite execution.",
    },
    {
      id: "sonarqube-quality-gate",
      text: "Integrate SonarQube static code analysis into the build pipeline with failure thresholds on test code complexity.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
