import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import { createToken } from "../utils/jwtToken.js";

const sanitizeUsername = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);

const uniqueSuffix = () =>
  `${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")}`;

const hashPassword = async (password) => {
  const saltRounds = 13;
  const hashedPasswd = await bcrypt.hash(password, saltRounds);
  return hashedPasswd;
};
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const buildDefaultUserStats = (userId) => ({
  userId,
  followersCount: 0,
  followingsCount: 0,
  postsCount: 0,
  bio: "",
  githubLink: "",
  linkedinLink: "",
  twitterLink: "",
  location: "",
  profileImage: "",
  bannerImage: "",
  // likesReceived: 0,
  // commentsCount: 0,
  // badges: [],
  // devs-coins: null || 0,
  lastActive: new Date(),
});

const signUp = async (data) => {
  try {
    let db = await connectDB();
    const { firstName, lastName, email, password, username } = data;

    const users = db.collection("users");
    const usersStats = db.collection("usersStats");

    const existedUser = await users.findOne({ email });
    if (existedUser) {
      return {
        status: 409,
        message: "User with that Email already registered",
      };
    }

    const baseUsername =
      sanitizeUsername(username) ||
      sanitizeUsername(`${firstName}${lastName}`) ||
      "dev";
    let finalUsername = `${baseUsername}_${uniqueSuffix()}`;

    // Retry if there is a collision with an existing username.
    while (await users.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}_${uniqueSuffix()}`;
    }

    const result = await users.insertOne({
      firstName,
      lastName,
      username: finalUsername,
      email,
      password: await hashPassword(password),
      // confirmPassword,
    });
    // here also insert userStats (with default starting values )
    await usersStats.insertOne(buildDefaultUserStats(result.insertedId));

    const token = createToken({ id: result.insertedId });

    return {
      status: 201,
      message: "Account created Successfully",
      token,
    };
  } catch (err) {
    console.error(err);
    return { code: 500, message: "Sign Up failed", error: err.message };
  }
};

const login = async (data) => {
  let db = await connectDB();
  const { email, password } = data;
  const users = db.collection("users");
  const usersStats = db.collection("usersStats");
  const user = await users.findOne({ email });
  // const decoded = verifyToken(localStorage.getItem("JWT"))
  // if !decoded return 403 forbidden

  if (!user) {
    return {
      status: 404,
      message: "User is not Found!",
    };
  }
  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    return {
      status: 401,
      message: "Password is incorrect",
    };
  }
  const defaultStatsOnInsert = buildDefaultUserStats(user._id);
  delete defaultStatsOnInsert.lastActive;
  await usersStats.updateOne(
    { userId: user._id },
    {
      $setOnInsert: defaultStatsOnInsert,
      $set: { lastActive: new Date() },
    },
    { upsert: true },
  );
  // localStorage.setItem("user", user);
  const token = createToken({ id: user._id });
  return {
    status: 200,
    message: "Login Successful",
    token,
    userId: user._id,
  };
};

export { signUp, login };
