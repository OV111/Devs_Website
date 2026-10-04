/**
 * Capstone brief — Ionic Developer track (ionic), v1.
 *
 * DRAFT by ChatGPT, 2026-10-04 — status stays "draft" until a human has read
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
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "ionic",
  categoryId: "mobile",
  slug: "ionic-grocery-planner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline-first grocery planner",
  summary:
    "Build an Ionic mobile grocery planner where users organize shopping lists, manage quantities and mark items as purchased. The app must remain useful without connectivity, persist local data, synchronize with a REST API when available and use Capacitor for at least one native device capability. Automated tests must run without a device or emulator.",
  stack: [
    "Ionic",
    "Angular",
    "TypeScript",
    "RxJS",
    "Capacitor",
    "Angular HttpClient",
    "Ionic Storage or SQLite",
    "Jasmine",
    "Karma",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "list-crud",
      text: "Users can create, rename and delete grocery lists, and can add, edit, mark purchased and remove items within each list.",
    },
    {
      id: "validation",
      text: "Required list and item names cannot be saved empty, quantities must be valid positive values, and invalid form submissions display an actionable validation message.",
    },
    {
      id: "angular-structure",
      text: "The application uses Angular components and services with dependency injection, keeping API, persistence and business operations out of page templates.",
    },
    {
      id: "navigation",
      text: "Ionic Angular routing provides separate routes for the list overview, a selected grocery list and item editing, with route parameters used to identify the selected list.",
    },
    {
      id: "state-management",
      text: "Application state is represented with services and RxJS subjects, signals or another explicit reactive state mechanism rather than relying on mutable component fields shared across screens.",
    },
    {
      id: "local-storage",
      text: "Grocery lists and items are persisted locally using Ionic Storage, SQLite or another appropriate Capacitor-compatible local store and survive application restarts.",
    },
    {
      id: "offline-first",
      text: "Users can create, edit, purchase and remove grocery items while offline, and local changes are retained until synchronization with the remote API succeeds.",
    },
    {
      id: "http-sync",
      text: "Angular HttpClient consumes a REST API through a dedicated data service, with authentication or request configuration handled centrally when required and HTTP failures represented explicitly.",
    },
    {
      id: "ui-states",
      text: "The primary grocery-list UI visibly handles loading, empty and error states, and each state provides a meaningful action or recovery path.",
    },
    {
      id: "capacitor-feature",
      text: "The app uses at least one Capacitor device capability, such as Camera or Geolocation, and handles unavailable permissions or unsupported environments without crashing.",
    },
    {
      id: "tests",
      text: "Automated tests cover at least one Angular service or state flow and one component interaction, and the test suite runs without requiring a device or emulator.",
      check: { type: "file", glob: ["**/*.spec.ts", "**/*.test.ts"] },
    },
    {
      id: "readme",
      text: "README explains Node and Ionic setup, how to run the app in an emulator or simulator, how to run automated tests and how local/offline synchronization works.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs the automated test suite without requiring a physical device or emulator.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "ionic-3",
      description:
        "The grocery workflows, Ionic components and validation behave correctly across normal, invalid and empty-data cases.",
    },
    {
      id: "angular",
      name: "Angular architecture",
      weight: 20,
      layerId: "ionic-2",
      description:
        "Components, services, dependency injection and reactive state have clear responsibilities and avoid unnecessary coupling.",
    },
    {
      id: "navigation-state",
      name: "Navigation & state",
      weight: 15,
      layerId: "ionic-4",
      description:
        "Routes, parameters and reactive application state remain predictable as users move between grocery lists and item screens.",
    },
    {
      id: "offline-data",
      name: "Data & offline behaviour",
      weight: 20,
      layerId: "ionic-8",
      description:
        "Local persistence, REST access and synchronization preserve user data and behave correctly when connectivity is unavailable or requests fail.",
    },
    {
      id: "native",
      name: "Native integration",
      weight: 10,
      layerId: "ionic-7",
      description:
        "The Capacitor capability is integrated appropriately, with permission and unsupported-environment handling.",
    },
    {
      id: "testing",
      name: "Testing & delivery",
      weight: 10,
      layerId: "ionic-9",
      description:
        "Automated tests verify meaningful service and UI behaviour without a device, and setup is reproducible through documentation and CI.",
    },
  ],

  twistPool: [
    {
      id: "categories",
      text: "Add item categories and a category-filtered shopping view, with each item's category persisted locally and retained through synchronization.",
    },
    {
      id: "shared-list",
      text: "Add a local mock collaboration mode where a grocery list can be assigned to another named household member, and each item records which member last changed it.",
    },
    {
      id: "price-tracking",
      text: "Add an optional estimated price to grocery items and calculate the total estimated cost for each list, correctly handling missing prices and quantity changes.",
    },
    {
      id: "recurring-items",
      text: "Add recurring grocery items that can be configured with a repeat interval and automatically reappear as unpurchased items when their next scheduled date is reached.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
