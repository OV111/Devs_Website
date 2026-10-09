/**
 * Capstone brief — godot track (godot), v1.
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
  trackId: "godot",
  categoryId: "gamedev",
  slug: "godot-2d-metroidvania",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "2D Action Metroidvania in Godot 4 & GDScript",
  summary:
    "Build a 2D action Metroidvania featuring CharacterBody2D physics, custom signals, state-machine AI, " +
    "TileMap level building, Resource-based data storage, and custom canvas-item shaders.",
  stack: ["Godot 4", "GDScript", "TileMap", "AnimationTree", "GPUParticles2D"],

  requirements: [
    {
      id: "godot-project",
      text: "Repository includes a valid Godot 4 project file (project.godot).",
      check: { type: "file", glob: "project.godot" },
    },
    {
      id: "player-physics",
      text: "Player movement uses CharacterBody2D with move_and_slide, wall jumps, variable jump height, and coyote time.",
    },
    {
      id: "signals-architecture",
      text: "Components communicate using decoupled custom signals and scene composition without hardcoded node references.",
    },
    {
      id: "tilemap-levels",
      text: "Levels are constructed using TileMap/TileSet layers with custom collision layer matrices and navigation regions.",
    },
    {
      id: "animation-state",
      text: "Character animations use AnimationPlayer and AnimationTree state machines for locomotion, attacks, and hurt states.",
    },
    {
      id: "enemy-ai",
      text: "Enemies utilize state-based AI (patrol, chase, attack) combined with NavigationAgent2D for pathfinding.",
    },
    {
      id: "custom-resource",
      text: "Weapon stats, inventory items, and player upgrades are saved and loaded using custom Resource (.tres) files.",
    },
    {
      id: "canvas-shaders",
      text: "Implement at least one custom canvas item shader (e.g., hit-flash effect, water reflection, or dynamic fog).",
    },
    {
      id: "ui-containers",
      text: "Build a responsive UI with Control nodes, HUD bars, inventory screens, and scene switching transitions.",
    },
    {
      id: "tests",
      text: "GDScript unit tests using GdUnit4 or GUT framework cover inventory manipulation, health calculation, and save systems.",
      check: {
        type: "file",
        glob: ["test/**/*.gd", "addons/gut/**", "**/test_*.gd"],
      },
    },
    {
      id: "readme",
      text: "README describes controls, Godot version, project structure, and instructions to run tests.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks GDScript code formatting, linting, or runs headless Godot unit tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "godot-architecture",
      name: "Nodes, Signals & Scene Composition",
      weight: 20,
      layerId: "godot-2",
      description:
        "Clean scene hierarchy, effective custom signals usage, and avoidance of fragile direct node path coupling.",
    },
    {
      id: "physics-controls",
      name: "2D Physics & Movement Feel",
      weight: 20,
      layerId: "godot-3",
      description:
        "Smooth movement mechanics using CharacterBody2D, responsive jump physics, and accurate collision handling.",
    },
    {
      id: "ai-navigation",
      name: "Enemy AI & TileMap Levels",
      weight: 15,
      layerId: "godot-9",
      description:
        "Robust state-based AI behavior, efficient TileMap construction, and accurate pathfinding via Navigation2D.",
    },
    {
      id: "resources-data",
      name: "Resource Files & Architecture",
      weight: 15,
      layerId: "godot-8",
      description:
        "Effective design using custom Resource files for extensible item/ability data storage and state save games.",
    },
    {
      id: "shaders-ui",
      name: "UI, Audio & Shaders Polish",
      weight: 15,
      layerId: "godot-7",
      description:
        "Clean UI container layouts, functional canvas shaders, particle effects, and polished animation state transitions.",
    },
    {
      id: "docs-testing",
      name: "Testing & Documentation",
      weight: 15,
      layerId: "godot-10",
      description:
        "Clear README documentation and automated GDScript test execution covering essential gameplay systems.",
    },
  ],

  twistPool: [
    {
      id: "csharp-module",
      text: "Rewrite the combat damage calculator and status effect manager into C# using C# scripts integrated with GDScript.",
    },
    {
      id: "grappling-hook",
      text: "Add a physics-driven raycast grappling hook that swings the character around anchor points using RigidBody2D impulses.",
    },
    {
      id: "procedural-room-spawner",
      text: "Create an active room spawner that instantiates tilemap scenes procedurally with doors connected by signals.",
    },
    {
      id: "time-rewind",
      text: "Implement a time-rewind mechanic that records player state snapshots for 5 seconds and plays them backward upon button press.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
