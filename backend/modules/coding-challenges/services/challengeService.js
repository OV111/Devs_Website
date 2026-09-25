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

export const listChallengesService = async (db, query) => {
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

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getChallengeBySlugService = async (db, slug) => {
  const challenge = await db
    .collection(COL)
    .findOne({ slug, status: "published" }, { projection: DETAIL_PROJECTION });

  if (!challenge) {
    const err = new Error("Challenge not found");
    err.status = 404;
    throw err;
  }

  return challenge;
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
