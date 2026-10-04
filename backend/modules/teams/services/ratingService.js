/**
 * Peer ratings: each active member rates each teammate once (1-5 plus an
 * optional short comment) and can change it until the team is completed.
 *
 * Privacy: a member can read the ratings they GAVE, never who gave which rating
 * to someone else. Received ratings are only exposed as an average, and only
 * once at least MIN_RATERS (3) teammates rated them. With only 2 raters, one of
 * them could subtract their own score and learn the other's. The number of raters
 * is never published either (see evidenceService).
 */

import { ObjectId } from "mongodb";
import { RATINGS, TEAMS, ensureIndexes, fail } from "./teamsData.js";

export const MIN_RATERS = 3;

const loadActiveTeam = async (db, teamId, userId) => {
  const team = await db.collection(TEAMS).findOne({ _id: new ObjectId(teamId) });
  const isMember = team?.members.some((m) => m.status === "active" && m.userId.equals(userId));
  if (!isMember) fail(404, "Team not found"); // 404: do not reveal the team to non-members
  return team;
};

export const rateMemberService = async (db, teamId, raterId, rateeId, { score, comment }) => {
  await ensureIndexes(db);
  const team = await loadActiveTeam(db, teamId, raterId);
  if (raterId.equals(rateeId)) fail(400, "You cannot rate yourself");
  if (team.status === "completed" || team.status === "disbanded") fail(409, "Ratings are closed for this team");
  // Ratee may have left: their teammates can still rate the work they did.
  if (!team.members.some((m) => m.userId.equals(rateeId))) fail(404, "That person is not on this team");

  const now = new Date();
  // Unique (teamId, raterId, rateeId): rating twice updates, never duplicates.
  await db.collection(RATINGS).updateOne(
    { teamId: team._id, raterId, rateeId },
    { $set: { score, comment: comment ?? "", updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );
  return { rateeId, score, comment: comment ?? "" };
};

/** The ratings this member has given. */
export const listMyRatingsService = async (db, teamId, userId) => {
  await loadActiveTeam(db, teamId, userId);
  const docs = await db
    .collection(RATINGS)
    .find({ teamId: new ObjectId(teamId), raterId: userId }, { projection: { rateeId: 1, score: 1, comment: 1 } })
    .toArray();
  return docs.map(({ rateeId, score, comment }) => ({ rateeId, score, comment }));
};

/**
 * Average received rating per member, hiding any with fewer than MIN_RATERS
 * ratings. Used by the evidence snapshot (stage 7); no route exposes it.
 */
export const summarizeRatings = async (db, teamId) => {
  const rows = await db
    .collection(RATINGS)
    .aggregate([
      { $match: { teamId: new ObjectId(teamId) } },
      { $group: { _id: "$rateeId", average: { $avg: "$score" }, raters: { $sum: 1 } } },
    ])
    .toArray();
  return new Map(
    rows
      .filter((r) => r.raters >= MIN_RATERS)
      .map((r) => [r._id.toString(), { average: Math.round(r.average * 10) / 10, raters: r.raters }]),
  );
};
