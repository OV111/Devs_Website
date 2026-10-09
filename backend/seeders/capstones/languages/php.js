/**
 * Capstone brief — php track (php), v1.
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "php",
  categoryId: "languages",
  slug: "php-restful-framework-core",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Modern PSR-Compliant REST API & Database Gateway",
  summary:
    "Build a lightweight, production-ready RESTful API service engine in modern PHP 8+. " +
    "You will implement PSR-4 autoloading with Composer, abstract database access using PDO with prepared statements, " +
    "enforce output escaping and password security, adopt PSR coding standards, and build background queue execution.",
  stack: ["PHP 8.2+", "Composer", "PDO / SQLite", "PHPUnit", "Docker"],

  requirements: [
    {
      id: "composer-setup",
      text: "Project uses Composer for dependency management and PSR-4 autoloading configuration.",
      check: { type: "file", glob: "composer.json" },
    },
    {
      id: "php8-syntax",
      text: "Utilize PHP 8 features including named arguments, union/intersection types, match expressions, and nullsafe operators.",
    },
    {
      id: "pdo-gateway",
      text: "Database operations use PDO with prepared statements and parameter binding; raw string concatenation in SQL is strictly prohibited.",
    },
    {
      id: "oop-traits",
      text: "Structure business logic using clean classes, interfaces, dynamic abstract methods, and shared traits.",
    },
    {
      id: "psr-standards",
      text: "Follow PSR-12 coding guidelines and integrate a PSR-3 compatible logging wrapper.",
    },
    {
      id: "security-basics",
      text: "Protect endpoints against XSS with output escaping, enforce CSRF protection where applicable, and hash passwords using bcrypt.",
    },
    {
      id: "queue-worker",
      text: "Implement a background job processing queue leveraging database tables or lightweight Redis storage.",
    },
    {
      id: "docker-fpm",
      text: "Provide Docker Compose configuration setting up PHP-FPM and Nginx environments.",
      check: CHECKS.compose,
    },
    {
      id: "phpunit-tests",
      text: "PHPUnit test suite covering API response endpoints, data serialization, and authentication logic.",
      check: { type: "file", glob: "tests/**/*Test.php" },
    },
    {
      id: "readme",
      text: "README details Composer installation steps, environment settings, and test commands.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI workflow runs PHPUnit test suites on every pull request.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "php8-modern",
      name: "Modern PHP 8 Features",
      weight: 20,
      layerId: "php-8",
      description:
        "Effective usage of named arguments, typed properties, match expressions, and nullsafe navigation.",
    },
    {
      id: "pdo-database",
      name: "PDO & Data Persistence",
      weight: 20,
      layerId: "php-5",
      description:
        "Secure database interactions using PDO prepared statements, parameter binding, and transactions.",
    },
    {
      id: "security",
      name: "Security & Hashing",
      weight: 15,
      layerId: "php-9",
      description:
        "Proper password hashing via bcrypt, sanitization, XSS mitigation, and safe header usage.",
    },
    {
      id: "architecture-psr",
      name: "PSR Standards & OOP",
      weight: 15,
      layerId: "php-6",
      description:
        "Adherence to PSR-4, PSR-12, PSR-3 standards, clean OOP abstractions, and traits usage.",
    },
    {
      id: "testing",
      name: "PHPUnit Testing",
      weight: 15,
      layerId: "php-7",
      description:
        "Comprehensive PHPUnit tests using test doubles, assertions, and data providers.",
    },
    {
      id: "ops-queues",
      name: "Queues & Docker Operations",
      weight: 15,
      layerId: "php-10",
      description:
        "Working background queue worker architecture, clean Docker containerization, and setup docs.",
    },
  ],

  twistPool: [
    {
      id: "jwt-auth",
      text: "Implement JWT (JSON Web Token) authentication middleware with token revocation capabilities.",
    },
    {
      id: "rate-limiter",
      text: "Add client rate-limiting middleware using IP address throttling stored in dynamic storage.",
    },
    {
      id: "middleware-pipeline",
      text: "Implement a customizable PSR-7/PSR-15 style HTTP middleware pipeline for requests and responses.",
    },
    {
      id: "content-negotiation",
      text: "Support automatic content negotiation output formatting JSON or XML based on the Accept header.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
