/**
 * Capstone brief — prompt-engineer track (prompt-engineer), v1.
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
  stack: [
    "Python",
    "FastAPI",
    "LangChain or LlamaIndex",
    "Pydantic",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "prompt-templates",
      text: "Implements externalized, versioned prompt templates supporting system roles, few-shot examples, and strict formatting delimiters.",
    },
    {
      id: "structured-output",
      text: "Enforces structured JSON output schemas via function/tool calling and Pydantic validation with automated repair retries.",
    },
    {
      id: "advanced-reasoning",
      text: "Constructs multi-step prompt chains using Chain-of-Thought or ReAct reasoning patterns for complex task decomposition.",
    },
    {
      id: "grounded-rag-prompt",
      text: "Formats retrieved context into grounded prompts with citation enforcement and context window budget management.",
    },
    {
      id: "guardrails-security",
      text: "Implements input/output guardrails detecting prompt injection attempts, system prompt leakage, and unsafe outputs.",
    },
    {
      id: "llm-eval-suite",
      text: "Builds an automated prompt testing framework running benchmark datasets with an LLM-as-judge scoring rubric.",
    },
    {
      id: "fastapi-service",
      text: "FastAPI endpoint serves configured prompt workflows with configurable sampling parameters (temperature, top_p).",
    },
    {
      id: "tests",
      text: "Pytest suite tests prompt template rendering, Pydantic validation parsing, guardrail triggers, and evaluation pipelines.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details prompt engineering techniques, versioning strategy, evaluation scorecards, and deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with API keys, temperature settings, and model routing choices; the project must run on a free-tier provider key or a mocked LLM, so no paid account is required.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Dockerfile packages the FastAPI prompt serving system and configuration assets for containerized deployment.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow automates linting, prompt evaluation runs, and test execution on pull requests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "prompt-design",
      name: "Prompt Design & Structuring",
      weight: 20,
      layerId: "prompt-engineer-2",
      description:
        "Clear instructions, few-shot selection, delimiter usage, and context window budget management.",
    },
    {
      id: "structured-outputs",
      name: "Structured Output & Tool Calling",
      weight: 20,
      layerId: "prompt-engineer-4",
      description:
        "Pydantic schema enforcement, robust function calling, and self-healing output repair mechanisms.",
    },
    {
      id: "advanced-chains",
      name: "Multi-Step Workflows & Chaining",
      weight: 20,
      layerId: "prompt-engineer-3",
      description:
        "Effective execution of Chain-of-Thought, ReAct loops, or prompt chaining for complex reasoning.",
    },
    {
      id: "safety-evals",
      name: "Guardrails & Automated Evals",
      weight: 15,
      layerId: "prompt-engineer-8",
      description:
        "Defense against prompt injections and systematic evaluation benchmarking with LLM-as-judge.",
    },
    {
      id: "tests",
      name: "Testing & Validation",
      weight: 15,
      layerId: "prompt-engineer-7",
      description:
        "Unit tests verifying prompt rendering, output parsing failures, and guardrail interception.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Versioning",
      weight: 10,
      layerId: "prompt-engineer-10",
      description:
        "Comprehensive documentation, structured template version control, and runnable Docker container.",
    },
  ],

  twistPool: [
    {
      id: "prompt-compression",
      text: "Implement prompt compression techniques (e.g. LLMLingua) to trim redundant tokens before API requests.",
    },
    {
      id: "semantic-prompt-cache",
      text: "Incorporate a semantic caching layer to avoid duplicate LLM invocations for semantically identical user queries.",
    },
    {
      id: "model-router",
      text: "Build an automated prompt router that directs simple prompts to a lightweight model (e.g. GPT-4o-mini) and hard queries to a frontier model.",
    },
    {
      id: "tree-of-thought",
      text: "Extend prompt workflows with a Tree-of-Thought search strategy that samples and evaluates multiple reasoning branches.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
