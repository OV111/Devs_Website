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
  stack: [
    "C#",
    ".NET MAUI",
    "XAML",
    "CommunityToolkit.Mvvm",
    "HttpClient",
    "SQLite",
    "System.Text.Json",
    "xUnit",
    "Moq",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "job-crud",
      text: "Users can create, view, edit and close service jobs with a customer name, job title, scheduled date and notes; required fields and invalid dates cannot be saved.",
    },
    {
      id: "xaml-ui",
      text: "The application uses XAML layouts and controls with reusable styles or resource dictionaries rather than duplicating visual configuration throughout every page.",
    },
    {
      id: "mvvm",
      text: "Pages use ViewModels with data binding and commands, and UI event handlers are not used as the primary location for application business logic.",
    },
    {
      id: "navigation",
      text: "MAUI Shell or equivalent routing navigates between the job list, job editor and job detail screens and passes the selected job identifier explicitly.",
    },
    {
      id: "local-storage",
      text: "Service jobs are stored in a local SQLite database and remain available after the application is restarted.",
    },
    {
      id: "offline-first",
      text: "Users can create, edit and close jobs without network access, and local changes remain available until synchronization succeeds.",
    },
    {
      id: "networking",
      text: "HttpClient consumes a REST API using DTOs and JSON serialization, with explicit timeout, cancellation and HTTP failure handling.",
    },
    {
      id: "ui-states",
      text: "The job list visibly handles loading, empty and error states, and provides a clear recovery or next action for each state.",
    },
    {
      id: "platform-feature",
      text: "The app uses at least one device capability available through .NET MAUI, such as selecting or capturing a photo for a job, and handles permission denial without crashing.",
    },
    {
      id: "tests",
      text: "Automated xUnit tests cover ViewModel behaviour and core service or synchronization logic using mocked dependencies, and tests run without requiring a device or emulator.",
      check: { type: "file", glob: "**/*Tests.cs" },
    },
    {
      id: "readme",
      text: "README explains the .NET SDK and MAUI prerequisites, how to run the app in an emulator, how to run tests and how offline synchronization works.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow restores, builds or tests the project and runs the automated test suite without requiring a physical mobile device.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "maui-4",
      description:
        "Service-job workflows, navigation and platform UI behave correctly across normal, invalid and empty-data cases.",
    },
    {
      id: "csharp-design",
      name: "C# & .NET design",
      weight: 15,
      layerId: "maui-2",
      description:
        "Classes, interfaces, records, exceptions and namespaces are used clearly and with appropriate responsibilities.",
    },
    {
      id: "mvvm",
      name: "MVVM & binding",
      weight: 20,
      layerId: "maui-6",
      description:
        "ViewModels, observable properties, commands and bindings create a clean separation between presentation and application logic.",
    },
    {
      id: "data-networking",
      name: "Data & networking",
      weight: 15,
      layerId: "maui-8",
      description:
        "SQLite persistence, DTO serialization, REST calls and offline synchronization are reliable and preserve local data on failures.",
    },
    {
      id: "async",
      name: "Async & platform behaviour",
      weight: 10,
      layerId: "maui-3",
      description:
        "Asynchronous operations support cancellation and failure handling, and device capability access is integrated without blocking or crashing the UI.",
    },
    {
      id: "testing",
      name: "Testing & delivery",
      weight: 15,
      layerId: "maui-9",
      description:
        "ViewModels and services have meaningful isolated tests and the project is reproducible through documented setup and CI.",
    },
  ],

  twistPool: [
    {
      id: "photo-notes",
      text: "Allow technicians to attach multiple locally stored job photos and display the attachments on the job detail screen, including correct behaviour when the app is offline.",
    },
    {
      id: "priority",
      text: "Add configurable job priorities and a queue screen that sorts open jobs by priority and scheduled date, with deterministic ordering for equal values.",
    },
    {
      id: "checklist",
      text: "Add a per-job checklist where technicians can create, reorder, complete and remove checklist items, with all changes persisted locally.",
    },
    {
      id: "time-log",
      text: "Add technician time logging for each job with start and stop actions, persisted duration records and a calculated total time displayed on the job detail screen.",
    },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
