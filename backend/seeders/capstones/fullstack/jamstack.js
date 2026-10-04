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
};
