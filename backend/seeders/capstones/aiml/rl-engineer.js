/**
 * Capstone brief — rl-engineer track (rl-engineer), v1.
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
  stack: [
    "Python",
    "PyTorch",
    "Gymnasium",
    "Ray RLlib",
    "FastAPI",
    "Docker",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "custom-environment",
      text: "Implements a custom Gymnasium environment defining action/observation spaces, step transitions, reward shaping, and reset logic.",
    },
    {
      id: "dqn-baseline",
      text: "Implements a custom Deep Q-Network (DQN) in PyTorch with experience replay buffer and target network update steps.",
    },
    {
      id: "ppo-rllib",
      text: "Trains a scalable Proximal Policy Optimization (PPO) agent using Ray RLlib or Stable-Baselines3 on vectorized environments.",
    },
    {
      id: "reward-shaping",
      text: "Designs and documents reward shaping functions preventing policy exploitation and encouraging goal convergence.",
    },
    {
      id: "metrics-logging",
      text: "Logs episode rewards, policy loss, value loss, and entropy metrics using MLflow, TensorBoard, or Weights & Biases.",
    },
    {
      id: "policy-serving",
      text: "FastAPI endpoint loads exported policy checkpoints and evaluates incoming state observations to return actions in real-time.",
    },
    {
      id: "tests",
      text: "Pytest suite verifies environment reset/step transitions, tensor observation shapes, and inference API response structures.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README documents environment formulation, reward design trade-offs, training convergence curves, and serving setup.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with configuration for environment hyperparameters, training seed, and checkpoint paths.",
      check: CHECKS.envExample,
    },
    {
      id: "docker",
      text: "Dockerfile packages the FastAPI policy server and environment runtime for containerized execution.",
      check: CHECKS.dockerfile,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes code linting and unit test suite on repository push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "environment-design",
      name: "Gymnasium Environment & Reward Design",
      weight: 20,
      layerId: "rl-engineer-8",
      description:
        "Correct Gymnasium API adherence, well-defined observation/action spaces, and balanced reward shaping.",
    },
    {
      id: "algorithmic-correctness",
      name: "DQN & PyTorch Implementation",
      weight: 20,
      layerId: "rl-engineer-5",
      description:
        "Accurate implementation of Q-learning logic, experience replay sampling, target networks, and gradient updates.",
    },
    {
      id: "distributed-rl",
      name: "Scaling with PPO & Ray RLlib",
      weight: 20,
      layerId: "rl-engineer-9",
      description:
        "Effective Ray RLlib configuration, training convergence, and proper hyperparameter setup.",
    },
    {
      id: "policy-deployment",
      name: "Policy Serving & Inference",
      weight: 15,
      layerId: "rl-engineer-10",
      description:
        "Low-latency policy execution in FastAPI accepting state inputs and outputting deterministic or stochastic actions.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "rl-engineer-8",
      description:
        "Thorough testing of environment state transitions, reward edge cases, and policy forward passes.",
    },
    {
      id: "docs-ops",
      name: "Documentation & Containerization",
      weight: 10,
      layerId: "rl-engineer-10",
      description:
        "Comprehensive README with convergence plots and working Docker build for deployment.",
    },
  ],

  twistPool: [
    {
      id: "offline-rl",
      text: "Implement an Offline RL algorithm (e.g. CQL or BCQ) training the policy purely on pre-collected historical trajectory datasets.",
    },
    {
      id: "curriculum-learning",
      text: "Add a curriculum learning manager that progressively increases environment difficulty parameters during training.",
    },
    {
      id: "action-masking",
      text: "Implement invalid action masking within the Gymnasium environment and policy network to handle dynamic constraint sets.",
    },
    {
      id: "sim-to-real",
      text: "Incorporate domain randomization (randomizing friction, mass, or noise) to improve model robustness across parameter variations.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
