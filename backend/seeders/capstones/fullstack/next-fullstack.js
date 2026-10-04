/**
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
};
