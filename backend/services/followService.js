import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/jwtToken.js";

export const getAuthToken = (authorization = "") => {
  if (!authorization.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 403,
      message: "Missing or invalid auth header",
    };
  }
  const token = authorization.slice(7).trim();
  if (!token) {
    return { ok: false, status: 403, message: "Token is required" };
  }
  try {
    const payload = verifyToken(token);
    if (!payload?.id) {
      return { ok: false, status: 403, message: "Invalid token payload" };
    }

    return {
      ok: true,
      status: 200,
      userId: payload.id,
      userObjectId: new ObjectId(payload.id),
      payload,
    };
  } catch {
    return { ok: false, status: 403, message: "Invalid or expired token" };
  }
};

// What a connection row may expose about ANOTHER user. An explicit allow-list:
// `{ password: 0 }` (the old projection) shipped every other field — email,
// OAuth ids, internal flags — to anyone who had this user as a follower.
const SAFE_USER_FIELDS = { firstName: 1, lastName: 1, username: 1 };

const EMPTY_PAGE = { followersCount: 0, followingCount: 0, page: 1, limit: 25, total: 0, hasMore: false };

const normalizePaging = (page, limit) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 25, 1), 25);
  return { normalizedPage, normalizedLimit, skip: (normalizedPage - 1) * normalizedLimit };
};

/**
 * Users (safe fields) + their stats for `ids`, in the SAME order as `ids`,
 * each tagged with the follow edge's date and how it relates to the viewer.
 * `relation` is a Set of id strings for the ONE direction the list does not
 * already guarantee (`relationKey`); the other direction is `always`.
 */
const hydrate = async ({ db, docs, idKey, relation, relationKey, always }) => {
  const ids = docs.map((d) => d[idKey]);
  if (ids.length === 0) return [];

  const [users, statsArr] = await Promise.all([
    db.collection("users").find({ _id: { $in: ids } }, { projection: SAFE_USER_FIELDS }).toArray(),
    db.collection("usersStats").find({ userId: { $in: ids } }).toArray(),
  ]);
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const statsMap = new Map(statsArr.map((st) => [st.userId?.toString(), st]));

  return docs
    .map((doc) => {
      const user = userMap.get(String(doc[idKey]));
      if (!user) return null;
      const known = relation.has(String(user._id));
      return {
        ...user,
        stats: statsMap.get(String(user._id)) ?? null,
        followedAt: doc.createdAt ?? null,
        // The list guarantees one direction; the other comes from `relation`.
        youFollow: relationKey === "youFollow" ? known : always,
        followsYou: relationKey === "followsYou" ? known : always,
      };
    })
    .filter(Boolean);
};

/** Of `ids`, which does `fn` say have a follow edge? One query per page, not one per row. */
const edgeSet = async (follows, filter, pick) => {
  const rows = await follows.find(filter).toArray();
  return new Set(rows.map((r) => String(r[pick])));
};

export const getFollowersData = async ({ userId, db, page, limit }) => {
  if (!userId) return { followers: [], ...EMPTY_PAGE };
  const { normalizedPage, normalizedLimit, skip } = normalizePaging(page, limit);
  const follows = db.collection("follows");

  const followerDocs = await follows
    .find({ followingId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)
    .toArray();
  const followerIds = followerDocs.map((doc) => doc.followerId);

  const followersCount = await follows.countDocuments({ followingId: userId });
  const followingCount = await follows.countDocuments({ followerId: userId });

  // Do I follow them back? (everyone in this list follows me)
  const iFollow = followerIds.length
    ? await edgeSet(follows, { followerId: userId, followingId: { $in: followerIds } }, "followingId")
    : new Set();

  const followers = await hydrate({
    db,
    docs: followerDocs,
    idKey: "followerId",
    relation: iFollow,
    relationKey: "youFollow",
    always: true,
  });

  return {
    followers,
    followersCount,
    followingCount,
    page: normalizedPage,
    limit: normalizedLimit,
    total: followersCount,
    hasMore: skip + followers.length < followersCount,
  };
};

export const getFollowingData = async ({ userId, db, page, limit }) => {
  if (!userId) return { following: [], ...EMPTY_PAGE };
  const { normalizedPage, normalizedLimit, skip } = normalizePaging(page, limit);
  const follows = db.collection("follows");

  const followingDocs = await follows
    .find({ followerId: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)
    .toArray();
  const followingIds = followingDocs.map((doc) => doc.followingId);

  const followingCount = await follows.countDocuments({ followerId: userId });
  const followersCount = await follows.countDocuments({ followingId: userId });

  // Do they follow me back? (I follow everyone in this list)
  const followBack = followingIds.length
    ? await edgeSet(follows, { followerId: { $in: followingIds }, followingId: userId }, "followerId")
    : new Set();

  const following = await hydrate({
    db,
    docs: followingDocs,
    idKey: "followingId",
    relation: followBack,
    relationKey: "followsYou",
    always: true,
  });

  return {
    following,
    followersCount,
    followingCount,
    page: normalizedPage,
    limit: normalizedLimit,
    total: followingCount,
    hasMore: skip + following.length < followingCount,
  };
};
