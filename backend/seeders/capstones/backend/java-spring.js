/**
 * Capstone brief — Java Spring track (java-spring), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "java-spring",
  categoryId: "backend",
  slug: "java-spring-library-system",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Library lending system with Spring Boot",
  summary:
    "Build the backend for a lending library: members borrow and return books, librarians manage the " +
    "catalogue, and late returns are tracked. A classic domain on purpose — the challenge is a clean " +
    "Spring Boot architecture, correct JPA mappings, and security done properly.",
  stack: ["Java 21", "Spring Boot", "Spring Data JPA", "Spring Security", "PostgreSQL"],

  requirements: [
    { id: "auth", text: "Stateless JWT authentication with Spring Security; members and librarians have different permissions." },
    { id: "catalogue", text: "Librarians manage books and copies; anyone signed in can search the catalogue with pagination and sorting." },
    { id: "loans", text: "Members borrow and return copies; a copy can never be on loan twice at the same time." },
    { id: "validation", text: "DTOs are validated with Bean Validation; a global exception handler returns consistent error bodies." },
    { id: "migrations", text: "The schema is managed with Flyway or Liquibase, not Hibernate auto-DDL." },
    { id: "actuator", text: "Actuator health and metrics endpoints are enabled and secured." },
    { id: "build", text: "A Maven or Gradle build.", check: CHECKS.javaBuild },
    { id: "tests", text: "JUnit 5 tests: unit tests with Mockito and slice or integration tests for the web and data layers.", check: CHECKS.javaTests },
    { id: "readme", text: "README explains setup, configuration and how to run the tests.", check: CHECKS.readme },
    { id: "docker", text: "The application and PostgreSQL start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI builds and runs the tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "java-spring-5", description: "Endpoints, lending rules and your twist behave as specified, including edge cases." },
    { id: "architecture", name: "Spring architecture", weight: 15, layerId: "java-spring-4", description: "Controllers, services and repositories are separated; dependency injection is used cleanly." },
    { id: "jpa", name: "Persistence & JPA", weight: 20, layerId: "java-spring-6", description: "Entities, relationships, transactions and fetching avoid N+1 queries and lost updates." },
    { id: "security", name: "Security", weight: 15, layerId: "java-spring-7", description: "Authentication, authorisation rules and secrets handling are correct." },
    { id: "tests", name: "Tests", weight: 15, layerId: "java-spring-8", description: "The right test types at the right layers, covering failure paths." },
    { id: "delivery", name: "Packaging & operations", weight: 10, layerId: "java-spring-10", description: "Builds reproducibly, runs in a container, exposes health and metrics." },
  ],

  twistPool: [
    { id: "reservations", text: "Members can reserve a book that is fully on loan; the next returned copy is held for the first reservation for 48 hours." },
    { id: "late-fees", text: "Late returns accrue a daily fee; members with unpaid fees above a limit cannot borrow, enforced in the service layer." },
    { id: "loan-limits", text: "Each membership tier has a maximum number of concurrent loans, enforced even under concurrent borrow requests." },
    { id: "overdue-job", text: "A scheduled job flags overdue loans nightly and publishes an event consumed by a listener that records a reminder." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
