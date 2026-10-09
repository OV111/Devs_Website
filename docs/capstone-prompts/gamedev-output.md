/**
 * Capstone brief — Game Tools Developer track (tools-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "tools-dev",
  categoryId: "gamedev",
  slug: "tools-dev-pipeline-suite",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Level Design Brush & Asset Pipeline Automation Suite",
  summary:
    "Build a custom Unity/Unreal editor extension and standalone PySide/Qt desktop tool for procedural " +
    "level object placement, automated asset validation, and JSON/YAML data serialization.",
  stack: ["C# or Python", "Unity Editor Scripting or PySide/Qt", "JSON/YAML", "CLI Automation"],

  requirements: [
    { id: "custom-editor-window", text: "Build a custom dockable editor window with UI elements, sliders, file pickers, and live scene view raycast placement." },
    { id: "level-brush-tool", text: "Implement a 3D level editing brush featuring procedural object placement, random rotation/scale jitter, and surface alignment physics." },
    { id: "standalone-qt-app", text: "Develop a standalone PySide/Qt or C# desktop tool that parses game project assets, edits JSON/YAML config databases, and saves back to disk.", check: { type: "file", glob: ["**/*.py", "src/**/*.cs", "**/Qt*"] } },
    { id: "asset-importer-validator", text: "Build an automated asset pipeline validator that inspects imported models/textures for polygon count, naming conventions, and missing colliders." },
    { id: "custom-gizmos-handles", text: "Implement custom Scene View handles and Gizmos to edit object collision bounds, movement paths, or level triggers visually." },
    { id: "command-line-build", text: "Provide a command-line automated build script (Python or Shell) that runs asset validation, builds game bundles, and packages output." },
    { id: "debug-profiler-overlay", text: "Develop an in-game profiling HUD overlay measuring dynamic draw call counts, asset memory usage, and custom execution timers." },
    { id: "tests", text: "Unit tests cover JSON/YAML schema validation, asset naming verification regex, and coordinate transformation utilities.", check: { type: "file", glob: ["**/Tests/**/*.cs", "tests/**/*.py", "**/*.test.*"] } },
    { id: "readme", text: "README features user documentation, installation steps for standalone tools, editor workflow instructions, and CLI command flags.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow executes python/C# linter checks, runs asset pipeline unit tests, and verifies CLI scripts.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "editor-scripting", name: "Unity/Unreal Editor Integration", weight: 20, layerId: "tools-dev-2", description: "Clean custom editor layouts, robust property drawers, and responsive scene view raycast interactions." },
    { id: "content-tooling", name: "Level Editing & Placement Tools", weight: 20, layerId: "tools-dev-6", description: "Effective brush algorithm, surface normal alignment, rotation jittering, and undo/redo operation support." },
    { id: "standalone-qt", name: "Standalone GUI Application (Qt/PySide)", weight: 15, layerId: "tools-dev-4", description: "Intuitive desktop interface design, proper signals/slots event handling, and error-free JSON/YAML parsing." },
    { id: "pipeline-automation", name: "Asset Validation & Importers", weight: 15, layerId: "tools-dev-3", description: "Strict automated rule checking on texture formats, mesh counts, directory hierarchies, and import settings." },
    { id: "cli-ci", name: "CLI Automation & Profiling Tools", weight: 15, layerId: "tools-dev-7", description: "Robust command-line build automation, automated package deployment, and custom in-game profiler markers." },
    { id: "docs-testing", name: "User Documentation & Unit Tests", weight: 15, layerId: "tools-dev-10", description: "Clear user manuals in README, thorough setup guides, and comprehensive test suites for tool logic." },
  ],

  twistPool: [
    { id: "blender-exporter-addon", text: "Write a custom Python addon for Blender that exports scene layouts directly into your tool's JSON level format." },
    { id: "git-lfs-checker", text: "Integrate automatic Git LFS tracking validation into the asset postprocessor to block uncommitted large raw binary assets." },
    { id: "spline-road-generator", text: "Add a custom spline editing tool in the scene view that deforms a road/path mesh along procedural Bezier curves." },
    { id: "localization-csv-sync", text: "Implement a Google Sheets / CSV sync utility that downloads and validates game text keys across target languages." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Gameplay Engineer track (gameplay-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "gameplay-engineer",
  categoryId: "gamedev",
  slug: "gameplay-engineer-action-platformer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Modular Combat & Kinematic Controller Systems",
  summary:
    "Engineers an authoritative kinematic character controller, customizable combat combo system, " +
    "data-driven inventory, and dynamic camera shake/game feel architecture in C# or C++.",
  stack: ["C# or C++", "Unity or Unreal Engine", "Custom Kinematic Physics", "Custom Editor Tools"],

  requirements: [
    { id: "kinematic-controller", text: "Implement a custom kinematic character controller featuring ground detection, slope handling, step offset, coyote time, and jump buffering." },
    { id: "combat-hitboxes", text: "Build a modular hitbox/hurtbox combat framework that processes attack animation windows, damage formulas, and hit stop/freeze frames." },
    { id: "combo-system", text: "Create a state-driven melee combo system allowing queued inputs, attack windows, and dynamic branching light/heavy attacks." },
    { id: "data-driven-inventory", text: "Architect a data-driven inventory and equipment system using ScriptableObjects, JSON, or engine DataTables." },
    { id: "procedural-game-feel", text: "Implement procedural game feel effects, including dynamic camera shake algorithms, directional hit reaction forces, and time dilation (slow-mo)." },
    { id: "custom-editor-tools", text: "Develop custom editor windows, inspector property drawers, or scene gizmos to visualize hitboxes and edit attack combo data directly." },
    { id: "object-pooling", text: "Implement a generic object pooling manager for combat VFX and sound instances to maintain zero garbage collection spikes during fighting." },
    { id: "debug-cheats", text: "Include an in-game developer console or debug overlay with command binds to toggle invincibility, spawn items, and inspect hitbox collision bounds." },
    { id: "tests", text: "Unit tests cover combat damage mitigation formulas, combo input state transitions, and inventory capacity logic.", check: { type: "file", glob: ["**/Tests/**/*.cs", "Source/**/*.cpp", "**/*.test.*"] } },
    { id: "readme", text: "README outlines architectural patterns, character controller math, custom editor usage, and test commands.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks C#/C++ syntax, style linting, and automated test suite execution.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "kinematic-movement", name: "Kinematic Controller Physics", weight: 20, layerId: "gameplay-engineer-3", description: "Precise raycast/shape sweep ground checking, smooth slope traversal, step handling, and responsive jump feeling." },
    { id: "combat-combos", name: "Combat Architecture & Combo Systems", weight: 20, layerId: "gameplay-engineer-4", description: "Robust hitbox/hurtbox overlap detection, extensible combo state machine, and precise animation windowing." },
    { id: "data-systems", name: "Data-Driven Systems & Inventories", weight: 15, layerId: "gameplay-engineer-6", description: "Decoupled data structures for equipment/items and clean serialization for state retention." },
    { id: "editor-tools", name: "Editor Tooling & Workflow", weight: 15, layerId: "gameplay-engineer-8", description: "Useful custom editor inspectors, scene handles/gizmos for attack bounding boxes, and combat debugging utilities." },
    { id: "game-feel-polish", name: "Game Feel & Optimization", weight: 15, layerId: "gameplay-engineer-10", description: "Juicy feedback via screen shake and frame freeze, supported by allocation-free memory object pooling." },
    { id: "docs-testing", name: "Tests & Architecture Documentation", weight: 15, layerId: "gameplay-engineer-1", description: "Thorough unit test coverage for gameplay calculations and clear architectural documentation in the README." },
  ],

  twistPool: [
    { id: "wall-running-grapple", text: "Extend the kinematic controller with wall-running detection and a momentum-conserving grappling hook." },
    { id: "stamina-poise-system", text: "Incorporate a posture/poise gauge system where hit land impact forces break enemy blocks and open execute opportunities." },
    { id: "rollback-prediction", text: "Implement local client prediction and rollback state buffers for player locomotion inputs." },
    { id: "procedural-animation-ik", text: "Add procedural foot placement Inverse Kinematics (IK) to align feet dynamically to uneven terrain geometry." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — XR / AR / VR Dev track (xr-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "xr-dev",
  categoryId: "gamedev",
  slug: "xr-dev-spatial-escape-room",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cross-Platform Spatial VR/AR Escape Room",
  summary:
    "Architect a spatial XR escape room utilizing Unity OpenXR, hand tracking/controller interactions, " +
    "diegetic 3D UI, spatial audio, and ARFoundation surface placement.",
  stack: ["Unity", "OpenXR", "XR Interaction Toolkit", "ARFoundation", "C#"],

  requirements: [
    { id: "openxr-setup", text: "Configure Unity with OpenXR supporting both VR head-mounted displays and mobile/passthrough AR modes." },
    { id: "vr-interactions", text: "Implement physical direct grabbing, ray grabbing, distance snapping, and throwing physics using XR Interaction Toolkit." },
    { id: "locomotion-comfort", text: "Provide teleportation, smooth locomotion, snap turning, and a tunnel vignette comfort feature for movement." },
    { id: "hand-tracking", text: "Integrate hand tracking joint data allowing players to poke 3D buttons and perform pinch interactions without controllers." },
    { id: "ar-plane-detection", text: "In AR mode, implement plane detection and light estimation using ARFoundation to place the escape room anchor on real-world tables." },
    { id: "diegetic-ui", text: "Build spatial world-space diegetic UI screens and keypad interfaces anchored directly into physical room props." },
    { id: "spatial-audio", text: "Incorporate spatial 3D audio sources with realistic distance attenuation and sound occlusion curves for environmental clues." },
    { id: "performance-target", text: "Maintain strict 72+ FPS performance targets by enabling Single Pass Instanced rendering and reducing draw calls." },
    { id: "tests", text: "Unit tests cover escape room puzzle logic, inventory state tracking, and lock key verification.", check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] } },
    { id: "readme", text: "README details target XR hardware setup, OpenXR feature profiles, control mapping, and side-loading deployment steps.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow validates Unity C# code formatting, asset compilation, and build configurations.", check: CHECKS.ci },
    { id: "meta-files", text: "Unity project structure includes standard Assets directory and valid .meta files for version control.", check: { type: "file", glob: "Assets/**/*.meta" } },
  ],

  rubric: [
    { id: "vr-interaction-design", name: "XR Interaction Mechanics", weight: 20, layerId: "xr-dev-2", description: "Natural controller/hand physics, accurate grab sockets, distance ray casting, and reliable throwing velocity computation." },
    { id: "locomotion-comfort", name: "Locomotion & Comfort Systems", weight: 15, layerId: "xr-dev-3", description: "Smooth teleportation anchors, customizable snap turns, and effective vignette motion-sickness prevention options." },
    { id: "ar-passthrough", name: "AR Plane Detection & Passthrough", weight: 15, layerId: "xr-dev-4", description: "Robust surface detection, stable spatial anchor placement, and realistic environmental lighting estimation." },
    { id: "hand-tracking-gestures", name: "Hand Tracking & Direct Pokes", weight: 15, layerId: "xr-dev-5", description: "Accurate joint tracking pose evaluation, reliable pinch/poke triggers, and seamless hand-to-controller fallbacks." },
    { id: "spatial-ui-audio", name: "Spatial UI & 3D Audio", weight: 15, layerId: "xr-dev-6", description: "Diegetic world-space interface layouts, intuitive affordances, and immersive spatialized audio positioning." },
    { id: "docs-optimization", name: "XR Optimization & Documentation", weight: 20, layerId: "xr-dev-9", description: "Adherence to VR frame budgets via single-pass stereo rendering, alongside comprehensive hardware setup documentation." },
  ],

  twistPool: [
    { id: "networked-coop", text: "Implement two-player networked co-op where one player in VR collaborates with a second player in mobile AR using shared spatial anchors." },
    { id: "haptic-feedback-custom", text: "Create a custom haptic pulse feedback system that varies frequency and intensity based on object textures and weight." },
    { id: "eye-tracking-foveated", text: "Integrate eye-tracking gaze interaction to select distant objects and enable dynamic foveated rendering presets." },
    { id: "physics-climbing", text: "Build a physics-based climbing mechanic where players grip ledge collision volumes and pull their camera rig up." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Game Backend Dev track (game-backend), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "game-backend",
  categoryId: "gamedev",
  slug: "game-backend-authoritative-multiplayer",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Authoritative Game Server, Matchmaking & Real-Time State Service",
  summary:
    "Build an authoritative real-time game server and microservice suite in Node.js and WebSockets, " +
    "featuring JWT authentication, Redis matchmaking/leaderboards, PostgreSQL storage, and Docker deployment.",
  stack: ["Node.js", "Express", "WebSockets / Socket.io", "Redis", "PostgreSQL", "Docker"],

  requirements: [
    { id: "auth-service", text: "Implement user account registration, login, and secure JWT-based socket connection authentication." },
    { id: "authoritative-loop", text: "Run an authoritative server game loop (e.g., 20Hz tick rate) that validates player inputs and broadcasts state updates." },
    { id: "matchmaking-queue", text: "Build a skill-based or FIFO matchmaking queue using Redis data structures that pairs players into dynamic room instances." },
    { id: "leaderboard-redis", text: "Maintain real-time global player rankings using Redis Sorted Sets with paginated rank lookups." },
    { id: "database-persistence", text: "Store player profiles, inventory, currency balances, and match history persistently in PostgreSQL or MongoDB." },
    { id: "input-validation-anticheat", text: "Enforce strict server-side validation on player move speeds and action cooldowns to prevent speed/teleport hacks." },
    { id: "docker-compose", text: "Containerize the application and database dependencies so the whole stack boots with docker-compose up.", check: CHECKS.compose },
    { id: "env-example", text: "Provide a configuration template file (.env.example) with all necessary database and secret key variables.", check: CHECKS.envExample },
    { id: "tests", text: "Integration and unit tests verify auth middleware, matchmaking logic, and authoritative game state calculations.", check: CHECKS.jsTests },
    { id: "readme", text: "README documents API endpoints, WebSocket event protocols, environment setup, and deployment guides.", check: CHECKS.readme },
    { id: "ci", text: "CI pipeline executes linter, runs test suites, and verifies container build steps on push.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "websocket-authoritative", name: "Real-Time Server & Authoritative Loop", weight: 20, layerId: "game-backend-6", description: "Reliable WebSocket synchronization, fixed server tick rate, and robust server-authoritative state processing." },
    { id: "matchmaking-queues", name: "Matchmaking & Redis Caching", weight: 20, layerId: "game-backend-7", description: "Effective lobby allocation, Redis queue manipulation, and performant sorted set leaderboards." },
    { id: "auth-persistence", name: "Auth & Database Persistence", weight: 15, layerId: "game-backend-4", description: "Secure JWT handling, schema normalization, index optimization, and persistent match record storage." },
    { id: "anticheat-security", name: "Server Validation & Anti-Cheat", weight: 15, layerId: "game-backend-10", description: "Thorough input sanitization, rate limiting, and physics bounds checks to defeat malicious client inputs." },
    { id: "ops-containerization", name: "DevOps & Containerization", weight: 15, layerId: "game-backend-9", description: "Clean Dockerfile/Compose setup, environment variable management, and reliable single-command orchestration." },
    { id: "docs-testing", name: "Testing & Documentation", weight: 15, layerId: "game-backend-1", description: "Complete unit/integration test coverage, well-defined WebSocket event specs, and clear setup documentation." },
  ],

  twistPool: [
    { id: "reconnection-state-recovery", text: "Implement a session token system allowing disconnected players to seamlessly reconnect and resume state within 30 seconds." },
    { id: "delta-compression", text: "Compress WebSocket state broadcasts by calculating and transmitting binary bit-packed state deltas instead of full JSON objects." },
    { id: "playtab-integration", text: "Integrate a third-party game service SDK (e.g., PlayFab or Nakama) to handle player inventory purchase transactions." },
    { id: "distributed-pubsub", text: "Scale real-time room communication horizontally using Redis Pub/Sub across multiple Node.js server worker processes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Shader / Graphics Dev track (shader-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "shader-dev",
  categoryId: "gamedev",
  slug: "shader-dev-custom-render-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Custom URP Render Pipeline & GPU Compute Shader Showcase",
  summary:
    "Develop a custom Unity URP rendering suite featuring custom HLSL/Shader Graph shaders, vertex deformation, " +
    "a physically based lighting model, a Compute Shader GPU particle engine, and full-screen post-processing.",
  stack: ["Unity URP", "HLSL", "Shader Graph", "Compute Shaders", "C#"],

  requirements: [
    { id: "custom-hlsl-lit", text: "Write a custom HLSL lit surface shader implementing Blinn-Phong or Cook-Torrance PBR shading models from math principles." },
    { id: "texture-normal-mapping", text: "Implement UV transformation, normal mapping, packed PBR maps (smoothness/metallic), and triplanar mapping modes." },
    { id: "vertex-deformation", text: "Create a vertex shader driven by time and noise functions for dynamic mesh deformation (e.g., interactive water waves or wind foliage)." },
    { id: "compute-particles", text: "Build a GPU particle system driven by a Compute Shader using StructuredBuffers to compute and render 100,000+ interactive particles." },
    { id: "post-processing-pass", text: "Implement a custom full-screen post-processing render feature (e.g., volumetric depth fog, edge-detection toon outline, or chromatic distortion)." },
    { id: "shader-graph-vfx", text: "Author a Shader Graph visual effect utilizing fresnel transparency, dissolve noise thresholds, and vertex offset animation." },
    { id: "shader-properties", text: "Expose clean inspector properties, material keywords, and uniform parameters controllable via C# scripts at runtime." },
    { id: "profiling-optimization", text: "Profile GPU performance using Frame Debugger / RenderDoc, optimizing texture sampling and eliminating unnecessary branching." },
    { id: "tests", text: "Unit tests or automated validation scripts verify material property setters, compute buffer allocations, and shader compilation.", check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] } },
    { id: "readme", text: "README details HLSL shader architectures, mathematical lighting equations, compute thread group setups, and performance benchmarks.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks C# scripting syntax, shader file formatting, and repository structural integrity.", check: CHECKS.ci },
    { id: "shader-files", text: "Repository contains valid custom .hlsl or .shader files in dedicated shader directories.", check: { type: "file", glob: ["**/*.hlsl", "**/*.shader"] } },
  ],

  rubric: [
    { id: "lighting-math", name: "Graphics Math & Lighting Models", weight: 20, layerId: "shader-dev-4", description: "Accurate mathematical implementation of surface normals, lighting vectors, and specular/diffuse reflection models." },
    { id: "texturing-sampling", name: "Texturing & Sampling Techniques", weight: 15, layerId: "shader-dev-3", description: "Proper UV manipulation, triplanar projection, normal map unpack algorithms, and texture blending." },
    { id: "vertex-shaders", name: "Vertex Shader & Mesh Deformation", weight: 15, layerId: "shader-dev-6", description: "Fluid vertex displacement driven by procedural noise, respecting object/world coordinate space transforms." },
    { id: "post-processing", name: "Post-Processing & Pipeline Extensions", weight: 15, layerId: "shader-dev-7", description: "Seamless integration of custom full-screen blit passes and depth/normal buffer render features in URP." },
    { id: "compute-shaders", name: "Compute Shaders & GPU Programming", weight: 20, layerId: "shader-dev-8", description: "Efficient compute buffer dispatch, thread group allocation, and GPU-driven particle state updates." },
    { id: "docs-profiling", name: "Documentation & Performance Optimization", weight: 15, layerId: "shader-dev-10", description: "Detailed README documentation, clear math explanations, and verified low instruction cost GPU profiling." },
  ],

  twistPool: [
    { id: "screen-space-reflections", text: "Implement a custom screen-space raymarching shader pass in HLSL to calculate dynamic water reflections." },
    { id: "hair-fur-shell", text: "Create a multi-pass shell rendering shader for realistic volumetric fur or grass foliage with individual strand offsets." },
    { id: "stochastic-sampling", text: "Incorporate stochastic texture sampling in HLSL to eliminate repeating tile patterns across large terrain surfaces." },
    { id: "subsurface-scattering", text: "Add an fast subsurface scattering approximation shader for skin/jade materials using custom light attenuation formulas." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Game AI Developer track (game-ai), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "game-ai",
  categoryId: "gamedev",
  slug: "game-ai-stealth-tactical-arena",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Tactical Stealth & Combat AI Simulation",
  summary:
    "Architect an AI framework featuring Behavior Trees, Goal-Oriented Action Planning (GOAP), " +
    "perception sensing systems, squad coordination, and custom A* pathfinding.",
  stack: ["C++ or C#", "Unity or Unreal Engine", "A* Pathfinding", "Behavior Trees", "GOAP"],

  requirements: [
    { id: "a-star-pathfinding", text: "Implement a custom A* pathfinding grid/graph system with custom node cost weights and terrain traversal penalties." },
    { id: "steering-behaviors", text: "Integrate steering behaviors including obstacle avoidance, arrival, seeking, and path following." },
    { id: "behavior-tree", text: "Build a Behavior Tree system containing Sequence, Selector, Decorator nodes, and a shared Blackboard." },
    { id: "perception-sensing", text: "Implement vision cones (line-of-sight raycasts) and sound perception events with alert decay and last-known location memory." },
    { id: "goap-planner", text: "Implement a Goal-Oriented Action Planner (GOAP) that dynamically evaluates preconditions and effects to achieve high-level goals." },
    { id: "squad-coordination", text: "Implement squad level AI using role assignments (e.g., Flanker, Suppressor, Leader) and a shared tactical blackboard." },
    { id: "debug-visualization", text: "Provide visual debug overlays depicting path gizmos, vision cones, current AI state text, and target locations." },
    { id: "ai-budgeting", text: "Time-slice AI perception and pathfinding updates across frames to keep execution within a strict CPU millisecond budget." },
    { id: "tests", text: "Unit tests verify A* shortest path accuracy, Behavior Tree execution status flow, and GOAP plan generation.", check: { type: "file", glob: ["**/Tests/**/*.cs", "Source/**/*.cpp", "**/*.test.*"] } },
    { id: "readme", text: "README details architecture, AI system design, instructions for running the simulation, and debug toggle controls.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow verifies C++/C# code syntax, runs unit test suite, and checks formatting.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "pathfinding-steering", name: "Pathfinding & Steering Behaviors", weight: 20, layerId: "game-ai-3", description: "Correct implementation of A* pathfinding algorithm, grid generation, and smooth steering forces." },
    { id: "behavior-trees", name: "Behavior Trees & State Flow", weight: 20, layerId: "game-ai-5", description: "Modular tree node design, clean blackboard state reads/writes, and predictable composite status updates." },
    { id: "perception-sensing", name: "Perception & Sensing Systems", weight: 15, layerId: "game-ai-6", description: "Accurate vision cone raycasts, realistic sound event propagation, and reliable target memory decay." },
    { id: "goap-planning", name: "GOAP & Utility Systems", weight: 15, layerId: "game-ai-7", description: "Effective goal solver, valid state precondition checks, dynamic action costs, and plan execution." },
    { id: "squad-coordination", name: "Squad Tactics & Optimization", weight: 15, layerId: "game-ai-9", description: "Coordinated team roles, shared tactical knowledge, and frame-budgeted AI updates." },
    { id: "docs-testing", name: "Debugging, Testing & Docs", weight: 15, layerId: "game-ai-10", description: "In-game debug visualizers, thorough unit test coverage, and clear architectural documentation." },
  ],

  twistPool: [
    { id: "influence-maps", text: "Implement dynamic influence maps for tactical positioning, guiding AI agents toward high-cover or high-vantage grid cells." },
    { id: "utility-scoring", text: "Add a Utility AI scoring layer using response curves to choose between competing goals based on agent health, ammo, and distance." },
    { id: "hierarchical-fsm", text: "Implement a Hierarchical State Machine (HFSM) managing high-level state (In Combat, Idle, Investigating) above the Behavior Tree." },
    { id: "dynamic-navmesh-cutting", text: "Enable dynamic obstacle placement that cuts NavMesh paths at runtime, forcing AI agents to immediately recalculate routes." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Godot Developer track (godot), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "godot",
  categoryId: "gamedev",
  slug: "godot-2d-metroidvania",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "2D Action Metroidvania in Godot 4 & GDScript",
  summary:
    "Build a 2D action Metroidvania featuring CharacterBody2D physics, custom signals, state-machine AI, " +
    "TileMap level building, Resource-based data storage, and custom canvas-item shaders.",
  stack: ["Godot 4", "GDScript", "TileMap", "AnimationTree", "GPUParticles2D"],

  requirements: [
    { id: "godot-project", text: "Repository includes a valid Godot 4 project file (project.godot).", check: { type: "file", glob: "project.godot" } },
    { id: "player-physics", text: "Player movement uses CharacterBody2D with move_and_slide, wall jumps, variable jump height, and coyote time." },
    { id: "signals-architecture", text: "Components communicate using decoupled custom signals and scene composition without hardcoded node references." },
    { id: "tilemap-levels", text: "Levels are constructed using TileMap/TileSet layers with custom collision layer matrices and navigation regions." },
    { id: "animation-state", text: "Character animations use AnimationPlayer and AnimationTree state machines for locomotion, attacks, and hurt states." },
    { id: "enemy-ai", text: "Enemies utilize state-based AI (patrol, chase, attack) combined with NavigationAgent2D for pathfinding." },
    { id: "custom-resource", text: "Weapon stats, inventory items, and player upgrades are saved and loaded using custom Resource (.tres) files." },
    { id: "canvas-shaders", text: "Implement at least one custom canvas item shader (e.g., hit-flash effect, water reflection, or dynamic fog)." },
    { id: "ui-containers", text: "Build a responsive UI with Control nodes, HUD bars, inventory screens, and scene switching transitions." },
    { id: "tests", text: "GDScript unit tests using GdUnit4 or GUT framework cover inventory manipulation, health calculation, and save systems.", check: { type: "file", glob: ["test/**/*.gd", "addons/gut/**", "**/test_*.gd"] } },
    { id: "readme", text: "README describes controls, Godot version, project structure, and instructions to run tests.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks GDScript code formatting, linting, or runs headless Godot unit tests.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "godot-architecture", name: "Nodes, Signals & Scene Composition", weight: 20, layerId: "godot-2", description: "Clean scene hierarchy, effective custom signals usage, and avoidance of fragile direct node path coupling." },
    { id: "physics-controls", name: "2D Physics & Movement Feel", weight: 20, layerId: "godot-3", description: "Smooth movement mechanics using CharacterBody2D, responsive jump physics, and accurate collision handling." },
    { id: "ai-navigation", name: "Enemy AI & TileMap Levels", weight: 15, layerId: "godot-9", description: "Robust state-based AI behavior, efficient TileMap construction, and accurate pathfinding via Navigation2D." },
    { id: "resources-data", name: "Resource Files & Architecture", weight: 15, layerId: "godot-8", description: "Effective design using custom Resource files for extensible item/ability data storage and state save games." },
    { id: "shaders-ui", name: "UI, Audio & Shaders Polish", weight: 15, layerId: "godot-7", description: "Clean UI container layouts, functional canvas shaders, particle effects, and polished animation state transitions." },
    { id: "docs-testing", name: "Testing & Documentation", weight: 15, layerId: "godot-10", description: "Clear README documentation and automated GDScript test execution covering essential gameplay systems." },
  ],

  twistPool: [
    { id: "csharp-module", text: "Rewrite the combat damage calculator and status effect manager into C# using C# scripts integrated with GDScript." },
    { id: "grappling-hook", text: "Add a physics-driven raycast grappling hook that swings the character around anchor points using RigidBody2D impulses." },
    { id: "procedural-room-spawner", text: "Create an active room spawner that instantiates tilemap scenes procedurally with doors connected by signals." },
    { id: "time-rewind", text: "Implement a time-rewind mechanic that records player state snapshots for 5 seconds and plays them backward upon button press." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Game Designer track (game-designer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "game-designer",
  categoryId: "gamedev",
  slug: "game-designer-system-prototype",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Game Design Document & Playable System Prototype",
  summary:
    "Author a complete Game Design Document (GDD) and economic balance model alongside a playable " +
    "Unity graybox prototype showcasing core loop mechanics, enemy pacing, and a branching narrative.",
  stack: ["Unity or Godot", "Game Design Document (Markdown)", "Spreadsheet Model (CSV/XLSX)", "Twine"],

  requirements: [
    { id: "gdd-doc", text: "Provide a comprehensive Game Design Document detailing core pillars, target audience, core loop, mechanics, dynamics, and aesthetics.", check: { type: "file", glob: ["docs/GDD.md", "GDD.md", "GDD.pdf"] } },
    { id: "economy-model", text: "Include an economic/progression balance spreadsheet detailing currency taps/sinks, XP curves, and stat scaling formulas.", check: { type: "file", glob: ["docs/*.{csv,xlsx}", "*.{csv,xlsx}"] } },
    { id: "graybox-prototype", text: "Build a playable 3D/2D graybox prototype demonstrating the core mechanics, level flow, and player traversal.", check: { type: "file", glob: ["Assets/**/*", "scenes/**/*"] } },
    { id: "encounter-pacing", text: "Design a level encounter featuring explicit onboarding, teaching mechanics through level geometry, and a distinct difficulty curve." },
    { id: "narrative-branching", text: "Integrate a branching dialogue or quest narrative tree authored in Twine or embedded in the prototype.", check: { type: "file", glob: ["**/*.html", "docs/**/*.tw", "**/dialogue*.*"] } },
    { id: "playtest-plan", text: "Deliver a playtest kit containing a playtest session plan, survey questions, qualitative feedback log, and iteration actions.", check: { type: "file", glob: ["docs/playtest*.*", "PLAYTEST.md"] } },
    { id: "ux-hud", text: "Design a HUD providing clear affordances, combat feedback, resource counters, and an accessible settings menu." },
    { id: "tests", text: "Automated or unit tests verify structural balance formulas, dialogue state changes, or game manager score reset logic.", check: { type: "file", glob: ["**/Tests/**/*.cs", "tests/**/*.gd", "**/*.test.*"] } },
    { id: "readme", text: "README summarizes project vision, core design pillars, controls, and instructions to run the prototype and read documents.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow validates Markdown links, repo file constraints, or project build integrity.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "design-doc-quality", name: "Game Design Document & Vision", weight: 20, layerId: "game-designer-2", description: "Clarity of design pillars, core loop definition, mechanics specification, and scope control." },
    { id: "systems-balancing", name: "System Economy & Balance", weight: 20, layerId: "game-designer-7", description: "Mathematical rigor in spreadsheet modeling, progression curves, resource taps, and sink ratios." },
    { id: "graybox-level-design", name: "Level & Encounter Design", weight: 20, layerId: "game-designer-4", description: "Effective pacing, clear player signposting, teaching mechanics without heavy tutorials, and spatial flow." },
    { id: "narrative-integration", name: "Narrative & UX Design", weight: 15, layerId: "game-designer-6", description: "Meaningful narrative choices, coherent worldbuilding, and clear HUD feedback/affordances." },
    { id: "playtesting-iteration", name: "Playtesting & UX Methodology", weight: 15, layerId: "game-designer-9", description: "Structured feedback collection, insightful synthesis of player observations, and documented design tweaks." },
    { id: "docs-testing", name: "Documentation & Technical Verification", weight: 10, layerId: "game-designer-10", description: "Comprehensive README guidelines and test validation for state transitions or economic balance formulas." },
  ],

  twistPool: [
    { id: "risk-reward-mechanic", text: "Design and implement a core 'Risk vs. Reward' push-your-luck mechanic (e.g., cursed items that grant power at the cost of environment difficulty)." },
    { id: "dynamic-difficulty", text: "Model and implement a dynamic difficulty adjustment (DDA) system that scales enemy health and resource drop rates based on player performance." },
    { id: "accessibility-overhaul", text: "Incorporate high-contrast modes, scalable UI text, and customizable keybind remapping into the prototype and GDD specifications." },
    { id: "vertical-slice-pitch", text: "Include a 10-slide executive pitch deck (PDF/Markdown) outlining production timeline, target market benchmarks, and monetization models." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Web Game Dev track (web-game), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
  stack: ["JavaScript", "Three.js", "GLSL", "Cannon.js or Rapier", "WebSockets", "Vite"],

  requirements: [
    { id: "scene-rendering", text: "Set up a Three.js scene with dynamic lighting, camera follow system, and GLTF 3D model loading." },
    { id: "game-loop", text: "Maintain a fixed-timestep game loop using requestAnimationFrame that manages object generation and movement." },
    { id: "physics-collisions", text: "Integrate a 3D physics engine (Cannon.js or Rapier) for player ship controls, obstacle physics, and triggers." },
    { id: "custom-shaders", text: "Implement at least one custom GLSL shader material (e.g., animated shield overlay or warp speed space background)." },
    { id: "audio-system", text: "Integrate Web Audio API or Three.js PositionalAudio for engine sounds, collision impacts, and background tracks." },
    { id: "ui-hud", text: "Build an HTML/Canvas UI layer displaying live score, velocity, health bar, game over state, and high scores." },
    { id: "websocket-sync", text: "Connect to a WebSocket backend to broadcast final scores and retrieve a live top-10 global leaderboard." },
    { id: "optimization", text: "Maintain 60 FPS performance using geometry instancing or object pooling for recurring obstacles/stars." },
    { id: "tests", text: "Unit tests cover game state state machines, collision calculations, and score tracking modules.", check: CHECKS.jsTests },
    { id: "package-json", text: "Repository includes a standard package.json file with scripts to build and start the dev server.", check: { type: "file", glob: "package.json" } },
    { id: "readme", text: "README details browser setup, local dev instructions, control scheme, and build deployment steps.", check: CHECKS.readme },
    { id: "ci", text: "CI pipeline automatically runs linter, tests, and validates production bundle generation.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "threejs-graphics", name: "Three.js Graphics & WebGL", weight: 20, layerId: "web-game-5", description: "Efficient scene graph organization, dynamic lighting setups, and model asset integration." },
    { id: "physics-gameplay", name: "Physics & Game Controls", weight: 20, layerId: "web-game-6", description: "Responsive player ship movement, accurate physical colliders, and robust trigger management." },
    { id: "shaders-vfx", name: "GLSL Shaders & Visual Effects", weight: 15, layerId: "web-game-7", description: "Creative implementation of custom vertex/fragment shaders and post-processing visual effects." },
    { id: "networking-state", name: "Real-time State & Leaderboard", weight: 15, layerId: "web-game-8", description: "Reliable WebSocket communication and state management for game over and leaderboard sync." },
    { id: "performance", name: "Optimization & Asset Pipeline", weight: 15, layerId: "web-game-10", description: "Proper object pooling, asset compression, low draw-call overhead, and stable frame budgets." },
    { id: "docs-testing", name: "Tests & Project Setup", weight: 15, layerId: "web-game-1", description: "Complete test suite for business logic and comprehensive setup instructions in the README." },
  ],

  twistPool: [
    { id: "post-processing-warp", text: "Add a post-processing bloom and chromatic aberration distortion pass that triggers dynamically when engaging speed boosts." },
    { id: "procedural-track", text: "Generate procedural obstacle patterns using a seed-based algorithm, allowing players to replay specific daily challenge tracks." },
    { id: "multiplayer-ghost", text: "Fetch and render a translucent 3D 'ghost ship' replaying another player's recorded high-score transform trajectory." },
    { id: "custom-ship-customizer", text: "Create an interactive hangar menu before launching where players alter material colors and uniform parameters on their ship." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Unreal Dev track (unreal), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "unreal",
  categoryId: "gamedev",
  slug: "unreal-third-person-combat",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "C++ & Gameplay Ability System Action RPG in Unreal Engine",
  summary:
    "Architect a C++ based third-person action game in Unreal Engine utilizing Enhanced Input, " +
    "the Gameplay Ability System (GAS), UMG interfaces, and network-ready property replication.",
  stack: ["Unreal Engine 5", "C++", "Gameplay Ability System (GAS)", "Enhanced Input", "UMG"],

  requirements: [
    { id: "cpp-core", text: "Core character and game mode classes are written in C++ using UCLASS, UPROPERTY, and UFUNCTION macros." },
    { id: "enhanced-input", text: "Player movement, camera control, and actions are configured using Unreal's Enhanced Input system." },
    { id: "gas-attributes", text: "Health, Stamina, and Mana are managed via a custom C++ Gameplay AttributeSet and AbilitySystemComponent." },
    { id: "gas-abilities", text: "At least two player abilities (e.g., Light Attack, Fireball) are implemented as Gameplay Abilities with cost and cooldown Gameplay Effects." },
    { id: "animation-montages", text: "Combat animations use Animation Montages with root motion and Animation Notifications for damage windows." },
    { id: "collision-tracing", text: "Melee weapon hits are detected via C++ line/shape traces attached to weapon socket transforms during attack notifies." },
    { id: "umg-ui", text: "UMG Widget UI displays dynamic AttributeSet bars and ability cooldown indicators bound to GAS delegate callbacks." },
    { id: "replication-basics", text: "Character health and ability activation states replicate across server and client models using replicated properties." },
    { id: "tests", text: "Unreal Automation Framework C++ tests verify attribute calculations and gameplay effect application.", check: { type: "file", glob: ["Source/**/*.cpp", "**/Tests/*.cpp"] } },
    { id: "uproject", text: "Repository includes a valid .uproject file and C++ Source directory structure.", check: { type: "file", glob: "*.uproject" } },
    { id: "readme", text: "README documents engine build version, setup instructions, C++ compilation steps, and control scheme.", check: CHECKS.readme },
    { id: "ci", text: "CI workflow checks C++ code formatting, build syntax, or static analysis.", check: CHECKS.ci },
  ],

  rubric: [
    { id: "cpp-architecture", name: "C++ & Unreal Architecture", weight: 20, layerId: "unreal-3", description: "Clean separation between C++ logic and Blueprint extensions, proper memory management and macro usage." },
    { id: "gas-implementation", name: "Gameplay Ability System", weight: 20, layerId: "unreal-8", description: "Robust attribute setup, proper application of Gameplay Effects, Tags, and modular ability design." },
    { id: "combat-physics", name: "Combat Tracing & Physics", weight: 15, layerId: "unreal-4", description: "Accurate hit detection using traces, socket placement, and responsive collision channel configurations." },
    { id: "anim-ui", name: "Animations & UMG Interface", weight: 15, layerId: "unreal-6", description: "Fluid animation transitions via montages/notifies and event-driven UMG UI data bindings." },
    { id: "multiplayer-replication", name: "Replication & Network Readiness", weight: 15, layerId: "unreal-9", description: "Attributes and RPC actions are synchronized properly with proper authority checks on server and client." },
    { id: "docs-testing", name: "Quality Assurance & Docs", weight: 15, layerId: "unreal-10", description: "Detailed README documentation and working C++ automation tests for game attributes." },
  ],

  twistPool: [
    { id: "lock-on-camera", text: "Build a target lock-on camera system in C++ that selects the best enemy target based on camera distance and angle." },
    { id: "combo-system", text: "Implement a branching melee combo tree where timing windows during attack montages trigger distinct heavy/light follow-up abilities." },
    { id: "procedural-dungeon-blockers", text: "Create dynamic gameplay doors/barriers using Lumen-reactive material instances that dissolve when specific Gameplay Tags are applied." },
    { id: "ai-behavior-tree", text: "Implement enemy AI using Behavior Trees and Perception components that execute tactical flanking abilities via GAS." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};/**
 * Capstone brief — Unity Dev track (unity), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
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
import { CHECKS, COMMON_RULES } from "../shared.js";

export default {
  trackId: "unity",
  categoryId: "gamedev",
  slug: "unity-dungeon-crawler",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "3D Action Dungeon Crawler in Unity URP",
  summary:
    "Build a 3D isometric dungeon crawler featuring physics-based movement, state-driven AI, " +
    "ScriptableObject-driven abilities, custom URP visual effects, and local save/load persistence.",
  stack: ["Unity", "C#", "Universal Render Pipeline (URP)", "Input System", "NavMesh"],

  requirements: [
    { id: "player-movement", text: "Player moves and rotates using Unity's new Input System, driving an Animator Blend Tree for movement states." },
    { id: "physics-combat", text: "Combat uses physics Raycasts and OverlapSphere triggers to register directional melee hits and apply knockback." },
    { id: "enemy-ai", text: "Enemies use NavMeshAgent with a finite state machine supporting patrol, line-of-sight chase, and attack states." },
    { id: "scriptable-abilities", text: "Abilities, weapons, and enemy stats are defined using ScriptableObjects to decouple data from logic." },
    { id: "urp-vfx", text: "Visual effects use URP Shader Graph for custom hit highlights/dissolves and a Particle System for combat impacts." },
    { id: "save-system", text: "Game state (player stats, inventory items, and unlocked doors) persists locally using JSON serialization." },
    { id: "ui-system", text: "Canvas UI displays player health/energy bars, active abilities, and a functional pause/game-over screen." },
    { id: "audio-vfx", text: "Combat and ambient sound effects are routed through AudioMixer groups with spatial 3D positional audio." },
    { id: "tests", text: "Unit and integration tests verify player health logic, damage calculation, and JSON save/load serialization.", check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] } },
    { id: "readme", text: "README outlines setup steps, Unity version used, control bindings, and playtesting instructions.", check: CHECKS.readme },
    { id: "ci", text: "A CI workflow validates C# syntax, code style, or runs Unity automated tests on push.", check: CHECKS.ci },
    { id: "meta-files", text: "Unity project structure includes standard Assets folder and valid .meta files for version control.", check: { type: "file", glob: "Assets/**/*.meta" } },
  ],

  rubric: [
    { id: "core-gameplay", name: "Gameplay & Physics Mechanics", weight: 20, layerId: "unity-3", description: "Smooth physics-driven movement, responsive input handling, and reliable collision/combat detection." },
    { id: "ai-navigation", name: "Enemy AI & Pathfinding", weight: 20, layerId: "unity-9", description: "Clean state machine flow, proper NavMesh navigation, and reliable line-of-sight target detection." },
    { id: "architecture", name: "Data Architecture & ScriptableObjects", weight: 20, layerId: "unity-8", description: "Effective use of ScriptableObjects for modular stats and abilities, paired with clean JSON persistence." },
    { id: "graphics-vfx", name: "Shaders & Visual Polish", weight: 15, layerId: "unity-7", description: "URP Shader Graph assets, materials, and particle systems integrated cleanly into gameplay callbacks." },
    { id: "ui-audio", name: "UI & Audio Integration", weight: 15, layerId: "unity-4", description: "Robust canvas setup, dynamic HUD bindings, game state transitions, and well-mixed 3D spatial audio." },
    { id: "docs-tests", name: "Testing & Documentation", weight: 10, layerId: "unity-10", description: "Comprehensive README and automated test coverage for core game logic and serialization." },
  ],

  twistPool: [
    { id: "elemental-combos", text: "Implement an elemental status system (Fire, Ice, Lightning) where combining elements on an enemy triggers reactive effects like Shatter or Explosion." },
    { id: "object-pooling", text: "Build a generic object pool manager for projectile entities and hit visual particles, completely eliminating Runtime Instantiation during combat." },
    { id: "dynamic-dungeon", text: "Create a room-based dungeon layout generator that spawns prefab rooms at runtime using ScriptableObject room definitions." },
    { id: "boss-phases", text: "Add a multi-phase boss encounter with custom Shader Graph transition effects and distinct attack patterns per phase." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};