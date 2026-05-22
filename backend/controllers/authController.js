import process from "node:process";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import connectDB from "../config/db.js";
import { createToken, verifyToken } from "../utils/jwtToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitizeUsername = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);

const findUniqueUsername = async (users, base) => {
  if (!(await users.findOne({ username: base }))) return base;
  let i = 1;
  while (await users.findOne({ username: `${base}${i}` })) i++;
  return `${base}${i}`;
};

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
    const finalUsername = await findUniqueUsername(users, baseUsername);

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
      const finalUsername = await findUniqueUsername(users, baseUsername);
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

const githubLinkRedirect = (req, res) => {
  const { token } = req.query;
  const state = Buffer.from(token || "").toString("base64");
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&state=${state}`;
  res.redirect(url);
};

const githubDisconnect = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const verified = verifyToken(token);
    if (!verified) return res.status(401).json({ message: "Unauthorized" });

    const db = await connectDB();
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(verified.id) },
      { $unset: { githubId: "", githubLogin: "" } },
    );
    res.json({ message: "GitHub disconnected" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
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
    const { id: githubId, login: githubLogin } = userData;

    const db = await connectDB();
    const users = db.collection("users");
    const usersStats = db.collection("usersStats");

    // Link mode: state is a base64-encoded JWT from an already-logged-in user
    if (state) {
      try {
        const existingToken = Buffer.from(state, "base64").toString();
        const verified = verifyToken(existingToken);
        if (verified) {
          await users.updateOne(
            { _id: new ObjectId(verified.id) },
            { $set: { githubId, githubLogin } },
          );
          return res.redirect(
            `${process.env.FRONTEND_URL}/oauth-success?token=${existingToken}&linked=github`,
          );
        }
      } catch {
        // fall through to sign-in mode
      }
    }

    // Sign-in mode
    let user = await users.findOne({
      $or: [{ githubId }, { email: primaryEmail }],
    });
    if (!user) {
      const baseUsername = sanitizeUsername(githubLogin) || "dev";
      const finalUsername = await findUniqueUsername(users, baseUsername);
      const result = await users.insertOne({
        username: finalUsername,
        email: primaryEmail,
        githubId,
        githubLogin,
        provider: "github",
        password: null,
      });
      await usersStats.insertOne(buildDefaultUserStats(result.insertedId));
      user = { _id: result.insertedId };
    }
    const jwt = createToken({ id: user._id });
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${jwt}`);
  } catch (err) {
    console.log(err);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-failure`);
  }
};

const forgotPassword = async (data) => {
  try {
    const db = await connectDB();
    const { email } = data;
    const users = db.collection("users");
    const passwordResets = db.collection("passwordResets");
    const user = await users.findOne({ email });
    if (!user)
      return {
        status: 200,
        message: "If email exists,a reset link has been sent.",
      };

    await passwordResets.deleteMany({ userId: user._id });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await passwordResets.insertOne({ userId: user._id, tokenHash, expiresAt });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(email, resetUrl);
    return {
      status: 200,
      message: "If email exists,a reset link has been sent.",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "Something went wrong.",
      error: err.message,
    };
  }
};

const resetPassword = async (data) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const { token, newPassword } = data;
    const passwordResets = db.collection("passwordResets");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    // check if token is valid
    const record = await passwordResets.findOne({ tokenHash });

    if (!record || record.expiresAt < new Date()) {
      return { status: 400, message: "Reset link is invalid or has expired." };
    }

    await users.updateOne(
      { _id: record.userId },
      { $set: { password: await hashPassword(newPassword) } },
    );
    await passwordResets.deleteOne({ tokenHash });
    return { status: 200, message: "Password updated successfully." };
  } catch (err) {
    console.log(err);
    return { status: 500, message: "Server error", error: err.message };
  }
};

export {
  signUp,
  login,
  googleAuth,
  githubRedirect,
  githubLinkRedirect,
  githubDisconnect,
  githubCallback,
  forgotPassword,
  resetPassword,
};
