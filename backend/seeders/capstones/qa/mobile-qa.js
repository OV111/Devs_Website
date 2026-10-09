/**
 * Capstone brief — mobile-qa track (mobile-qa), v1.
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
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "mobile-qa",
  categoryId: "qa",
  slug: "mobile-qa-appium-test-framework",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Cross-Platform Mobile Automation Framework",
  summary:
    "Build a mobile test automation framework using Appium, Python, and Pytest. " +
    "You will design screen objects for native mobile flows, automate complex gestures and app interrupts, " +
    "measure mobile performance metrics, and orchestrate automated test runs in CI using Fastlane.",
  stack: ["Python", "Appium", "Pytest", "Fastlane", "GitHub Actions"],

  requirements: [
    {
      id: "screen-object-model",
      text: "Implement the Screen Object Model architecture with a BaseScreen class organizing mobile locators and drivers.",
      check: { type: "file", glob: "**/screens/*.py" },
    },
    {
      id: "e2e-mobile-flows",
      text: "Automate core mobile app workflows including user registration, login, and multi-screen navigation.",
      check: { type: "file", glob: "**/tests/test_flows*.py" },
    },
    {
      id: "gesture-automation",
      text: "Script automated touch actions for complex gestures including swipes, dynamic scrolls, and pinch-to-zoom.",
      check: { type: "file", glob: "**/tests/test_gestures*.py" },
    },
    {
      id: "interrupt-testing",
      text: "Automate system interrupt scenarios handling deep links, network connection toggles, and app backgrounding.",
    },
    {
      id: "performance-metrics",
      text: "Collect and assert mobile performance metrics including application launch latency, CPU load, and memory usage.",
      check: { type: "file", glob: "**/tests/test_performance*.py" },
    },
    {
      id: "mobile-accessibility",
      text: "Include accessibility locator verification ensuring content descriptions and accessibility labels are present.",
    },
    {
      id: "pytest-fixtures",
      text: "Organize Appium driver capabilities, device sessions, and test teardown using Pytest fixtures.",
      check: { type: "file", glob: "**/conftest.py" },
    },
    {
      id: "fastlane-config",
      text: "Provide a Fastlane setup file automating app builds or test runner triggers.",
      check: { type: "file", glob: "**/Fastfile" },
    },
    {
      id: "readme",
      text: "README explains Appium server configuration, simulator/emulator setup, desired capabilities, and local runner execution.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-workflow",
      text: "Configure a GitHub Actions pipeline triggering automated headless mobile test runs or matrix configurations.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
    {
      id: "env-example",
      text: "Provide environment variable configuration file templates for mobile capabilities and device credentials.",
      check: { type: "file", glob: ".env.example" },
    },
  ],

  rubric: [
    {
      id: "screen-architecture",
      name: "Screen Object Architecture",
      weight: 25,
      layerId: "mobile-qa-9",
      description:
        "Clean Screen Object pattern implementation separating UI locators from test logic with BaseScreen reuse.",
    },
    {
      id: "appium-automation",
      name: "Appium Automation Mastery",
      weight: 20,
      layerId: "mobile-qa-2",
      description:
        "Robust usage of Appium locators, explicit waits, context switching, and driver session handling.",
    },
    {
      id: "gestures-interrupts",
      name: "Gestures & Interrupt Handling",
      weight: 15,
      layerId: "mobile-qa-6",
      description:
        "Reliable execution of touch gestures, deep links, push notification assertions, and system state disruptions.",
    },
    {
      id: "performance-a11y",
      name: "Mobile Performance & Accessibility",
      weight: 15,
      layerId: "mobile-qa-7",
      description:
        "Accurate tracking of startup performance and validation of accessibility labels and target sizes.",
    },
    {
      id: "ci-fastlane",
      name: "CI & Mobile Build Pipelines",
      weight: 15,
      layerId: "mobile-qa-10",
      description:
        "Effective pipeline integration using Fastlane and GitHub Actions for continuous mobile quality.",
    },
    {
      id: "docs-setup",
      name: "Documentation & Operability",
      weight: 10,
      layerId: "mobile-qa-1",
      description:
        "Comprehensive documentation covering local device configuration, ADB/iOS setups, and test logs.",
    },
  ],

  twistPool: [
    {
      id: "parallel-device-matrix",
      text: "Configure parallel test execution across multiple emulator/simulator instances using pytest-xdist.",
    },
    {
      id: "battery-drain-monitor",
      text: "Implement an automated test module logging battery drain and device temperature metrics during extended test runs.",
    },
    {
      id: "biometric-auth-mock",
      text: "Simulate biometric authentication (TouchID/FaceID) interactions via Appium commands within the login workflow.",
    },
    {
      id: "network-mocking-mobile",
      text: "Integrate local proxy tools to intercept mobile API traffic and simulate offline sync behavior.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
