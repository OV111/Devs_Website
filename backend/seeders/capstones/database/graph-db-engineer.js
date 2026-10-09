/**
 * Capstone brief — graph-db-engineer track (graph-db-engineer), v1.
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
  trackId: "graph-db-engineer",
  categoryId: "database",
  slug: "graph-db-engineer-fraud-analytics",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Enterprise Graph Analytics Engine for Financial Fraud Network Detection",
  summary:
    "Design and deploy a production Neo4j graph database platform. Model complex financial entities, implement " +
    "Cypher queries with GDS algorithms (PageRank, Louvain, Betweenness Centrality), enforce property-level access control, " +
    "and construct real-time fraud detection pipelines.",
  stack: [
    "Neo4j",
    "Cypher",
    "Neo4j GDS",
    "Python",
    "Docker Compose",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "graph-model-schema",
      text: "Design a property graph schema representing accounts, transactions, devices, IP addresses, and physical locations using directional and intermediate node relationships.",
      check: { type: "file", glob: "**/schema.cypher" },
    },
    {
      id: "cypher-queries",
      text: "Write Cypher queries using MATCH, MERGE, pattern variables, and WITH chaining to traverse multi-hop relationship rings efficiently.",
      check: { type: "file", glob: "**/queries.cypher" },
    },
    {
      id: "graph-indexes",
      text: "Create range, text, and full-text indexes over key node properties, verified using EXPLAIN and PROFILE query execution plans.",
      check: { type: "file", glob: "**/indexes.cypher" },
    },
    {
      id: "gds-algorithms",
      text: "Implement Graph Data Science (GDS) projections to execute PageRank for entity importance and Louvain for community fraud ring detection.",
      check: { type: "file", glob: "**/gds_analytics.{py,cypher}" },
    },
    {
      id: "app-integration",
      text: "Build a Python application layer utilizing the official Neo4j driver to execute transactional Cypher queries with causal bookmarks.",
      check: { type: "file", glob: "**/app.{py,js}" },
    },
    {
      id: "security-rbac",
      text: "Configure Neo4j RBAC creating custom roles, database privileges, and sub-graph property-level read restrictions.",
      check: { type: "file", glob: "**/security.cypher" },
    },
    {
      id: "docker-setup",
      text: "Provide a Docker Compose manifest running Neo4j Enterprise/Community with APOC and GDS plugins enabled.",
      check: CHECKS.compose,
    },
    {
      id: "backup-ops",
      text: "Include operational shell scripts running neo4j-admin backup and restore procedures.",
      check: { type: "file", glob: "**/scripts/backup.sh" },
    },
    {
      id: "tests",
      text: "Write integration tests validating graph pattern matches, transaction rollbacks, and GDS algorithm output consistency.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details graph data modeling trade-offs, Cypher optimization steps, GDS pipeline execution, and deployment instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow lints Cypher scripts and runs Python driver integration tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "graph-modeling",
      name: "Property Graph Modeling",
      weight: 20,
      layerId: "graph-db-engineer-3",
      description:
        "Are entities and relationships structured to avoid dense node bottlenecks while enabling fast traversals?",
    },
    {
      id: "cypher-optimization",
      name: "Cypher Queries & Indexing",
      weight: 20,
      layerId: "graph-db-engineer-2",
      description:
        "Are Cypher queries written using MERGE and WITH chaining, covered by appropriate indexes?",
    },
    {
      id: "gds-algorithms",
      name: "Graph Algorithms & Community Detection",
      weight: 20,
      layerId: "graph-db-engineer-5",
      description:
        "Are PageRank and Louvain GDS algorithms executed properly over graph memory projections?",
    },
    {
      id: "security-access",
      name: "Security & Sub-graph RBAC",
      weight: 15,
      layerId: "graph-db-engineer-6",
      description:
        "Are fine-grained property-level and label-level privileges securely assigned?",
    },
    {
      id: "fraud-app-dev",
      name: "Application Integration & Causal Consistency",
      weight: 15,
      layerId: "graph-db-engineer-9",
      description:
        "Does the application integration use official drivers and maintain causal consistency?",
    },
    {
      id: "ops-deployment",
      name: "Production Ops & Backup Procedures",
      weight: 10,
      layerId: "graph-db-engineer-10",
      description:
        "Are neo4j-admin backup routines and Prometheus metrics monitoring properly configured?",
    },
  ],

  twistPool: [
    {
      id: "gql-standard-compliance",
      text: "Provide an equivalent set of queries adhering to the ISO GQL standard syntax alongside Cypher scripts.",
    },
    {
      id: "causal-clustering-setup",
      text: "Provide a multi-node Neo4j Causal Clustering compose manifest featuring Raft core members and read replicas.",
    },
    {
      id: "realtime-fraud-webhook",
      text: "Construct an event-driven webhook service that evaluates incoming transaction paths against known fraud rings in under 50ms.",
    },
    {
      id: "collaborative-recommendation",
      text: "Extend the graph model to execute collaborative filtering recommendation algorithms over user purchasing behavior.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
