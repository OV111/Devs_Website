/**
 * Capstone brief — Kotlin Developer track (kotlin-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-04 — status stays "draft" until a human has read
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
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "kotlin-dev",
  categoryId: "mobile",
  slug: "kotlin-dev-reading-list-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Concurrent reading-list service",
  summary:
    "Build a Kotlin application that manages a personal reading list and exposes it through a small Ktor service. The project should use idiomatic Kotlin, coroutines, Flow, Gradle and persistence to create a complete piece of software that can be exercised locally without external paid services.",
  stack: [
    "Kotlin",
    "Ktor",
    "Coroutines",
    "Flow",
    "Gradle Kotlin DSL",
    "kotlinx.serialization",
    "Exposed",
    "HikariCP",
    "JUnit 5",
    "MockK",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "book-crud",
      text: "The service supports creating, reading, updating and deleting books with a title, author, status and optional rating, and rejects invalid input with an appropriate HTTP response.",
    },
    {
      id: "ktor-api",
      text: "The application exposes a Ktor HTTP API with separate routing and application logic, and JSON request and response bodies use kotlinx.serialization.",
    },
    {
      id: "null-safety",
      text: "Nullable book data is handled explicitly using Kotlin null-safety features rather than unsafe assertions for expected missing values.",
    },
    {
      id: "coroutines",
      text: "Database and other blocking work is executed through appropriate coroutine dispatchers and request handlers do not block the main application execution unnecessarily.",
    },
    {
      id: "flow",
      text: "The application exposes a Flow-based operation for observing changes to the reading list and handles cancellation without leaking work.",
    },
    {
      id: "persistence",
      text: "Books are persisted in a relational database using Exposed with a defined schema and a connection pool managed by HikariCP.",
    },
    {
      id: "validation-errors",
      text: "Malformed requests, missing resources and persistence failures produce deliberate API responses rather than uncaught exceptions or stack traces.",
    },
    {
      id: "tests",
      text: "Automated tests cover core reading-list behaviour and at least one coroutine or Flow behaviour, and the test suite runs without external paid services.",
      check: { type: "file", glob: "**/src/test/**/*.kt" },
    },
    {
      id: "readme",
      text: "README explains the required JDK, database setup, configuration, how to run the service and how to run the tests.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the project and runs the Kotlin test suite on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "gradle",
      text: "The project uses Gradle Kotlin DSL for its build configuration and declares its dependencies there.",
      check: { type: "file", glob: "build.gradle.kts" },
    },
    {
      id: "local-data",
      text: "The application can run against a local database and does not require production credentials or a hosted database for development and testing.",
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "kotlin-dev-7",
      description:
        "The HTTP API, validation, persistence and reading-list behaviour satisfy the requirements and handle meaningful edge cases.",
    },
    {
      id: "kotlin-design",
      name: "Kotlin design",
      weight: 15,
      layerId: "kotlin-dev-1",
      description:
        "The code uses Kotlin types, functions and control flow clearly and avoids unnecessary Java-style patterns.",
    },
    {
      id: "types",
      name: "Types & domain modelling",
      weight: 15,
      layerId: "kotlin-dev-2",
      description:
        "Domain states, nullable values, classes and sealed or enum types are modelled clearly and safely.",
    },
    {
      id: "functional",
      name: "Functional & collections",
      weight: 10,
      layerId: "kotlin-dev-3",
      description:
        "Collection transformations, scope functions and extensions are used where they improve clarity rather than as decoration.",
    },
    {
      id: "concurrency",
      name: "Concurrency & Flow",
      weight: 20,
      layerId: "kotlin-dev-4",
      description:
        "Coroutine structure, cancellation, dispatchers and asynchronous streams are implemented safely and predictably.",
    },
    {
      id: "data-testing",
      name: "Data, tooling & tests",
      weight: 15,
      layerId: "kotlin-dev-8",
      description:
        "Persistence, Gradle structure and automated tests form a reproducible project with meaningful isolation of external dependencies.",
    },
  ],

  twistPool: [
    {
      id: "tags",
      text: "Add user-defined tags to books and an endpoint that lists books matching one or more tags, with filtering performed efficiently in the persistence layer.",
    },
    {
      id: "import",
      text: "Add a bulk import endpoint that accepts a JSON array of books, validates the complete batch before persistence and reports which records are invalid without partially saving the batch.",
    },
    {
      id: "recommendations",
      text: "Add a deterministic recommendation endpoint that selects unread books based on the user's stored ratings and completed reading history, without using an external AI service.",
    },
    {
      id: "due-dates",
      text: "Add optional reading due dates and an endpoint that returns overdue books and books due within the next seven days, with date calculations covered by tests.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
