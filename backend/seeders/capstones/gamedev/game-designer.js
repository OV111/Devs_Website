/**
 * Capstone brief — game-designer track (game-designer), v1.
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
  trackId: "game-designer",
  categoryId: "gamedev",
  slug: "game-designer-system-prototype",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Game Design Document & Playable System Prototype",
  summary:
    "Author a complete Game Design Document (GDD) and economic balance model alongside a playable " +
    "Unity graybox prototype showcasing core loop mechanics, enemy pacing, and a branching narrative.",
  stack: [
    "Unity or Godot",
    "Game Design Document (Markdown)",
    "Spreadsheet Model (CSV/XLSX)",
    "Twine",
  ],

  requirements: [
    {
      id: "gdd-doc",
      text: "Provide a comprehensive Game Design Document detailing core pillars, target audience, core loop, mechanics, dynamics, and aesthetics.",
      check: { type: "file", glob: ["docs/GDD.md", "GDD.md", "GDD.pdf"] },
    },
    {
      id: "economy-model",
      text: "Include an economic/progression balance spreadsheet detailing currency taps/sinks, XP curves, and stat scaling formulas.",
      check: { type: "file", glob: ["docs/*.{csv,xlsx}", "*.{csv,xlsx}"] },
    },
    {
      id: "graybox-prototype",
      text: "Build a playable 3D/2D graybox prototype demonstrating the core mechanics, level flow, and player traversal.",
      check: { type: "file", glob: ["Assets/**/*", "scenes/**/*"] },
    },
    {
      id: "encounter-pacing",
      text: "Design a level encounter featuring explicit onboarding, teaching mechanics through level geometry, and a distinct difficulty curve.",
    },
    {
      id: "narrative-branching",
      text: "Integrate a branching dialogue or quest narrative tree authored in Twine or embedded in the prototype.",
      check: {
        type: "file",
        glob: ["**/*.html", "docs/**/*.tw", "**/dialogue*.*"],
      },
    },
    {
      id: "playtest-plan",
      text: "Deliver a playtest kit containing a playtest session plan, survey questions, qualitative feedback log, and iteration actions.",
      check: { type: "file", glob: ["docs/playtest*.*", "PLAYTEST.md"] },
    },
    {
      id: "ux-hud",
      text: "Design a HUD providing clear affordances, combat feedback, resource counters, and an accessible settings menu.",
    },
    {
      id: "tests",
      text: "Automated or unit tests verify structural balance formulas, dialogue state changes, or game manager score reset logic.",
      check: {
        type: "file",
        glob: ["**/Tests/**/*.cs", "tests/**/*.gd", "**/*.test.*"],
      },
    },
    {
      id: "readme",
      text: "README summarizes project vision, core design pillars, controls, and instructions to run the prototype and read documents.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow validates Markdown links, repo file constraints, or project build integrity.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "design-doc-quality",
      name: "Game Design Document & Vision",
      weight: 20,
      layerId: "game-designer-2",
      description:
        "Clarity of design pillars, core loop definition, mechanics specification, and scope control.",
    },
    {
      id: "systems-balancing",
      name: "System Economy & Balance",
      weight: 20,
      layerId: "game-designer-7",
      description:
        "Mathematical rigor in spreadsheet modeling, progression curves, resource taps, and sink ratios.",
    },
    {
      id: "graybox-level-design",
      name: "Level & Encounter Design",
      weight: 20,
      layerId: "game-designer-4",
      description:
        "Effective pacing, clear player signposting, teaching mechanics without heavy tutorials, and spatial flow.",
    },
    {
      id: "narrative-integration",
      name: "Narrative & UX Design",
      weight: 15,
      layerId: "game-designer-6",
      description:
        "Meaningful narrative choices, coherent worldbuilding, and clear HUD feedback/affordances.",
    },
    {
      id: "playtesting-iteration",
      name: "Playtesting & UX Methodology",
      weight: 15,
      layerId: "game-designer-9",
      description:
        "Structured feedback collection, insightful synthesis of player observations, and documented design tweaks.",
    },
    {
      id: "docs-testing",
      name: "Documentation & Technical Verification",
      weight: 10,
      layerId: "game-designer-10",
      description:
        "Comprehensive README guidelines and test validation for state transitions or economic balance formulas.",
    },
  ],

  twistPool: [
    {
      id: "risk-reward-mechanic",
      text: "Design and implement a core 'Risk vs. Reward' push-your-luck mechanic (e.g., cursed items that grant power at the cost of environment difficulty).",
    },
    {
      id: "dynamic-difficulty",
      text: "Model and implement a dynamic difficulty adjustment (DDA) system that scales enemy health and resource drop rates based on player performance.",
    },
    {
      id: "accessibility-overhaul",
      text: "Incorporate high-contrast modes, scalable UI text, and customizable keybind remapping into the prototype and GDD specifications.",
    },
    {
      id: "vertical-slice-pitch",
      text: "Include a 10-slide executive pitch deck (PDF/Markdown) outlining production timeline, target market benchmarks, and monetization models.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
