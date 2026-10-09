/**
 * Capstone brief — tools-dev track (tools-dev), v1.
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
  trackId: "tools-dev",
  categoryId: "gamedev",
  slug: "tools-dev-pipeline-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Level Design Brush & Asset Pipeline Automation Suite",
  summary:
    "Build a custom Unity/Unreal editor extension and standalone PySide/Qt desktop tool for procedural " +
    "level object placement, automated asset validation, and JSON/YAML data serialization.",
  stack: [
    "C# or Python",
    "Unity Editor Scripting or PySide/Qt",
    "JSON/YAML",
    "CLI Automation",
  ],

  requirements: [
    {
      id: "custom-editor-window",
      text: "Build a custom dockable editor window with UI elements, sliders, file pickers, and live scene view raycast placement.",
    },
    {
      id: "level-brush-tool",
      text: "Implement a 3D level editing brush featuring procedural object placement, random rotation/scale jitter, and surface alignment physics.",
    },
    {
      id: "standalone-qt-app",
      text: "Develop a standalone PySide/Qt or C# desktop tool that parses game project assets, edits JSON/YAML config databases, and saves back to disk.",
      check: { type: "file", glob: ["**/*.py", "src/**/*.cs", "**/Qt*"] },
    },
    {
      id: "asset-importer-validator",
      text: "Build an automated asset pipeline validator that inspects imported models/textures for polygon count, naming conventions, and missing colliders.",
    },
    {
      id: "custom-gizmos-handles",
      text: "Implement custom Scene View handles and Gizmos to edit object collision bounds, movement paths, or level triggers visually.",
    },
    {
      id: "command-line-build",
      text: "Provide a command-line automated build script (Python or Shell) that runs asset validation, builds game bundles, and packages output.",
    },
    {
      id: "debug-profiler-overlay",
      text: "Develop an in-game profiling HUD overlay measuring dynamic draw call counts, asset memory usage, and custom execution timers.",
    },
    {
      id: "tests",
      text: "Unit tests cover JSON/YAML schema validation, asset naming verification regex, and coordinate transformation utilities.",
      check: {
        type: "file",
        glob: ["**/Tests/**/*.cs", "tests/**/*.py", "**/*.test.*"],
      },
    },
    {
      id: "readme",
      text: "README features user documentation, installation steps for standalone tools, editor workflow instructions, and CLI command flags.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow executes python/C# linter checks, runs asset pipeline unit tests, and verifies CLI scripts.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "editor-scripting",
      name: "Unity/Unreal Editor Integration",
      weight: 20,
      layerId: "tools-dev-2",
      description:
        "Clean custom editor layouts, robust property drawers, and responsive scene view raycast interactions.",
    },
    {
      id: "content-tooling",
      name: "Level Editing & Placement Tools",
      weight: 20,
      layerId: "tools-dev-6",
      description:
        "Effective brush algorithm, surface normal alignment, rotation jittering, and undo/redo operation support.",
    },
    {
      id: "standalone-qt",
      name: "Standalone GUI Application (Qt/PySide)",
      weight: 15,
      layerId: "tools-dev-4",
      description:
        "Intuitive desktop interface design, proper signals/slots event handling, and error-free JSON/YAML parsing.",
    },
    {
      id: "pipeline-automation",
      name: "Asset Validation & Importers",
      weight: 15,
      layerId: "tools-dev-3",
      description:
        "Strict automated rule checking on texture formats, mesh counts, directory hierarchies, and import settings.",
    },
    {
      id: "cli-ci",
      name: "CLI Automation & Profiling Tools",
      weight: 15,
      layerId: "tools-dev-7",
      description:
        "Robust command-line build automation, automated package deployment, and custom in-game profiler markers.",
    },
    {
      id: "docs-testing",
      name: "User Documentation & Unit Tests",
      weight: 15,
      layerId: "tools-dev-10",
      description:
        "Clear user manuals in README, thorough setup guides, and comprehensive test suites for tool logic.",
    },
  ],

  twistPool: [
    {
      id: "blender-exporter-addon",
      text: "Write a custom Python addon for Blender that exports scene layouts directly into your tool's JSON level format.",
    },
    {
      id: "git-lfs-checker",
      text: "Integrate automatic Git LFS tracking validation into the asset postprocessor to block uncommitted large raw binary assets.",
    },
    {
      id: "spline-road-generator",
      text: "Add a custom spline editing tool in the scene view that deforms a road/path mesh along procedural Bezier curves.",
    },
    {
      id: "localization-csv-sync",
      text: "Implement a Google Sheets / CSV sync utility that downloads and validates game text keys across target languages.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
