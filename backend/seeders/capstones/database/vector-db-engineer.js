/**
 * Capstone brief — vector-db-engineer track (vector-db-engineer), v1.
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
  trackId: "vector-db-engineer",
  categoryId: "database",
  slug: "vector-db-engineer-rag-search",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production RAG Engine with Hybrid Vector Search and pgvector",
  summary:
    "Build a production-grade Retrieval-Augmented Generation (RAG) platform using pgvector and Qdrant/Weaviate. " +
    "Implement document chunking pipelines, HNSW/IVFFlat indexing, hybrid search scoring (dense + sparse keyword), " +
    "and embedding drift monitoring pipelines.",
  stack: [
    "pgvector",
    "Qdrant or Weaviate",
    "Python",
    "Sentence Transformers",
    "Docker Compose",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "vector-storage",
      text: "Configure PostgreSQL with pgvector extension and create tables storing dense embedding vectors alongside structured metadata.",
      check: { type: "file", glob: "**/schema.sql" },
    },
    {
      id: "ann-indexing",
      text: "Create and benchmark HNSW and IVFFlat vector indexes, adjusting m, ef_construction, and lists parameters for recall vs speed trade-offs.",
      check: { type: "file", glob: "**/indexes.sql" },
    },
    {
      id: "ingestion-chunking",
      text: "Build an ingestion pipeline that parses long-form documents using semantic text chunking and generates embeddings via Sentence Transformers.",
      check: { type: "file", glob: "**/ingest.{py,js}" },
    },
    {
      id: "rag-retrieval",
      text: "Implement a RAG pipeline executing k-NN similarity search (cosine/L2 distance) with metadata filtering to supply context to an LLM.",
      check: { type: "file", glob: "**/rag_pipeline.{py,js}" },
    },
    {
      id: "hybrid-search",
      text: "Implement hybrid search combining BM25 keyword retrieval with dense vector similarity using reciprocal rank fusion (RRF) or alpha weighting.",
      check: { type: "file", glob: "**/hybrid_search.{py,js}" },
    },
    {
      id: "recall-evaluation",
      text: "Include an evaluation script calculating recall@k against a ground-truth exact brute-force search dataset.",
      check: { type: "file", glob: "**/evaluate_recall.{py,js}" },
    },
    {
      id: "container-stack",
      text: "Provide a Docker Compose file spinning up PostgreSQL with pgvector and Qdrant/Weaviate instances.",
      check: CHECKS.compose,
    },
    {
      id: "tests",
      text: "Write integration tests validating vector insertion, payload metadata filtering, and search retrieval accuracy.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details vector database architecture, chunking strategy, index parameter trade-offs, and recall benchmark findings.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow runs embedding ingestion tests and lints Python code.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "embeddings-vector",
      name: "Embeddings & Vector Representations",
      weight: 15,
      layerId: "vector-db-engineer-1",
      description:
        "Are vector embeddings generated, dimensionally aligned, and normalized correctly?",
    },
    {
      id: "ann-indexing",
      name: "ANN Algorithms & Index Tuning",
      weight: 20,
      layerId: "vector-db-engineer-2",
      description:
        "Are HNSW/IVFFlat index parameters tuned effectively for optimal QPS and recall?",
    },
    {
      id: "pgvector-impl",
      name: "pgvector & Database Schema",
      weight: 20,
      layerId: "vector-db-engineer-3",
      description:
        "Is pgvector properly configured with appropriate vector operators (<->, <=>, <#>)?",
    },
    {
      id: "rag-pipeline",
      name: "RAG Pipeline & Metadata Filtering",
      weight: 20,
      layerId: "vector-db-engineer-5",
      description:
        "Does the RAG pipeline chunk documents effectively and apply strict payload metadata filters?",
    },
    {
      id: "hybrid-search",
      name: "Hybrid Search & Multi-modal Scoring",
      weight: 15,
      layerId: "vector-db-engineer-7",
      description:
        "Are BM25 keyword search and dense vector scores combined seamlessly via reciprocal rank fusion?",
    },
    {
      id: "eval-ops",
      name: "Evaluation & Operational Metrics",
      weight: 10,
      layerId: "vector-db-engineer-9",
      description:
        "Are recall@k evaluation pipelines and Prometheus QPS/latency metrics clearly documented?",
    },
  ],

  twistPool: [
    {
      id: "embedding-drift-detection",
      text: "Build an automated monitor that detects embedding space drift between model versions and triggers index re-embedding.",
    },
    {
      id: "clip-multi-modal",
      text: "Extend the pipeline to process multi-modal inputs (images and text) using OpenAI CLIP embeddings.",
    },
    {
      id: "qdrant-quantization",
      text: "Configure Scalar Quantization (SQ) or Product Quantization (PQ) in Qdrant to reduce RAM usage while preserving search precision.",
    },
    {
      id: "mlflow-model-versioning",
      text: "Integrate MLflow to version embedding model artifacts and track retrieval recall metrics over time.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
