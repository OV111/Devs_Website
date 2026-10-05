/**
 * The mid-level readiness model: five spheres, and the skills each one covers.
 * This is the single place the rules live; the pure function in
 * computeReadiness.js reads it, so changing a threshold never touches logic.
 *
 * Levels are never self-reported. They are derived from evidence the platform
 * already verified (merged PRs, reviews, defenses, peer ratings, and later
 * deploys and incident drills).
 */

export const SPHERES = [
  { id: "build", title: "Build", skills: ["Build features independently", "Write good tests"] },
  { id: "judgment", title: "Judgment", skills: ["Understand architecture and trade-offs", "Make reasonable technical decisions"] },
  { id: "collaboration", title: "Collaboration", skills: ["Use Git/PRs professionally", "Review other people's code", "Communicate with a team"] },
  { id: "debugOps", title: "Debug & Ops", skills: ["Debug unfamiliar problems", "Handle production issues"] },
  // Derived: ownership is a pattern across the other spheres, not its own test.
  { id: "ownership", title: "Ownership", skills: ["Take ownership instead of waiting for instructions"], derived: true },
];

export const LEVELS = ["none", "shown", "strong"];

// Starting guesses: tune once real teams produce data.
export const THRESHOLDS = {
  build: { shownPrs: 1, strongPrs: 5 },
  judgment: { strongDefenses: 2 },
  collaboration: { strongReviews: 5, strongPeerAverage: 4 },
  ownership: { shownSpheres: 2, strongSpheres: 3 },
  midReady: { strongSpheres: 3 },
};
