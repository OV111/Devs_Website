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
  stack: [
    "React Native",
    "Expo",
    "TypeScript",
    "Zustand",
    "TanStack Query",
    "AsyncStorage",
    "React Navigation",
    "Jest",
    "React Native Testing Library",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "navigation",
      text: "The app has a navigable screen structure with a main expense list, an add/edit expense screen and a summary screen, using React Navigation with explicit route parameters where needed.",
    },
    {
      id: "expense-crud",
      text: "Users can create, edit and delete expenses with at least an amount, category, date and description; invalid amounts and missing required fields cannot be saved.",
    },
    {
      id: "persisted-state",
      text: "Expenses and the minimum required app state persist locally so previously saved expenses remain available after the app is restarted.",
    },
    {
      id: "offline-first",
      text: "Creating, editing and deleting expenses works without a network connection and updates the local UI immediately; pending local changes are retained until synchronization succeeds.",
    },
    {
      id: "api-sync",
      text: "The app synchronizes expenses with a REST API when connectivity is available and handles API failures without losing locally stored expenses.",
    },
    {
      id: "query-state",
      text: "Remote synchronization uses a deliberate server-state strategy with TanStack Query or an equivalent cache/query layer, including loading and mutation states.",
    },
    {
      id: "ui-states",
      text: "The expense list visibly handles loading, empty and error states, and each state provides an appropriate action or recovery path instead of leaving a blank screen.",
    },
    {
      id: "native-feature",
      text: "The app uses at least one native device capability through Expo or React Native, such as the device camera for attaching a receipt image, and handles permission denial gracefully.",
    },
    {
      id: "tests",
      text: "Automated tests cover expense validation, persisted state or store actions, and at least one important UI interaction without requiring a device or emulator.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,jsx,ts,tsx}" },
    },
    {
      id: "readme",
      text: "README explains prerequisites, setup, environment variables if used, how to run the app in an emulator or simulator, how to run automated tests, and the offline/sync behaviour.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs the automated test suite without requiring a mobile device or emulator.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "expo-config",
      text: "The repository contains an Expo or React Native application configuration that can be used to run the project.",
      check: { type: "file", glob: ["app.json", "app.config.{js,ts}"] },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "rn-2",
      description:
        "Expense creation, editing, deletion, navigation and mobile UI behaviour satisfy the requirements and remain correct across normal and edge cases.",
    },
    {
      id: "state",
      name: "State & data flow",
      weight: 20,
      layerId: "rn-4",
      description:
        "Local state, persistence, server state and synchronization are separated deliberately, with predictable updates and no unnecessary global state.",
    },
    {
      id: "networking",
      name: "Networking & offline behaviour",
      weight: 15,
      layerId: "rn-5",
      description:
        "API calls, loading and mutation states, failures, synchronization and offline changes are handled without data loss.",
    },
    {
      id: "native-ux",
      name: "Native integration & UX",
      weight: 15,
      layerId: "rn-6",
      description:
        "The native capability is integrated appropriately, permissions are handled, and loading, empty, error and interaction states feel intentional.",
    },
    {
      id: "performance",
      name: "Performance & component design",
      weight: 10,
      layerId: "rn-7",
      description:
        "Lists, renders, callbacks and component boundaries are appropriate for a growing expense history and avoid obvious unnecessary work.",
    },
    {
      id: "testing-ops",
      name: "Testing & delivery",
      weight: 15,
      layerId: "rn-8",
      description:
        "Tests verify meaningful behaviour without a device, and the repository is reproducible through clear documentation and CI.",
    },
  ],

  twistPool: [
    {
      id: "recurring",
      text: "Add recurring expenses that can be scheduled with a frequency and next-occurrence date, and generate the next expense locally when its scheduled date is reached.",
    },
    {
      id: "budgets",
      text: "Add monthly category budgets with local persistence and show each category's used amount and remaining budget, including correct behaviour when spending exceeds the budget.",
    },
    {
      id: "receipt-gallery",
      text: "Allow multiple receipt images to be attached to an expense using the device camera or gallery, with local references preserved while the app is offline.",
    },
    {
      id: "csv-export",
      text: "Allow users to export their locally stored expenses as a CSV file through the mobile share sheet, including a header row and all required expense fields.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
