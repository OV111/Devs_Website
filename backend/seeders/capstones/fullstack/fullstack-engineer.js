/**
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
};
