/**
 * Capstone brief — QA Lead track (qa-lead), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "test-strategy", text: "Publish an organizational Test Strategy document detailing scope, environment strategies, and automation pyramid governance.", check: { type: "file", glob: "**/docs/test-strategy.md" } },
    { id: "risk-testing-matrix", text: "Construct a Risk-Based Testing matrix mapping high-risk application components to mitigation activities and coverage goals.", check: { type: "file", glob: "**/docs/risk-matrix.md" } },
    { id: "team-onboarding-plan", text: "Create a 30-60-90 day onboarding and mentorship framework for new QA engineering hires using the SBI feedback model.", check: { type: "file", glob: "**/docs/onboarding-mentorship.md" } },
    { id: "metrics-dashboard-spec", text: "Build a quality metrics specification documenting leading/lagging indicators, defect escape rates, and cycle time targets.", check: { type: "file", glob: "**/docs/quality-metrics.md" } },
    { id: "three-amigos-charter", text: "Document a Three Amigos session facilitation template including Definition of Ready (DoR) and Definition of Done (DoD) criteria.", check: { type: "file", glob: "**/docs/three-amigos-charter.md" } },
    { id: "automation-governance", text: "Write code review guidelines and automation architecture standards for cross-team test repositories.", check: { type: "file", glob: "**/docs/automation-standards.md" } },
    { id: "incident-postmortem", text: "Produce a blameless post-mortem report for a simulated major production incident including 5-Whys root cause analysis.", check: { type: "file", glob: "**/docs/postmortem.md" } },
    { id: "qa-roadmap", text: "Author an annual Quality Engineering Strategic Roadmap including tooling evaluations, budget forecasts, and ROI calculations.", check: { type: "file", glob: "**/docs/annual-roadmap.md" } },
    { id: "readme", text: "README summarizes the quality portfolio structure, stakeholder communication plan, and implementation guidelines.", check: { type: "file", glob: "README.md" } },
    { id: "ci-policy-checker", text: "Provide a GitHub Actions workflow that automatically validates documentation completeness and markdown formatting.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "strategy-planning", name: "Test Strategy & Risk Planning", weight: 25, layerId: "qa-lead-2", description: "Depth and clarity of the overall test strategy, environment planning, and risk-based test allocation." },
    { id: "team-leadership", name: "Team Leadership & Mentorship", weight: 20, layerId: "qa-lead-3", description: "Quality of onboarding plans, 1-on-1 feedback frameworks, and talent development structures." },
    { id: "metrics-governance", name: "QA Metrics & Automation Governance", weight: 15, layerId: "qa-lead-4", description: "Actionable quality indicators (defect escape rate, cycle time) and robust test code review standards." },
    { id: "agile-process", name: "Agile Ceremonies & Shift-Left", weight: 15, layerId: "qa-lead-5", description: "Effective facilitation of Three Amigos sessions, DoR/DoD enforcement, and shift-left quality integration." },
    { id: "incident-rca", name: "Incident Management & RCA", weight: 15, layerId: "qa-lead-8", description: "Thoroughness of blameless post-mortem execution, severity classification, and 5-Whys root cause analysis." },
    { id: "strategic-roadmap", name: "Strategic Vision & Executive Communication", weight: 10, layerId: "qa-lead-10", description: "Strategic vision in annual QA roadmap planning, tool procurement evaluation, and executive presentation." },
  ],

  twistPool: [
    { id: "quality-champions-program", text: "Design a cross-functional Quality Champions program charter to train non-QA developers in testing practices." },
    { id: "vendor-evaluation-matrix", text: "Include a formal build-vs-buy vendor evaluation decision matrix for enterprise test management software." },
    { id: "release-go-no-go", text: "Produce a formal Release Sign-Off executive dashboard template detailing release risk waivers and exit criteria." },
    { id: "compliance-audit-checklist", text: "Build an audit-readiness compliance checklist mapping test artifacts to SOC2 / ISO 27001 regulatory controls." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Accessibility Tester track (accessibility-qa), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "accessibility-qa",
  categoryId: "qa",
  slug: "accessibility-qa-audit-automation",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated & Manual Accessibility Audit Suite",
  summary:
    "Conduct an end-to-end accessibility audit against WCAG 2.1 AA standards. " +
    "You will integrate axe-core automated scans using Playwright, perform screen reader and keyboard navigation audits, " +
    "validate custom ARIA widget patterns, and enforce accessibility quality gates in GitHub Actions via Lighthouse CI.",
  stack: ["JavaScript / TypeScript", "Playwright", "axe-core", "Lighthouse CI", "GitHub Actions"],

  requirements: [
    { id: "axe-playwright-suite", text: "Integrate @axe-core/playwright into automated E2E test scripts auditing key application routes.", check: { type: "file", glob: "**/tests/*.{js,ts,mjs}" } },
    { id: "aria-semantic-checks", text: "Write custom assertions verifying semantic HTML markup, ARIA roles, states, and properties.", check: { type: "file", glob: "**/tests/aria*.{js,ts,mjs}" } },
    { id: "keyboard-nav-audit", text: "Script automated focus movement verification checking tab order, focus visibility, and keyboard traps.", check: { type: "file", glob: "**/tests/keyboard*.{js,ts,mjs}" } },
    { id: "screen-reader-doc", text: "Document manual screen reader evaluation sessions (NVDA or VoiceOver) testing dynamic content alerts and forms.", check: { type: "file", glob: "**/docs/screen-reader-audit.md" } },
    { id: "color-contrast-report", text: "Include a color contrast audit report validating text (4.5:1) and non-text UI component contrast (3:1).", check: { type: "file", glob: "**/docs/contrast-report.md" } },
    { id: "lighthouse-ci-config", text: "Configure Lighthouse CI settings file (.lighthouserc.json) establishing accessibility score threshold gates.", check: { type: "file", glob: ".lighthouserc.json" } },
    { id: "vpat-document", text: "Author a Voluntary Product Accessibility Template (VPAT) summarizing WCAG 2.1 AA conformance status.", check: { type: "file", glob: "**/docs/vpat.md" } },
    { id: "package-json", text: "Provide package.json file configuring test scripts, axe dependencies, and Lighthouse tools.", check: { type: "file", glob: "package.json" } },
    { id: "readme", text: "README details WCAG auditing criteria, local test commands, screen reader testing notes, and VPAT structure.", check: { type: "file", glob: "README.md" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow executing axe-playwright and Lighthouse CI build checks on pull requests.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "axe-automation", name: "Automated axe-core Integration", weight: 25, layerId: "accessibility-qa-9", description: "Effective implementation of @axe-core/playwright test suites, custom rule configurations, and reporting." },
    { id: "aria-semantics", name: "ARIA & Semantic HTML", weight: 20, layerId: "accessibility-qa-8", description: "Comprehensive validation of semantic HTML elements, ARIA widget roles, expand/collapse states, and dynamic live regions." },
    { id: "keyboard-screenreader", name: "Keyboard & Screen Reader Audits", weight: 15, layerId: "accessibility-qa-3", description: "Thorough manual and automated testing of focus indicators, keyboard trapping, and NVDA/VoiceOver screen reader output." },
    { id: "visual-contrast", name: "Visual Accessibility & Contrast", weight: 15, layerId: "accessibility-qa-6", description: "Accurate verification of text contrast ratios, non-text UI boundaries, focus ring visibility, and scalable text layouts." },
    { id: "ci-lighthouse", name: "CI Pipeline & Quality Gates", weight: 15, layerId: "accessibility-qa-10", description: "Integration of Lighthouse CI and axe tests in GitHub Actions to automatically block non-compliant code merges." },
    { id: "vpat-documentation", name: "VPAT & Compliance Documentation", weight: 10, layerId: "accessibility-qa-1", description: "Professional VPAT report design mapping technical test findings directly to WCAG 2.1 AA success criteria." },
  ],

  twistPool: [
    { id: "mobile-accessibility-audit", text: "Include a dedicated mobile screen reader audit section evaluating touch target sizes (24x24dp) and VoiceOver/TalkBack gestures." },
    { id: "reduced-motion-testing", text: "Add automated tests verifying application compliance with prefers-reduced-motion media query settings." },
    { id: "high-contrast-mode", text: "Verify component rendering and visible focus outline retention under Windows High Contrast Mode / forced colors." },
    { id: "custom-axe-ruleset", text: "Author a custom axe-core rule extension enforcing organization-specific accessibility standards." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Chaos Engineer track (chaos-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "chaos-engineer",
  categoryId: "qa",
  slug: "chaos-engineer-resilience-testing",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cloud-Native Chaos Engineering & Resilience Suite",
  summary:
    "Design, automate, and execute targeted chaos experiments against a microservices architecture using LitmusChaos and Toxiproxy. " +
    "You will formulate steady-state hypotheses, inject network latency and pod failures, monitor resilience via Prometheus and Grafana, " +
    "and construct automated rollback safeguards in CI/CD.",
  stack: ["Kubernetes", "LitmusChaos", "Toxiproxy", "Prometheus", "Grafana", "Docker", "GitHub Actions"],

  requirements: [
    { id: "steady-state-hypothesis", text: "Formulate and document steady-state hypotheses, blast radius bounds, and abort criteria for all experiments.", check: { type: "file", glob: "**/docs/experiments/*.md" } },
    { id: "litmus-chaosengine", text: "Author LitmusChaos ChaosEngine and ChaosExperiment custom resource definitions (CRDs) for pod and resource attacks.", check: { type: "file", glob: "**/chaos/*.{yml,yaml}" } },
    { id: "network-fault-injection", text: "Configure Toxiproxy stubs or network latency/packet loss injection to simulate service dependency failures.", check: { type: "file", glob: "**/network/*.{js,py,json,yml,yaml}" } },
    { id: "database-chaos", text: "Script a stateful service fault experiment such as primary database failover, connection pool exhaustion, or disk IO saturation.", check: { type: "file", glob: "**/experiments/db_chaos*.py" } },
    { id: "telemetry-prometheus", text: "Instrument application or load generator with Prometheus metrics to measure SLI/SLO recovery during chaos.", check: { type: "file", glob: "**/monitoring/prometheus*.{yml,yaml}" } },
    { id: "grafana-dashboard", text: "Export a Grafana dashboard JSON configuration visualizing system behavior before, during, and after fault injection.", check: { type: "file", glob: "**/dashboards/*.json" } },
    { id: "automated-rollback", text: "Implement automated safety checks that trigger instant experiment abort and system rollback if SLO thresholds are breached." },
    { id: "gameday-report", text: "Document a GameDay execution report detailing MTTR metrics, root cause analysis, and architectural hardening recommendations.", check: { type: "file", glob: "**/docs/gameday-report.md" } },
    { id: "readme", text: "README details local Minikube/Kind cluster setup, LitmusChaos operator installation, and experiment execution commands.", check: { type: "file", glob: "README.md" } },
    { id: "docker-compose", text: "Provide Docker Compose or Helm configurations to deploy the microservice stack and telemetry exporters.", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow executing automated chaos experiments on schedule or pull request.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "experiment-design", name: "Chaos Hypothesis & Design", weight: 25, layerId: "chaos-engineer-2", description: "Quality of steady-state hypotheses, blast radius controls, and risk mitigation planning." },
    { id: "k8s-litmus", name: "Kubernetes & LitmusChaos Execution", weight: 20, layerId: "chaos-engineer-5", description: "Correct CRD structure, pod failure automation, and Kubernetes cluster fault injection." },
    { id: "network-resilience", name: "Network & Dependency Faults", weight: 15, layerId: "chaos-engineer-7", description: "Effective simulation of network latency, circuit breaker testing, and Toxiproxy fault injection." },
    { id: "observability", name: "Observability & SLI/SLO Metrics", weight: 15, layerId: "chaos-engineer-6", description: "Clear visualization of impact and recovery trajectories on Grafana dashboards via Prometheus." },
    { id: "safety-automation", name: "Automated Safety & Rollbacks", weight: 15, layerId: "chaos-engineer-10", description: "Robust automated abort triggers preventing catastrophic failure and verifying auto-healing." },
    { id: "reporting-gameday", name: "GameDay Reporting & Analysis", weight: 10, layerId: "chaos-engineer-9", description: "Actionable root cause analysis, precise MTTR tracking, and system architecture recommendations." },
  ],

  twistPool: [
    { id: "cpu-memory-stress", text: "Include node-level resource starvation experiments (CPU hog and memory pressure) asserting auto-scaling pod behavior." },
    { id: "opentelemetry-tracing", text: "Integrate distributed tracing with Jaeger to trace latency cascades across microservice boundaries during chaos." },
    { id: "redis-cache-failure", text: "Inject cache failure scenarios (Redis pod eviction) to verify graceful fallback to primary database persistence." },
    { id: "pagerduty-webhook", text: "Simulate PagerDuty incident alerting webhooks triggered when availability SLO thresholds drop during an experiment." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — SDET track (sdet), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Java", "Selenium WebDriver", "REST Assured", "Cucumber", "JUnit 5", "Testcontainers", "Maven", "GitHub Actions"],

  requirements: [
    { id: "design-patterns", text: "Implement Singleton for WebDriver management, Factory for browser instantiation, and Builder pattern for test data creation.", check: { type: "file", glob: "src/main/**/*.java" } },
    { id: "bdd-cucumber", text: "Write structured Gherkin feature files with Given/When/Then scenarios and step definitions mapping UI and API behaviors.", check: { type: "file", glob: "src/test/resources/**/*.feature" } },
    { id: "ui-automation", text: "Build Page Object Model classes with Fluent Interface pattern and explicit synchronization waits.", check: { type: "file", glob: "src/test/**/*.java" } },
    { id: "api-automation", text: "Include REST Assured API tests with POJO serialization/deserialization via Jackson.", check: { type: "file", glob: "src/test/**/*.java" } },
    { id: "testcontainers", text: "Integrate Testcontainers to spin up isolated database or wiremock containers during integration tests.", check: { type: "file", glob: "src/test/**/Test*Container*.java" } },
    { id: "unit-mockito", text: "Write unit and controller tests using JUnit 5 parameterized tests and Mockito dynamic mocking.", check: { type: "file", glob: "src/test/**/Mock*.java" } },
    { id: "retry-listener", text: "Implement custom TestNG/JUnit listeners and retry analyzers to handle flaky tests and capture failure screenshots." },
    { id: "synthetic-data", text: "Use Java Faker or custom generators for on-demand synthetic test data instantiation." },
    { id: "pom-xml", text: "Configure Maven pom.xml with profiles for parallel execution, plugins, and dependencies.", check: { type: "file", glob: "pom.xml" } },
    { id: "readme", text: "README details framework architecture, design patterns used, container requirements, and test runner triggers.", check: { type: "file", glob: "README.md" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions pipeline executing multi-threaded parallel test matrices and archiving reports.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "env-example", text: "Provide an environment configuration file template for database credentials, base URLs, and browser settings.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "patterns-architecture", name: "Design Patterns & Code Quality", weight: 25, layerId: "sdet-5", description: "Correct implementation of software design patterns (Singleton, Factory, Builder, Fluent Interface) in framework design." },
    { id: "bdd-gherkin", name: "BDD & Test Design", weight: 20, layerId: "sdet-7", description: "Readable Gherkin features, clean Cucumber step definition bindings, and reusable step components." },
    { id: "integration-containers", name: "Integration Testing & Testcontainers", weight: 15, layerId: "sdet-6", description: "Effective use of Testcontainers and Mockito for isolated, deterministic, and repeatable test environments." },
    { id: "ui-api-automation", name: "UI & API Automation Core", weight: 15, layerId: "sdet-2", description: "Robust Selenium explicitly-waited UI tests combined with REST Assured API validation." },
    { id: "ci-governance", name: "CI Pipeline & Parallel Execution", weight: 15, layerId: "sdet-10", description: "Parallel test execution setup in GitHub Actions with robust reporting and retry listeners." },
    { id: "data-env-management", name: "Test Data & Documentation", weight: 10, layerId: "sdet-8", description: "Clean synthetic data generation strategy and comprehensive architecture documentation." },
  ],

  twistPool: [
    { id: "gatling-performance-mix", text: "Integrate a Gatling Java DSL performance test scenario executing within the Maven build lifecycle." },
    { id: "zap-dast-maven", text: "Configure the OWASP ZAP Maven plugin to run automated security scans as part of the integration test suite." },
    { id: "db-seeding-teardown", text: "Implement direct database seeding and automatic state cleanup before and after each test suite execution." },
    { id: "sonarqube-quality-gate", text: "Integrate SonarQube static code analysis into the build pipeline with failure thresholds on test code complexity." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — API Tester track (api-qa), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-qa",
  categoryId: "qa",
  slug: "api-qa-test-automation-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Protocol API Testing & Contract Suite",
  summary:
    "Build an automated API testing project using Java and REST Assured. " +
    "You will test RESTful services, construct Consumer-Driven Contract tests with Pact, mock external dependencies using WireMock, " +
    "validate OAuth2 authentication flows, and execute automated Newman or Maven API pipelines.",
  stack: ["Java", "REST Assured", "Pact", "WireMock", "Postman / Newman", "Maven", "GitHub Actions"],

  requirements: [
    { id: "rest-assured-suite", text: "Write comprehensive REST Assured API tests utilizing Given/When/Then DSL structure.", check: { type: "file", glob: "src/test/**/*.java" } },
    { id: "pojo-mapping", text: "Map request and response payloads to Java POJOs using Jackson for serialization and deserialization." },
    { id: "json-schema-validation", text: "Implement strict JSON schema validation assertions for all API responses.", check: { type: "file", glob: "src/test/resources/**/*.json" } },
    { id: "auth-testing", text: "Automate API authentication workflows including OAuth2 token retrieval and Bearer token headers." },
    { id: "pact-contract-testing", text: "Create consumer-driven contract tests using Pact and generate contract pact files.", check: { type: "file", glob: "**/pacts/*.json" } },
    { id: "wiremock-virtualization", text: "Configure WireMock stubs and response templates to simulate third-party API dependencies.", check: { type: "file", glob: "src/test/**/WireMock*.java" } },
    { id: "postman-newman", text: "Include a Postman collection covering API edge cases executable via Newman CLI script.", check: { type: "file", glob: "**/*.postman_collection.json" } },
    { id: "pom-xml", text: "Organize dependencies, surefire plugins, and test execution profiles in Maven pom.xml.", check: { type: "file", glob: "pom.xml" } },
    { id: "readme", text: "README provides detailed setup instructions, test execution commands, and contract publication steps.", check: { type: "file", glob: "README.md" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow executing REST Assured, Pact verification, and Newman tests.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "env-example", text: "Provide an environment variable configuration file template for host URLs and authentication keys.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "rest-assured-design", name: "REST Assured Framework Architecture", weight: 25, layerId: "api-qa-3", description: "Clean usage of REST Assured DSL, POJO serialization, schema assertions, and request specifications." },
    { id: "contract-testing", name: "Contract Testing with Pact", weight: 20, layerId: "api-qa-7", description: "Effective implementation of consumer-driven contract tests and contract lifecycle verification." },
    { id: "auth-security", name: "API Authentication & Security", weight: 15, layerId: "api-qa-6", description: "Robust handling and validation of OAuth2 flows, token expiration, and unauthorized access." },
    { id: "virtualization", name: "Service Virtualization", weight: 15, layerId: "api-qa-9", description: "Realistic WireMock stubs handling dynamic response templating and fault injection." },
    { id: "ci-automation", name: "Pipeline & CLI Automation", weight: 15, layerId: "api-qa-10", description: "Continuous integration automation combining Maven test runs and Newman CLI report generation." },
    { id: "docs-maintenance", name: "Documentation & Quality", weight: 10, layerId: "api-qa-4", description: "Clear README setup instructions, readable test reports, and logical collection folder structures." },
  ],

  twistPool: [
    { id: "graphql-testing", text: "Extend test suite coverage to include GraphQL queries, mutations, and error array validations." },
    { id: "pact-broker-upload", text: "Integrate Pact Broker contract publishing and verification tasks into the build workflow." },
    { id: "data-driven-excel", text: "Implement data-driven API testing retrieving request parameters dynamically from Apache POI Excel files." },
    { id: "rate-limit-resilience", text: "Add automated tests asserting HTTP 429 Too Many Requests response handling and Retry-After headers." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Mobile QA Engineer track (mobile-qa), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "mobile-qa",
  categoryId: "qa",
  slug: "mobile-qa-appium-test-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cross-Platform Mobile Automation Framework",
  summary:
    "Build a mobile test automation framework using Appium, Python, and Pytest. " +
    "You will design screen objects for native mobile flows, automate complex gestures and app interrupts, " +
    "measure mobile performance metrics, and orchestrate automated test runs in CI using Fastlane.",
  stack: ["Python", "Appium", "Pytest", "Fastlane", "GitHub Actions"],

  requirements: [
    { id: "screen-object-model", text: "Implement the Screen Object Model architecture with a BaseScreen class organizing mobile locators and drivers.", check: { type: "file", glob: "**/screens/*.py" } },
    { id: "e2e-mobile-flows", text: "Automate core mobile app workflows including user registration, login, and multi-screen navigation.", check: { type: "file", glob: "**/tests/test_flows*.py" } },
    { id: "gesture-automation", text: "Script automated touch actions for complex gestures including swipes, dynamic scrolls, and pinch-to-zoom.", check: { type: "file", glob: "**/tests/test_gestures*.py" } },
    { id: "interrupt-testing", text: "Automate system interrupt scenarios handling deep links, network connection toggles, and app backgrounding." },
    { id: "performance-metrics", text: "Collect and assert mobile performance metrics including application launch latency, CPU load, and memory usage.", check: { type: "file", glob: "**/tests/test_performance*.py" } },
    { id: "mobile-accessibility", text: "Include accessibility locator verification ensuring content descriptions and accessibility labels are present." },
    { id: "pytest-fixtures", text: "Organize Appium driver capabilities, device sessions, and test teardown using Pytest fixtures.", check: { type: "file", glob: "**/conftest.py" } },
    { id: "fastlane-config", text: "Provide a Fastlane setup file automating app builds or test runner triggers.", check: { type: "file", glob: "**/Fastfile" } },
    { id: "readme", text: "README explains Appium server configuration, simulator/emulator setup, desired capabilities, and local runner execution.", check: { type: "file", glob: "README.md" } },
    { id: "ci-workflow", text: "Configure a GitHub Actions pipeline triggering automated headless mobile test runs or matrix configurations.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "env-example", text: "Provide environment variable configuration file templates for mobile capabilities and device credentials.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "screen-architecture", name: "Screen Object Architecture", weight: 25, layerId: "mobile-qa-9", description: "Clean Screen Object pattern implementation separating UI locators from test logic with BaseScreen reuse." },
    { id: "appium-automation", name: "Appium Automation Mastery", weight: 20, layerId: "mobile-qa-2", description: "Robust usage of Appium locators, explicit waits, context switching, and driver session handling." },
    { id: "gestures-interrupts", name: "Gestures & Interrupt Handling", weight: 15, layerId: "mobile-qa-6", description: "Reliable execution of touch gestures, deep links, push notification assertions, and system state disruptions." },
    { id: "performance-a11y", name: "Mobile Performance & Accessibility", weight: 15, layerId: "mobile-qa-7", description: "Accurate tracking of startup performance and validation of accessibility labels and target sizes." },
    { id: "ci-fastlane", name: "CI & Mobile Build Pipelines", weight: 15, layerId: "mobile-qa-10", description: "Effective pipeline integration using Fastlane and GitHub Actions for continuous mobile quality." },
    { id: "docs-setup", name: "Documentation & Operability", weight: 10, layerId: "mobile-qa-1", description: "Comprehensive documentation covering local device configuration, ADB/iOS setups, and test logs." },
  ],

  twistPool: [
    { id: "parallel-device-matrix", text: "Configure parallel test execution across multiple emulator/simulator instances using pytest-xdist." },
    { id: "battery-drain-monitor", text: "Implement an automated test module logging battery drain and device temperature metrics during extended test runs." },
    { id: "biometric-auth-mock", text: "Simulate biometric authentication (TouchID/FaceID) interactions via Appium commands within the login workflow." },
    { id: "network-mocking-mobile", text: "Integrate local proxy tools to intercept mobile API traffic and simulate offline sync behavior." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Security Tester track (security-qa), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "security-qa",
  categoryId: "qa",
  slug: "security-qa-dast-vulnerability-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated DAST & Security Regression Suite",
  summary:
    "Design and implement an automated web security testing framework using OWASP ZAP, Python, and Selenium/Playwright. " +
    "You will audit target web services for OWASP Top 10 vulnerabilities, construct custom security regression scripts, " +
    "threat-model application boundaries, and build a zero-tolerance security gate into a CI/CD pipeline.",
  stack: ["Python", "OWASP ZAP", "Selenium or Playwright", "Docker", "GitHub Actions"],

  requirements: [
    { id: "zap-automation", text: "Configure OWASP ZAP daemon and spider scripts to automate active and passive security scanning.", check: { type: "file", glob: "**/zap/*.py" } },
    { id: "auth-scan-context", text: "Script authenticated scanning logic handling JWT bearer tokens or session cookies within ZAP automation." },
    { id: "injection-tests", text: "Write custom automated test scripts verifying resilience against SQL injection, XSS, and command execution.", check: { type: "file", glob: "**/tests/test_injection*.py" } },
    { id: "authz-bola-tests", text: "Implement security regression tests validating Broken Object Level Authorization (BOLA) and privilege escalation.", check: { type: "file", glob: "**/tests/test_authorization*.py" } },
    { id: "threat-model", text: "Produce a STRIDE threat model document mapping data flow diagrams, trust boundaries, and mitigation controls.", check: { type: "file", glob: "**/docs/threat-model.md" } },
    { id: "security-report", text: "Generate structured JSON/HTML vulnerability assessment reports categorizing findings by OWASP risk scores.", check: { type: "file", glob: "**/reports/*.{json,html}" } },
    { id: "zap-proxy-fixture", text: "Route browser test automation traffic through ZAP local proxy to capture hidden API endpoints during execution." },
    { id: "rate-limit-check", text: "Include automated scripts testing endpoint throttling, brute-force protections, and rate-limit bypasses." },
    { id: "readme", text: "README covers local target setup, ZAP context configuration, security scan triggers, and vulnerability reporting.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "Containerize the security scanner and target application environment using Docker Compose.", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions pipeline running headless DAST scans and breaking builds on high-severity vulnerabilities.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "env-example", text: "Provide an environment variable configuration file template masking sensitive API credentials and scanning keys.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "dast-execution", name: "DAST & ZAP Integration", weight: 25, layerId: "security-qa-3", description: "Effective automation of OWASP ZAP scanning, including authentication contexts and session token management." },
    { id: "injection-auth", name: "Vulnerability Test Design", weight: 20, layerId: "security-qa-4", description: "Depth of custom regression tests covering SQLi, XSS, CSRF, and authorization escalation vectors." },
    { id: "api-security", name: "API Security & Authorization", weight: 15, layerId: "security-qa-7", description: "Thorough validation of OWASP API security issues such as BOLA, mass assignment, and rate limiting." },
    { id: "threat-modeling", name: "Threat Modeling & Risk", weight: 15, layerId: "security-qa-9", description: "Clarity and detail of the STRIDE threat model, risk scoring, and security control mapping." },
    { id: "ci-security-gate", name: "CI/CD Pipeline Security Gate", weight: 15, layerId: "security-qa-10", description: "Integration of containerized DAST runs into CI with automated build failure thresholds on findings." },
    { id: "docs-reporting", name: "Documentation & Findings", weight: 10, layerId: "security-qa-8", description: "Clear vulnerability reporting, reproducible proof-of-concepts, and remediation guidelines." },
  ],

  twistPool: [
    { id: "jwt-fuzzing", text: "Incorporate automated JWT security checks testing algorithm substitution (none-alg), signature stripping, and expired tokens." },
    { id: "cors-csrf-audit", text: "Add dedicated automated verification of CORS wildcards, credentialed origin headers, and anti-CSRF token enforcement." },
    { id: "security-headers-gate", text: "Build an automated audit module validating HTTP security headers (CSP, HSTS, X-Frame-Options) across all routes." },
    { id: "dependency-sast-mix", text: "Integrate static dependency vulnerability scanning alongside DAST execution in the CI pipeline." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — Performance Tester track (performance), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "performance",
  categoryId: "qa",
  slug: "performance-load-testing-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Distributed Load & Performance Testing Suite",
  summary:
    "Design, script, and execute a comprehensive performance testing suite using k6. " +
    "You will simulate realistic load patterns, establish SLO threshold gates, profile server-side bottlenecks, " +
    "and publish real-time telemetry metrics to a Grafana dashboard.",
  stack: ["k6", "JavaScript", "Docker", "Prometheus", "Grafana", "GitHub Actions"],

  requirements: [
    { id: "k6-scripting", text: "Modular k6 test scripts covering key user journeys with custom checks and dynamic parameterization.", check: { type: "file", glob: "**/scripts/*.js" } },
    { id: "load-scenarios", text: "Define virtual user profiles and stages for ramp-up, steady-state load, stress, and spike scenarios.", check: { type: "file", glob: "**/scenarios/*.js" } },
    { id: "slo-thresholds", text: "Configure explicit k6 thresholds asserting response time percentiles (p90, p95, p99) and error rates." },
    { id: "test-data-feeders", text: "Incorporate external CSV or JSON test data parameterization for multi-user authentication loads.", check: { type: "file", glob: "**/data/*.{csv,json}" } },
    { id: "custom-metrics", text: "Implement custom k6 Trend, Counter, and Rate metrics to measure domain-specific operation latencies." },
    { id: "observability", text: "Provide Docker Compose setup configuring Grafana and Prometheus/InfluxDB to visualize live execution telemetry.", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "dashboard-config", text: "Export Grafana dashboard configuration JSON files monitoring throughput, response percentiles, and errors.", check: { type: "file", glob: "**/dashboards/*.json" } },
    { id: "bottleneck-analysis", text: "Write an in-depth performance analysis report detailing identified system bottlenecks and tuning solutions.", check: { type: "file", glob: "**/docs/analysis-report.md" } },
    { id: "readme", text: "README clearly outlines environment setup, load generation instructions, and threshold interpretation guidelines.", check: { type: "file", glob: "README.md" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow that executes automated k6 performance regression checks against thresholds.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "script-design", name: "k6 Script Architecture", weight: 25, layerId: "performance-3", description: "Modular JavaScript k6 code structure, parameterization, dynamic think times, and custom metrics." },
    { id: "scenario-modeling", name: "Load Scenario Modeling", weight: 20, layerId: "performance-7", description: "Accurate modeling of realistic traffic patterns including ramp-up, spike tests, and soak tests." },
    { id: "slo-thresholds", name: "SLO & Threshold Design", weight: 15, layerId: "performance-9", description: "Rigorous definition of percentile latency requirements (p90/p95/p99) and failure gates." },
    { id: "observability", name: "Telemetry & Dashboards", weight: 15, layerId: "performance-5", description: "Effective Grafana integration visualizing real-time test execution and system performance indicators." },
    { id: "analysis-report", name: "Analysis & Recommendations", weight: 15, layerId: "performance-6", description: "Depth of root-cause analysis in identifying CPU, database, memory, or network bottlenecks." },
    { id: "ci-automation", name: "Continuous Performance", weight: 10, layerId: "performance-10", description: "Automated pipeline execution enforcing performance budgets and failure thresholds on push." },
  ],

  twistPool: [
    { id: "soak-test-leak", text: "Include an extended duration soak test script designed to identify memory leaks and database resource exhaustion over time." },
    { id: "network-throttling", text: "Simulate packet drops and latency degradation at the load generator level to measure resilience under poor network conditions." },
    { id: "distributed-execution", text: "Configure distributed load generation across multiple worker instances or containers to achieve high concurrency." },
    { id: "chaos-during-load", text: "Inject background server errors or service restarts during a steady-state load run and analyze system recovery times." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Performance Tester track (performance), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "performance",
  categoryId: "qa",
  slug: "performance-load-testing-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Distributed Load & Performance Testing Suite",
  summary:
    "Design, script, and execute a comprehensive performance testing suite using k6. " +
    "You will simulate realistic load patterns, establish SLO threshold gates, profile server-side bottlenecks, " +
    "and publish real-time telemetry metrics to a Grafana dashboard.",
  stack: ["k6", "JavaScript", "Docker", "Prometheus", "Grafana", "GitHub Actions"],

  requirements: [
    { id: "k6-scripting", text: "Modular k6 test scripts covering key user journeys with custom checks and dynamic parameterization.", check: { type: "file", glob: "**/scripts/*.js" } },
    { id: "load-scenarios", text: "Define virtual user profiles and stages for ramp-up, steady-state load, stress, and spike scenarios.", check: { type: "file", glob: "**/scenarios/*.js" } },
    { id: "slo-thresholds", text: "Configure explicit k6 thresholds asserting response time percentiles (p90, p95, p99) and error rates." },
    { id: "test-data-feeders", text: "Incorporate external CSV or JSON test data parameterization for multi-user authentication loads.", check: { type: "file", glob: "**/data/*.{csv,json}" } },
    { id: "custom-metrics", text: "Implement custom k6 Trend, Counter, and Rate metrics to measure domain-specific operation latencies." },
    { id: "observability", text: "Provide Docker Compose setup configuring Grafana and Prometheus/InfluxDB to visualize live execution telemetry.", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "dashboard-config", text: "Export Grafana dashboard configuration JSON files monitoring throughput, response percentiles, and errors.", check: { type: "file", glob: "**/dashboards/*.json" } },
    { id: "bottleneck-analysis", text: "Write an in-depth performance analysis report detailing identified system bottlenecks and tuning solutions.", check: { type: "file", glob: "**/docs/analysis-report.md" } },
    { id: "readme", text: "README clearly outlines environment setup, load generation instructions, and threshold interpretation guidelines.", check: { type: "file", glob: "README.md" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow that executes automated k6 performance regression checks against thresholds.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "script-design", name: "k6 Script Architecture", weight: 25, layerId: "performance-3", description: "Modular JavaScript k6 code structure, parameterization, dynamic think times, and custom metrics." },
    { id: "scenario-modeling", name: "Load Scenario Modeling", weight: 20, layerId: "performance-7", description: "Accurate modeling of realistic traffic patterns including ramp-up, spike tests, and soak tests." },
    { id: "slo-thresholds", name: "SLO & Threshold Design", weight: 15, layerId: "performance-9", description: "Rigorous definition of percentile latency requirements (p90/p95/p99) and failure gates." },
    { id: "observability", name: "Telemetry & Dashboards", weight: 15, layerId: "performance-5", description: "Effective Grafana integration visualizing real-time test execution and system performance indicators." },
    { id: "analysis-report", name: "Analysis & Recommendations", weight: 15, layerId: "performance-6", description: "Depth of root-cause analysis in identifying CPU, database, memory, or network bottlenecks." },
    { id: "ci-automation", name: "Continuous Performance", weight: 10, layerId: "performance-10", description: "Automated pipeline execution enforcing performance budgets and failure thresholds on push." },
  ],

  twistPool: [
    { id: "soak-test-leak", text: "Include an extended duration soak test script designed to identify memory leaks and database resource exhaustion over time." },
    { id: "network-throttling", text: "Simulate packet drops and latency degradation at the load generator level to measure resilience under poor network conditions." },
    { id: "distributed-execution", text: "Configure distributed load generation across multiple worker instances or containers to achieve high concurrency." },
    { id: "chaos-during-load", text: "Inject background server errors or service restarts during a steady-state load run and analyze system recovery times." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Manual Tester track (manual), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "test-plan", text: "Write a comprehensive Master Test Plan document detailing test scope, strategy, environments, and risk analysis.", check: { type: "file", glob: "**/docs/test-plan.md" } },
    { id: "test-cases", text: "Design at least 20 structured test cases using equivalence partitioning and boundary value analysis.", check: { type: "file", glob: "**/test-cases/*.md" } },
    { id: "bug-reports", text: "Document realistic defect reports complete with steps to reproduce, expected/actual results, severity, and priority.", check: { type: "file", glob: "**/bug-reports/*.md" } },
    { id: "postman-collection", text: "Create a Postman collection containing API test requests, environments, and JavaScript test assertions.", check: { type: "file", glob: "**/*.postman_collection.json" } },
    { id: "sql-validation", text: "Write SQL query scripts to perform data integrity checks comparing UI outcomes against backend tables.", check: { type: "file", glob: "**/sql/*.sql" } },
    { id: "exploratory-charter", text: "Document an exploratory testing charter with session notes, SFDPOT heuristics, and discovered edge cases.", check: { type: "file", glob: "**/docs/exploratory-session.md" } },
    { id: "accessibility-audit", text: "Perform a manual accessibility and WCAG 2.1 AA audit with documented keyboard and screen reader findings.", check: { type: "file", glob: "**/docs/accessibility-audit.md" } },
    { id: "matrix-traceability", text: "Build a Requirements Traceability Matrix (RTM) linking requirements to test cases and defects.", check: { type: "file", glob: "**/docs/rtm.md" } },
    { id: "readme", text: "Provide a project overview explaining test execution instructions, API collection usage, and SQL setups.", check: { type: "file", glob: "README.md" } },
    { id: "ci-validation", text: "Include a GitHub Actions workflow that validates Postman collections using Newman CLI.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "design-techniques", name: "Test Case Design", weight: 25, layerId: "manual-2", description: "Effective application of black-box design techniques like boundary value analysis and equivalence partitioning." },
    { id: "defect-reporting", name: "Bug Quality & Tracking", weight: 20, layerId: "manual-3", description: "Clear, reproducible defect reports with accurate severity/priority classifications and logs." },
    { id: "api-testing", name: "API & Postman Testing", weight: 15, layerId: "manual-5", description: "Well-structured Postman collections using environment variables and dynamic assertions." },
    { id: "database-qa", name: "Database Validation", weight: 15, layerId: "manual-6", description: "Accurate SQL scripts that thoroughly test backend schema integrity and state consistency." },
    { id: "exploratory-a11y", name: "Exploratory & Accessibility", weight: 15, layerId: "manual-8", description: "Structured exploratory session charters and systematic WCAG compliance evaluation." },
    { id: "strategy-process", name: "Strategy & Process", weight: 10, layerId: "manual-1", description: "Comprehensive test planning, traceability mapping, and organized project documentation." },
  ],

  twistPool: [
    { id: "decision-tables", text: "Include a complex multi-factor business rule scenario fully modeled and tested via a Decision Table matrix." },
    { id: "localization-testing", text: "Conduct a localization (l10n) audit assessing UI character encoding, date formats, and layout overflow." },
    { id: "state-transition", text: "Map an intricate user lifecycle flow using state transition diagrams and corresponding test cases." },
    { id: "release-signoff", text: "Create an executive QA Sign-Off report including defect density metrics and release entry/exit criteria." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Automation Engineer track (automation), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "pytest-fixtures", text: "Organize test suite configuration, browser contexts, and API clients using Pytest fixtures in conftest.py.", check: { type: "file", glob: "**/conftest.py" } },
    { id: "pom-architecture", text: "Implement Page Object Model (POM) design pattern with reusable BasePage and component classes for UI flows.", check: { type: "file", glob: "**/pages/*.py" } },
    { id: "e2e-ui-tests", text: "Automate E2E UI workflows including multi-step form submissions, navigation, and state validation.", check: { type: "file", glob: "**/tests/test_ui*.py" } },
    { id: "api-integration", text: "Include automated REST API test coverage using HTTP requests, asserting status codes and JSON schema schemas.", check: { type: "file", glob: "**/tests/test_api*.py" } },
    { id: "data-driven", text: "Implement data-driven testing using Pytest parameterization reading test cases from JSON or CSV files.", check: { type: "file", glob: "**/data/*.{json,csv}" } },
    { id: "network-mocking", text: "Interceptors and mocks are used in Playwright to simulate network errors and edge-case API responses." },
    { id: "visual-testing", text: "Include visual snapshot comparison checks for key pages or UI components." },
    { id: "custom-reporting", text: "Generate structured HTML or JUnit XML test execution reports and artifact logs." },
    { id: "readme", text: "README provides instructions for running tests locally, configuring environments, and execution options.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "Provide a Dockerfile to run the Playwright test suite in a standardized container environment.", check: { type: "file", glob: "Dockerfile" } },
    { id: "ci-pipeline", text: "Configure a GitHub Actions workflow that executes UI and API tests in parallel and archives test reports.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "env-example", text: "Configuration settings and base URLs are driven by environment variables with an template provided.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness & Coverage", weight: 25, layerId: "automation-5", description: "Automated E2E and API scenarios reliably cover functional flows, edge cases, and custom twist rules." },
    { id: "architecture", name: "Framework Architecture", weight: 20, layerId: "automation-4", description: "Clean Page Object Model implementation, separation of concerns, and clean abstraction layers." },
    { id: "fixtures-hooks", name: "Fixtures & Test Setup", weight: 15, layerId: "automation-9", description: "Effective use of Pytest fixtures, scoping, dynamic configurations, and clean teardown execution." },
    { id: "api-testing", name: "API & Data Validation", weight: 15, layerId: "automation-6", description: "Comprehensive API tests validating HTTP codes, response payloads, and JSON schema boundaries." },
    { id: "ci-containerization", name: "CI/CD & Execution", weight: 15, layerId: "automation-10", description: "Containerized execution and parallel pipeline runs on GitHub Actions with uploaded test artifacts." },
    { id: "docs-reporting", name: "Documentation & Logs", weight: 10, layerId: "automation-7", description: "Clear README documentation, structured log outputs, and readable test execution reports." },
  ],

  twistPool: [
    { id: "auth-session-reuse", text: "Inject authenticated browser state across UI tests via storageState files to eliminate repetitive login steps." },
    { id: "database-validation", text: "Integrate direct database query assertions (SQLite or PostgreSQL) to verify backend persistence after UI actions." },
    { id: "network-throttling", text: "Simulate poor network conditions (3G latency) during E2E scenarios and assert graceful loading states." },
    { id: "multi-browser-matrix", text: "Run automated visual and functional cross-browser regression matrices across Chromium, Firefox, and WebKit." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};