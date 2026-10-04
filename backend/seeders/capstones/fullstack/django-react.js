/**
 * Capstone brief — Django + React Dev track (django-react), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "django-react",
  categoryId: "fullstack",
  slug: "django-react-recipe-box",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Personal recipe box",
  summary:
    "Build a full-stack recipe box where users manage recipes, ingredients and cooking notes: a Django " +
    "REST API backed by relational models with a React client, token authentication, optimized queries, " +
    "cached data, background work, tests, and a production container setup.",
  stack: ["Python", "Django", "Django REST Framework", "React", "PostgreSQL", "Redis", "Celery"],

  requirements: [
    { id: "auth", text: "Users can register and log in through the API, and protected recipe operations require authentication." },
    { id: "recipes", text: "Authenticated users can create, edit and delete their own recipes with a title, description, preparation time and instructions." },
    { id: "ingredients", text: "Each recipe can contain multiple ingredients with quantities, and ingredient records are persisted through the Django ORM." },
    { id: "ownership", text: "Users can read public recipes but can only modify recipes they own, with ownership enforced by the API." },
    { id: "react", text: "The React client provides recipe listing, detail, creation and editing views and communicates with the Django API through a dedicated client layer." },
    { id: "state", text: "Recipe views show explicit loading and error states, and server data is cached and invalidated after mutations." },
    { id: "optimization", text: "The Django API avoids unnecessary related-object queries on recipe list and detail endpoints by using appropriate ORM query optimization." },
    { id: "cache", text: "At least one read-heavy recipe endpoint uses Redis-backed caching, and recipe changes invalidate stale cached data." },
    { id: "background", text: "A Celery task performs a non-blocking operation related to recipe data, and the API does not wait for the task to finish before returning the main response." },
    { id: "tests", text: "Tests cover authentication, recipe ownership, ingredient persistence, an optimized API workflow and a React component.", check: { type: "file", glob: "**/{test_*.py,tests.py}" } },
    { id: "readme", text: "README explains local setup, environment variables, migrations, Redis and Celery startup, tests, and production deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs backend tests and frontend tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "django-react-6", description: "The React client correctly integrates with Django endpoints and handles the complete recipe workflow." },
    { id: "django", name: "Django & ORM", weight: 15, layerId: "django-react-3", description: "Models, relationships and QuerySets represent recipe data correctly and efficiently." },
    { id: "api", name: "API design", weight: 15, layerId: "django-react-4", description: "Serializers, views, routing, pagination and filtering form a coherent REST API." },
    { id: "performance", name: "Advanced backend", weight: 15, layerId: "django-react-8", description: "Query optimization, caching and background work are applied to real application paths." },
    { id: "frontend", name: "React state & UX", weight: 15, layerId: "django-react-9", description: "The client manages server state, caching, invalidation and optimistic or responsive interactions appropriately." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "django-react-10", description: "Backend and frontend behaviour is tested and the application has a reproducible containerized production setup." },
  ],

  twistPool: [
    { id: "favorites", text: "Users can favorite recipes, and the API provides a paginated endpoint for the current user's favorites." },
    { id: "search", text: "Users can search recipes by title or ingredient, with filtering and pagination performed by the Django API rather than entirely in React." },
    { id: "scaling", text: "A recipe has a configurable number of servings, and the API returns ingredient quantities adjusted for a requested serving count without modifying stored quantities." },
    { id: "meal-plan", text: "Users can add owned or public recipes to a weekly meal plan, with one recipe allowed per meal slot and conflicts rejected by the API." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
