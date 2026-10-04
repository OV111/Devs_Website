import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { getPolar } from "../modules/billing/services/polarClient.js";
import { deleteCloudinaryAssets } from "./cloudinaryCleanup.js";

// Polar statuses that no longer bill. Anything else (active, trialing,
// past_due, unpaid...) must be cancelled before the account disappears.
const NON_BILLING_STATUSES = new Set(["canceled", "incomplete_expired"]);

/**
 * Deleting our `subscriptions` row does not stop Polar charging the card, so
 * the subscription is revoked at the source first. If that fails the deletion
 * is aborted: a visible "try again" is far better than an account that is gone
 * but still being billed with no way left to cancel it.
 */
export async function cancelBillingSubscription(db, userId, getClient = getPolar) {
  const sub = await db.collection("subscriptions").findOne({ userId });
  if (!sub?.polarSubscriptionId || NON_BILLING_STATUSES.has(sub.status)) return;

  try {
    await getClient().subscriptions.revoke(sub.polarSubscriptionId);
  } catch (err) {
    const status = err?.statusCode ?? err?.status;
    // Already gone / already cancelled on Polar's side — nothing left to bill.
    if (status === 404 || /already.*cancel/i.test(err?.message ?? "")) return;
    console.error("Polar revoke failed during account deletion:", err);
    throw {
      status: 502,
      message:
        "We couldn't cancel your subscription, so your account was not deleted. Please try again in a moment.",
    };
  }
}

export const deleteAccountService = async (db, userId, email, password) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");

  const currentUser = await users.findOne({ _id: userId });
  if (!currentUser) throw { status: 404, message: "Current user not found" };
  // Emails are case-insensitive in practice ("Me@x.com" is "me@x.com").
  if (currentUser.email?.toLowerCase() !== email.toLowerCase())
    throw { status: 403, message: "Forbidden: Email does not match current user" };

  // An account without a stored password hash would make bcrypt throw (a 500);
  // treat it as a failed password check instead.
  const isMatch =
    typeof currentUser.password === "string" &&
    (await bcrypt.compare(password, currentUser.password));
  if (!isMatch) throw { status: 401, message: "Unauthorized: Incorrect password" };

  // Read before anything is deleted: the file URLs live in the stats row.
  const stats = await userStats.findOne({ userId });
  const uploadedFiles = [stats?.profileImage, stats?.bannerImage, stats?.cvUrl];

  await cancelBillingSubscription(db, userId);

  const blogs = db.collection("blogs");
  const comments = db.collection("comments");
  const favouriteBlogs = db.collection("favouriteBlogs");
  const notifications = db.collection("notifications");

  const userBlogIds = await blogs.find({ author: userId }, { projection: { _id: 1 } }).toArray();
  const blogIds = userBlogIds.map((b) => b._id);

  await Promise.all([
    follows.deleteMany({ followerId: userId }),
    follows.deleteMany({ followingId: userId }),
    userStats.deleteOne({ userId }),
    comments.deleteMany({ author: userId }),
    favouriteBlogs.deleteMany({ userId }),
    notifications.deleteMany({ targetUserId: userId.toString() }),
    notifications.deleteMany({ actorId: userId.toString() }),
    ...(blogIds.length ? [
      blogs.deleteMany({ author: userId }),
      comments.deleteMany({ blogId: { $in: blogIds } }),
      favouriteBlogs.deleteMany({ blogId: { $in: blogIds } }),
    ] : [blogs.deleteMany({ author: userId })]),
  ]);

  await deleteLearningAndActivityData(db, userId, currentUser.email);

  // The user row goes LAST. These deletes aren't one transaction, so if any
  // earlier step throws, the account must still exist — otherwise the leftover
  // data would be orphaned with no way to retry (the password check needs it).
  await users.deleteOne({ _id: userId });

  // Last and best-effort: the account is already gone, so a Cloudinary outage
  // is logged rather than reported as a failed deletion.
  await deleteCloudinaryAssets(uploadedFiles);
};

