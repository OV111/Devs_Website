/**
 * Capstone brief — cassandra-engineer track (cassandra-engineer), v1.
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
  trackId: "cassandra-engineer",
  categoryId: "database",
  slug: "cassandra-engineer-iot-telemetry",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Datacenter Cassandra Cluster for IoT Telemetry Analytics",
  summary:
    "Design and deploy a distributed Apache Cassandra cluster across a multi-datacenter topology. Build high-throughput " +
    "time-series CQL data models, execute nodetool maintenance operations, implement RBAC security, and establish " +
    "Prometheus monitoring.",
  stack: [
    "Apache Cassandra",
    "CQL",
    "Python or Java",
    "Docker Compose",
    "Prometheus",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "multi-dc-cluster",
      text: "Configure a multi-datacenter Cassandra cluster using NetworkTopologyStrategy with a Replication Factor of 3 per datacenter.",
      check: CHECKS.compose,
    },
    {
      id: "cql-schema-design",
      text: "Design a query-first CQL schema featuring time-bucketed partition keys, clustering columns for timestamp ordering, and User-Defined Types (UDTs).",
      check: { type: "file", glob: "**/schema.cql" },
    },
    {
      id: "consistency-tuning",
      text: "Implement application client queries utilizing LOCAL_QUORUM consistency levels for both reads and writes to balance speed and availability.",
      check: { type: "file", glob: "**/cassandra_client.{py,java,js}" },
    },
    {
      id: "compaction-strategy",
      text: "Configure TimeWindowCompactionStrategy (TWCS) on time-series telemetry tables and SizeTieredCompactionStrategy (STCS) on lookup tables.",
      check: { type: "file", glob: "**/schema.cql" },
    },
    {
      id: "rbac-security",
      text: "Enable PasswordAuthenticator, configure client-to-node TLS encryption, and assign granular object permissions using GRANT/REVOKE syntax.",
      check: { type: "file", glob: "**/security.cql" },
    },
    {
      id: "maintenance-scripts",
      text: "Provide automated operator shell scripts for executing nodetool repair, nodetool status, and adding/decommissioning cluster nodes.",
      check: { type: "file", glob: "**/scripts/nodetool_ops.sh" },
    },
    {
      id: "jmx-monitoring",
      text: "Deploy Prometheus JMX Exporter configured to capture key Cassandra metrics (read/write latency, pending compactions, GC pause time).",
      check: { type: "file", glob: "**/jmx_exporter.yml" },
    },
    {
      id: "benchmarking-tests",
      text: "Include cassandra-stress test scripts and integration tests measuring read/write performance under partition key load.",
      check: { type: "file", glob: "**/scripts/stress_test.sh" },
    },
    {
      id: "readme",
      text: "README documents cluster topology, CQL query-first data modeling decisions, consistency level trade-offs, and nodetool maintenance runbooks.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow lints CQL schema definitions and runs client driver syntax checks.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "architecture-ring",
      name: "Ring Architecture & Topology",
      weight: 20,
      layerId: "cassandra-engineer-1",
      description:
        "Is the peer-to-peer token ring and multi-datacenter replication factor correctly configured?",
    },
    {
      id: "cql-data-modeling",
      name: "CQL Query-First Data Modeling",
      weight: 25,
      layerId: "cassandra-engineer-3",
      description:
        "Are partition and clustering keys selected to prevent hot partitions and wide row anti-patterns?",
    },
    {
      id: "consistency-rep",
      name: "Replication & Consistency Levels",
      weight: 20,
      layerId: "cassandra-engineer-4",
      description:
        "Are LOCAL_QUORUM read/write consistency settings properly applied in application code?",
    },
    {
      id: "ops-maintenance",
      name: "Operations & Compaction Tuning",
      weight: 15,
      layerId: "cassandra-engineer-5",
      description:
        "Are compaction strategies (TWCS/STCS) correctly selected and nodetool scripts operational?",
    },
    {
      id: "security-rbac",
      name: "Authentication & Security",
      weight: 10,
      layerId: "cassandra-engineer-7",
      description:
        "Is RBAC enforced with role-based CQL permissions and TLS communication secured?",
    },
    {
      id: "observability-dc",
      name: "Multi-DC Routing & Observability",
      weight: 10,
      layerId: "cassandra-engineer-9",
      description:
        "Are JMX Prometheus metrics exposed and driver-level DC failover routing configured?",
    },
  ],

  twistPool: [
    {
      id: "medusa-backup-restore",
      text: "Integrate the Medusa backup and restore tool to automate cluster snapshot uploads to remote cloud storage.",
    },
    {
      id: "k8ssandra-deployment",
      text: "Provide K8ssandra custom resource operator manifests to deploy the Cassandra cluster on Kubernetes.",
    },
    {
      id: "materialized-views-alternatives",
      text: "Implement secondary query access patterns using application-side dual writes instead of Materialized Views.",
    },
    {
      id: "chaos-node-kill",
      text: "Provide a Chaos Toolkit experiment script that abruptly terminates a Cassandra seed node during active stress testing.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
