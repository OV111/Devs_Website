/**
 * Capstone brief — shader-dev track (shader-dev), v1.
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
    {
      id: "custom-hlsl-lit",
      text: "Write a custom HLSL lit surface shader implementing Blinn-Phong or Cook-Torrance PBR shading models from math principles.",
    },
    {
      id: "texture-normal-mapping",
      text: "Implement UV transformation, normal mapping, packed PBR maps (smoothness/metallic), and triplanar mapping modes.",
    },
    {
      id: "vertex-deformation",
      text: "Create a vertex shader driven by time and noise functions for dynamic mesh deformation (e.g., interactive water waves or wind foliage).",
    },
    {
      id: "compute-particles",
      text: "Build a GPU particle system driven by a Compute Shader using StructuredBuffers to compute and render 100,000+ interactive particles.",
    },
    {
      id: "post-processing-pass",
      text: "Implement a custom full-screen post-processing render feature (e.g., volumetric depth fog, edge-detection toon outline, or chromatic distortion).",
    },
    {
      id: "shader-graph-vfx",
      text: "Author a Shader Graph visual effect utilizing fresnel transparency, dissolve noise thresholds, and vertex offset animation.",
    },
    {
      id: "shader-properties",
      text: "Expose clean inspector properties, material keywords, and uniform parameters controllable via C# scripts at runtime.",
    },
    {
      id: "profiling-optimization",
      text: "Profile GPU performance using Frame Debugger / RenderDoc, optimizing texture sampling and eliminating unnecessary branching.",
    },
    {
      id: "tests",
      text: "Unit tests or automated validation scripts verify material property setters, compute buffer allocations, and shader compilation.",
      check: { type: "file", glob: ["**/Tests/**/*.cs", "**/Editor/**/*.cs"] },
    },
    {
      id: "readme",
      text: "README details HLSL shader architectures, mathematical lighting equations, compute thread group setups, and performance benchmarks.",
      check: CHECKS.readme,
    },
    {
      id: "ci",
      text: "CI workflow checks C# scripting syntax, shader file formatting, and repository structural integrity.",
      check: CHECKS.ci,
    },
    {
      id: "shader-files",
      text: "Repository contains valid custom .hlsl or .shader files in dedicated shader directories.",
      check: { type: "file", glob: ["**/*.hlsl", "**/*.shader"] },
    },
  ],

  rubric: [
    {
      id: "lighting-math",
      name: "Graphics Math & Lighting Models",
      weight: 20,
      layerId: "shader-dev-4",
      description:
        "Accurate mathematical implementation of surface normals, lighting vectors, and specular/diffuse reflection models.",
    },
    {
      id: "texturing-sampling",
      name: "Texturing & Sampling Techniques",
      weight: 15,
      layerId: "shader-dev-3",
      description:
        "Proper UV manipulation, triplanar projection, normal map unpack algorithms, and texture blending.",
    },
    {
      id: "vertex-shaders",
      name: "Vertex Shader & Mesh Deformation",
      weight: 15,
      layerId: "shader-dev-6",
      description:
        "Fluid vertex displacement driven by procedural noise, respecting object/world coordinate space transforms.",
    },
    {
      id: "post-processing",
      name: "Post-Processing & Pipeline Extensions",
      weight: 15,
      layerId: "shader-dev-7",
      description:
        "Seamless integration of custom full-screen blit passes and depth/normal buffer render features in URP.",
    },
    {
      id: "compute-shaders",
      name: "Compute Shaders & GPU Programming",
      weight: 20,
      layerId: "shader-dev-8",
      description:
        "Efficient compute buffer dispatch, thread group allocation, and GPU-driven particle state updates.",
    },
    {
      id: "docs-profiling",
      name: "Documentation & Performance Optimization",
      weight: 15,
      layerId: "shader-dev-10",
      description:
        "Detailed README documentation, clear math explanations, and verified low instruction cost GPU profiling.",
    },
  ],

  twistPool: [
    {
      id: "screen-space-reflections",
      text: "Implement a custom screen-space raymarching shader pass in HLSL to calculate dynamic water reflections.",
    },
    {
      id: "hair-fur-shell",
      text: "Create a multi-pass shell rendering shader for realistic volumetric fur or grass foliage with individual strand offsets.",
    },
    {
      id: "stochastic-sampling",
      text: "Incorporate stochastic texture sampling in HLSL to eliminate repeating tile patterns across large terrain surfaces.",
    },
    {
      id: "subsurface-scattering",
      text: "Add an fast subsurface scattering approximation shader for skin/jade materials using custom light attenuation formulas.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
