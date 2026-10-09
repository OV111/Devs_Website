/**
 * Capstone brief — web3-indexer track (web3-indexer), v1.
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
  trackId: "web3-indexer",
  categoryId: "web3",
  slug: "web3-indexer-defi-analytics-subgraph",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "DeFi Protocol Analytics Subgraph & Indexer",
  summary:
    "Build a production-grade custom GraphQL indexer using The Graph (AssemblyScript) or Ponder (TypeScript) to index decentralized exchange " +
    "swaps, liquidity mints, burns, and protocol volume metrics.",
  stack: ["TypeScript", "AssemblyScript", "The Graph", "GraphQL", "Ponder"],

  requirements: [
    {
      id: "subgraph-manifest-config",
      text: "Configure subgraph.yaml or Ponder config specifying contract addresses, ABIs, and start blocks.",
      check: { type: "file", glob: "{subgraph.yaml,ponder.config.ts}" },
    },
    {
      id: "graphql-schema",
      text: "Define robust GraphQL schema entities tracking accounts, pools, swap transactions, and historical volume aggregates.",
    },
    {
      id: "event-handlers",
      text: "Implement AssemblyScript or TypeScript event handlers processing Transfer, Swap, Mint, and Burn events.",
    },
    {
      id: "derived-relations",
      text: "Establish entity relationships using @derivedFrom or relational foreign keys for cross-entity queries.",
    },
    {
      id: "matchstick-tests",
      text: "Write unit tests using Matchstick framework verifying event mapping logic and entity store updates.",
      check: { type: "file", glob: "tests/**/*.test.ts" },
    },
    {
      id: "query-pagination",
      text: "Support advanced GraphQL querying with pagination (first, skip), sorting (orderBy), and filtering (where).",
    },
    {
      id: "env-example",
      text: "Provide an .env.example file containing RPC provider keys and deployment credentials.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "Document local graph node setup, code generation, schema migration, and GraphQL query examples.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "GitHub Actions workflow executes code generation, build compilation, and indexer unit tests.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "schema-entity-design",
      name: "GraphQL Schema & Entity Design",
      weight: 25,
      layerId: "web3-indexer-2",
      description:
        "Clean entity relationships, correct use of BigInt and Bytes types, and optimized index fields.",
    },
    {
      id: "event-mapping-logic",
      name: "Event Handlers & Indexing Logic",
      weight: 25,
      layerId: "web3-indexer-3",
      description:
        "Accurate AssemblyScript/TypeScript event parsing, state updates, and store load/save operations.",
    },
    {
      id: "advanced-indexing-patterns",
      name: "Advanced Indexing Patterns",
      weight: 15,
      layerId: "web3-indexer-4",
      description:
        "Proper use of call handlers, block aggregations, or dynamic data source templates.",
    },
    {
      id: "matchstick-testing",
      name: "Indexer Testing & Matchstick",
      weight: 15,
      layerId: "web3-indexer-9",
      description:
        "Comprehensive unit tests verifying event mapping correctness and assertion coverage.",
    },
    {
      id: "graphql-query-performance",
      name: "GraphQL Querying & Optimization",
      weight: 10,
      layerId: "web3-indexer-6",
      description:
        "Efficient filtering, sorting, pagination, and query complexity handling.",
    },
    {
      id: "deployment-operability",
      name: "Deployment & Operability",
      weight: 10,
      layerId: "web3-indexer-10",
      description:
        "Clear manifest setup, environment configuration, and clean deployment scripts.",
    },
  ],

  twistPool: [
    {
      id: "ponder-typescript-migration",
      text: "Implement the indexer using Ponder (TypeScript-native indexing) instead of AssemblyScript.",
    },
    {
      id: "multi-chain-aggregation",
      text: "Configure multi-chain data indexing combining events from both Ethereum mainnet and an L2 network.",
    },
    {
      id: "realtime-websocket-subscriptions",
      text: "Enable GraphQL WebSocket subscriptions for live real-time updates on high-value swaps.",
    },
    {
      id: "time-series-bucket-aggregation",
      text: "Aggregate swap data into hourly and daily financial snapshot entities for charting.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
