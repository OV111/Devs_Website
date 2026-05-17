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

  await Promise.all([
    follows.deleteMany({ followerId: userId }),
    follows.deleteMany({ followingId: userId }),
    userStats.deleteOne({ userId }),
    users.deleteOne({ _id: userId }),
  ]);
};
