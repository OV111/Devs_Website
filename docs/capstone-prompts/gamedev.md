You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (11 tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/gamedev/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example (it is from another category — use categoryId "gamedev" instead):

```js
/**
 * Capstone brief — API Developer track (api-dev), v1.
 *
 * DRAFT by Claude, 2026-10-03 — status stays "draft" until a human has read
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "api-dev",
  categoryId: "backend", // exam_attempts and weakSpots store the category as `path`
  slug: "api-dev-notes-service",
  version: 1,
  status: "published",
  reviewed: true,
  title: "Production-ready REST API for a notes service",
  summary:
    "Build a multi-user notes API the way you would ship it at work: authenticated, validated, " +
    "tested, documented and runnable with one command. Not a tutorial project — every decision " +
    "you make here is something you will be asked to defend.",
  stack: ["Node.js", "Express", "PostgreSQL or MongoDB", "Docker", "GitHub Actions"],

  requirements: [
    { id: "auth", text: "Users can register and log in. Passwords are hashed; protected routes require a valid token." },
    { id: "crud", text: "Authenticated users can create, read, update and delete their own notes — and never anyone else's." },
    { id: "validation", text: "Every request body and parameter is validated; invalid input returns a 400 with a clear message, never a 500." },
    { id: "errors", text: "A central error handler returns consistent JSON errors and never leaks stack traces." },
    { id: "pagination", text: "Listing notes supports pagination." },
    { id: "rate-limit", text: "Auth endpoints are rate limited." },
    { id: "tests", text: "Integration tests cover auth and the notes endpoints, including an ownership test.", check: { type: "file", glob: "**/*.{test,spec}.{js,ts,mjs}" } },
    { id: "readme", text: "README explains setup, environment variables and how to run the tests.", check: { type: "file", glob: "README.md" } },
    { id: "docker", text: "The API and its database start with one command (Docker Compose).", check: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" } },
    { id: "ci", text: "A CI workflow runs lint and tests on every push.", check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" } },
    { id: "no-secrets", text: "No secrets are committed; configuration comes from environment variables with an .env.example.", check: { type: "file", glob: ".env.example" } },
  ],

  rubric: [
    { id: "correctness", name: "Correctness", weight: 25, layerId: "api-dev-4", description: "Does it do what the requirements and your twist ask, including the edge cases?" },
    { id: "structure", name: "Structure", weight: 15, layerId: "api-dev-4", description: "Clear separation of routes, business logic and data access; easy to find things." },
    { id: "error-handling", name: "Error handling & validation", weight: 15, layerId: "api-dev-3", description: "Bad input and failures are handled deliberately, with correct status codes." },
    { id: "security", name: "Security basics", weight: 20, layerId: "api-dev-6", description: "Hashing, token handling, ownership checks, rate limiting, no secrets in the repo." },
    { id: "tests", name: "Tests", weight: 15, layerId: "api-dev-8", description: "Tests exercise real behaviour, including failure paths, and are isolated from each other." },
    { id: "docs-ops", name: "Docs & operability", weight: 10, layerId: "api-dev-10", description: "Someone new can run, test and configure it from the README alone." },
  ],

  // One twist per attempt, never repeated on a retry while unused ones remain.
  twistPool: [
    { id: "sharing", text: "Notes can be shared read-only with another user by username. A shared note must never be editable by the recipient." },
    { id: "soft-delete", text: "Deleting a note is a soft delete. Deleted notes can be restored within 7 days and are excluded from listings." },
    { id: "search", text: "Add full-text search over a user's own notes (title and body), paginated, never returning other users' notes." },
    { id: "versions", text: "Every update keeps the previous version. Users can list a note's history and restore an earlier version." },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
```

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "gamedev". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: "**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

### unity — Unity Dev
  - unity-1 | C# and Editor Fundamentals | topics: Unity editor layout and panels; GameObjects and components; C# variables and data types; MonoBehaviour lifecycle methods
  - unity-2 | Input and Movement | topics: Legacy input versus new Input System; Transform manipulation; Frame rate independent movement; Time.deltaTime usage
  - unity-3 | Physics and Collisions | topics: Rigidbody and forces; Colliders and triggers; Layer collision matrix; Raycasting and overlap queries
  - unity-4 | UI and Game State | topics: Canvas and anchoring; Buttons sliders and text; Score and health displays; Scene loading and transitions
  - unity-5 | Animation and State Machines | topics: Animation clips and keyframes; Animator controllers and parameters; Blend trees for movement; Animation events and callbacks
  - unity-6 | Audio and Visual Effects | topics: AudioSource and AudioListener; Mixers and volume groups; Spatial 3D audio; Particle System modules
  - unity-7 | Shader Graph and Materials | topics: Universal Render Pipeline setup; Materials and properties; Shader Graph nodes; Dissolve and fresnel effects
  - unity-8 | Data, Saving, and Scriptable Objects | topics: ScriptableObject assets; JSON serialization; PlayerPrefs and save files; Event channels with assets
  - unity-9 | AI and Navigation | topics: NavMesh baking; NavMeshAgent movement; Patrol and chase states; Line of sight detection
  - unity-10 | Optimization and Publishing | topics: Unity Profiler and frame debugger; Draw call batching; Object pooling and memory; Build settings per platform

### unreal — Unreal Dev
  - unreal-1 | Editor and Blueprint Basics | topics: Editor viewport and panels; Actors and components; Blueprint event graphs; Variables and functions
  - unreal-2 | Player Input and Characters | topics: Pawns and Characters; Player controller and possession; Enhanced Input actions; Character movement component
  - unreal-3 | C++ Gameplay Fundamentals | topics: UCLASS UPROPERTY and UFUNCTION; Actor lifecycle in C++; Exposing variables to Blueprints; Garbage collection and pointers
  - unreal-4 | Collisions and Physics | topics: Collision presets and channels; Line and sphere traces; Overlap and hit events; Physics simulation on actors
  - unreal-5 | UI with UMG | topics: Widget Blueprints; Anchors and layout panels; Health and ammo bars; Binding data to widgets
  - unreal-6 | Animation and Skeletal Meshes | topics: Skeletal meshes and skeletons; Animation blueprints; Blend spaces; State machines for locomotion
  - unreal-7 | Materials and Nanite | topics: Material editor nodes; Material instances and parameters; Nanite virtualized geometry; Lumen global illumination
  - unreal-8 | Gameplay Ability System | topics: Ability system component; Gameplay abilities; Attribute sets; Gameplay effects and tags
  - unreal-9 | Multiplayer and Replication | topics: Client server model; Replicated properties; Remote procedure calls; Authority and roles
  - unreal-10 | Packaging and Optimization | topics: Unreal Insights profiling; Stat commands and GPU profiling; Level of detail and culling; Cooking and packaging

### web-game — Web Game Dev
  - web-game-1 | JavaScript and Canvas Basics | topics: JavaScript syntax and functions; Canvas 2D context; The game loop and requestAnimationFrame; Drawing shapes and images
  - web-game-2 | Phaser Game Framework | topics: Phaser scene structure; Loading and displaying sprites; Arcade physics bodies; Sprite groups
  - web-game-3 | Sprites, Animation, and Audio | topics: Sprite sheets and atlases; Animation frames and keys; Sound effects and music; Web Audio basics
  - web-game-4 | Game State and UI | topics: Scene management and data passing; Score and lives tracking; Text and bitmap fonts; Menu and pause scenes
  - web-game-5 | WebGL and 3D with Three.js | topics: Scene camera and renderer; Meshes and geometries; Materials and lights; Loading 3D models
  - web-game-6 | 3D Physics and Interaction | topics: Physics world and bodies; Syncing physics to meshes; Collision detection; Raycasting for selection
  - web-game-7 | Shaders and Visual Effects | topics: Vertex and fragment shaders; Uniforms and attributes; Shader materials in Three.js; Post processing passes
  - web-game-8 | Networking and Multiplayer | topics: WebSocket connections; Server authoritative state; Client side prediction; Broadcasting updates
  - web-game-9 | Asset Pipeline and Tooling | topics: Bundlers and modules; Texture and model compression; Asset preloading strategies; Code splitting
  - web-game-10 | Optimization and Deployment | topics: Browser performance profiling; Frame budget and draw calls; Memory and garbage collection; Progressive loading

### game-designer — Game Designer
  - game-designer-1 | Design Fundamentals | topics: What game design is; Player types and motivation; Core loops and pillars; Mechanics dynamics aesthetics
  - game-designer-2 | The Game Design Document | topics: GDD structure and sections; Scope and feature lists; One page and full design docs; Reference and mood boards
  - game-designer-3 | Systems and Mechanics | topics: Game systems and feedback loops; Resources and economies; Progression systems; Risk and reward
  - game-designer-4 | Level and Encounter Design | topics: Pacing and difficulty curves; Spatial layout and flow; Guiding the player; Teaching through levels
  - game-designer-5 | Prototyping in Unity | topics: Unity editor basics; Gray box prototyping; Simple scripting for designers; Rapid iteration
  - game-designer-6 | Narrative and Branching | topics: Story structure; Branching and choices; Twine passages and links; Worldbuilding
  - game-designer-7 | Balancing and Economy | topics: Balancing curves; Spreadsheet modeling; Currency and sinks; Power and progression curves
  - game-designer-8 | UX and Interface Design | topics: Player onboarding; Menu and HUD layout; Feedback and affordances; Accessibility options
  - game-designer-9 | Playtesting and Iteration | topics: Playtest planning; Observing players; Surveys and metrics; Synthesizing feedback
  - game-designer-10 | Pitching and Shipping | topics: Pitch decks; Vertical slice; Marketing and hooks; Production planning

### godot — Godot Developer
  - godot-1 | Godot and GDScript Basics | topics: Editor interface and docks; Nodes and scenes; GDScript syntax; The scene tree
  - godot-2 | Nodes, Scenes, and Signals | topics: Scene composition; Instancing scenes; Custom signals; Node references and groups
  - godot-3 | 2D Physics and Movement | topics: CharacterBody2D; RigidBody and StaticBody; Collision shapes and layers; move_and_slide
  - godot-4 | UI and Game Flow | topics: Control nodes and containers; Anchors and layout; Labels buttons and bars; Scene switching
  - godot-5 | Animation and Tweens | topics: AnimationPlayer tracks; AnimatedSprite2D; AnimationTree state machines; Tweens for movement
  - godot-6 | Audio and Particles | topics: AudioStreamPlayer nodes; Audio buses and effects; Positional 2D audio; GPUParticles2D
  - godot-7 | Shaders in Godot | topics: Godot shading language; Canvas item shaders; Uniforms and parameters; Screen and texture effects
  - godot-8 | C# in Godot and Architecture | topics: C# setup and bindings; Calling engine APIs from C#; State machines; Resource files for data
  - godot-9 | Enemy AI and Levels | topics: State based enemy AI; Navigation2D pathfinding; Player detection; TileMap level building
  - godot-10 | Exporting and Optimization | topics: Godot profiler; Reducing draw calls; Object pooling; Export templates and presets

### game-ai — Game AI Developer
  - game-ai-1 | AI Foundations | topics: What game AI is; Agents and perception; Vectors and steering basics; Decision making overview
  - game-ai-2 | Finite State Machines | topics: States and transitions; FSM implementation patterns; Hierarchical state machines; Enter update and exit
  - game-ai-3 | Pathfinding and Navigation | topics: Graphs and grids; A star algorithm; Dijkstra and heuristics; Navigation meshes
  - game-ai-4 | Steering Behaviors | topics: Seek and flee; Arrive and pursue; Wander behavior; Obstacle avoidance
  - game-ai-5 | Behavior Trees | topics: Nodes selectors and sequences; Composite and decorator nodes; Blackboards; Tick and node status
  - game-ai-6 | Perception and Sensing | topics: Vision cones and line of sight; Hearing and sound events; Raycasting for sensing; Memory and last known position
  - game-ai-7 | GOAP and Planning | topics: Goals and actions; Preconditions and effects; Planning search; World state representation
  - game-ai-8 | Utility AI and Tactics | topics: Utility scoring; Response curves; Weighing competing actions; Influence maps
  - game-ai-9 | Group and Coordinated AI | topics: Squad coordination; Role assignment; Flanking and formations; Shared blackboards
  - game-ai-10 | Profiling and Shipping AI | topics: Profiling AI cost; Time slicing and budgets; Level of detail for AI; Debug visualization

### shader-dev — Shader / Graphics Dev
  - shader-dev-1 | Graphics and Math Foundations | topics: Rendering pipeline overview; Vectors and matrices; Coordinate spaces; Vertex and fragment stages
  - shader-dev-2 | Fragment Shader Fundamentals | topics: Uniforms and varyings; UV coordinates; Math functions in shaders; Mixing and stepping
  - shader-dev-3 | Texturing and Sampling | topics: Texture sampling; UV transforms and tiling; Texture blending; Normal maps
  - shader-dev-4 | Lighting Models | topics: Diffuse and specular; Normals and lighting math; Phong and Blinn-Phong; Physically based rendering
  - shader-dev-5 | Unity URP Shaders | topics: URP shader structure; Shader Graph and code; Lit and unlit shaders; Custom lighting in URP
  - shader-dev-6 | Vertex Shaders and Deformation | topics: Vertex position manipulation; Wave and wind effects; Vertex colors; World and object space
  - shader-dev-7 | Post Processing Effects | topics: Full screen shaders; Bloom and glow; Color grading; Vignette and chromatic aberration
  - shader-dev-8 | Compute and GPU Programming | topics: Compute shader basics; Thread groups; Structured buffers; GPU particle systems
  - shader-dev-9 | Vulkan and Modern APIs | topics: Vulkan pipeline objects; Command buffers; Descriptor sets; SPIR-V shader compilation
  - shader-dev-10 | Optimization and Profiling | topics: GPU profiling with RenderDoc; Shader instruction cost; Reducing overdraw; Branching and precision

### game-backend — Game Backend Dev
  - game-backend-1 | Node.js and Server Basics | topics: Node.js runtime and modules; HTTP and REST; Express routing; JSON request handling
  - game-backend-2 | Real-Time with WebSockets | topics: WebSocket protocol; Socket.io rooms; Broadcasting events; Connection lifecycle
  - game-backend-3 | Authentication and Accounts | topics: Password hashing; JWT tokens; OAuth and social login; Sessions and refresh tokens
  - game-backend-4 | Databases and Persistence | topics: Relational versus document stores; Schema design for games; CRUD operations; Indexes and queries
  - game-backend-5 | Caching with Redis | topics: Redis data structures; Caching strategies; Sorted sets for leaderboards; Pub sub messaging
  - game-backend-6 | Game State and Authority | topics: Authoritative game loop; State synchronization; Tick rate and updates; Input validation
  - game-backend-7 | Matchmaking and Lobbies | topics: Matchmaking queues; Skill based matching; Party and lobby systems; Server allocation
  - game-backend-8 | Managed Services with PlayFab | topics: PlayFab player accounts; Virtual economy and items; Cloud script functions; Leaderboards and stats
  - game-backend-9 | Scaling and Infrastructure | topics: Containerizing with Docker; Load balancing; Horizontal scaling; Game server orchestration
  - game-backend-10 | Security, Monitoring, and Launch | topics: Anti cheat and validation; DDoS and rate limiting; Logging and metrics; Dashboards and alerts

### xr-dev — XR / AR / VR Dev
  - xr-dev-1 | XR Foundations | topics: AR VR and MR concepts; XR hardware and headsets; Unity XR plugin setup; OpenXR overview
  - xr-dev-2 | VR Interaction Basics | topics: XR Interaction Toolkit; Controller input; Grab and throw interactables; Rays and pointers
  - xr-dev-3 | Locomotion and Comfort | topics: Continuous and teleport movement; Snap and smooth turning; Vignette comfort; Climbing and grab movement
  - xr-dev-4 | AR with ARKit and ARFoundation | topics: ARFoundation setup; Plane and surface detection; Placing virtual objects; Light estimation
  - xr-dev-5 | Hand and Body Tracking | topics: Hand tracking setup; Joint and pose data; Gesture recognition; Pinch and poke interactions
  - xr-dev-6 | Spatial UI and Audio | topics: World space canvases; Diegetic UI; Gaze and pointer UI; Spatial 3D audio
  - xr-dev-7 | WebXR and Cross Platform | topics: WebXR Device API; VR and AR sessions; Three.js XR integration; Controller input on web
  - xr-dev-8 | Multiplayer and Social XR | topics: Networked avatars; Synchronizing head and hands; Voice chat; Shared object interaction
  - xr-dev-9 | Performance and Optimization | topics: Frame rate targets; Single pass stereo rendering; Draw call reduction; Foveated rendering
  - xr-dev-10 | Publishing XR Apps | topics: Build settings per device; Meta Quest store requirements; App Lab and sideloading; App store submission

### gameplay-engineer — Gameplay Engineer
  - gameplay-engineer-1 | Programming Foundations | topics: C++ and C# basics; Memory and references; Object oriented design; Data structures
  - gameplay-engineer-2 | Game Loops and Architecture | topics: Update and render loops; Fixed and variable timestep; Component patterns; Game state management
  - gameplay-engineer-3 | Character Controllers | topics: Kinematic and physics controllers; Ground detection; Jumping and coyote time; Slopes and steps
  - gameplay-engineer-4 | Combat and Abilities | topics: Hitboxes and hurtboxes; Damage and health systems; Ability cooldowns; Combos and timing
  - gameplay-engineer-5 | Animation Programming | topics: Animation state machines; Blend trees; Animation events; Procedural animation
  - gameplay-engineer-6 | Gameplay Systems and Data | topics: Inventory systems; Quest and dialogue systems; Progression and leveling; Data driven configuration
  - gameplay-engineer-7 | Multiplayer Gameplay | topics: Client server model; Replication of state; Remote procedure calls; Prediction and reconciliation
  - gameplay-engineer-8 | Tools and Workflow | topics: Custom editor windows; Inspectors and gizmos; Debug visualization; Cheat and test commands
  - gameplay-engineer-9 | Performance and Memory | topics: Profiling tools; CPU and memory hotspots; Object pooling; Cache friendly data
  - gameplay-engineer-10 | Polish and Shipping | topics: Game feel and juice; Screen shake and feedback; Bug triage and fixing; Build pipelines

### tools-dev — Game Tools Developer
  - tools-dev-1 | Tools Programming Foundations | topics: Role of tools programming; C# and Python basics; Scripting versus compiled; Reading and writing files
  - tools-dev-2 | Unity Editor Scripting | topics: Custom inspectors; Editor windows; Property drawers; Gizmos and handles
  - tools-dev-3 | Asset Pipelines and Importers | topics: Asset import settings; Scripted importers; Asset postprocessors; Naming and validation rules
  - tools-dev-4 | Standalone Tools with Qt | topics: Qt and PySide basics; Widgets and layouts; Signals and slots; File dialogs and trees
  - tools-dev-5 | Data Driven Tooling | topics: JSON and YAML formats; Serialization and parsing; ScriptableObject data; Spreadsheet import
  - tools-dev-6 | Level and Content Editors | topics: Scene editing tools; Custom handles and gizmos; Brush and placement tools; Procedural placement
  - tools-dev-7 | Automation and Build Tools | topics: Automated build scripts; Command line builds; Continuous integration; Test automation
  - tools-dev-8 | Debugging and Profiling Tools | topics: Debug overlays and HUDs; In game consoles; Custom profiler markers; Logging frameworks
  - tools-dev-9 | Pipeline Integration | topics: Blender and Maya scripting; Export and import bridges; Source control integration; Naming conventions
  - tools-dev-10 | Distribution and Maintenance | topics: Packaging and distribution; Versioning tools; Documentation; User feedback loops
