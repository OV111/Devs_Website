/**
 * Capstone brief — data-modeler track (data-modeler), v1.
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
  stack: [
    "PostgreSQL",
    "Flyway",
    "DynamoDB",
    "SQL",
    "Docker Compose",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "3nf-schema",
      text: "Design a fully normalized 3NF OLTP PostgreSQL schema covering users, products, orders, payments, and inventory with strict primary, foreign key, and CHECK constraints.",
      check: { type: "file", glob: "**/migrations/V1__oltp_schema.sql" },
    },
    {
      id: "dimensional-star-schema",
      text: "Design an OLAP Star Schema featuring fact tables for sales transactions and dimension tables incorporating SCD Type 2 tracking for customer and product attributes.",
      check: { type: "file", glob: "**/migrations/V2__olap_star_schema.sql" },
    },
    {
      id: "schema-migrations",
      text: "Manage all schema evolution using versioned Flyway migration scripts adhering to the expand-contract zero-downtime migration pattern.",
      check: { type: "file", glob: "**/migrations/V*.sql" },
    },
    {
      id: "nosql-single-table",
      text: "Create a DynamoDB single-table design schema mapping order fulfillment access patterns using composite PK/SK structures and GSIs.",
      check: { type: "file", glob: "**/dynamodb_single_table_schema.json" },
    },
    {
      id: "temporal-modeling",
      text: "Implement temporal or bitemporal tables tracking price history and inventory state over valid-time and transaction-time intervals.",
      check: { type: "file", glob: "**/migrations/V3__temporal_tables.sql" },
    },
    {
      id: "referential-integrity",
      text: "Configure deferred foreign keys, cascading rules, and triggers for derived product rating and inventory totals.",
      check: { type: "file", glob: "**/triggers.sql" },
    },
    {
      id: "data-lineage-catalog",
      text: "Document end-to-end data lineage and produce a canonical data catalog describing all entities, attributes, and data retention policies.",
      check: {
        type: "file",
        glob: ["**/data_catalog.md", "docs/data_catalog.md"],
      },
    },
    {
      id: "er-diagram",
      text: "Provide ER diagrams (Crow's Foot notation) for both OLTP 3NF and OLAP Star Schema models.",
      check: {
        type: "file",
        glob: [
          "**/er_diagram.png",
          "**/er_diagram.svg",
          "**/er_diagram.mermaid",
        ],
      },
    },
    {
      id: "readme",
      text: "README details data modeling rationale, SCD Type 2 handling, migration instructions, and access pattern mapping.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow executes Flyway migrations against a PostgreSQL test database container.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "normalization",
      name: "Relational Modeling & 3NF",
      weight: 20,
      layerId: "data-modeler-2",
      description:
        "Is the OLTP schema normalized to 3NF/BCNF with proper primary keys, foreign keys, and CHECK constraints?",
    },
    {
      id: "dimensional",
      name: "Dimensional & SCD Modeling",
      weight: 25,
      layerId: "data-modeler-4",
      description:
        "Are fact and dimension tables structured cleanly, and is SCD Type 2 history tracked accurately?",
    },
    {
      id: "nosql-patterns",
      name: "NoSQL Single-Table Design",
      weight: 15,
      layerId: "data-modeler-6",
      description:
        "Are PK/SK keys and GSIs in the DynamoDB schema designed efficiently for declared access patterns?",
    },
    {
      id: "data-integrity",
      name: "Integrity & Triggers",
      weight: 15,
      layerId: "data-modeler-7",
      description:
        "Are constraints, cascade actions, and triggers for derived state robust and deadlock-free?",
    },
    {
      id: "migrations",
      name: "Schema Migration Strategy",
      weight: 15,
      layerId: "data-modeler-9",
      description:
        "Are Flyway scripts versioned cleanly and structured to support backward-compatible changes?",
    },
    {
      id: "governance-docs",
      name: "Governance & ER Diagrams",
      weight: 10,
      layerId: "data-modeler-10",
      description:
        "Are ER diagrams complete and the canonical data catalog thorough and readable?",
    },
  ],

  twistPool: [
    {
      id: "bitemporal-audit",
      text: "Extend temporal price tables into full bitemporal modeling, tracking both effective period and record insertion time.",
    },
    {
      id: "data-privacy-masking",
      text: "Add SQL views and dynamic data masking rules that obscure PII (emails, phone numbers) for non-admin reporting roles.",
    },
    {
      id: "dbt-transformation",
      text: "Add dbt models to transform raw 3NF OLTP tables into the OLAP Star Schema fact and dimension tables automatically.",
    },
    {
      id: "graph-entity-resolution",
      text: "Create a graph schema specification (Cypher script) mapping shared customer addresses and payment instruments to detect account linking.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
