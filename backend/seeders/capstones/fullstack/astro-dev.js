/**
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
};
