/**
 * Capstone brief — bi-developer track (bi-developer), v1.
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
  trackId: "bi-developer",
  categoryId: "datascience",
  slug: "bi-developer-enterprise-retail-analytics",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Retail Executive Semantic Layer and BI Solution",
  summary:
    "Build an enterprise BI solution end-to-end: engineer an analytical SQL semantic layer, author complex DAX/LOD measures, " +
    "configure role-based access security, and deliver an interactive multi-page dashboard.",
  stack: [
    "SQL",
    "Power BI, Tableau Public, or Metabase (free, cross-platform)",
    "DAX, Tableau LOD, or SQL views",
    "PostgreSQL or DuckDB",
  ],

  requirements: [
    {
      id: "dimensional-sql-views",
      text: "Create star-schema SQL database views establishing clean dimension tables and a high-volume sales fact table with explicit key relationships.",
      check: {
        type: "file",
        glob: ["sql/**/*.sql", "views/**/*.sql", "models/**/*.sql"],
      },
    },
    {
      id: "complex-dax-lod",
      text: "Implement advanced calculations (calculating YTD growth, rolling 12-month averages, and dynamic customer segment counts) using DAX or Tableau LOD expressions.",
      check: {
        type: "file",
        glob: [
          "dax/**/*.dax",
          "measures/**/*.sql",
          "reports/**/*",
          "pbix/**/*.txt",
        ],
      },
    },
    {
      id: "multi-page-dashboard",
      text: "Deliver an executive BI dashboard featuring summary, store comparison, and customer analytics drill-through pages.",
      check: {
        type: "file",
        glob: ["dashboards/**/*", "reports/**/*", "*.pbix", "*.twbx"],
      },
    },
    {
      id: "row-level-security",
      text: "Define Row-Level Security (RLS) rules restricting regional managers to data relevant solely to their assigned territories.",
      check: {
        type: "file",
        glob: [
          "security/**/*.sql",
          "rls/**/*.json",
          "docs/rls.md",
          "reports/**/*",
        ],
      },
    },
    {
      id: "performance-optimization",
      text: "Optimize query performance using aggregated tables or dual storage modes, detailing DAX Studio / Query Plan timings before and after optimization.",
      check: {
        type: "file",
        glob: ["docs/performance.md", "performance/*.txt"],
      },
    },
    {
      id: "design-system-spec",
      text: "Publish a visual style guide establishing color accessibility palettes, font hierarchies, visual margins, and filter interaction standards.",
      check: {
        type: "file",
        glob: ["docs/style_guide.md", "docs/design_system.md"],
      },
    },
    {
      id: "test-data-generator",
      text: "Include a Python or SQL data generator script to populate mock transactional test records across multiple years.",
      check: {
        type: "file",
        glob: ["scripts/**/*.py", "scripts/**/*.sql", "data_gen/**/*.py"],
      },
    },
    {
      id: "tests",
      text: "Automate Python/SQL unit test scripts validating calculated measure outputs against expected baseline totals.",
      check: {
        type: "file",
        glob: ["tests/test_*.py", "**/test_*.py", "tests/*.sql"],
      },
    },
    {
      id: "readme",
      text: "Provide a comprehensive README explaining model architecture, RLS setup instructions, performance metrics, and dashboard publishing steps.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Configure a GitHub Actions workflow that executes SQL/Python test validation scripts on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rules: [
    ...COMMON_RULES,
    "No paid BI license is required. Power BI Desktop (free, Windows-only), Tableau Public (free, watermarked), and Metabase (free, open-source, cross-platform) are all acceptable — pick whichever runs on your machine.",
  ],

  rubric: [
    {
      id: "data-modeling",
      name: "Data Modeling & SQL Views",
      weight: 20,
      layerId: "bi-developer-1",
      description:
        "Evaluates star-schema relationships, surrogate key integrity, and SQL view design for BI consumption.",
    },
    {
      id: "advanced-dax",
      name: "DAX / LOD Business Logic",
      weight: 25,
      layerId: "bi-developer-5",
      description:
        "Assesses correctness of filter context manipulation, time intelligence calculations, and dynamic grouping.",
    },
    {
      id: "dashboard-design",
      name: "Dashboard Design & Storytelling",
      weight: 20,
      layerId: "bi-developer-8",
      description:
        "Evaluates layout hierarchy, accessibility compliance, visual selection accuracy, and drill-through navigation.",
    },
    {
      id: "governance-security",
      name: "Governance & Row-Level Security",
      weight: 15,
      layerId: "bi-developer-7",
      description:
        "Measures accuracy and robustness of RLS role configurations and workspace access rules.",
    },
    {
      id: "performance-tuning",
      name: "Performance Optimization",
      weight: 10,
      layerId: "bi-developer-9",
      description:
        "Checks query execution timings, aggregate table implementations, and VertiPaq/query optimization details.",
    },
    {
      id: "testing-docs",
      name: "Testing & Operational Documentation",
      weight: 10,
      layerId: "bi-developer-10",
      description:
        "Evaluates measure validation tests, CI workflow integration, and comprehensive deployment documentation.",
    },
  ],

  twistPool: [
    {
      id: "pareto-inventory-twist",
      text: "Build an dynamic ABC/Pareto classification measure that categorizes inventory stock items on-the-fly based on selected date ranges.",
    },
    {
      id: "currency-conversion-twist",
      text: "Implement dynamic currency conversion logic that recalculates all financial measures into a user-selected target currency.",
    },
    {
      id: "writeback-whatif-twist",
      text: "Add interactive parameter scenarios allowing executives to simulate price elasticity and margin projections.",
    },
    {
      id: "hybrid-composite-twist",
      text: "Configure a composite model combining direct query for real-time daily transactions with imported historic aggregates.",
    },
  ],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
