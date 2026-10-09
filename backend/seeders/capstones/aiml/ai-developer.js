/**
 * Capstone brief — ai-developer track (ai-developer), v1.
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
  stack: [
    "Python",
    "FastAPI",
    "LangChain",
    "Chroma or pgvector",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "doc-ingestion",
      text: "Ingestion pipeline parses markdown/PDF docs, chunks text into strategic sizes, and generates vector embeddings.",
    },
    {
      id: "vector-store",
      text: "Embeddings are stored and queried in Chroma DB or pgvector with metadata filtering.",
    },
    {
      id: "rag-pipeline",
      text: "RAG chain retrieves relevant context, formats prompts with strict grounding, and includes citations in responses.",
    },
    {
      id: "agent-tools",
      text: "Implements an AI agent with ReAct capability using dynamic tools (e.g. system status query, internal database lookup).",
    },
    {
      id: "fastapi-streaming",
      text: "FastAPI application serves POST /chat with Server-Sent Events (SSE) streaming for real-time LLM outputs.",
    },
    {
      id: "guardrails",
      text: "Implements prompt injection defense and structured output validation with Pydantic schemas.",
    },
    {
      id: "evals-logging",
      text: "Includes a test suite evaluating output relevance using an LLM-as-judge pattern or similarity evaluation dataset.",
    },
    {
      id: "tests",
      text: "Integration and unit tests verify chunking logic, vector store retrieval, tool execution, and API endpoints.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details installation, API endpoint documentation, prompt architecture, and evaluation benchmarks.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Environment example template includes placeholders for LLM API keys and database configuration; the project must run on a free-tier provider key or a mocked LLM, so no paid account is required.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Docker Compose environment starts the FastAPI service and local vector database cleanly.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow runs linting, static type checks, and pytest on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "rag-architecture",
      name: "RAG & Vector Storage",
      weight: 25,
      layerId: "ai-developer-5",
      description:
        "Effective chunking, retrieval relevance, vector index setup, and accurate response grounding with citations.",
    },
    {
      id: "agent-logic",
      name: "Agent & Tool Integration",
      weight: 20,
      layerId: "ai-developer-7",
      description:
        "Correct tool definitions, robust error handling during tool execution, and clear planning loops.",
    },
    {
      id: "api-streaming",
      name: "FastAPI Implementation & Streaming",
      weight: 15,
      layerId: "ai-developer-8",
      description:
        "Asynchronous processing, Pydantic validation, and low-latency SSE streaming endpoints.",
    },
    {
      id: "guardrails-evals",
      name: "Guardrails & Evaluation",
      weight: 15,
      layerId: "ai-developer-9",
      description:
        "Protection against prompt injections, structured JSON output enforcement, and automated output evaluation.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "ai-developer-10",
      description:
        "Thorough test coverage of RAG chains, mocked API calls, tool execution, and edge case failure modes.",
    },
    {
      id: "docs-ops",
      name: "Operability & Deployment",
      weight: 10,
      layerId: "ai-developer-10",
      description:
        "Clean Docker setup, reproducible configuration, and complete setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "hybrid-search",
      text: "Combine vector similarity search with BM25 sparse keyword search using a reciprocal rank fusion algorithm.",
    },
    {
      id: "semantic-caching",
      text: "Implement a semantic cache layer that returns stored responses for high-similarity historical user queries.",
    },
    {
      id: "cost-monitoring",
      text: "Track token consumption per session, enforce token rate limits, and calculate API cost estimates in response headers.",
    },
    {
      id: "multimodal-rag",
      text: "Extend ingestion to extract and query text from image figures using an OCR or vision-language model.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
