You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/qa/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "qa" instead):

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
1. trackId = the track id exactly as given below. categoryId = "qa". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
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

### automation — Automation Engineer
  - automation-1 | Testing Fundamentals and QA Mindset | topics: Software testing principles; Test types: unit, integration, E2E; Defect lifecycle and severity; Python basics for testers
  - automation-2 | Selenium WebDriver Basics | topics: WebDriver setup and configuration; Locator strategies: ID, CSS, XPath; Browser interactions and navigation; Form filling and submission
  - automation-3 | TestNG Framework and Test Organization | topics: Java basics for testers; TestNG annotations: @Test, @BeforeMethod, @AfterClass; Test grouping and prioritization; Data-driven testing with @DataProvider
  - automation-4 | Page Object Model and Test Design Patterns | topics: Page Object Model design pattern; BasePage class creation; Separation of concerns in test code; Reusable component objects
  - automation-5 | Playwright for Modern Web Automation | topics: Playwright installation and configuration; Browser contexts and pages; Auto-waiting mechanisms; Network interception and mocking
  - automation-6 | API Testing and Integration | topics: HTTP methods and status codes; Requests library for Python; JSON response validation; JSON Schema validation
  - automation-7 | Data-Driven Testing and Test Management | topics: Parameterization with Pytest; Reading test data from CSV and Excel; Database-driven test data; Test case tagging and filtering
  - automation-8 | Cross-Browser and Visual Testing | topics: Playwright multi-browser configuration; Selenium Grid architecture; BrowserStack integration; Visual regression testing concepts
  - automation-9 | Advanced Patterns: Fixtures, Hooks, and Reporting | topics: Pytest fixture scopes and dependency injection; conftest.py organization strategies; Custom Pytest plugins and hooks; Structured logging in tests
  - automation-10 | CI/CD Integration and Production Pipeline | topics: GitHub Actions workflow authoring; Dockerizing Playwright test suites; Parallel test sharding in CI; Test result artifacts and notifications

### manual — Manual Tester
  - manual-1 | QA Foundations and Testing Principles | topics: SDLC and STLC overview; QA vs QC vs testing; Testing principles and fallacies; Agile and Scrum for QA
  - manual-2 | Test Case Design Techniques | topics: Equivalence partitioning; Boundary value analysis; Decision table testing; State transition testing
  - manual-3 | Jira for Bug Tracking and Project Management | topics: Jira project setup and configuration; Writing effective bug reports; Bug severity vs priority; Jira workflows and transitions
  - manual-4 | TestRail for Test Management | topics: TestRail structure: projects, suites, sections; Creating and organizing test cases; Test run creation and assignment; Milestones and release tracking
  - manual-5 | API Testing with Postman | topics: HTTP methods, headers, and status codes; Postman workspace and collections; Environment variables in Postman; Writing Postman tests with JavaScript
  - manual-6 | Database Testing with SQL | topics: SQL SELECT, WHERE, JOIN basics; Aggregation functions: COUNT, SUM, GROUP BY; Data integrity and constraint validation; Comparing UI data with DB records
  - manual-7 | Regression and Smoke Testing Strategies | topics: Smoke vs sanity vs regression testing; Risk-based test prioritization; Regression suite maintenance; Impact analysis for change requests
  - manual-8 | Exploratory Testing and Session-Based Testing | topics: Exploratory testing vs scripted testing; Test charters and session structure; Heuristics: SFDPOT, FEW HICCUPPS; Note-taking and bug capture during sessions
  - manual-9 | Usability, Accessibility, and Cross-Browser Testing | topics: Usability heuristics - Nielsen 10; WCAG 2.1 AA guidelines overview; Manual accessibility checks; Cross-browser testing strategies
  - manual-10 | Release QA, Metrics, and Process Ownership | topics: Release test planning and scheduling; Entry and exit criteria definition; QA sign-off process and checklists; Defect density and escape rate metrics

