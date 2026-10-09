/**
 * Capstone brief — mongodb-admin track (mongodb-admin), v1.
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
  trackId: "mongodb-admin",
  categoryId: "database",
  slug: "mongodb-admin-sharded-cluster",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Sharded MongoDB Cluster with Replica Sets and RBAC Security",
  summary:
    "Deploy a production-ready MongoDB sharded cluster comprising config servers, mongos routers, and replica set shards. " +
    "Implement shard keys, RBAC roles, backup automation, WiredTiger performance tuning, and aggregation pipelines.",
  stack: ["MongoDB", "mongosh", "Docker Compose", "Bash", "GitHub Actions"],

  requirements: [
    {
      id: "sharded-cluster",
      text: "Provision a multi-container cluster containing 2 shard replica sets, 1 config server replica set, and a mongos router.",
      check: CHECKS.compose,
    },
    {
      id: "shard-key-design",
      text: "Define a collections schema with a compound or hashed shard key to ensure even chunk distribution and avoid jumbo chunks.",
      check: { type: "file", glob: "**/init_sharding.js" },
    },
    {
      id: "indexing-winning-plan",
      text: "Create single-field, compound, and multikey indexes, including explain() outputs demonstrating winning plans without in-memory sorts.",
      check: { type: "file", glob: "**/indexes.js" },
    },
    {
      id: "aggregation-pipeline",
      text: "Write complex aggregation pipelines using $match,$group, $project, and$lookup to transform and join document data.",
      check: { type: "file", glob: "**/aggregation.js" },
    },
    {
      id: "rbac-security",
      text: "Implement role-based access control (RBAC) with custom roles restricting read/write permissions per collection and authentication enabled.",
      check: { type: "file", glob: "**/security_rbac.js" },
    },
    {
      id: "backup-restore",
      text: "Provide automated mongodump and mongorestore shell scripts with oplog capture for consistent point-in-time snapshotting.",
      check: { type: "file", glob: "**/scripts/backup_restore.sh" },
    },
    {
      id: "transactions-sessions",
      text: "Write a script demonstrating multi-document transaction syntax using client sessions across sharded collections.",
      check: { type: "file", glob: "**/transaction_demo.js" },
    },
    {
      id: "profiling-monitoring",
      text: "Configure the database profiler to catch slow queries (>100ms) and provide a diagnostics script using currentOp() and mongostat commands.",
      check: { type: "file", glob: "**/scripts/profiling.js" },
    },
    {
      id: "readme",
      text: "README details cluster initialization, step-by-step shard key selection rationale, and backup execution instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks syntax and validates all MongoDB shell script files.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Sharding & Architecture",
      weight: 25,
      layerId: "mongodb-admin-7",
      description:
        "Does the sharded cluster route requests correctly via mongos and balance chunks across shards?",
    },
    {
      id: "data-modeling",
      name: "Schema & Aggregation",
      weight: 20,
      layerId: "mongodb-admin-4",
      description:
        "Are document structures and aggregation pipelines efficiently designed for typical access patterns?",
    },
    {
      id: "indexing-perf",
      name: "Indexing & WiredTiger Tuning",
      weight: 15,
      layerId: "mongodb-admin-3",
      description:
        "Are indexes optimal, avoiding full collscans and covered by winning query plans?",
    },
    {
      id: "replica-backup",
      name: "Replica Sets & Backups",
      weight: 15,
      layerId: "mongodb-admin-6",
      description:
        "Are replica set elections resilient, and do backups include oplog tailing for consistency?",
    },
    {
      id: "security",
      name: "RBAC & Authentication",
      weight: 15,
      layerId: "mongodb-admin-5",
      description:
        "Is authentication enforced across nodes with granular RBAC privileges configured?",
    },
    {
      id: "docs-ops",
      name: "Operations & Observability",
      weight: 10,
      layerId: "mongodb-admin-8",
      description:
        "Are cluster monitoring, currentOp diagnostics, and setup documentation complete?",
    },
  ],

  twistPool: [
    {
      id: "change-streams-sync",
      text: "Implement a Node.js/Python script using Change Streams to watch collection changes in real time and mirror updates to an audit collection.",
    },
    {
      id: "client-side-field-encryption",
      text: "Configure Client-Side Field Level Encryption (CSFLE) to encrypt sensitive user document fields before persisting to MongoDB.",
    },
    {
      id: "atlas-search-mock",
      text: "Define custom text/search index definitions and queries simulating Atlas Search autocomplete and fuzzy searching capability.",
    },
    {
      id: "hedged-reads",
      text: "Configure custom read preferences with hedged reads enabled to minimize long-tail latency across geographically distributed shards.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
