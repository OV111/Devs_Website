You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/database/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "database" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "database". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### postgres-dba — PostgreSQL DBA
  - postgres-dba-1 | PostgreSQL Fundamentals | topics: Installing PostgreSQL; psql CLI basics; Creating databases and users; Basic SQL CRUD
  - postgres-dba-2 | SQL Querying and Joins | topics: INNER, LEFT, RIGHT, FULL joins; Subqueries and CTEs; GROUP BY and HAVING; Window functions
  - postgres-dba-3 | Indexing and Query Optimization | topics: B-tree, Hash, GIN, GiST indexes; EXPLAIN and EXPLAIN ANALYZE; Index selectivity; Partial and expression indexes
  - postgres-dba-4 | Transactions, Locking, and Concurrency | topics: ACID properties; Transaction isolation levels; MVCC internals; Row-level and table-level locks
  - postgres-dba-5 | Backup, Restore, and PITR | topics: pg_dump and pg_dumpall; pg_restore; pg_basebackup; WAL archiving
  - postgres-dba-6 | Replication Fundamentals | topics: Streaming replication setup; Synchronous vs asynchronous replication; Replication slots; Hot standby
  - postgres-dba-7 | PostgreSQL Security and Access Control | topics: Roles and privileges; pg_hba.conf configuration; SSL/TLS setup; Row-level security
  - postgres-dba-8 | Performance Tuning and Configuration | topics: shared_buffers, work_mem, wal_buffers; Connection pooling with PgBouncer; pg_stat_statements setup; Checkpoint tuning
  - postgres-dba-9 | Logical Replication, Partitioning, and Extensions | topics: Logical replication publication and subscription; Range, list, and hash partitioning; Partition pruning; pg_partman
  - postgres-dba-10 | High Availability, Patroni, and Production Operations | topics: Patroni architecture and setup; etcd cluster configuration; Automatic failover; HAProxy for load balancing

### mysql-dba — MySQL DBA
  - mysql-dba-1 | MySQL Fundamentals | topics: Installing MySQL Server; mysql CLI basics; Creating databases and tables; Basic SQL CRUD
  - mysql-dba-2 | InnoDB Storage Engine | topics: InnoDB vs MyISAM; Buffer pool configuration; Redo and undo logs; Clustered indexes
  - mysql-dba-3 | Indexing and Query Optimization | topics: B-tree and hash indexes; Composite indexes and prefix indexes; EXPLAIN output interpretation; Covering indexes
  - mysql-dba-4 | Backup and Recovery | topics: mysqldump usage and options; mysqlpump for parallel dumps; Physical backups with xtrabackup; Binary log basics
  - mysql-dba-5 | User Management and Security | topics: Creating and managing users; GRANT and REVOKE; mysql_secure_installation; SSL/TLS configuration
  - mysql-dba-6 | MySQL Replication Basics | topics: Binary log formats (ROW, STATEMENT, MIXED); GTID replication setup; CHANGE MASTER TO syntax; Replication monitoring
  - mysql-dba-7 | Performance Schema and Monitoring | topics: Performance Schema tables; sys schema views; Statement digest analysis; Wait event analysis
  - mysql-dba-8 | MySQL Configuration Tuning | topics: innodb_buffer_pool_size tuning; innodb_log_file_size; max_connections and thread caching; Query cache deprecation
  - mysql-dba-9 | Group Replication and InnoDB Cluster | topics: Group Replication concepts; Single-primary vs multi-primary mode; MySQL Shell AdminAPI; InnoDB Cluster setup
  - mysql-dba-10 | Production Operations and Disaster Recovery | topics: ProxySQL setup and query rules; Orchestrator topology management; Automated failover with Orchestrator; Schema migrations with pt-online-schema-change

### mongodb-admin — MongoDB Admin
  - mongodb-admin-1 | MongoDB Fundamentals | topics: Document model and BSON types; Installing MongoDB; mongosh basics; Creating databases and collections
  - mongodb-admin-2 | Querying and Aggregation | topics: Query operators ($eq, $in, $gt, etc.); Array and embedded document queries; Aggregation stages ($match, $group, $project); Lookup (joins in MongoDB)
  - mongodb-admin-3 | Indexing in MongoDB | topics: Single field and compound indexes; Multikey indexes for arrays; Text and geospatial indexes; explain() and winning plan analysis
  - mongodb-admin-4 | Schema Design and Data Modeling | topics: Embedding vs referencing trade-offs; One-to-many relationships; Many-to-many with references; Bucket pattern
  - mongodb-admin-5 | Backup and Security | topics: mongodump and mongorestore; Atlas Backup and snapshots; RBAC roles and privileges; Creating custom roles
  - mongodb-admin-6 | Replica Sets | topics: Replica set architecture; Primary election process; Oplog sizing and monitoring; Read preferences (primary, secondary, nearest)
  - mongodb-admin-7 | Sharding and Horizontal Scaling | topics: Sharded cluster components; Choosing a shard key; Hashed vs ranged sharding; Chunk distribution and balancing
  - mongodb-admin-8 | Performance Monitoring and Tuning | topics: mongostat and mongotop; Database profiler setup; currentOp and killOp; WiredTiger cache tuning
  - mongodb-admin-9 | Transactions and Change Streams | topics: Multi-document transaction syntax; Session management; Transaction performance considerations; Change stream basics
  - mongodb-admin-10 | Atlas Operations and Production Readiness | topics: Atlas cluster configuration and tiers; Atlas Backup and restore; Atlas Search index creation; Atlas Data Federation