### performance — Performance Tester
  - performance-1 | Performance Testing Fundamentals | topics: Performance test types and when to use them; Key metrics: throughput, latency, error rate; Response time percentiles: p50, p90, p99; Bottleneck identification concepts
  - performance-2 | JMeter Test Plan Design | topics: Thread groups and ramp-up configuration; HTTP Request samplers; Config elements: HTTP Header Manager, Cookie Manager; CSV Data Set Config for parameterization
  - performance-3 | k6 for Modern Load Testing | topics: k6 installation and script structure; Virtual users and stages configuration; k6 checks and thresholds; Custom metrics in k6
  - performance-4 | Gatling for Scala-Based Load Testing | topics: Gatling project setup with Maven; Simulation structure and scenarios; Feeders for test data injection; Gatling DSL: exec, pause, repeat
  - performance-5 | Grafana Dashboards and Observability | topics: Grafana panels, queries, and variables; InfluxDB data model and queries; Prometheus metrics and exporters; Correlating load test data with app metrics
  - performance-6 | Profiling and Bottleneck Analysis | topics: CPU, memory, I/O bottleneck identification; JVM heap and GC analysis; Thread dump analysis; Slow query identification with EXPLAIN
  - performance-7 | Stress, Spike, and Soak Testing | topics: Stress testing to find the breaking point; Spike test design and interpretation; Soak test duration and monitoring; Defining pass/fail criteria per test type
  - performance-8 | API and Microservices Performance Testing | topics: API-level performance test design; Isolating microservice performance; Distributed tracing with Jaeger basics; Contract and integration performance tests
  - performance-9 | Performance Test Reporting and SLA Definition | topics: Defining SLAs and SLOs for APIs; Performance baseline establishment; Trend analysis across releases; Writing executive performance reports
  - performance-10 | CI/CD Integration and Continuous Performance Testing | topics: k6 in GitHub Actions pipelines; Automated threshold-based pass/fail; Nightly performance regression runs; Performance trend dashboards for CI

### security-qa — Security Tester
  - security-qa-1 | Web Security Fundamentals for Testers | topics: OWASP Top 10 overview; HTTP request and response anatomy; Cookies, sessions, and tokens; Same-origin policy and CORS
  - security-qa-2 | Burp Suite for Manual Security Testing | topics: Burp Suite proxy setup; Intercepting and modifying requests; Repeater for manual request manipulation; Intruder for parameter fuzzing
  - security-qa-3 | OWASP ZAP for DAST Scanning | topics: ZAP installation and daemon mode; Spider and AJAX spider configuration; Passive vs active scanning; ZAP alerts: risk and confidence levels
  - security-qa-4 | Injection Vulnerabilities: SQL, XSS, Command | topics: SQL injection types: classic, blind, time-based; XSS: reflected, stored, DOM-based; OS command injection patterns; CSRF fundamentals
  - security-qa-5 | Authentication and Authorization Testing | topics: Brute force and account lockout testing; Session token entropy and fixation; JWT vulnerability testing; Vertical and horizontal privilege escalation
  - security-qa-6 | Security Test Automation with Selenium | topics: ZAP as Selenium proxy setup; Authenticated scanning with session tokens; Passive scanning during functional tests; Integrating ZAP alerts into test results
  - security-qa-7 | API Security Testing | topics: OWASP API Security Top 10; Broken Object Level Authorization testing; Mass assignment vulnerability testing; Rate limiting and throttling bypass
  - security-qa-8 | Security Regression and Compliance Testing | topics: Security regression test suite design; Mapping tests to compliance requirements; PCI-DSS relevant security controls; OWASP ASVS for test coverage
  - security-qa-9 | Threat Modeling and Security Test Planning | topics: STRIDE threat modeling methodology; Data flow diagrams for threat modeling; OWASP Threat Dragon tool; Attack trees and abuse cases
  - security-qa-10 | CI/CD DAST Integration and Secure SDLC | topics: ZAP Docker image in CI/CD pipelines; GitHub Actions security workflows; Threshold-based security gates; SAST vs DAST in a pipeline

