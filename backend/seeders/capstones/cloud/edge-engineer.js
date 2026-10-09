/**
 * Capstone brief — edge-engineer track (edge-engineer), v1.
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
import { CHECKS, COMMON_RULES, NO_LIVE_ACCOUNT_RULE } from "../shared.js";

export default {
  trackId: "edge-engineer",
  categoryId: "cloud",
  slug: "edge-engineer-global-routing-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Edge-Native API Gateway & State Management Platform",
  summary:
    "Build a distributed, low-latency edge computing application deployed on Cloudflare Workers. " +
    "You will write worker handlers using Wrangler CLI, manage state with Workers KV and Durable Objects, " +
    "compile Rust/WASM modules for edge computation, configure edge WAF rate-limiting rules, " +
    "and perform AI inference at the edge using Workers AI.",
  stack: [
    "TypeScript",
    "Cloudflare Workers",
    "Wrangler CLI",
    "WebAssembly / Rust",
    "Workers KV",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "worker-runtime",
      text: "Edge worker is implemented in TypeScript using Cloudflare Workers runtime API with Wrangler configuration files.",
      check: { type: "file", glob: "wrangler.{toml,json}" },
    },
    {
      id: "kv-storage",
      text: "Utilizes Cloudflare Workers KV namespaces for fast key-value lookup and caching with eventual consistency rules.",
    },
    {
      id: "durable-objects",
      text: "Implements a Durable Object class for stateful coordination, real-time rate limiting, or WebSocket hibernation.",
    },
    {
      id: "wasm-module",
      text: "Compiles a Rust or AssemblyScript module into WebAssembly (WASM) and integrates WASM bindings inside the edge worker.",
    },
    {
      id: "edge-security",
      text: "Configures Cloudflare WAF custom rules, geolocation headers verification, and bot detection checks at the edge.",
    },
    {
      id: "workers-ai",
      text: "Invokes Cloudflare Workers AI model catalog endpoints for low-latency text classification or embeddings at the edge.",
    },
    {
      id: "tests",
      text: "Unit and integration tests run against Miniflare or Vitest worker test harness to verify edge endpoint handling.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README explains Wrangler CLI commands, KV bindings setup, WASM compilation steps, and edge deployment procedures.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes wrangler.example.toml or .env.example with binding configurations and account ID placeholders.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow builds WASM modules, runs Wrangler dry-run deployment validations, and executes tests on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "edge-runtime",
      name: "Cloudflare Workers & Architecture",
      weight: 20,
      layerId: "edge-engineer-2",
      description:
        "Proper usage of Workers fetch handlers, response streaming, Wrangler configuration, and environment bindings.",
    },
    {
      id: "state-management",
      name: "KV & Durable Objects State",
      weight: 20,
      layerId: "edge-engineer-3",
      description:
        "Effective KV key design, caching policies, and Durable Object state persistence or WebSocket handling.",
    },
    {
      id: "wasm-integration",
      name: "WebAssembly at the Edge",
      weight: 15,
      layerId: "edge-engineer-4",
      description:
        "Correct WASM module compilation, memory passing interface, and performance enhancement at the edge.",
    },
    {
      id: "edge-security-ai",
      name: "Edge Security & Workers AI",
      weight: 20,
      layerId: "edge-engineer-6",
      description:
        "Custom WAF rule logic, rate-limiting algorithms, and integration of Workers AI models for edge inference.",
    },
    {
      id: "tests",
      name: "Testing",
      weight: 15,
      layerId: "edge-engineer-2",
      description:
        "Thorough test coverage using Vitest/Miniflare for edge request routing, KV mocks, and WASM function execution.",
    },
    {
      id: "docs-ops",
      name: "Documentation & CI Pipelines",
      weight: 10,
      layerId: "edge-engineer-10",
      description:
        "Clear setup guide for Wrangler development, WASM build commands, and automated CI workflows.",
    },
  ],

  twistPool: [
    {
      id: "nextjs-middleware",
      text: "Integrate Vercel Edge Functions or Next.js middleware for dynamic geolocation-based content personalization.",
    },
    {
      id: "cache-stampede-prevention",
      text: "Implement request coalescing (single-flight pattern) in Workers KV to prevent cache stampedes on hot cache keys.",
    },
    {
      id: "image-transformation",
      text: "Incorporate edge-side dynamic image resizing and WebP/AVIF format conversion using Cloudflare Images or Workers.",
    },
    {
      id: "mqtt-iot-broker",
      text: "Extend Durable Objects to act as a lightweight MQTT Pub/Sub broker handling persistent edge IoT client connections.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
