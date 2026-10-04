/**
 * Capstone brief — Android Dev track (android), v1.
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
  trackId: "android",
  categoryId: "mobile",
  slug: "android-pantry-inventory",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline pantry inventory",
  summary:
    "Build a native Android pantry inventory app where users track household food, quantities and expiration dates. The app must work offline, persist structured data locally, synchronize with a REST API when available and expose clear state-driven UI. The implementation should demonstrate modern Compose architecture rather than concentrating all logic inside composables.",
  stack: [
    "Kotlin",
    "Jetpack Compose",
    "ViewModel",
    "StateFlow",
    "Room",
    "DataStore",
    "Retrofit",
    "OkHttp",
    "Kotlin Serialization",
    "Coroutines",
    "JUnit",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "item-crud",
      text: "Users can add, edit, view and delete pantry items with a name, quantity, unit and expiration date; invalid quantities and missing names cannot be saved.",
    },
    {
      id: "compose-ui",
      text: "The application uses Jetpack Compose for its primary UI and keeps reusable UI elements separate from screen-level state and business logic.",
    },
    {
      id: "architecture",
      text: "ViewModels expose UI state through StateFlow, repositories abstract data sources, and business operations are not implemented directly inside composables.",
    },
    {
      id: "local-database",
      text: "Pantry items are stored in Room and remain available after the application is terminated and relaunched.",
    },
    {
      id: "offline",
      text: "Adding, editing and deleting pantry items works without network access, and local changes remain available until synchronization can occur.",
    },
    {
      id: "networking",
      text: "Retrofit and Kotlin Serialization are used for REST synchronization, with explicit handling for HTTP failures, timeouts and malformed responses.",
    },
    {
      id: "ui-states",
      text: "The pantry screen visibly handles loading, empty and error states, and each state provides a meaningful action or recovery path.",
    },
    {
      id: "stateflow",
      text: "The UI collects state from a lifecycle-aware StateFlow and does not expose mutable application state directly to composables.",
    },
    {
      id: "tests",
      text: "Automated tests cover at least one ViewModel or use case and one repository or persistence behaviour, and they run without requiring an emulator.",
      check: { type: "file", glob: "app/src/test/**/*.kt" },
    },
    {
      id: "readme",
      text: "README explains Android Studio setup, how to run the app in an emulator, how to run tests and how offline synchronization works.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow builds the project and runs JVM tests without requiring an Android emulator.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "android-project",
      text: "The repository contains a Kotlin Android Gradle project with an Android manifest and application source.",
      check: { type: "file", glob: "app/src/main/AndroidManifest.xml" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "android-2",
      description:
        "The Compose UI and pantry workflows behave correctly across normal, invalid and empty-data cases.",
    },
    {
      id: "architecture",
      name: "Architecture",
      weight: 20,
      layerId: "android-3",
      description:
        "ViewModels, StateFlow, repositories and use cases have clear responsibilities and avoid putting application logic in composables.",
    },
    {
      id: "persistence",
      name: "Persistence & offline",
      weight: 15,
      layerId: "android-4",
      description:
        "Room persistence is reliable, structured and sufficient for offline use, with deliberate handling of stored state.",
    },
    {
      id: "networking",
      name: "Networking & concurrency",
      weight: 15,
      layerId: "android-5",
      description:
        "Retrofit, serialization, coroutines and failures are handled deliberately without losing local data.",
    },
    {
      id: "navigation",
      name: "Navigation & UX",
      weight: 10,
      layerId: "android-6",
      description:
        "Screen navigation, state restoration and loading, empty and error presentations form a coherent mobile experience.",
    },
    {
      id: "testing",
      name: "Testing",
      weight: 15,
      layerId: "android-7",
      description:
        "Tests verify meaningful application behaviour and isolate external dependencies without requiring an emulator.",
    },
  ],

  twistPool: [
    {
      id: "barcode",
      text: "Add barcode scanning for pantry items using a locally available or mocked scanner flow, allowing a scanned code to identify an item without requiring a paid service.",
    },
    {
      id: "expiring",
      text: "Add an expiration dashboard that groups items into expired, expiring within seven days and later, using dates calculated consistently from the stored data.",
    },
    {
      id: "stock-history",
      text: "Add quantity adjustment history for each pantry item, recording the previous and new quantity and displaying the history in chronological order.",
    },
    {
      id: "shopping",
      text: "Add a shopping list that can be populated from pantry items below a user-defined minimum quantity and lets users mark shopping items as purchased.",
    },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
