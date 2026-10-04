/**
 * Contribution sync: copy merged PRs from the team's GitHub repo into
 * team_contributions, one document per PR.
 *
 * Only PRs written by a team member count (matched by GitHub login, including
 * members who left, so their history keeps its author). Files and reviewers are
 * fetched only for PRs we have not stored yet, which keeps a re-sync cheap on
 * GitHub's rate limit, and a cap bounds the calls of any single sync.
 */

import { ObjectId } from "mongodb";
import {
  getPullFiles,
  getPullReviewers,
  listMergedPulls,
} from "../../capstone/services/githubClient.js";
import { CONTRIBUTIONS, TEAMS, ensureIndexes, fail } from "./teamsData.js";

const MAX_NEW_PRS_PER_SYNC = 20;

const getTeamWithRepo = async (db, teamId) => {
  const team = await db.collection(TEAMS).findOne({ _id: new ObjectId(teamId) });
  if (!team) fail(404, "Team not found");
  if (!team.repo) fail(409, "Set the team repository first");
  return team;
};

export const syncContributionsService = async (db, teamId) => {
  await ensureIndexes(db);
  const team = await getTeamWithRepo(db, teamId);
  const [owner, repo] = team.repo.fullName.split("/");

  const pulls = await listMergedPulls(owner, repo);
  if (!pulls) fail(400, "Team repository not found or private");

  const memberByLogin = new Map(team.members.map((m) => [m.githubLogin.toLowerCase(), m]));
  const ours = pulls.filter((pr) => pr.authorLogin && memberByLogin.has(pr.authorLogin.toLowerCase()));

  const stored = await db
    .collection(CONTRIBUTIONS)
    .find({ teamId: team._id, prNumber: { $in: ours.map((pr) => pr.number) } }, { projection: { prNumber: 1 } })
    .toArray();
  const known = new Set(stored.map((c) => c.prNumber));
  const fresh = ours.filter((pr) => !known.has(pr.number)).slice(0, MAX_NEW_PRS_PER_SYNC);

  let added = 0;
  for (const pr of fresh) {
    const [files, reviewers] = await Promise.all([
      getPullFiles(owner, repo, pr.number),
      getPullReviewers(owner, repo, pr.number, pr.authorLogin),
    ]);
    const author = memberByLogin.get(pr.authorLogin.toLowerCase());
    const res = await db.collection(CONTRIBUTIONS).updateOne(
      { teamId: team._id, prNumber: pr.number },
      {
        // $setOnInsert: a PR is never rewritten once stored; the unique index
        // makes a concurrent double sync harmless.
        $setOnInsert: {
          teamId: team._id,
          prNumber: pr.number,
          title: pr.title,
          authorId: author.userId,
          authorLogin: pr.authorLogin,
          reviewers,
          changedFiles: files.map(({ path, additions, deletions }) => ({ path, additions, deletions })),
          mergedAt: pr.mergedAt,
          syncedAt: new Date(),
        },
      },
      { upsert: true },
    );
    if (res.upsertedCount) added += 1;
  }

  return {
    added,
    alreadyStored: known.size,
    skippedNotMembers: pulls.length - ours.length,
    deferred: Math.max(0, ours.length - known.size - fresh.length), // over the per-sync cap: sync again
  };
};

export const listContributionsService = (db, teamId) =>
  db
    .collection(CONTRIBUTIONS)
    .find({ teamId: new ObjectId(teamId) })
    .sort({ mergedAt: -1 })
    .limit(200)
    .toArray();
