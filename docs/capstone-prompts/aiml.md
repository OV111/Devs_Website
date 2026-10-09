You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (10 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/aiml/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "aiml" instead):

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
1. trackId = the track id exactly as given below. categoryId = "aiml". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
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

### ml-engineer — ML Engineer
  - ml-1 | Python & Math Foundations | topics: Python — functions, classes, list comprehensions, generators; NumPy — arrays, broadcasting, vectorized operations; Linear algebra — vectors, matrices, dot product, eigenvalues; Calculus — derivatives, gradients, chain rule
  - ml-2 | Data Manipulation & EDA | topics: Pandas — DataFrames, Series, indexing, groupby, merge; Data cleaning — missing values, duplicates, outliers; Feature engineering — encoding, scaling, binning; EDA — correlation matrices, distributions, pair plots
  - ml-3 | Classical Machine Learning | topics: Supervised learning — linear/logistic regression, decision trees, SVMs; Ensemble methods — Random Forest, Gradient Boosting, XGBoost; Model evaluation — accuracy, precision, recall, F1, ROC-AUC; Cross-validation — k-fold, stratified k-fold
  - ml-4 | Deep Learning with PyTorch | topics: Tensors — creation, operations, autograd; Neural network anatomy — layers, activations, loss functions; Training loop — forward pass, loss, backward pass, optimizer step; CNNs — conv layers, pooling, feature maps
  - ml-5 | NLP & Transformers | topics: Text preprocessing — tokenization, padding, special tokens; Word embeddings — Word2Vec, GloVe, contextual embeddings; Transformer architecture — attention, positional encoding; HuggingFace Transformers — AutoModel, AutoTokenizer, pipeline
  - ml-6 | MLOps & Experiment Tracking | topics: MLflow — tracking, model registry, projects, artifacts; Weights & Biases — experiment tracking, hyperparameter sweeps; DVC — data versioning, pipelines, remote storage; Feature stores — Feast basics
  - ml-7 | Model Deployment | topics: Model serving with FastAPI — async inference endpoint; Model optimization — ONNX export, quantization, pruning; TorchServe or Triton Inference Server; Batch inference vs real-time inference
  - ml-8 | LLMs & Generative AI | topics: LLM APIs — OpenAI, Anthropic, Groq, HuggingFace Inference; Prompt engineering — system prompts, few-shot, chain-of-thought; LangChain — chains, agents, tools, memory; RAG — embeddings, vector databases (Chroma, Qdrant, Pinecone)
  - ml-engineer-9 | Large-Scale Distributed Training | topics: Data parallelism with DistributedDataParallel and FSDP; Model parallelism and pipeline parallelism strategies; ZeRO stages 1-3 with DeepSpeed; Mixed-precision training with bfloat16 and fp16
  - ml-engineer-10 | Production ML Systems and Responsible AI | topics: Feature store design and online/offline serving with Feast; Model governance and approval workflows in MLflow; Automated retraining pipelines triggered by data drift; Data quality checks with Great Expectations in pipelines

### data-scientist — Data Scientist
  - data-scientist-1 | Python for Data Science | topics: Python syntax, types & functions; Lists, dicts & comprehensions; Working in Jupyter notebooks; Virtual environments & pip
  - data-scientist-2 | NumPy & Pandas | topics: NumPy arrays & broadcasting; Vectorized operations; Pandas Series & DataFrames; Indexing, filtering & selection
  - data-scientist-3 | Data Cleaning & Wrangling | topics: Handling missing values; Outlier detection & treatment; Type conversion & parsing dates; Deduplication & normalization
  - data-scientist-4 | EDA & Visualization | topics: Exploratory data analysis workflow; Matplotlib fundamentals; Statistical plots with Seaborn; Distributions & correlations
  - data-scientist-5 | Statistics & Probability | topics: Descriptive statistics; Probability distributions; Sampling & the central limit theorem; Hypothesis testing & p-values
  - data-scientist-6 | SQL & Data Sources | topics: SQL SELECT, JOIN & GROUP BY; Window functions for analytics; Connecting Python to databases; Pulling data from REST APIs
  - data-scientist-7 | Machine Learning Foundations | topics: Supervised vs unsupervised learning; Linear & logistic regression; Decision trees & random forests; Train/test split & cross-validation
  - data-scientist-8 | Model Evaluation & Features | topics: Classification & regression metrics; Confusion matrix, ROC & AUC; Feature engineering & selection; Handling imbalanced data
  - data-scientist-9 | Communicating Insights | topics: Data storytelling; Building clear notebooks & reports; Dashboards (Streamlit / Tableau); Choosing metrics that matter
  - data-scientist-10 | Capstone & Deployment | topics: Framing a data science problem; End-to-end project workflow; Tracking experiments with MLflow; Serving a model with FastAPI

