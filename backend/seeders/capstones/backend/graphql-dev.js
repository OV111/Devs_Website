/**
 * Capstone brief — GraphQL Developer track (graphql-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: see api-dev.js.
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it
 * until its layer exams are seeded (a capstone unlocks after all of them).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "graphql-dev",
  categoryId: "backend",
  slug: "graphql-dev-recipe-community",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "GraphQL API for a recipe community",
  summary:
    "Build the GraphQL API behind a recipe-sharing community: recipes, ingredients, comments and " +
    "ratings, with nested queries that stay fast. The challenge is schema design that clients love and " +
    "a server that survives the queries those clients write.",
  stack: ["Node.js", "Apollo Server", "TypeScript", "Prisma", "PostgreSQL", "DataLoader"],

  requirements: [
    { id: "auth", text: "Authentication through the context; mutations require a signed-in user and owners alone can edit their recipes." },
    { id: "schema", text: "A schema-first SDL with clear nullability, input types for mutations and cursor-based pagination.", check: CHECKS.graphqlSchema },
    { id: "queries", text: "Clients can fetch a recipe with its author, ingredients, comments and average rating in one query." },
    { id: "n-plus-one", text: "Nested fields are batched with DataLoader; a list of 50 recipes with authors does not run 51 queries." },
    { id: "errors", text: "Errors use consistent extensions codes (UNAUTHENTICATED, FORBIDDEN, BAD_USER_INPUT); internals are never leaked." },
    { id: "limits", text: "Query depth and complexity are limited so a hostile nested query is refused." },
    { id: "tests", text: "Integration tests run real operations against the server, including authorisation failures.", check: CHECKS.jsTests },
    { id: "readme", text: "README explains setup, an example query per main type, and how to run the tests.", check: CHECKS.readme },
    { id: "docker", text: "The server and PostgreSQL start with one command.", check: CHECKS.compose },
    { id: "ci", text: "CI runs type checks, lint and the tests on every push.", check: CHECKS.ci },
    { id: "no-secrets", text: "No secrets committed; configuration from environment variables with an .env.example.", check: CHECKS.envExample },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 20, layerId: "graphql-dev-4", description: "Resolvers return the right data for every operation and your twist." },
    { id: "schema", name: "Schema design", weight: 20, layerId: "graphql-dev-3", description: "Types, nullability, inputs and pagination are designed for clients, not mirrored from tables." },
    { id: "performance", name: "Data loading & performance", weight: 20, layerId: "graphql-dev-6", description: "No N+1 queries; batching and caching are applied where they matter." },
    { id: "security", name: "Auth & query safety", weight: 15, layerId: "graphql-dev-8", description: "Field- and object-level authorisation plus depth/complexity limits." },
    { id: "tests", name: "Tests", weight: 15, layerId: "graphql-dev-10", description: "Operations are tested end to end, including failure cases." },
    { id: "server", name: "Server setup & docs", weight: 10, layerId: "graphql-dev-5", description: "Apollo is configured deliberately, with typed resolvers and a usable README." },
  ],

  twistPool: [
    { id: "subscriptions", text: "Clients can subscribe to new comments on a recipe over WebSockets, with authentication on the connection." },
    { id: "search", text: "A search query filters recipes by ingredients the user has and ranks by how many are matched." },
    { id: "persisted-queries", text: "In production mode the server accepts only persisted queries; arbitrary query strings are refused." },
    { id: "unions", text: "A feed query returns a union of recipes, comments and ratings from followed users, newest first, with cursor pagination." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
