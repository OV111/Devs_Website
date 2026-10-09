/**
 * Capstone brief — llm-engineer track (llm-engineer), v1.
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
  trackId: "llm-engineer",
  categoryId: "aiml",
  slug: "llm-engineer-enterprise-rag-assistant",
  version: 1,
  status: "draft",
  reviewed: false,
  title:
    "Production LLM Platform with PEFT, Advanced RAG, and Safety Guardrails",
  summary:
    "Build a production-grade LLM system featuring fine-tuned open models (via QLoRA), " +
    "advanced RAG with re-ranking, custom stateful agents (LangGraph), prompt injection defenses, " +
    "and evaluation pipelines using RAGAS and LLM-as-judge.",
  stack: [
    "Python",
    "vLLM or Hugging Face",
    "LangChain/LangGraph",
    "Chroma or Qdrant",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "peft-fine-tuning",
      text: "Script fine-tunes an open LLM using QLoRA/TRL on an instruction dataset and saves adapter weights.",
    },
    {
      id: "advanced-rag",
      text: "Implements hybrid retrieval (vector similarity + keyword search) with a cross-encoder re-ranker stage.",
    },
    {
      id: "agent-state-machine",
      text: "Constructs a multi-step agent using LangGraph with state persistence and human-in-the-loop validation.",
    },
    {
      id: "guardrails-safety",
      text: "Integrates input/output guardrails detecting prompt injection attempts and PII data leakage.",
    },
    {
      id: "ragas-evaluation",
      text: "Automates RAG evaluation measuring faithfulness, answer relevance, and context recall with RAGAS.",
    },
    {
      id: "caching-routing",
      text: "Implements semantic response caching and fallback model routing based on prompt complexity or error status.",
    },
    {
      id: "fastapi-streaming",
      text: "FastAPI server streams model generations via SSE with token latency and cost tracking metrics in headers.",
    },
    {
      id: "tests",
      text: "Pytest suite tests RAG retrieval precision, guardrail triggering, state graph transitions, and endpoint streaming.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README documents architecture diagrams, fine-tuning hyperparameters, evaluation scores, and deployment instructions.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example containing configuration keys, vector DB credentials, and model endpoints.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Docker Compose setup spins up the vector database, API service, and mock LLM inference engine.",
      check: CHECKS.compose,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes linting and automated test suite on code push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "peft-training",
      name: "PEFT & Fine-Tuning",
      weight: 20,
      layerId: "llm-engineer-7",
      description:
        "Correct implementation of QLoRA fine-tuning loop, dataset formatting, and parameter-efficient adapter saving.",
    },
    {
      id: "rag-architecture",
      name: "Advanced RAG & Re-ranking",
      weight: 20,
      layerId: "llm-engineer-4",
      description:
        "Hybrid search implementation, cross-encoder re-ranking effectiveness, and retrieval accuracy.",
    },
    {
      id: "agent-execution",
      name: "Agent State Machine",
      weight: 20,
      layerId: "llm-engineer-6",
      description:
        "Robust LangGraph state machine workflow with tool integration, state persistence, and error recovery.",
    },
    {
      id: "safety-evals",
      name: "Guardrails & RAGAS Evals",
      weight: 15,
      layerId: "llm-engineer-8",
      description:
        "Effective prompt injection defense, PII masking, and comprehensive RAGAS automated evaluations.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "llm-engineer-8",
      description:
        "Thorough unit and integration tests covering vector lookup, agent branches, and streaming functionality.",
    },
    {
      id: "docs-ops",
      name: "Deployment & Observability",
      weight: 10,
      layerId: "llm-engineer-10",
      description:
        "Clean container setup, clear environment configurations, and token/latency observability.",
    },
  ],

  twistPool: [
    {
      id: "request-batching",
      text: "Add a request-batching layer to the inference API that groups concurrent prompts and reports throughput versus latency (a vLLM-compatible server is optional, not required).",
    },
    {
      id: "multi-agent",
      text: "Extend the agent system to a multi-agent hierarchy where a supervisor routes queries between specialized domain sub-agents.",
    },
    {
      id: "speculative-decoding",
      text: "Implement speculative decoding using a small draft model to decrease generation latency for standard prompts.",
    },
    {
      id: "prompt-compression",
      text: "Add automated context compression (e.g. LLMLingua) to prune retrieved documents prior to LLM generation.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
