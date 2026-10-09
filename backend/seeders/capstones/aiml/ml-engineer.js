/**
 * Capstone brief — ml-engineer track (ml-engineer), v1.
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
    {
      id: "eda-cleaning",
      text: "Data preprocessing script cleans missing values, encodes categorical features, and saves processed datasets under data/ processed folder.",
    },
    {
      id: "model-training",
      text: "PyTorch neural network training loop trains a classifier with validation tracking, early stopping, and saved model weights.",
    },
    {
      id: "experiment-tracking",
      text: "MLflow logs model hyperparameters, metrics (F1 score, ROC-AUC), and saved artifacts during training runs.",
    },
    {
      id: "onnx-export",
      text: "Trained PyTorch model is exported to ONNX format with quantization or optimization for efficient inference.",
    },
    {
      id: "fastapi-service",
      text: "FastAPI inference endpoint exposes a POST /predict route accepting JSON payloads and returning prediction probabilities.",
    },
    {
      id: "data-quality",
      text: "Includes automated data validation checks on incoming inference inputs using pydantic or Great Expectations.",
    },
    {
      id: "tests",
      text: "Unit and integration tests verify model loading, tensor transformations, and API response structures.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README explains dataset setup, model training execution, local deployment instructions, and evaluation metrics.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Environment configuration is templated without committed credentials or hardcoded local paths.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "A Dockerfile packages the FastAPI application and ONNX model runtime for single-container serving.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "A CI workflow runs code linting and pytest tests on every repository push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Model Accuracy & Logic",
      weight: 25,
      layerId: "ml-3",
      description:
        "Does the model train successfully, evaluate accurately on held-out data, and achieve acceptable baseline metrics?",
    },
    {
      id: "deep-learning",
      name: "PyTorch Implementation",
      weight: 20,
      layerId: "ml-4",
      description:
        "Clean neural network architecture, correct gradient zeroing, autograd usage, and loss optimization loops.",
    },
    {
      id: "mlops",
      name: "Experiment Tracking & Export",
      weight: 15,
      layerId: "ml-6",
      description:
        "Proper integration of MLflow metrics tracking and correct ONNX artifact export.",
    },
    {
      id: "deployment",
      name: "Inference API",
      weight: 15,
      layerId: "ml-7",
      description:
        "FastAPI application handles async requests smoothly with correct input validation and output schema.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "ml-7",
      description:
        "Pytest suite thoroughly covers data processing transforms, model prediction output shapes, and endpoint failures.",
    },
    {
      id: "docs-ops",
      name: "Reproducibility & Containerization",
      weight: 10,
      layerId: "ml-engineer-10",
      description:
        "Docker setup runs out of the box and documentation provides reproducible execution steps.",
    },
  ],

  twistPool: [
    {
      id: "feature-store",
      text: "Integrate a local Feast feature store to retrieve customer demographic features at inference time based on customer_id.",
    },
    {
      id: "drift-detection",
      text: "Add an automated drift detection routine using Evidently or Great Expectations that logs input parameter drift on prediction requests.",
    },
    {
      id: "batch-inference",
      text: "Implement a secondary batch inference CLI script that processes bulk CSV files and outputs predictions with probability confidence scores.",
    },
    {
      id: "model-fallback",
      text: "Implement a fallback mechanism in FastAPI that reverts to a baseline scikit-learn model if ONNX inference fails or times out.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
