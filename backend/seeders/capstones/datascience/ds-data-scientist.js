/**
 * Capstone brief — ds-data-scientist track (ds-data-scientist), v1.
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
  trackId: "ds-data-scientist",
  categoryId: "datascience",
  slug: "ds-data-scientist-demand-forecasting-engine",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated Energy Grid Demand Forecasting and Clustering Pipeline",
  summary:
    "Build an end-to-end data science system that ingests hourly energy consumption logs, performs segmentation " +
    "via unsupervised clustering, trains predictive time-series models, and compiles automated HTML reporting documents.",
  stack: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Statsmodels", "Jinja2"],

  requirements: [
    {
      id: "eda-analysis",
      text: "Perform thorough exploratory data analysis including summary statistics, distribution plots, and correlation matrices on hourly consumption records.",
      check: { type: "file", glob: ["notebooks/*.ipynb", "src/**/*.py"] },
    },
    {
      id: "feature-engineering",
      text: "Engineer time-based lag features, rolling statistics, categorical cyclical encodings, and perform missing value imputation without data leakage.",
      check: { type: "file", glob: "src/features/*.py" },
    },
    {
      id: "customer-segmentation",
      text: "Segment consumption profiles using K-Means clustering, determining optimal clusters via silhouette analysis and PCA visual projections.",
      check: {
        type: "file",
        glob: ["src/models/clustering.py", "notebooks/*.ipynb"],
      },
    },
    {
      id: "time-series-forecasting",
      text: "Fit an ARIMA or Seasonal Holt-Winters model alongside a supervised Random Forest regressor to forecast 24-hour peak demand.",
      check: { type: "file", glob: "src/models/forecasting.py" },
    },
    {
      id: "model-evaluation",
      text: "Evaluate models across train/test splits using MAPE, RMSE, and MAE; produce residual diagnostic plots verifying assumptions.",
      check: {
        type: "file",
        glob: ["src/models/evaluate.py", "notebooks/*.ipynb"],
      },
    },
    {
      id: "report-automation",
      text: "Generate parameterized HTML/PDF analytical reports using Jinja2 templates containing embedded plot outputs.",
      check: { type: "file", glob: ["templates/**/*.html", "reports/*.html"] },
    },
    {
      id: "cli-pipeline",
      text: "Expose an executable Python script pipeline to ingest raw data, execute predictions, and write outputs with configurable arguments.",
      check: { type: "file", glob: ["main.py", "run.py", "src/cli.py"] },
    },
    {
      id: "tests",
      text: "Write unit tests verifying data transformation outputs, feature shape consistency, and evaluation metric functions.",
      check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] },
    },
    {
      id: "readme",
      text: "Write a comprehensive README detailing environment setup, mathematical formulations, execution steps, and key findings.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Set up GitHub Actions to execute linting checks and the unit test suite automatically.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "statistical-eda",
      name: "EDA & Feature Engineering",
      weight: 20,
      layerId: "ds-data-scientist-4",
      description:
        "Evaluates handling of leakage, temporal splitting, feature encoding, and distribution transformations.",
    },
    {
      id: "unsupervised-learning",
      name: "Clustering & Segmentation",
      weight: 15,
      layerId: "ds-data-scientist-5",
      description:
        "Checks metric validation (silhouette score), PCA interpretation, and cluster stability analysis.",
    },
    {
      id: "forecasting-modeling",
      name: "Time Series & Regression Modeling",
      weight: 25,
      layerId: "ds-data-scientist-8",
      description:
        "Assesses stationarity checks, model selection rigor, lag feature creation, and benchmark comparisons.",
    },
    {
      id: "evaluation-rigor",
      name: "Model Evaluation & Diagnostics",
      weight: 15,
      layerId: "ds-data-scientist-6",
      description:
        "Evaluates metrics choices (RMSE/MAPE), cross-validation strategy, and residual normality/autocorrelation analysis.",
    },
    {
      id: "pipeline-automation",
      name: "Reporting & Pipeline Automation",
      weight: 15,
      layerId: "ds-data-scientist-9",
      description:
        "Measures code modularity, Jinja2 template integration, automated report building, and CLI design.",
    },
    {
      id: "reproducibility",
      name: "Code Quality & Documentation",
      weight: 10,
      layerId: "ds-data-scientist-1",
      description:
        "Assesses repository structure, unit test isolation, CI workflow implementation, and README clarity.",
    },
  ],

  twistPool: [
    {
      id: "weather-exogenous-twist",
      text: "Incorporate synthetic temperature and humidity exogenous covariates into the time-series forecasting model to measure accuracy lift.",
    },
    {
      id: "outlier-rejection-twist",
      text: "Implement an automated Isolation Forest pipeline step to identify and handle grid blackout anomaly periods prior to model training.",
    },
    {
      id: "quantized-confidence-twist",
      text: "Calculate quantile regression loss to produce 90% prediction interval bands rather than single point predictions.",
    },
    {
      id: "drift-detection-twist",
      text: "Implement a Kolmogorov-Smirnov statistical test module that flags severe feature drift between training data and new inference batches.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
