/**
 * Capstone brief — unity track (unity), v1.
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
  trackId: "unity",
  categoryId: "gamedev",
  slug: "unity-dungeon-crawler",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "3D Action Dungeon Crawler in Unity URP",
  summary:
    "Build a 3D isometric dungeon crawler featuring physics-based movement, state-driven AI, " +
    "ScriptableObject-driven abilities, custom URP visual effects, and local save/load persistence.",
  stack: [
    "Unity",
    "C#",
    "Universal Render Pipeline (URP)",
    "Input System",
    "NavMesh",
  ],

  requirements: [
    {
      id: "player-movement",
      text: "Player moves and rotates using Unity's new Input System, driving an Animator Blend Tree for movement states.",
    },
    {
      id: "physics-combat",
      text: "Combat uses physics Raycasts and OverlapSphere triggers to register directional melee hits and apply knockback.",
    },
    {
      id: "enemy-ai",
      text: "Enemies use NavMeshAgent with a finite state machine supporting patrol, line-of-sight chase, and attack states.",
    },
    {
      id: "scriptable-abilities",
      text: "Abilities, weapons, and enemy stats are defined using ScriptableObjects to decouple data from logic.",
    },
    {
      id: "urp-vfx",
      text: "Visual effects use URP Shader Graph for custom hit highlights/dissolves and a Particle System for combat impacts.",
    },
    {
      id: "save-system",
      text: "Game state (player stats, inventory items, and unlocked doors) persists locally using JSON serialization.",
    },
    {
      id: "ui-system",
      text: "Canvas UI displays player health/energy bars, active abilities, and a functional pause/game-over screen.",
    },
    {
      id: "audio-vfx",
      text: "Combat and ambient sound effects are routed through AudioMixer groups with spatial 3D positional audio.",
    },
    {
      id: "tests",
      text: "Unit and integration tests verify player health logic, damage calculation, and JSON save/load serialization.",
      check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] },
    },
    {
      id: "readme",
      text: "README outlines setup steps, Unity version used, control bindings, and playtesting instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "A CI workflow validates C# syntax, code style, or runs Unity automated tests on push.",
      check: CHECKS.ci,
    },
    {
      id: "meta-files",
      text: "Unity project structure includes standard Assets folder and valid .meta files for version control.",
      check: { type: "file", glob: "Assets/**/*.meta" },
    },
  ],

  rubric: [
    {
      id: "core-gameplay",
      name: "Gameplay & Physics Mechanics",
      weight: 20,
      layerId: "unity-3",
      description:
        "Smooth physics-driven movement, responsive input handling, and reliable collision/combat detection.",
    },
    {
      id: "ai-navigation",
      name: "Enemy AI & Pathfinding",
      weight: 20,
      layerId: "unity-9",
      description:
        "Clean state machine flow, proper NavMesh navigation, and reliable line-of-sight target detection.",
    },
    {
      id: "architecture",
      name: "Data Architecture & ScriptableObjects",
      weight: 20,
      layerId: "unity-8",
      description:
        "Effective use of ScriptableObjects for modular stats and abilities, paired with clean JSON persistence.",
    },
    {
      id: "graphics-vfx",
      name: "Shaders & Visual Polish",
      weight: 15,
      layerId: "unity-7",
      description:
        "URP Shader Graph assets, materials, and particle systems integrated cleanly into gameplay callbacks.",
    },
    {
      id: "ui-audio",
      name: "UI & Audio Integration",
      weight: 15,
      layerId: "unity-4",
      description:
        "Robust canvas setup, dynamic HUD bindings, game state transitions, and well-mixed 3D spatial audio.",
    },
    {
      id: "docs-tests",
      name: "Testing & Documentation",
      weight: 10,
      layerId: "unity-10",
      description:
        "Comprehensive README and automated test coverage for core game logic and serialization.",
    },
  ],

  twistPool: [
    {
      id: "elemental-combos",
      text: "Implement an elemental status system (Fire, Ice, Lightning) where combining elements on an enemy triggers reactive effects like Shatter or Explosion.",
    },
    {
      id: "object-pooling",
      text: "Build a generic object pool manager for projectile entities and hit visual particles, completely eliminating Runtime Instantiation during combat.",
    },
    {
      id: "dynamic-dungeon",
      text: "Create a room-based dungeon layout generator that spawns prefab rooms at runtime using ScriptableObject room definitions.",
    },
    {
      id: "boss-phases",
      text: "Add a multi-phase boss encounter with custom Shader Graph transition effects and distinct attack patterns per phase.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
