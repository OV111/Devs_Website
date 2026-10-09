/**
 * Capstone brief — api-qa track (api-qa), v1.
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
  stack: [
    "Java",
    "REST Assured",
    "Pact",
    "WireMock",
    "Postman / Newman",
    "Maven",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "rest-assured-suite",
      text: "Write comprehensive REST Assured API tests utilizing Given/When/Then DSL structure.",
      check: { type: "file", glob: "src/test/**/*.java" },
    },
    {
      id: "pojo-mapping",
      text: "Map request and response payloads to Java POJOs using Jackson for serialization and deserialization.",
    },
    {
      id: "json-schema-validation",
      text: "Implement strict JSON schema validation assertions for all API responses.",
      check: { type: "file", glob: "src/test/resources/**/*.json" },
    },
    {
      id: "auth-testing",
      text: "Automate API authentication workflows including OAuth2 token retrieval and Bearer token headers.",
    },
    {
      id: "pact-contract-testing",
      text: "Create consumer-driven contract tests using Pact and generate contract pact files.",
      check: { type: "file", glob: "**/pacts/*.json" },
    },
    {
      id: "wiremock-virtualization",
      text: "Configure WireMock stubs and response templates to simulate third-party API dependencies.",
      check: { type: "file", glob: "src/test/**/WireMock*.java" },
    },
    {
      id: "postman-newman",
      text: "Include a Postman collection covering API edge cases executable via Newman CLI script.",
      check: { type: "file", glob: "**/*.postman_collection.json" },
    },
    {
      id: "pom-xml",
      text: "Organize dependencies, surefire plugins, and test execution profiles in Maven pom.xml.",
      check: { type: "file", glob: "pom.xml" },
    },
    {
      id: "readme",
      text: "README provides detailed setup instructions, test execution commands, and contract publication steps.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions workflow executing REST Assured, Pact verification, and Newman tests.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "env-example",
      text: "Provide an environment variable configuration file template for host URLs and authentication keys.",
      check: { type: "file", glob: ".env.example" },
    },
  ],

  rubric: [
    {
      id: "rest-assured-design",
      name: "REST Assured Framework Architecture",
      weight: 25,
      layerId: "api-qa-3",
      description:
        "Clean usage of REST Assured DSL, POJO serialization, schema assertions, and request specifications.",
    },
    {
      id: "contract-testing",
      name: "Contract Testing with Pact",
      weight: 20,
      layerId: "api-qa-7",
      description:
        "Effective implementation of consumer-driven contract tests and contract lifecycle verification.",
    },
    {
      id: "auth-security",
      name: "API Authentication & Security",
      weight: 15,
      layerId: "api-qa-6",
      description:
        "Robust handling and validation of OAuth2 flows, token expiration, and unauthorized access.",
    },
    {
      id: "virtualization",
      name: "Service Virtualization",
      weight: 15,
      layerId: "api-qa-9",
      description:
        "Realistic WireMock stubs handling dynamic response templating and fault injection.",
    },
    {
      id: "ci-automation",
      name: "Pipeline & CLI Automation",
      weight: 15,
      layerId: "api-qa-10",
      description:
        "Continuous integration automation combining Maven test runs and Newman CLI report generation.",
    },
    {
      id: "docs-maintenance",
      name: "Documentation & Quality",
      weight: 10,
      layerId: "api-qa-4",
      description:
        "Clear README setup instructions, readable test reports, and logical collection folder structures.",
    },
  ],

  twistPool: [
    {
      id: "graphql-testing",
      text: "Extend test suite coverage to include GraphQL queries, mutations, and error array validations.",
    },
    {
      id: "pact-broker-upload",
      text: "Integrate Pact Broker contract publishing and verification tasks into the build workflow.",
    },
    {
      id: "data-driven-excel",
      text: "Implement data-driven API testing retrieving request parameters dynamically from Apache POI Excel files.",
    },
    {
      id: "rate-limit-resilience",
      text: "Add automated tests asserting HTTP 429 Too Many Requests response handling and Retry-After headers.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
