/**
 * Capstone brief — ruby track (ruby), v1.
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
  trackId: "ruby",
  categoryId: "languages",
  slug: "ruby-background-job-processor",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Multi-Threaded Background Job Processing Library",
  summary:
    "Build an in-memory multi-threaded background job queue engine in idiomatic Ruby. " +
    "You will design custom DSLs using metaprogramming, build thread-safe worker pools, handle exceptions with retry policies, " +
    "and package the engine as a clean Ruby Gem with a comprehensive RSpec test suite.",
  stack: ["Ruby 3.2+", "RSpec", "Bundler", "Gemspec"],

  requirements: [
    {
      id: "gem-structure",
      text: "Project formatted as a valid Ruby Gem with a working .gemspec file.",
      check: { type: "file", glob: "**/*.gemspec" },
    },
    {
      id: "enumerable-collections",
      text: "Process job queues using advanced Enumerable methods (map, select, reduce) and yield custom blocks.",
    },
    {
      id: "blocks-procs",
      text: "Accept job payloads as blocks, Procs, or Lambdas with dynamic parameter binding.",
    },
    {
      id: "class-mixins",
      text: "Provide job capabilities via module mixins (include/extend) with custom class macros.",
    },
    {
      id: "metaprogramming-dsl",
      text: "Implement a clean worker DSL using dynamic method evaluation (class_eval/instance_eval or define_method).",
    },
    {
      id: "concurrency-safety",
      text: "Process jobs concurrently across threads using Mutex synchronization to guarantee queue safety.",
    },
    {
      id: "exception-handling",
      text: "Rescue job execution exceptions with configurable retry limits and backoff handling.",
    },
    {
      id: "rspec-tests",
      text: "Comprehensive RSpec test suite with describe/it blocks testing job enqueueing and execution.",
      check: { type: "file", glob: "**/*_spec.rb" },
    },
    {
      id: "readme",
      text: "README documents DSL usage, gem setup, thread safety, and test commands.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions CI runs bundle exec rspec on every push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "dsl-metaprogramming",
      name: "Metaprogramming & DSL",
      weight: 25,
      layerId: "ruby-9",
      description:
        "Elegantly designed DSL using instance_eval, dynamic methods, and class macros without brittle hacks.",
    },
    {
      id: "concurrency",
      name: "Concurrency & Thread Safety",
      weight: 15,
      layerId: "ruby-10",
      description:
        "Safe multi-threaded worker queue execution using Mutex or Thread abstractions.",
    },
    {
      id: "blocks-enumerables",
      name: "Blocks, Procs & Enumerables",
      weight: 15,
      layerId: "ruby-3",
      description:
        "Mastery of blocks, yield syntax, Procs, Lambdas, and Enumerable composition.",
    },
    {
      id: "oop-mixins",
      name: "OOP & Module Mixins",
      weight: 15,
      layerId: "ruby-4",
      description:
        "Clean class architecture using module mixins, access control, and clear encapsulation.",
    },
    {
      id: "rspec-testing",
      name: "RSpec Testing",
      weight: 15,
      layerId: "ruby-8",
      description:
        "Thorough spec coverage utilizing matchers, before hooks, and let blocks.",
    },
    {
      id: "packaging-gems",
      name: "Gems & Tooling",
      weight: 15,
      layerId: "ruby-7",
      description:
        "Proper Gemfile/gemspec setup, semantic versioning, and working CI automation.",
    },
  ],

  twistPool: [
    {
      id: "cron-scheduler",
      text: "Add recurrent job scheduling support parsing simple cron expressions to enqueue jobs periodically.",
    },
    {
      id: "job-middleware",
      text: "Implement a middleware pipeline mechanism allowing custom wrapper blocks around job execution.",
    },
    {
      id: "rate-limiter",
      text: "Add worker concurrency rate-limiting based on maximum execution counters per queue.",
    },
    {
      id: "web-dashboard",
      text: "Build a tiny Rack application endpoint displaying queue statistics and active thread status.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
