import process from "node:process";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import connectDB from "../config/db.js";
import { verifyToken, verifyRefreshToken } from "../utils/jwtToken.js";
import {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "../services/refreshTokenService.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days — matches REFRESH_TOKEN_TTL_MS

// Single source of truth for refresh-cookie options — auth.routes.js reuses
// this for the initial login/signup cookie and for clearing it on logout,
// so the flags can never drift between "set" and "clear".
export const REFRESH_COOKIE_NAME = "refreshToken";
// SameSite=None requires Secure on every modern browser — there is no
// "insecure None" mode, so this cannot be conditional on NODE_ENV the way
// the old `secure: false` session cookie was. Chrome/Edge treat
// http://localhost as a secure context, so `Secure` cookies still work in
// local dev; this does NOT work over a plain http:// LAN/tunnel URL.
export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });
};

// In-memory CSRF nonce store for the GitHub OAuth redirect round-trip.
// Doubles as the identity carrier for "link GitHub to my existing account":
// linkUserId is set only when the redirect was initiated by an already
// logged-in user (proven via their refresh cookie, not a client-supplied
// token) — this replaces putting a JWT in the query string / state param.
// Use Redis in production for multi-instance deployments.
const pendingOAuthNonces = new Map();
const NONCE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const createOAuthNonce = (linkUserId = null) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  pendingOAuthNonces.set(nonce, { expiresAt: Date.now() + NONCE_TTL_MS, linkUserId });
  return nonce;
};

/** Returns the nonce record ({ linkUserId }) if valid, or null. */
const consumeOAuthNonce = (nonce) => {
  if (!nonce) return null;
  const record = pendingOAuthNonces.get(nonce);
  pendingOAuthNonces.delete(nonce);
  if (!record || Date.now() > record.expiresAt) return null;
  return record;
};

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

    const { accessToken, refreshToken } = await issueTokenPair(db, result.insertedId);

    return {
      status: 201,
      message: "Account created Successfully",
      accessToken,
      refreshToken,
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
  const { accessToken, refreshToken } = await issueTokenPair(db, user._id);
  return {
    status: 200,
    message: "Login Successful",
    accessToken,
    refreshToken,
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

    const { accessToken, refreshToken } = await issueTokenPair(db, user._id);
    return {
      status: 200,
      message: "Google Authentication Successful",
      accessToken,
      refreshToken,
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
  const nonce = createOAuthNonce();
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&state=${nonce}`;
  res.redirect(url);
};

const githubLinkRedirect = (req, res) => {
  // Identity comes from the httpOnly refresh cookie (sent automatically on
  // this same-site top-level navigation) — never from a client-supplied
  // token in the URL, which would leak into logs/history/Referer headers.
  const decoded = verifyRefreshToken(req.cookies?.refreshToken);
  if (!decoded) {
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?reason=unauthenticated`);
  }

  const nonce = createOAuthNonce(decoded.id);
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&state=${nonce}`;
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

    // state is always a nonce from createOAuthNonce — link mode and sign-in
    // mode differ only in whether that nonce carries a linkUserId (proven
    // earlier via the requester's own refresh cookie in githubLinkRedirect).
    const nonceRecord = consumeOAuthNonce(state);
    if (!nonceRecord) {
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure?reason=csrf`);
    }

    if (nonceRecord.linkUserId) {
      await users.updateOne(
        { _id: new ObjectId(nonceRecord.linkUserId) },
        { $set: { githubId, githubLogin } },
      );
      setRefreshCookie(res, (await issueTokenPair(db, nonceRecord.linkUserId)).refreshToken);
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?linked=github`);
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
    const { refreshToken } = await issueTokenPair(db, user._id);
    setRefreshCookie(res, refreshToken);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
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
    // A password reset means the user believes their credentials — or an
    // active session — may be compromised. Kill every outstanding refresh
    // token so a stolen one stops working immediately instead of surviving
    // up to its remaining lifetime.
    await revokeAllRefreshTokens(db, record.userId);
    return { status: 200, message: "Password updated successfully." };
  } catch (err) {
    console.log(err);
    return { status: 500, message: "Server error", error: err.message };
  }
};

/**
 * Exchanges a valid, unused refresh token (from the httpOnly cookie) for a
 * new access + refresh token pair, rotating the refresh token in the
 * process. Route handler is responsible for reading/writing the cookie.
 */
const refreshAccessToken = async (refreshTokenValue) => {
  const decoded = verifyRefreshToken(refreshTokenValue);
  if (!decoded) return { status: 401, message: "Invalid or expired refresh token" };

  const db = await connectDB();
  const pair = await rotateRefreshToken(db, decoded.id, decoded.jti);
  if (!pair) return { status: 401, message: "Refresh token was already used or revoked" };

  return { status: 200, accessToken: pair.accessToken, refreshToken: pair.refreshToken };
};

/** Revokes the refresh token tied to the presented cookie, if any. */
const logoutUser = async (refreshTokenValue) => {
  if (!refreshTokenValue) return { status: 200, message: "Logged out successfully" };

  const decoded = verifyRefreshToken(refreshTokenValue);
  if (decoded) {
    const db = await connectDB();
    await revokeRefreshToken(db, decoded.jti);
  }
  return { status: 200, message: "Logged out successfully" };
};

export {
  signUp,
  login,
  refreshAccessToken,
  logoutUser,
  setRefreshCookie,
  googleAuth,
  githubRedirect,
  githubLinkRedirect,
  githubDisconnect,
  githubCallback,
  forgotPassword,
  resetPassword,
};
