/**
 * Capstone brief — web-game track (web-game), v1.
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
  trackId: "web-game",
  categoryId: "gamedev",
  slug: "web-game-threejs-space-runner",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "3D WebGL Space Runner in Three.js and WebGL",
  summary:
    "Build a 3D WebGL endless space runner featuring Three.js rendering, custom GLSL fragment shaders, " +
    "physics-driven collisions, spatial sound, and WebSocket real-time leaderboard sync.",
  stack: [
    "JavaScript",
    "Three.js",
    "GLSL",
    "Cannon.js or Rapier",
    "WebSockets",
    "Vite",
  ],

  requirements: [
    {
      id: "scene-rendering",
      text: "Set up a Three.js scene with dynamic lighting, camera follow system, and GLTF 3D model loading.",
    },
    {
      id: "game-loop",
      text: "Maintain a fixed-timestep game loop using requestAnimationFrame that manages object generation and movement.",
    },
    {
      id: "physics-collisions",
      text: "Integrate a 3D physics engine (Cannon.js or Rapier) for player ship controls, obstacle physics, and triggers.",
    },
    {
      id: "custom-shaders",
      text: "Implement at least one custom GLSL shader material (e.g., animated shield overlay or warp speed space background).",
    },
    {
      id: "audio-system",
      text: "Integrate Web Audio API or Three.js PositionalAudio for engine sounds, collision impacts, and background tracks.",
    },
    {
      id: "ui-hud",
      text: "Build an HTML/Canvas UI layer displaying live score, velocity, health bar, game over state, and high scores.",
    },
    {
      id: "websocket-sync",
      text: "Connect to a WebSocket backend to broadcast final scores and retrieve a live top-10 global leaderboard.",
    },
    {
      id: "optimization",
      text: "Maintain 60 FPS performance using geometry instancing or object pooling for recurring obstacles/stars.",
    },
    {
      id: "tests",
      text: "Unit tests cover game state state machines, collision calculations, and score tracking modules.",
      check: CHECKS.jsTests,
    },
    {
      id: "package-json",
      text: "Repository includes a standard package.json file with scripts to build and start the dev server.",
      check: { type: "file", glob: "package.json" },
    },
    {
      id: "readme",
      text: "README details browser setup, local dev instructions, control scheme, and build deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI pipeline automatically runs linter, tests, and validates production bundle generation.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "threejs-graphics",
      name: "Three.js Graphics & WebGL",
      weight: 20,
      layerId: "web-game-5",
      description:
        "Efficient scene graph organization, dynamic lighting setups, and model asset integration.",
    },
    {
      id: "physics-gameplay",
      name: "Physics & Game Controls",
      weight: 20,
      layerId: "web-game-6",
      description:
        "Responsive player ship movement, accurate physical colliders, and robust trigger management.",
    },
    {
      id: "shaders-vfx",
      name: "GLSL Shaders & Visual Effects",
      weight: 15,
      layerId: "web-game-7",
      description:
        "Creative implementation of custom vertex/fragment shaders and post-processing visual effects.",
    },
    {
      id: "networking-state",
      name: "Real-time State & Leaderboard",
      weight: 15,
      layerId: "web-game-8",
      description:
        "Reliable WebSocket communication and state management for game over and leaderboard sync.",
    },
    {
      id: "performance",
      name: "Optimization & Asset Pipeline",
      weight: 15,
      layerId: "web-game-10",
      description:
        "Proper object pooling, asset compression, low draw-call overhead, and stable frame budgets.",
    },
    {
      id: "docs-testing",
      name: "Tests & Project Setup",
      weight: 15,
      layerId: "web-game-1",
      description:
        "Complete test suite for business logic and comprehensive setup instructions in the README.",
    },
  ],

  twistPool: [
    {
      id: "post-processing-warp",
      text: "Add a post-processing bloom and chromatic aberration distortion pass that triggers dynamically when engaging speed boosts.",
    },
    {
      id: "procedural-track",
      text: "Generate procedural obstacle patterns using a seed-based algorithm, allowing players to replay specific daily challenge tracks.",
    },
    {
      id: "multiplayer-ghost",
      text: "Fetch and render a translucent 3D 'ghost ship' replaying another player's recorded high-score transform trajectory.",
    },
    {
      id: "custom-ship-customizer",
      text: "Create an interactive hangar menu before launching where players alter material colors and uniform parameters on their ship.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