### ai-developer — AI Developer
  - ai-developer-1 | Python & APIs for AI | topics: Python essentials for AI; Async Python & httpx; Working with JSON; Environment & secrets management
  - ai-developer-2 | Working with LLM APIs | topics: Chat completions & roles; System, user & assistant messages; Temperature & sampling params; Streaming responses
  - ai-developer-3 | Prompt Engineering for Developers | topics: Zero-shot & few-shot prompting; Chain-of-thought reasoning; Structured outputs & JSON mode; Function/tool calling
  - ai-developer-4 | LangChain Fundamentals | topics: LangChain core concepts; Models, prompts & output parsers; Chains & the LCEL; Conversation memory
  - ai-developer-5 | Retrieval-Augmented Generation | topics: Why RAG — grounding & freshness; Document chunking strategies; Embeddings & similarity search; Building the retrieval step
  - ai-developer-6 | Embeddings & Vector Stores | topics: How embeddings work; Vector databases (Pinecone, Chroma, pgvector); Similarity metrics; Indexing & metadata filtering
  - ai-developer-7 | Building AI Agents & Tools | topics: Tool/function calling; The ReAct pattern; Agent loops & planning; Connecting external APIs & databases
  - ai-developer-8 | Serving AI with FastAPI | topics: FastAPI fundamentals; Request validation with Pydantic; Streaming responses (SSE); WebSockets for chat
  - ai-developer-9 | Evaluation, Guardrails & Cost | topics: Evaluating LLM outputs; LLM-as-judge & test sets; Guardrails & content moderation; Prompt injection defense
  - ai-developer-10 | Deployment & Observability | topics: Dockerizing AI services; Tracing with LangSmith / OpenTelemetry; Logging prompts & responses; Cost & latency monitoring

### nlp-engineer — NLP Engineer
  - nlp-engineer-1 | NLP Foundations | topics: What NLP is & its applications; Tokens, types & vocabularies; Morphology & syntax basics; Common NLP tasks
  - nlp-engineer-2 | Text Preprocessing | topics: Tokenization approaches; Stemming & lemmatization; Stopwords & normalization; Regular expressions
  - nlp-engineer-3 | Classical NLP | topics: Bag-of-words & TF-IDF; POS tagging & parsing; Named entity recognition with spaCy; Text classification (Naive Bayes, SVM)
  - nlp-engineer-4 | Word Embeddings | topics: From one-hot to dense vectors; Word2Vec & GloVe; Cosine similarity & analogies; Contextual vs static embeddings
  - nlp-engineer-5 | Deep Learning for NLP | topics: Neural network basics; PyTorch tensors & autograd; RNNs, LSTMs & GRUs; Sequence modeling
  - nlp-engineer-6 | Transformers & Attention | topics: The attention mechanism; Self-attention & multi-head attention; Transformer architecture; Encoder vs decoder models
  - nlp-engineer-7 | Hugging Face Transformers | topics: The Transformers library; Pipelines for common tasks; Tokenizers & model classes; The Datasets library
  - nlp-engineer-8 | Fine-Tuning & Transfer Learning | topics: Transfer learning concepts; Fine-tuning with the Trainer API; Parameter-efficient tuning (LoRA); Data preparation & labeling
  - nlp-engineer-9 | NLP Tasks in Production | topics: Named entity recognition systems; Question answering; Summarization (extractive & abstractive); Semantic search & retrieval
  - nlp-engineer-10 | Deployment & MLOps for NLP | topics: Model optimization & quantization; Exporting with ONNX; Serving with FastAPI / Triton; Batching & latency tuning

### cv-engineer — Computer Vision Engineer
  - cv-engineer-1 | Image Processing Foundations | topics: Images as arrays of pixels; Color spaces — RGB, HSV, grayscale; Image I/O with NumPy; Histograms & thresholding
  - cv-engineer-2 | OpenCV Essentials | topics: Filtering & convolution; Edge detection (Canny); Morphological operations; Contours & shape analysis
  - cv-engineer-3 | Feature Detection & Classical CV | topics: Corner & keypoint detection; SIFT / ORB descriptors; Feature matching; Image alignment & stitching
  - cv-engineer-4 | Deep Learning with PyTorch | topics: Tensors & autograd; Building models with nn.Module; Datasets & DataLoaders; Training & validation loops
  - cv-engineer-5 | Convolutional Neural Networks | topics: Convolution & pooling layers; Feature maps & receptive fields; Classic architectures (ResNet, VGG); Batch norm & regularization
  - cv-engineer-6 | Image Classification | topics: Building a classification pipeline; Data augmentation; Handling class imbalance; Metrics & confusion matrices
  - cv-engineer-7 | Object Detection | topics: Detection vs classification; Bounding boxes & IoU; Anchors & non-max suppression; The YOLO family
  - cv-engineer-8 | Segmentation & Advanced CV | topics: Semantic vs instance segmentation; U-Net & encoder-decoder models; Mask R-CNN; Segment Anything (SAM)
  - cv-engineer-9 | Datasets, Augmentation & Training | topics: Collecting & labeling images; Annotation tools & formats; Advanced augmentation; Experiment tracking
  - cv-engineer-10 | Deployment & Edge Inference | topics: Model export (ONNX); Optimization & quantization; TensorRT & acceleration; Real-time video inference

