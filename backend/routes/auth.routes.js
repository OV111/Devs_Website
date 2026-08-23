import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  signUp,
  login,
  refreshAccessToken,
  logoutUser,
  setRefreshCookie,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
  googleAuth,
  githubRedirect,
  githubLinkRedirect,
  githubDisconnect,
  githubCallback,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/jwtToken.js";
import { redisConnection } from "../config/redis.js";

// Sends the controller's result as JSON but strips the refresh token first —
// it must only ever leave the server as the httpOnly cookie already set by
// the caller, never in a body a script on the page could read.
const respondWithoutRefreshToken = (res, result) => {
  // eslint-disable-next-line no-unused-vars -- intentionally discarded
  const { refreshToken, ...safeResult } = result;
  res.status(result.status ?? result.code ?? 500).json(safeResult);
};

const router = Router();

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 15 * 60; // 15 minutes
const SIGNUP_MAX_ATTEMPTS = 10;
const SIGNUP_WINDOW_SECONDS = 60 * 60; // 1 hour

// express-rate-limit acts as a guaranteed fallback when Redis is disabled.
// When Redis is active the per-IP/per-email Redis counters below take precedence.
const loginLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_SECONDS * 1000,
  max: LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later.", code: 429 },
});

const signupLimiter = rateLimit({
  windowMs: SIGNUP_WINDOW_SECONDS * 1000,
  max: SIGNUP_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many sign-up attempts. Try again later.", code: 429 },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many password reset requests. Try again later.", code: 429 },
});

const getClientIp = (req) =>
  (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .toString()
    .split(",")[0]
    .trim();

/**
 * Increment a Redis counter and set TTL on first increment.
 * Returns the new count.
 */
const redisIncr = async (key, windowSeconds) => {
  if (!redisConnection) return 0;
  const count = await redisConnection.incr(key);
  if (count === 1) await redisConnection.expire(key, windowSeconds);
  return count;
};

/**
 * Returns seconds remaining until the key expires, or 0.
 */
const redisTtl = async (key) => {
  if (!redisConnection) return 0;
  const ttl = await redisConnection.ttl(key);
  return ttl > 0 ? ttl : 0;
};

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and session management
 */

/**
 * @openapi
 * /accept-cookies:
 *   post:
 *     tags: [Auth]
 *     summary: Accept cookies consent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accepted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cookies accepted
 *       400:
 *         description: Bad request
 */
router.post("/accept-cookies", (req, res) => {
  const { accepted } = req.body;
  if (accepted) {
    res.cookie("cookiesAccepted", "true", {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365 * 1000,
      path: "/",
    });
    return res.status(200).json({ message: "Cookies Accepted", code: 200 });
  }
  res.status(400).json({ message: "Bad Request" });
});

/**
 * @openapi
 * /get-started:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post("/get-started", signupLimiter, async (req, res) => {
  try {
    const ip = getClientIp(req);
    const signupKey = `signup:ip:${ip}`;
    const count = redisConnection ? await redisConnection.get(signupKey) : null;
    if (Number(count) >= SIGNUP_MAX_ATTEMPTS) {
      const ttl = await redisTtl(signupKey);
      return res.status(429).set("Retry-After", ttl).json({
        message: "Too many sign-up attempts. Try again later.",
        retryAfter: ttl,
        code: 429,
      });
    }
    const result = await signUp(req.body);
    if (result.status !== 201) {
      await redisIncr(signupKey, SIGNUP_WINDOW_SECONDS);
    } else {
      setRefreshCookie(res, result.refreshToken);
    }
    respondWithoutRefreshToken(res, result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error.", code: 500, error: err.message });
  }
});

/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many failed attempts
 */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const ip = getClientIp(req);
    const email = (req.body.email || "").toLowerCase().trim();
    const ipKey = `login:ip:${ip}`;
    const emailKey = `login:email:${email}`;

    const [ipCount, emailCount] = redisConnection
      ? await Promise.all([redisConnection.get(ipKey), redisConnection.get(emailKey)])
      : [null, null];

    if (
      Number(ipCount) >= LOGIN_MAX_ATTEMPTS ||
      Number(emailCount) >= LOGIN_MAX_ATTEMPTS
    ) {
      const ttl = await redisTtl(
        Number(emailCount) >= LOGIN_MAX_ATTEMPTS ? emailKey : ipKey,
      );
      return res.status(429).set("Retry-After", ttl).json({
        message: `Too many login attempts. Try again in ${Math.ceil(ttl / 60)} minute(s).`,
        retryAfter: ttl,
        code: 429,
      });
    }

    const result = await login(req.body);

    if (result.status === 200) {
      if (redisConnection) await Promise.all([
        redisConnection.del(ipKey),
        redisConnection.del(emailKey),
      ]);
      setRefreshCookie(res, result.refreshToken);
    } else if ([401, 404].includes(result.status)) {
      await Promise.all([
        redisIncr(ipKey, LOGIN_WINDOW_SECONDS),
        redisIncr(emailKey, LOGIN_WINDOW_SECONDS),
      ]);
    }

    respondWithoutRefreshToken(res, result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error.", code: 500, error: err.message });
  }
});

