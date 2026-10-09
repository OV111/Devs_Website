/**
 * Capstone brief — gameplay-engineer track (gameplay-engineer), v1.
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
  trackId: "gameplay-engineer",
  categoryId: "gamedev",
  slug: "gameplay-engineer-action-platformer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Modular Combat & Kinematic Controller Systems",
  summary:
    "Engineers an authoritative kinematic character controller, customizable combat combo system, " +
    "data-driven inventory, and dynamic camera shake/game feel architecture in C# or C++.",
  stack: [
    "C# or C++",
    "Unity or Unreal Engine",
    "Custom Kinematic Physics",
    "Custom Editor Tools",
  ],

  requirements: [
    {
      id: "kinematic-controller",
      text: "Implement a custom kinematic character controller featuring ground detection, slope handling, step offset, coyote time, and jump buffering.",
    },
    {
      id: "combat-hitboxes",
      text: "Build a modular hitbox/hurtbox combat framework that processes attack animation windows, damage formulas, and hit stop/freeze frames.",
    },
    {
      id: "combo-system",
      text: "Create a state-driven melee combo system allowing queued inputs, attack windows, and dynamic branching light/heavy attacks.",
    },
    {
      id: "data-driven-inventory",
      text: "Architect a data-driven inventory and equipment system using ScriptableObjects, JSON, or engine DataTables.",
    },
    {
      id: "procedural-game-feel",
      text: "Implement procedural game feel effects, including dynamic camera shake algorithms, directional hit reaction forces, and time dilation (slow-mo).",
    },
    {
      id: "custom-editor-tools",
      text: "Develop custom editor windows, inspector property drawers, or scene gizmos to visualize hitboxes and edit attack combo data directly.",
    },
    {
      id: "object-pooling",
      text: "Implement a generic object pooling manager for combat VFX and sound instances to maintain zero garbage collection spikes during fighting.",
    },
    {
      id: "debug-cheats",
      text: "Include an in-game developer console or debug overlay with command binds to toggle invincibility, spawn items, and inspect hitbox collision bounds.",
    },
    {
      id: "tests",
      text: "Unit tests cover combat damage mitigation formulas, combo input state transitions, and inventory capacity logic.",
      check: {
        type: "file",
        glob: ["**/Tests/**/*.cs", "Source/**/*.cpp", "**/*.test.*"],
      },
    },
    {
      id: "readme",
      text: "README outlines architectural patterns, character controller math, custom editor usage, and test commands.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks C#/C++ syntax, style linting, and automated test suite execution.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "kinematic-movement",
      name: "Kinematic Controller Physics",
      weight: 20,
      layerId: "gameplay-engineer-3",
      description:
        "Precise raycast/shape sweep ground checking, smooth slope traversal, step handling, and responsive jump feeling.",
    },
    {
      id: "combat-combos",
      name: "Combat Architecture & Combo Systems",
      weight: 20,
      layerId: "gameplay-engineer-4",
      description:
        "Robust hitbox/hurtbox overlap detection, extensible combo state machine, and precise animation windowing.",
    },
    {
      id: "data-systems",
      name: "Data-Driven Systems & Inventories",
      weight: 15,
      layerId: "gameplay-engineer-6",
      description:
        "Decoupled data structures for equipment/items and clean serialization for state retention.",
    },
    {
      id: "editor-tools",
      name: "Editor Tooling & Workflow",
      weight: 15,
      layerId: "gameplay-engineer-8",
      description:
        "Useful custom editor inspectors, scene handles/gizmos for attack bounding boxes, and combat debugging utilities.",
    },
    {
      id: "game-feel-polish",
      name: "Game Feel & Optimization",
      weight: 15,
      layerId: "gameplay-engineer-10",
      description:
        "Juicy feedback via screen shake and frame freeze, supported by allocation-free memory object pooling.",
    },
    {
      id: "docs-testing",
      name: "Tests & Architecture Documentation",
      weight: 15,
      layerId: "gameplay-engineer-1",
      description:
        "Thorough unit test coverage for gameplay calculations and clear architectural documentation in the README.",
    },
  ],

  twistPool: [
    {
      id: "wall-running-grapple",
      text: "Extend the kinematic controller with wall-running detection and a momentum-conserving grappling hook.",
    },
    {
      id: "stamina-poise-system",
      text: "Incorporate a posture/poise gauge system where hit land impact forces break enemy blocks and open execute opportunities.",
    },
    {
      id: "rollback-prediction",
      text: "Implement local client prediction and rollback state buffers for player locomotion inputs.",
    },
    {
      id: "procedural-animation-ik",
      text: "Add procedural foot placement Inverse Kinematics (IK) to align feet dynamically to uneven terrain geometry.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
