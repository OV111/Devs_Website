import process from "node:process";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import { createToken } from "../utils/jwtToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const googleAuth = async (data) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const usersStats = db.collection("usersStats");
    const { tokenId } = data; // this maybe tokenId from front i need to check
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name, sub: googleId } = payload;

    let user = await users.findOne({ email });
    if (!user) {
      const baseUsername =
        sanitizeUsername(given_name) ||
        sanitizeUsername(`${given_name}${family_name}`) ||
        "dev";
      let finalUsername = `${baseUsername}_${uniqueSuffix()}`;
      while (await users.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}_${uniqueSuffix()}`;
      }
      const result = await users.insertOne({
        firstName: given_name,
        lastName: family_name,
        username: finalUsername,
        email,
        password: null,
        googleId,
        provider: "google",
      });
      await usersStats.insertOne(buildDefaultUserStats(result.insertedId));
      user = await users.findOne({ _id: result.insertedId });
    }

    const token = createToken({ id: user._id });
    return {
      status: 200,
      message: "Google Authentication Successful",
      token,
      userId: user._id,
    };
  } catch {
    return {
      status: 500,
      message: "Google Authentication Failed",
    };
  }
};

const githubRedirect = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(url);
};

const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await userRes.json();
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emailData = await emailRes.json();

    const emails = Array.isArray(emailData) ? emailData : [];

    const primaryEmail =
      emails.find((e) => e.primary && e.verified)?.email || null;
    const { id: githubId, login } = userData;

    const db = await connectDB();
    const users = db.collection("users");
    const usersStats = db.collection("usersStats");
    let user = await users.findOne({
      $or: [{ githubId }, { email: primaryEmail }],
    });
    if (!user) {
      const baseUsername = sanitizeUsername(login) || "dev";
      let finalUsername = `${baseUsername}_${uniqueSuffix()}`;
      while (await users.findOne({ username: finalUsername })) {
        finalUsername = `${baseUsername}_${uniqueSuffix()}`;
      }
      const result = await users.insertOne({
        username: finalUsername,
        email: primaryEmail,
        githubId,
        provider: "github",
        password: null,
      });
      await usersStats.insertOne(buildDefaultUserStats(result.insertedId));
      user = { _id: result.insertedId };
    }
    const jwt = createToken({ id: user._id });
    res.redirect(`http://localhost:5173/oauth-success?token=${jwt}`);
  } catch (err) {
    console.log(err);
    res.redirect("http://localhost:5173/oauth-failure");
  }
};

export { signUp, login, googleAuth, githubRedirect, githubCallback };
