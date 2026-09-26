import { ObjectId } from "mongodb";
import { resolveActiveLayer, getWeakTopics } from "../lib/activeLayer.js";

/**
 * Per-user progress reads for the catalog sidebar: exam readiness and the
 * leaderboard.
 *
 * Both answer questions that only mean something once a scope is fixed, so
 * both are scoped to the layer the user is currently working through rather
 * than to the whole platform. "Am I ready" and "where do I stand" are
 * questions about the exam you're about to sit, not about everything.
 */

const CHALLENGES = "challenges";
const RESULTS = "challengeResults";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * How much of the current layer's challenge set the user has solved.
 *
 * Returns `{ hasLayer: false }` rather than zeroes when the user has no active
 * path — a 0% ring would read as "you have done nothing", when the truth is
 * "there is nothing to measure against yet".
 */
export const getReadinessService = async (db, userId) => {
  const layer = await resolveActiveLayer(db, userId);
  if (!layer) return { hasLayer: false };

  const [challenges, weakTopics] = await Promise.all([
    db
      .collection(CHALLENGES)
      .find(
        { layerId: layer.layerId, status: "published" },
        { projection: { slug: 1, tags: 1 } },
      )
      .toArray(),
    getWeakTopics(db, userId),
  ]);

  const total = challenges.length;

  const solvedRows =
    total === 0
      ? []
      : await db
          .collection(RESULTS)
          .find(
            {
              userId: new ObjectId(userId),
              challengeId: { $in: challenges.map((c) => c.slug) },
              status: "solved",
            },
            { projection: { challengeId: 1 } },
          )
          .toArray();

  const solved = solvedRows.length;
  const toGo = Math.max(0, total - solved);
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  // Name a topic the user has actually failed before and still has unsolved
  // challenges for. "Solve 3 more on async errors" is actionable in a way that
  // a bare remaining-count never is.
  const solvedSet = new Set(solvedRows.map((r) => r.challengeId));
  const weakMatch = challenges
    .filter((c) => !solvedSet.has(c.slug))
    .flatMap((c) => c.tags ?? [])
    .find((t) => weakTopics.has(String(t).toLowerCase()));

  const message =
    total === 0
      ? `No challenges in ${layer.title} yet.`
      : toGo === 0
        ? `Every challenge in ${layer.title} is solved — you're exam-ready.`
        : weakMatch
          ? `Solve ${toGo} more on ${weakMatch} and you're exam-ready.`
          : `Solve ${toGo} more in ${layer.title} and you're exam-ready.`;

  return {
    hasLayer: true,
    layerId: layer.layerId,
    trackId: layer.trackId,
    layerOrder: layer.order,
    layerTitle: layer.title,
    total,
    solved,
    toGo,
    percent,
    message,
  };
};

const RANGE_DAYS = { "7d": 7, "30d": 30, all: null };

/**
 * Ranked by XP earned from solves inside the window.
 *
 * The scoring rule has to be one sentence a user can check against their own
 * history, so it is exactly that: the sum of `xpEarned` on solved results whose
 * `solvedAt` falls in the window. Deliberately NOT `userProgress.xpTotal` —
 * that pools in exam and roadmap XP which never passed through this page, so
 * ranking on it would make the board unverifiable from the challenge list.
 */
export const getLeaderboardService = async (
  db,
  userId,
  { scope = "layer", range = "7d", limit = 5 } = {},
) => {
  const days = range in RANGE_DAYS ? RANGE_DAYS[range] : 7;
  const layer = scope === "layer" ? await resolveActiveLayer(db, userId) : null;

  const match = { status: "solved" };
  if (days) match.solvedAt = { $gte: new Date(Date.now() - days * DAY_MS) };
  if (layer) match.layer = layer.layerId;

  const ranked = await db
    .collection(RESULTS)
    .aggregate([
      { $match: match },
      {
        $group: {
          _id: "$userId",
          score: { $sum: "$xpEarned" },
          solves: { $sum: 1 },
        },
      },
      // Ties break on solve count, then on id — without that last key the
      // order of equal scores can change between two identical requests.
      { $sort: { score: -1, solves: -1, _id: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "usersStats",
          localField: "_id",
          foreignField: "userId",
          as: "stats",
        },
      },
      {
        $project: {
          score: 1,
          solves: 1,
          username: "$user.username",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          profileImage: { $arrayElemAt: ["$stats.profileImage", 0] },
        },
      },
    ])
    .toArray();

  const me = userId ? String(userId) : null;

  const rows = ranked.map((row, i) => {
    const fullName = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
    return {
      rank: i + 1,
      username: row.username ?? null,
      name: row.username ? `@${row.username}` : fullName || "anonymous",
      initial: (row.firstName?.[0] ?? row.username?.[0] ?? "?").toUpperCase(),
      profileImage: row.profileImage ?? null,
      score: row.score,
      solves: row.solves,
      you: me != null && String(row._id) === me,
    };
  });

  const top = rows.slice(0, limit);

  // Keep the user on the board even when they placed outside the top slice —
  // a leaderboard you can never find yourself on gives you nothing to chase.
  const self = rows.find((r) => r.you);
  if (self && !top.some((r) => r.you)) top.push(self);

  return {
    scope: layer ? "layer" : "global",
    layerId: layer?.layerId ?? null,
    layerOrder: layer?.order ?? null,
    range,
    rows: top,
  };
};
