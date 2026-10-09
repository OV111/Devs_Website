/\*\*

- Capstone brief — ML Engineer track (ml-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "ml-engineer",
categoryId: "aiml",
slug: "ml-engineer-churn-prediction-system",
version: 1,
status: "draft",
reviewed: false,
title: "Production Customer Churn Prediction and Inference Pipeline",
summary:
"Build an end-to-end Machine Learning pipeline that trains, logs, optimizes, and serves " +
"a customer churn prediction model. You will perform exploratory data analysis, train " +
"PyTorch and baseline models, log experiments with MLflow, export optimized ONNX artifacts, " +
"and serve real-time predictions via a production FastAPI service.",
stack: ["Python", "PyTorch", "FastAPI", "MLflow", "Docker", "GitHub Actions"],

requirements: [
{ id: "eda-cleaning", text: "Data preprocessing script cleans missing values, encodes categorical features, and saves processed datasets under data/ processed folder." },
{ id: "model-training", text: "PyTorch neural network training loop trains a classifier with validation tracking, early stopping, and saved model weights." },
{ id: "experiment-tracking", text: "MLflow logs model hyperparameters, metrics (F1 score, ROC-AUC), and saved artifacts during training runs." },
{ id: "onnx-export", text: "Trained PyTorch model is exported to ONNX format with quantization or optimization for efficient inference." },
{ id: "fastapi-service", text: "FastAPI inference endpoint exposes a POST /predict route accepting JSON payloads and returning prediction probabilities." },
{ id: "data-quality", text: "Includes automated data validation checks on incoming inference inputs using pydantic or Great Expectations." },
{ id: "tests", text: "Unit and integration tests verify model loading, tensor transformations, and API response structures.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README explains dataset setup, model training execution, local deployment instructions, and evaluation metrics.", check: CHECKS.readme },
{ id: "env-example", text: "Environment configuration is templated without committed credentials or hardcoded local paths.", check: CHECKS.envExample },
{ id: "docker", text: "A Dockerfile packages the FastAPI application and ONNX model runtime for single-container serving.", check: CHECKS.dockerfile },
{ id: "ci", text: "A CI workflow runs code linting and pytest tests on every repository push.", check: CHECKS.ci },
],

rubric: [
{ id: "correctness", name: "Model Accuracy & Logic", weight: 25, layerId: "ml-3", description: "Does the model train successfully, evaluate accurately on held-out data, and achieve acceptable baseline metrics?" },
{ id: "deep-learning", name: "PyTorch Implementation", weight: 20, layerId: "ml-4", description: "Clean neural network architecture, correct gradient zeroing, autograd usage, and loss optimization loops." },
{ id: "mlops", name: "Experiment Tracking & Export", weight: 15, layerId: "ml-6", description: "Proper integration of MLflow metrics tracking and correct ONNX artifact export." },
{ id: "deployment", name: "Inference API", weight: 15, layerId: "ml-7", description: "FastAPI application handles async requests smoothly with correct input validation and output schema." },
{ id: "tests", name: "Testing", weight: 15, layerId: "ml-7", description: "Pytest suite thoroughly covers data processing transforms, model prediction output shapes, and endpoint failures." },
{ id: "docs-ops", name: "Reproducibility & Containerization", weight: 10, layerId: "ml-engineer-10", description: "Docker setup runs out of the box and documentation provides reproducible execution steps." },
],

twistPool: [
{ id: "feature-store", text: "Integrate a local Feast feature store to retrieve customer demographic features at inference time based on customer_id." },
{ id: "drift-detection", text: "Add an automated drift detection routine using Evidently or Great Expectations that logs input parameter drift on prediction requests." },
{ id: "batch-inference", text: "Implement a secondary batch inference CLI script that processes bulk CSV files and outputs predictions with probability confidence scores." },
{ id: "model-fallback", text: "Implement a fallback mechanism in FastAPI that reverts to a baseline scikit-learn model if ONNX inference fails or times out." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — Data Scientist track (data-scientist), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

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
stack: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "MLflow", "GitHub Actions"],

requirements: [
{ id: "data-ingestion", text: "Extracts property dataset using SQL queries or external REST APIs and saves processed clean DataFrames." },
{ id: "eda-reporting", text: "Performs deep exploratory data analysis with statistical distributions, outlier treatments, and correlation heatmaps." },
{ id: "feature-engineering", text: "Engineers relevant domain features including categorical encoding, spatial aggregations, and scaling." },
{ id: "model-training", text: "Trains ensemble regression models (e.g. Random Forest, Gradient Boosting) using cross-validation to prevent leakage." },
{ id: "metrics-evaluation", text: "Evaluates models using MAE, RMSE, and R2 metrics, detailing feature importances and residual distributions." },
{ id: "experiment-tracking", text: "Logs model runs, hyperparameter sweeps, and evaluation metrics using MLflow." },
{ id: "interactive-dashboard", text: "Builds an interactive Streamlit application allowing users to explore market visual analytics and input custom property specs for valuation." },
{ id: "tests", text: "Pytest suite verifies data cleaning transformations, missing value imputations, and feature pipeline shapes.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README includes problem framing, data insights summary, reproduction instructions, and metrics commentary.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example with configuration variables for database endpoints or API keys.", check: CHECKS.envExample },
{ id: "ci", text: "CI workflow automates linting and test execution on code commits.", check: CHECKS.ci },
],

rubric: [
{ id: "eda-stats", name: "EDA & Statistical Rigor", weight: 20, layerId: "data-scientist-4", description: "Depth of exploratory analysis, distribution handling, correlation insights, and statistical validity." },
{ id: "feature-eng", name: "Feature Engineering & Data Pipeline", weight: 20, layerId: "data-scientist-3", description: "Robust handling of missing data, outliers, scaling, and leakage-free dataset construction." },
{ id: "modeling", name: "Machine Learning & Evaluation", weight: 20, layerId: "data-scientist-7", description: "Appropriate model choice, proper cross-validation, hyperparameter tuning, and clear performance trade-offs." },
{ id: "visualization", name: "Dashboard & Data Storytelling", weight: 15, layerId: "data-scientist-9", description: "Interactive Streamlit app provides intuitive user experience and presents clear business insights." },
{ id: "tests", name: "Code Quality & Testing", weight: 15, layerId: "data-scientist-10", description: "Automated unit tests validate data transformations and modeling pipelines reliably." },
{ id: "docs-ops", name: "Documentation & Reproducibility", weight: 10, layerId: "data-scientist-10", description: "Clear instructions enable full reproduction of experiments and dashboard execution." },
],

twistPool: [
{ id: "geospatial-viz", text: "Add an interactive Folium or Plotly map in Streamlit showing price heatmaps and spatial neighborhood clusters." },
{ id: "shap-explainability", text: "Integrate SHAP value plots into the dashboard to explain feature contribution for individual property valuations." },
{ id: "automated-drift", text: "Implement a data stability check script that compares incoming property listings against baseline training distributions." },
{ id: "fastapi-export", text: "Serve the trained valuation model via a separate FastAPI endpoint alongside the Streamlit dashboard." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — AI Developer track (ai-developer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "ai-developer",
categoryId: "aiml",
slug: "ai-developer-rag-agent-service",
version: 1,
status: "draft",
reviewed: false,
title: "Enterprise Knowledge Base RAG & Agent API",
summary:
"Build a production-grade backend service combining Retrieval-Augmented Generation (RAG) " +
"and autonomous tool-calling AI agents. You will ingest unstructured documentation, store vector " +
"embeddings, implement guardrails against prompt injection, stream responses over Server-Sent Events, " +
"and serve the AI capability through FastAPI.",
stack: ["Python", "FastAPI", "LangChain", "Chroma or pgvector", "Docker", "GitHub Actions"],

requirements: [
{ id: "doc-ingestion", text: "Ingestion pipeline parses markdown/PDF docs, chunks text into strategic sizes, and generates vector embeddings." },
{ id: "vector-store", text: "Embeddings are stored and queried in Chroma DB or pgvector with metadata filtering." },
{ id: "rag-pipeline", text: "RAG chain retrieves relevant context, formats prompts with strict grounding, and includes citations in responses." },
{ id: "agent-tools", text: "Implements an AI agent with ReAct capability using dynamic tools (e.g. system status query, internal database lookup)." },
{ id: "fastapi-streaming", text: "FastAPI application serves POST /chat with Server-Sent Events (SSE) streaming for real-time LLM outputs." },
{ id: "guardrails", text: "Implements prompt injection defense and structured output validation with Pydantic schemas." },
{ id: "evals-logging", text: "Includes a test suite evaluating output relevance using an LLM-as-judge pattern or similarity evaluation dataset." },
{ id: "tests", text: "Integration and unit tests verify chunking logic, vector store retrieval, tool execution, and API endpoints.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README details installation, API endpoint documentation, prompt architecture, and evaluation benchmarks.", check: CHECKS.readme },
{ id: "env-example", text: "Environment example template includes placeholders for LLM API keys and database configuration.", check: CHECKS.envExample },
{ id: "docker", text: "Docker Compose environment starts the FastAPI service and local vector database cleanly.", check: CHECKS.compose },
{ id: "ci", text: "GitHub Actions workflow runs linting, static type checks, and pytest on push.", check: CHECKS.ci },
],

rubric: [
{ id: "rag-architecture", name: "RAG & Vector Storage", weight: 25, layerId: "ai-developer-5", description: "Effective chunking, retrieval relevance, vector index setup, and accurate response grounding with citations." },
{ id: "agent-logic", name: "Agent & Tool Integration", weight: 20, layerId: "ai-developer-7", description: "Correct tool definitions, robust error handling during tool execution, and clear planning loops." },
{ id: "api-streaming", name: "FastAPI Implementation & Streaming", weight: 15, layerId: "ai-developer-8", description: "Asynchronous processing, Pydantic validation, and low-latency SSE streaming endpoints." },
{ id: "guardrails-evals", name: "Guardrails & Evaluation", weight: 15, layerId: "ai-developer-9", description: "Protection against prompt injections, structured JSON output enforcement, and automated output evaluation." },
{ id: "tests", name: "Testing", weight: 15, layerId: "ai-developer-10", description: "Thorough test coverage of RAG chains, mocked API calls, tool execution, and edge case failure modes." },
{ id: "docs-ops", name: "Operability & Deployment", weight: 10, layerId: "ai-developer-10", description: "Clean Docker setup, reproducible configuration, and complete setup documentation." },
],

twistPool: [
{ id: "hybrid-search", text: "Combine vector similarity search with BM25 sparse keyword search using a reciprocal rank fusion algorithm." },
{ id: "semantic-caching", text: "Implement a semantic cache layer that returns stored responses for high-similarity historical user queries." },
{ id: "cost-monitoring", text: "Track token consumption per session, enforce token rate limits, and calculate API cost estimates in response headers." },
{ id: "multimodal-rag", text: "Extend ingestion to extract and query text from image figures using an OCR or vision-language model." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — NLP Engineer track (nlp-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "nlp-engineer",
categoryId: "aiml",
slug: "nlp-engineer-document-intelligence",
version: 1,
status: "draft",
reviewed: false,
title: "Document Intelligence and Domain NER Fine-Tuning Service",
summary:
"Build a production document processing system that fine-tunes a domain-specific Transformer model " +
"for Named Entity Recognition (NER) and text classification, exports it to ONNX format, and serves " +
"low-latency extraction requests through an optimized FastAPI endpoint.",
stack: ["Python", "PyTorch", "Hugging Face", "FastAPI", "Docker", "GitHub Actions"],

requirements: [
{ id: "text-preprocessing", text: "Implements custom tokenization, regex cleaning, and normalization utilities for unstructured documents." },
{ id: "baseline-nlp", text: "Trains a classical NLP baseline (TF-IDF + SVM/Logistic Regression) for text classification to establish benchmarks." },
{ id: "transformer-fine-tuning", text: "Fine-tunes a Hugging Face Transformer model using LoRA or full Trainer API for domain-specific entity extraction." },
{ id: "evaluation-suite", text: "Evaluates model performance using seqeval for token-level precision, recall, and F1 score per entity type." },
{ id: "model-export", text: "Exports fine-tuned PyTorch model weights to ONNX format with dynamic axis shapes for optimized runtime batching." },
{ id: "fastapi-service", text: "FastAPI endpoint accepts raw text or PDF documents and returns structured extracted entities with confidence scores." },
{ id: "tests", text: "Pytest suite covers text normalization, token alignment, model output schema validation, and inference endpoints.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README details dataset prep, fine-tuning scripts, evaluation scorecards, and local inference setup.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example with configuration for Hugging Face Hub access tokens and model paths.", check: CHECKS.envExample },
{ id: "docker", text: "A Dockerfile packages the FastAPI service and ONNX runtime environment for reproducible container execution.", check: CHECKS.dockerfile },
{ id: "ci", text: "GitHub Actions workflow automates code linting, type checks, and pytest execution on repository push.", check: CHECKS.ci },
],

rubric: [
{ id: "text-processing", name: "Preprocessing & Token Alignment", weight: 20, layerId: "nlp-engineer-2", description: "Correct handling of character-level subword token alignment, regex normalization, and raw text cleaning." },
{ id: "fine-tuning", name: "Transformer Fine-Tuning & PEFT", weight: 25, layerId: "nlp-engineer-8", description: "Effective transfer learning setup using Hugging Face Trainer or LoRA, correct loss calculation, and convergence." },
{ id: "evaluation", name: "Evaluation & Benchmarking", weight: 15, layerId: "nlp-engineer-9", description: "Rigorous evaluation with seqeval, entity-level classification reports, and baseline comparison." },
{ id: "optimization", name: "ONNX Export & Latency Tuning", weight: 15, layerId: "nlp-engineer-10", description: "Correct ONNX export, dynamic dimension configuration, and latency reduction in inference." },
{ id: "tests", name: "Testing", weight: 15, layerId: "nlp-engineer-10", description: "Thorough unit tests for tokenizers, post-processing offset mappings, and API endpoints." },
{ id: "docs-ops", name: "Documentation & Containerization", weight: 10, layerId: "nlp-engineer-10", description: "Complete setup instructions, reproducible training commands, and isolated container build." },
],

twistPool: [
{ id: "quantization", text: "Apply 8-bit dynamic quantization to the ONNX model to decrease memory footprint and accelerate CPU inference latency." },
{ id: "active-learning", text: "Implement an uncertainty-based active learning sampler that identifies low-confidence predictions for human re-annotation." },
{ id: "multilingual-support", text: "Extend fine-tuning to a multilingual Transformer (e.g. XLM-RoBERTa) and evaluate cross-lingual NER performance." },
{ id: "abstractive-summary", text: "Add a secondary summarization pipeline endpoint using a fine-tuned T5 or BART model to generate document abstracts." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — Computer Vision Engineer track (cv-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "cv-engineer",
categoryId: "aiml",
slug: "cv-engineer-defect-detection",
version: 1,
status: "draft",
reviewed: false,
title: "Industrial Defect Detection and Real-Time Inspection System",
summary:
"Build a production computer vision pipeline that processes visual industrial inspections. " +
"You will perform image augmentation, train a custom PyTorch object detection model (YOLO or U-Net segmentation), " +
"export the trained model to TensorRT or ONNX, and serve real-time frame inference via FastAPI.",
stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker", "GitHub Actions"],

requirements: [
{ id: "data-pipeline", text: "Builds a PyTorch Dataset loading images with augmentations (Albumentations) including flips, color shifts, and rotations." },
{ id: "classical-preprocessing", text: "Applies OpenCV preprocessing routines (thresholding, contour extraction, edge detection) for ROI pre-filtering." },
{ id: "model-training", text: "Trains a deep learning model (YOLO for detection or U-Net for segmentation) using custom loss functions and mAP/IoU tracking." },
{ id: "model-export", text: "Exports model weights to ONNX format, configuring dynamic batch sizes for optimized inference." },
{ id: "fastapi-stream", text: "FastAPI server receives image frames via multipart/form-data or WebSockets and returns annotated bounding boxes and defect metrics." },
{ id: "nms-postprocess", text: "Implements custom Non-Maximum Suppression (NMS) or mask thresholding post-processing logic." },
{ id: "tests", text: "Pytest suite validates image transformation shapes, NMS bounding box calculations, and API endpoint responses.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README details dataset preparation, training procedures, mAP/IoU benchmark results, and container setup.", check: CHECKS.readme },
{ id: "env-example", text: "Environment config file contains model weights directory, confidence threshold settings, and environment variables.", check: CHECKS.envExample },
{ id: "docker", text: "Dockerfile packages FastAPI service, OpenCV dependencies, and ONNX Runtime for deployment.", check: CHECKS.dockerfile },
{ id: "ci", text: "GitHub Actions workflow executes linting checks and automated tests on every push.", check: CHECKS.ci },
],

rubric: [
{ id: "data-augmentation", name: "Data Processing & Augmentation", weight: 20, layerId: "cv-engineer-9", description: "Robust data loaders, realistic augmentations, and OpenCV pre-filtering to handle lighting and noise variation." },
{ id: "model-architecture", name: "Detection/Segmentation Training", weight: 25, layerId: "cv-engineer-7", description: "Correct implementation of model architecture, custom loss functions, and accurate mAP or IoU evaluation." },
{ id: "postprocessing", name: "Post-Processing & Optimization", weight: 15, layerId: "cv-engineer-7", description: "Accurate NMS/contour extraction implementation and successful ONNX export configuration." },
{ id: "api-performance", name: "Serving & Latency", weight: 15, layerId: "cv-engineer-10", description: "FastAPI endpoint handles binary image inputs efficiently with low-latency inference." },
{ id: "tests", name: "Testing", weight: 15, layerId: "cv-engineer-4", description: "Unit tests accurately cover image shape transformations, box coordinates logic, and endpoint failure cases." },
{ id: "docs-ops", name: "Documentation & Containerization", weight: 10, layerId: "cv-engineer-10", description: "Clear setup guide, evaluation metrics visualization, and working Docker container." },
],

twistPool: [
{ id: "video-stream", text: "Add a WebSocket streaming endpoint that accepts an RTSP or continuous video stream and streams back annotated frames." },
{ id: "segmentation-masks", text: "Extend the system to compute precise polygon area calculations for detected surface defects in square millimeters." },
{ id: "tensorrt-acceleration", text: "Add an alternative engine loader using TensorRT execution provider for GPU hardware acceleration." },
{ id: "anomaly-detection", text: "Implement an unsupervised Autoencoder fallback for detecting unseen novel structural defects outside training classes." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — LLM Engineer track (llm-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "llm-engineer",
categoryId: "aiml",
slug: "llm-engineer-enterprise-rag-assistant",
version: 1,
status: "draft",
reviewed: false,
title: "Production LLM Platform with PEFT, Advanced RAG, and Safety Guardrails",
summary:
"Build a production-grade LLM system featuring fine-tuned open models (via QLoRA), " +
"advanced RAG with re-ranking, custom stateful agents (LangGraph), prompt injection defenses, " +
"and evaluation pipelines using RAGAS and LLM-as-judge.",
stack: ["Python", "vLLM or Hugging Face", "LangChain/LangGraph", "Chroma or Qdrant", "Docker", "GitHub Actions"],

requirements: [
{ id: "peft-fine-tuning", text: "Script fine-tunes an open LLM using QLoRA/TRL on an instruction dataset and saves adapter weights." },
{ id: "advanced-rag", text: "Implements hybrid retrieval (vector similarity + keyword search) with a cross-encoder re-ranker stage." },
{ id: "agent-state-machine", text: "Constructs a multi-step agent using LangGraph with state persistence and human-in-the-loop validation." },
{ id: "guardrails-safety", text: "Integrates input/output guardrails detecting prompt injection attempts and PII data leakage." },
{ id: "ragas-evaluation", text: "Automates RAG evaluation measuring faithfulness, answer relevance, and context recall with RAGAS." },
{ id: "caching-routing", text: "Implements semantic response caching and fallback model routing based on prompt complexity or error status." },
{ id: "fastapi-streaming", text: "FastAPI server streams model generations via SSE with token latency and cost tracking metrics in headers." },
{ id: "tests", text: "Pytest suite tests RAG retrieval precision, guardrail triggering, state graph transitions, and endpoint streaming.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README documents architecture diagrams, fine-tuning hyperparameters, evaluation scores, and deployment instructions.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example containing configuration keys, vector DB credentials, and model endpoints.", check: CHECKS.envExample },
{ id: "docker", text: "Docker Compose setup spins up the vector database, API service, and mock LLM inference engine.", check: CHECKS.compose },
{ id: "ci", text: "GitHub Actions workflow executes linting and automated test suite on code push.", check: CHECKS.ci },
],

rubric: [
{ id: "peft-training", name: "PEFT & Fine-Tuning", weight: 20, layerId: "llm-engineer-7", description: "Correct implementation of QLoRA fine-tuning loop, dataset formatting, and parameter-efficient adapter saving." },
{ id: "rag-architecture", name: "Advanced RAG & Re-ranking", weight: 20, layerId: "llm-engineer-4", description: "Hybrid search implementation, cross-encoder re-ranking effectiveness, and retrieval accuracy." },
{ id: "agent-execution", name: "Agent State Machine", weight: 20, layerId: "llm-engineer-6", description: "Robust LangGraph state machine workflow with tool integration, state persistence, and error recovery." },
{ id: "safety-evals", name: "Guardrails & RAGAS Evals", weight: 15, layerId: "llm-engineer-8", description: "Effective prompt injection defense, PII masking, and comprehensive RAGAS automated evaluations." },
{ id: "tests", name: "Testing", weight: 15, layerId: "llm-engineer-8", description: "Thorough unit and integration tests covering vector lookup, agent branches, and streaming functionality." },
{ id: "docs-ops", name: "Deployment & Observability", weight: 10, layerId: "llm-engineer-10", description: "Clean container setup, clear environment configurations, and token/latency observability." },
],

twistPool: [
{ id: "vllm-serving", text: "Deploy the fine-tuned model using vLLM engine with PagedAttention for high-throughput batch inference." },
{ id: "multi-agent", text: "Extend the agent system to a multi-agent hierarchy where a supervisor routes queries between specialized domain sub-agents." },
{ id: "speculative-decoding", text: "Implement speculative decoding using a small draft model to decrease generation latency for standard prompts." },
{ id: "prompt-compression", text: "Add automated context compression (e.g. LLMLingua) to prune retrieved documents prior to LLM generation." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — MLOps Engineer track (mlops), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "mlops",
categoryId: "aiml",
slug: "mlops-automated-retraining-pipeline",
version: 1,
status: "draft",
reviewed: false,
title: "Automated ML Pipeline, Drift Detection, and Deployment Platform",
summary:
"Build a production-grade MLOps infrastructure featuring data and model versioning with DVC, " +
"experiment tracking with MLflow, automated validation gates with Great Expectations, drift monitoring, " +
"and continuous deployment of containerized inference endpoints via GitHub Actions.",
stack: ["Python", "DVC", "MLflow", "Great Expectations", "FastAPI", "Docker", "GitHub Actions"],

requirements: [
{ id: "dvc-data-versioning", text: "Data versioning configuration tracks dataset iterations and pipeline stages with DVC." },
{ id: "data-validation", text: "Integrates Great Expectations suites to validate raw data quality before training and inference steps." },
{ id: "experiment-registry", text: "MLflow logs training runs, parameters, evaluation metrics, and registers candidate models to the MLflow Model Registry." },
{ id: "drift-detection", text: "Implements automated data and concept drift detection (using Evidently or custom statistical tests) on incoming inference data." },
{ id: "fastapi-serving", text: "FastAPI inference service loads registered models from MLflow and exposes a REST API for real-time predictions." },
{ id: "orchestration-retrain", text: "Automated script triggers retraining and candidate evaluation when data drift exceeds predefined thresholds." },
{ id: "tests", text: "Pytest suite validates pipeline stage outputs, data expectation assertions, and model serving routes.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README details DVC workflow setup, MLflow tracking configuration, drift detection alerts, and deployment steps.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example with configurations for MLflow remote tracking, storage endpoints, and threshold settings.", check: CHECKS.envExample },
{ id: "docker", text: "Docker Compose setup runs the MLflow server, local feature storage, and the FastAPI model serving container.", check: CHECKS.compose },
{ id: "ci-cd", text: "GitHub Actions CI/CD workflow runs automated tests, validates model performance gates, and builds deployment containers.", check: CHECKS.ci },
],

rubric: [
{ id: "reproducibility", name: "Data & Model Versioning", weight: 20, layerId: "mlops-2", description: "Effective DVC integration, clear artifact versioning, and fully reproducible pipeline definitions." },
{ id: "data-quality", name: "Data Validation & Quality", weight: 15, layerId: "mlops-4", description: "Comprehensive Great Expectations check suites preventing bad data from entering training or inference." },
{ id: "experimentation", name: "Experiment Tracking & Registry", weight: 20, layerId: "mlops-3", description: "Systematic logging of metrics, hyperparameters, artifacts, and proper usage of MLflow model registry stages." },
{ id: "monitoring-drift", name: "Drift Monitoring & Retraining", weight: 20, layerId: "mlops-9", description: "Accurate detection of data distribution shifts and reliable automated retraining triggers." },
{ id: "cicd-tests", name: "CI/CD & Automated Testing", weight: 15, layerId: "mlops-7", description: "Robust GitHub Actions workflow with model validation gates, unit tests, and automated build processes." },
{ id: "docs-ops", name: "Operability & Documentation", weight: 10, layerId: "mlops-5", description: "Clean containerization setup and clear instructions for running and maintaining the pipeline." },
],

twistPool: [
{ id: "feast-integration", text: "Integrate Feast feature store for unified online feature serving during inference and offline feature retrieval for training." },
{ id: "canary-deployment", text: "Implement traffic splitting in FastAPI to support canary deployments between v1 and v2 model versions." },
{ id: "airflow-dag", text: "Package the data processing, validation, and training stages into an Apache Airflow DAG for scheduled orchestration." },
{ id: "prometheus-metrics", text: "Expose custom Prometheus metrics from FastAPI for tracking inference latency, request throughput, and prediction drift." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — Data Engineer track (data-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "data-engineer",
categoryId: "aiml",
slug: "data-engineer-streaming-analytics-platform",
version: 1,
status: "draft",
reviewed: false,
title: "Real-Time Streaming and Batch Lakehouse Analytics Platform",
summary:
"Design and implement a modern hybrid data platform combining real-time streaming with Kafka, " +
"batch ETL processing with PySpark/DuckDB, dimensional modeling with dbt, and orchestration " +
"via Apache Airflow inside a containerized lakehouse architecture.",
stack: ["Python", "Apache Kafka", "PySpark", "dbt", "Apache Airflow", "Docker", "GitHub Actions"],

requirements: [
{ id: "kafka-streaming", text: "Kafka producer simulates continuous event streams and a PySpark structured streaming job consumes events into raw object storage." },
{ id: "lakehouse-storage", text: "Data is stored in Delta Lake or Parquet format with appropriate partitioning schemas for efficient querying." },
{ id: "dbt-transformations", text: "dbt models transform raw data into a dimensional star schema with staging, intermediate, and mart layers." },
{ id: "dbt-tests", text: "Includes dbt data test assertions for uniqueness, non-null values, referential integrity, and custom business logic." },
{ id: "airflow-dag", text: "Apache Airflow DAG orchestrates batch ingestion, Spark transformations, dbt runs, and data quality validations." },
{ id: "data-quality-checks", text: "Data quality checks validate schema compliance and row counts before loading data into analytical marts." },
{ id: "tests", text: "Pytest suite tests Spark transformations, schema parsers, custom DAG operators, and Kafka consumer logic.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README details architecture topology, star schema layout, local infrastructure setup, and Airflow DAG deployment.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example with configuration for storage paths, database credentials, and Kafka broker urls.", check: CHECKS.envExample },
{ id: "docker", text: "Docker Compose environment starts Kafka brokers, Airflow scheduler/webserver, and local storage buckets.", check: CHECKS.compose },
{ id: "ci", text: "GitHub Actions workflow executes code linting, dbt model compilation, and automated tests on repository push.", check: CHECKS.ci },
],

rubric: [
{ id: "streaming-architecture", name: "Streaming & Ingestion", weight: 20, layerId: "data-engineer-5", description: "Correct Kafka event publishing/consuming, stream offset management, and Parquet/Delta Lake ingestion." },
{ id: "data-modeling", name: "Dimensional Modeling & dbt", weight: 20, layerId: "data-engineer-7", description: "Clean star schema design, modular dbt transformations, proper materialization choices, and comprehensive test coverage." },
{ id: "batch-processing", name: "Distributed Processing", weight: 20, layerId: "data-engineer-4", description: "Efficient PySpark processing, correct handling of partitions, joins, and memory management." },
{ id: "orchestration", name: "Orchestration & Workflow", weight: 15, layerId: "data-engineer-6", description: "Robust Airflow DAG design with explicit task dependencies, retries, sensors, and failure alerts." },
{ id: "tests", name: "Testing & Data Quality", weight: 15, layerId: "data-engineer-9", description: "Thorough unit testing of Python transforms and comprehensive dbt automated quality checks." },
{ id: "docs-ops", name: "Infrastructure & Documentation", weight: 10, layerId: "data-engineer-10", description: "Reproducible Docker infrastructure setup and clear documentation of pipeline lineage and architecture." },
],

twistPool: [
{ id: "iceberg-support", text: "Configure Apache Iceberg as the lakehouse table format supporting schema evolution and time-travel queries." },
{ id: "cdc-integration", text: "Implement Change Data Capture (CDC) streaming using Debezium or mock database binlog events." },
{ id: "great-expectations", text: "Incorporate Great Expectations validation checkpoints directly into the Airflow DAG pipeline execution." },
{ id: "data-catalog", text: "Automate lineage generation and export dbt documentation catalog artifacts to an accessible static web host." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};/\*\*

- Capstone brief — Reinforcement Learning Engineer track (rl-engineer), v1.
-
- DRAFT by ChatGPT — status stays "draft" until a human has read
- every requirement, rubric line and twist. The seeder refuses to publish a
- brief whose `reviewed` flag is false.
-
- ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
-
- Shape notes:
- - requirements[].check is for the stage-2 automated checks. `file` is a glob
- matched against the repo tree at the pinned commit. Requirements without a
- check are judged only by the AI rubric review.
- - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
- back to the roadmap layer that teaches it, for weak-spot tracking.
- - Bump `version` for any change that affects grading; never edit a
- published version in place (attempts point at the exact brief document).
  \*/

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
trackId: "rl-engineer",
categoryId: "aiml",
slug: "rl-engineer-autonomous-control-system",
version: 1,
status: "draft",
reviewed: false,
title: "Autonomous Agent Control Platform and Distributed RL System",
summary:
"Develop a complete Reinforcement Learning training and evaluation system. You will create a custom " +
"Gymnasium environment, implement baseline Q-Learning / DQN algorithms alongside PPO using Ray RLlib, " +
"track training metrics, and serve the policy via a containerized low-latency inference endpoint.",
stack: ["Python", "PyTorch", "Gymnasium", "Ray RLlib", "FastAPI", "Docker", "GitHub Actions"],

requirements: [
{ id: "custom-environment", text: "Implements a custom Gymnasium environment defining action/observation spaces, step transitions, reward shaping, and reset logic." },
{ id: "dqn-baseline", text: "Implements a custom Deep Q-Network (DQN) in PyTorch with experience replay buffer and target network update steps." },
{ id: "ppo-rllib", text: "Trains a scalable Proximal Policy Optimization (PPO) agent using Ray RLlib or Stable-Baselines3 on vectorized environments." },
{ id: "reward-shaping", text: "Designs and documents reward shaping functions preventing policy exploitation and encouraging goal convergence." },
{ id: "metrics-logging", text: "Logs episode rewards, policy loss, value loss, and entropy metrics using MLflow, TensorBoard, or Weights & Biases." },
{ id: "policy-serving", text: "FastAPI endpoint loads exported policy checkpoints and evaluates incoming state observations to return actions in real-time." },
{ id: "tests", text: "Pytest suite verifies environment reset/step transitions, tensor observation shapes, and inference API response structures.", check: { type: "file", glob: "**/test_*.py" } },
{ id: "readme", text: "README documents environment formulation, reward design trade-offs, training convergence curves, and serving setup.", check: CHECKS.readme },
{ id: "env-example", text: "Includes .env.example with configuration for environment hyperparameters, training seed, and checkpoint paths.", check: CHECKS.envExample },
{ id: "docker", text: "Dockerfile packages the FastAPI policy server and environment runtime for containerized execution.", check: CHECKS.dockerfile },
{ id: "ci", text: "GitHub Actions workflow executes code linting and unit test suite on repository push.", check: CHECKS.ci },
],

rubric: [
{ id: "environment-design", name: "Gymnasium Environment & Reward Design", weight: 20, layerId: "rl-engineer-8", description: "Correct Gymnasium API adherence, well-defined observation/action spaces, and balanced reward shaping." },
{ id: "algorithmic-correctness", name: "DQN & PyTorch Implementation", weight: 20, layerId: "rl-engineer-5", description: "Accurate implementation of Q-learning logic, experience replay sampling, target networks, and gradient updates." },
{ id: "distributed-rl", name: "Scaling with PPO & Ray RLlib", weight: 20, layerId: "rl-engineer-9", description: "Effective Ray RLlib configuration, training convergence, and proper hyperparameter setup." },
{ id: "policy-deployment", name: "Policy Serving & Inference", weight: 15, layerId: "rl-engineer-10", description: "Low-latency policy execution in FastAPI accepting state inputs and outputting deterministic or stochastic actions." },
{ id: "tests", name: "Testing", weight: 15, layerId: "rl-engineer-8", description: "Thorough testing of environment state transitions, reward edge cases, and policy forward passes." },
{ id: "docs-ops", name: "Documentation & Containerization", weight: 10, layerId: "rl-engineer-10", description: "Comprehensive README with convergence plots and working Docker build for deployment." },
],

twistPool: [
{ id: "offline-rl", text: "Implement an Offline RL algorithm (e.g. CQL or BCQ) training the policy purely on pre-collected historical trajectory datasets." },
{ id: "curriculum-learning", text: "Add a curriculum learning manager that progressively increases environment difficulty parameters during training." },
{ id: "action-masking", text: "Implement invalid action masking within the Gymnasium environment and policy network to handle dynamic constraint sets." },
{ id: "sim-to-real", text: "Incorporate domain randomization (randomizing friction, mass, or noise) to improve model robustness across parameter variations." },
],

rules: COMMON_RULES,

passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — Prompt Engineer track (prompt-engineer), v1.
 *
 * DRAFT by ChatGPT — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "prompt-engineer",
  categoryId: "aiml",
  slug: "prompt-engineer-production-workflow-system",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise Prompt Engine, Guardrail, and Evaluation Platform",
  summary:
    "Design, optimize, and productionize a prompt engineering system for complex enterprise workflows. " +
    "You will build versioned prompt templates, chain multi-step reasoning workflows (Chain-of-Thought, ReAct), " +
    "enforce strict JSON schemas via tool calling, build prompt injection defense guardrails, " +
    "and construct an automated evaluation suite using LLM-as-judge scoring.",
  stack: ["Python", "FastAPI", "LangChain or LlamaIndex", "Pydantic", "Docker", "GitHub Actions"],

  requirements: [
    { id: "prompt-templates", text: "Implements externalized, versioned prompt templates supporting system roles, few-shot examples, and strict formatting delimiters." },
    { id: "structured-output", text: "Enforces structured JSON output schemas via function/tool calling and Pydantic validation with automated repair retries." },
    { id: "advanced-reasoning", text: "Constructs multi-step prompt chains using Chain-of-Thought or ReAct reasoning patterns for complex task decomposition." },
    { id: "grounded-rag-prompt", text: "Formats retrieved context into grounded prompts with citation enforcement and context window budget management." },
    { id: "guardrails-security", text: "Implements input/output guardrails detecting prompt injection attempts, system prompt leakage, and unsafe outputs." },
    { id: "llm-eval-suite", text: "Builds an automated prompt testing framework running benchmark datasets with an LLM-as-judge scoring rubric." },
    { id: "fastapi-service", text: "FastAPI endpoint serves configured prompt workflows with configurable sampling parameters (temperature, top_p)." },
    { id: "tests", text: "Pytest suite tests prompt template rendering, Pydantic validation parsing, guardrail triggers, and evaluation pipelines.", check: { type: "file", glob: "**/test_*.py" } },
    { id: "readme", text: "README details prompt engineering techniques, versioning strategy, evaluation scorecards, and deployment steps.", check: CHECKS.readme },
    { id: "env-example", text: "Includes .env.example with API keys, temperature settings, and model routing choices.", check: CHECKS.envExample },
    { id: "docker", text: "Dockerfile packages the FastAPI prompt serving system and configuration assets for containerized deployment.", check: CHECKS.dockerfile },
    { id: "ci", text: "GitHub Actions workflow automates linting, prompt evaluation runs, and test execution on pull requests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "prompt-design", name: "Prompt Design & Structuring", weight: 20, layerId: "prompt-engineer-2", description: "Clear instructions, few-shot selection, delimiter usage, and context window budget management." },
    { id: "structured-outputs", name: "Structured Output & Tool Calling", weight: 20, layerId: "prompt-engineer-4", description: "Pydantic schema enforcement, robust function calling, and self-healing output repair mechanisms." },
    { id: "advanced-chains", name: "Multi-Step Workflows & Chaining", weight: 20, layerId: "prompt-engineer-3", description: "Effective execution of Chain-of-Thought, ReAct loops, or prompt chaining for complex reasoning." },
    { id: "safety-evals", name: "Guardrails & Automated Evals", weight: 15, layerId: "prompt-engineer-8", description: "Defense against prompt injections and systematic evaluation benchmarking with LLM-as-judge." },
    { id: "tests", name: "Testing & Validation", weight: 15, layerId: "prompt-engineer-7", description: "Unit tests verifying prompt rendering, output parsing failures, and guardrail interception." },
    { id: "docs-ops", name: "Documentation & Versioning", weight: 10, layerId: "prompt-engineer-10", description: "Comprehensive documentation, structured template version control, and runnable Docker container." },
  ],

  twistPool: [
    { id: "prompt-compression", text: "Implement prompt compression techniques (e.g. LLMLingua) to trim redundant tokens before API requests." },
    { id: "semantic-prompt-cache", text: "Incorporate a semantic caching layer to avoid duplicate LLM invocations for semantically identical user queries." },
    { id: "model-router", text: "Build an automated prompt router that directs simple prompts to a lightweight model (e.g. GPT-4o-mini) and hard queries to a frontier model." },
    { id: "tree-of-thought", text: "Extend prompt workflows with a Tree-of-Thought search strategy that samples and evaluates multiple reasoning branches." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};