### mobile-qa — Mobile QA Engineer
  - mobile-qa-1 | Mobile Testing Fundamentals | topics: Android vs iOS testing differences; Mobile SDLC and release cycles; ADB command line basics; iOS Simulator and Android Emulator setup
  - mobile-qa-2 | Appium Setup and Basic Automation | topics: Appium architecture overview; Appium server setup and configuration; Desired Capabilities for Android; Finding elements with Appium Inspector
  - mobile-qa-3 | XCTest for iOS Native Testing | topics: XCTest framework structure; XCUIApplication and element queries; Assertions in XCTest; XCTest performance metrics
  - mobile-qa-4 | Espresso for Android Native Testing | topics: Espresso architecture and synchronization; ViewMatchers, ViewActions, ViewAssertions; Handling async operations with IdlingResource; Espresso Intents for testing navigation
  - mobile-qa-5 | BrowserStack and Real Device Testing | topics: BrowserStack App Automate setup; Uploading apps to BrowserStack; Desired Capabilities for BrowserStack; Parallel test execution on real devices
  - mobile-qa-6 | Mobile Test Design: Gestures and Interrupts | topics: Implementing swipe, scroll, pinch with Appium; Deep link testing automation; Push notification testing strategies; Incoming call and SMS interrupt testing
  - mobile-qa-7 | Mobile Performance and Battery Testing | topics: App launch time measurement; Frame rate and jank detection; Memory leak identification on mobile; Battery drain testing methodology
  - mobile-qa-8 | Mobile Accessibility Testing | topics: TalkBack and VoiceOver screen reader testing; Content descriptions and accessibility labels; Touch target size requirements; Color contrast for mobile
  - mobile-qa-9 | Page Object Model for Mobile Automation | topics: Screen Object pattern for mobile; BaseScreen class design; Appium test fixtures with Pytest; Parallel execution with pytest-xdist
  - mobile-qa-10 | CI/CD for Mobile and Release Automation | topics: Fastlane for iOS and Android automation; GitHub Actions mobile workflow; App distribution to testers with Fastlane; BrowserStack integration in CI

### api-qa — API Tester
  - api-qa-1 | HTTP and REST API Fundamentals | topics: HTTP methods: GET, POST, PUT, DELETE, PATCH; HTTP status codes and their meaning; Request and response headers; JSON request and response bodies
  - api-qa-2 | Postman Collections and Test Scripts | topics: Collection and folder organization; Environment and global variables; pm.test and pm.expect assertions; Pre-request scripts for setup
  - api-qa-3 | REST Assured for Java API Testing | topics: REST Assured setup with Maven; Given/When/Then DSL structure; Path and query parameter testing; Response body extraction with JsonPath
  - api-qa-4 | API Test Design and Coverage Strategies | topics: Positive and negative API test cases; Boundary value testing for API parameters; Error handling and error response validation; API contract testing concepts
  - api-qa-5 | Newman for CLI and Automated Postman Runs | topics: Newman installation and CLI usage; Running collections with environments; Newman reporters: CLI, JUnit, HTML; Newman with multiple environment files
  - api-qa-6 | API Authentication Testing | topics: API key authentication testing; Bearer token handling and validation; JWT structure and claims validation; OAuth2 authorization code and client credentials flows
  - api-qa-7 | Contract Testing with Pact | topics: Consumer-driven contract testing concept; Pact consumer test authoring; Pact provider verification; Pact Broker for contract storage
  - api-qa-8 | GraphQL API Testing | topics: GraphQL query and mutation structure; Testing with introspection queries; Variable and argument validation; Error handling in GraphQL responses
  - api-qa-9 | Mocking and Service Virtualization | topics: WireMock setup and stub configuration; Request matching in WireMock; Response templating and dynamic responses; Postman Mock Server setup
  - api-qa-10 | CI/CD Integration and API Test Pipelines | topics: GitHub Actions for API test automation; Newman in CI pipelines; REST Assured with Maven in CI; Parallel API test execution

