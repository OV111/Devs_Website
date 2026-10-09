/**
 * Capstone brief — data-scientist track (data-scientist), v1.
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
  trackId: "data-scientist",
  categoryId: "aiml",
  slug: "data-scientist-housing-analytics",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Real Estate Market Analytics and Price Valuation Platform",
  summary:
    "Deliver an end-to-end data science solution analyzing real estate trends and predicting property valuation. " +
    "You will extract data via SQL/APIs, perform comprehensive EDA, build statistical models, evaluate predictive " +
    "performance, log experiments, and deploy an interactive dashboard along with an inference endpoint.",
  stack: [
    "Python",
    "Pandas",
    "Scikit-Learn",
    "Streamlit",
    "MLflow",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "data-ingestion",
      text: "Extracts property dataset using SQL queries or external REST APIs and saves processed clean DataFrames.",
    },
    {
      id: "eda-reporting",
      text: "Performs deep exploratory data analysis with statistical distributions, outlier treatments, and correlation heatmaps.",
    },
    {
      id: "feature-engineering",
      text: "Engineers relevant domain features including categorical encoding, spatial aggregations, and scaling.",
    },
    {
      id: "model-training",
      text: "Trains ensemble regression models (e.g. Random Forest, Gradient Boosting) using cross-validation to prevent leakage.",
    },
    {
      id: "metrics-evaluation",
      text: "Evaluates models using MAE, RMSE, and R2 metrics, detailing feature importances and residual distributions.",
    },
    {
      id: "experiment-tracking",
      text: "Logs model runs, hyperparameter sweeps, and evaluation metrics using MLflow.",
    },
    {
      id: "interactive-dashboard",
      text: "Builds an interactive Streamlit application allowing users to explore market visual analytics and input custom property specs for valuation.",
    },
    {
      id: "tests",
      text: "Pytest suite verifies data cleaning transformations, missing value imputations, and feature pipeline shapes.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README includes problem framing, data insights summary, reproduction instructions, and metrics commentary.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configuration variables for database endpoints or API keys.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "CI workflow automates linting and test execution on code commits.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "eda-stats",
      name: "EDA & Statistical Rigor",
      weight: 20,
      layerId: "data-scientist-4",
      description:
        "Depth of exploratory analysis, distribution handling, correlation insights, and statistical validity.",
    },
    {
      id: "feature-eng",
      name: "Feature Engineering & Data Pipeline",
      weight: 20,
      layerId: "data-scientist-3",
      description:
        "Robust handling of missing data, outliers, scaling, and leakage-free dataset construction.",
    },
    {
      id: "modeling",
      name: "Machine Learning & Evaluation",
      weight: 20,
      layerId: "data-scientist-7",
      description:
        "Appropriate model choice, proper cross-validation, hyperparameter tuning, and clear performance trade-offs.",
    },
    {
      id: "visualization",
      name: "Dashboard & Data Storytelling",
      weight: 15,
      layerId: "data-scientist-9",
      description:
        "Interactive Streamlit app provides intuitive user experience and presents clear business insights.",
    },
    {
      id: "tests",
      name: "Code Quality & Testing",
      weight: 15,
      layerId: "data-scientist-10",
      description:
        "Automated unit tests validate data transformations and modeling pipelines reliably.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Reproducibility",
      weight: 10,
      layerId: "data-scientist-10",
      description:
        "Clear instructions enable full reproduction of experiments and dashboard execution.",
    },
  ],

  twistPool: [
    {
      id: "geospatial-viz",
      text: "Add an interactive Folium or Plotly map in Streamlit showing price heatmaps and spatial neighborhood clusters.",
    },
    {
      id: "shap-explainability",
      text: "Integrate SHAP value plots into the dashboard to explain feature contribution for individual property valuations.",
    },
    {
      id: "automated-drift",
      text: "Implement a data stability check script that compares incoming property listings against baseline training distributions.",
    },
    {
      id: "fastapi-export",
      text: "Serve the trained valuation model via a separate FastAPI endpoint alongside the Streamlit dashboard.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
