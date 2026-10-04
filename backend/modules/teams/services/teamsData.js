/**
 * Shared data access for the teams module: collection names, indexes and the
 * error helper. Doc shapes are documented here because the backend is plain JS.
 *
 * teams:              { name, trackId, status, repo: {fullName, id, url},
 *                       members: [{userId, githubLogin, status, joinedAt, leftAt}],
 *                       createdAt, updatedAt }
 * team_contributions: { teamId, prNumber, authorId, authorLogin, reviewers: [login],
 *                       changedFiles: [{path, additions, deletions}], mergedAt, syncedAt }
 * team_defenses:      same shape as capstone_defenses, keyed by teamId + userId
 * team_evidence:      { teamId, publicId, snapshot, issuedAt }
 * team_ratings:       { teamId, raterId, rateeId, score (1-5), comment, createdAt, updatedAt }
 */

export const TEAMS = "teams";
export const CONTRIBUTIONS = "team_contributions";
export const TEAM_DEFENSES = "team_defenses";
export const TEAM_EVIDENCE = "team_evidence";
export const RATINGS = "team_ratings";

export const TEAM_STATUSES = ["forming", "active", "defending", "completed", "disbanded"];
export const MEMBER_STATUSES = ["invited", "active", "left"];

let indexesReady = null;
export const ensureIndexes = (db) => {
  indexesReady ??= Promise.all([
    // "Find my team" runs on every team page load.
    db.collection(TEAMS).createIndex({ "members.userId": 1, status: 1 }),
    // One team per GitHub repo; sparse so teams without a repo yet don't collide on null.
    db.collection(TEAMS).createIndex({ "repo.id": 1 }, { unique: true, sparse: true }),
    // Re-syncing the same PR must update, never duplicate.
    db.collection(CONTRIBUTIONS).createIndex({ teamId: 1, prNumber: 1 }, { unique: true }),
    db.collection(CONTRIBUTIONS).createIndex({ teamId: 1, authorId: 1 }),
    // A double "start" for the same session collides here.
    db.collection(TEAM_DEFENSES).createIndex({ teamId: 1, userId: 1, sessionNumber: 1 }, { unique: true }),
    db.collection(TEAM_DEFENSES).createIndex({ userId: 1, status: 1 }),
    // One rating per (rater, ratee) pair: re-rating updates instead of duplicating.
    db.collection(RATINGS).createIndex({ teamId: 1, raterId: 1, rateeId: 1 }, { unique: true }),
    // The public id IS the evidence URL, so it must be unique.
    db.collection(TEAM_EVIDENCE).createIndex({ publicId: 1 }, { unique: true }),
    // One evidence doc per team: re-issuing refreshes it and keeps the same link.
    db.collection(TEAM_EVIDENCE).createIndex({ teamId: 1 }, { unique: true }),
  ]).catch((err) => {
    indexesReady = null; // retry on the next request instead of caching a failure
    throw err;
  });
  return indexesReady;
};

export const fail = (status, message, details) => {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  throw err;
};
