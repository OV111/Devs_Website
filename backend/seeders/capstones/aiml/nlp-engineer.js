/**
 * Capstone brief — nlp-engineer track (nlp-engineer), v1.
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
  stack: [
    "Python",
    "PyTorch",
    "Hugging Face",
    "FastAPI",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "text-preprocessing",
      text: "Implements custom tokenization, regex cleaning, and normalization utilities for unstructured documents.",
    },
    {
      id: "baseline-nlp",
      text: "Trains a classical NLP baseline (TF-IDF + SVM/Logistic Regression) for text classification to establish benchmarks.",
    },
    {
      id: "transformer-fine-tuning",
      text: "Fine-tunes a Hugging Face Transformer model using LoRA or full Trainer API for domain-specific entity extraction.",
    },
    {
      id: "evaluation-suite",
      text: "Evaluates model performance using seqeval for token-level precision, recall, and F1 score per entity type.",
    },
    {
      id: "model-export",
      text: "Exports fine-tuned PyTorch model weights to ONNX format with dynamic axis shapes for optimized runtime batching.",
    },
    {
      id: "fastapi-service",
      text: "FastAPI endpoint accepts raw text or PDF documents and returns structured extracted entities with confidence scores.",
    },
    {
      id: "tests",
      text: "Pytest suite covers text normalization, token alignment, model output schema validation, and inference endpoints.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README details dataset prep, fine-tuning scripts, evaluation scorecards, and local inference setup.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configuration for Hugging Face Hub access tokens and model paths.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "A Dockerfile packages the FastAPI service and ONNX runtime environment for reproducible container execution.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow automates code linting, type checks, and pytest execution on repository push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "text-processing",
      name: "Preprocessing & Token Alignment",
      weight: 20,
      layerId: "nlp-engineer-2",
      description:
        "Correct handling of character-level subword token alignment, regex normalization, and raw text cleaning.",
    },
    {
      id: "fine-tuning",
      name: "Transformer Fine-Tuning & PEFT",
      weight: 25,
      layerId: "nlp-engineer-8",
      description:
        "Effective transfer learning setup using Hugging Face Trainer or LoRA, correct loss calculation, and convergence.",
    },
    {
      id: "evaluation",
      name: "Evaluation & Benchmarking",
      weight: 15,
      layerId: "nlp-engineer-9",
      description:
        "Rigorous evaluation with seqeval, entity-level classification reports, and baseline comparison.",
    },
    {
      id: "optimization",
      name: "ONNX Export & Latency Tuning",
      weight: 15,
      layerId: "nlp-engineer-10",
      description:
        "Correct ONNX export, dynamic dimension configuration, and latency reduction in inference.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "nlp-engineer-10",
      description:
        "Thorough unit tests for tokenizers, post-processing offset mappings, and API endpoints.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Containerization",
      weight: 10,
      layerId: "nlp-engineer-10",
      description:
        "Complete setup instructions, reproducible training commands, and isolated container build.",
    },
  ],

  twistPool: [
    {
      id: "quantization",
      text: "Apply 8-bit dynamic quantization to the ONNX model to decrease memory footprint and accelerate CPU inference latency.",
    },
    {
      id: "active-learning",
      text: "Implement an uncertainty-based active learning sampler that identifies low-confidence predictions for human re-annotation.",
    },
    {
      id: "multilingual-support",
      text: "Extend fine-tuning to a multilingual Transformer (e.g. XLM-RoBERTa) and evaluate cross-lingual NER performance.",
    },
    {
      id: "abstractive-summary",
      text: "Add a secondary summarization pipeline endpoint using a fine-tuned T5 or BART model to generate document abstracts.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
