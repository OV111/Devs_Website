/**
 * Capstone brief — Nuxt Developer track (nuxt-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "nuxt-dev",
  categoryId: "fullstack",
  slug: "nuxt-dev-trip-planner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Collaborative trip planner",
  summary:
    "Build a collaborative trip planner where authenticated users organize trips, destinations and itinerary " +
    "items: a Nuxt application using Vue 3, server-side rendering, Nitro API routes, Prisma persistence, " +
    "Pinia state, authentication, reusable composables, SEO, testing, and production deployment.",
  stack: ["Nuxt", "Vue 3", "TypeScript", "Nitro", "Prisma", "Pinia", "Vitest", "Playwright"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and authenticated users can access only trips they own or have been added to." },
    { id: "trips", text: "Users can create, edit and delete trips with a name, destination and date range." },
    { id: "itinerary", text: "Trip owners can create, edit and delete itinerary items with a title, date, time and optional notes." },
    { id: "sharing", text: "Trip owners can add existing users as collaborators, and collaborators can view the trip while only owners can delete it." },
    { id: "nitro", text: "The application exposes Nitro server routes for trip data and performs authorization checks on the server before returning private data." },
    { id: "data-fetching", text: "Trip pages use useFetch or useAsyncData appropriately, with loading, error and refresh behaviour visible to users." },
    { id: "state", text: "Pinia or Nuxt useState manages client-side state that is shared across multiple components, while server data remains distinct from local UI state." },
    { id: "composables", text: "At least one reusable composable encapsulates a repeated application concern and is used by more than one component." },
    { id: "seo", text: "Publicly accessible trip or destination pages define appropriate page titles and descriptions and do not expose private trip data." },
    { id: "tests", text: "Vitest tests cover core trip logic or composables, and Playwright covers authentication and creating an itinerary item.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, Prisma migrations, local development, tests and the selected production deployment preset.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting, type checking and automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "nuxt-dev-5", description: "Nuxt pages and Nitro routes correctly implement trip, itinerary and authorization workflows." },
    { id: "vue", name: "Vue architecture", weight: 15, layerId: "nuxt-dev-2", description: "Vue components, reactivity, props and events are structured clearly and used appropriately." },
    { id: "data", name: "Data fetching & rendering", weight: 15, layerId: "nuxt-dev-4", description: "Server-side rendering, data fetching and refresh behaviour are chosen appropriately for each page." },
    { id: "database", name: "Database & persistence", weight: 15, layerId: "nuxt-dev-6", description: "Prisma models, relations and queries correctly represent trips, collaborators and itinerary items." },
    { id: "auth", name: "State & authentication", weight: 15, layerId: "nuxt-dev-7", description: "Application state and authentication middleware protect private resources and maintain correct user context." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "nuxt-dev-10", description: "Unit and browser tests cover meaningful workflows and the application has a reproducible production deployment configuration." },
  ],

  twistPool: [
    { id: "expenses", text: "Users can record trip expenses with an amount and payer, and the trip page displays each collaborator's net amount owed without allowing client-provided totals to determine the result." },
    { id: "checklist", text: "Each itinerary item can have checklist entries that users can add, remove and mark complete, with checklist state persisted independently from the item's title and notes." },
    { id: "favorites", text: "Users can save destinations to a personal favorites list, and the favorites page loads only the current user's saved destinations from the server." },
    { id: "packing", text: "Each trip has a shared packing list where collaborators can add, edit and mark items complete, while unauthenticated users cannot access the list." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
