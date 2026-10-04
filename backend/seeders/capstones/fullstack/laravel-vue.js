/**
 * Capstone brief — Laravel + Vue Dev track (laravel-vue), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "laravel-vue",
  categoryId: "fullstack",
  slug: "laravel-vue-maintenance-hub",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Maintenance request hub",
  summary:
    "Build a maintenance request hub where tenants report property issues and staff manage repairs: a Laravel " +
    "backend with Eloquent and Sanctum connected to a Vue 3 client using Pinia and Vue Router, with validation, " +
    "queues, notifications, optimized queries, automated tests, and Docker-based deployment.",
  stack: ["PHP", "Laravel", "Eloquent", "Vue 3", "Pinia", "Sanctum", "Redis", "Pest", "Docker"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and authenticated API requests identify the current user through Laravel Sanctum." },
    { id: "properties", text: "Users can view properties they are associated with, while property data belonging to unrelated users is not returned by the API." },
    { id: "requests", text: "Authenticated users can create, edit and cancel their own maintenance requests with a title, description, category and priority." },
    { id: "workflow", text: "Staff users can assign a maintenance request and change its status, while non-staff users cannot perform staff-only actions." },
    { id: "validation", text: "Laravel form requests or equivalent validation rules reject invalid request data and return errors that Vue can associate with the relevant fields." },
    { id: "vue", text: "The Vue client provides routed views for request lists and details, uses reusable components, and displays loading and error states." },
    { id: "state", text: "Pinia manages client-side state that is shared across multiple Vue components, while API data is refreshed after mutations that change it." },
    { id: "api", text: "Laravel API resources or equivalent transformers provide consistent JSON responses, and list endpoints support pagination." },
    { id: "performance", text: "Request list and detail queries use eager loading where required to avoid unnecessary relationship queries, and an appropriate database index supports a common filter." },
    { id: "queue", text: "A non-critical notification is dispatched through a Laravel queue job rather than delaying the main maintenance request response." },
    { id: "tests", text: "Pest tests cover authentication, authorization, request validation and a database-backed request workflow, and Vue components have automated tests.", check: { type: "file", glob: "tests/**/*Test.php" } },
    { id: "readme", text: "README explains setup, environment variables, database migrations and seeding, queue startup, tests and Docker usage.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting and the automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "laravel-vue-6", description: "The Laravel API correctly handles maintenance requests, pagination, resources and protected operations." },
    { id: "laravel", name: "Laravel architecture", weight: 15, layerId: "laravel-vue-3", description: "Eloquent models, relationships, migrations and queries correctly represent the application's data." },
    { id: "vue", name: "Vue architecture", weight: 15, layerId: "laravel-vue-5", description: "Vue components, reactivity, props, events and forms provide a coherent client architecture." },
    { id: "auth", name: "Validation & authentication", weight: 15, layerId: "laravel-vue-4", description: "Validation, CSRF or API protections and authentication boundaries are applied correctly to user actions." },
    { id: "performance", name: "Performance & background work", weight: 15, layerId: "laravel-vue-9", description: "Eager loading, indexing, caching or related performance techniques and queued work are applied to real workflows." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "laravel-vue-10", description: "Backend and frontend tests cover important behaviour and the project has a reproducible containerized development setup." },
  ],

  twistPool: [
    { id: "comments", text: "Tenants and staff can add comments to a maintenance request, and the API prevents users from commenting on requests belonging to unrelated properties." },
    { id: "attachments", text: "Users can upload photos to a request; files are validated (type and size), stored privately, and served only to authorised users through temporary signed URLs." },
    { id: "scheduled", text: "Staff can schedule a maintenance request for a future date, and the request list supports filtering by scheduled date through a paginated API query." },
    { id: "ratings", text: "After a request is completed, the tenant can submit a one-time rating and optional comment, while the API rejects ratings for incomplete requests or duplicate ratings." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