### sdet — SDET
  - sdet-1 | Core Java for Test Engineering | topics: Java OOP: classes, inheritance, interfaces; Collections: List, Map, Set usage; Exception handling in test code; Java Streams and Lambdas
  - sdet-2 | Selenium WebDriver with Java | topics: WebDriver setup with WebDriverManager; Selenium locator strategies; Synchronization: explicit and fluent waits; Page Object Model with Java
  - sdet-3 | TestNG Advanced Features and Framework Design | topics: TestNG data providers and parameterization; Test grouping and dependency management; TestNG listeners for custom logging; Retry analyzer for flaky test handling
  - sdet-4 | API Testing with REST Assured and Java | topics: REST Assured DSL mastery; POJO-based request and response handling with Jackson; JSON Schema validation; API test base classes and utilities
  - sdet-5 | Design Patterns in Test Automation | topics: Singleton for WebDriver management; Factory pattern for browser instantiation; Builder pattern for test data; Fluent interface pattern
  - sdet-6 | Unit and Integration Testing for Production Code | topics: JUnit 5 parameterized tests and extensions; Mockito for dependency mocking; Testing Spring Boot controllers with MockMvc; Integration tests with Testcontainers
  - sdet-7 | BDD with Cucumber and Gherkin | topics: Gherkin syntax: Feature, Scenario, Given/When/Then; Cucumber step definitions in Java; Cucumber hooks and data tables; Cucumber and Selenium integration
  - sdet-8 | Test Data Management and Environments | topics: Test data strategies: static, dynamic, on-demand; Java Faker for synthetic data generation; Database seeding and teardown; Environment configuration management
  - sdet-9 | Performance and Security Testing Integration | topics: Gatling Java DSL for performance tests; Integrating Gatling with Maven lifecycle; ZAP Maven plugin for DAST scanning; Defining performance thresholds in tests
  - sdet-10 | CI/CD Pipeline Ownership and Production Quality | topics: Jenkins declarative pipeline authoring; GitHub Actions for Java Maven projects; Parallel and matrix test execution in CI; SonarQube for test code quality

### chaos-engineer — Chaos Engineer
  - chaos-engineer-1 | Reliability Engineering Foundations | topics: SRE principles and culture; SLI, SLO, SLA definitions; Error budget concept and management; MTTR, MTBF, and availability math
  - chaos-engineer-2 | Chaos Engineering Principles and Hypothesis | topics: Chaos engineering principles from Netflix; Steady state hypothesis definition; Blast radius minimization; Experiment design methodology
  - chaos-engineer-3 | Chaos Monkey and Simian Army | topics: Chaos Monkey installation and configuration; Spinnaker integration requirements; Chaos Monkey scheduling and opt-in groups; Janitor Monkey for resource cleanup
  - chaos-engineer-4 | Gremlin for Targeted Chaos Experiments | topics: Gremlin installation on Kubernetes and VMs; Resource attacks: CPU, memory, disk, IO; Network attacks: latency, packet loss, blackhole; State attacks: shutdown, process killer
  - chaos-engineer-5 | Kubernetes Chaos with LitmusChaos | topics: LitmusChaos architecture and components; ChaosEngine and ChaosExperiment CRDs; Pod delete and pod CPU hog experiments; Node drain and node taint experiments
  - chaos-engineer-6 | Observability for Chaos Engineering | topics: Prometheus metrics instrumentation; Grafana dashboard design for chaos; Distributed tracing with Jaeger; OpenTelemetry SDK instrumentation
  - chaos-engineer-7 | Network and Dependency Failure Testing | topics: Toxiproxy for network fault injection; Circuit breaker pattern testing; Retry and timeout configuration testing; Istio fault injection with VirtualService
  - chaos-engineer-8 | Database and Stateful Service Chaos | topics: Database connection pool exhaustion testing; Primary/replica failover testing; Disk IO saturation experiments; Redis cache failure scenarios
  - chaos-engineer-9 | Chaos Automation and GameDay Facilitation | topics: Scheduled chaos in LitmusChaos workflows; GitHub Actions for automated chaos; GameDay planning: scope, timeline, roles; Incident simulation exercises
  - chaos-engineer-10 | Production Chaos and Chaos Maturity | topics: Production chaos safety requirements; Automated rollback triggers; PagerDuty integration during chaos; Chaos experiment result trending

