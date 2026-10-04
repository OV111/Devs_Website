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
};
