/**
 * Capstone brief — Statistician track (statistician), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  title: "Clinical Trial Experimental Design and Statistical Consulting Analysis",
  summary:
    "Execute an end-to-end statistical consulting project analyzing clinical trial outcomes: conduct sample size power calculations, " +
    "fit Generalized Linear Models, evaluate survival analysis functions, and validate all model assumptions in R.",
  stack: ["R", "RMarkdown or Quarto", "tidyverse", "survival", "ggplot2"],

  requirements: [
    { id: "power-sample-calculation", text: "Perform sample size and statistical power calculations using R for factorial experimental designs prior to testing.", check: { type: "file", glob: ["R/*.R", "scripts/*.R", "src/*.R"] } },
    { id: "hypothesis-testing-suite", text: "Conduct two-sample t-tests, ANOVA, and Chi-square contingency tests evaluating treatment vs control group baseline metrics.", check: { type: "file", glob: ["R/*.R", "scripts/*.R", "analysis/**/*.Rmd"] } },
    { id: "regression-diagnostics", text: "Fit multiple linear regression and logistic models, producing detailed LINE assumption check diagnostic plots (linearity, independence, normality, equal variance).", check: { type: "file", glob: ["R/regression.R", "analysis/*.Rmd", "analysis/*.qmd"] } },
    { id: "survival-analysis", text: "Construct Kaplan-Meier survival curves, conduct log-rank statistical tests, and estimate Cox proportional hazards ratios for patient outcome timeframes.", check: { type: "file", glob: ["R/survival.R", "analysis/*.Rmd", "analysis/*.qmd"] } },
    { id: "bayesian-mcmc", text: "Implement a Bayesian regression or MCMC model using prior distributions to compute posterior probability intervals.", check: { type: "file", glob: ["R/bayesian.R", "scripts/bayesian.R"] } },
    { id: "multivariate-pca", text: "Perform Principal Component Analysis (PCA) or Factor Analysis to reduce multi-variable patient diagnostic indicators into core orthogonal features.", check: { type: "file", glob: ["R/multivariate.R", "analysis/*.Rmd"] } },
    { id: "consulting-report", text: "Compile a comprehensive clinical consulting report using RMarkdown or Quarto detailing methodologies, hypothesis decisions, and limitations.", check: { type: "file", glob: ["reports/consulting_report.pdf", "reports/consulting_report.html", "reports/*.Rmd", "reports/*.qmd"] } },
    { id: "tests", text: "Write R test scripts (using testthat) verifying custom statistical helper functions, data transformations, and metric calculations.", check: { type: "file", glob: ["tests/testthat/test-*.R", "tests/*.R"] } },
    { id: "readme", text: "Provide a detailed README explaining R package dependencies, instructions for knitting reports, and execution steps for analysis scripts.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Set up GitHub Actions to execute R unit tests and render RMarkdown/Quarto reports automatically on push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "experimental-design", name: "Experimental Design & Hypothesis Testing", weight: 20, layerId: "statistician-5", description: "Evaluates sample size calculation rigor, power analysis, randomization evaluation, and parametric test selection." },
    { id: "regression-diagnostics", name: "Regression Analysis & Diagnostics", weight: 20, layerId: "statistician-4", description: "Assesses model fitting, LINE assumption validation, residual diagnostics, and multicollinearity checks." },
    { id: "survival-advanced", name: "Survival & Generalized Linear Modeling", weight: 20, layerId: "statistician-9", description: "Measures Kaplan-Meier curve estimation, Cox proportional hazards assumption checks, and GLM family selection." },
    { id: "bayesian-multivariate", name: "Bayesian & Multivariate Methods", weight: 15, layerId: "statistician-6", description: "Checks prior specification, MCMC convergence interpretation, and PCA/factor analysis execution." },
    { id: "statistical-reporting", name: "Statistical Consulting & Communication", weight: 15, layerId: "statistician-10", description: "Evaluates RMarkdown/Quarto narrative quality, table formatting, visualization clarity, and limitation discussions." },
    { id: "code-reproducibility", name: "Code Quality & Reproducibility", weight: 10, layerId: "statistician-1", description: "Checks testthat test isolation, repository structure, CI document rendering, and README environment details." },
  ],

  twistPool: [
    { id: "propensity-score-twist", text: "Implement Propensity Score Matching (PSM) to adjust for baseline confounding variables in observational patient cohorts." },
    { id: "time-series-arima-twist", text: "Incorporate ARIMA or STL decomposition modeling to forecast seasonal hospital readmission rates over a 12-month horizon." },
    { id: "missing-data-mice-twist", text: "Apply Multiple Imputation by Chained Equations (MICE) to handle missing patient data and compare against listwise deletion results." },
    { id: "non-parametric-bootstrap-twist", text: "Calculate non-parametric bootstrap confidence intervals for median survival differences across treatment groups." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Analytics Engineer track (analytics-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "analytics-engineer",
  categoryId: "datascience",
  slug: "analytics-engineer-saas-metrics-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production Analytics Platform with dbt Core and Semantic Layer",
  summary:
    "Build a production analytics platform for SaaS recurring revenue and product analytics: engineer staged dbt models, " +
    "define dbt Semantic Layer metric specs, implement custom tests, and set up automated Airflow orchestration.",
  stack: ["dbt", "SQL", "Snowflake or DuckDB", "Looker/LookML or Metabase", "Apache Airflow"],

  requirements: [
    { id: "dbt-staging-marts", text: "Structure a modular dbt project with staging, intermediate, and dimensional mart layers transforming raw SaaS event logs.", check: { type: "file", glob: ["dbt/models/**/*.sql", "models/**/*.sql"] } },
    { id: "advanced-sql-windowing", text: "Implement advanced SQL models for user sessionization, date spine generation, and monthly active subscription tracking.", check: { type: "file", glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"] } },
    { id: "semantic-layer-metrics", text: "Define dbt Semantic Layer metric configuration files for MRR, net retention, and active subscriber metrics with defined grain time intervals.", check: { type: "file", glob: ["dbt/models/**/*.yml", "models/**/*.yml"] } },
    { id: "dbt-data-contracts", text: "Implement schema tests (unique, not_null, accepted_values), custom generic dbt tests, and enforce data contracts on core dimensional models.", check: { type: "file", glob: ["dbt/tests/**/*.sql", "dbt/models/**/*.yml", "tests/**/*.sql"] } },
    { id: "incremental-strategy", text: "Build optimized incremental dbt models with explicit unique keys and merge strategies for high-frequency user telemetry events.", check: { type: "file", glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"] } },
    { id: "looker-bi-semantic-layer", text: "Create LookML view files and Explores (or Metabase data model queries) reflecting the underlying dbt star schema metrics.", check: { type: "file", glob: ["looker/**/*.lkml", "semantic/**/*.sql", "dashboards/*"] } },
    { id: "airflow-dbt-orchestration", text: "Construct an Apache Airflow DAG using DbtRunOperator / BashOperator to trigger daily dbt builds and automated testing pipelines.", check: { type: "file", glob: ["dags/*.py", "airflow/dags/*.py"] } },
    { id: "tests", text: "Automate Python/SQL integration scripts that validate dbt execution output, metric consistency, and pipeline success.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py", "tests/*.sql"] } },
    { id: "readme", text: "Provide detailed instructions on setting up dbt profiles, executing dbt build commands, generating dbt docs, and running Airflow.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Configure GitHub Actions for slim CI testing that compares modified dbt models against production state artifacts.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "dbt-project-structure", name: "dbt Modeling & Architecture", weight: 25, layerId: "analytics-engineer-2", description: "Evaluates staging separation, ref() lineage graph, materialization choices, and model modularity." },
    { id: "advanced-sql-logic", name: "Advanced Analytics SQL", weight: 20, layerId: "analytics-engineer-3", description: "Assesses window function usage, date spines, sessionization algorithms, and subscription churn calculation logic." },
    { id: "data-quality-testing", name: "dbt Testing & Contracts", weight: 15, layerId: "analytics-engineer-4", description: "Measures schema test coverage, custom generic SQL tests, data contracts, and failure handling." },
    { id: "incremental-performance", name: "Incremental Processing & Performance", weight: 15, layerId: "analytics-engineer-6", description: "Evaluates incremental merge strategies, partition pruning alignment, and query efficiency." },
    { id: "semantic-layer-bi", name: "Semantic Layer & Metric Definitions", weight: 15, layerId: "analytics-engineer-8", description: "Checks metric definitions (dbt MetricFlow/LookML), time grain configurations, and BI layer integration." },
    { id: "ci-orchestration-ops", name: "CI/CD & Orchestration", weight: 10, layerId: "analytics-engineer-9", description: "Evaluates slim CI state comparison setup, Airflow DAG workflow design, and operational documentation." },
  ],

  twistPool: [
    { id: "snapshot-scd-twist", text: "Add dbt snapshots to track slowly changing dimensions (SCD Type 2) on user subscription plan changes over time." },
    { id: "unit-testing-twist", text: "Implement dbt unit tests using mock seed datasets to verify complex transformation logic independent of database state." },
    { id: "zero-copy-clone-twist", text: "Modify CI workflow to create isolated zero-copy dynamic schema staging environments in Snowflake for PR validation." },
    { id: "audit-logging-twist", text: "Implement dbt macro hooks that write pipeline execution run times and row counts into a dedicated metadata audit table." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Data Architect track (data-architect), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["SQL", "dbt", "Snowflake or BigQuery DDL", "Diagrams (draw.io/Mermaid)", "YAML"],

  requirements: [
    { id: "arch-architecture-diagrams", text: "Author comprehensive component and data flow architecture diagrams detailing operational ingestion, landing, storage, transformation, and serving layers.", check: { type: "file", glob: ["docs/architecture/*.png", "docs/architecture/*.svg", "docs/architecture/*.mermaid", "docs/**/*.md"] } },
    { id: "adr-records", text: "Write formal Architecture Decision Records (ADRs) justifying choices regarding cloud data platforms, storage formats, and governance mechanisms.", check: { type: "file", glob: ["docs/adr/*.md", "adrs/*.md"] } },
    { id: "relational-normalized-schema", text: "Develop 3NF operational relational DDL schemas with primary/foreign keys, indexes, and constraints.", check: { type: "file", glob: ["ddl/3nf/*.sql", "schemas/operational/*.sql"] } },
    { id: "dimensional-dw-schema", text: "Develop dimensional warehouse DDL schemas incorporating star schema fact and dimension tables with conformed dimensions.", check: { type: "file", glob: ["ddl/dimensional/*.sql", "schemas/dw/*.sql"] } },
    { id: "security-masking-policies", text: "Write DDL/SQL defining Role-Based Access Control (RBAC), row access policies, and dynamic column masking for PII fields.", check: { type: "file", glob: ["security/*.sql", "governance/*.sql"] } },
    { id: "dbt-multi-project-packages", text: "Implement structured dbt transformation models utilizing package imports, materialization configurations, and data lineage documentation.", check: { type: "file", glob: ["dbt/models/**/*.sql", "dbt/dbt_project.yml"] } },
    { id: "data-catalog-glossary", text: "Construct a data catalog and business glossary specification in JSON/YAML mapping entity definitions and data sensitivity tiers.", check: { type: "file", glob: ["governance/catalog.yml", "governance/catalog.json", "docs/catalog.md"] } },
    { id: "tests", text: "Automate SQL data validation and integrity test scripts to verify constraints and row-level access rules.", check: { type: "file", glob: ["tests/*.sql", "tests/test_*.py", "**/test_*.py"] } },
    { id: "readme", text: "Document project repository structure, platform setup prerequisites, deployment steps, and governance audit procedures.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Set up GitHub Actions to run SQL syntax verification and dbt schema validation tests.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "platform-architecture", name: "Data Architecture & Platform Design", weight: 25, layerId: "data-architect-1", description: "Evaluates system architecture completeness, data movement patterns, and clarity of visual diagrams." },
    { id: "schema-design", name: "Database & Dimensional Modeling", weight: 25, layerId: "data-architect-3", description: "Assesses normalization quality, star schema design, conformed dimension usage, and indexing strategy." },
    { id: "security-compliance", name: "Data Security & Compliance", weight: 20, layerId: "data-architect-7", description: "Evaluates RBAC definitions, dynamic column masking rules, row-level security, and PII protection mechanisms." },
    { id: "transformation-dbt", name: "Transformation Strategy & dbt", weight: 10, layerId: "data-architect-5", description: "Measures dbt project layout, materialization decisions, package management, and lineage tracking." },
    { id: "governance-metadata", name: "Data Governance & Metadata", weight: 10, layerId: "data-architect-6", description: "Checks data catalog completeness, business glossary structure, ADR quality, and asset tagging." },
    { id: "ops-validation", name: "Testing & Operational Setup", weight: 10, layerId: "data-architect-10", description: "Evaluates SQL validation test scripts, CI integration, and deployment guidance." },
  ],

  twistPool: [
    { id: "data-mesh-domain-twist", text: "Refactor data warehouse models into two distinct decentralized domain data products connected via conformed global contracts." },
    { id: "cost-optimization-twist", text: "Include an explicit cluster partitioning and auto-suspend warehouse sizing strategy doc with estimated monthly cost calculations." },
    { id: "lakehouse-iceberg-twist", text: "Specify external Apache Iceberg table definitions and detail zero-copy clone disaster recovery runbooks." },
    { id: "gdpr-erasure-twist", text: "Design a cryptographically enforced automated GDPR Right-to-be-Forgotten erasure pipeline specification." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — ML Analyst track (ml-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "eda-analysis", text: "Conduct exploratory data analysis identifying class imbalances, missing data patterns, and feature correlations with default rates.", check: { type: "file", glob: ["notebooks/*.ipynb", "src/**/*.py"] } },
    { id: "preprocessing-pipeline", text: "Build a reproducible Scikit-Learn ColumnTransformer pipeline encapsulating numerical scaling, missing value imputation, and categorical encoding.", check: { type: "file", glob: "src/pipelines/preprocessing.py" } },
    { id: "model-training", text: "Train baseline Logistic Regression, Random Forest, and XGBoost classifiers using cross-validation strategies.", check: { type: "file", glob: "src/models/train.py" } },
    { id: "hyperparameter-tuning", text: "Optimize ensemble hyper-parameters with RandomizedSearchCV, balancing Precision, Recall, and ROC-AUC metrics.", check: { type: "file", glob: ["src/models/tune.py", "notebooks/*.ipynb"] } },
    { id: "shap-explainability", text: "Generate global and local SHAP explanation summary and force plots explaining individual loan rejection decisions.", check: { type: "file", glob: ["src/explainability/*.py", "reports/figures/*"] } },
    { id: "unsupervised-outliers", text: "Apply DBSCAN or K-Means clustering to discover distinct risk profiles and flag anomalous loan application patterns.", check: { type: "file", glob: ["src/models/clustering.py", "notebooks/*.ipynb"] } },
    { id: "model-card-report", text: "Publish an analytical model card documenting training data limitations, evaluation metrics across demographic subsets, and decision thresholds.", check: { type: "file", glob: "reports/model_card.md" } },
    { id: "tests", text: "Write unit tests using pytest verifying pipeline transformations, output shapes, and evaluation score logic.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] } },
    { id: "readme", text: "Document setup requirements, dataset details, pipeline execution commands, and key analytical insights.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Create a GitHub Actions CI workflow to run code linting and unit test suites on push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "data-preprocessing", name: "Data Processing & Feature Engineering", weight: 20, layerId: "ml-analyst-4", description: "Evaluates Scikit-Learn ColumnTransformer usage, handling of data leakage, and encoding quality." },
    { id: "supervised-modeling", name: "Supervised Learning & Tuning", weight: 25, layerId: "ml-analyst-6", description: "Assesses cross-validation setup, XGBoost/Random Forest parameter tuning, and metric selection." },
    { id: "explainability-shap", name: "Model Explainability & SHAP Analysis", weight: 20, layerId: "ml-analyst-7", description: "Evaluates interpretation accuracy using global feature importance and individual SHAP value breakdowns." },
    { id: "unsupervised-analysis", name: "Unsupervised Analysis & Clustering", weight: 10, layerId: "ml-analyst-8", description: "Checks appropriateness of clustering algorithms, outlier detection, and segment interpretations." },
    { id: "model-governance", name: "Model Governance & Reporting", weight: 15, layerId: "ml-analyst-10", description: "Measures quality of the model card, subgroup fairness analysis, and clear executive framing." },
    { id: "code-testing-ci", name: "Code Quality & Testing", weight: 10, layerId: "ml-analyst-1", description: "Evaluates pytest test isolation, modularity of codebase, README clarity, and CI workflow." },
  ],

  twistPool: [
    { id: "cost-matrix-twist", text: "Implement custom cost-sensitive thresholding that assigns explicit dollar costs to False Positives vs False Negatives during evaluation." },
    { id: "fairness-metric-twist", text: "Calculate demographic parity and equalized odds metrics across age groups, tuning decision thresholds to minimize bias." },
    { id: "time-split-twist", text: "Refactor validation strategy to use strict out-of-time temporal validation folds to evaluate real-world performance decay." },
    { id: "lime-comparison-twist", text: "Incorporate LIME local explanations alongside SHAP and write a comparative summary of feature attribution differences." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — BI Developer track (bi-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  stack: ["SQL", "Power BI or Tableau", "DAX or LookML/LOD", "PostgreSQL or Snowflake"],

  requirements: [
    { id: "dimensional-sql-views", text: "Create star-schema SQL database views establishing clean dimension tables and a high-volume sales fact table with explicit key relationships.", check: { type: "file", glob: ["sql/**/*.sql", "views/**/*.sql", "models/**/*.sql"] } },
    { id: "complex-dax-lod", text: "Implement advanced calculations (calculating YTD growth, rolling 12-month averages, and dynamic customer segment counts) using DAX or Tableau LOD expressions.", check: { type: "file", glob: ["dax/**/*.dax", "measures/**/*.sql", "reports/**/*", "pbix/**/*.txt"] } },
    { id: "multi-page-dashboard", text: "Deliver an executive BI dashboard featuring summary, store comparison, and customer analytics drill-through pages.", check: { type: "file", glob: ["dashboards/**/*", "reports/**/*", "*.pbix", "*.twbx"] } },
    { id: "row-level-security", text: "Define Row-Level Security (RLS) rules restricting regional managers to data relevant solely to their assigned territories.", check: { type: "file", glob: ["security/**/*.sql", "rls/**/*.json", "docs/rls.md", "reports/**/*"] } },
    { id: "performance-optimization", text: "Optimize query performance using aggregated tables or dual storage modes, detailing DAX Studio / Query Plan timings before and after optimization.", check: { type: "file", glob: ["docs/performance.md", "performance/*.txt"] } },
    { id: "design-system-spec", text: "Publish a visual style guide establishing color accessibility palettes, font hierarchies, visual margins, and filter interaction standards.", check: { type: "file", glob: ["docs/style_guide.md", "docs/design_system.md"] } },
    { id: "test-data-generator", text: "Include a Python or SQL data generator script to populate mock transactional test records across multiple years.", check: { type: "file", glob: ["scripts/**/*.py", "scripts/**/*.sql", "data_gen/**/*.py"] } },
    { id: "tests", text: "Automate Python/SQL unit test scripts validating calculated measure outputs against expected baseline totals.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py", "tests/*.sql"] } },
    { id: "readme", text: "Provide a comprehensive README explaining model architecture, RLS setup instructions, performance metrics, and dashboard publishing steps.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Configure a GitHub Actions workflow that executes SQL/Python test validation scripts on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "data-modeling", name: "Data Modeling & SQL Views", weight: 20, layerId: "bi-developer-1", description: "Evaluates star-schema relationships, surrogate key integrity, and SQL view design for BI consumption." },
    { id: "advanced-dax", name: "DAX / LOD Business Logic", weight: 25, layerId: "bi-developer-5", description: "Assesses correctness of filter context manipulation, time intelligence calculations, and dynamic grouping." },
    { id: "dashboard-design", name: "Dashboard Design & Storytelling", weight: 20, layerId: "bi-developer-8", description: "Evaluates layout hierarchy, accessibility compliance, visual selection accuracy, and drill-through navigation." },
    { id: "governance-security", name: "Governance & Row-Level Security", weight: 15, layerId: "bi-developer-7", description: "Measures accuracy and robustness of RLS role configurations and workspace access rules." },
    { id: "performance-tuning", name: "Performance Optimization", weight: 10, layerId: "bi-developer-9", description: "Checks query execution timings, aggregate table implementations, and VertiPaq/query optimization details." },
    { id: "testing-docs", name: "Testing & Operational Documentation", weight: 10, layerId: "bi-developer-10", description: "Evaluates measure validation tests, CI workflow integration, and comprehensive deployment documentation." },
  ],

  twistPool: [
    { id: "pareto-inventory-twist", text: "Build an dynamic ABC/Pareto classification measure that categorizes inventory stock items on-the-fly based on selected date ranges." },
    { id: "currency-conversion-twist", text: "Implement dynamic currency conversion logic that recalculates all financial measures into a user-selected target currency." },
    { id: "writeback-whatif-twist", text: "Add interactive parameter scenarios allowing executives to simulate price elasticity and margin projections." },
    { id: "hybrid-composite-twist", text: "Configure a composite model combining direct query for real-time daily transactions with imported historic aggregates." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Data Engineer track (ds-data-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
  trackId: "ds-data-engineer",
  categoryId: "datascience",
  slug: "ds-data-engineer-lakehouse-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production ETL Lakehouse and dbt Transformation Engine",
  summary:
    "Design and build an automated batch data pipeline: ingest raw JSON logs via PySpark/Python, land Parquet files, " +
    "model star-schema marts with dbt, enforce quality checks, and orchestrate execution via Apache Airflow.",
  stack: ["Python", "PySpark", "dbt", "PostgreSQL or DuckDB", "Apache Airflow", "Docker"],

  requirements: [
    { id: "ingestion-pyspark", text: "Build a PySpark or Python ingestion job that reads raw multi-file JSON datasets, handles corrupt records, and writes partitioned Parquet files.", check: { type: "file", glob: ["src/ingest/*.py", "jobs/ingest.py"] } },
    { id: "dimensional-model", text: "Design dbt models implementing staging layers, Type-2 Slowly Changing Dimensions (SCD Type 2), and dimensional star-schema data marts.", check: { type: "file", glob: ["dbt/models/**/*.sql", "models/**/*.sql"] } },
    { id: "incremental-logic", text: "Write incremental dbt models using unique keys and high-watermark timestamps to handle append/merge patterns efficiently.", check: { type: "file", glob: ["dbt/models/marts/**/*.sql", "models/marts/**/*.sql"] } },
    { id: "data-quality-gates", text: "Define dbt tests (schema assertions and singular custom SQL checks) that halt pipeline execution on data freshness or integrity failure.", check: { type: "file", glob: ["dbt/tests/**/*.sql", "dbt/models/schema.yml", "models/**/*.yml"] } },
    { id: "airflow-orchestration", text: "Create an Apache Airflow DAG defining task dependencies across ingestion, transformation, and quality validation tasks with retry policies.", check: { type: "file", glob: ["dags/*.py", "airflow/dags/*.py"] } },
    { id: "containerization", text: "Provision a Docker Compose environment orchestrating local database storage, Airflow services, and runner execution.", check: { type: "file", glob: ["docker-compose.yml", "docker-compose.yaml", "compose.yml"] } },
    { id: "environment-config", text: "Manage database connection strings and environment configurations without hardcoding credentials.", check: { type: "file", glob: ".env.example" } },
    { id: "tests", text: "Write pytest suite testing custom PySpark transform functions and pipeline helper modules.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] } },
    { id: "readme", text: "Provide detailed instructions on launching Docker Compose, seeding raw data, running Airflow DAGs, and executing dbt docs.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Set up GitHub Actions to validate dbt syntax, lint SQL/Python files, and execute pytest suites.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "pipeline-architecture", name: "Data Architecture & Ingestion", weight: 20, layerId: "ds-data-engineer-1", description: "Evaluates PySpark ingest efficiency, Parquet partitioning choices, and error record routing." },
    { id: "dbt-modeling", name: "Dimensional Modeling & dbt", weight: 25, layerId: "ds-data-engineer-2", description: "Assesses star schema correctness, SCD Type 2 handling, staging abstraction, and surrogate key usage." },
    { id: "incremental-cdc", name: "Incremental Processing", weight: 15, layerId: "ds-data-engineer-9", description: "Checks incremental dbt strategies, high-watermark filtering logic, and deduplication efficiency." },
    { id: "orchestration-ops", name: "Workflow Orchestration", weight: 15, layerId: "ds-data-engineer-6", description: "Evaluates Airflow DAG design, idempotency, retry mechanisms, and task dependency structure." },
    { id: "data-quality", name: "Data Quality & Validation", weight: 15, layerId: "ds-data-engineer-8", description: "Measures coverage of generic/singular dbt tests, freshness bounds, and pipeline failure gates." },
    { id: "devops-docs", name: "Containerization & Reproducibility", weight: 10, layerId: "ds-data-engineer-10", description: "Checks Docker environment reliability, CI workflow integration, and step-by-step setup documentation." },
  ],

  twistPool: [
    { id: "cdc-deletion-handling", text: "Extend the dbt incremental model to capture explicit deletion records (hard deletes) coming from raw source change logs." },
    { id: "dlq-routing-twist", text: "Build a Dead Letter Queue (DLQ) pattern in PySpark that routes malformed JSON events to a separate quarantine folder without stopping the job." },
    { id: "great-expectations-twist", text: "Integrate a Great Expectations checkpoint step into the Airflow DAG right after raw landing and prior to running dbt transformations." },
    { id: "backfill-macro-twist", text: "Write a reusable dbt macro that accepts start and end date parameters to run deterministic historical data backfills." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Data Scientist track (ds-data-scientist), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "eda-analysis", text: "Perform thorough exploratory data analysis including summary statistics, distribution plots, and correlation matrices on hourly consumption records.", check: { type: "file", glob: ["notebooks/*.ipynb", "src/**/*.py"] } },
    { id: "feature-engineering", text: "Engineer time-based lag features, rolling statistics, categorical cyclical encodings, and perform missing value imputation without data leakage.", check: { type: "file", glob: "src/features/*.py" } },
    { id: "customer-segmentation", text: "Segment consumption profiles using K-Means clustering, determining optimal clusters via silhouette analysis and PCA visual projections.", check: { type: "file", glob: ["src/models/clustering.py", "notebooks/*.ipynb"] } },
    { id: "time-series-forecasting", text: "Fit an ARIMA or Seasonal Holt-Winters model alongside a supervised Random Forest regressor to forecast 24-hour peak demand.", check: { type: "file", glob: "src/models/forecasting.py" } },
    { id: "model-evaluation", text: "Evaluate models across train/test splits using MAPE, RMSE, and MAE; produce residual diagnostic plots verifying assumptions.", check: { type: "file", glob: ["src/models/evaluate.py", "notebooks/*.ipynb"] } },
    { id: "report-automation", text: "Generate parameterized HTML/PDF analytical reports using Jinja2 templates containing embedded plot outputs.", check: { type: "file", glob: ["templates/**/*.html", "reports/*.html"] } },
    { id: "cli-pipeline", text: "Expose an executable Python script pipeline to ingest raw data, execute predictions, and write outputs with configurable arguments.", check: { type: "file", glob: ["main.py", "run.py", "src/cli.py"] } },
    { id: "tests", text: "Write unit tests verifying data transformation outputs, feature shape consistency, and evaluation metric functions.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] } },
    { id: "readme", text: "Write a comprehensive README detailing environment setup, mathematical formulations, execution steps, and key findings.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Set up GitHub Actions to execute linting checks and the unit test suite automatically.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "statistical-eda", name: "EDA & Feature Engineering", weight: 20, layerId: "ds-data-scientist-4", description: "Evaluates handling of leakage, temporal splitting, feature encoding, and distribution transformations." },
    { id: "unsupervised-learning", name: "Clustering & Segmentation", weight: 15, layerId: "ds-data-scientist-5", description: "Checks metric validation (silhouette score), PCA interpretation, and cluster stability analysis." },
    { id: "forecasting-modeling", name: "Time Series & Regression Modeling", weight: 25, layerId: "ds-data-scientist-8", description: "Assesses stationarity checks, model selection rigor, lag feature creation, and benchmark comparisons." },
    { id: "evaluation-rigor", name: "Model Evaluation & Diagnostics", weight: 15, layerId: "ds-data-scientist-6", description: "Evaluates metrics choices (RMSE/MAPE), cross-validation strategy, and residual normality/autocorrelation analysis." },
    { id: "pipeline-automation", name: "Reporting & Pipeline Automation", weight: 15, layerId: "ds-data-scientist-9", description: "Measures code modularity, Jinja2 template integration, automated report building, and CLI design." },
    { id: "reproducibility", name: "Code Quality & Documentation", weight: 10, layerId: "ds-data-scientist-1", description: "Assesses repository structure, unit test isolation, CI workflow implementation, and README clarity." },
  ],

  twistPool: [
    { id: "weather-exogenous-twist", text: "Incorporate synthetic temperature and humidity exogenous covariates into the time-series forecasting model to measure accuracy lift." },
    { id: "outlier-rejection-twist", text: "Implement an automated Isolation Forest pipeline step to identify and handle grid blackout anomaly periods prior to model training." },
    { id: "quantized-confidence-twist", text: "Calculate quantile regression loss to produce 90% prediction interval bands rather than single point predictions." },
    { id: "drift-detection-twist", text: "Implement a Kolmogorov-Smirnov statistical test module that flags severe feature drift between training data and new inference batches." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Data Analyst track (data-analyst), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
    { id: "raw-data-cleaning", text: "Process raw customer behavior CSVs in Python using Pandas, handling duplicate records, null values, and parsing timestamp strings.", check: { type: "file", glob: ["src/**/*.py", "scripts/**/*.py", "notebooks/*.ipynb"] } },
    { id: "sql-star-schema", text: "Transform cleaned datasets into a star schema containing explicit fact and dimension tables.", check: { type: "file", glob: ["models/**/*.sql", "sql/**/*.sql"] } },
    { id: "window-kpis", text: "Calculate cohort retention rates, monthly active users (MAU), and rolling 30-day customer lifetime value using SQL window functions.", check: { type: "file", glob: ["sql/**/*.sql", "queries/**/*.sql"] } },
    { id: "statistical-tests", text: "Conduct two-sample t-tests and chi-square tests in Python to validate whether promotional discounts significantly alter churn rate.", check: { type: "file", glob: ["src/**/*.py", "notebooks/*.ipynb"] } },
    { id: "viz-dashboard", text: "Create an interactive dashboard or exported report suite displaying funnel progression, churn drivers, and revenue trends.", check: { type: "file", glob: ["dashboards/**/*", "reports/**/*.html", "notebooks/*.ipynb"] } },
    { id: "business-report", text: "Write an executive summary report translating statistical findings into concrete business actions to improve customer retention.", check: { type: "file", glob: "reports/executive_summary.md" } },
    { id: "dbt-data-tests", text: "Implement data quality assertions verifying column non-nullability and key uniqueness on fact tables.", check: { type: "file", glob: ["tests/**/*.sql", "models/schema.yml", "schema.yml"] } },
    { id: "tests", text: "Automate Python unit tests checking cleaning edge cases like missing dates and invalid currency symbols.", check: { type: "file", glob: ["tests/test_*.py", "**/test_*.py"] } },
    { id: "readme", text: "Document dataset schemas, instructions to run SQL scripts, dependencies, and dashboard setup.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "Configure a GitHub Actions workflow to run Python linting and unit tests on push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "sql-modeling", name: "SQL & Data Modeling", weight: 25, layerId: "data-analyst-9", description: "Evaluates star schema design, CTE usage, window function logic, and relational integrity." },
    { id: "data-wrangling", name: "Data Cleaning & Wrangling", weight: 20, layerId: "data-analyst-4", description: "Assesses robustness of null handling, string normalization, and date parsing pipelines in Python." },
    { id: "business-metrics", name: "Business Metrics & Insights", weight: 20, layerId: "data-analyst-8", description: "Measures accuracy of calculated cohort retention, MRR, churn rate, and executive recommendations." },
    { id: "statistical-rigor", name: "Statistical Analysis", weight: 15, layerId: "data-analyst-7", description: "Checks appropriateness and correct execution of hypothesis tests and correlation analyses." },
    { id: "visualizations", name: "Data Visualization & Storytelling", weight: 10, layerId: "data-analyst-5", description: "Evaluates visual clarity, design choices, pre-attentive attributes, and interactive layout." },
    { id: "code-quality-ops", name: "Testing & Documentation", weight: 10, layerId: "data-analyst-10", description: "Checks CI automation, test coverage, repository structure, and README instructions." },
  ],

  twistPool: [
    { id: "refund-cohort-twist", text: "Extend the pipeline to calculate a 'Refund Impact Index' measuring how partial vs full refunds alter 60-day cohort retention." },
    { id: "anomaly-detection-twist", text: "Add a SQL-based Z-score calculation to detect daily transaction volume anomalies and flag suspect periods in the dashboard." },
    { id: "channel-attribution-twist", text: "Implement first-touch and last-touch attribution models side-by-side in SQL to contrast marketing acquisition ROI." },
    { id: "clv-decay-twist", text: "Incorporate exponential decay weighting into the rolling LTV model to heavily weight recent user activity." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};