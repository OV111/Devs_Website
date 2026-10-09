/**
 * Capstone brief — java track (java), v1.
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
  trackId: "java",
  categoryId: "languages",
  slug: "java-financial-ledger-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Threaded Financial Transaction Processing Engine",
  summary:
    "Build a production-grade multi-threaded financial ledger and audit service in modern Java 21+. " +
    "Process batch transactions using Streams API, modern Java Records, and Sealed Classes while handling concurrent account " +
    "updates safely via ExecutorService thread pools and custom design patterns.",
  stack: ["Java 21", "Maven / Gradle", "JUnit 5", "Mockito"],

  requirements: [
    {
      id: "build-tool",
      text: "Project includes Maven pom.xml or Gradle build script.",
      check: {
        type: "file",
        glob: ["pom.xml", "build.gradle", "build.gradle.kts"],
      },
    },
    {
      id: "records-sealed",
      text: "Model transaction records using modern Java Records and event hierarchies using Sealed Interfaces.",
    },
    {
      id: "collections-generics",
      text: "Use generic repository data structures built on Java Collections (Map, Queue, Set).",
    },
    {
      id: "streams-lambdas",
      text: "Analyze transaction data and calculate financial summaries using Streams API and Collectors.",
    },
    {
      id: "concurrency",
      text: "Execute parallel transaction audits safely using ExecutorService, Future, and synchronized balance blocks.",
    },
    {
      id: "design-patterns",
      text: "Implement the Builder pattern for transaction requests and Factory pattern for processor creation.",
    },
    {
      id: "custom-exceptions",
      text: "Implement checked/unchecked domain exception hierarchies managed with try-with-resources file logging.",
    },
    {
      id: "junit-tests",
      text: "Comprehensive JUnit 5 unit and parameterized tests covering transaction processing logic.",
      check: { type: "file", glob: "src/test/**/*.java" },
    },
    {
      id: "readme",
      text: "README details project setup, JVM requirements, execution commands, and pattern documentation.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI workflow compiles and runs tests on JDK 21.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "modern-java",
      name: "Modern Java Features",
      weight: 20,
      layerId: "java-8",
      description:
        "Effective usage of Records, Sealed Classes, pattern matching, and modern language syntax.",
    },
    {
      id: "concurrency",
      name: "Concurrency & Thread Safety",
      weight: 20,
      layerId: "java-6",
      description:
        "Safe execution across thread pools with robust lock synchronization and race protection.",
    },
    {
      id: "streams-collections",
      name: "Streams & Collections API",
      weight: 15,
      layerId: "java-5",
      description:
        "Complex stream pipelines, collectors, and appropriate collection type choices.",
    },
    {
      id: "patterns-oop",
      name: "Design Patterns & OOP",
      weight: 15,
      layerId: "java-7",
      description:
        "Clean implementation of Creational and Behavioral patterns in standard Java code.",
    },
    {
      id: "testing",
      name: "JUnit 5 & Mockito Tests",
      weight: 15,
      layerId: "java-9",
      description:
        "Comprehensive parameterized unit tests and mock-based isolated integration tests.",
    },
    {
      id: "build-packaging",
      name: "Build & Packaging",
      weight: 15,
      layerId: "java-10",
      description:
        "Proper Maven/Gradle setup, fat JAR packaging configuration, and CI execution.",
    },
  ],

  twistPool: [
    {
      id: "virtual-threads",
      text: "Refactor concurrency execution to use Java 21 Virtual Threads (Loom) for high-concurrency throughput.",
    },
    {
      id: "audit-observer",
      text: "Implement an Observer pattern event bus to publish ledger change notifications to multiple listeners.",
    },
    {
      id: "file-exporter",
      text: "Add a file export pipeline writing structured ledger statements using NIO files and try-with-resources.",
    },
    {
      id: "deadlock-detector",
      text: "Implement an account transfer verification check that detects and prevents potential deadlocks.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
