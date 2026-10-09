/**
 * Capstone brief — statistician track (statistician), v1.
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
  trackId: "statistician",
  categoryId: "datascience",
  slug: "statistician-clinical-trial-analysis-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Clinical Trial Experimental Design and Statistical Consulting Analysis",
  summary:
    "Execute an end-to-end statistical consulting project analyzing clinical trial outcomes: conduct sample size power calculations, " +
    "fit Generalized Linear Models, evaluate survival analysis functions, and validate all model assumptions in R.",
  stack: ["R", "RMarkdown or Quarto", "tidyverse", "survival", "ggplot2"],

  requirements: [
    {
      id: "power-sample-calculation",
      text: "Perform sample size and statistical power calculations using R for factorial experimental designs prior to testing.",
      check: { type: "file", glob: ["R/*.R", "scripts/*.R", "src/*.R"] },
    },
    {
      id: "hypothesis-testing-suite",
      text: "Conduct two-sample t-tests, ANOVA, and Chi-square contingency tests evaluating treatment vs control group baseline metrics.",
      check: {
        type: "file",
        glob: ["R/*.R", "scripts/*.R", "analysis/**/*.Rmd"],
      },
    },
    {
      id: "regression-diagnostics",
      text: "Fit multiple linear regression and logistic models, producing detailed LINE assumption check diagnostic plots (linearity, independence, normality, equal variance).",
      check: {
        type: "file",
        glob: ["R/regression.R", "analysis/*.Rmd", "analysis/*.qmd"],
      },
    },
    {
      id: "survival-analysis",
      text: "Construct Kaplan-Meier survival curves, conduct log-rank statistical tests, and estimate Cox proportional hazards ratios for patient outcome timeframes.",
      check: {
        type: "file",
        glob: ["R/survival.R", "analysis/*.Rmd", "analysis/*.qmd"],
      },
    },
    {
      id: "bayesian-mcmc",
      text: "Implement a Bayesian regression or MCMC model using prior distributions to compute posterior probability intervals.",
      check: { type: "file", glob: ["R/bayesian.R", "scripts/bayesian.R"] },
    },
    {
      id: "multivariate-pca",
      text: "Perform Principal Component Analysis (PCA) or Factor Analysis to reduce multi-variable patient diagnostic indicators into core orthogonal features.",
      check: { type: "file", glob: ["R/multivariate.R", "analysis/*.Rmd"] },
    },
    {
      id: "consulting-report",
      text: "Compile a comprehensive clinical consulting report using RMarkdown or Quarto detailing methodologies, hypothesis decisions, and limitations.",
      check: {
        type: "file",
        glob: [
          "reports/consulting_report.pdf",
          "reports/consulting_report.html",
          "reports/*.Rmd",
          "reports/*.qmd",
        ],
      },
    },
    {
      id: "tests",
      text: "Write R test scripts (using testthat) verifying custom statistical helper functions, data transformations, and metric calculations.",
      check: { type: "file", glob: ["tests/testthat/test-*.R", "tests/*.R"] },
    },
    {
      id: "readme",
      text: "Provide a detailed README explaining R package dependencies, instructions for knitting reports, and execution steps for analysis scripts.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "Set up GitHub Actions to execute R unit tests and render RMarkdown/Quarto reports automatically on push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "experimental-design",
      name: "Experimental Design & Hypothesis Testing",
      weight: 20,
      layerId: "statistician-5",
      description:
        "Evaluates sample size calculation rigor, power analysis, randomization evaluation, and parametric test selection.",
    },
    {
      id: "regression-diagnostics",
      name: "Regression Analysis & Diagnostics",
      weight: 20,
      layerId: "statistician-4",
      description:
        "Assesses model fitting, LINE assumption validation, residual diagnostics, and multicollinearity checks.",
    },
    {
      id: "survival-advanced",
      name: "Survival & Generalized Linear Modeling",
      weight: 20,
      layerId: "statistician-9",
      description:
        "Measures Kaplan-Meier curve estimation, Cox proportional hazards assumption checks, and GLM family selection.",
    },
    {
      id: "bayesian-multivariate",
      name: "Bayesian & Multivariate Methods",
      weight: 15,
      layerId: "statistician-6",
      description:
        "Checks prior specification, MCMC convergence interpretation, and PCA/factor analysis execution.",
    },
    {
      id: "statistical-reporting",
      name: "Statistical Consulting & Communication",
      weight: 15,
      layerId: "statistician-10",
      description:
        "Evaluates RMarkdown/Quarto narrative quality, table formatting, visualization clarity, and limitation discussions.",
    },
    {
      id: "code-reproducibility",
      name: "Code Quality & Reproducibility",
      weight: 10,
      layerId: "statistician-1",
      description:
        "Checks testthat test isolation, repository structure, CI document rendering, and README environment details.",
    },
  ],

  twistPool: [
    {
      id: "propensity-score-twist",
      text: "Implement Propensity Score Matching (PSM) to adjust for baseline confounding variables in observational patient cohorts.",
    },
    {
      id: "time-series-arima-twist",
      text: "Incorporate ARIMA or STL decomposition modeling to forecast seasonal hospital readmission rates over a 12-month horizon.",
    },
    {
      id: "missing-data-mice-twist",
      text: "Apply Multiple Imputation by Chained Equations (MICE) to handle missing patient data and compare against listwise deletion results.",
    },
    {
      id: "non-parametric-bootstrap-twist",
      text: "Calculate non-parametric bootstrap confidence intervals for median survival differences across treatment groups.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
