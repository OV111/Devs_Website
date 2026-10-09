You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (8 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/datascience/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "datascience" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "datascience". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### data-analyst — Data Analyst
  - data-analyst-1 | Spreadsheet and Data Fundamentals | topics: Cell formulas and functions; Pivot tables; Data types and formats; Descriptive statistics
  - data-analyst-2 | SQL for Data Analysis | topics: SELECT, WHERE, GROUP BY; JOINs (INNER, LEFT, RIGHT); Aggregate functions; Subqueries and CTEs
  - data-analyst-3 | Python for Data Analysis | topics: DataFrames and Series; Reading CSV, JSON, Excel; Filtering and indexing; GroupBy and aggregation
  - data-analyst-4 | Data Cleaning and Wrangling | topics: Duplicate detection and removal; Outlier identification; String normalization; Date parsing and formatting
  - data-analyst-5 | Data Visualization with Python | topics: Line, bar, and scatter charts; Histograms and box plots; Heatmaps and correlation plots; Interactive charts with Plotly
  - data-analyst-6 | Tableau for Business Dashboards | topics: Connecting data sources; Calculated fields and parameters; Filters and actions; Dashboard layout and design
  - data-analyst-7 | Statistical Analysis and Hypothesis Testing | topics: Probability distributions; t-tests and chi-square tests; ANOVA; Correlation and regression basics
  - data-analyst-8 | Business Metrics and KPI Reporting | topics: KPI definition frameworks; Funnel and cohort analysis; Churn and retention metrics; Revenue and growth metrics
  - data-analyst-9 | Advanced SQL and Data Modeling | topics: Star and snowflake schemas; Fact and dimension tables; Advanced window functions; dbt models and tests
  - data-analyst-10 | End-to-End Analytics Project | topics: Project scoping and requirements; Data pipeline design; EDA and hypothesis formulation; Dashboard production

### ds-data-scientist — Data Scientist
  - ds-data-scientist-1 | Python and Data Science Environment | topics: Anaconda and virtual environments; Jupyter notebook workflow; NumPy arrays and operations; Broadcasting and vectorization
  - ds-data-scientist-2 | Exploratory Data Analysis | topics: Summary statistics; Distribution analysis; Correlation matrices; Pair plots
  - ds-data-scientist-3 | Statistics for Data Science | topics: Probability and Bayes theorem; Common distributions; Central limit theorem; Confidence intervals
  - ds-data-scientist-4 | Data Cleaning and Feature Engineering | topics: Imputation strategies; Encoding categorical variables; Feature scaling; Date feature extraction
  - ds-data-scientist-5 | Descriptive Modeling and Segmentation | topics: K-Means clustering; Hierarchical clustering; Silhouette scores; PCA for visualization
  - ds-data-scientist-6 | Regression Analysis for Forecasting | topics: Linear regression; Multiple regression; Polynomial features; Residual analysis
  - ds-data-scientist-7 | Classification for Analytical Reporting | topics: Logistic regression; Decision trees; Random forests; Precision, recall, F1
  - ds-data-scientist-8 | Time Series Analysis | topics: Resampling and rolling windows; Trend and seasonality decomposition; Autocorrelation; ARIMA modeling
  - ds-data-scientist-9 | Reporting Pipelines and Automation | topics: Parameterized Jupyter notebooks; Scheduled script execution; Jinja2 report templates; HTML and PDF report output
  - ds-data-scientist-10 | Capstone - Analytics Reporting Project | topics: Problem scoping; End-to-end EDA; Model selection and evaluation; Insight narrative writing

### ds-data-engineer — Data Engineer
  - ds-data-engineer-1 | Data Engineering Fundamentals | topics: OLTP vs OLAP; ETL vs ELT patterns; Data warehouse concepts; Batch vs streaming
  - ds-data-engineer-2 | SQL and Dimensional Modeling | topics: Star and snowflake schemas; Fact and dimension tables; Slowly changing dimensions; Surrogate keys
  - ds-data-engineer-3 | Python for Data Pipelines | topics: Reading flat files and APIs; Pandas transformations; SQLAlchemy ORM basics; Bulk inserts and upserts
  - ds-data-engineer-4 | Cloud Data Warehouses | topics: BigQuery architecture and pricing; Snowflake virtual warehouses; Loading data from cloud storage; Partitioning and clustering
  - ds-data-engineer-5 | dbt for Data Transformation | topics: dbt project structure; Models and ref(); Sources and staging; Tests and documentation
  - ds-data-engineer-6 | Workflow Orchestration with Airflow | topics: DAG definition and structure; Operators (Python, Bash, SQL); Task dependencies; Scheduling with cron
  - ds-data-engineer-7 | Spark for Batch Processing | topics: Spark architecture; PySpark DataFrames; Transformations and actions; Reading and writing Parquet
  - ds-data-engineer-8 | Data Quality and Testing | topics: dbt schema tests; dbt singular tests; Great Expectations suites; Row count and freshness checks
  - ds-data-engineer-9 | Incremental Loads and CDC | topics: Incremental dbt models; High-watermark patterns; Change data capture concepts; Fivetran and data loaders
  - ds-data-engineer-10 | Capstone - Data Warehouse Pipeline | topics: End-to-end pipeline design; Ingestion with Spark or Python; dbt staging and mart layers; Data quality gates

### bi-developer — BI Developer
  - bi-developer-1 | BI Fundamentals and Data Concepts | topics: OLAP vs OLTP; Dimensional modeling basics; Star schema overview; Measures vs dimensions
  - bi-developer-2 | SQL for BI Reporting | topics: Aggregate functions; Window functions; CTEs and subqueries; Date functions
  - bi-developer-3 | Power BI Desktop Essentials | topics: Connecting data sources; Power Query transformations; Data model and relationships; Building visuals
  - bi-developer-4 | DAX Fundamentals | topics: Measures vs calculated columns; SUM, AVERAGE, COUNT; Filter context; CALCULATE and filters
  - bi-developer-5 | Advanced DAX and Data Modeling | topics: ALLSELECTED and context transition; Many-to-many relationships; Dynamic segmentation; Pareto and ABC analysis
  - bi-developer-6 | Tableau for BI Dashboards | topics: Live vs extract connections; LOD expressions; Table calculations; Set actions and parameter actions
  - bi-developer-7 | BI Publishing and Governance | topics: Power BI Service workspaces; Dataset refresh scheduling; Row-level security; Apps and distribution
  - bi-developer-8 | Data Storytelling and Dashboard Design | topics: Pre-attentive attributes; Chart selection guide; Color accessibility; Dashboard layout patterns
  - bi-developer-9 | Performance Tuning and Large Data | topics: DAX Studio query analysis; VertiPaq model inspection; Query folding in Power Query; Aggregation tables
  - bi-developer-10 | Capstone - Enterprise BI Solution | topics: Requirements gathering; Data model design; Semantic layer build; Multi-page dashboard development

### ml-analyst — ML Analyst
  - ml-analyst-1 | Python and Analytics Environment Setup | topics: Virtual environments; Jupyter notebooks; Python data types and control flow; Functions and modules
  - ml-analyst-2 | Data Manipulation with Pandas | topics: DataFrame operations; Merging and reshaping; GroupBy and aggregation; Apply and map
  - ml-analyst-3 | Exploratory Data Analysis and Visualization | topics: Univariate and bivariate analysis; Correlation analysis; Pair plots; Box plots and outliers
  - ml-analyst-4 | Feature Engineering and Preprocessing | topics: Label and one-hot encoding; StandardScaler and MinMaxScaler; Imputation strategies; Feature selection with variance and correlation
  - ml-analyst-5 | Supervised Learning Fundamentals | topics: Linear and logistic regression; Decision trees; Cross-validation; Bias-variance tradeoff
  - ml-analyst-6 | Ensemble Methods and Model Selection | topics: Random forests; Gradient boosting and XGBoost; GridSearchCV and RandomizedSearchCV; Learning curves
  - ml-analyst-7 | Model Interpretability and Explainability | topics: SHAP values and summary plots; LIME explanations; Partial dependence plots; Feature importance comparison
  - ml-analyst-8 | Unsupervised Analysis and Clustering | topics: K-Means and DBSCAN; Hierarchical clustering; Silhouette and elbow analysis; PCA for visualization
  - ml-analyst-9 | Regression Analysis and Forecasting | topics: Polynomial and regularized regression; ARIMA time series; Prophet forecasting; Forecast evaluation (MAPE, RMSE)
  - ml-analyst-10 | Capstone - ML Analysis Project | topics: Problem framing; Full ML pipeline; Model selection and tuning; SHAP explanations

### data-architect — Data Architect
  - data-architect-1 | Data Architecture Foundations | topics: Data architecture patterns; Operational vs analytical systems; Data platform layers; Architecture diagrams with draw.io
  - data-architect-2 | Relational Database Design and SQL | topics: 3NF normalization; Primary and foreign keys; Index types and usage; Advanced joins
  - data-architect-3 | Dimensional Modeling and Data Warehousing | topics: Star schema design; Slowly changing dimensions; Conformed dimensions; Factless fact tables
  - data-architect-4 | Cloud Data Platforms - Snowflake and BigQuery | topics: Snowflake architecture (VW, storage); BigQuery slots and reservations; Data loading patterns; Partitioning and clustering
  - data-architect-5 | Data Transformation with dbt | topics: Multi-project dbt design; Package management; Materializations at scale; dbt docs and lineage
  - data-architect-6 | Data Governance and Metadata Management | topics: Data catalog design; Business glossary; Data lineage tracking; Data classification (PII, etc.)
  - data-architect-7 | Data Security and Compliance | topics: Column masking policies; Row access policies; Role-based access control; Dynamic data masking
  - data-architect-8 | Data Mesh and Modern Architecture Patterns | topics: Data mesh principles; Data products; Federated governance; Data lakehouse architecture
  - data-architect-9 | Performance, Scalability, and Cost Optimization | topics: Query profiling and execution plans; Materialized views and caching; Clustering optimization; Snowflake query acceleration
  - data-architect-10 | Capstone - Enterprise Data Platform Design | topics: Architecture decision records; Platform design documentation; End-to-end data flow design; Governance and security plan

### analytics-engineer — Analytics Engineer
  - analytics-engineer-1 | Analytics Engineering Role and SQL Foundations | topics: Analytics engineering role overview; Modern data stack context; SQL SELECT and filtering; Aggregations and GROUP BY
  - analytics-engineer-2 | dbt Core Fundamentals | topics: dbt project structure; Sources and staging models; ref() and lineage; Materializations (table, view, incremental)
  - analytics-engineer-3 | Advanced SQL for Analytics | topics: Window functions (LAG, LEAD, RANK); Date spines and series generation; Pivoting and unpivoting; Sessionization logic
  - analytics-engineer-4 | dbt Testing, Documentation, and Data Contracts | topics: Schema tests (unique, not-null, accepted-values); Singular SQL tests; Custom generic tests; dbt docs generate
  - analytics-engineer-5 | Looker and LookML Fundamentals | topics: LookML views and fields; Dimensions and measures; Explores and joins; Derived tables in LookML
  - analytics-engineer-6 | Incremental Models and Performance | topics: Incremental model strategies (append, merge, delete-insert); Unique keys and merge logic; Backfill patterns; Partition pruning alignment
  - analytics-engineer-7 | Airflow for Analytics Orchestration | topics: Airflow DAG structure; DbtRunOperator patterns; Task dependencies; Retry and alerting
  - analytics-engineer-8 | Semantic Layer and Metric Definitions | topics: dbt metrics and MetricFlow; Measure and dimension grain; Time grain configurations; Metric filtering
  - analytics-engineer-9 | CI/CD and Analytics Engineering Best Practices | topics: Git branching for analytics; dbt Cloud CI jobs; GitHub Actions for dbt; Slim CI with state comparison
  - analytics-engineer-10 | Capstone - Production Analytics Platform | topics: End-to-end dbt project; Semantic layer metrics; Looker dashboard delivery; Orchestration setup

### statistician — Statistician
  - statistician-1 | Statistical Foundations and R Environment | topics: R syntax and data types; Vectors, lists, and data frames; Probability fundamentals; Descriptive statistics
  - statistician-2 | Probability Distributions and Sampling | topics: Normal, binomial, Poisson distributions; Sampling distributions; Central limit theorem; Law of large numbers
  - statistician-3 | Inferential Statistics and Hypothesis Testing | topics: Null and alternative hypotheses; t-tests (one-sample, two-sample, paired); Chi-square tests; ANOVA
  - statistician-4 | Regression Analysis | topics: Simple linear regression; Multiple regression; Assumption checking (LINE); Residual diagnostics
  - statistician-5 | Experimental Design and A/B Testing | topics: Randomization and control; Sample size and power calculation; Factorial designs; A/B and A/A tests
  - statistician-6 | Bayesian Statistics | topics: Bayes theorem; Prior, likelihood, and posterior; Conjugate priors; MCMC fundamentals
  - statistician-7 | Multivariate Statistics | topics: Principal component analysis; Factor analysis; Cluster analysis; MANOVA
  - statistician-8 | Time Series and Forecasting | topics: Decomposition (STL, classical); Stationarity and differencing; ACF and PACF; ARIMA identification and fitting
  - statistician-9 | Survival Analysis and Specialized Methods | topics: Kaplan-Meier estimator; Log-rank test; Cox proportional hazards; GLMs (logistic, Poisson, negative binomial)
  - statistician-10 | Capstone - Statistical Consulting Project | topics: Research question formulation; Study design review; Full statistical analysis; Assumption validation
