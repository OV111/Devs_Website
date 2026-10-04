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
    { id: "ci", text: "CI runs linting and the automated tests on every push.", check: CHECKS.ci },
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