// Every collection that stores per-user data keyed by `userId`. The Privacy
// Policy promises that deleting an account removes all of it, so a new
// per-user collection must be added here too — otherwise that promise breaks.
const USER_KEYED_COLLECTIONS = [
  "userProgress",
  "exam_attempts",
  "examHistory",
  "weakSpots",
  "learnerMastery",
  "teach_back_sessions",
  "mentor_teaching_log",
  "agent_sessions",
  "agent_usage",
  "challenge_attempts",
  "challengeResults",
  "savedLibraryResources",
  "usernameHistory",
  "userEvents",
  "refreshTokens",
  "passwordResets",
  "capstone_attempts",
  "capstone_submissions",
  "submission_usage",
  "subscriptions",
  // Public, verifiable credentials that carry the learner's name. The Privacy
  // Policy promises full removal, so they go too (their share links stop working).
  "certificates",
  // Build Teams, XP and recruiter visibility (added with those features).
  "team_defenses",
  "xpAwards",
  "recruiter_settings",
];

/**
 * Team data is not keyed by `userId` alone: ratings point at the user as rater
 * OR ratee, contributions at `authorId`, and the user appears inside a team's
 * `members` array and inside the public evidence snapshot (which carries their
 * name and GitHub login). All of it goes, otherwise a deleted user's name would
 * stay on a public /evidence page.
 */
async function deleteTeamData(db, userId) {
  const teams = await db
    .collection("teams")
    .find({ "members.userId": userId }, { projection: { members: 1 } })
    .toArray();
  for (const team of teams) {
    const login = team.members.find((m) => m.userId.equals(userId))?.githubLogin;
    if (login) {
      await db
        .collection("team_evidence")
        .updateOne({ teamId: team._id }, { $pull: { "snapshot.members": { githubLogin: login } } });
    }
  }
  await Promise.all([
    db.collection("teams").updateMany({ "members.userId": userId }, { $pull: { members: { userId } } }),
    db.collection("team_ratings").deleteMany({ $or: [{ raterId: userId }, { rateeId: userId }] }),
    db.collection("team_contributions").deleteMany({ authorId: userId }),
  ]);
}

async function deleteLearningAndActivityData(db, userId, email) {
  // Some collections store the id as an ObjectId, others as a string
  // (chat, notifications). Matching both keeps one missed type from silently
  // leaving data behind.
  const ids = [userId, userId.toString()];

  // Defenses and reviews hang off a capstone attempt, not the user directly,
  // so their ids have to be read before the attempts are deleted.
  const attemptIds = (
    await db.collection("capstone_attempts").find({ userId }, { projection: { _id: 1 } }).toArray()
  ).map((a) => a._id);

  await deleteTeamData(db, userId);

  await Promise.all([
    ...(attemptIds.length
      ? [
          db.collection("capstone_defenses").deleteMany({ attemptId: { $in: attemptIds } }),
          db.collection("capstone_reviews").deleteMany({ attemptId: { $in: attemptIds } }),
        ]
      : []),
    // Chat blocks in either direction, and this user's per-room mute/clear state.
    db.collection("blocks").deleteMany({
      $or: [{ blockerId: userId.toString() }, { blockedId: userId.toString() }],
    }),
    db.collection("rooms").updateMany(
      { [`memberSettings.${userId}`]: { $exists: true } },
      { $unset: { [`memberSettings.${userId}`]: "" } },
    ),
    ...USER_KEYED_COLLECTIONS.map((name) =>
      db.collection(name).deleteMany({ userId: { $in: ids } }),
    ),
    // Chat: the user's own messages go; rooms stay for the other members.
    db.collection("messages").deleteMany({ senderId: { $in: ids } }),
    db.collection("rooms").updateMany(
      { members: userId.toString() },
      { $pull: { members: userId.toString() } },
    ),
    db.collection("contact_messages").deleteMany({ email }),
  ]);
}
