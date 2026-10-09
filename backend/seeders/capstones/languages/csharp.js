/**
 * Capstone brief — csharp track (csharp), v1.
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
  trackId: "csharp",
  categoryId: "languages",
  slug: "csharp-async-event-bus",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Throughput Async In-Memory Messaging Bus",
  summary:
    "Build a production-grade asynchronous in-memory pub/sub message broker in modern C# / .NET 8+. " +
    "You will implement async pipelines with System.Threading.Channels, Dependency Injection patterns, " +
    "advanced LINQ processing, modern records, and strict nullable reference type safety.",
  stack: [".NET 8+", "C# 12", "System.Threading.Channels", "xUnit", "Moq"],

  requirements: [
    {
      id: "project-file",
      text: "Project contains a valid .csproj file targeting modern .NET.",
      check: { type: "file", glob: "**/*.csproj" },
    },
    {
      id: "async-channels",
      text: "Implement message publishing and consuming using System.Threading.Channels with backpressure support.",
    },
    {
      id: "dependency-injection",
      text: "Configure service registration with IServiceCollection supporting transient, scoped, and singleton lifetimes.",
    },
    {
      id: "linq-expressions",
      text: "Implement dynamic message filtering and aggregation using LINQ queries and record types.",
    },
    {
      id: "cancellation-tokens",
      text: "Pass CancellationToken parameters across all async execution signatures to support graceful shutdown.",
    },
    {
      id: "nullable-safety",
      text: "Enable strict Nullable Reference Types with zero unhandled null reference warnings.",
    },
    {
      id: "error-handling",
      text: "Implement custom exception types managed cleanly using try/catch/finally and IDisposable cleanup blocks.",
    },
    {
      id: "xunit-tests",
      text: "xUnit test suite with Moq covering async channel processing and message subscription logic.",
      check: { type: "file", glob: "**/*.Tests*/*.cs" },
    },
    {
      id: "readme",
      text: "README covers architecture layout, setup guide, dotnet test execution, and channel configuration.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI pipeline compiles solution with dotnet build and runs xUnit tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "async-concurrency",
      name: "Async/Await & Channels",
      weight: 25,
      layerId: "csharp-5",
      description:
        "Non-blocking async pipelines built with Channels, Task APIs, and proper CancellationToken cancellation.",
    },
    {
      id: "di-architecture",
      name: "Architecture & DI",
      weight: 15,
      layerId: "csharp-7",
      description:
        "Clean interface abstractions, repository pattern, and correct service lifetime registrations.",
    },
    {
      id: "modern-csharp",
      name: "Modern C# & Safety",
      weight: 15,
      layerId: "csharp-9",
      description:
        "Strict Nullable Reference Type safety, modern Records, and high-performance Span/Memory usage where appropriate.",
    },
    {
      id: "linq-functional",
      name: "LINQ & Functional Patterns",
      weight: 15,
      layerId: "csharp-6",
      description:
        "Advanced LINQ grouping, aggregation, and immutable object patterns.",
    },
    {
      id: "testing",
      name: "xUnit & Moq Testing",
      weight: 15,
      layerId: "csharp-8",
      description:
        "Thorough unit tests with facts/theories and isolated mock verifications.",
    },
    {
      id: "operability-tooling",
      name: "Ecosystem & Tooling",
      weight: 15,
      layerId: "csharp-10",
      description:
        "Clean .NET project structure, solution setup, and working CI automation.",
    },
  ],

  twistPool: [
    {
      id: "dead-letter-queue",
      text: "Add a Dead Letter Queue (DLQ) channel to capture and inspect messages after max retry failures.",
    },
    {
      id: "scheduled-messages",
      text: "Support delayed message publishing where messages become visible to consumers after a set TimeSpan.",
    },
    {
      id: "message-deduplication",
      text: "Implement an sliding-window deduplication filter that discards identical message IDs within a time window.",
    },
    {
      id: "benchmarks",
      text: "Integrate BenchmarkDotNet micro-benchmarks comparing channel throughput under varying worker pool sizes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
