/**
 * Capstone brief — accessibility-qa track (accessibility-qa), v1.
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
  trackId: "accessibility-qa",
  categoryId: "qa",
  slug: "accessibility-qa-audit-automation",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Automated & Manual Accessibility Audit Suite",
  summary:
    "Conduct an end-to-end accessibility audit against WCAG 2.1 AA standards. " +
    "You will integrate axe-core automated scans using Playwright, perform screen reader and keyboard navigation audits, " +
    "validate custom ARIA widget patterns, and enforce accessibility quality gates in GitHub Actions via Lighthouse CI.",
  stack: [
    "JavaScript / TypeScript",
    "Playwright",
    "axe-core",
    "Lighthouse CI",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "axe-playwright-suite",
      text: "Integrate @axe-core/playwright into automated E2E test scripts auditing key application routes.",
      check: { type: "file", glob: "**/tests/*.{js,ts,mjs}" },
    },
    {
      id: "aria-semantic-checks",
      text: "Write custom assertions verifying semantic HTML markup, ARIA roles, states, and properties.",
      check: { type: "file", glob: "**/tests/aria*.{js,ts,mjs}" },
    },
    {
      id: "keyboard-nav-audit",
      text: "Script automated focus movement verification checking tab order, focus visibility, and keyboard traps.",
      check: { type: "file", glob: "**/tests/keyboard*.{js,ts,mjs}" },
    },
    {
      id: "screen-reader-doc",
      text: "Document manual screen reader evaluation sessions (NVDA or VoiceOver) testing dynamic content alerts and forms.",
      check: { type: "file", glob: "**/docs/screen-reader-audit.md" },
    },
    {
      id: "color-contrast-report",
      text: "Include a color contrast audit report validating text (4.5:1) and non-text UI component contrast (3:1).",
      check: { type: "file", glob: "**/docs/contrast-report.md" },
    },
    {
      id: "lighthouse-ci-config",
      text: "Configure Lighthouse CI settings file (.lighthouserc.json) establishing accessibility score threshold gates.",
      check: { type: "file", glob: ".lighthouserc.json" },
    },
    {
      id: "vpat-document",
      text: "Author a Voluntary Product Accessibility Template (VPAT) summarizing WCAG 2.1 AA conformance status.",
      check: { type: "file", glob: "**/docs/vpat.md" },
    },
    {
      id: "package-json",
      text: "Provide package.json file configuring test scripts, axe dependencies, and Lighthouse tools.",
      check: { type: "file", glob: "package.json" },
    },
    {
      id: "readme",
      text: "README details WCAG auditing criteria, local test commands, screen reader testing notes, and VPAT structure.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci-pipeline",
      text: "Configure a GitHub Actions workflow executing axe-playwright and Lighthouse CI build checks on pull requests.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "axe-automation",
      name: "Automated axe-core Integration",
      weight: 25,
      layerId: "accessibility-qa-9",
      description:
        "Effective implementation of @axe-core/playwright test suites, custom rule configurations, and reporting.",
    },
    {
      id: "aria-semantics",
      name: "ARIA & Semantic HTML",
      weight: 20,
      layerId: "accessibility-qa-8",
      description:
        "Comprehensive validation of semantic HTML elements, ARIA widget roles, expand/collapse states, and dynamic live regions.",
    },
    {
      id: "keyboard-screenreader",
      name: "Keyboard & Screen Reader Audits",
      weight: 15,
      layerId: "accessibility-qa-3",
      description:
        "Thorough manual and automated testing of focus indicators, keyboard trapping, and NVDA/VoiceOver screen reader output.",
    },
    {
      id: "visual-contrast",
      name: "Visual Accessibility & Contrast",
      weight: 15,
      layerId: "accessibility-qa-6",
      description:
        "Accurate verification of text contrast ratios, non-text UI boundaries, focus ring visibility, and scalable text layouts.",
    },
    {
      id: "ci-lighthouse",
      name: "CI Pipeline & Quality Gates",
      weight: 15,
      layerId: "accessibility-qa-10",
      description:
        "Integration of Lighthouse CI and axe tests in GitHub Actions to automatically block non-compliant code merges.",
    },
    {
      id: "vpat-documentation",
      name: "VPAT & Compliance Documentation",
      weight: 10,
      layerId: "accessibility-qa-1",
      description:
        "Professional VPAT report design mapping technical test findings directly to WCAG 2.1 AA success criteria.",
    },
  ],

  twistPool: [
    {
      id: "mobile-accessibility-audit",
      text: "Include a dedicated mobile screen reader audit section evaluating touch target sizes (24x24dp) and VoiceOver/TalkBack gestures.",
    },
    {
      id: "reduced-motion-testing",
      text: "Add automated tests verifying application compliance with prefers-reduced-motion media query settings.",
    },
    {
      id: "high-contrast-mode",
      text: "Verify component rendering and visible focus outline retention under Windows High Contrast Mode / forced colors.",
    },
    {
      id: "custom-axe-ruleset",
      text: "Author a custom axe-core rule extension enforcing organization-specific accessibility standards.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
