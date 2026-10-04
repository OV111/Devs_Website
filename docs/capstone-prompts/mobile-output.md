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
  stack: ["Swift", "SwiftUI", "Observation", "URLSession", "Codable", "SwiftData", "Swift Testing", "XCTest", "Xcode", "GitHub Actions"],

  requirements: [
    { id: "recipe-crud", text: "Users can create, edit, view and delete recipes with a title, ingredients, instructions and category; required fields cannot be saved empty." },
    { id: "swiftui-structure", text: "The app uses SwiftUI views with appropriate state and data-flow mechanisms, keeping business and persistence logic out of large view bodies." },
    { id: "navigation", text: "The app uses NavigationStack to move between the recipe list, recipe editor and recipe detail screens, with a selected recipe represented by a typed or identifiable value." },
    { id: "persistence", text: "Recipes are persisted locally with SwiftData and remain available after the app is terminated and relaunched." },
    { id: "offline", text: "Users can create, edit and delete recipes while offline, and local changes remain available without waiting for a network request." },
    { id: "networking", text: "A URLSession-based networking layer can fetch or synchronize recipes from a REST API, with Codable models and explicit handling for HTTP and decoding failures." },
    { id: "ui-states", text: "The recipe list visibly handles loading, empty and error states, and provides an intentional recovery or next action for each state." },
    { id: "async-flow", text: "Asynchronous work uses Swift concurrency with cancellation-aware tasks where appropriate, and stale or cancelled requests do not overwrite newer screen state." },
    { id: "tests", text: "Automated tests cover recipe business logic or a view model using test doubles for external dependencies, and tests run without requiring a simulator.", check: { type: "file", glob: ["**/*Tests.swift", "**/*Test.swift"] } },
    { id: "readme", text: "README explains the required Xcode version, how to open and run the project in an iOS Simulator, how to run tests and how local/offline data behaves.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds or tests the project using an appropriate macOS runner and does not require a physical iPhone or paid developer account.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "ios-project", text: "The repository contains an Xcode project or Swift Package configuration that can be used to build the application.", check: { type: "file", glob: ["**/*.xcodeproj/project.pbxproj", "Package.swift"] } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "ios-2", description: "Recipe creation, editing, deletion, navigation and presentation behave correctly across normal and edge cases." },
    { id: "architecture", name: "Architecture & data flow", weight: 20, layerId: "ios-3", description: "Views, observable state, repositories and data sources have clear responsibilities and remain testable." },
    { id: "persistence", name: "Persistence", weight: 15, layerId: "ios-4", description: "SwiftData models and queries are appropriate, local data survives relaunches and persistence failures are handled deliberately." },
    { id: "networking", name: "Networking & concurrency", weight: 15, layerId: "ios-5", description: "URLSession, Codable and Swift concurrency are used correctly, with deliberate HTTP, decoding, cancellation and failure handling." },
    { id: "ui", name: "SwiftUI UX", weight: 10, layerId: "ios-6", description: "Navigation, state-driven presentation, loading, empty and error states are clear and appropriate for an iOS application." },
    { id: "testing-delivery", name: "Testing & delivery", weight: 15, layerId: "ios-7", description: "Tests isolate dependencies and verify meaningful behaviour, while the project can be built and tested through documented CI." },
  ],

  twistPool: [
    { id: "favorites", text: "Add a favorites feature that lets users mark recipes as favorites and filter the recipe list to favorites, with the selection persisted locally." },
    { id: "shopping-list", text: "Add a generated shopping list from selected recipes, merging duplicate ingredients and allowing individual shopping-list items to be marked as purchased." },
    { id: "meal-planner", text: "Add a weekly meal planner where recipes can be assigned to breakfast, lunch or dinner on a selected date, with assignments persisted locally." },
    { id: "search", text: "Add recipe search and category filtering that operate against the locally persisted dataset and update results as the user types." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

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
  stack: ["Dart", "Flutter", "Riverpod", "GoRouter", "Dio", "Freezed", "json_serializable", "Isar or Hive", "Flutter Test", "GitHub Actions"],

  requirements: [
    { id: "project-structure", text: "The project is a runnable Flutter application with a clear separation between presentation, state management and data access." },
    { id: "session-crud", text: "Users can create, edit, complete and delete study sessions with a subject, scheduled date/time and duration; required fields and invalid durations are rejected." },
    { id: "navigation", text: "The app uses GoRouter or an equivalent declarative routing setup with separate routes for the schedule, session editor and session details." },
    { id: "state-management", text: "Riverpod manages the application state and exposes explicit loading, success and failure states for asynchronous operations." },
    { id: "local-persistence", text: "Study sessions are persisted in local structured storage and remain available after the application is restarted." },
    { id: "offline-first", text: "Users can create, edit and complete study sessions while offline, with local changes retained until synchronization with the remote API succeeds." },
    { id: "networking", text: "Dio is used for API communication with deliberate timeout and error handling, and a failed synchronization never discards the local copy of a session." },
    { id: "ui-states", text: "The schedule UI visibly handles loading, empty and error states, and each state gives the user a meaningful next action or recovery path." },
    { id: "tests", text: "Automated tests cover core session logic or a Riverpod provider and include widget tests for at least one important user interaction; tests run without a device or emulator.", check: { type: "file", glob: "test/**/*_test.dart" } },
    { id: "readme", text: "README explains Flutter setup, how to run the app in an emulator or simulator, configuration, how to run tests and how offline synchronization works.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs Flutter tests without requiring a device or emulator.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "flutter-config", text: "The repository contains the Flutter package configuration with its dependencies and SDK constraints.", check: { type: "file", glob: "pubspec.yaml" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "flutter-2", description: "The study planner's core flows, forms, validation and displayed data behave correctly across normal and edge cases." },
    { id: "state-architecture", name: "State management & architecture", weight: 20, layerId: "flutter-3", description: "Riverpod state is structured around meaningful responsibilities, with asynchronous states represented explicitly and widgets kept focused on presentation." },
    { id: "navigation-data", name: "Navigation & data", weight: 15, layerId: "flutter-4", description: "Routing is predictable and the networking, serialization and persistence layers have clear responsibilities." },
    { id: "offline-networking", name: "Offline & networking", weight: 15, layerId: "flutter-5", description: "The application remains usable offline, persists local changes, synchronizes deliberately and handles API failures without data loss." },
    { id: "testing", name: "Testing", weight: 15, layerId: "flutter-7", description: "Unit and widget tests verify meaningful business and UI behaviour, including failure or empty states where appropriate." },
    { id: "delivery", name: "Delivery quality", weight: 10, layerId: "flutter-8", description: "The project is runnable in an emulator or simulator, documented clearly and validated automatically through CI." },
  ],

  twistPool: [
    { id: "pomodoro", text: "Add a built-in study timer that can start, pause, resume and finish a session, preserving the timer state when the app moves between screens." },
    { id: "streaks", text: "Add a study streak calculation based on completed sessions, handling missed days, multiple sessions on one day and sessions created while offline." },
    { id: "attachments", text: "Allow each study session to contain locally stored attachments selected from the device gallery, and keep attachment references available while offline." },
    { id: "calendar", text: "Add a calendar view that groups scheduled sessions by day and lets the user select a date to filter the session list." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — React Native Dev track (react-native), v1.
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
  trackId: "react-native",
  categoryId: "mobile",
  slug: "react-native-personal-expense-tracker",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline-first personal expense tracker",
  summary:
    "Build a mobile expense tracker that works reliably without a network connection: users record expenses, browse and filter their history, see spending totals and sync changes when the API becomes available. The app must feel like a real mobile product, with deliberate navigation, persisted state, native device integration and tests that do not require an emulator.",
  stack: ["React Native", "Expo", "TypeScript", "Zustand", "TanStack Query", "AsyncStorage", "React Navigation", "Jest", "React Native Testing Library", "GitHub Actions"],

  requirements: [
    { id: "navigation", text: "The app has a navigable screen structure with a main expense list, an add/edit expense screen and a summary screen, using React Navigation with explicit route parameters where needed." },
    { id: "expense-crud", text: "Users can create, edit and delete expenses with at least an amount, category, date and description; invalid amounts and missing required fields cannot be saved." },
    { id: "persisted-state", text: "Expenses and the minimum required app state persist locally so previously saved expenses remain available after the app is restarted." },
    { id: "offline-first", text: "Creating, editing and deleting expenses works without a network connection and updates the local UI immediately; pending local changes are retained until synchronization succeeds." },
    { id: "api-sync", text: "The app synchronizes expenses with a REST API when connectivity is available and handles API failures without losing locally stored expenses." },
    { id: "query-state", text: "Remote synchronization uses a deliberate server-state strategy with TanStack Query or an equivalent cache/query layer, including loading and mutation states." },
    { id: "ui-states", text: "The expense list visibly handles loading, empty and error states, and each state provides an appropriate action or recovery path instead of leaving a blank screen." },
    { id: "native-feature", text: "The app uses at least one native device capability through Expo or React Native, such as the device camera for attaching a receipt image, and handles permission denial gracefully." },
    { id: "tests", text: "Automated tests cover expense validation, persisted state or store actions, and at least one important UI interaction without requiring a device or emulator.", check: { type: "file", glob: "**/*.{test,spec}.{js,jsx,ts,tsx}" } },
    { id: "readme", text: "README explains prerequisites, setup, environment variables if used, how to run the app in an emulator or simulator, how to run automated tests, and the offline/sync behaviour.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs the automated test suite without requiring a mobile device or emulator.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "expo-config", text: "The repository contains an Expo or React Native application configuration that can be used to run the project.", check: { type: "file", glob: ["app.json", "app.config.{js,ts}"] } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "rn-2", description: "Expense creation, editing, deletion, navigation and mobile UI behaviour satisfy the requirements and remain correct across normal and edge cases." },
    { id: "state", name: "State & data flow", weight: 20, layerId: "rn-4", description: "Local state, persistence, server state and synchronization are separated deliberately, with predictable updates and no unnecessary global state." },
    { id: "networking", name: "Networking & offline behaviour", weight: 15, layerId: "rn-5", description: "API calls, loading and mutation states, failures, synchronization and offline changes are handled without data loss." },
    { id: "native-ux", name: "Native integration & UX", weight: 15, layerId: "rn-6", description: "The native capability is integrated appropriately, permissions are handled, and loading, empty, error and interaction states feel intentional." },
    { id: "performance", name: "Performance & component design", weight: 10, layerId: "rn-7", description: "Lists, renders, callbacks and component boundaries are appropriate for a growing expense history and avoid obvious unnecessary work." },
    { id: "testing-ops", name: "Testing & delivery", weight: 15, layerId: "rn-8", description: "Tests verify meaningful behaviour without a device, and the repository is reproducible through clear documentation and CI." },
  ],

  twistPool: [
    { id: "recurring", text: "Add recurring expenses that can be scheduled with a frequency and next-occurrence date, and generate the next expense locally when its scheduled date is reached." },
    { id: "budgets", text: "Add monthly category budgets with local persistence and show each category's used amount and remaining budget, including correct behaviour when spending exceeds the budget." },
    { id: "receipt-gallery", text: "Allow multiple receipt images to be attached to an expense using the device camera or gallery, with local references preserved while the app is offline." },
    { id: "csv-export", text: "Allow users to export their locally stored expenses as a CSV file through the mobile share sheet, including a header row and all required expense fields." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

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
  stack: ["Kotlin", "Jetpack Compose", "ViewModel", "StateFlow", "Room", "DataStore", "Retrofit", "OkHttp", "Kotlin Serialization", "Coroutines", "JUnit", "GitHub Actions"],

  requirements: [
    { id: "item-crud", text: "Users can add, edit, view and delete pantry items with a name, quantity, unit and expiration date; invalid quantities and missing names cannot be saved." },
    { id: "compose-ui", text: "The application uses Jetpack Compose for its primary UI and keeps reusable UI elements separate from screen-level state and business logic." },
    { id: "architecture", text: "ViewModels expose UI state through StateFlow, repositories abstract data sources, and business operations are not implemented directly inside composables." },
    { id: "local-database", text: "Pantry items are stored in Room and remain available after the application is terminated and relaunched." },
    { id: "offline", text: "Adding, editing and deleting pantry items works without network access, and local changes remain available until synchronization can occur." },
    { id: "networking", text: "Retrofit and Kotlin Serialization are used for REST synchronization, with explicit handling for HTTP failures, timeouts and malformed responses." },
    { id: "ui-states", text: "The pantry screen visibly handles loading, empty and error states, and each state provides a meaningful action or recovery path." },
    { id: "stateflow", text: "The UI collects state from a lifecycle-aware StateFlow and does not expose mutable application state directly to composables." },
    { id: "tests", text: "Automated tests cover at least one ViewModel or use case and one repository or persistence behaviour, and they run without requiring an emulator.", check: { type: "file", glob: "app/src/test/**/*.kt" } },
    { id: "readme", text: "README explains Android Studio setup, how to run the app in an emulator, how to run tests and how offline synchronization works.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the project and runs JVM tests without requiring an Android emulator.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "android-project", text: "The repository contains a Kotlin Android Gradle project with an Android manifest and application source.", check: { type: "file", glob: "app/src/main/AndroidManifest.xml" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "android-2", description: "The Compose UI and pantry workflows behave correctly across normal, invalid and empty-data cases." },
    { id: "architecture", name: "Architecture", weight: 20, layerId: "android-3", description: "ViewModels, StateFlow, repositories and use cases have clear responsibilities and avoid putting application logic in composables." },
    { id: "persistence", name: "Persistence & offline", weight: 15, layerId: "android-4", description: "Room persistence is reliable, structured and sufficient for offline use, with deliberate handling of stored state." },
    { id: "networking", name: "Networking & concurrency", weight: 15, layerId: "android-5", description: "Retrofit, serialization, coroutines and failures are handled deliberately without losing local data." },
    { id: "navigation", name: "Navigation & UX", weight: 10, layerId: "android-6", description: "Screen navigation, state restoration and loading, empty and error presentations form a coherent mobile experience." },
    { id: "testing", name: "Testing", weight: 15, layerId: "android-7", description: "Tests verify meaningful application behaviour and isolate external dependencies without requiring an emulator." },
  ],

  twistPool: [
    { id: "barcode", text: "Add barcode scanning for pantry items using a locally available or mocked scanner flow, allowing a scanned code to identify an item without requiring a paid service." },
    { id: "expiring", text: "Add an expiration dashboard that groups items into expired, expiring within seven days and later, using dates calculated consistently from the stored data." },
    { id: "stock-history", text: "Add quantity adjustment history for each pantry item, recording the previous and new quantity and displaying the history in chronological order." },
    { id: "shopping", text: "Add a shopping list that can be populated from pantry items below a user-defined minimum quantity and lets users mark shopping items as purchased." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — Kotlin Developer track (kotlin-dev), v1.
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
  trackId: "kotlin-dev",
  categoryId: "mobile",
  slug: "kotlin-dev-reading-list-service",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Concurrent reading-list service",
  summary:
    "Build a Kotlin application that manages a personal reading list and exposes it through a small Ktor service. The project should use idiomatic Kotlin, coroutines, Flow, Gradle and persistence to create a complete piece of software that can be exercised locally without external paid services.",
  stack: ["Kotlin", "Ktor", "Coroutines", "Flow", "Gradle Kotlin DSL", "kotlinx.serialization", "Exposed", "HikariCP", "JUnit 5", "MockK", "Docker", "GitHub Actions"],

  requirements: [
    { id: "book-crud", text: "The service supports creating, reading, updating and deleting books with a title, author, status and optional rating, and rejects invalid input with an appropriate HTTP response." },
    { id: "ktor-api", text: "The application exposes a Ktor HTTP API with separate routing and application logic, and JSON request and response bodies use kotlinx.serialization." },
    { id: "null-safety", text: "Nullable book data is handled explicitly using Kotlin null-safety features rather than unsafe assertions for expected missing values." },
    { id: "coroutines", text: "Database and other blocking work is executed through appropriate coroutine dispatchers and request handlers do not block the main application execution unnecessarily." },
    { id: "flow", text: "The application exposes a Flow-based operation for observing changes to the reading list and handles cancellation without leaking work." },
    { id: "persistence", text: "Books are persisted in a relational database using Exposed with a defined schema and a connection pool managed by HikariCP." },
    { id: "validation-errors", text: "Malformed requests, missing resources and persistence failures produce deliberate API responses rather than uncaught exceptions or stack traces." },
    { id: "tests", text: "Automated tests cover core reading-list behaviour and at least one coroutine or Flow behaviour, and the test suite runs without external paid services.", check: { type: "file", glob: "**/src/test/**/*.kt" } },
    { id: "readme", text: "README explains the required JDK, database setup, configuration, how to run the service and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow builds the project and runs the Kotlin test suite on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "gradle", text: "The project uses Gradle Kotlin DSL for its build configuration and declares its dependencies there.", check: { type: "file", glob: "build.gradle.kts" } },
    { id: "local-data", text: "The application can run against a local database and does not require production credentials or a hosted database for development and testing." },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "kotlin-dev-7", description: "The HTTP API, validation, persistence and reading-list behaviour satisfy the requirements and handle meaningful edge cases." },
    { id: "kotlin-design", name: "Kotlin design", weight: 15, layerId: "kotlin-dev-1", description: "The code uses Kotlin types, functions and control flow clearly and avoids unnecessary Java-style patterns." },
    { id: "types", name: "Types & domain modelling", weight: 15, layerId: "kotlin-dev-2", description: "Domain states, nullable values, classes and sealed or enum types are modelled clearly and safely." },
    { id: "functional", name: "Functional & collections", weight: 10, layerId: "kotlin-dev-3", description: "Collection transformations, scope functions and extensions are used where they improve clarity rather than as decoration." },
    { id: "concurrency", name: "Concurrency & Flow", weight: 20, layerId: "kotlin-dev-4", description: "Coroutine structure, cancellation, dispatchers and asynchronous streams are implemented safely and predictably." },
    { id: "data-testing", name: "Data, tooling & tests", weight: 15, layerId: "kotlin-dev-8", description: "Persistence, Gradle structure and automated tests form a reproducible project with meaningful isolation of external dependencies." },
  ],

  twistPool: [
    { id: "tags", text: "Add user-defined tags to books and an endpoint that lists books matching one or more tags, with filtering performed efficiently in the persistence layer." },
    { id: "import", text: "Add a bulk import endpoint that accepts a JSON array of books, validates the complete batch before persistence and reports which records are invalid without partially saving the batch." },
    { id: "recommendations", text: "Add a deterministic recommendation endpoint that selects unread books based on the user's stored ratings and completed reading history, without using an external AI service." },
    { id: "due-dates", text: "Add optional reading due dates and an endpoint that returns overdue books and books due within the next seven days, with date calculations covered by tests." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

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
  stack: ["Swift", "SwiftUI", "Observation", "SwiftData", "URLSession", "Codable", "async/await", "Combine", "Swift Testing", "XCTest", "Swift Package Manager", "GitHub Actions"],

  requirements: [
    { id: "habit-crud", text: "Users can create habits, mark them complete for a selected date, edit habit details and delete habits." },
    { id: "journal", text: "Users can create, edit and delete dated journal entries associated with a habit, with empty titles or entries rejected where the product requires content." },
    { id: "swiftui", text: "The application uses SwiftUI views and appropriate state/data-flow mechanisms, with presentation kept separate from domain and persistence logic." },
    { id: "protocols", text: "External data access is abstracted behind protocols so application logic can be tested with an in-memory or mock implementation." },
    { id: "local-data", text: "Habit and journal data are persisted locally and remain available after the application is terminated and relaunched." },
    { id: "offline", text: "Creating, editing and completing habits and journal entries works without a network connection and does not depend on a remote request succeeding." },
    { id: "async-sync", text: "If a REST synchronization path is implemented, it uses async/await with explicit HTTP and decoding failure handling and never replaces valid local data with an empty response after a failed request." },
    { id: "ui-states", text: "The primary list UI visibly handles loading, empty and error states, with an intentional action for retrying or recovering from an error." },
    { id: "tests", text: "Automated tests cover habit completion or streak logic and at least one asynchronous operation using a test double, and they run without requiring a simulator.", check: { type: "file", glob: ["**/*Tests.swift", "**/*Test.swift"] } },
    { id: "readme", text: "README explains the Swift/Xcode requirements, how to run the app in an iOS Simulator, how to run tests and how local data behaves offline.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow runs the Swift test suite on a macOS runner without requiring a physical iPhone or paid developer account.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "swift-project", text: "The repository contains a Swift Package or Xcode project that defines the application or its testable core.", check: { type: "file", glob: ["Package.swift", "**/*.xcodeproj/project.pbxproj"] } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "swift-dev-5", description: "Habit tracking, journal editing, date handling and the visible application behaviour satisfy the requirements." },
    { id: "swift-types", name: "Swift types & semantics", weight: 15, layerId: "swift-dev-2", description: "Optionals, enums, structs, classes and error handling model the domain clearly and safely." },
    { id: "protocols", name: "Protocols & architecture", weight: 15, layerId: "swift-dev-3", description: "Protocols, generics and value/reference semantics are used deliberately to create maintainable and testable boundaries." },
    { id: "concurrency", name: "Memory & concurrency", weight: 15, layerId: "swift-dev-4", description: "Async work, cancellation, ownership and reference lifetimes are handled correctly without obvious retain-cycle or race risks." },
    { id: "ui-data", name: "SwiftUI & data flow", weight: 15, layerId: "swift-dev-6", description: "State, bindings, environment dependencies and user input are structured cleanly across the SwiftUI screens." },
    { id: "reactive-testing", name: "Reactive behaviour & tests", weight: 15, layerId: "swift-dev-7", description: "Reactive or asynchronous behaviour is understandable and meaningful automated tests verify important domain and async paths." },
  ],

  twistPool: [
    { id: "mood", text: "Add a daily mood value to journal entries and a seven-day mood summary that handles missing days without inventing data." },
    { id: "streaks", text: "Add per-habit streak calculations that correctly handle consecutive completion dates, missed days and multiple completion records for the same date." },
    { id: "templates", text: "Add reusable journal templates that users can create, edit and apply when starting a new journal entry, with templates persisted locally." },
    { id: "insights", text: "Add a weekly progress screen that calculates completion percentages from local habit records and displays separate totals for each habit." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

  passThresholds: DEFAULT_PASS_THRESHOLDS,

/**
 * Capstone brief — .NET MAUI Dev track (maui), v1.
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
  trackId: "maui",
  categoryId: "mobile",
  slug: "maui-field-service-log",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline field service log",
  summary:
    "Build a .NET MAUI app for technicians to record field-service jobs, work notes and completion status. The app must remain usable without connectivity, persist jobs locally, synchronize with a REST API when possible and demonstrate clean MVVM, binding, navigation and platform-aware behaviour.",
  stack: ["C#", ".NET MAUI", "XAML", "CommunityToolkit.Mvvm", "HttpClient", "SQLite", "System.Text.Json", "xUnit", "Moq", "GitHub Actions"],

  requirements: [
    { id: "job-crud", text: "Users can create, view, edit and close service jobs with a customer name, job title, scheduled date and notes; required fields and invalid dates cannot be saved." },
    { id: "xaml-ui", text: "The application uses XAML layouts and controls with reusable styles or resource dictionaries rather than duplicating visual configuration throughout every page." },
    { id: "mvvm", text: "Pages use ViewModels with data binding and commands, and UI event handlers are not used as the primary location for application business logic." },
    { id: "navigation", text: "MAUI Shell or equivalent routing navigates between the job list, job editor and job detail screens and passes the selected job identifier explicitly." },
    { id: "local-storage", text: "Service jobs are stored in a local SQLite database and remain available after the application is restarted." },
    { id: "offline-first", text: "Users can create, edit and close jobs without network access, and local changes remain available until synchronization succeeds." },
    { id: "networking", text: "HttpClient consumes a REST API using DTOs and JSON serialization, with explicit timeout, cancellation and HTTP failure handling." },
    { id: "ui-states", text: "The job list visibly handles loading, empty and error states, and provides a clear recovery or next action for each state." },
    { id: "platform-feature", text: "The app uses at least one device capability available through .NET MAUI, such as selecting or capturing a photo for a job, and handles permission denial without crashing." },
    { id: "tests", text: "Automated xUnit tests cover ViewModel behaviour and core service or synchronization logic using mocked dependencies, and tests run without requiring a device or emulator.", check: { type: "file", glob: "**/*Tests.cs" } },
    { id: "readme", text: "README explains the .NET SDK and MAUI prerequisites, how to run the app in an emulator, how to run tests and how offline synchronization works.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow restores, builds or tests the project and runs the automated test suite without requiring a physical mobile device.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "maui-4", description: "Service-job workflows, navigation and platform UI behave correctly across normal, invalid and empty-data cases." },
    { id: "csharp-design", name: "C# & .NET design", weight: 15, layerId: "maui-2", description: "Classes, interfaces, records, exceptions and namespaces are used clearly and with appropriate responsibilities." },
    { id: "mvvm", name: "MVVM & binding", weight: 20, layerId: "maui-6", description: "ViewModels, observable properties, commands and bindings create a clean separation between presentation and application logic." },
    { id: "data-networking", name: "Data & networking", weight: 15, layerId: "maui-8", description: "SQLite persistence, DTO serialization, REST calls and offline synchronization are reliable and preserve local data on failures." },
    { id: "async", name: "Async & platform behaviour", weight: 10, layerId: "maui-3", description: "Asynchronous operations support cancellation and failure handling, and device capability access is integrated without blocking or crashing the UI." },
    { id: "testing", name: "Testing & delivery", weight: 15, layerId: "maui-9", description: "ViewModels and services have meaningful isolated tests and the project is reproducible through documented setup and CI." },
  ],

  twistPool: [
    { id: "photo-notes", text: "Allow technicians to attach multiple locally stored job photos and display the attachments on the job detail screen, including correct behaviour when the app is offline." },
    { id: "priority", text: "Add configurable job priorities and a queue screen that sorts open jobs by priority and scheduled date, with deterministic ordering for equal values." },
    { id: "checklist", text: "Add a per-job checklist where technicians can create, reorder, complete and remove checklist items, with all changes persisted locally." },
    { id: "time-log", text: "Add technician time logging for each job with start and stop actions, persisted duration records and a calculated total time displayed on the job detail screen." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

/**
 * Capstone brief — PWA Developer track (pwa-dev), v1.
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
  trackId: "pwa-dev",
  categoryId: "mobile",
  slug: "pwa-dev-travel-journal",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline travel journal PWA",
  summary:
    "Build an installable travel journal PWA where users record trips, places and notes while moving between unreliable networks. The app must provide a responsive app-shell experience, persist structured data locally, use a service worker with deliberate caching, expose install metadata and remain functional when the network is unavailable.",
  stack: ["HTML", "CSS", "JavaScript", "Service Worker", "Cache API", "IndexedDB", "Web App Manifest", "Workbox", "Lighthouse", "GitHub Actions"],

  requirements: [
    { id: "journal-crud", text: "Users can create, edit, view and delete trips and their journal entries, with required titles and dates validated before saving." },
    { id: "responsive-ui", text: "The interface adapts to mobile and desktop viewport sizes and provides touch-friendly controls without relying on hover for essential actions." },
    { id: "app-shell", text: "The application provides an app-shell structure that renders the primary navigation and core UI before remote content becomes available." },
    { id: "manifest", text: "The project includes a valid web app manifest with an application name, icons, display mode and theme configuration suitable for installation.", check: { type: "file", glob: "manifest.json" } },
    { id: "service-worker", text: "A service worker is registered and handles its lifecycle deliberately, including installation, activation and request interception.", check: { type: "file", glob: ["**/service-worker.{js,ts}", "**/sw.js"] } },
    { id: "offline-data", text: "Trips and journal entries are stored in IndexedDB or equivalent browser structured storage so previously saved content can be viewed and edited while offline." },
    { id: "cache-strategy", text: "The service worker implements deliberate caching strategies for the app shell and remote data, rather than indiscriminately caching every request." },
    { id: "ui-states", text: "The application visibly handles loading, empty and error states for trip or journal data, with meaningful recovery actions and no permanently blank content areas." },
    { id: "device-api", text: "The app uses at least one appropriate browser device capability, such as Web Share or clipboard access, with a fallback when the capability is unavailable." },
    { id: "tests", text: "Automated tests cover core journal behaviour and at least one offline or service-worker-related path, and the tests run without requiring a real device.", check: { type: "file", glob: "**/*.{test,spec}.{js,jsx,ts,tsx}" } },
    { id: "readme", text: "README explains local setup, production serving requirements, how to test the PWA, how to install it and how offline caching and local data work.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs the automated test suite on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "pwa-dev-2", description: "Trip and journal workflows, validation and client-side behaviour work correctly across normal and offline cases." },
    { id: "web-foundations", name: "Web foundations & accessibility", weight: 15, layerId: "pwa-dev-1", description: "Semantic markup, keyboard access, readable structure and responsive CSS provide a usable foundation." },
    { id: "app-shell", name: "App-shell & responsive UX", weight: 15, layerId: "pwa-dev-3", description: "The application shell, responsive layouts, touch interactions and perceived loading experience are deliberately designed." },
    { id: "offline", name: "Service worker & offline", weight: 20, layerId: "pwa-dev-6", description: "Caching, IndexedDB and offline behaviour are coherent, scoped appropriately and preserve user data." },
    { id: "pwa-features", name: "PWA & device features", weight: 10, layerId: "pwa-dev-4", description: "Manifest, installation metadata and browser capability integration are implemented correctly with suitable fallbacks." },
    { id: "testing-performance", name: "Testing & performance", weight: 15, layerId: "pwa-dev-9", description: "Automated tests cover important behaviour and the implementation avoids obvious performance problems through appropriate loading and asset strategies." },
  ],

  twistPool: [
    { id: "photos", text: "Allow users to attach locally stored photos to journal entries using the browser file or camera capture flow, and make attached photos available while offline." },
    { id: "draft-sync", text: "Add automatic draft saving for journal entries with a visible saved status and recovery of the latest local draft after a browser reload." },
    { id: "timeline", text: "Add a chronological trip timeline that groups journal entries by date and supports filtering to a selected day without requiring a network request." },
    { id: "share-card", text: "Add a share action that creates a formatted trip summary from local data and uses the Web Share API when available, with a clipboard fallback." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

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
  stack: ["Ionic", "Angular", "TypeScript", "RxJS", "Capacitor", "Angular HttpClient", "Ionic Storage or SQLite", "Jasmine", "Karma", "GitHub Actions"],

  requirements: [
    { id: "list-crud", text: "Users can create, rename and delete grocery lists, and can add, edit, mark purchased and remove items within each list." },
    { id: "validation", text: "Required list and item names cannot be saved empty, quantities must be valid positive values, and invalid form submissions display an actionable validation message." },
    { id: "angular-structure", text: "The application uses Angular components and services with dependency injection, keeping API, persistence and business operations out of page templates." },
    { id: "navigation", text: "Ionic Angular routing provides separate routes for the list overview, a selected grocery list and item editing, with route parameters used to identify the selected list." },
    { id: "state-management", text: "Application state is represented with services and RxJS subjects, signals or another explicit reactive state mechanism rather than relying on mutable component fields shared across screens." },
    { id: "local-storage", text: "Grocery lists and items are persisted locally using Ionic Storage, SQLite or another appropriate Capacitor-compatible local store and survive application restarts." },
    { id: "offline-first", text: "Users can create, edit, purchase and remove grocery items while offline, and local changes are retained until synchronization with the remote API succeeds." },
    { id: "http-sync", text: "Angular HttpClient consumes a REST API through a dedicated data service, with authentication or request configuration handled centrally when required and HTTP failures represented explicitly." },
    { id: "ui-states", text: "The primary grocery-list UI visibly handles loading, empty and error states, and each state provides a meaningful action or recovery path." },
    { id: "capacitor-feature", text: "The app uses at least one Capacitor device capability, such as Camera or Geolocation, and handles unavailable permissions or unsupported environments without crashing." },
    { id: "tests", text: "Automated tests cover at least one Angular service or state flow and one component interaction, and the test suite runs without requiring a device or emulator.", check: { type: "file", glob: ["**/*.spec.ts", "**/*.test.ts"] } },
    { id: "readme", text: "README explains Node and Ionic setup, how to run the app in an emulator or simulator, how to run automated tests and how local/offline synchronization works.", check: { type: "file", glob: "README.md" } },
    { id: "ci", text: "A CI workflow installs dependencies and runs the automated test suite without requiring a physical device or emulator.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "ionic-3", description: "The grocery workflows, Ionic components and validation behave correctly across normal, invalid and empty-data cases." },
    { id: "angular", name: "Angular architecture", weight: 20, layerId: "ionic-2", description: "Components, services, dependency injection and reactive state have clear responsibilities and avoid unnecessary coupling." },
    { id: "navigation-state", name: "Navigation & state", weight: 15, layerId: "ionic-4", description: "Routes, parameters and reactive application state remain predictable as users move between grocery lists and item screens." },
    { id: "offline-data", name: "Data & offline behaviour", weight: 20, layerId: "ionic-8", description: "Local persistence, REST access and synchronization preserve user data and behave correctly when connectivity is unavailable or requests fail." },
    { id: "native", name: "Native integration", weight: 10, layerId: "ionic-7", description: "The Capacitor capability is integrated appropriately, with permission and unsupported-environment handling." },
    { id: "testing", name: "Testing & delivery", weight: 10, layerId: "ionic-9", description: "Automated tests verify meaningful service and UI behaviour without a device, and setup is reproducible through documentation and CI." },
  ],

  twistPool: [
    { id: "categories", text: "Add item categories and a category-filtered shopping view, with each item's category persisted locally and retained through synchronization." },
    { id: "shared-list", text: "Add a local mock collaboration mode where a grocery list can be assigned to another named household member, and each item records which member last changed it." },
    { id: "price-tracking", text: "Add an optional estimated price to grocery items and calculate the total estimated cost for each list, correctly handling missing prices and quantity changes." },
    { id: "recurring-items", text: "Add recurring grocery items that can be configured with a repeat interval and automatically reappear as unpurchased items when their next scheduled date is reached." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
};
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
};

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
