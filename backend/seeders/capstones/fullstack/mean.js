/**
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
    { id: "reminders", text: "Registered attendees get a reminder 24 hours before an event, sent by a scheduled backend job (a logging stub is fine) that never reminds the same person twice for the same event." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
