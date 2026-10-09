/**
 * Capstone brief — game-ai track (game-ai), v1.
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
  trackId: "game-ai",
  categoryId: "gamedev",
  slug: "game-ai-stealth-tactical-arena",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Tactical Stealth & Combat AI Simulation",
  summary:
    "Architect an AI framework featuring Behavior Trees, Goal-Oriented Action Planning (GOAP), " +
    "perception sensing systems, squad coordination, and custom A* pathfinding.",
  stack: [
    "C++ or C#",
    "Unity or Unreal Engine",
    "A* Pathfinding",
    "Behavior Trees",
    "GOAP",
  ],

  requirements: [
    {
      id: "a-star-pathfinding",
      text: "Implement a custom A* pathfinding grid/graph system with custom node cost weights and terrain traversal penalties.",
    },
    {
      id: "steering-behaviors",
      text: "Integrate steering behaviors including obstacle avoidance, arrival, seeking, and path following.",
    },
    {
      id: "behavior-tree",
      text: "Build a Behavior Tree system containing Sequence, Selector, Decorator nodes, and a shared Blackboard.",
    },
    {
      id: "perception-sensing",
      text: "Implement vision cones (line-of-sight raycasts) and sound perception events with alert decay and last-known location memory.",
    },
    {
      id: "goap-planner",
      text: "Implement a Goal-Oriented Action Planner (GOAP) that dynamically evaluates preconditions and effects to achieve high-level goals.",
    },
    {
      id: "squad-coordination",
      text: "Implement squad level AI using role assignments (e.g., Flanker, Suppressor, Leader) and a shared tactical blackboard.",
    },
    {
      id: "debug-visualization",
      text: "Provide visual debug overlays depicting path gizmos, vision cones, current AI state text, and target locations.",
    },
    {
      id: "ai-budgeting",
      text: "Time-slice AI perception and pathfinding updates across frames to keep execution within a strict CPU millisecond budget.",
    },
    {
      id: "tests",
      text: "Unit tests verify A* shortest path accuracy, Behavior Tree execution status flow, and GOAP plan generation.",
      check: {
        type: "file",
        glob: ["**/Tests/**/*.cs", "Source/**/*.cpp", "**/*.test.*"],
      },
    },
    {
      id: "readme",
      text: "README details architecture, AI system design, instructions for running the simulation, and debug toggle controls.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow verifies C++/C# code syntax, runs unit test suite, and checks formatting.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "pathfinding-steering",
      name: "Pathfinding & Steering Behaviors",
      weight: 20,
      layerId: "game-ai-3",
      description:
        "Correct implementation of A* pathfinding algorithm, grid generation, and smooth steering forces.",
    },
    {
      id: "behavior-trees",
      name: "Behavior Trees & State Flow",
      weight: 20,
      layerId: "game-ai-5",
      description:
        "Modular tree node design, clean blackboard state reads/writes, and predictable composite status updates.",
    },
    {
      id: "perception-sensing",
      name: "Perception & Sensing Systems",
      weight: 15,
      layerId: "game-ai-6",
      description:
        "Accurate vision cone raycasts, realistic sound event propagation, and reliable target memory decay.",
    },
    {
      id: "goap-planning",
      name: "GOAP & Utility Systems",
      weight: 15,
      layerId: "game-ai-7",
      description:
        "Effective goal solver, valid state precondition checks, dynamic action costs, and plan execution.",
    },
    {
      id: "squad-coordination",
      name: "Squad Tactics & Optimization",
      weight: 15,
      layerId: "game-ai-9",
      description:
        "Coordinated team roles, shared tactical knowledge, and frame-budgeted AI updates.",
    },
    {
      id: "docs-testing",
      name: "Debugging, Testing & Docs",
      weight: 15,
      layerId: "game-ai-10",
      description:
        "In-game debug visualizers, thorough unit test coverage, and clear architectural documentation.",
    },
  ],

  twistPool: [
    {
      id: "influence-maps",
      text: "Implement dynamic influence maps for tactical positioning, guiding AI agents toward high-cover or high-vantage grid cells.",
    },
    {
      id: "utility-scoring",
      text: "Add a Utility AI scoring layer using response curves to choose between competing goals based on agent health, ammo, and distance.",
    },
    {
      id: "hierarchical-fsm",
      text: "Implement a Hierarchical State Machine (HFSM) managing high-level state (In Combat, Idle, Investigating) above the Behavior Tree.",
    },
    {
      id: "dynamic-navmesh-cutting",
      text: "Enable dynamic obstacle placement that cuts NavMesh paths at runtime, forcing AI agents to immediately recalculate routes.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
