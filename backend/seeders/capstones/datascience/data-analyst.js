/**
 * Capstone brief — data-analyst track (data-analyst), v1.
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
  trackId: "data-analyst",
  categoryId: "datascience",
  slug: "data-analyst-e-commerce-churn-dashboard",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "E-Commerce Customer Churn and Retention Analytics Suite",
  summary:
    "Analyze subscription retention, clean raw transaction logs with Python, write dbt-style SQL transformation models, " +
    "and build an executive KPI dashboard. You will synthesize product metrics into actionable recommendations.",
  stack: ["Python", "Pandas", "DuckDB", "SQL", "Tableau or Plotly"],

  requirements: [
    {
      id: "raw-data-cleaning",
      text: "Process raw customer behavior CSVs in Python using Pandas, handling duplicate records, null values, and parsing timestamp strings.",
      check: {
        type: "file",
        glob: ["src/**/*.py", "scripts/**/*.py", "notebooks/*.ipynb"],
      },
    },
    {
      id: "sql-star-schema",
      text: "Transform cleaned datasets into a star schema containing explicit fact and dimension tables.",
      check: { type: "file", glob: ["models/**/*.sql", "sql/**/*.sql"] },
    },
    {
      id: "window-kpis",
      text: "Calculate cohort retention rates, monthly active users (MAU), and rolling 30-day customer lifetime value using SQL window functions.",
      check: { type: "file", glob: ["sql/**/*.sql", "queries/**/*.sql"] },
    },
    {
      id: "statistical-tests",
      text: "Conduct two-sample t-tests and chi-square tests in Python to validate whether promotional discounts significantly alter churn rate.",
      check: { type: "file", glob: ["src/**/*.py", "notebooks/*.ipynb"] },
    },
    {
      id: "viz-dashboard",
      text: "Create an interactive dashboard or exported report suite displaying funnel progression, churn drivers, and revenue trends.",
      check: {
        type: "file",
        glob: ["dashboards/**/*", "reports/**/*.html", "notebooks/*.ipynb"],
      },
    },
    {
      id: "business-report",
      text: "Write an executive summary report translating statistical findings into concrete business actions to improve customer retention.",
      check: { type: "file", glob: "reports/executive_summary.md" },
    },
    {
      id: "dbt-data-tests",
      text: "Implement data quality assertions verifying column non-nullability and key uniqueness on fact tables.",
      check: {
        type: "file",
        glob: ["tests/**/*.sql", "models/schema.yml", "schema.yml"],
      },
    },
    {
      id: "tests",
      text: "Automate Python unit tests checking cleaning edge cases like missing dates and invalid currency symbols.",
      check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] },
    },
    {
      id: "readme",
      text: "Document dataset schemas, instructions to run SQL scripts, dependencies, and dashboard setup.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Configure a GitHub Actions workflow to run Python linting and unit tests on push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "sql-modeling",
      name: "SQL & Data Modeling",
      weight: 25,
      layerId: "data-analyst-9",
      description:
        "Evaluates star schema design, CTE usage, window function logic, and relational integrity.",
    },
    {
      id: "data-wrangling",
      name: "Data Cleaning & Wrangling",
      weight: 20,
      layerId: "data-analyst-4",
      description:
        "Assesses robustness of null handling, string normalization, and date parsing pipelines in Python.",
    },
    {
      id: "business-metrics",
      name: "Business Metrics & Insights",
      weight: 20,
      layerId: "data-analyst-8",
      description:
        "Measures accuracy of calculated cohort retention, MRR, churn rate, and executive recommendations.",
    },
    {
      id: "statistical-rigor",
      name: "Statistical Analysis",
      weight: 15,
      layerId: "data-analyst-7",
      description:
        "Checks appropriateness and correct execution of hypothesis tests and correlation analyses.",
    },
    {
      id: "visualizations",
      name: "Data Visualization & Storytelling",
      weight: 10,
      layerId: "data-analyst-5",
      description:
        "Evaluates visual clarity, design choices, pre-attentive attributes, and interactive layout.",
    },
    {
      id: "code-quality-ops",
      name: "Testing & Documentation",
      weight: 10,
      layerId: "data-analyst-10",
      description:
        "Checks CI automation, test coverage, repository structure, and README instructions.",
    },
  ],

  twistPool: [
    {
      id: "refund-cohort-twist",
      text: "Extend the pipeline to calculate a 'Refund Impact Index' measuring how partial vs full refunds alter 60-day cohort retention.",
    },
    {
      id: "anomaly-detection-twist",
      text: "Add a SQL-based Z-score calculation to detect daily transaction volume anomalies and flag suspect periods in the dashboard.",
    },
    {
      id: "channel-attribution-twist",
      text: "Implement first-touch and last-touch attribution models side-by-side in SQL to contrast marketing acquisition ROI.",
    },
    {
      id: "clv-decay-twist",
      text: "Incorporate exponential decay weighting into the rolling LTV model to heavily weight recent user activity.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
