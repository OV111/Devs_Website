/**
 * Capstone brief — iOS Dev track (ios), v1.
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
  trackId: "ios",
  categoryId: "mobile",
  slug: "ios-recipe-organizer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline recipe organizer",
  summary:
    "Build a native SwiftUI recipe organizer for collecting, editing and cooking from recipes. The app must persist its data locally, optionally synchronize with a REST API, handle asynchronous states clearly and remain useful without a network connection. The implementation should demonstrate modern SwiftUI data flow and testable separation between views and application logic.",
  stack: [
    "Swift",
    "SwiftUI",
    "Observation",
    "URLSession",
    "Codable",
    "SwiftData",
    "Swift Testing",
    "XCTest",
    "Xcode",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "recipe-crud",
      text: "Users can create, edit, view and delete recipes with a title, ingredients, instructions and category; required fields cannot be saved empty.",
    },
    {
      id: "swiftui-structure",
      text: "The app uses SwiftUI views with appropriate state and data-flow mechanisms, keeping business and persistence logic out of large view bodies.",
    },
    {
      id: "navigation",
      text: "The app uses NavigationStack to move between the recipe list, recipe editor and recipe detail screens, with a selected recipe represented by a typed or identifiable value.",
    },
    {
      id: "persistence",
      text: "Recipes are persisted locally with SwiftData and remain available after the app is terminated and relaunched.",
    },
    {
      id: "offline",
      text: "Users can create, edit and delete recipes while offline, and local changes remain available without waiting for a network request.",
    },
    {
      id: "networking",
      text: "A URLSession-based networking layer can fetch or synchronize recipes from a REST API, with Codable models and explicit handling for HTTP and decoding failures.",
    },
    {
      id: "ui-states",
      text: "The recipe list visibly handles loading, empty and error states, and provides an intentional recovery or next action for each state.",
    },
    {
      id: "async-flow",
      text: "Asynchronous work uses Swift concurrency with cancellation-aware tasks where appropriate, and stale or cancelled requests do not overwrite newer screen state.",
    },
    {
      id: "tests",
      text: "Automated tests cover recipe business logic or a view model using test doubles for external dependencies, and tests run without requiring a simulator.",
      check: { type: "file", glob: ["**/*Tests.swift", "**/*Test.swift"] },
    },
    {
      id: "readme",
      text: "README explains the required Xcode version, how to open and run the project in an iOS Simulator, how to run tests and how local/offline data behaves.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds or tests the project using an appropriate macOS runner and does not require a physical iPhone or paid developer account.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "ios-project",
      text: "The repository contains an Xcode project or Swift Package configuration that can be used to build the application.",
      check: {
        type: "file",
        glob: ["**/*.xcodeproj/project.pbxproj", "Package.swift"],
      },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "ios-2",
      description:
        "Recipe creation, editing, deletion, navigation and presentation behave correctly across normal and edge cases.",
    },
    {
      id: "architecture",
      name: "Architecture & data flow",
      weight: 20,
      layerId: "ios-3",
      description:
        "Views, observable state, repositories and data sources have clear responsibilities and remain testable.",
    },
    {
      id: "persistence",
      name: "Persistence",
      weight: 15,
      layerId: "ios-4",
      description:
        "SwiftData models and queries are appropriate, local data survives relaunches and persistence failures are handled deliberately.",
    },
    {
      id: "networking",
      name: "Networking & concurrency",
      weight: 15,
      layerId: "ios-5",
      description:
        "URLSession, Codable and Swift concurrency are used correctly, with deliberate HTTP, decoding, cancellation and failure handling.",
    },
    {
      id: "ui",
      name: "SwiftUI UX",
      weight: 10,
      layerId: "ios-6",
      description:
        "Navigation, state-driven presentation, loading, empty and error states are clear and appropriate for an iOS application.",
    },
    {
      id: "testing-delivery",
      name: "Testing & delivery",
      weight: 15,
      layerId: "ios-7",
      description:
        "Tests isolate dependencies and verify meaningful behaviour, while the project can be built and tested through documented CI.",
    },
  ],

  twistPool: [
    {
      id: "favorites",
      text: "Add a favorites feature that lets users mark recipes as favorites and filter the recipe list to favorites, with the selection persisted locally.",
    },
    {
      id: "shopping-list",
      text: "Add a generated shopping list from selected recipes, merging duplicate ingredients and allowing individual shopping-list items to be marked as purchased.",
    },
    {
      id: "meal-planner",
      text: "Add a weekly meal planner where recipes can be assigned to breakfast, lunch or dinner on a selected date, with assignments persisted locally.",
    },
    {
      id: "search",
      text: "Add recipe search and category filtering that operate against the locally persisted dataset and update results as the user types.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
