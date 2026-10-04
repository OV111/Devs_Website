/**
 * Capstone brief — Move Developer track (move-developer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-03 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "move-developer",
  categoryId: "blockchain",
  slug: "move-developer-membership-dao",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Build a Move membership and proposal system",
  summary:
    "Build a Move-based membership system for a small on-chain organization. Members receive " +
    "non-copyable membership resources, can create proposals and vote, and approved proposals " +
    "can execute a defined action. Use Move's resource model, abilities, capabilities and " +
    "abort semantics deliberately. The project must run on a supported local Move development " +
    "environment and include tests that demonstrate both successful resource movement and rejected actions.",
  stack: ["Move", "Aptos CLI", "Move Prover"],

  requirements: [
    {
      id: "membership-resource",
      text: "The project defines a membership resource that cannot be copied or duplicated and is associated with its owning account.",
    },
    {
      id: "membership",
      text: "An initialization or registration function creates membership only when its documented authorization conditions are satisfied.",
    },
    {
      id: "proposal",
      text: "Members can create proposals containing a destination, action data or amount, voting deadline and unique proposal identifier.",
    },
    {
      id: "voting",
      text: "Only current members can vote, each member can vote at most once per proposal, and duplicate votes abort.",
    },
    {
      id: "execution",
      text: "A proposal executes only when its documented approval and timing conditions are satisfied, and execution cannot occur twice.",
    },
    {
      id: "capability",
      text: "Any privileged operation is guarded by an explicit capability or resource that cannot be obtained by an unauthorized account through a public entry function.",
    },
    {
      id: "resources",
      text: "The implementation uses Move resource semantics and abilities intentionally, with state transitions that do not create unintended copies of protected assets.",
    },
    {
      id: "abort-handling",
      text: "Invalid callers, duplicate actions, invalid amounts and invalid proposal states abort with documented error conditions.",
    },
    {
      id: "tests",
      text: "Move tests cover membership creation, unauthorized access, duplicate voting, failed execution and a complete successful proposal lifecycle. Keep them in a tests/ directory or in files named *_tests.move.",
      check: {
        type: "file",
        glob: ["**/tests/**/*.move", "**/sources/**/*_tests.move"],
      },
    },
    {
      id: "move-manifest",
      text: "The repository contains a Move package manifest defining the package and its dependencies.",
      check: { type: "file", glob: "**/Move.toml" },
    },
    {
      id: "readme",
      text: "README explains the chosen Move network, package setup, publishing or deployment commands, entry functions, state model and test commands.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs the required Move tooling and runs the project's Move tests on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "language",
      name: "Move language model",
      weight: 20,
      layerId: "move-developer-1",
      description:
        "Modules, functions, visibility and primitive types are used correctly and the resource-oriented design is clear.",
    },
    {
      id: "resources",
      name: "Resources & abilities",
      weight: 20,
      layerId: "move-developer-2",
      description:
        "Ownership, abilities, moves, references and protected resources are handled according to Move's semantics.",
    },
    {
      id: "platform",
      name: "Move platform implementation",
      weight: 15,
      layerId: "move-developer-3",
      description:
        "The package is structured and deployed according to the selected Move platform's account and module model.",
    },
    {
      id: "assets",
      name: "Asset design",
      weight: 15,
      layerId: "move-developer-5",
      description:
        "Any membership or value-bearing assets use appropriate resource and metadata patterns without accidental duplication or loss.",
    },
    {
      id: "testing",
      name: "Testing & specifications",
      weight: 15,
      layerId: "move-developer-6",
      description:
        "Tests verify successful resource flows and abort conditions, with specifications used where they add meaningful guarantees.",
    },
    {
      id: "security",
      name: "Security & access control",
      weight: 15,
      layerId: "move-developer-9",
      description:
        "Capabilities, authorization, arithmetic and abort handling prevent unauthorized or invalid state transitions.",
    },
  ],

  twistPool: [
    {
      id: "weighted-voting",
      text: "Assign each member a fixed voting weight stored in on-chain state and require proposal approval to use the sum of voting weights rather than member count.",
    },
    {
      id: "membership-expiry",
      text: "Give memberships an explicit expiration timestamp and prevent expired members from creating proposals or voting until they renew under the documented renewal rules.",
    },
    {
      id: "generic-vault",
      text: "Add a generic resource vault that can custody a Move asset type and release it only when an approved proposal authorizes the withdrawal.",
    },
    {
      id: "proposer-bond",
      text: "Require a member to lock a proposal bond when creating a proposal and return or forfeit that resource according to whether the proposal reaches its documented outcome.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
