/**
 * Capstone brief — Graph DB Engineer track (graph-db-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "graph-db-engineer",
  categoryId: "database",
  slug: "graph-db-engineer-fraud-analytics",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Graph Analytics Engine for Financial Fraud Network Detection",
  summary:
    "Design and deploy a production Neo4j graph database platform. Model complex financial entities, implement " +
    "Cypher queries with GDS algorithms (PageRank, Louvain, Betweenness Centrality), enforce property-level access control, " +
    "and construct real-time fraud detection pipelines.",
  stack: ["Neo4j", "Cypher", "Neo4j GDS", "Python", "Docker Compose", "GitHub Actions"],

  requirements: [
    { id: "graph-model-schema", text: "Design a property graph schema representing accounts, transactions, devices, IP addresses, and physical locations using directional and intermediate node relationships.", check: { type: "file", glob: "**/schema.cypher" } },
    { id: "cypher-queries", text: "Write Cypher queries using MATCH, MERGE, pattern variables, and WITH chaining to traverse multi-hop relationship rings efficiently.", check: { type: "file", glob: "**/queries.cypher" } },
    { id: "graph-indexes", text: "Create range, text, and full-text indexes over key node properties, verified using EXPLAIN and PROFILE query execution plans.", check: { type: "file", glob: "**/indexes.cypher" } },
    { id: "gds-algorithms", text: "Implement Graph Data Science (GDS) projections to execute PageRank for entity importance and Louvain for community fraud ring detection.", check: { type: "file", glob: "**/gds_analytics.{py,cypher}" } },
    { id: "app-integration", text: "Build a Python application layer utilizing the official Neo4j driver to execute transactional Cypher queries with causal bookmarks.", check: { type: "file", glob: "**/app.{py,js}" } },
    { id: "security-rbac", text: "Configure Neo4j RBAC creating custom roles, database privileges, and sub-graph property-level read restrictions.", check: { type: "file", glob: "**/security.cypher" } },
    { id: "docker-setup", text: "Provide a Docker Compose manifest running Neo4j Enterprise/Community with APOC and GDS plugins enabled.", check: CHECKS.compose },
    { id: "backup-ops", text: "Include operational shell scripts running neo4j-admin backup and restore procedures.", check: { type: "file", glob: "**/scripts/backup.sh" } },
    { id: "tests", text: "Write integration tests validating graph pattern matches, transaction rollbacks, and GDS algorithm output consistency.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details graph data modeling trade-offs, Cypher optimization steps, GDS pipeline execution, and deployment instructions.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow lints Cypher scripts and runs Python driver integration tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "graph-modeling", name: "Property Graph Modeling", weight: 20, layerId: "graph-db-engineer-3", description: "Are entities and relationships structured to avoid dense node bottlenecks while enabling fast traversals?" },
    { id: "cypher-optimization", name: "Cypher Queries & Indexing", weight: 20, layerId: "graph-db-engineer-2", description: "Are Cypher queries written using MERGE and WITH chaining, covered by appropriate indexes?" },
    { id: "gds-algorithms", name: "Graph Algorithms & Community Detection", weight: 20, layerId: "graph-db-engineer-5", description: "Are PageRank and Louvain GDS algorithms executed properly over graph memory projections?" },
    { id: "security-access", name: "Security & Sub-graph RBAC", weight: 15, layerId: "graph-db-engineer-6", description: "Are fine-grained property-level and label-level privileges securely assigned?" },
    { id: "fraud-app-dev", name: "Application Integration & Causal Consistency", weight: 15, layerId: "graph-db-engineer-9", description: "Does the application integration use official drivers and maintain causal consistency?" },
    { id: "ops-deployment", name: "Production Ops & Backup Procedures", weight: 10, layerId: "graph-db-engineer-10", description: "Are neo4j-admin backup routines and Prometheus metrics monitoring properly configured?" },
  ],

  twistPool: [
    { id: "gql-standard-compliance", text: "Provide an equivalent set of queries adhering to the ISO GQL standard syntax alongside Cypher scripts." },
    { id: "causal-clustering-setup", text: "Provide a multi-node Neo4j Causal Clustering compose manifest featuring Raft core members and read replicas." },
    { id: "realtime-fraud-webhook", text: "Construct an event-driven webhook service that evaluates incoming transaction paths against known fraud rings in under 50ms." },
    { id: "collaborative-recommendation", text: "Extend the graph model to execute collaborative filtering recommendation algorithms over user purchasing behavior." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Vector DB Engineer track (vector-db-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "vector-db-engineer",
  categoryId: "database",
  slug: "vector-db-engineer-rag-search",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production RAG Engine with Hybrid Vector Search and pgvector",
  summary:
    "Build a production-grade Retrieval-Augmented Generation (RAG) platform using pgvector and Qdrant/Weaviate. " +
    "Implement document chunking pipelines, HNSW/IVFFlat indexing, hybrid search scoring (dense + sparse keyword), " +
    "and embedding drift monitoring pipelines.",
  stack: ["pgvector", "Qdrant or Weaviate", "Python", "Sentence Transformers", "Docker Compose", "GitHub Actions"],

  requirements: [
    { id: "vector-storage", text: "Configure PostgreSQL with pgvector extension and create tables storing dense embedding vectors alongside structured metadata.", check: { type: "file", glob: "**/schema.sql" } },
    { id: "ann-indexing", text: "Create and benchmark HNSW and IVFFlat vector indexes, adjusting m, ef_construction, and lists parameters for recall vs speed trade-offs.", check: { type: "file", glob: "**/indexes.sql" } },
    { id: "ingestion-chunking", text: "Build an ingestion pipeline that parses long-form documents using semantic text chunking and generates embeddings via Sentence Transformers.", check: { type: "file", glob: "**/ingest.{py,js}" } },
    { id: "rag-retrieval", text: "Implement a RAG pipeline executing k-NN similarity search (cosine/L2 distance) with metadata filtering to supply context to an LLM.", check: { type: "file", glob: "**/rag_pipeline.{py,js}" } },
    { id: "hybrid-search", text: "Implement hybrid search combining BM25 keyword retrieval with dense vector similarity using reciprocal rank fusion (RRF) or alpha weighting.", check: { type: "file", glob: "**/hybrid_search.{py,js}" } },
    { id: "recall-evaluation", text: "Include an evaluation script calculating recall@k against a ground-truth exact brute-force search dataset.", check: { type: "file", glob: "**/evaluate_recall.{py,js}" } },
    { id: "container-stack", text: "Provide a Docker Compose file spinning up PostgreSQL with pgvector and Qdrant/Weaviate instances.", check: CHECKS.compose },
    { id: "tests", text: "Write integration tests validating vector insertion, payload metadata filtering, and search retrieval accuracy.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details vector database architecture, chunking strategy, index parameter trade-offs, and recall benchmark findings.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow runs embedding ingestion tests and lints Python code.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "embeddings-vector", name: "Embeddings & Vector Representations", weight: 15, layerId: "vector-db-engineer-1", description: "Are vector embeddings generated, dimensionally aligned, and normalized correctly?" },
    { id: "ann-indexing", name: "ANN Algorithms & Index Tuning", weight: 20, layerId: "vector-db-engineer-2", description: "Are HNSW/IVFFlat index parameters tuned effectively for optimal QPS and recall?" },
    { id: "pgvector-impl", name: "pgvector & Database Schema", weight: 20, layerId: "vector-db-engineer-3", description: "Is pgvector properly configured with appropriate vector operators (<->, <=>, <#>)?" },
    { id: "rag-pipeline", name: "RAG Pipeline & Metadata Filtering", weight: 20, layerId: "vector-db-engineer-5", description: "Does the RAG pipeline chunk documents effectively and apply strict payload metadata filters?" },
    { id: "hybrid-search", name: "Hybrid Search & Multi-modal Scoring", weight: 15, layerId: "vector-db-engineer-7", description: "Are BM25 keyword search and dense vector scores combined seamlessly via reciprocal rank fusion?" },
    { id: "eval-ops", name: "Evaluation & Operational Metrics", weight: 10, layerId: "vector-db-engineer-9", description: "Are recall@k evaluation pipelines and Prometheus QPS/latency metrics clearly documented?" },
  ],

  twistPool: [
    { id: "embedding-drift-detection", text: "Build an automated monitor that detects embedding space drift between model versions and triggers index re-embedding." },
    { id: "clip-multi-modal", text: "Extend the pipeline to process multi-modal inputs (images and text) using OpenAI CLIP embeddings." },
    { id: "qdrant-quantization", text: "Configure Scalar Quantization (SQ) or Product Quantization (PQ) in Qdrant to reduce RAM usage while preserving search precision." },
    { id: "mlflow-model-versioning", text: "Integrate MLflow to version embedding model artifacts and track retrieval recall metrics over time." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Cassandra Engineer track (cassandra-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Apache Cassandra", "CQL", "Python or Java", "Docker Compose", "Prometheus", "GitHub Actions"],

  requirements: [
    { id: "multi-dc-cluster", text: "Configure a multi-datacenter Cassandra cluster using NetworkTopologyStrategy with a Replication Factor of 3 per datacenter.", check: CHECKS.compose },
    { id: "cql-schema-design", text: "Design a query-first CQL schema featuring time-bucketed partition keys, clustering columns for timestamp ordering, and User-Defined Types (UDTs).", check: { type: "file", glob: "**/schema.cql" } },
    { id: "consistency-tuning", text: "Implement application client queries utilizing LOCAL_QUORUM consistency levels for both reads and writes to balance speed and availability.", check: { type: "file", glob: "**/cassandra_client.{py,java,js}" } },
    { id: "compaction-strategy", text: "Configure TimeWindowCompactionStrategy (TWCS) on time-series telemetry tables and SizeTieredCompactionStrategy (STCS) on lookup tables.", check: { type: "file", glob: "**/schema.cql" } },
    { id: "rbac-security", text: "Enable PasswordAuthenticator, configure client-to-node TLS encryption, and assign granular object permissions using GRANT/REVOKE syntax.", check: { type: "file", glob: "**/security.cql" } },
    { id: "maintenance-scripts", text: "Provide automated operator shell scripts for executing nodetool repair, nodetool status, and adding/decommissioning cluster nodes.", check: { type: "file", glob: "**/scripts/nodetool_ops.sh" } },
    { id: "jmx-monitoring", text: "Deploy Prometheus JMX Exporter configured to capture key Cassandra metrics (read/write latency, pending compactions, GC pause time).", check: { type: "file", glob: "**/jmx_exporter.yml" } },
    { id: "benchmarking-tests", text: "Include cassandra-stress test scripts and integration tests measuring read/write performance under partition key load.", check: { type: "file", glob: "**/scripts/stress_test.sh" } },
    { id: "readme", text: "README documents cluster topology, CQL query-first data modeling decisions, consistency level trade-offs, and nodetool maintenance runbooks.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow lints CQL schema definitions and runs client driver syntax checks.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "architecture-ring", name: "Ring Architecture & Topology", weight: 20, layerId: "cassandra-engineer-1", description: "Is the peer-to-peer token ring and multi-datacenter replication factor correctly configured?" },
    { id: "cql-data-modeling", name: "CQL Query-First Data Modeling", weight: 25, layerId: "cassandra-engineer-3", description: "Are partition and clustering keys selected to prevent hot partitions and wide row anti-patterns?" },
    { id: "consistency-rep", name: "Replication & Consistency Levels", weight: 20, layerId: "cassandra-engineer-4", description: "Are LOCAL_QUORUM read/write consistency settings properly applied in application code?" },
    { id: "ops-maintenance", name: "Operations & Compaction Tuning", weight: 15, layerId: "cassandra-engineer-5", description: "Are compaction strategies (TWCS/STCS) correctly selected and nodetool scripts operational?" },
    { id: "security-rbac", name: "Authentication & Security", weight: 10, layerId: "cassandra-engineer-7", description: "Is RBAC enforced with role-based CQL permissions and TLS communication secured?" },
    { id: "observability-dc", name: "Multi-DC Routing & Observability", weight: 10, layerId: "cassandra-engineer-9", description: "Are JMX Prometheus metrics exposed and driver-level DC failover routing configured?" },
  ],

  twistPool: [
    { id: "medusa-backup-restore", text: "Integrate the Medusa backup and restore tool to automate cluster snapshot uploads to remote cloud storage." },
    { id: "k8ssandra-deployment", text: "Provide K8ssandra custom resource operator manifests to deploy the Cassandra cluster on Kubernetes." },
    { id: "materialized-views-alternatives", text: "Implement secondary query access patterns using application-side dual writes instead of Materialized Views." },
    { id: "chaos-node-kill", text: "Provide a Chaos Toolkit experiment script that abruptly terminates a Cassandra seed node during active stress testing." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Redis Engineer track (redis-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["Redis", "RedisSearch", "Node.js or Python", "Docker Compose", "GitHub Actions"],

  requirements: [
    { id: "redis-cluster-setup", text: "Deploy a 6-node (3 primary, 3 replica) Redis Cluster with automated hash slot distribution.", check: CHECKS.compose },
    { id: "caching-patterns", text: "Implement cache-aside and write-through caching patterns with TTL eviction policies and jitter to prevent cache stampedes.", check: { type: "file", glob: "**/cache_service.{js,ts,py}" } },
    { id: "streams-consumer-groups", text: "Build an event processing system using Redis Streams (XADD, XREADGROUP) with consumer groups and explicit message ACK handling.", check: { type: "file", glob: "**/stream_consumer.{js,ts,py}" } },
    { id: "redis-search-indexing", text: "Create RedisSearch index schemas and write secondary full-text queries over complex JSON/Hash documents.", check: { type: "file", glob: "**/search_indexer.{js,ts,py}" } },
    { id: "atomic-lua-scripts", text: "Write Lua scripts executed via EVALSHA for atomic operations like rate-limiting sliding windows and token bucket algorithms.", check: { type: "file", glob: "**/scripts/*.lua" } },
    { id: "persistence-tuning", text: "Configure hybrid persistence combining periodic RDB snapshots with append-only file (AOF) using fsync everysec policies.", check: { type: "file", glob: "**/redis.conf" } },
    { id: "acl-security", text: "Set up Redis ACL configuration defining restricted user accounts with specific key patterns and command privileges.", check: { type: "file", glob: "**/users.acl" } },
    { id: "tests", text: "Write comprehensive integration tests verifying cluster resharding, key failover routing, and stream processing.", check: CHECKS.jsTests },
    { id: "readme", text: "README details Redis Cluster topology setup, stream consumer architecture, memory eviction tuning, and testing instructions.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow spins up Redis Cluster nodes and runs integration test suites.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "data-structures", name: "Data Structures & Caching", weight: 20, layerId: "redis-engineer-2", description: "Are appropriate Redis data structures (Hashes, Sorted Sets) used alongside robust cache invalidation strategies?" },
    { id: "caching-patterns", name: "Caching Patterns & Expiration", weight: 15, layerId: "redis-engineer-3", description: "Are cache-aside, write-through, and stampede mitigation techniques properly implemented?" },
    { id: "pubsub-streams", name: "Redis Streams & Consumer Groups", weight: 20, layerId: "redis-engineer-5", description: "Do stream consumer groups process messages reliably without pending message backlog leaks?" },
    { id: "cluster-ha", name: "Redis Cluster & Resilience", weight: 20, layerId: "redis-engineer-8", description: "Is Redis Cluster properly configured across hash slots with graceful MOVED/ASK redirect handling?" },
    { id: "search-lua", name: "RedisSearch & Atomic Lua Scripts", weight: 15, layerId: "redis-engineer-9", description: "Are Lua scripts atomic and error-free, and are RedisSearch indexes optimized?" },
    { id: "ops-security", name: "ACL Security & Production Ops", weight: 10, layerId: "redis-engineer-10", description: "Are maxmemory eviction policies, ACL user permissions, and persistence policies correctly tuned?" },
  ],

  twistPool: [
    { id: "redlock-distributed-lock", text: "Implement the Redlock distributed locking algorithm across multiple Redis master nodes with automatic TTL extension." },
    { id: "timeseries-module-metrics", text: "Integrate the RedisTimeSeries module to collect real-time system throughput metrics and execute downsampling aggregation queries." },
    { id: "sentinel-failover-mode", text: "Provide an alternative deployment setup utilizing Redis Sentinel for automatic primary-replica failover monitoring." },
    { id: "client-side-caching", text: "Implement RESP3 client-side caching with invalidation messages to maintain local memory cache consistency." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Database Reliability Eng track (db-reliability), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "db-reliability",
  categoryId: "database",
  slug: "db-reliability-ops-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Database Reliability Platform: Monitoring, Zero-Downtime Migrations & DR Chaos",
  summary:
    "Build a production-grade Database Reliability Engineering platform. Configure Prometheus golden signals monitoring, " +
    "automated backup validation pipelines, replication lag alerting, zero-downtime schema migrations with gh-ost/pt-online-schema-change, " +
    "and Chaos Engineering disaster recovery suites.",
  stack: ["PostgreSQL or MySQL", "Prometheus", "Grafana", "gh-ost", "Docker Compose", "Bash", "GitHub Actions"],

  requirements: [
    { id: "observability-stack", text: "Deploy Prometheus and Grafana connected to postgres_exporter or mysqldump_exporter tracking golden signals (latency, traffic, errors, saturation).", check: CHECKS.compose },
    { id: "prometheus-alerts", text: "Define Prometheus alert rules for high replication lag, connection saturation (>85%), disk space exhaustion, and high slow query rate.", check: { type: "file", glob: "**/alerts.yml" } },
    { id: "backup-validation", text: "Create an automated backup validation script that restores the latest physical/logical backup into a isolated container and verifies checksum integrity.", check: { type: "file", glob: "**/scripts/validate_backup.sh" } },
    { id: "zero-downtime-migration", text: "Provide a zero-downtime online schema change script (using gh-ost or pt-online-schema-change) that alters a table schema during live writes.", check: { type: "file", glob: "**/scripts/online_migration.sh" } },
    { id: "ha-failover-runbook", text: "Configure HA failover (Patroni/ProxySQL) and write executable runbooks for database incident recovery scenarios.", check: { type: "file", glob: ["**/runbooks/*.md", "docs/runbooks/*.md"] } },
    { id: "chaos-experiments", text: "Write an automated chaos test script simulating network partitions, packet loss, or process kills and verifying automatic cluster recovery.", check: { type: "file", glob: "**/scripts/chaos_test.sh" } },
    { id: "security-audit", text: "Configure TLS for network transit, enable database audit logging, and provide dynamic secret fetching scripts via HashiCorp Vault or environment variables.", check: { type: "file", glob: "**/vault_secrets.sh" } },
    { id: "capacity-model", text: "Provide a capacity forecasting script/spreadsheet calculation that projects disk space and connection limits based on exporter metrics.", check: { type: "file", glob: "**/capacity_model.py" } },
    { id: "readme", text: "README describes SLO/SLA error budgets, monitoring setup, disaster recovery drill execution, and blameless postmortem templates.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow executes backup validation scripts and lints Prometheus alerting rules.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "reliability-slo", name: "SLOs & Error Budgets", weight: 15, layerId: "db-reliability-1", description: "Are database reliability SLOs clearly defined and backed by actionable alerting rules?" },
    { id: "monitoring-alerting", name: "Monitoring & Observability", weight: 20, layerId: "db-reliability-2", description: "Are Prometheus exporters and Grafana dashboards configured for all four golden signals?" },
    { id: "backup-validation", name: "Backup Validation Pipelines", weight: 20, layerId: "db-reliability-3", description: "Is automated backup restoration and checksum verification reliably executed?" },
    { id: "ha-failover", name: "HA & Replication Resilience", weight: 15, layerId: "db-reliability-5", description: "Do HA mechanisms survive network partitions and handle replication lag spikes?" },
    { id: "schema-migrations", name: "Zero-Downtime Migration Ops", weight: 15, layerId: "db-reliability-8", description: "Are online schema migration tools configured to alter schemas without table locking?" },
    { id: "chaos-dr", name: "Chaos Testing & DR Runbooks", weight: 15, layerId: "db-reliability-10", description: "Are chaos recovery drills functional and supported by clear incident runbooks?" },
  ],

  twistPool: [
    { id: "vault-dynamic-secrets", text: "Integrate a live HashiCorp Vault instance to issue short-lived dynamic database credentials rotated every hour." },
    { id: "toxiproxy-network-simulation", text: "Incorporate Toxiproxy into the chaos suite to simulate specific latency degradation and TCP connection resets." },
    { id: "auto-remediation-script", text: "Build an automated remediation daemon that catches replication lag alerts and automatically terminates long-running analytical queries." },
    { id: "postmortem-report-template", text: "Include a completed blameless postmortem document analyzing a simulated 30-minute outage drill." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — NoSQL Engineer track (nosql-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["MongoDB", "Redis", "Apache Cassandra", "Node.js or Python", "Docker Compose", "GitHub Actions"],

  requirements: [
    { id: "mongodb-app", text: "Implement MongoDB document modeling with Mongoose/native driver featuring schema validations, atomic updates, and aggregation pipelines.", check: { type: "file", glob: "**/*.{js,ts,py}" } },
    { id: "redis-cache-patterns", text: "Implement Redis cache-aside strategy, rate limiting with sliding window logs, and pub/sub or stream message consumers.", check: { type: "file", glob: "**/redis_service.{js,ts,py}" } },
    { id: "cassandra-timeseries", text: "Design a Cassandra CQL schema optimized for time-series metric aggregation using time-bucketed partition keys and clustering columns.", check: { type: "file", glob: "**/schema.cql" } },
    { id: "polyglot-sync", text: "Build an event-driven sync mechanism (Change Streams or Redis Streams) that updates analytics in Cassandra when document writes occur in MongoDB.", check: { type: "file", glob: "**/sync_service.{js,ts,py}" } },
    { id: "compose-stack", text: "Provide a unified Docker Compose manifest starting MongoDB, Redis, and Cassandra with healthchecks.", check: CHECKS.compose },
    { id: "tests", text: "Write automated integration tests validating data reads/writes across all three NoSQL data stores.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,py}" } },
    { id: "env-example", text: "Provide environment variable templates for connecting to each database instance safely.", check: CHECKS.envExample },
    { id: "observability", text: "Include Prometheus exporter configurations or diagnostic scripts monitoring cache hit ratios and Cassandra latency.", check: { type: "file", glob: "**/prometheus.yml" } },
    { id: "readme", text: "README outlines polyglot database choices, consistency trade-offs (CAP theorem decisions), and instructions to run tests.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow spins up database service containers and runs all integration tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "nosql-foundations", name: "Polyglot Architecture & CAP", weight: 20, layerId: "nosql-engineer-1", description: "Are data store selections aligned with storage strengths and consistency requirements?" },
    { id: "mongo-dev", name: "MongoDB Application Design", weight: 20, layerId: "nosql-engineer-2", description: "Are MongoDB collections, ODM schemas, and aggregations properly implemented?" },
    { id: "redis-patterns", name: "Redis Caching & Streams", weight: 15, layerId: "nosql-engineer-3", description: "Are Redis cache-aside, rate limiting, and stream consumer structures correct and fast?" },
    { id: "cassandra-model", name: "Cassandra Data Modeling", weight: 15, layerId: "nosql-engineer-4", description: "Is the Cassandra schema modeled query-first with optimal partition and clustering keys?" },
    { id: "polyglot-sync", name: "CQRS & Polyglot Sync", weight: 20, layerId: "nosql-engineer-8", description: "Is event-driven synchronization between MongoDB, Redis, and Cassandra resilient and non-blocking?" },
    { id: "ops-testing", name: "Ops & Test Coverage", weight: 10, layerId: "nosql-engineer-9", description: "Do integration tests verify cross-database operations, and is setup fully automated?" },
  ],

  twistPool: [
    { id: "dynamodb-single-table-add", text: "Replace the Cassandra metrics layer with an AWS DynamoDB single-table model utilizing Global Secondary Indexes." },
    { id: "redis-search-json", text: "Store document cache using RedisJSON and perform full-text secondary querying using RedisSearch modules." },
    { id: "saga-distributed-tx", text: "Implement a distributed Saga orchestrator handling compensating transactions when writes across multiple NoSQL engines fail." },
    { id: "k8s-helm-deployment", text: "Provide Helm chart manifests for deploying stateful MongoDB, Redis, and Cassandra pods with PersistentVolumeClaims." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — Data Modeler track (data-modeler), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "data-modeler",
  categoryId: "database",
  slug: "data-modeler-enterprise-ecommerce",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise E-Commerce Data Architecture and Analytics Warehouse",
  summary:
    "Design and implement a complete enterprise data model for an e-commerce platform. Build 3NF transactional schemas, " +
    "a Star Schema data warehouse with Slowly Changing Dimensions (SCD Type 2), automated Flyway schema migrations, " +
    "and DynamoDB single-table access models.",
  stack: ["PostgreSQL", "Flyway", "DynamoDB", "SQL", "Docker Compose", "GitHub Actions"],

  requirements: [
    { id: "3nf-schema", text: "Design a fully normalized 3NF OLTP PostgreSQL schema covering users, products, orders, payments, and inventory with strict primary, foreign key, and CHECK constraints.", check: { type: "file", glob: "**/migrations/V1__oltp_schema.sql" } },
    { id: "dimensional-star-schema", text: "Design an OLAP Star Schema featuring fact tables for sales transactions and dimension tables incorporating SCD Type 2 tracking for customer and product attributes.", check: { type: "file", glob: "**/migrations/V2__olap_star_schema.sql" } },
    { id: "schema-migrations", text: "Manage all schema evolution using versioned Flyway migration scripts adhering to the expand-contract zero-downtime migration pattern.", check: { type: "file", glob: "**/migrations/V*.sql" } },
    { id: "nosql-single-table", text: "Create a DynamoDB single-table design schema mapping order fulfillment access patterns using composite PK/SK structures and GSIs.", check: { type: "file", glob: "**/dynamodb_single_table_schema.json" } },
    { id: "temporal-modeling", text: "Implement temporal or bitemporal tables tracking price history and inventory state over valid-time and transaction-time intervals.", check: { type: "file", glob: "**/migrations/V3__temporal_tables.sql" } },
    { id: "referential-integrity", text: "Configure deferred foreign keys, cascading rules, and triggers for derived product rating and inventory totals.", check: { type: "file", glob: "**/triggers.sql" } },
    { id: "data-lineage-catalog", text: "Document end-to-end data lineage and produce a canonical data catalog describing all entities, attributes, and data retention policies.", check: { type: "file", glob: ["**/data_catalog.md", "docs/data_catalog.md"] } },
    { id: "er-diagram", text: "Provide ER diagrams (Crow's Foot notation) for both OLTP 3NF and OLAP Star Schema models.", check: { type: "file", glob: ["**/er_diagram.png", "**/er_diagram.svg", "**/er_diagram.mermaid"] } },
    { id: "readme", text: "README details data modeling rationale, SCD Type 2 handling, migration instructions, and access pattern mapping.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow executes Flyway migrations against a PostgreSQL test database container.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "normalization", name: "Relational Modeling & 3NF", weight: 20, layerId: "data-modeler-2", description: "Is the OLTP schema normalized to 3NF/BCNF with proper primary keys, foreign keys, and CHECK constraints?" },
    { id: "dimensional", name: "Dimensional & SCD Modeling", weight: 25, layerId: "data-modeler-4", description: "Are fact and dimension tables structured cleanly, and is SCD Type 2 history tracked accurately?" },
    { id: "nosql-patterns", name: "NoSQL Single-Table Design", weight: 15, layerId: "data-modeler-6", description: "Are PK/SK keys and GSIs in the DynamoDB schema designed efficiently for declared access patterns?" },
    { id: "data-integrity", name: "Integrity & Triggers", weight: 15, layerId: "data-modeler-7", description: "Are constraints, cascade actions, and triggers for derived state robust and deadlock-free?" },
    { id: "migrations", name: "Schema Migration Strategy", weight: 15, layerId: "data-modeler-9", description: "Are Flyway scripts versioned cleanly and structured to support backward-compatible changes?" },
    { id: "governance-docs", name: "Governance & ER Diagrams", weight: 10, layerId: "data-modeler-10", description: "Are ER diagrams complete and the canonical data catalog thorough and readable?" },
  ],

  twistPool: [
    { id: "bitemporal-audit", text: "Extend temporal price tables into full bitemporal modeling, tracking both effective period and record insertion time." },
    { id: "data-privacy-masking", text: "Add SQL views and dynamic data masking rules that obscure PII (emails, phone numbers) for non-admin reporting roles." },
    { id: "dbt-transformation", text: "Add dbt models to transform raw 3NF OLTP tables into the OLAP Star Schema fact and dimension tables automatically." },
    { id: "graph-entity-resolution", text: "Create a graph schema specification (Cypher script) mapping shared customer addresses and payment instruments to detect account linking." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — MongoDB Admin track (mongodb-admin), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "sharded-cluster", text: "Provision a multi-container cluster containing 2 shard replica sets, 1 config server replica set, and a mongos router.", check: CHECKS.compose },
    { id: "shard-key-design", text: "Define a collections schema with a compound or hashed shard key to ensure even chunk distribution and avoid jumbo chunks.", check: { type: "file", glob: "**/init_sharding.js" } },
    { id: "indexing-winning-plan", text: "Create single-field, compound, and multikey indexes, including explain() outputs demonstrating winning plans without in-memory sorts.", check: { type: "file", glob: "**/indexes.js" } },
    { id: "aggregation-pipeline", text: "Write complex aggregation pipelines using $match,$group, $project, and$lookup to transform and join document data.", check: { type: "file", glob: "**/aggregation.js" } },
    { id: "rbac-security", text: "Implement role-based access control (RBAC) with custom roles restricting read/write permissions per collection and authentication enabled.", check: { type: "file", glob: "**/security_rbac.js" } },
    { id: "backup-restore", text: "Provide automated mongodump and mongorestore shell scripts with oplog capture for consistent point-in-time snapshotting.", check: { type: "file", glob: "**/scripts/backup_restore.sh" } },
    { id: "transactions-sessions", text: "Write a script demonstrating multi-document transaction syntax using client sessions across sharded collections.", check: { type: "file", glob: "**/transaction_demo.js" } },
    { id: "profiling-monitoring", text: "Configure the database profiler to catch slow queries (>100ms) and provide a diagnostics script using currentOp() and mongostat commands.", check: { type: "file", glob: "**/scripts/profiling.js" } },
    { id: "readme", text: "README details cluster initialization, step-by-step shard key selection rationale, and backup execution instructions.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks syntax and validates all MongoDB shell script files.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Sharding & Architecture", weight: 25, layerId: "mongodb-admin-7", description: "Does the sharded cluster route requests correctly via mongos and balance chunks across shards?" },
    { id: "data-modeling", name: "Schema & Aggregation", weight: 20, layerId: "mongodb-admin-4", description: "Are document structures and aggregation pipelines efficiently designed for typical access patterns?" },
    { id: "indexing-perf", name: "Indexing & WiredTiger Tuning", weight: 15, layerId: "mongodb-admin-3", description: "Are indexes optimal, avoiding full collscans and covered by winning query plans?" },
    { id: "replica-backup", name: "Replica Sets & Backups", weight: 15, layerId: "mongodb-admin-6", description: "Are replica set elections resilient, and do backups include oplog tailing for consistency?" },
    { id: "security", name: "RBAC & Authentication", weight: 15, layerId: "mongodb-admin-5", description: "Is authentication enforced across nodes with granular RBAC privileges configured?" },
    { id: "docs-ops", name: "Operations & Observability", weight: 10, layerId: "mongodb-admin-8", description: "Are cluster monitoring, currentOp diagnostics, and setup documentation complete?" },
  ],

  twistPool: [
    { id: "change-streams-sync", text: "Implement a Node.js/Python script using Change Streams to watch collection changes in real time and mirror updates to an audit collection." },
    { id: "client-side-field-encryption", text: "Configure Client-Side Field Level Encryption (CSFLE) to encrypt sensitive user document fields before persisting to MongoDB." },
    { id: "atlas-search-mock", text: "Define custom text/search index definitions and queries simulating Atlas Search autocomplete and fuzzy searching capability." },
    { id: "hedged-reads", text: "Configure custom read preferences with hedged reads enabled to minimize long-tail latency across geographically distributed shards." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,/**
 * Capstone brief — MySQL DBA track (mysql-dba), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["MySQL", "ProxySQL", "Group Replication", "Docker Compose", "Bash", "GitHub Actions"],

  requirements: [
    { id: "group-replication", text: "Configure a 3-node MySQL Group Replication cluster operating with GTIDs enabled and ROW-based binary logging.", check: CHECKS.compose },
    { id: "proxysql-routing", text: "Deploy ProxySQL in front of the cluster to handle query routing, separating read traffic to secondaries and write traffic to the primary.", check: { type: "file", glob: "**/proxysql.cnf" } },
    { id: "innodb-tuning", text: "Provide customized my.cnf configurations tuning InnoDB buffer pool size, redo log capacity, thread concurrency, and max connections.", check: { type: "file", glob: "**/my.cnf" } },
    { id: "user-security", text: "Create least-privilege user accounts using GRANT/REVOKE, enforce SSL connections, and disable default insecure installations.", check: { type: "file", glob: "**/init_users.sql" } },
    { id: "backup-recovery", text: "Provide scripts for full physical backups using xtrabackup or mysqldump with GTID position preservation and binary log purge routines.", check: { type: "file", glob: "**/scripts/backup.sh" } },
    { id: "indexing-analysis", text: "Implement composite and covering indexes on a sample high-traffic schema, verified with EXPLAIN query execution plan outputs.", check: { type: "file", glob: "**/schema.sql" } },
    { id: "performance-schema", text: "Include diagnostic SQL scripts utilizing Performance Schema and sys schema views to identify top lock wait events and statement digests.", check: { type: "file", glob: "**/scripts/diagnostics.sql" } },
    { id: "failover-script", text: "Include a simulation script that triggers a primary failure and validates ProxySQL dynamic target re-routing.", check: { type: "file", glob: "**/scripts/test_failover.sh" } },
    { id: "readme", text: "README provides comprehensive documentation for bootstrapping the cluster, configuring ProxySQL, and running disaster recovery.", check: CHECKS.readme },
    { id: "ci", text: "CI pipeline validates SQL scripts and checks configuration syntax.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Cluster & Backup Correctness", weight: 25, layerId: "mysql-dba-4", description: "Does Group Replication operate reliably with GTIDs, and do backup scripts capture consistent snapshots?" },
    { id: "innodb-engine", name: "InnoDB Engine & Optimization", weight: 20, layerId: "mysql-dba-2", description: "Are InnoDB buffer pool, redo log, and clustered/composite indexes optimized for performance?" },
    { id: "replication-ha", name: "Replication & Proxy Routing", weight: 20, layerId: "mysql-dba-9", description: "Does ProxySQL correctly isolate reads and writes, seamlessly surviving node failover?" },
    { id: "security", name: "User Security & Grants", weight: 15, layerId: "mysql-dba-5", description: "Are database credentials and network permissions hardened using least-privilege rules and TLS?" },
    { id: "observability", name: "Performance Diagnostics", weight: 10, layerId: "mysql-dba-7", description: "Do diagnostics leverage Performance Schema and sys schema to detect bottlenecks?" },
    { id: "docs-ops", name: "Ops & Documentation", weight: 10, layerId: "mysql-dba-10", description: "Are orchestration procedures clear, concise, and reproducible via provided scripts?" },
  ],

  twistPool: [
    { id: "pt-online-schema-change", text: "Provide a script integrating Percona Toolkit (pt-online-schema-change) to alter a live table schema without blocking writes." },
    { id: "orchestrator-integration", text: "Integrate Orchestrator into the topology to visualize node replication status and manage automated topology recovery." },
    { id: "query-caching-proxysql", text: "Configure ProxySQL query caching rules for heavy read queries with configurable TTL parameters." },
    { id: "audit-logging", text: "Configure the MySQL Audit Log plugin to track and record all DDL execution and unauthorized access attempts." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — PostgreSQL DBA track (postgres-dba), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["PostgreSQL", "Patroni", "etcd", "PgBouncer", "Docker Compose", "Bash", "GitHub Actions"],

  requirements: [
    { id: "ha-cluster", text: "Configure a 3-node PostgreSQL cluster with Patroni and etcd for automated leader election and failover.", check: CHECKS.compose },
    { id: "pgbouncer", text: "Deploy PgBouncer in front of the cluster to handle transaction-level connection pooling and route connections smoothly across failovers.", check: { type: "file", glob: "**/pgbouncer.ini" } },
    { id: "replication", text: "Enable streaming replication with replication slots, maintaining at least one hot standby node.", check: { type: "file", glob: "**/patroni*.yml" } },
    { id: "wal-archiving", text: "Configure continuous WAL archiving to a local or object-backed volume and provide a verified PITR recovery script.", check: { type: "file", glob: "**/scripts/restore_pitr.sh" } },
    { id: "security-rls", text: "Configure pg_hba.conf for strict TLS-only access, application-specific roles, and write an example table with Row-Level Security (RLS) enabled.", check: { type: "file", glob: "**/schema.sql" } },
    { id: "indexing-tuning", text: "Include custom PostgreSQL runtime configuration (shared_buffers, work_mem, wal_buffers) and a script creating B-tree, Partial, and GIN indexes with EXPLAIN ANALYZE verification.", check: { type: "file", glob: "**/postgresql.conf" } },
    { id: "partitioning", text: "Implement range partitioning for a high-volume events table with partition pruning enabled and an automated creation script.", check: { type: "file", glob: "**/partitioning.sql" } },
    { id: "backup-test", text: "Provide automated scripts to perform logical backups with pg_dump and physical base backups with pg_basebackup.", check: { type: "file", glob: "**/scripts/backup.sh" } },
    { id: "failover-drill", text: "Write an automated test/simulation script that kills the primary node and verifies that failover occurs without data loss.", check: { type: "file", glob: "**/scripts/test_failover.sh" } },
    { id: "readme", text: "README documents cluster setup, failover testing instructions, and full PITR recovery execution steps.", check: CHECKS.readme },
    { id: "ci", text: "GitHub Actions workflow runs linting on scripts and validates SQL schema files.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Cluster Functionality & PITR", weight: 25, layerId: "postgres-dba-5", description: "Does the cluster fail over automatically, and does the PITR script restore data to a precise timestamp?" },
    { id: "indexing-opt", name: "Query Optimization & Indexing", weight: 15, layerId: "postgres-dba-3", description: "Are appropriate indexes (GIN, Partial, B-tree) and range partitioning applied effectively?" },
    { id: "concurrency-locking", name: "Concurrency & Tuning", weight: 15, layerId: "postgres-dba-4", description: "Are PostgreSQL memory parameters, WAL buffers, and transaction isolation levels properly configured?" },
    { id: "replication-ha", name: "HA & Replication", weight: 20, layerId: "postgres-dba-10", description: "Are Patroni, etcd consensus, and PgBouncer connection routing correctly integrated and resilient?" },
    { id: "security", name: "Security & RLS", weight: 15, layerId: "postgres-dba-7", description: "Is pg_hba.conf hardened, TLS enforced, and Row-Level Security properly implemented?" },
    { id: "docs-ops", name: "Ops & Documentation", weight: 10, layerId: "postgres-dba-8", description: "Clear instructions for cluster bootstrap, disaster recovery drills, and performance verification." },
  ],

  twistPool: [
    { id: "logical-rep-analytics", text: "Set up an additional standalone PostgreSQL analytics node that receives data via logical replication publications/subscriptions for a subset of tables." },
    { id: "zero-downtime-migration", text: "Provide a script demonstrating a zero-downtime column alter/migration on a multi-million row table using batch updates and lock timeouts." },
    { id: "pg-stat-statements-audit", text: "Integrate pg_stat_statements and write an automated audit script that identifies slow queries exceeding a 100ms threshold." },
    { id: "partman-retention", text: "Integrate pg_partman to manage partition creation and automatically drop or archive partitions older than 30 days." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
};