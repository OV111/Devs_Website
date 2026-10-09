/**
 * Capstone brief — javascript track (javascript), v1.
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
  trackId: "javascript",
  categoryId: "languages",
  slug: "javascript-event-driven-dashboard",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Vanilla JS In-Browser Real-Time Analytics Engine",
  summary:
    "Build a framework-free browser dashboard for real-time data streaming and event analysis. " +
    "You will craft custom Web Components or class-based UI widgets, manage dynamic DOM updates without memory leaks, " +
    "implement asynchronous event emitters, and encapsulate state with closures.",
  stack: [
    "Vanilla JS (ES2022+)",
    "Browser APIs",
    "Node.js (for test runner)",
    "Jest/Vitest",
  ],

  requirements: [
    {
      id: "state-management",
      text: "Implement an asynchronous central store using functional pub/sub pattern and immutable state updates.",
    },
    {
      id: "dom-widgets",
      text: "Create modular dynamic UI widgets rendered purely via native DOM API manipulation and template fragments.",
    },
    {
      id: "event-delegation",
      text: "Use event delegation on container elements to handle dynamic widget actions and interactions.",
    },
    {
      id: "async-stream",
      text: "Stream mock metrics using Promises and async iterators/generators with abort signal support.",
    },
    {
      id: "custom-errors",
      text: "Implement custom Error classes for network timeouts, schema validation, and rendering failures.",
    },
    {
      id: "package-json",
      text: "Repository must contain a standard package.json file with run scripts.",
      check: { type: "file", glob: "package.json" },
    },
    {
      id: "tests",
      text: "Unit tests cover store logic, functional helpers, and event processing.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README documents architecture, DOM delegation strategy, and setup commands.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow validates code linting and runs test suites on every pull request.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "async-patterns",
      name: "Async Control & Streams",
      weight: 20,
      layerId: "javascript-4",
      description:
        "Demonstrates mastery of Promises, async/await, and event stream pipelines without race conditions.",
    },
    {
      id: "dom-browser",
      name: "DOM & Browser APIs",
      weight: 20,
      layerId: "javascript-5",
      description:
        "Efficient DOM manipulation using fragments, delegation, and clean element lifecycle management.",
    },
    {
      id: "functional-patterns",
      name: "FP & Scope Isolation",
      weight: 15,
      layerId: "javascript-9",
      description:
        "Effective use of closures, pure functions, immutability, and higher-order composition.",
    },
    {
      id: "error-handling",
      name: "Error Handling & Debugging",
      weight: 15,
      layerId: "javascript-8",
      description:
        "Proper usage of custom errors, try/catch traps, and asynchronous boundary protection.",
    },
    {
      id: "oop-prototypes",
      name: "Class & Component Design",
      weight: 15,
      layerId: "javascript-3",
      description:
        "Clean class or factory patterns for widget UI entities with proper encapsulation.",
    },
    {
      id: "docs-testing",
      name: "Testing & Documentation",
      weight: 15,
      layerId: "javascript-7",
      description:
        "Clear README setup instructions, proper NPM scripts, and passing test suite.",
    },
  ],

  twistPool: [
    {
      id: "undo-redo",
      text: "Add state history support allowing users to undo and redo state actions using immutable snapshots.",
    },
    {
      id: "offline-persistence",
      text: "Persist incoming stream data in IndexedDB/LocalStorage and sync back on reconnect events.",
    },
    {
      id: "custom-virtual-list",
      text: "Build a light virtual scrolling list in vanilla JS to render thousands of streaming log events smoothly.",
    },
    {
      id: "theme-engine",
      text: "Add a dynamic CSS custom property theme switcher using JS object descriptors and theme state persistence.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