### data-modeler — Data Modeler
  - data-modeler-1 | Relational Data Modeling Basics | topics: Entities and attributes; Relationships (one-to-one, one-to-many, many-to-many); ER diagram notation; Primary and foreign keys
  - data-modeler-2 | Normalization Forms | topics: 1NF - eliminating repeating groups; 2NF - removing partial dependencies; 3NF - removing transitive dependencies; Boyce-Codd normal form (BCNF)
  - data-modeler-3 | Advanced ER Modeling | topics: Weak entities and identifying relationships; Generalization and specialization (ISA); Aggregation; Crow's Foot notation
  - data-modeler-4 | Dimensional Modeling for Analytics | topics: Fact table design; Dimension table design; Star schema vs snowflake schema; Slowly changing dimensions (SCD Type 1, 2, 3)
  - data-modeler-5 | SQL DDL and Schema Implementation | topics: CREATE TABLE with constraints; CHECK, UNIQUE, NOT NULL constraints; DEFAULT values and sequences; Composite primary keys
  - data-modeler-6 | NoSQL and Polyglot Data Modeling | topics: Access pattern analysis; Document embedding vs referencing; DynamoDB single-table design; Key-value data patterns
  - data-modeler-7 | Data Integrity and Referential Integrity | topics: Foreign key cascade actions; Deferrable constraints; CHECK constraints for business rules; Triggers for derived data
  - data-modeler-8 | Temporal and Historical Data Modeling | topics: Valid time vs transaction time; Slowly changing dimensions revisited; Temporal table SQL extensions; Bitemporal data modeling
  - data-modeler-9 | Schema Migration and Evolution | topics: Flyway migration scripts; Liquibase changesets; Expand-contract (parallel change) pattern; Zero-downtime schema changes
  - data-modeler-10 | Enterprise Data Architecture and Governance | topics: Canonical data models; Master data management (MDM); Data catalog tools (Amundsen, DataHub); Data lineage tracking

### nosql-engineer — NoSQL Engineer
  - nosql-engineer-1 | NoSQL Foundations | topics: CAP theorem and trade-offs; BASE vs ACID; Document, key-value, wide-column, graph types; Eventual consistency
  - nosql-engineer-2 | MongoDB for Application Development | topics: Schema design for applications; CRUD with MQL; Aggregation pipeline; Mongoose ODM
  - nosql-engineer-3 | Redis for Caching and Data Structures | topics: Redis data types (strings, lists, sets, hashes, sorted sets); Cache-aside and write-through patterns; TTL and expiration; Atomic operations
  - nosql-engineer-4 | Apache Cassandra Basics | topics: Cassandra ring architecture; Keyspaces and replication factors; CQL syntax; Partition key and clustering columns
  - nosql-engineer-5 | DynamoDB Design and Operations | topics: DynamoDB key design (PK, SK); Single-table design patterns; Global Secondary Indexes (GSI); Local Secondary Indexes (LSI)
  - nosql-engineer-6 | Redis Advanced Patterns | topics: Redis Pub/Sub patterns; Redis Streams consumer groups; RedisSearch index creation; Redis Modules ecosystem
  - nosql-engineer-7 | Cassandra Data Modeling Patterns | topics: Time-series patterns with Cassandra; Time-bucket pattern for hot partitions; Materialized views; Secondary indexes limitations
  - nosql-engineer-8 | Multi-model and Polyglot Persistence | topics: Polyglot persistence patterns; CQRS with multiple data stores; Event-driven sync between stores; Saga pattern for distributed transactions
  - nosql-engineer-9 | Observability and Performance Tuning | topics: MongoDB Atlas Performance Advisor; Cassandra nodetool and JMX metrics; Redis INFO command and latency tracking; Prometheus exporters for each DB
  - nosql-engineer-10 | Production Deployment and Resilience | topics: Stateful workloads on Kubernetes; Helm charts for MongoDB, Redis, Cassandra; Terraform for managed cloud NoSQL; PersistentVolumeClaim management

