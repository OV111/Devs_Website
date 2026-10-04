/**
 * Capstone brief — SvelteKit Developer track (sveltekit-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "sveltekit-dev",
  categoryId: "fullstack",
  slug: "sveltekit-dev-habit-garden",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Habit garden",
  summary:
    "Build a personal habit tracker where users create habits, record completions, and inspect progress: " +
    "a SvelteKit application using server and universal load functions, form actions, Prisma persistence, " +
    "cookie-based authentication, reusable stores and actions, API endpoints, automated tests, and production deployment.",
  stack: ["SvelteKit", "Svelte", "TypeScript", "Prisma", "Zod", "Vitest", "Playwright"],

  requirements: [
    { id: "auth", text: "Users can sign up and log in, and authenticated users can access only their own habits and completion records." },
    { id: "habits", text: "Users can create, edit and delete habits with a name, description and target frequency." },
    { id: "completion", text: "Users can record or undo a completion for a specific habit and date, and duplicate completion records are prevented." },
    { id: "loading", text: "Habit data is loaded through SvelteKit page or layout load functions, with server-only data access kept out of browser-executed modules." },
    { id: "actions", text: "Habit mutations use SvelteKit form actions with server-side validation, and forms remain usable without requiring custom client-side request code." },
    { id: "validation", text: "Habit and account inputs are validated on the server, and validation errors are returned to the form in a way the UI can display beside the relevant fields." },
    { id: "stores", text: "At least one reusable writable or derived store manages client-side state that is shared by multiple components." },
    { id: "hooks", text: "A server hook establishes the authenticated user for protected requests, and protected routes reject unauthenticated access on the server." },
    { id: "api", text: "An API route returns a user's habit progress as JSON and refuses requests that are not associated with the authenticated user." },
    { id: "tests", text: "Vitest tests cover validation or server logic, and Playwright covers login and recording a habit completion.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, Prisma migrations, authentication configuration, tests and production deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting, type checking and automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "sveltekit-dev-5", description: "Form actions, validation and habit mutations produce correct persistent behaviour." },
    { id: "svelte", name: "Svelte architecture", weight: 15, layerId: "sveltekit-dev-2", description: "Components, reactivity, bindings and events are used clearly without unnecessary complexity." },
    { id: "routing", name: "Routing & data loading", weight: 15, layerId: "sveltekit-dev-4", description: "Load functions and route boundaries provide correct, type-safe server and client data flows." },
    { id: "database", name: "Database & persistence", weight: 15, layerId: "sveltekit-dev-6", description: "Prisma models, relations and server-side queries correctly persist user and habit data." },
    { id: "auth", name: "Authentication", weight: 15, layerId: "sveltekit-dev-7", description: "Hooks, sessions and cookies protect private data and establish the current user reliably." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "sveltekit-dev-10", description: "Unit and browser tests cover important behaviour and the project has a reproducible production deployment configuration." },
  ],

  twistPool: [
    { id: "streaks", text: "The dashboard displays each habit's current completion streak, calculated from persisted completion dates rather than a counter that can drift from the records." },
    { id: "reminders", text: "Users set a reminder time per habit in their own timezone; a scheduled server job records each due reminder exactly once per day, even if it runs late or twice." },
    { id: "archive", text: "Users can archive habits without deleting their historical completion records, and archived habits are excluded from the default active-habit view." },
    { id: "weekly", text: "The dashboard provides a weekly progress view whose date range is selected through URL search parameters and loaded on the server." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
