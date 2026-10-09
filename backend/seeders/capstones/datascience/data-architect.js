/**
 * Capstone brief — data-architect track (data-architect), v1.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "data-architect",
  categoryId: "datascience",
  slug: "data-architect-enterprise-platform-design",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Data Platform Architecture and Governance Framework",
  summary:
    "Design a scalable enterprise data lakehouse platform architecture: produce formal Architecture Decision Records (ADRs), " +
    "write DDL schemas with security masking policies, engineer dbt transformation structures, and define governance models.",
  stack: [
    "SQL",
    "dbt",
    "Snowflake or BigQuery DDL",
    "Diagrams (draw.io/Mermaid)",
    "YAML",
  ],

  requirements: [
    {
      id: "arch-architecture-diagrams",
      text: "Author comprehensive component and data flow architecture diagrams detailing operational ingestion, landing, storage, transformation, and serving layers.",
      check: {
        type: "file",
        glob: [
          "docs/architecture/*.png",
          "docs/architecture/*.svg",
          "docs/architecture/*.mermaid",
          "docs/**/*.md",
        ],
      },
    },
    {
      id: "adr-records",
      text: "Write formal Architecture Decision Records (ADRs) justifying choices regarding cloud data platforms, storage formats, and governance mechanisms.",
      check: { type: "file", glob: ["docs/adr/*.md", "adrs/*.md"] },
    },
    {
      id: "relational-normalized-schema",
      text: "Develop 3NF operational relational DDL schemas with primary/foreign keys, indexes, and constraints.",
      check: {
        type: "file",
        glob: ["ddl/3nf/*.sql", "schemas/operational/*.sql"],
      },
    },
    {
      id: "dimensional-dw-schema",
      text: "Develop dimensional warehouse DDL schemas incorporating star schema fact and dimension tables with conformed dimensions.",
      check: {
        type: "file",
        glob: ["ddl/dimensional/*.sql", "schemas/dw/*.sql"],
      },
    },
    {
      id: "security-masking-policies",
      text: "Write DDL/SQL defining Role-Based Access Control (RBAC), row access policies, and dynamic column masking for PII fields.",
      check: { type: "file", glob: ["security/*.sql", "governance/*.sql"] },
    },
    {
      id: "dbt-multi-project-packages",
      text: "Implement structured dbt transformation models utilizing package imports, materialization configurations, and data lineage documentation.",
      check: {
        type: "file",
        glob: ["dbt/models/**/*.sql", "dbt/dbt_project.yml"],
      },
    },
    {
      id: "data-catalog-glossary",
      text: "Construct a data catalog and business glossary specification in JSON/YAML mapping entity definitions and data sensitivity tiers.",
      check: {
        type: "file",
        glob: [
          "governance/catalog.yml",
          "governance/catalog.json",
          "docs/catalog.md",
        ],
      },
    },
    {
      id: "tests",
      text: "Automate SQL data validation and integrity test scripts to verify constraints and row-level access rules.",
      check: {
        type: "file",
        glob: ["tests/*.sql", "tests/test_*.py", "**/test_*.py"],
      },
    },
    {
      id: "readme",
      text: "Document project repository structure, platform setup prerequisites, deployment steps, and governance audit procedures.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Set up GitHub Actions to run SQL syntax verification and dbt schema validation tests.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "platform-architecture",
      name: "Data Architecture & Platform Design",
      weight: 25,
      layerId: "data-architect-1",
      description:
        "Evaluates system architecture completeness, data movement patterns, and clarity of visual diagrams.",
    },
    {
      id: "schema-design",
      name: "Database & Dimensional Modeling",
      weight: 25,
      layerId: "data-architect-3",
      description:
        "Assesses normalization quality, star schema design, conformed dimension usage, and indexing strategy.",
    },
    {
      id: "security-compliance",
      name: "Data Security & Compliance",
      weight: 20,
      layerId: "data-architect-7",
      description:
        "Evaluates RBAC definitions, dynamic column masking rules, row-level security, and PII protection mechanisms.",
    },
    {
      id: "transformation-dbt",
      name: "Transformation Strategy & dbt",
      weight: 10,
      layerId: "data-architect-5",
      description:
        "Measures dbt project layout, materialization decisions, package management, and lineage tracking.",
    },
    {
      id: "governance-metadata",
      name: "Data Governance & Metadata",
      weight: 10,
      layerId: "data-architect-6",
      description:
        "Checks data catalog completeness, business glossary structure, ADR quality, and asset tagging.",
    },
    {
      id: "ops-validation",
      name: "Testing & Operational Setup",
      weight: 10,
      layerId: "data-architect-10",
      description:
        "Evaluates SQL validation test scripts, CI integration, and deployment guidance.",
    },
  ],

  twistPool: [
    {
      id: "data-mesh-domain-twist",
      text: "Refactor data warehouse models into two distinct decentralized domain data products connected via conformed global contracts.",
    },
    {
      id: "cost-optimization-twist",
      text: "Include an explicit cluster partitioning and auto-suspend warehouse sizing strategy doc with estimated monthly cost calculations.",
    },
    {
      id: "lakehouse-iceberg-twist",
      text: "Specify external Apache Iceberg table definitions and detail zero-copy clone disaster recovery runbooks.",
    },
    {
      id: "gdpr-erasure-twist",
      text: "Design a cryptographically enforced automated GDPR Right-to-be-Forgotten erasure pipeline specification.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