### llm-engineer — LLM Engineer
  - llm-engineer-1 | LLM Foundations | topics: How LLMs are trained & predict tokens; Tokenization & context windows; Capabilities & limitations; Open vs closed models
  - llm-engineer-2 | Prompting & Context | topics: System, user & assistant roles; Few-shot & in-context learning; Chain-of-thought prompting; Structured outputs
  - llm-engineer-3 | Embeddings & Vector Databases | topics: Embedding models; Vector databases (Chroma, pgvector, Pinecone); Chunking strategies; Similarity & hybrid search
  - llm-engineer-4 | RAG Architecture | topics: RAG pipeline architecture; Retrieval strategies & re-ranking; Context assembly & prompting; Citations & source attribution
  - llm-engineer-5 | LangChain & LlamaIndex | topics: LangChain core & LCEL; LlamaIndex data framework; Loaders, indices & query engines; Memory & state
  - llm-engineer-6 | Agents & Tool Use | topics: Tool/function calling; ReAct & planning loops; LangGraph state machines; Multi-agent systems
  - llm-engineer-7 | Fine-Tuning & PEFT | topics: When to fine-tune vs RAG; Instruction & preference data; LoRA & QLoRA; Training with PEFT & TRL
  - llm-engineer-8 | Evaluation & Observability | topics: Evaluation strategies & test sets; LLM-as-judge; RAG evaluation (RAGAS); Tracing & logging
  - llm-engineer-9 | Optimization, Caching & Cost | topics: Prompt & response caching; Semantic caching; Streaming & latency optimization; Model routing & fallbacks
  - llm-engineer-10 | Production Deployment & Safety | topics: Serving open models (vLLM, TGI); Guardrails & moderation; Prompt injection defense; Monitoring quality & cost

### mlops — MLOps Engineer
  - mlops-1 | MLOps Foundations | topics: The ML lifecycle; Why ML projects fail in production; MLOps maturity levels; Roles & responsibilities
  - mlops-2 | ML Lifecycle & Reproducibility | topics: Versioning code with Git; Data versioning with DVC; Reproducible environments; Configuration management
  - mlops-3 | Experiment Tracking | topics: Logging params, metrics & artifacts; MLflow tracking server; Comparing runs; The model registry
  - mlops-4 | Data & Feature Pipelines | topics: Building data pipelines; Data validation (Great Expectations); Feature stores (Feast); Training/serving skew
  - mlops-5 | Model Packaging & Containers | topics: Serializing models; Dockerizing model services; Packaging with BentoML; Dependency & environment pinning
  - mlops-6 | Orchestration | topics: Workflow orchestration concepts; Airflow DAGs; Kubeflow Pipelines; Scheduling & retries
  - mlops-7 | CI/CD for ML | topics: Testing ML code & data; Model validation gates; CI/CD with GitHub Actions; Continuous training (CT)
  - mlops-8 | Model Serving & Deployment | topics: Online vs batch inference; REST & gRPC serving; KServe / Seldon on Kubernetes; Autoscaling & load balancing
  - mlops-9 | Monitoring & Drift Detection | topics: Monitoring metrics & predictions; Data & concept drift detection; Performance monitoring without labels; Alerting & dashboards
  - mlops-10 | Scaling & Governance | topics: Scaling training & inference; GPU management & cost control; Model governance & lineage; Reproducibility & audit trails