### db-reliability — Database Reliability Eng
  - db-reliability-1 | Database Reliability Fundamentals | topics: SLO and SLA for databases; Error budgets; Common database failure modes; Observability pillars (metrics, logs, traces)
  - db-reliability-2 | Monitoring and Alerting | topics: Golden signals (latency, traffic, errors, saturation); Prometheus scrape configuration; Database-specific exporters; PromQL query language
  - db-reliability-3 | Backup Strategies and Validation | topics: Backup types (full, incremental, differential); Physical vs logical backups; Backup retention policies; Automated backup validation
  - db-reliability-4 | Replication Health and Lag Management | topics: Measuring replication lag accurately; Causes of replication lag; Lag alerting thresholds; Semi-sync replication for durability
  - db-reliability-5 | High Availability Architecture | topics: HA patterns for RDBMS; Automatic failover tools (Patroni, MHA); Virtual IP and DNS-based failover; Connection proxy HA with ProxySQL
  - db-reliability-6 | Incident Response for Databases | topics: On-call rotation design; Runbook writing for common database incidents; Incident severity levels; Blameless postmortem process
  - db-reliability-7 | Capacity Planning and Scaling | topics: Growth rate analysis from metrics; Disk, CPU, and connection capacity models; Vertical scaling considerations; Read replica provisioning
  - db-reliability-8 | Database Change Management | topics: Online schema change with gh-ost; pt-online-schema-change for MySQL; Flyway in CI/CD pipelines; Backward-compatible migration patterns
  - db-reliability-9 | Security and Compliance for Databases | topics: Encryption at rest configuration; TLS for in-transit encryption; Database audit logging; Dynamic secrets with HashiCorp Vault
  - db-reliability-10 | Chaos Engineering and DR Validation | topics: Chaos engineering principles; Database-specific chaos experiments; Network partition simulation; DR drill planning and execution

### redis-engineer — Redis Engineer
  - redis-engineer-1 | Redis Fundamentals | topics: Installing Redis; redis-cli basics; String get/set operations; Key expiration with TTL
  - redis-engineer-2 | Redis Data Structures | topics: Lists as queues and stacks; Sets for unique membership; Hashes for objects; Sorted sets for rankings
  - redis-engineer-3 | Caching Patterns | topics: Cache-aside pattern; Write-through caching; Write-behind caching; Cache invalidation strategies
  - redis-engineer-4 | Redis Persistence | topics: RDB snapshot configuration; AOF persistence and fsync policies; RDB vs AOF trade-offs; Mixed persistence mode
  - redis-engineer-5 | Pub/Sub and Redis Streams | topics: Pub/Sub publish and subscribe; Pub/Sub limitations; Redis Streams XADD and XREAD; Consumer groups with XREADGROUP
  - redis-engineer-6 | Redis Security and Access Control | topics: Redis ACL user creation; ACL command and key permissions; TLS configuration; Protected mode
  - redis-engineer-7 | Redis Replication and Sentinel | topics: Redis primary-replica replication; Replication configuration; Redis Sentinel setup; Sentinel quorum
  - redis-engineer-8 | Redis Cluster | topics: Hash slot assignment; Cluster setup with redis-cli; Resharding and rebalancing; MOVED and ASK redirects
  - redis-engineer-9 | Redis Modules and Advanced Features | topics: RedisJSON document storage; RedisSearch full-text indexing; RedisTimeSeries for metrics; Lua scripting for atomicity
  - redis-engineer-10 | Production Redis Operations | topics: maxmemory and eviction policies; Memory optimization with object encoding; Connection pooling best practices; Prometheus redis_exporter

### cassandra-engineer — Cassandra Engineer
  - cassandra-engineer-1 | Cassandra Architecture Fundamentals | topics: Peer-to-peer ring architecture; Consistent hashing and tokens; Gossip protocol; Installing Cassandra
  - cassandra-engineer-2 | CQL and Data Types | topics: CQL data types (text, uuid, timeuuid, etc.); List, set, and map collections; User-defined types (UDT); Counter tables
  - cassandra-engineer-3 | Data Modeling in Cassandra | topics: Query-first design process; Partition key selection; Clustering column ordering; Wide-row patterns
  - cassandra-engineer-4 | Replication and Consistency | topics: SimpleStrategy vs NetworkTopologyStrategy; Replication factor configuration; Consistency levels (ONE, QUORUM, ALL); Read repair
  - cassandra-engineer-5 | Operations and Maintenance | topics: Compaction strategies (STCS, LCS, TWCS); nodetool repair; Adding nodes to a cluster; Decommissioning nodes
  - cassandra-engineer-6 | Performance Tuning | topics: JVM heap and GC tuning; Row and key cache configuration; Compaction strategy selection; cassandra-stress benchmarking
  - cassandra-engineer-7 | Security in Cassandra | topics: Enabling authentication in Cassandra; Role-based access control; Object permissions (GRANT/REVOKE); Client-to-node TLS
  - cassandra-engineer-8 | Monitoring and Observability | topics: Cassandra JMX metrics overview; Prometheus JMX exporter setup; Key metrics (read/write latency, compaction, GC); Grafana dashboard for Cassandra
  - cassandra-engineer-9 | Multi-datacenter and Global Deployments | topics: Multi-datacenter replication topology; LOCAL_QUORUM and LOCAL_ONE consistency; Rack and datacenter awareness; Driver-level DC routing
  - cassandra-engineer-10 | Production Operations and Disaster Recovery | topics: K8ssandra operator deployment; Medusa backup and restore; Cassandra on Kubernetes storage; Chaos testing with Chaos Toolkit

