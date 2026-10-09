/**
 * Capstone brief — mysql-dba track (mysql-dba), v1.
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
  trackId: "mysql-dba",
  categoryId: "database",
  slug: "mysql-dba-innodb-cluster",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production MySQL Group Replication Cluster with ProxySQL",
  summary:
    "Deploy a multi-node MySQL InnoDB Cluster utilizing GTID-based Group Replication, ProxySQL read/write splitting, " +
    "automated physical backups, and tuned InnoDB configuration for high-throughput transactional workloads.",
  stack: [
    "MySQL",
    "ProxySQL",
    "Group Replication",
    "Docker Compose",
    "Bash",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "group-replication",
      text: "Configure a 3-node MySQL Group Replication cluster operating with GTIDs enabled and ROW-based binary logging.",
      check: CHECKS.compose,
    },
    {
      id: "proxysql-routing",
      text: "Deploy ProxySQL in front of the cluster to handle query routing, separating read traffic to secondaries and write traffic to the primary.",
      check: { type: "file", glob: "**/proxysql.cnf" },
    },
    {
      id: "innodb-tuning",
      text: "Provide customized my.cnf configurations tuning InnoDB buffer pool size, redo log capacity, thread concurrency, and max connections.",
      check: { type: "file", glob: "**/my.cnf" },
    },
    {
      id: "user-security",
      text: "Create least-privilege user accounts using GRANT/REVOKE, enforce SSL connections, and disable default insecure installations.",
      check: { type: "file", glob: "**/init_users.sql" },
    },
    {
      id: "backup-recovery",
      text: "Provide scripts for full physical backups using xtrabackup or mysqldump with GTID position preservation and binary log purge routines.",
      check: { type: "file", glob: "**/scripts/backup.sh" },
    },
    {
      id: "indexing-analysis",
      text: "Implement composite and covering indexes on a sample high-traffic schema, verified with EXPLAIN query execution plan outputs.",
      check: { type: "file", glob: "**/schema.sql" },
    },
    {
      id: "performance-schema",
      text: "Include diagnostic SQL scripts utilizing Performance Schema and sys schema views to identify top lock wait events and statement digests.",
      check: { type: "file", glob: "**/scripts/diagnostics.sql" },
    },
    {
      id: "failover-script",
      text: "Include a simulation script that triggers a primary failure and validates ProxySQL dynamic target re-routing.",
      check: { type: "file", glob: "**/scripts/test_failover.sh" },
    },
    {
      id: "readme",
      text: "README provides comprehensive documentation for bootstrapping the cluster, configuring ProxySQL, and running disaster recovery.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI pipeline validates SQL scripts and checks configuration syntax.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Cluster & Backup Correctness",
      weight: 25,
      layerId: "mysql-dba-4",
      description:
        "Does Group Replication operate reliably with GTIDs, and do backup scripts capture consistent snapshots?",
    },
    {
      id: "innodb-engine",
      name: "InnoDB Engine & Optimization",
      weight: 20,
      layerId: "mysql-dba-2",
      description:
        "Are InnoDB buffer pool, redo log, and clustered/composite indexes optimized for performance?",
    },
    {
      id: "replication-ha",
      name: "Replication & Proxy Routing",
      weight: 20,
      layerId: "mysql-dba-9",
      description:
        "Does ProxySQL correctly isolate reads and writes, seamlessly surviving node failover?",
    },
    {
      id: "security",
      name: "User Security & Grants",
      weight: 15,
      layerId: "mysql-dba-5",
      description:
        "Are database credentials and network permissions hardened using least-privilege rules and TLS?",
    },
    {
      id: "observability",
      name: "Performance Diagnostics",
      weight: 10,
      layerId: "mysql-dba-7",
      description:
        "Do diagnostics leverage Performance Schema and sys schema to detect bottlenecks?",
    },
    {
      id: "docs-ops",
      name: "Ops & Documentation",
      weight: 10,
      layerId: "mysql-dba-10",
      description:
        "Are orchestration procedures clear, concise, and reproducible via provided scripts?",
    },
  ],

  twistPool: [
    {
      id: "pt-online-schema-change",
      text: "Provide a script integrating Percona Toolkit (pt-online-schema-change) to alter a live table schema without blocking writes.",
    },
    {
      id: "orchestrator-integration",
      text: "Integrate Orchestrator into the topology to visualize node replication status and manage automated topology recovery.",
    },
    {
      id: "query-caching-proxysql",
      text: "Configure ProxySQL query caching rules for heavy read queries with configurable TTL parameters.",
    },
    {
      id: "audit-logging",
      text: "Configure the MySQL Audit Log plugin to track and record all DDL execution and unauthorized access attempts.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
