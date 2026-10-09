/**
 * Capstone brief — typescript track (typescript), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the roadmap layer that teaches it, for weak-spot tracking.
 * - Bump `version` for any change that affects grading; never edit a
 *   published version in place (attempts point at the exact brief document).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "typescript",
  categoryId: "languages",
  slug: "typescript-type-safe-orm",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Type-Safe In-Memory Query Builder & ORM Core",
  summary:
    "Build a lightweight, strictly typed query builder and in-memory repository layer in TypeScript. " +
    "Leverage advanced mapped types, conditional types, template literals, and generics to ensure total compile-time " +
    "type safety for schema definitions, filtering, select projections, and query executions.",
  stack: ["TypeScript 5+", "Node.js", "Vitest", "tsconfig"],

  requirements: [
    {
      id: "schema-inference",
      text: "Infer model interfaces directly from schema field definitions using generic parameters and interfaces.",
    },
    {
      id: "query-builder",
      text: "Construct a chainable query builder supporting typed select, where filtering, order, and limit methods.",
    },
    {
      id: "type-narrowing",
      text: "Implement dynamic type guards and assertions to validate user input against defined entity types.",
    },
    {
      id: "result-monad",
      text: "Return execution outputs using a type-safe Result<T, E> monad rather than throwing plain errors.",
    },
    {
      id: "advanced-types",
      text: "Utilize mapped types, conditional infer types, and template literals for query property selection.",
    },
    {
      id: "tsconfig",
      text: "Include strict tsconfig.json with explicit strict mode and module resolution flags enabled.",
      check: { type: "file", glob: "tsconfig.json" },
    },
    {
      id: "type-tests",
      text: "Provide type-level assertion unit tests validating that invalid query options trigger TypeScript compilation errors.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README includes detailed API usage examples, type design choices, and build instructions.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks type compilation (tsc --noEmit) and runs test suites on every commit.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "advanced-type-system",
      name: "Type System Engineering",
      weight: 25,
      layerId: "typescript-6",
      description:
        "Effective usage of mapped types, conditional types, template literals, and infer keywords.",
    },
    {
      id: "generics-design",
      name: "Generic Constraints & Inference",
      weight: 20,
      layerId: "typescript-4",
      description:
        "Design of reusable generic interfaces and functions that infer return shapes dynamically.",
    },
    {
      id: "type-narrowing",
      name: "Narrowing & Safety",
      weight: 15,
      layerId: "typescript-3",
      description:
        "Proper deployment of custom type guards, discriminating unions, and safe runtime conversion.",
    },
    {
      id: "async-error-patterns",
      name: "Async & Result Patterns",
      weight: 15,
      layerId: "typescript-8",
      description:
        "Clean async flow with strict typed error handling via Result/Option abstractions.",
    },
    {
      id: "testing",
      name: "Type & Unit Testing",
      weight: 15,
      layerId: "typescript-9",
      description:
        "Tests verify runtime logic and validate compile-time type errors.",
    },
    {
      id: "configuration",
      name: "Tooling & Config",
      weight: 10,
      layerId: "typescript-7",
      description:
        "Strict compiler settings, module exporting, and complete setup docs.",
    },
  ],

  twistPool: [
    {
      id: "relation-joins",
      text: "Add support for 1-to-many relationship declarations and type-safe query inner join selections.",
    },
    {
      id: "migrations",
      text: "Implement a typed schema diffing engine that computes required migration actions between two schemas.",
    },
    {
      id: "event-hooks",
      text: "Add type-safe lifecycle hooks (beforeSave, afterUpdate) with event payload types derived from the entity schema.",
    },
    {
      id: "validation-decorator",
      text: "Add field-level validation decorators using TS decorators to validate entity constraints at runtime.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
