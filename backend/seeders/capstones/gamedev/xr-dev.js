/**
 * Capstone brief — xr-dev track (xr-dev), v1.
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
    {
      id: "openxr-setup",
      text: "Configure Unity with OpenXR supporting both VR head-mounted displays and mobile/passthrough AR modes.",
    },
    {
      id: "vr-interactions",
      text: "Implement physical direct grabbing, ray grabbing, distance snapping, and throwing physics using XR Interaction Toolkit.",
    },
    {
      id: "locomotion-comfort",
      text: "Provide teleportation, smooth locomotion, snap turning, and a tunnel vignette comfort feature for movement.",
    },
    {
      id: "hand-tracking",
      text: "Integrate hand tracking joint data allowing players to poke 3D buttons and perform pinch interactions without controllers.",
    },
    {
      id: "ar-plane-detection",
      text: "In AR mode, implement plane detection and light estimation using ARFoundation to place the escape room anchor on real-world tables.",
    },
    {
      id: "diegetic-ui",
      text: "Build spatial world-space diegetic UI screens and keypad interfaces anchored directly into physical room props.",
    },
    {
      id: "spatial-audio",
      text: "Incorporate spatial 3D audio sources with realistic distance attenuation and sound occlusion curves for environmental clues.",
    },
    {
      id: "performance-target",
      text: "Maintain strict 72+ FPS performance targets by enabling Single Pass Instanced rendering and reducing draw calls.",
    },
    {
      id: "tests",
      text: "Unit tests cover escape room puzzle logic, inventory state tracking, and lock key verification.",
      check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] },
    },
    {
      id: "readme",
      text: "README details target XR hardware setup, OpenXR feature profiles, control mapping, and side-loading deployment steps.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow validates Unity C# code formatting, asset compilation, and build configurations.",
      check: CHECKS.ci,
    },
    {
      id: "meta-files",
      text: "Unity project structure includes standard Assets directory and valid .meta files for version control.",
      check: { type: "file", glob: "Assets/**/*.meta" },
    },
  ],

  rubric: [
    {
      id: "vr-interaction-design",
      name: "XR Interaction Mechanics",
      weight: 20,
      layerId: "xr-dev-2",
      description:
        "Natural controller/hand physics, accurate grab sockets, distance ray casting, and reliable throwing velocity computation.",
    },
    {
      id: "locomotion-comfort",
      name: "Locomotion & Comfort Systems",
      weight: 15,
      layerId: "xr-dev-3",
      description:
        "Smooth teleportation anchors, customizable snap turns, and effective vignette motion-sickness prevention options.",
    },
    {
      id: "ar-passthrough",
      name: "AR Plane Detection & Passthrough",
      weight: 15,
      layerId: "xr-dev-4",
      description:
        "Robust surface detection, stable spatial anchor placement, and realistic environmental lighting estimation.",
    },
    {
      id: "hand-tracking-gestures",
      name: "Hand Tracking & Direct Pokes",
      weight: 15,
      layerId: "xr-dev-5",
      description:
        "Accurate joint tracking pose evaluation, reliable pinch/poke triggers, and seamless hand-to-controller fallbacks.",
    },
    {
      id: "spatial-ui-audio",
      name: "Spatial UI & 3D Audio",
      weight: 15,
      layerId: "xr-dev-6",
      description:
        "Diegetic world-space interface layouts, intuitive affordances, and immersive spatialized audio positioning.",
    },
    {
      id: "docs-optimization",
      name: "XR Optimization & Documentation",
      weight: 20,
      layerId: "xr-dev-9",
      description:
        "Adherence to VR frame budgets via single-pass stereo rendering, alongside comprehensive hardware setup documentation.",
    },
  ],

  twistPool: [
    {
      id: "networked-coop",
      text: "Implement two-player networked co-op where one player in VR collaborates with a second player in mobile AR using shared spatial anchors.",
    },
    {
      id: "haptic-feedback-custom",
      text: "Create a custom haptic pulse feedback system that varies frequency and intensity based on object textures and weight.",
    },
    {
      id: "eye-tracking-foveated",
      text: "Integrate eye-tracking gaze interaction to select distant objects and enable dynamic foveated rendering presets.",
    },
    {
      id: "physics-climbing",
      text: "Build a physics-based climbing mechanic where players grip ledge collision volumes and pull their camera rig up.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