### vector-db-engineer — Vector DB Engineer
  - vector-db-engineer-1 | Embeddings and Vector Representations | topics: What are vector embeddings; Dense vs sparse vectors; OpenAI text-embedding models; Sentence Transformers library
  - vector-db-engineer-2 | Approximate Nearest Neighbor (ANN) Algorithms | topics: Brute-force vs approximate search; HNSW (Hierarchical Navigable Small World); IVF (Inverted File Index); Product quantization
  - vector-db-engineer-3 | pgvector Fundamentals | topics: Installing pgvector; Vector column type; Exact and approximate search operators; HNSW and IVF indexes in pgvector
  - vector-db-engineer-4 | Pinecone and Managed Vector Databases | topics: Pinecone index creation; Upsert and query API; Metadata filtering; Namespaces for multi-tenancy
  - vector-db-engineer-5 | RAG (Retrieval Augmented Generation) Patterns | topics: RAG pipeline architecture; Text chunking strategies; Embedding generation pipeline; Retrieval and re-ranking
  - vector-db-engineer-6 | Weaviate and Qdrant | topics: Weaviate schema definition; Weaviate GraphQL query API; Qdrant collection creation; Qdrant payload filtering
  - vector-db-engineer-7 | Multi-modal and Hybrid Search | topics: Hybrid search scoring (alpha weighting); BM25 for keyword retrieval; CLIP for image-text embeddings; Multi-modal search pipelines
  - vector-db-engineer-8 | Scaling Vector Search | topics: Sharding strategies for vector indexes; Distributed HNSW; Quantization for memory reduction; Serving latency vs index size trade-offs
  - vector-db-engineer-9 | Monitoring and Operational Best Practices | topics: Vector DB metrics (QPS, latency, index size); Prometheus exporter for vector DBs; Recall evaluation pipeline; Embedding drift detection
  - vector-db-engineer-10 | Production Vector Search Platform | topics: Weaviate on Kubernetes; Embedding model versioning with MLflow; Index migration strategies for model upgrades; CI/CD for embedding pipelines

### graph-db-engineer — Graph DB Engineer
  - graph-db-engineer-1 | Graph Database Fundamentals | topics: Property graph model; Nodes and relationships; Labels and properties; When to use a graph database
  - graph-db-engineer-2 | Cypher Query Language | topics: MATCH and WHERE clauses; CREATE and MERGE; Pattern variables and relationships; WITH for query chaining
  - graph-db-engineer-3 | Graph Data Modeling | topics: Modeling entities as nodes; Modeling facts as relationships; Intermediate nodes for relationship properties; Bidirectional vs directional relationships
  - graph-db-engineer-4 | Indexes and Query Optimization | topics: Range and text indexes; Full-text indexes; Composite indexes; EXPLAIN plan analysis
  - graph-db-engineer-5 | Graph Algorithms | topics: GDS library setup; PageRank for node importance; Betweenness centrality; Louvain community detection
  - graph-db-engineer-6 | Neo4j Security and Access Control | topics: Creating roles and users; Granting database privileges; Fine-grained property-level privileges; Sub-graph access control
  - graph-db-engineer-7 | Neo4j Causal Clustering | topics: Causal cluster architecture; Core members and Raft consensus; Read replicas for read scaling; Bookmarks for causal consistency
  - graph-db-engineer-8 | GQL and Graph Query Standards | topics: GQL ISO standard overview; GQL vs Cypher syntax differences; MATCH and RETURN in GQL; Graph pattern expressions
  - graph-db-engineer-9 | Graph Applications and Use Cases | topics: Fraud ring detection patterns; Knowledge graph construction; Collaborative filtering recommendations; Neo4j Python driver
  - graph-db-engineer-10 | Production Operations and Performance at Scale | topics: Neo4j Helm chart deployment; neo4j-admin backup and restore; Prometheus neo4j metrics exporter; Grafana dashboards for Neo4j
