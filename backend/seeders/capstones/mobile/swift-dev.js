/**
 * Capstone brief — Swift Developer track (swift-dev), v1.
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
  trackId: "swift-dev",
  categoryId: "mobile",
  slug: "swift-dev-habit-journal",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline habit journal",
  summary:
    "Build a native Swift application for tracking daily habits and short journal entries. The app must provide a SwiftUI interface, persist data locally, load and filter entries, and remain fully usable without network access. Use protocols, value types, modern concurrency and a testable architecture rather than coupling all behaviour to views.",
  stack: [
    "Swift",
    "SwiftUI",
    "Observation",
    "SwiftData",
    "URLSession",
    "Codable",
    "async/await",
    "Combine",
    "Swift Testing",
    "XCTest",
    "Swift Package Manager",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "habit-crud",
      text: "Users can create habits, mark them complete for a selected date, edit habit details and delete habits.",
    },
    {
      id: "journal",
      text: "Users can create, edit and delete dated journal entries associated with a habit, with empty titles or entries rejected where the product requires content.",
    },
    {
      id: "swiftui",
      text: "The application uses SwiftUI views and appropriate state/data-flow mechanisms, with presentation kept separate from domain and persistence logic.",
    },
    {
      id: "protocols",
      text: "External data access is abstracted behind protocols so application logic can be tested with an in-memory or mock implementation.",
    },
    {
      id: "local-data",
      text: "Habit and journal data are persisted locally and remain available after the application is terminated and relaunched.",
    },
    {
      id: "offline",
      text: "Creating, editing and completing habits and journal entries works without a network connection and does not depend on a remote request succeeding.",
    },
    {
      id: "async-sync",
      text: "If a REST synchronization path is implemented, it uses async/await with explicit HTTP and decoding failure handling and never replaces valid local data with an empty response after a failed request.",
    },
    {
      id: "ui-states",
      text: "The primary list UI visibly handles loading, empty and error states, with an intentional action for retrying or recovering from an error.",
    },
    {
      id: "tests",
      text: "Automated tests cover habit completion or streak logic and at least one asynchronous operation using a test double, and they run without requiring a simulator.",
      check: { type: "file", glob: ["**/*Tests.swift", "**/*Test.swift"] },
    },
    {
      id: "readme",
      text: "README explains the Swift/Xcode requirements, how to run the app in an iOS Simulator, how to run tests and how local data behaves offline.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow runs the Swift test suite on a macOS runner without requiring a physical iPhone or paid developer account.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "swift-project",
      text: "The repository contains a Swift Package or Xcode project that defines the application or its testable core.",
      check: {
        type: "file",
        glob: ["Package.swift", "**/*.xcodeproj/project.pbxproj"],
      },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "swift-dev-5",
      description:
        "Habit tracking, journal editing, date handling and the visible application behaviour satisfy the requirements.",
    },
    {
      id: "swift-types",
      name: "Swift types & semantics",
      weight: 15,
      layerId: "swift-dev-2",
      description:
        "Optionals, enums, structs, classes and error handling model the domain clearly and safely.",
    },
    {
      id: "protocols",
      name: "Protocols & architecture",
      weight: 15,
      layerId: "swift-dev-3",
      description:
        "Protocols, generics and value/reference semantics are used deliberately to create maintainable and testable boundaries.",
    },
    {
      id: "concurrency",
      name: "Memory & concurrency",
      weight: 15,
      layerId: "swift-dev-4",
      description:
        "Async work, cancellation, ownership and reference lifetimes are handled correctly without obvious retain-cycle or race risks.",
    },
    {
      id: "ui-data",
      name: "SwiftUI & data flow",
      weight: 15,
      layerId: "swift-dev-6",
      description:
        "State, bindings, environment dependencies and user input are structured cleanly across the SwiftUI screens.",
    },
    {
      id: "reactive-testing",
      name: "Reactive behaviour & tests",
      weight: 15,
      layerId: "swift-dev-7",
      description:
        "Reactive or asynchronous behaviour is understandable and meaningful automated tests verify important domain and async paths.",
    },
  ],

  twistPool: [
    {
      id: "mood",
      text: "Add a daily mood value to journal entries and a seven-day mood summary that handles missing days without inventing data.",
    },
    {
      id: "streaks",
      text: "Add per-habit streak calculations that correctly handle consecutive completion dates, missed days and multiple completion records for the same date.",
    },
    {
      id: "templates",
      text: "Add reusable journal templates that users can create, edit and apply when starting a new journal entry, with templates persisted locally.",
    },
    {
      id: "insights",
      text: "Add a weekly progress screen that calculates completion percentages from local habit records and displays separate totals for each habit.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
