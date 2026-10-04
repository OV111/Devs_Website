/**
 * Capstone brief — PERN Developer track (pern), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "pern",
  categoryId: "fullstack",
  slug: "pern-expense-planner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Shared expense planner",
  summary:
    "Build a full-stack expense planner where users can create groups, record expenses, split costs, and " +
    "settle balances: a React client talking to an Express API backed by PostgreSQL, with authenticated access, " +
    "transaction-safe financial operations, validation, tests, and a deployable setup.",
  stack: ["PostgreSQL", "Express", "React", "Node.js", "Prisma", "Zod"],

  requirements: [
    { id: "auth", text: "Users can register and log in; protected pages require authentication, and authentication state is preserved across page refreshes." },
    { id: "groups", text: "Authenticated users can create expense groups, invite existing users, and leave groups they belong to." },
    { id: "expenses", text: "Group members can create, edit and delete expenses with an amount, description, payer and participants." },
    { id: "splits", text: "Each expense records how its amount is split between participants, and the API rejects splits whose amounts do not equal the expense total." },
    { id: "balances", text: "The application calculates each member's net balance from the group's expenses and clearly shows who owes whom." },
    { id: "authorization", text: "Only group members can read group data, and only permitted members can change expenses; authorization is enforced by the API rather than only the UI." },
    { id: "transactions", text: "Database writes that create or update an expense and its participant splits are atomic, so a failed operation cannot leave partial financial data." },
    { id: "validation", text: "API request bodies are validated with Zod or an equivalent schema layer, and invalid requests return consistent JSON errors." },
    { id: "client", text: "A React client lives in the repository.", check: { type: "file", glob: "**/*.{jsx,tsx}" } },
    { id: "tests", text: "Unit and integration tests cover authentication, group authorization, expense validation and balance calculations.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, database migrations and seeding, running the client and API, tests, and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs the project's lint and test commands on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "pern-8", description: "The application correctly persists expenses, splits and balances, including invalid and failure cases." },
    { id: "frontend", name: "Frontend quality", weight: 15, layerId: "pern-4", description: "React routing, state and server-state handling are structured clearly, with useful loading, empty and error states." },
    { id: "backend", name: "Backend & API", weight: 15, layerId: "pern-5", description: "Routes, middleware, controllers and API responses are organized consistently and follow REST conventions." },
    { id: "database", name: "Database & data access", weight: 15, layerId: "pern-7", description: "The PostgreSQL schema, indexes and transactions fit the application's relational access patterns." },
    { id: "security", name: "Security & validation", weight: 15, layerId: "pern-9", description: "Authentication, authorization, password handling and input validation are enforced server-side." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "pern-10", description: "Tests cover real behaviour and the project has a reproducible CI and deployment setup." },
  ],

  twistPool: [
    { id: "recurring", text: "Users can mark an expense as recurring and generate the next occurrence from a dedicated action without duplicating the original expense's identifier or split records." },
    { id: "settlements", text: "Members can record a settlement payment between two group members, and settlements are included in the balance calculation without modifying historical expenses." },
    { id: "categories", text: "Expenses can be assigned to categories, and each group has a category summary showing total spending for every category." },
    { id: "currency", text: "Each group uses one currency, and the API rejects expenses submitted with a different currency while displaying the group's currency consistently throughout the client." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — T3 Stack Dev track (t3), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "t3",
  categoryId: "fullstack",
  slug: "t3-reading-room",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Personal reading room",
  summary:
    "Build a type-safe reading room where users maintain a personal library, track reading progress, and " +
    "write notes about books: a Next.js application using tRPC, Prisma, authentication, reusable forms, " +
    "cached server state, and production tests.",
  stack: ["Next.js", "TypeScript", "React", "tRPC", "Prisma", "Tailwind CSS", "Zod"],

  requirements: [
    { id: "auth", text: "Users can register or authenticate through the application's configured credential or OAuth flow, and unauthenticated users cannot access personal library data." },
    { id: "library", text: "Users can add, edit and remove books from their personal library with title, author, status and optional metadata." },
    { id: "progress", text: "Users can update a book's reading progress, and the application prevents progress values outside the valid range." },
    { id: "notes", text: "Users can create, edit and delete private notes attached to their own books." },
    { id: "trpc", text: "Library and note operations use typed tRPC queries and mutations with Zod input validation rather than untyped REST endpoints." },
    { id: "database", text: "The Prisma schema models users, books and notes with appropriate relations and prevents a user from accessing another user's records." },
    { id: "forms", text: "Create and edit forms use React Hook Form with validation errors associated with the relevant fields and accessible labels." },
    { id: "server-state", text: "The client uses the tRPC query cache for server state, invalidating or updating affected queries after mutations." },
    { id: "client", text: "A Next.js React client lives in the repository.", check: { type: "file", glob: "**/*.{jsx,tsx}" } },
    { id: "tests", text: "Tests cover protected procedures, book ownership, validation failures and at least one user-facing form.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains local setup, environment variables, Prisma migrations, database seeding if used, test commands, and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs lint, type checking and tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "t3-6", description: "The library, progress and note workflows persist correctly and respect the Prisma data model." },
    { id: "typescript", name: "Type safety", weight: 15, layerId: "t3-1", description: "Application boundaries use meaningful TypeScript types, narrowing and reusable generic types without unnecessary escape hatches." },
    { id: "fullstack", name: "Full-stack architecture", weight: 15, layerId: "t3-5", description: "tRPC routers, procedures, context and validation provide a coherent type-safe boundary between UI and server." },
    { id: "state", name: "Data fetching & state", weight: 15, layerId: "t3-8", description: "Queries are cached appropriately and mutations keep visible server state consistent without unnecessary refetching." },
    { id: "ui", name: "Forms & UI", weight: 15, layerId: "t3-9", description: "Forms, validation messages and reusable UI components provide a clear and accessible user experience." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "t3-10", description: "The project has meaningful automated tests, correct environment handling and a reproducible deployment configuration." },
  ],

  twistPool: [
    { id: "pagination", text: "The library supports server-side pagination with a fixed page size, and changing pages does not load every book into the browser at once." },
    { id: "optimistic", text: "Changing a book's reading status updates the interface optimistically and rolls back to the previous state with a visible error when the mutation fails." },
    { id: "search", text: "The library has a debounced title or author search whose query is represented in the URL and used to filter the server-side query." },
    { id: "favorites", text: "Users can mark books as favorites, and a dedicated favorites view is backed by a separate filtered server query rather than filtering the complete library only in the browser." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Full Stack Engineer track (fullstack-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "fullstack-engineer",
  categoryId: "fullstack",
  slug: "fullstack-engineer-service-desk",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Internal service desk",
  summary:
    "Build a full-stack service desk where users submit support requests, staff manage tickets, and " +
    "requesters can follow their status: a React frontend backed by a Node and Express API with a relational " +
    "database, authentication, authorization, Docker, automated tests, and CI.",
  stack: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Jest", "Playwright"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and protected application pages cannot be accessed without authentication." },
    { id: "tickets", text: "Authenticated users can create support tickets with a title, description and category, and can view the tickets they are allowed to access." },
    { id: "workflow", text: "Staff users can assign tickets and change their status through a defined workflow, while requesters can see status changes." },
    { id: "authorization", text: "The API enforces ownership and staff permissions for ticket reads and writes; hiding controls in React is not sufficient." },
    { id: "api", text: "The Express API exposes consistent JSON endpoints with appropriate HTTP status codes for success, validation errors, missing resources and forbidden actions." },
    { id: "validation", text: "The API validates incoming ticket and account data and returns field-level or clearly attributable validation errors to the client." },
    { id: "client-api", text: "The React client uses a centralized API layer for server requests and displays loading, empty and error states for ticket views." },
    { id: "database", text: "The relational database stores users, tickets and ticket assignments with keys and constraints that prevent invalid references." },
    { id: "docker", text: "The application and database can be started locally through Docker Compose with persistent database storage.", check: CHECKS.compose },
    { id: "tests", text: "Automated tests cover API authentication, ticket authorization, core React behaviour and at least one complete browser workflow.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains local setup, environment variables, Docker commands, database initialization, tests and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting and automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "fullstack-engineer-5", description: "The React client and Express API work together correctly across ticket creation, assignment and status changes." },
    { id: "frontend", name: "Frontend quality", weight: 15, layerId: "fullstack-engineer-2", description: "React components, hooks, routing and state flow are structured clearly and handle real UI states." },
    { id: "backend", name: "Backend & API", weight: 15, layerId: "fullstack-engineer-7", description: "The API has clear boundaries, validation and efficient data access appropriate to its ticket workflows." },
    { id: "database", name: "Database", weight: 15, layerId: "fullstack-engineer-4", description: "Tables, relationships, constraints and indexes correctly represent the application's relational data." },
    { id: "security", name: "Authentication & authorization", weight: 15, layerId: "fullstack-engineer-6", description: "Credentials, tokens or sessions and protected routes are implemented securely with server-side authorization checks." },
    { id: "delivery", name: "Testing & delivery", weight: 15, layerId: "fullstack-engineer-9", description: "Tests exercise the stack at appropriate levels and the application can be reproduced through the documented development setup." },
  ],

  twistPool: [
    { id: "comments", text: "Requesters can add comments to their own tickets, staff can reply, and the API prevents users from commenting on tickets they cannot access." },
    { id: "attachments", text: "Tickets support file metadata records with filename and size, and the API rejects files whose recorded size exceeds a documented application limit." },
    { id: "priority", text: "Staff can set a ticket priority, and the staff queue can sort tickets by priority and creation time using server-side query parameters." },
    { id: "sla", text: "Each ticket records a response deadline based on its priority, and the staff queue clearly identifies tickets whose deadline has passed." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — MEAN Developer track (mean), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "mean",
  categoryId: "fullstack",
  slug: "mean-event-hub",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Community event hub",
  summary:
    "Build a full-stack community event hub where users discover events, register for them, and manage " +
    "their own events: an Angular client connected to a Node and Express API backed by MongoDB and Mongoose, " +
    "with reactive data flows, authentication, protected routes, testing, and production-ready builds.",
  stack: ["Angular", "TypeScript", "RxJS", "Node.js", "Express", "MongoDB", "Mongoose"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and authenticated sessions persist across page refreshes." },
    { id: "events", text: "Authenticated users can create, edit and delete events with a title, description, date, location and capacity." },
    { id: "discovery", text: "Users can browse events and view an individual event's details through Angular routes." },
    { id: "registration", text: "Authenticated users can register for an event and cancel their registration, and the API prevents registrations after capacity is reached." },
    { id: "ownership", text: "Only the event owner can edit or delete that event, and authorization is enforced by the Express API." },
    { id: "angular-api", text: "Angular services use HttpClient and Observables for API communication, with visible loading and error states." },
    { id: "reactive", text: "At least one user-facing workflow combines or transforms multiple Observable streams using appropriate RxJS operators rather than manually nesting subscriptions." },
    { id: "forms", text: "Event creation and editing use Angular forms with validation messages for required fields, invalid dates and invalid capacity values." },
    { id: "database", text: "MongoDB data is modeled with Mongoose schemas and references, and event registration queries avoid returning unnecessary fields." },
    { id: "tests", text: "Angular unit tests and backend tests cover authentication, event ownership, registration capacity and at least one form validation path.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, database configuration, running the Angular client and API, tests and production builds.", check: CHECKS.readme },
    { id: "ci", text: "CI runs the project's lint and automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "mean-7", description: "Angular and Express communicate correctly across authentication, event management and registration workflows." },
    { id: "angular", name: "Angular architecture", weight: 15, layerId: "mean-3", description: "Components, services, routing and dependency injection are organized into clear Angular boundaries." },
    { id: "reactive", name: "Reactive programming", weight: 15, layerId: "mean-4", description: "Observable streams and RxJS operators are used appropriately for asynchronous and combined application state." },
    { id: "backend", name: "Backend & data", weight: 15, layerId: "mean-6", description: "Express endpoints and Mongoose models represent event and registration data correctly and efficiently." },
    { id: "security", name: "Authentication & authorization", weight: 15, layerId: "mean-8", description: "JWT handling, password security, Express middleware and Angular route guards protect private operations." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "mean-10", description: "Frontend and backend behaviour is tested and the project can be built for production using documented commands." },
  ],

  twistPool: [
    { id: "waitlist", text: "When an event reaches capacity, users can join a waitlist, and the API promotes the earliest waiting user when a registered attendee cancels." },
    { id: "categories", text: "Events have one or more categories, and the discovery page can filter events by category using a query parameter handled by the API." },
    { id: "favorites", text: "Authenticated users can favorite events, and a separate favorites view loads only the current user's favorited events from the API." },
    { id: "reminders", text: "Users can enable a reminder for an event they registered for, and the event detail view clearly shows whether the reminder is enabled." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — JAMstack Developer track (jamstack), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "jamstack",
  categoryId: "fullstack",
  slug: "jamstack-conference-site",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Conference content site",
  summary:
    "Build a content-driven conference website using JAMstack techniques: a React interface with Next.js " +
    "and Gatsby content workflows, headless CMS data, serverless functions, protected attendee features, " +
    "search-friendly pages, and deployment automation.",
  stack: ["React", "Next.js", "Gatsby", "Contentful", "Serverless Functions", "Netlify"],

  requirements: [
    { id: "content", text: "The site displays conference sessions and speakers from a headless CMS, with dedicated pages for each session and speaker." },
    { id: "static-pages", text: "Public content pages are statically generated and can be rebuilt when CMS content changes." },
    { id: "gatsby-data", text: "At least one Gatsby page or template is generated from CMS or source data through GraphQL rather than hardcoded page content." },
    { id: "rich-text", text: "CMS rich-text content is rendered safely into the appropriate page structure without displaying raw serialized content." },
    { id: "api", text: "A serverless function provides at least one protected or server-side operation that keeps its secret configuration out of browser code." },
    { id: "auth", text: "Users can sign in through an identity provider and access a protected attendee page that is unavailable to logged-out users." },
    { id: "seo", text: "Session and speaker pages provide unique titles, descriptions and structured metadata appropriate to their content." },
    { id: "performance", text: "Images and non-critical client code are optimized so the public pages do not load the complete application bundle before displaying content." },
    { id: "client", text: "A React-based web client lives in the repository.", check: { type: "file", glob: "**/*.{jsx,tsx}" } },
    { id: "tests", text: "Automated tests cover CMS-derived content rendering, the protected serverless operation and at least one public page workflow.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains CMS setup, environment variables, local development, build commands, tests and deployment configuration.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting, tests and the production build on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "jamstack-5", description: "CMS content, generated pages, rich text and attendee workflows operate correctly from source to rendered page." },
    { id: "static", name: "Static architecture", weight: 15, layerId: "jamstack-3", description: "Next.js static generation, routing and asset optimization are used appropriately for public content." },
    { id: "gatsby", name: "Gatsby data layer", weight: 15, layerId: "jamstack-4", description: "GraphQL queries, source data and programmatic page generation form a coherent Gatsby implementation." },
    { id: "serverless", name: "Serverless & security", weight: 15, layerId: "jamstack-6", description: "Serverless functions isolate server-side operations and secrets from browser code." },
    { id: "auth", name: "Authentication", weight: 15, layerId: "jamstack-7", description: "Identity and protected content flows correctly distinguish authenticated and unauthenticated users." },
    { id: "delivery", name: "Performance & delivery", weight: 15, layerId: "jamstack-10", description: "The site has reproducible builds, deployment automation and configuration suitable for continuous delivery." },
  ],

  twistPool: [
    { id: "schedule", text: "Sessions can be filtered by conference day and track, with the filter state represented in the URL so a filtered page can be shared directly." },
    { id: "speakers", text: "Each speaker page lists that speaker's sessions and links between related session and speaker pages are generated from CMS relationships." },
    { id: "newsletter", text: "A serverless function accepts newsletter subscriptions, validates the email address and returns a useful success or error response without exposing the email-service secret." },
    { id: "preview", text: "Editors can open a protected preview route that renders draft CMS content without making that draft content part of the normal production build." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
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
    { id: "tests", text: "Tests cover authentication, recipe ownership, ingredient persistence, an optimized API workflow and a React component.", check: CHECKS.jsTests },
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
};/**
 * Capstone brief — Ruby on Rails Dev track (rails-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "rails-dev",
  categoryId: "fullstack",
  slug: "rails-dev-volunteer-board",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Volunteer opportunity board",
  summary:
    "Build a Rails application where organizations publish volunteer opportunities and users apply for them: " +
    "a conventional MVC application with Active Record, authenticated users, authorization, Hotwire interactions, " +
    "background jobs, email notifications, an API endpoint, automated tests, and continuous integration.",
  stack: ["Ruby", "Ruby on Rails", "Active Record", "Hotwire", "Stimulus", "Sidekiq", "RSpec"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and authenticated users have access to protected volunteer actions." },
    { id: "opportunities", text: "Organizations can create, edit and delete volunteer opportunities with a title, description, date, location and capacity." },
    { id: "applications", text: "Authenticated users can apply to an available opportunity and withdraw their application, while the application cannot exceed the opportunity capacity." },
    { id: "authorization", text: "Only the organization that owns an opportunity can edit or delete it, and authorization is enforced server-side." },
    { id: "validation", text: "Models and controllers reject invalid opportunity and application data and return useful validation feedback to the user." },
    { id: "hotwire", text: "At least one application workflow updates part of the page through Turbo Frames or Turbo Streams without a full-page reload." },
    { id: "stimulus", text: "At least one interactive form or UI behaviour uses a focused Stimulus controller rather than embedding the behaviour directly in a view template." },
    { id: "background", text: "Application confirmation or another non-critical notification is sent through a background job rather than during the main request." },
    { id: "api", text: "The application exposes a documented JSON endpoint for listing opportunities and requires authentication for any private data." },
    { id: "tests", text: "RSpec model and request specs cover validations, authorization and application capacity, and at least one system workflow uses Capybara.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, database preparation, background worker startup, tests and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs the Rails test suite and required checks on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "rails-dev-3", description: "Active Record models, associations, validations and application workflows behave correctly." },
    { id: "mvc", name: "Rails architecture", weight: 15, layerId: "rails-dev-2", description: "Routes, controllers and views follow coherent Rails MVC conventions." },
    { id: "hotwire", name: "Hotwire interaction", weight: 15, layerId: "rails-dev-6", description: "Turbo and Stimulus provide useful progressive interactions without turning the application into an unnecessary client-side SPA." },
    { id: "security", name: "Authentication & authorization", weight: 15, layerId: "rails-dev-5", description: "Sessions, password handling and authorization rules protect user and organization actions." },
    { id: "background-api", name: "Jobs & API", weight: 15, layerId: "rails-dev-7", description: "Background work is reliable and the application's API boundary is appropriately designed." },
    { id: "tests", name: "Testing", weight: 15, layerId: "rails-dev-10", description: "Model, request and browser-level tests exercise meaningful application behaviour and the project runs in CI." },
  ],

  twistPool: [
    { id: "waitlist", text: "When an opportunity reaches capacity, users can join a waitlist, and withdrawing an application promotes the earliest waiting user through a background job." },
    { id: "favorites", text: "Users can bookmark opportunities, and a dedicated page lists their bookmarks without allowing users to bookmark the same opportunity twice." },
    { id: "organizations", text: "A user can belong to multiple organizations with an owner or member role, and only organization owners can manage organization membership." },
    { id: "recurring", text: "Organizations can mark an opportunity as recurring and create the next occurrence from the current opportunity while preserving a link to the original." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Next.js Full Stack Dev track (next-fullstack), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "next-fullstack",
  categoryId: "fullstack",
  slug: "next-fullstack-invoice-desk",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Invoice desk",
  summary:
    "Build a full-stack invoice desk where authenticated users manage customers and invoices, generate " +
    "invoice views, and record payments: a Next.js App Router application using Server Components, Server " +
    "Actions, Prisma, authentication, caching, API integrations, Stripe webhooks, automated tests, and Vercel deployment.",
  stack: ["Next.js", "TypeScript", "React", "Prisma", "Tailwind CSS", "Stripe", "Vitest", "Playwright"],

  requirements: [
    { id: "auth", text: "Users can authenticate and access only their own customers and invoices, with protected routes and server-side authorization checks." },
    { id: "customers", text: "Authenticated users can create, edit and delete customers with validated contact information." },
    { id: "invoices", text: "Users can create invoices containing line items, quantities and prices, and the server calculates the invoice total from persisted line-item data." },
    { id: "server-actions", text: "At least one invoice mutation uses a Server Action with server-side validation and revalidation of affected pages or data." },
    { id: "rendering", text: "The application uses Server Components for data-heavy views and Client Components only where browser interactivity requires them." },
    { id: "caching", text: "At least one invoice or customer read uses an intentional cache or revalidation strategy, and the implementation explains when stale data is acceptable." },
    { id: "api", text: "A route handler exposes a JSON endpoint for retrieving invoice data and returns appropriate status codes for missing and unauthorized resources." },
    { id: "payment", text: "Users can start a payment flow for an unpaid invoice through Stripe, and the application does not trust client-provided payment status." },
    { id: "webhook", text: "A Stripe webhook verifies the incoming signature before recording a payment result in the database." },
    { id: "tests", text: "Vitest tests cover invoice total calculation and authorization, and Playwright covers a complete invoice creation workflow.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains local setup, environment variables, Prisma migrations, Stripe webhook development, tests, Vercel deployment and production database setup.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting, type checking and automated tests on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "next-fullstack-5", description: "Invoice creation, mutation, totals, payment state and revalidation work correctly across server boundaries." },
    { id: "rendering", name: "Next.js architecture", weight: 15, layerId: "next-fullstack-3", description: "Server and Client Components, streaming or suspense boundaries and rendering modes are chosen appropriately." },
    { id: "database", name: "Database & persistence", weight: 15, layerId: "next-fullstack-4", description: "Prisma models, relations, migrations and queries correctly represent invoice data." },
    { id: "caching", name: "Data & caching", weight: 15, layerId: "next-fullstack-8", description: "Caching, revalidation and optimistic or parallel data patterns are applied deliberately to real workflows." },
    { id: "security", name: "Authentication & integrations", weight: 15, layerId: "next-fullstack-6", description: "Protected server operations and authentication state prevent unauthorized data access." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "next-fullstack-10", description: "Unit and browser tests provide meaningful coverage and the application is configured for Vercel deployment." },
  ],

  twistPool: [
    { id: "recurring", text: "Users can mark an invoice as recurring and create its next invoice from a server-side action while preserving the original invoice as historical data." },
    { id: "pdf", text: "Each invoice has a dedicated print-friendly route that renders only the invoice content and can be saved as a PDF through normal browser printing." },
    { id: "overdue", text: "Invoices have a due date, and the dashboard provides a server-computed overdue count without treating an invoice as overdue merely because a client clock says so." },
    { id: "discounts", text: "Invoices support percentage or fixed discounts, and the final total is calculated and validated on the server using the persisted line items and discount data." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
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
    { id: "reminders", text: "Users can configure a reminder time for each habit, and the habit settings form validates that the configured time is in a valid format." },
    { id: "archive", text: "Users can archive habits without deleting their historical completion records, and archived habits are excluded from the default active-habit view." },
    { id: "weekly", text: "The dashboard provides a weekly progress view whose date range is selected through URL search parameters and loaded on the server." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};

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
};/**
 * Capstone brief — Astro Developer track (astro-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "astro-dev",
  categoryId: "fullstack",
  slug: "astro-dev-documentation-portal",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Documentation portal",
  summary:
    "Build a documentation portal for a software project using Astro: structured content collections, " +
    "Markdown and MDX pages, interactive framework islands, server endpoints, external data, responsive " +
    "styling, strong SEO and performance, automated tests, and deployment.",
  stack: ["Astro", "TypeScript", "MDX", "Tailwind CSS", "Vitest", "Playwright"],

  requirements: [
    { id: "docs", text: "The site contains documentation organized into sections with a shared layout, navigation and individual article pages." },
    { id: "collections", text: "Documentation articles are stored in an Astro content collection with a Zod schema that validates required frontmatter." },
    { id: "mdx", text: "At least one documentation page uses MDX to render an interactive or reusable component inside the content." },
    { id: "routing", text: "Article pages use dynamic routing and generate valid paths from the project's content rather than hardcoding every route." },
    { id: "islands", text: "At least one interactive feature uses an appropriate client directive so JavaScript is shipped only for the component that needs it." },
    { id: "search", text: "Users can search or filter documentation through an interactive UI, and the implementation does not hydrate the entire documentation site unnecessarily." },
    { id: "endpoint", text: "An Astro server endpoint returns documentation metadata as JSON and returns a clear error response for an invalid or missing resource." },
    { id: "external-data", text: "A documentation page displays data from an external API through server-side code without exposing private configuration to browser JavaScript." },
    { id: "seo", text: "Documentation pages define appropriate titles, descriptions, canonical information where applicable, and structured metadata for articles." },
    { id: "tests", text: "Vitest tests cover content or utility logic, and Playwright covers navigation from the documentation index to an article and its interactive feature.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains content authoring, local development, environment variables, test commands and the selected Astro deployment adapter.", check: CHECKS.readme },
    { id: "ci", text: "CI runs linting, type checking, tests and the production build on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "astro-dev-4", description: "Content collections, article routing, MDX content and metadata work correctly from source to rendered page." },
    { id: "astro", name: "Astro architecture", weight: 15, layerId: "astro-dev-2", description: "Astro components, props, layouts and content boundaries are organized appropriately." },
    { id: "islands", name: "Islands & interactivity", weight: 15, layerId: "astro-dev-5", description: "Interactive framework components use appropriate hydration strategies and avoid unnecessary client-side JavaScript." },
    { id: "server", name: "Server rendering & endpoints", weight: 15, layerId: "astro-dev-7", description: "Server output and API endpoints correctly handle dynamic data and request validation." },
    { id: "performance", name: "Performance & SEO", weight: 15, layerId: "astro-dev-9", description: "The site minimizes shipped JavaScript, handles assets appropriately and provides complete search-engine metadata." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "astro-dev-10", description: "Unit and browser tests exercise important behaviour and the project has a reproducible production deployment setup." },
  ],

  twistPool: [
    { id: "versions", text: "Documentation articles support a version field, and the documentation index allows users to select a version while generated article URLs remain unambiguous." },
    { id: "feedback", text: "Each article has a client-side helpful or not-helpful control backed by an Astro server endpoint that validates the submitted article identifier." },
    { id: "toc", text: "Article pages generate a table of contents from their headings and link each entry to the corresponding heading without requiring a client-side framework for the initial render." },
    { id: "changelog", text: "The portal has a changelog generated from structured content, with individual release pages linked from the changelog index." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
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
    { id: "tests", text: "Pest tests cover authentication, authorization, request validation and a database-backed request workflow, and Vue components have automated tests.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, database migrations and seeding, queue startup, tests and Docker usage.", check: CHECKS.readme },
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
    { id: "attachments", text: "Users can attach file metadata to a maintenance request, with server-side validation for filename and maximum recorded file size." },
    { id: "scheduled", text: "Staff can schedule a maintenance request for a future date, and the request list supports filtering by scheduled date through a paginated API query." },
    { id: "ratings", text: "After a request is completed, the tenant can submit a one-time rating and optional comment, while the API rejects ratings for incomplete requests or duplicate ratings." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
/**
 * Capstone brief — Remix Developer track (remix-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "remix-dev",
  categoryId: "fullstack",
  slug: "remix-dev-booking-desk",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Workshop booking desk",
  summary:
    "Build a workshop booking desk where organizers publish workshops and users reserve available seats: a Remix " +
    "application using nested routes, loaders, actions, Prisma persistence, cookie sessions, optimistic interactions, " +
    "HTTP caching, reusable styling, automated tests, and production deployment.",
  stack: ["Remix", "TypeScript", "React", "Prisma", "Zod", "Tailwind CSS", "Vitest", "Playwright"],

  requirements: [
    { id: "auth", text: "Users can sign up and log in using cookie-based sessions, and protected loaders and actions require an authenticated user." },
    { id: "workshops", text: "Organizers can create, edit and delete workshops with a title, description, date, location and seat capacity." },
    { id: "browse", text: "Users can browse workshops through nested Remix routes and open an individual workshop page using a dynamic route parameter." },
    { id: "booking", text: "Authenticated users can reserve and cancel a workshop seat, and the server rejects a reservation when the workshop is full." },
    { id: "authorization", text: "Only the workshop organizer can edit or delete it, and authorization is enforced inside the relevant Remix loaders or actions." },
    { id: "loaders", text: "Workshop data is loaded through Remix loaders and exposed to components through typed useLoaderData results." },
    { id: "actions", text: "Workshop creation and booking mutations use Remix actions and forms, with server-side validation and useful pending states." },
    { id: "errors", text: "The application defines route-level error boundaries and handles not-found workshop requests with an appropriate HTTP response." },
    { id: "database", text: "Prisma models users, workshops and bookings with relations and constraints that prevent duplicate bookings by the same user." },
    { id: "caching", text: "At least one public workshop response uses intentional HTTP caching headers, while private booking data is not publicly cached." },
    { id: "tests", text: "Vitest tests cover validation or booking logic, and Playwright covers login, browsing a workshop and completing a booking.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, environment variables, Prisma migrations, test commands, deployment target and production configuration.", check: CHECKS.readme },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "remix-dev-4", description: "Actions and forms correctly implement workshop creation, editing, booking and cancellation workflows." },
    { id: "routing", name: "Routing & data loading", weight: 15, layerId: "remix-dev-3", description: "Nested routes, loaders, URL parameters and typed loader data form a clear server-driven data flow." },
    { id: "database", name: "Database & persistence", weight: 15, layerId: "remix-dev-5", description: "Prisma models, relations and queries correctly persist workshops and bookings." },
    { id: "auth", name: "Authentication & sessions", weight: 15, layerId: "remix-dev-6", description: "Cookie sessions, password handling and protected loaders and actions correctly enforce user boundaries." },
    { id: "resilience", name: "Errors & resilience", weight: 15, layerId: "remix-dev-7", description: "Error boundaries, status codes and not-found handling provide predictable failure behaviour." },
    { id: "tests-deploy", name: "Testing & deployment", weight: 15, layerId: "remix-dev-10", description: "Unit and browser tests cover important workflows and the project has a documented production deployment configuration." },
  ],

  twistPool: [
    { id: "waitlist", text: "When a workshop is full, users can join a waitlist, and cancelling a booking makes the earliest waiting user eligible for a seat without modifying the workshop capacity." },
    { id: "filters", text: "The workshop index supports filtering by date and category through URL search parameters, with filtering performed by the server loader rather than only in the browser." },
    { id: "favorites", text: "Authenticated users can bookmark workshops, and the application provides a bookmark page backed by a user-specific database query." },
    { id: "organizer", text: "Organizers can view a participant list for their own workshops, while a participant cannot access another workshop's private attendee data." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
};