### data-engineer — Data Engineer
  - data-engineer-1 | Data Engineering Foundations | topics: What data engineering is; OLTP vs OLAP; Batch vs streaming; The modern data stack
  - data-engineer-2 | SQL & Data Modeling | topics: Advanced SQL & window functions; Dimensional modeling (star schema); Normalization vs denormalization; Slowly changing dimensions
  - data-engineer-3 | Python for Data Engineering | topics: Python for ETL; Working with Pandas & Polars; Connecting to databases & APIs; Handling large files & memory
  - data-engineer-4 | Batch Processing with Spark | topics: Distributed computing concepts; Spark architecture & RDDs; DataFrames & Spark SQL; Transformations & actions
  - data-engineer-5 | Streaming with Kafka | topics: Kafka architecture — topics & partitions; Producers & consumers; Consumer groups & offsets; Stream processing (Kafka Streams / Flink)
  - data-engineer-6 | Orchestration with Airflow | topics: DAGs, tasks & operators; Scheduling & backfills; Dependencies & sensors; Retries & SLAs
  - data-engineer-7 | Data Warehousing & dbt | topics: Cloud warehouses (Snowflake, BigQuery); ELT vs ETL; dbt models & materializations; Tests & documentation
  - data-engineer-8 | Data Lakes & Lakehouse | topics: Object storage & data lakes; File formats & partitioning; Table formats — Delta, Iceberg, Hudi; The lakehouse architecture
  - data-engineer-9 | Data Quality & Governance | topics: Data quality testing; Great Expectations / dbt tests; Data lineage & catalogs; Observability for data
  - data-engineer-10 | Deployment & Scaling | topics: Dockerizing data jobs; Infrastructure as code (Terraform); CI/CD for data pipelines; Cost optimization

### rl-engineer — Reinforcement Learning Engineer
  - rl-engineer-1 | RL Foundations | topics: Agents, environments & rewards; The RL problem vs supervised learning; Exploration vs exploitation; Episodes, returns & discounting
  - rl-engineer-2 | Markov Decision Processes | topics: States, actions & transitions; Policies & value functions; The Bellman equations; Optimal policies
  - rl-engineer-3 | Dynamic Programming & Monte Carlo | topics: Policy evaluation & improvement; Policy & value iteration; Monte Carlo prediction; Monte Carlo control
  - rl-engineer-4 | Temporal-Difference & Q-Learning | topics: TD(0) prediction; SARSA (on-policy); Q-learning (off-policy); Epsilon-greedy exploration
  - rl-engineer-5 | Deep Q-Networks | topics: Function approximation; The DQN algorithm; Experience replay; Target networks
  - rl-engineer-6 | Policy Gradient Methods | topics: Policy parameterization; The policy gradient theorem; REINFORCE; Baselines & variance reduction
  - rl-engineer-7 | Actor-Critic & PPO | topics: Actor-critic architecture; Advantage estimation (GAE); A2C & A3C; Proximal Policy Optimization (PPO)
  - rl-engineer-8 | Environments with Gymnasium | topics: The Gymnasium API; Observation & action spaces; Environment wrappers; Vectorized environments
  - rl-engineer-9 | Scaling RL with Ray RLlib | topics: Ray & distributed computing; RLlib algorithms & config; Distributed rollouts; Hyperparameter tuning with Tune
  - rl-engineer-10 | Applications & Deployment | topics: Real-world RL applications; Offline RL; Sim-to-real transfer; Serving trained policies

### prompt-engineer — Prompt Engineer
  - prompt-engineer-1 | LLM & Prompting Foundations | topics: How LLMs generate text; Tokens & context windows; Temperature & sampling; Model capabilities & limits
  - prompt-engineer-2 | Core Prompting Techniques | topics: Clear instructions & specificity; Zero-shot vs few-shot; Role & persona prompting; Delimiters & formatting
  - prompt-engineer-3 | Advanced Prompting | topics: Chain-of-thought prompting; Self-consistency; ReAct (reason + act); Tree-of-thought
  - prompt-engineer-4 | Structured Outputs & Function Calling | topics: Requesting structured output; JSON mode & schemas; Function/tool calling; Validating & repairing output
  - prompt-engineer-5 | RAG for Grounded Answers | topics: Why grounding matters; Prompting with retrieved context; Context formatting & ordering; Citations & attribution
  - prompt-engineer-6 | Prompt Chaining & Workflows | topics: Decomposing tasks into steps; Prompt chaining patterns; LangChain LCEL; Routing & conditional flows
  - prompt-engineer-7 | Evaluation & Testing Prompts | topics: Building evaluation datasets; Manual vs automated evaluation; LLM-as-judge; Regression testing prompts
  - prompt-engineer-8 | Guardrails & Safety | topics: Prompt injection & jailbreaks; Input/output guardrails; Content moderation; System prompt hardening
  - prompt-engineer-9 | Optimization & Cost Control | topics: Token counting & budgeting; Prompt compression; Caching responses; Choosing the right model per task
  - prompt-engineer-10 | Productionizing Prompt Systems | topics: Prompt versioning & management; Prompt templates in code; Monitoring quality in production; Logging & feedback loops
