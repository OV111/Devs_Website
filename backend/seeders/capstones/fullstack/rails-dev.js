/**
 * Capstone brief — Ruby on Rails Dev track (rails-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — stays "draft" until a human has read every
 * requirement, rubric line and twist. Shape notes: follows the capstone brief schema.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "rails-dev",
  categoryId: "fullstack",
  slug: "rails-dev-volunteer-board",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Volunteer opportunity board",
  summary:
    "Build a Rails application where organizations publish volunteer opportunities and users apply for them: " +
    "a conventional MVC application with Active Record, authenticated users, authorization, Hotwire interactions, " +
    "background jobs, email notifications, an API endpoint, automated tests, and continuous integration.",
  stack: ["Ruby", "Ruby on Rails", "Active Record", "Hotwire", "Stimulus", "Sidekiq", "RSpec"],

  requirements: [
    { id: "auth", text: "Users can register and log in, and authenticated users have access to protected volunteer actions." },
    { id: "opportunities", text: "Organizations can create, edit and delete volunteer opportunities with a title, description, date, location and capacity." },
    { id: "applications", text: "Authenticated users can apply to an available opportunity and withdraw their application, while the application cannot exceed the opportunity capacity." },
    { id: "authorization", text: "Only the organization that owns an opportunity can edit or delete it, and authorization is enforced server-side." },
    { id: "validation", text: "Models and controllers reject invalid opportunity and application data and return useful validation feedback to the user." },
    { id: "hotwire", text: "At least one application workflow updates part of the page through Turbo Frames or Turbo Streams without a full-page reload." },
    { id: "stimulus", text: "At least one interactive form or UI behaviour uses a focused Stimulus controller rather than embedding the behaviour directly in a view template." },
    { id: "background", text: "Application confirmation or another non-critical notification is sent through a background job rather than during the main request." },
    { id: "api", text: "The application exposes a documented JSON endpoint for listing opportunities and requires authentication for any private data." },
    { id: "tests", text: "RSpec model and request specs cover validations, authorization and application capacity, and at least one system workflow uses Capybara.", check: { type: "file", glob: "spec/**/*_spec.rb" } },
    { id: "readme", text: "README explains setup, environment variables, database preparation, background worker startup, tests and deployment.", check: CHECKS.readme },
    { id: "ci", text: "CI runs the Rails test suite and required checks on every push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "rails-dev-3", description: "Active Record models, associations, validations and application workflows behave correctly." },
    { id: "mvc", name: "Rails architecture", weight: 15, layerId: "rails-dev-2", description: "Routes, controllers and views follow coherent Rails MVC conventions." },
    { id: "hotwire", name: "Hotwire interaction", weight: 15, layerId: "rails-dev-6", description: "Turbo and Stimulus provide useful progressive interactions without turning the application into an unnecessary client-side SPA." },
    { id: "security", name: "Authentication & authorization", weight: 15, layerId: "rails-dev-5", description: "Sessions, password handling and authorization rules protect user and organization actions." },
    { id: "background-api", name: "Jobs & API", weight: 15, layerId: "rails-dev-7", description: "Background work is reliable and the application's API boundary is appropriately designed." },
    { id: "tests", name: "Testing", weight: 15, layerId: "rails-dev-10", description: "Model, request and browser-level tests exercise meaningful application behaviour and the project runs in CI." },
  ],

  twistPool: [
    { id: "waitlist", text: "When an opportunity reaches capacity, users can join a waitlist, and withdrawing an application promotes the earliest waiting user through a background job." },
    { id: "favorites", text: "Users can bookmark opportunities, and a dedicated page lists their bookmarks without allowing users to bookmark the same opportunity twice." },
    { id: "organizations", text: "A user can belong to multiple organizations with an owner or member role, and only organization owners can manage organization membership." },
    { id: "recurring", text: "Organizations can mark an opportunity as recurring and create the next occurrence from the current opportunity while preserving a link to the original." },
  ],

  rules: COMMON_RULES,
  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
