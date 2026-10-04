/**
 * Team evidence: a public, link-only page that shows what a team built and what
 * each member could defend.
 *
 * - The admin issues it (team 1 is run by hand, and issuing is also the consent
 *   step: names go public only when the admin publishes).
 * - It is a SNAPSHOT, copied at issue time. Re-issuing refreshes the snapshot
 *   but keeps the same publicId, so a link already shared never breaks.
 * - Public view contains no internal ids, emails, questions or answers: only
 *   names, GitHub logins, PR counts, code-change totals, the best defense
 *   score and an averaged peer rating (hidden below MIN_RATERS).
 */

import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { CONTRIBUTIONS, TEAM_EVIDENCE, TEAMS, TEAM_DEFENSES, ensureIndexes, fail } from "./teamsData.js";
import { summarizeRatings } from "./ratingService.js";

const newPublicId = () => randomBytes(9).toString("base64url"); // 12 chars, 72 bits

const displayName = (u) => [u?.firstName, u?.lastName].filter(Boolean).join(" ") || u?.username || "Member";

const buildSnapshot = async (db, team) => {
  const memberIds = team.members.map((m) => m.userId);
  const [users, contributions, defenses, ratings] = await Promise.all([
    db
      .collection("users")
      .find({ _id: { $in: memberIds } }, { projection: { firstName: 1, lastName: 1, username: 1 } })
      .toArray(),
    db.collection(CONTRIBUTIONS).find({ teamId: team._id }).toArray(),
    // A session flagged for prompt injection never feeds a public page; an admin
    // reviews it first (flags are stored on the session).
    db.collection(TEAM_DEFENSES).find({ teamId: team._id, status: "graded", "flags.0": { $exists: false } }).toArray(),
    summarizeRatings(db, team._id),
  ]);
  const userById = new Map(users.map((u) => [u._id.toString(), u]));

  return {
    team: { name: team.name, trackId: team.trackId, status: team.status, repoUrl: team.repo?.url ?? null },
    members: team.members.map((m) => {
      const id = m.userId.toString();
      const mine = contributions.filter((c) => c.authorId.equals(m.userId));
      const files = mine.flatMap((c) => c.changedFiles);
      // Only a PASSED defense is published: evidence shows what a person
      // proved, not every failed attempt on the way.
      const best = defenses
        .filter((d) => d.userId.equals(m.userId) && d.result.passed)
        .reduce((top, d) => (!top || d.result.score > top.score ? d.result : top), null);
      return {
        name: displayName(userById.get(id)),
        githubLogin: m.githubLogin,
        active: m.status === "active",
        mergedPulls: mine.length,
        reviewsGiven: contributions.filter((c) => c.reviewers.some((r) => r.toLowerCase() === m.githubLogin.toLowerCase())).length,
        additions: files.reduce((n, f) => n + f.additions, 0),
        deletions: files.reduce((n, f) => n + f.deletions, 0),
        defense: best ? { score: best.score, passed: true } : null,
        peerRating: ratings.has(id) ? { average: ratings.get(id).average } : null, // average only: the rater count would help identify raters
      };
    }),
    totals: {
      mergedPulls: contributions.length,
      defensesPassed: new Set(defenses.filter((d) => d.result.passed).map((d) => d.userId.toString())).size,
    },
  };
};

export const issueEvidenceService = async (db, adminId, teamId) => {
  await ensureIndexes(db);
  const team = await db.collection(TEAMS).findOne({ _id: new ObjectId(teamId) });
  if (!team) fail(404, "Team not found");
  if (!team.repo) fail(409, "Set the team repository first");

  const snapshot = await buildSnapshot(db, team);
  const now = new Date();
  // One evidence doc per team (unique teamId index). publicId is set only on
  // first insert; a publicId collision is astronomically unlikely, and the
  // unique index would turn it into an E11000 we simply retry once.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await db.collection(TEAM_EVIDENCE).updateOne(
        { teamId: team._id },
        {
          $set: { snapshot, updatedAt: now, issuedBy: new ObjectId(adminId) },
          $setOnInsert: { publicId: newPublicId(), issuedAt: now, revoked: false },
        },
        { upsert: true },
      );
      break;
    } catch (err) {
      if (err.code !== 11000 || attempt === 1) throw err;
    }
  }
  const doc = await db.collection(TEAM_EVIDENCE).findOne({ teamId: team._id });
  return { publicId: doc.publicId, path: `/evidence/${doc.publicId}`, revoked: doc.revoked };
};

export const setEvidenceRevokedService = async (db, teamId, revoked) => {
  const res = await db
    .collection(TEAM_EVIDENCE)
    .findOneAndUpdate({ teamId: new ObjectId(teamId) }, { $set: { revoked, updatedAt: new Date() } }, { returnDocument: "after" });
  return res ? { publicId: res.publicId, revoked: res.revoked } : fail(404, "No evidence has been issued for this team");
};

/** The public, unauthenticated record. Revoked and unknown ids look identical. */
export const getPublicEvidenceService = async (db, publicId) => {
  const doc = await db.collection(TEAM_EVIDENCE).findOne({ publicId });
  if (!doc || doc.revoked) fail(404, "Evidence not found");
  return { publicId: doc.publicId, issuedAt: doc.issuedAt, updatedAt: doc.updatedAt, ...doc.snapshot };
};
