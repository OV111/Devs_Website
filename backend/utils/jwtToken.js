import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import process from "process";

// Access tokens are short-lived and held in memory by the client.
// Refresh tokens are long-lived, httpOnly-cookie only, and revocable via the
// refreshTokens collection (see services/refreshTokenService.js).
export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const getAccessSecret = () => {
  const secret = process.env.JWT_Secret;
  if (!secret) throw new Error("JWT_Secret is not set");
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
  return secret;
};

/**
 * Fails fast at boot rather than at the first login attempt.
 * Called from server.js.
 */
export const assertJwtSecrets = () => {
  getAccessSecret();
  getRefreshSecret();
};

export const createAccessToken = (user) =>
  jwt.sign({ id: String(user.id), type: "access" }, getAccessSecret(), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

/**
 * Returns the signed token plus the jti, so the caller can persist the jti
 * for revocation. The jti — not the token — is what we store.
 */
export const createRefreshToken = (user) => {
  const jti = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(
    { id: String(user.id), type: "refresh", jti },
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_TTL_MS / 1000 },
  );
  return { token, jti };
};

/**
 * Verifies signature, expiry, and that the token is an *access* token.
 * A refresh token presented here is rejected.
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, getAccessSecret());
    if (decoded.type !== "access") return null;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, getRefreshSecret());
    if (decoded.type !== "refresh" || !decoded.jti) return null;
    return decoded;
  } catch {
    return null;
  }
};

// Existing controllers and the WebSocket handler import `verifyToken`.
// It stays the single verification entry point for access tokens — no
// duplicated verification logic anywhere in the codebase.
export const verifyToken = verifyAccessToken;
