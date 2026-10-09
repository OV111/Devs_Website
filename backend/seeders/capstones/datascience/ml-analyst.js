/**
 * Capstone brief — ml-analyst track (ml-analyst), v1.
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
  trackId: "ml-analyst",
  categoryId: "datascience",
  slug: "ml-analyst-credit-risk-evaluator",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Explainable Credit Risk Assessment and Machine Learning Pipeline",
  summary:
    "Develop a full machine learning analytics solution for credit default prediction: construct reproducible Pandas preprocessing " +
    "pipelines, train ensemble classification models, optimize hyper-parameters, and explain decisions using SHAP analysis.",
  stack: ["Python", "Pandas", "Scikit-Learn", "XGBoost", "SHAP", "Matplotlib"],

  requirements: [
    {
      id: "eda-analysis",
      text: "Conduct exploratory data analysis identifying class imbalances, missing data patterns, and feature correlations with default rates.",
      check: { type: "file", glob: ["notebooks/*.ipynb", "src/**/*.py"] },
    },
    {
      id: "preprocessing-pipeline",
      text: "Build a reproducible Scikit-Learn ColumnTransformer pipeline encapsulating numerical scaling, missing value imputation, and categorical encoding.",
      check: { type: "file", glob: "src/pipelines/preprocessing.py" },
    },
    {
      id: "model-training",
      text: "Train baseline Logistic Regression, Random Forest, and XGBoost classifiers using cross-validation strategies.",
      check: { type: "file", glob: "src/models/train.py" },
    },
    {
      id: "hyperparameter-tuning",
      text: "Optimize ensemble hyper-parameters with RandomizedSearchCV, balancing Precision, Recall, and ROC-AUC metrics.",
      check: {
        type: "file",
        glob: ["src/models/tune.py", "notebooks/*.ipynb"],
      },
    },
    {
      id: "shap-explainability",
      text: "Generate global and local SHAP explanation summary and force plots explaining individual loan rejection decisions.",
      check: {
        type: "file",
        glob: ["src/explainability/*.py", "reports/figures/*"],
      },
    },
    {
      id: "unsupervised-outliers",
      text: "Apply DBSCAN or K-Means clustering to discover distinct risk profiles and flag anomalous loan application patterns.",
      check: {
        type: "file",
        glob: ["src/models/clustering.py", "notebooks/*.ipynb"],
      },
    },
    {
      id: "model-card-report",
      text: "Publish an analytical model card documenting training data limitations, evaluation metrics across demographic subsets, and decision thresholds.",
      check: { type: "file", glob: "reports/model_card.md" },
    },
    {
      id: "tests",
      text: "Write unit tests using pytest verifying pipeline transformations, output shapes, and evaluation score logic.",
      check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] },
    },
    {
      id: "readme",
      text: "Document setup requirements, dataset details, pipeline execution commands, and key analytical insights.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Create a GitHub Actions CI workflow to run code linting and unit test suites on push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "data-preprocessing",
      name: "Data Processing & Feature Engineering",
      weight: 20,
      layerId: "ml-analyst-4",
      description:
        "Evaluates Scikit-Learn ColumnTransformer usage, handling of data leakage, and encoding quality.",
    },
    {
      id: "supervised-modeling",
      name: "Supervised Learning & Tuning",
      weight: 25,
      layerId: "ml-analyst-6",
      description:
        "Assesses cross-validation setup, XGBoost/Random Forest parameter tuning, and metric selection.",
    },
    {
      id: "explainability-shap",
      name: "Model Explainability & SHAP Analysis",
      weight: 20,
      layerId: "ml-analyst-7",
      description:
        "Evaluates interpretation accuracy using global feature importance and individual SHAP value breakdowns.",
    },
    {
      id: "unsupervised-analysis",
      name: "Unsupervised Analysis & Clustering",
      weight: 10,
      layerId: "ml-analyst-8",
      description:
        "Checks appropriateness of clustering algorithms, outlier detection, and segment interpretations.",
    },
    {
      id: "model-governance",
      name: "Model Governance & Reporting",
      weight: 15,
      layerId: "ml-analyst-10",
      description:
        "Measures quality of the model card, subgroup fairness analysis, and clear executive framing.",
    },
    {
      id: "code-testing-ci",
      name: "Code Quality & Testing",
      weight: 10,
      layerId: "ml-analyst-1",
      description:
        "Evaluates pytest test isolation, modularity of codebase, README clarity, and CI workflow.",
    },
  ],

  twistPool: [
    {
      id: "cost-matrix-twist",
      text: "Implement custom cost-sensitive thresholding that assigns explicit dollar costs to False Positives vs False Negatives during evaluation.",
    },
    {
      id: "fairness-metric-twist",
      text: "Calculate demographic parity and equalized odds metrics across age groups, tuning decision thresholds to minimize bias.",
    },
    {
      id: "time-split-twist",
      text: "Refactor validation strategy to use strict out-of-time temporal validation folds to evaluate real-world performance decay.",
    },
    {
      id: "lime-comparison-twist",
      text: "Incorporate LIME local explanations alongside SHAP and write a comparative summary of feature attribution differences.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
