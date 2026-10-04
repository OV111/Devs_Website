/**
 * Capstone brief — PWA Developer track (pwa-dev), v1.
 *
 * DRAFT by ChatGPT, 2026-10-04 — status stays "draft" until a human has read
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
 * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded.
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { COMMON_RULES } from "../shared.js";

export default {
  trackId: "pwa-dev",
  categoryId: "mobile",
  slug: "pwa-dev-travel-journal",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Offline travel journal PWA",
  summary:
    "Build an installable travel journal PWA where users record trips, places and notes while moving between unreliable networks. The app must provide a responsive app-shell experience, persist structured data locally, use a service worker with deliberate caching, expose install metadata and remain functional when the network is unavailable.",
  stack: [
    "HTML",
    "CSS",
    "JavaScript",
    "Service Worker",
    "Cache API",
    "IndexedDB",
    "Web App Manifest",
    "Workbox",
    "Lighthouse",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "journal-crud",
      text: "Users can create, edit, view and delete trips and their journal entries, with required titles and dates validated before saving.",
    },
    {
      id: "responsive-ui",
      text: "The interface adapts to mobile and desktop viewport sizes and provides touch-friendly controls without relying on hover for essential actions.",
    },
    {
      id: "app-shell",
      text: "The application provides an app-shell structure that renders the primary navigation and core UI before remote content becomes available.",
    },
    {
      id: "manifest",
      text: "The project includes a valid web app manifest with an application name, icons, display mode and theme configuration suitable for installation.",
      check: { type: "file", glob: "manifest.json" },
    },
    {
      id: "service-worker",
      text: "A service worker is registered and handles its lifecycle deliberately, including installation, activation and request interception.",
      check: { type: "file", glob: ["**/service-worker.{js,ts}", "**/sw.js"] },
    },
    {
      id: "offline-data",
      text: "Trips and journal entries are stored in IndexedDB or equivalent browser structured storage so previously saved content can be viewed and edited while offline.",
    },
    {
      id: "cache-strategy",
      text: "The service worker implements deliberate caching strategies for the app shell and remote data, rather than indiscriminately caching every request.",
    },
    {
      id: "ui-states",
      text: "The application visibly handles loading, empty and error states for trip or journal data, with meaningful recovery actions and no permanently blank content areas.",
    },
    {
      id: "device-api",
      text: "The app uses at least one appropriate browser device capability, such as Web Share or clipboard access, with a fallback when the capability is unavailable.",
    },
    {
      id: "tests",
      text: "Automated tests cover core journal behaviour and at least one offline or service-worker-related path, and the tests run without requiring a real device.",
      check: { type: "file", glob: "**/*.{test,spec}.{js,jsx,ts,tsx}" },
    },
    {
      id: "readme",
      text: "README explains local setup, production serving requirements, how to test the PWA, how to install it and how offline caching and local data work.",
      check: { type: "file", glob: "README.md" },
    },
    {
      id: "ci",
      text: "A CI workflow installs dependencies and runs the automated test suite on every push.",
      check: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
    },
  ],

  rubric: [
    {
      id: "correctness",
      name: "Correctness",
      weight: 25,
      layerId: "pwa-dev-2",
      description:
        "Trip and journal workflows, validation and client-side behaviour work correctly across normal and offline cases.",
    },
    {
      id: "web-foundations",
      name: "Web foundations & accessibility",
      weight: 15,
      layerId: "pwa-dev-1",
      description:
        "Semantic markup, keyboard access, readable structure and responsive CSS provide a usable foundation.",
    },
    {
      id: "app-shell",
      name: "App-shell & responsive UX",
      weight: 15,
      layerId: "pwa-dev-3",
      description:
        "The application shell, responsive layouts, touch interactions and perceived loading experience are deliberately designed.",
    },
    {
      id: "offline",
      name: "Service worker & offline",
      weight: 20,
      layerId: "pwa-dev-6",
      description:
        "Caching, IndexedDB and offline behaviour are coherent, scoped appropriately and preserve user data.",
    },
    {
      id: "pwa-features",
      name: "PWA & device features",
      weight: 10,
      layerId: "pwa-dev-4",
      description:
        "Manifest, installation metadata and browser capability integration are implemented correctly with suitable fallbacks.",
    },
    {
      id: "testing-performance",
      name: "Testing & performance",
      weight: 15,
      layerId: "pwa-dev-9",
      description:
        "Automated tests cover important behaviour and the implementation avoids obvious performance problems through appropriate loading and asset strategies.",
    },
  ],

  twistPool: [
    {
      id: "photos",
      text: "Allow users to attach locally stored photos to journal entries using the browser file or camera capture flow, and make attached photos available while offline.",
    },
    {
      id: "draft-sync",
      text: "Add automatic draft saving for journal entries with a visible saved status and recovery of the latest local draft after a browser reload.",
    },
    {
      id: "timeline",
      text: "Add a chronological trip timeline that groups journal entries by date and supports filtering to a selected day without requiring a network request.",
    },
    {
      id: "share-card",
      text: "Add a share action that creates a formatted trip summary from local data and uses the Web Share API when available, with a clipboard fallback.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
