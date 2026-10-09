/**
 * Capstone brief — postgres-dba track (postgres-dba), v1.
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
  trackId: "postgres-dba",
  categoryId: "database",
  slug: "postgres-dba-ha-cluster",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "High-Availability PostgreSQL Cluster with Failover and PITR",
  summary:
    "Design and deploy a production-grade PostgreSQL cluster with automated failover, streaming replication, " +
    "WAL archiving, point-in-time recovery scripts, and role-based access control. Everything must be provisioned " +
    "and verified using reproducible automation.",
  stack: [
    "PostgreSQL",
    "Patroni",
    "etcd",
    "PgBouncer",
    "Docker Compose",
    "Bash",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "ha-cluster",
      text: "Configure a 3-node PostgreSQL cluster with Patroni and etcd for automated leader election and failover.",
      check: CHECKS.compose,
    },
    {
      id: "pgbouncer",
      text: "Deploy PgBouncer in front of the cluster to handle transaction-level connection pooling and route connections smoothly across failovers.",
      check: { type: "file", glob: "**/pgbouncer.ini" },
    },
    {
      id: "replication",
      text: "Enable streaming replication with replication slots, maintaining at least one hot standby node.",
      check: { type: "file", glob: "**/patroni*.yml" },
    },
    {
      id: "wal-archiving",
      text: "Configure continuous WAL archiving to a local or object-backed volume and provide a verified PITR recovery script.",
      check: { type: "file", glob: "**/scripts/restore_pitr.sh" },
    },
    {
      id: "security-rls",
      text: "Configure pg_hba.conf for strict TLS-only access, application-specific roles, and write an example table with Row-Level Security (RLS) enabled.",
      check: { type: "file", glob: "**/schema.sql" },
    },
    {
      id: "indexing-tuning",
      text: "Include custom PostgreSQL runtime configuration (shared_buffers, work_mem, wal_buffers) and a script creating B-tree, Partial, and GIN indexes with EXPLAIN ANALYZE verification.",
      check: { type: "file", glob: "**/postgresql.conf" },
    },
    {
      id: "partitioning",
      text: "Implement range partitioning for a high-volume events table with partition pruning enabled and an automated creation script.",
      check: { type: "file", glob: "**/partitioning.sql" },
    },
    {
      id: "backup-test",
      text: "Provide automated scripts to perform logical backups with pg_dump and physical base backups with pg_basebackup.",
      check: { type: "file", glob: "**/scripts/backup.sh" },
    },
    {
      id: "failover-drill",
      text: "Write an automated test/simulation script that kills the primary node and verifies that failover occurs without data loss.",
      check: { type: "file", glob: "**/scripts/test_failover.sh" },
    },
    {
      id: "readme",
      text: "README documents cluster setup, failover testing instructions, and full PITR recovery execution steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow runs linting on scripts and validates SQL schema files.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Cluster Functionality & PITR",
      weight: 25,
      layerId: "postgres-dba-5",
      description:
        "Does the cluster fail over automatically, and does the PITR script restore data to a precise timestamp?",
    },
    {
      id: "indexing-opt",
      name: "Query Optimization & Indexing",
      weight: 15,
      layerId: "postgres-dba-3",
      description:
        "Are appropriate indexes (GIN, Partial, B-tree) and range partitioning applied effectively?",
    },
    {
      id: "concurrency-locking",
      name: "Concurrency & Tuning",
      weight: 15,
      layerId: "postgres-dba-4",
      description:
        "Are PostgreSQL memory parameters, WAL buffers, and transaction isolation levels properly configured?",
    },
    {
      id: "replication-ha",
      name: "HA & Replication",
      weight: 20,
      layerId: "postgres-dba-10",
      description:
        "Are Patroni, etcd consensus, and PgBouncer connection routing correctly integrated and resilient?",
    },
    {
      id: "security",
      name: "Security & RLS",
      weight: 15,
      layerId: "postgres-dba-7",
      description:
        "Is pg_hba.conf hardened, TLS enforced, and Row-Level Security properly implemented?",
    },
    {
      id: "docs-ops",
      name: "Ops & Documentation",
      weight: 10,
      layerId: "postgres-dba-8",
      description:
        "Clear instructions for cluster bootstrap, disaster recovery drills, and performance verification.",
    },
  ],

  twistPool: [
    {
      id: "logical-rep-analytics",
      text: "Set up an additional standalone PostgreSQL analytics node that receives data via logical replication publications/subscriptions for a subset of tables.",
    },
    {
      id: "zero-downtime-migration",
      text: "Provide a script demonstrating a zero-downtime column alter/migration on a multi-million row table using batch updates and lock timeouts.",
    },
    {
      id: "pg-stat-statements-audit",
      text: "Integrate pg_stat_statements and write an automated audit script that identifies slow queries exceeding a 100ms threshold.",
    },
    {
      id: "partman-retention",
      text: "Integrate pg_partman to manage partition creation and automatically drop or archive partitions older than 30 days.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
