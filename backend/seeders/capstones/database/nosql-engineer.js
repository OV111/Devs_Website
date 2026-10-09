/**
 * Capstone brief — nosql-engineer track (nosql-engineer), v1.
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
  trackId: "nosql-engineer",
  categoryId: "database",
  slug: "nosql-engineer-polyglot-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Polyglot Persistence Platform with MongoDB, Redis, and Cassandra",
  summary:
    "Build a high-performance polyglot persistence architecture. Combine MongoDB for flexible document storage, " +
    "Redis for real-time leaderboards and rate-limiting cache, and Cassandra for time-series analytics, coordinated via " +
    "an event-driven synchronization service.",
  stack: [
    "MongoDB",
    "Redis",
    "Apache Cassandra",
    "Node.js or Python",
    "Docker Compose",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "mongodb-app",
      text: "Implement MongoDB document modeling with Mongoose/native driver featuring schema validations, atomic updates, and aggregation pipelines.",
      check: { type: "file", glob: "**/*.{js,ts,py}" },
    },
    {
      id: "redis-cache-patterns",
      text: "Implement Redis cache-aside strategy, rate limiting with sliding window logs, and pub/sub or stream message consumers.",
      check: { type: "file", glob: "**/redis_service.{js,ts,py}" },
    },
    {
      id: "cassandra-timeseries",
      text: "Design a Cassandra CQL schema optimized for time-series metric aggregation using time-bucketed partition keys and clustering columns.",
      check: { type: "file", glob: "**/schema.cql" },
    },
    {
      id: "polyglot-sync",
      text: "Build an event-driven sync mechanism (Change Streams or Redis Streams) that updates analytics in Cassandra when document writes occur in MongoDB.",
      check: { type: "file", glob: "**/sync_service.{js,ts,py}" },
    },
    {
      id: "compose-stack",
      text: "Provide a unified Docker Compose manifest starting MongoDB, Redis, and Cassandra with healthchecks.",
      check: CHECKS.compose,
    },
    {
      id: "tests",
      text: "Write automated integration tests validating data reads/writes across all three NoSQL data stores.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py}" },
    },
    {
      id: "env-example",
      text: "Provide environment variable templates for connecting to each database instance safely.",
      check: CHECKS.envExample,
    },
    {
      id: "observability",
      text: "Include Prometheus exporter configurations or diagnostic scripts monitoring cache hit ratios and Cassandra latency.",
      check: { type: "file", glob: "**/prometheus.yml" },
    },
    {
      id: "readme",
      text: "README outlines polyglot database choices, consistency trade-offs (CAP theorem decisions), and instructions to run tests.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow spins up database service containers and runs all integration tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "nosql-foundations",
      name: "Polyglot Architecture & CAP",
      weight: 20,
      layerId: "nosql-engineer-1",
      description:
        "Are data store selections aligned with storage strengths and consistency requirements?",
    },
    {
      id: "mongo-dev",
      name: "MongoDB Application Design",
      weight: 20,
      layerId: "nosql-engineer-2",
      description:
        "Are MongoDB collections, ODM schemas, and aggregations properly implemented?",
    },
    {
      id: "redis-patterns",
      name: "Redis Caching & Streams",
      weight: 15,
      layerId: "nosql-engineer-3",
      description:
        "Are Redis cache-aside, rate limiting, and stream consumer structures correct and fast?",
    },
    {
      id: "cassandra-model",
      name: "Cassandra Data Modeling",
      weight: 15,
      layerId: "nosql-engineer-4",
      description:
        "Is the Cassandra schema modeled query-first with optimal partition and clustering keys?",
    },
    {
      id: "polyglot-sync",
      name: "CQRS & Polyglot Sync",
      weight: 20,
      layerId: "nosql-engineer-8",
      description:
        "Is event-driven synchronization between MongoDB, Redis, and Cassandra resilient and non-blocking?",
    },
    {
      id: "ops-testing",
      name: "Ops & Test Coverage",
      weight: 10,
      layerId: "nosql-engineer-9",
      description:
        "Do integration tests verify cross-database operations, and is setup fully automated?",
    },
  ],

  twistPool: [
    {
      id: "dynamodb-single-table-add",
      text: "Replace the Cassandra metrics layer with an AWS DynamoDB single-table model utilizing Global Secondary Indexes.",
    },
    {
      id: "redis-search-json",
      text: "Store document cache using RedisJSON and perform full-text secondary querying using RedisSearch modules.",
    },
    {
      id: "saga-distributed-tx",
      text: "Implement a distributed Saga orchestrator handling compensating transactions when writes across multiple NoSQL engines fail.",
    },
    {
      id: "k8s-helm-deployment",
      text: "Provide Helm chart manifests for deploying stateful MongoDB, Redis, and Cassandra pods with PersistentVolumeClaims.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
