import { ObjectId } from "mongodb";
import { resolveActiveLayer, getWeakTopics } from "../lib/activeLayer.js";

/**
 * Challenge read layer.
 *
 * Every query in here is public-facing, so the single most important rule is
 * the projection: `solution` and `hiddenTests` must never leave the server on
 * a browse or detail request. They are stripped here rather than in the
 * controller so a future caller can't forget.
 */

const COL = "challenges";

// Fields the client is allowed to see when browsing a list.
const LIST_PROJECTION = {
  slug: 1,
  trackId: 1,
  layerId: 1,
  type: 1,
  difficulty: 1,
  title: 1,
  summary: 1,
  tags: 1,
  estimatedMins: 1,
  xp: 1,
  "stats.solves": 1,
};

// Fields for the arena. Adds the body of the problem and the starter files,
// still without anything that would give the answer away.
const DETAIL_PROJECTION = {
  ...LIST_PROJECTION,
  description: 1,
  task: 1,
  constraints: 1,
  example: 1,
  starterFiles: 1,
  testFile: 1,
  // hints are returned as metadata only — the text is paid for per-hint in
  // stage 2, so it must not ship with the challenge body.
  "hints.order": 1,
  "hints.cost": 1,
};

const buildMatch = ({ trackId, layerId, type, difficulty, tag, q }) => {
  const match = { status: "published" };

  if (trackId) match.trackId = trackId;
  if (layerId) match.layerId = layerId;
  if (type) match.type = { $in: Array.isArray(type) ? type : [type] };
  if (difficulty) match.difficulty = difficulty;
  if (tag) match.tags = { $in: Array.isArray(tag) ? tag : [tag] };
  if (q) match.$text = { $search: q };

  return match;
};

/**
 * Which of these slugs has this user already solved. A Set, not a query per
 * card — one lookup against challengeResults regardless of how many items are
 * on the page.
 */
const getSolvedSlugs = async (db, userId, slugs) => {
  if (!userId || slugs.length === 0) return new Set();

  const rows = await db
    .collection("challengeResults")
    .find(
      { userId: new ObjectId(userId), challengeId: { $in: slugs }, status: "solved" },
      { projection: { challengeId: 1 } },
    )
    .toArray();

  return new Set(rows.map((r) => r.challengeId));
};

/**
 * Which of these slugs the user has opened but not finished. An attempt row is
 * created the moment the Arena loads, so its existence means "started", and
 * the caller subtracts the solved set to get "still in progress".
 */
const getStartedSlugs = async (db, userId, slugs) => {
  if (!userId || slugs.length === 0) return new Set();

  const rows = await db
    .collection("challenge_attempts")
    .find(
      { userId: new ObjectId(userId), challengeSlug: { $in: slugs } },
      { projection: { challengeSlug: 1 } },
    )
    .toArray();

  return new Set(rows.map((r) => r.challengeSlug));
};

export const listChallengesService = async (db, query, userId) => {
  const page = Math.max(1, +query.page || 1);
  const limit = Math.min(100, Math.max(1, +query.limit || 20));

  const match = buildMatch(query);
  const col = db.collection(COL);

  const [items, total] = await Promise.all([
    col
      .find(match)
      .project(LIST_PROJECTION)
      .sort({ difficulty: 1, "stats.solves": -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    col.countDocuments(match),
  ]);

  const slugs = items.map((i) => i.slug);
  const [solved, started, activeLayer, weakTopics] = await Promise.all([
    getSolvedSlugs(db, userId, slugs),
    getStartedSlugs(db, userId, slugs),
    resolveActiveLayer(db, userId),
    getWeakTopics(db, userId),
  ]);

  const decorated = items.map((item) => {
    const done = solved.has(item.slug);
    return {
      ...item,
      done,
      inProgress: !done && started.has(item.slug),
      // "Recommended" has to mean something a user can act on, so it is
      // narrow on purpose: unsolved, AND either sitting in the layer they are
      // working through right now or covering a topic they have actually
      // failed before. A looser rule would flag most of the catalog, which is
      // the same as flagging none of it.
      hot:
        !done &&
        (item.layerId === activeLayer?.layerId ||
          (item.tags ?? []).some((t) =>
            weakTopics.has(String(t).toLowerCase()),
          )),
    };
  });

  return { items: decorated, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getChallengeBySlugService = async (db, slug, userId) => {
  const challenge = await db
    .collection(COL)
    .findOne({ slug, status: "published" }, { projection: DETAIL_PROJECTION });

  if (!challenge) {
    const err = new Error("Challenge not found");
    err.status = 404;
    throw err;
  }

  const solved = await getSolvedSlugs(db, userId, [slug]);
  return { ...challenge, done: solved.has(slug) };
};

/**
 * Tag counts for the sidebar filter. Scoped by the same filters as the list so
 * the counts always describe what the user is actually looking at.
 */
export const getTagCountsService = async (db, query) => {
  const match = buildMatch(query);

  const [tags, total] = await Promise.all([
    db
      .collection(COL)
      .aggregate([
        { $match: match },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ])
      .toArray(),
    db.collection(COL).countDocuments(match),
  ]);

  return {
    total,
    tags: tags.map(({ _id, count }) => ({ label: _id, count })),
  };
};

/**
 * The user's own solve stats for the catalog hero strip. Deliberately no
 * global rank here — ranking needs a defined scoring rule across every user,
 * which is a separate decision from "what did I personally do."
 */
export const getPersonalStatsService = async (db, userId) => {
  const results = await db
    .collection("challengeResults")
    .find({ userId: new ObjectId(userId) })
    .project({ status: 1, solvedAt: 1 })
    .toArray();

  const solved = results.filter((r) => r.status === "solved");
  const attempted = results.length;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const solvedThisWeek = solved.filter(
    (r) => r.solvedAt && r.solvedAt >= weekAgo,
  ).length;

  // Streak: distinct UTC calendar days with a solve, walked backward from
  // today. A gap of more than one day (i.e. neither today nor yesterday has a
  // solve) breaks it — this is a "keep the streak alive" check, not just a
  // count of solve-days.
  const solveDays = new Set(
    solved
      .filter((r) => r.solvedAt)
      .map((r) => new Date(r.solvedAt).toISOString().slice(0, 10)),
  );
  let streakDays = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  // Today not having a solve yet doesn't break a streak earned yesterday —
  // only start counting from today if it's already been solved, otherwise
  // start the walk from yesterday.
  if (!solveDays.has(cursor.toISOString().slice(0, 10))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (solveDays.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const progress = await db
    .collection("userProgress")
    .findOne({ userId: new ObjectId(userId) }, { projection: { xpTotal: 1 } });

  return {
    solved: solved.length,
    solvedThisWeek,
    attempted,
    accuracy: attempted > 0 ? Math.round((solved.length / attempted) * 100) : 0,
    streakDays,
    xpTotal: progress?.xpTotal ?? 0,
  };
};

/**
 * Daily challenge — deterministic per UTC day, so every user sees the same one
 * and it stays stable across a refresh. Picking by index into a stable sort
 * avoids storing a schedule collection; swap this for a curated schedule later
 * if you want editorial control over which problem lands on which day.
 */
export const getDailyChallengeService = async (db) => {
  const col = db.collection(COL);
  const match = { status: "published" };

  const total = await col.countDocuments(match);
  if (total === 0) return null;

  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);

  const [challenge] = await col
    .find(match)
    .project(LIST_PROJECTION)
    .sort({ slug: 1 })
    .skip(daysSinceEpoch % total)
    .limit(1)
    .toArray();

  return challenge ?? null;
};