### accessibility-qa — Accessibility Tester
  - accessibility-qa-1 | Accessibility Fundamentals and WCAG | topics: WCAG 2.1 POUR principles: Perceivable, Operable, Understandable, Robust; WCAG conformance levels: A, AA, AAA; Disability categories and assistive technologies; Legal context: ADA, Section 508, EN 301 549
  - accessibility-qa-2 | Screen Reader Testing with NVDA | topics: NVDA installation and basic usage; Browse mode vs forms mode in NVDA; Navigating by headings, landmarks, and links; Testing form field labels and error messages
  - accessibility-qa-3 | Keyboard Navigation Testing | topics: Tab, Shift-Tab, Enter, Space, Arrow key navigation; Focus visibility requirements; Keyboard trap detection and testing; Skip navigation links
  - accessibility-qa-4 | Automated Accessibility Testing with axe | topics: axe-core rules and violation levels; axe DevTools browser extension; axe-playwright for E2E integration; Understanding axe incomplete and inapplicable results
  - accessibility-qa-5 | Lighthouse Audits and Reporting | topics: Lighthouse accessibility audit configuration; Interpreting Lighthouse accessibility score; Lighthouse CLI for automated runs; Lighthouse CI for pipeline integration
  - accessibility-qa-6 | Color, Contrast, and Visual Accessibility | topics: WCAG 1.4.3 contrast ratio requirements; Colour Contrast Analyser tool usage; Testing non-text contrast (1.4.11); Color-only information violations
  - accessibility-qa-7 | Mobile Accessibility Testing | topics: VoiceOver gestures and navigation on iOS; TalkBack gestures and navigation on Android; Mobile accessibility element grouping; Touch target size requirements (24x24 dp)
  - accessibility-qa-8 | ARIA and Semantic HTML Validation | topics: ARIA roles: landmark, widget, document structure; ARIA properties: aria-label, aria-labelledby, aria-describedby; ARIA states: aria-expanded, aria-selected, aria-checked; Custom widget keyboard and ARIA patterns
  - accessibility-qa-9 | Accessibility Test Automation Integration | topics: axe-playwright setup and usage; Per-page accessibility assertions in Playwright; Custom axe rule configuration; Accessibility violation reporting in Allure
  - accessibility-qa-10 | Accessibility Program and CI/CD Integration | topics: Lighthouse CI in GitHub Actions; Accessibility score gates blocking merge; Developer accessibility tooling recommendations; Voluntary Product Accessibility Template (VPAT)

### qa-lead — QA Lead
  - qa-lead-1 | QA Leadership Foundations | topics: QA Lead vs Senior QA engineer role differences; Servant leadership in testing teams; Quality advocacy at the organizational level; Building credibility with development and product teams
  - qa-lead-2 | Test Strategy and Planning | topics: Test strategy vs test plan differences; Risk-based testing approach; Test scope and coverage definition; Test environment strategy
  - qa-lead-3 | Building and Mentoring QA Teams | topics: QA engineer hiring: resume review, interview design; Onboarding plan for new QA engineers; Structured 1-on-1 meeting frameworks; Providing actionable feedback (SBI model)
  - qa-lead-4 | QA Metrics and Reporting | topics: Leading vs lagging quality indicators; Defect density and escape rate metrics; Test coverage and automation ratio; Cycle time and testing throughput
  - qa-lead-5 | Agile QA Processes and Ceremony Ownership | topics: Three Amigos sessions facilitation; Definition of Ready and Done with QA criteria; Sprint planning estimation for QA; Shift-left testing in Agile teams
  - qa-lead-6 | Test Automation Strategy and Governance | topics: Test automation pyramid and trophy strategies; Build vs buy automation tool decisions; Automation ROI calculation; Automation code review standards
  - qa-lead-7 | Cross-Team Collaboration and Stakeholder Management | topics: Influencing without authority techniques; Stakeholder mapping and communication plans; Negotiating release dates and quality tradeoffs; Presenting QA findings to executives
  - qa-lead-8 | Incident Management and Root Cause Analysis | topics: Incident severity classification; QA role during production incidents; Blameless post-mortem methodology; Root cause analysis techniques: 5 Whys, fishbone
  - qa-lead-9 | Quality Culture and Continuous Improvement | topics: Quality culture vs quality control mindset; Quality champions program design; Retrospective formats: 4Ls, start-stop-continue; PDCA cycle for process improvement
  - qa-lead-10 | QA Program Ownership and Strategic Leadership | topics: Annual QA roadmap planning; Headcount planning and budget management; QA tooling evaluation and procurement; Building a testing center of excellence
