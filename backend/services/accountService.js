import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const deleteAccountService = async (db, userId, email, password) => {
  const users = db.collection("users");
  const userStats = db.collection("usersStats");
  const follows = db.collection("follows");

  const currentUser = await users.findOne({ _id: userId });
  if (!currentUser) throw { status: 404, message: "Current user not found" };
  if (currentUser.email !== email)
    throw { status: 403, message: "Forbidden: Email does not match current user" };

  const isMatch = await bcrypt.compare(password, currentUser.password);
  if (!isMatch) throw { status: 401, message: "Unauthorized: Incorrect password" };

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
    users.deleteOne({ _id: userId }),
  ]);

  await deleteLearningAndActivityData(db, userId, currentUser.email);
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
];

async function deleteLearningAndActivityData(db, userId, email) {
  // Some collections store the id as an ObjectId, others as a string
  // (chat, notifications). Matching both keeps one missed type from silently
  // leaving data behind.
  const ids = [userId, userId.toString()];

  await Promise.all([
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
