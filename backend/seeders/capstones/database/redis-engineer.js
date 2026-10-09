/**
 * Capstone brief — redis-engineer track (redis-engineer), v1.
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
  trackId: "redis-engineer",
  categoryId: "database",
  slug: "redis-engineer-cluster-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Throughput Redis Cluster Platform with Search and Streams",
  summary:
    "Design and deploy an enterprise Redis Cluster platform. Implement multi-tiered caching strategies, " +
    "event processing with Redis Streams consumer groups, Lua atomic scripts, RedisSearch full-text querying, " +
    "and ACL security controls.",
  stack: [
    "Redis",
    "RedisSearch",
    "Node.js or Python",
    "Docker Compose",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "redis-cluster-setup",
      text: "Deploy a 6-node (3 primary, 3 replica) Redis Cluster with automated hash slot distribution.",
      check: CHECKS.compose,
    },
    {
      id: "caching-patterns",
      text: "Implement cache-aside and write-through caching patterns with TTL eviction policies and jitter to prevent cache stampedes.",
      check: { type: "file", glob: "**/cache_service.{js,ts,py}" },
    },
    {
      id: "streams-consumer-groups",
      text: "Build an event processing system using Redis Streams (XADD, XREADGROUP) with consumer groups and explicit message ACK handling.",
      check: { type: "file", glob: "**/stream_consumer.{js,ts,py}" },
    },
    {
      id: "redis-search-indexing",
      text: "Create RedisSearch index schemas and write secondary full-text queries over complex JSON/Hash documents.",
      check: { type: "file", glob: "**/search_indexer.{js,ts,py}" },
    },
    {
      id: "atomic-lua-scripts",
      text: "Write Lua scripts executed via EVALSHA for atomic operations like rate-limiting sliding windows and token bucket algorithms.",
      check: { type: "file", glob: "**/scripts/*.lua" },
    },
    {
      id: "persistence-tuning",
      text: "Configure hybrid persistence combining periodic RDB snapshots with append-only file (AOF) using fsync everysec policies.",
      check: { type: "file", glob: "**/redis.conf" },
    },
    {
      id: "acl-security",
      text: "Set up Redis ACL configuration defining restricted user accounts with specific key patterns and command privileges.",
      check: { type: "file", glob: "**/users.acl" },
    },
    {
      id: "tests",
      text: "Write comprehensive integration tests verifying cluster resharding, key failover routing, and stream processing.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README details Redis Cluster topology setup, stream consumer architecture, memory eviction tuning, and testing instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow spins up Redis Cluster nodes and runs integration test suites.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "data-structures",
      name: "Data Structures & Caching",
      weight: 20,
      layerId: "redis-engineer-2",
      description:
        "Are appropriate Redis data structures (Hashes, Sorted Sets) used alongside robust cache invalidation strategies?",
    },
    {
      id: "caching-patterns",
      name: "Caching Patterns & Expiration",
      weight: 15,
      layerId: "redis-engineer-3",
      description:
        "Are cache-aside, write-through, and stampede mitigation techniques properly implemented?",
    },
    {
      id: "pubsub-streams",
      name: "Redis Streams & Consumer Groups",
      weight: 20,
      layerId: "redis-engineer-5",
      description:
        "Do stream consumer groups process messages reliably without pending message backlog leaks?",
    },
    {
      id: "cluster-ha",
      name: "Redis Cluster & Resilience",
      weight: 20,
      layerId: "redis-engineer-8",
      description:
        "Is Redis Cluster properly configured across hash slots with graceful MOVED/ASK redirect handling?",
    },
    {
      id: "search-lua",
      name: "RedisSearch & Atomic Lua Scripts",
      weight: 15,
      layerId: "redis-engineer-9",
      description:
        "Are Lua scripts atomic and error-free, and are RedisSearch indexes optimized?",
    },
    {
      id: "ops-security",
      name: "ACL Security & Production Ops",
      weight: 10,
      layerId: "redis-engineer-10",
      description:
        "Are maxmemory eviction policies, ACL user permissions, and persistence policies correctly tuned?",
    },
  ],

  twistPool: [
    {
      id: "redlock-distributed-lock",
      text: "Implement the Redlock distributed locking algorithm across multiple Redis master nodes with automatic TTL extension.",
    },
    {
      id: "timeseries-module-metrics",
      text: "Integrate the RedisTimeSeries module to collect real-time system throughput metrics and execute downsampling aggregation queries.",
    },
    {
      id: "sentinel-failover-mode",
      text: "Provide an alternative deployment setup utilizing Redis Sentinel for automatic primary-replica failover monitoring.",
    },
    {
      id: "client-side-caching",
      text: "Implement RESP3 client-side caching with invalidation messages to maintain local memory cache consistency.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
