/**
 * Capstone brief — unreal track (unreal), v1.
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
  trackId: "unreal",
  categoryId: "gamedev",
  slug: "unreal-third-person-combat",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "C++ & Gameplay Ability System Action RPG in Unreal Engine",
  summary:
    "Architect a C++ based third-person action game in Unreal Engine utilizing Enhanced Input, " +
    "the Gameplay Ability System (GAS), UMG interfaces, and network-ready property replication.",
  stack: [
    "Unreal Engine 5",
    "C++",
    "Gameplay Ability System (GAS)",
    "Enhanced Input",
    "UMG",
  ],

  requirements: [
    {
      id: "cpp-core",
      text: "Core character and game mode classes are written in C++ using UCLASS, UPROPERTY, and UFUNCTION macros.",
    },
    {
      id: "enhanced-input",
      text: "Player movement, camera control, and actions are configured using Unreal's Enhanced Input system.",
    },
    {
      id: "gas-attributes",
      text: "Health, Stamina, and Mana are managed via a custom C++ Gameplay AttributeSet and AbilitySystemComponent.",
    },
    {
      id: "gas-abilities",
      text: "At least two player abilities (e.g., Light Attack, Fireball) are implemented as Gameplay Abilities with cost and cooldown Gameplay Effects.",
    },
    {
      id: "animation-montages",
      text: "Combat animations use Animation Montages with root motion and Animation Notifications for damage windows.",
    },
    {
      id: "collision-tracing",
      text: "Melee weapon hits are detected via C++ line/shape traces attached to weapon socket transforms during attack notifies.",
    },
    {
      id: "umg-ui",
      text: "UMG Widget UI displays dynamic AttributeSet bars and ability cooldown indicators bound to GAS delegate callbacks.",
    },
    {
      id: "replication-basics",
      text: "Character health and ability activation states replicate across server and client models using replicated properties.",
    },
    {
      id: "tests",
      text: "Unreal Automation Framework C++ tests verify attribute calculations and gameplay effect application.",
      check: { type: "file", glob: ["Source/**/*.cpp", "**/Tests/*.cpp"] },
    },
    {
      id: "uproject",
      text: "Repository includes a valid .uproject file and C++ Source directory structure.",
      check: { type: "file", glob: "*.uproject" },
    },
    {
      id: "readme",
      text: "README documents engine build version, setup instructions, C++ compilation steps, and control scheme.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks C++ code formatting, build syntax, or static analysis.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "cpp-architecture",
      name: "C++ & Unreal Architecture",
      weight: 20,
      layerId: "unreal-3",
      description:
        "Clean separation between C++ logic and Blueprint extensions, proper memory management and macro usage.",
    },
    {
      id: "gas-implementation",
      name: "Gameplay Ability System",
      weight: 20,
      layerId: "unreal-8",
      description:
        "Robust attribute setup, proper application of Gameplay Effects, Tags, and modular ability design.",
    },
    {
      id: "combat-physics",
      name: "Combat Tracing & Physics",
      weight: 15,
      layerId: "unreal-4",
      description:
        "Accurate hit detection using traces, socket placement, and responsive collision channel configurations.",
    },
    {
      id: "anim-ui",
      name: "Animations & UMG Interface",
      weight: 15,
      layerId: "unreal-6",
      description:
        "Fluid animation transitions via montages/notifies and event-driven UMG UI data bindings.",
    },
    {
      id: "multiplayer-replication",
      name: "Replication & Network Readiness",
      weight: 15,
      layerId: "unreal-9",
      description:
        "Attributes and RPC actions are synchronized properly with proper authority checks on server and client.",
    },
    {
      id: "docs-testing",
      name: "Quality Assurance & Docs",
      weight: 15,
      layerId: "unreal-10",
      description:
        "Detailed README documentation and working C++ automation tests for game attributes.",
    },
  ],

  twistPool: [
    {
      id: "lock-on-camera",
      text: "Build a target lock-on camera system in C++ that selects the best enemy target based on camera distance and angle.",
    },
    {
      id: "combo-system",
      text: "Implement a branching melee combo tree where timing windows during attack montages trigger distinct heavy/light follow-up abilities.",
    },
    {
      id: "procedural-dungeon-blockers",
      text: "Create dynamic gameplay doors/barriers using Lumen-reactive material instances that dissolve when specific Gameplay Tags are applied.",
    },
    {
      id: "ai-behavior-tree",
      text: "Implement enemy AI using Behavior Trees and Perception components that execute tactical flanking abilities via GAS.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
