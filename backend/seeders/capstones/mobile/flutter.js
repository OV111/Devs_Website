/**
 * Capstone brief — Flutter Dev track (flutter), v1.
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
  trackId: "flutter",
  categoryId: "mobile",
  slug: "flutter-study-session-planner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline-first study session planner",
  summary:
    "Build a mobile study planner where users create subjects, schedule study sessions and track completion. The app must remain useful offline, persist its data locally, synchronize with a remote API when available and present clear asynchronous states. The project should demonstrate deliberate Flutter architecture rather than putting all behaviour inside widgets.",
  stack: [
    "Dart",
    "Flutter",
    "Riverpod",
    "GoRouter",
    "Dio",
    "Freezed",
    "json_serializable",
    "Isar or Hive",
    "Flutter Test",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "project-structure",
      text: "The project is a runnable Flutter application with a clear separation between presentation, state management and data access.",
    },
    {
      id: "session-crud",
      text: "Users can create, edit, complete and delete study sessions with a subject, scheduled date/time and duration; required fields and invalid durations are rejected.",
    },
    {
      id: "navigation",
      text: "The app uses GoRouter or an equivalent declarative routing setup with separate routes for the schedule, session editor and session details.",
    },
    {
      id: "state-management",
      text: "Riverpod manages the application state and exposes explicit loading, success and failure states for asynchronous operations.",
    },
    {
      id: "local-persistence",
      text: "Study sessions are persisted in local structured storage and remain available after the application is restarted.",
    },
    {
      id: "offline-first",
      text: "Users can create, edit and complete study sessions while offline, with local changes retained until synchronization with the remote API succeeds.",
    },
    {
      id: "networking",
      text: "Dio is used for API communication with deliberate timeout and error handling, and a failed synchronization never discards the local copy of a session.",
    },
    {
      id: "ui-states",
      text: "The schedule UI visibly handles loading, empty and error states, and each state gives the user a meaningful next action or recovery path.",
    },
    {
      id: "tests",
      text: "Automated tests cover core session logic or a Riverpod provider and include widget tests for at least one important user interaction; tests run without a device or emulator.",
      check: { type: "file", glob: "test/**/*_test.dart" },
    },
    {
      id: "readme",
      text: "README explains Flutter setup, how to run the app in an emulator or simulator, configuration, how to run tests and how offline synchronization works.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs Flutter tests without requiring a device or emulator.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "flutter-config",
      text: "The repository contains the Flutter package configuration with its dependencies and SDK constraints.",
      check: { type: "file", glob: "pubspec.yaml" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "flutter-2",
      description:
        "The study planner's core flows, forms, validation and displayed data behave correctly across normal and edge cases.",
    },
    {
      id: "state-architecture",
      name: "State management & architecture",
      weight: 20,
      layerId: "flutter-3",
      description:
        "Riverpod state is structured around meaningful responsibilities, with asynchronous states represented explicitly and widgets kept focused on presentation.",
    },
    {
      id: "navigation-data",
      name: "Navigation & data",
      weight: 15,
      layerId: "flutter-4",
      description:
        "Routing is predictable and the networking, serialization and persistence layers have clear responsibilities.",
    },
    {
      id: "offline-networking",
      name: "Offline & networking",
      weight: 15,
      layerId: "flutter-5",
      description:
        "The application remains usable offline, persists local changes, synchronizes deliberately and handles API failures without data loss.",
    },
    {
      id: "testing",
      name: "Testing",
      weight: 15,
      layerId: "flutter-7",
      description:
        "Unit and widget tests verify meaningful business and UI behaviour, including failure or empty states where appropriate.",
    },
    {
      id: "delivery",
      name: "Delivery quality",
      weight: 10,
      layerId: "flutter-8",
      description:
        "The project is runnable in an emulator or simulator, documented clearly and validated automatically through CI.",
    },
  ],

  twistPool: [
    {
      id: "pomodoro",
      text: "Add a built-in study timer that can start, pause, resume and finish a session, preserving the timer state when the app moves between screens.",
    },
    {
      id: "streaks",
      text: "Add a study streak calculation based on completed sessions, handling missed days, multiple sessions on one day and sessions created while offline.",
    },
    {
      id: "attachments",
      text: "Allow each study session to contain locally stored attachments selected from the device gallery, and keep attachment references available while offline.",
    },
    {
      id: "calendar",
      text: "Add a calendar view that groups scheduled sessions by day and lets the user select a date to filter the session list.",
    },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