/**
 * @openapi
 * /log-out:
 *   delete:
 *     tags: [Auth]
 *     summary: Logout — revokes the refresh token and clears the cookie
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.delete("/log-out", async (req, res) => {
  try {
    await logoutUser(req.cookies?.[REFRESH_COOKIE_NAME]);
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ message: "Logged out succesfully", code: 200 });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Logout Error", code: 500, error: err.message });
  }
});

/**
 * @openapi
 * /refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange the refresh cookie for a new short-lived access token
 *     responses:
 *       200:
 *         description: Returns a new access token
 *       401:
 *         description: Missing, invalid, expired, or already-used refresh token
 */
router.post("/refresh", async (req, res) => {
  const refreshTokenValue = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshTokenValue) {
    return res.status(401).json({ message: "No refresh token", code: 401 });
  }

  const result = await refreshAccessToken(refreshTokenValue);
  if (result.status !== 200) {
    // Refresh token was invalid/expired/reused — clear it so the client
    // doesn't keep retrying with a cookie that will never work again.
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    return res.status(result.status).json({ message: result.message, code: result.status });
  }

  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ accessToken: result.accessToken });
});

/**
 * @openapi
 * /verify-token:
 *   get:
 *     tags: [Auth]
 *     summary: Verify if a JWT token is valid
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns valid true/false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 */
router.get("/verify-token", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const isValid = verifyToken(token);
  res.status(200).json({ valid: !!isValid });
});

/**
 * @openapi
 * /google/auth:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate with Google OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token
 *     responses:
 *       200:
 *         description: Authentication successful
 *       500:
 *         description: Google auth error
 */
router.post("/google/auth", async (req, res) => {
  try {
    const result = await googleAuth(req.body);
    if (result.status === 200) {
      setRefreshCookie(res, result.refreshToken);
    }
    respondWithoutRefreshToken(res, result);
  } catch (err) {
    res.status(500).json({
      message: "Google Authentication Error",
      code: 500,
      error: err.message,
    });
  }
});

/**
 * @openapi
 * /auth/github:
 *   get:
 *     tags: [Auth]
 *     summary: Redirect to GitHub OAuth
 *     responses:
 *       302:
 *         description: Redirects to GitHub
 * /auth/github/link:
 *   get:
 *     tags: [Auth]
 *     summary: Link GitHub account to existing user
 *     responses:
 *       302:
 *         description: Redirects to GitHub
 * /auth/github/disconnect:
 *   delete:
 *     tags: [Auth]
 *     summary: Disconnect GitHub from account
 *     responses:
 *       200:
 *         description: GitHub disconnected
 * /auth/github/callback:
 *   get:
 *     tags: [Auth]
 *     summary: GitHub OAuth callback
 *     responses:
 *       302:
 *         description: Redirects to frontend
 */
router.get("/auth/github", githubRedirect);
router.get("/auth/github/link", githubLinkRedirect);
router.delete("/auth/github/disconnect", githubDisconnect);
router.get("/auth/github/callback", githubCallback);
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
  const result = await forgotPassword(req.body);
  res.status(result.status).json(result);
});
router.post("/reset-password", passwordResetLimiter, async (req, res) => {
  const result = await resetPassword(req.body);
  res.status(result.status).json(result);
});

export default router;
