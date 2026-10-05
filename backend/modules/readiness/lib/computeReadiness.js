/**
 * Pure: turn a user's verified evidence into a level per sphere and an overall
 * stage. No database, no clock, so every rule is unit-testable.
 *
 * @typedef {Object} Evidence
 * @property {number} mergedPrs        merged PRs authored in team repos
 * @property {number} reviewsGiven     PRs reviewed for teammates
 * @property {number} defensesPassed   capstone + team defenses passed
 * @property {boolean} capstonePassed
 * @property {number|null} peerAverage average received peer rating, or null if hidden/none
 * @property {number} deploys          (not built yet: 0)
 * @property {number} incidentsFixed   (not built yet: 0)
 * @property {number} debugTasksPassed (not built yet: 0)
 */

import { THRESHOLDS as T } from "./competencies.js";

const rank = { none: 0, shown: 1, strong: 2 };
const atLeast = (level, min) => rank[level] >= rank[min];

const buildLevel = (e) => {
  if (e.mergedPrs >= T.build.strongPrs && e.capstonePassed) return "strong";
  if (e.mergedPrs >= T.build.shownPrs || e.capstonePassed) return "shown";
  return "none";
};

const judgmentLevel = (e) => {
  if (e.defensesPassed >= T.judgment.strongDefenses) return "strong";
  if (e.defensesPassed >= 1) return "shown";
  return "none";
};

const collaborationLevel = (e) => {
  const rated = e.peerAverage !== null && e.peerAverage !== undefined;
  if (e.reviewsGiven >= T.collaboration.strongReviews && rated && e.peerAverage >= T.collaboration.strongPeerAverage) {
    return "strong";
  }
  if (e.reviewsGiven >= 1 || rated) return "shown";
  return "none";
};

const debugOpsLevel = (e) => {
  if (e.deploys >= 1 && e.incidentsFixed >= 1 && e.debugTasksPassed >= 1) return "strong";
  if (e.deploys >= 1 || e.incidentsFixed >= 1 || e.debugTasksPassed >= 1) return "shown";
  return "none";
};

/** Ownership is derived: breadth of proof across the four tested spheres. */
const ownershipLevel = (others) => {
  const levels = Object.values(others);
  if (levels.filter((l) => atLeast(l, "strong")).length >= T.ownership.strongSpheres) return "strong";
  if (levels.filter((l) => atLeast(l, "shown")).length >= T.ownership.shownSpheres) return "shown";
  return "none";
};

/** @param {Evidence} evidence */
export const computeReadiness = (evidence) => {
  const tested = {
    build: buildLevel(evidence),
    judgment: judgmentLevel(evidence),
    collaboration: collaborationLevel(evidence),
    debugOps: debugOpsLevel(evidence),
  };
  const spheres = { ...tested, ownership: ownershipLevel(tested) };

  const levels = Object.values(spheres);
  const strong = levels.filter((l) => l === "strong").length;
  const allShown = levels.every((l) => atLeast(l, "shown"));
  const shownCount = levels.filter((l) => atLeast(l, "shown")).length;

  let overall = "entry";
  if (allShown && strong >= T.midReady.strongSpheres) overall = "mid-ready";
  else if (atLeast(spheres.build, "shown") && atLeast(spheres.judgment, "shown") && shownCount >= 3) {
    overall = "approaching-mid";
  }
  return { spheres, overall };
};

