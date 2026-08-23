import { ObjectId } from "mongodb";
import crypto from "node:crypto";
import { createAccessToken, createRefreshToken, REFRESH_TOKEN_TTL_MS } from "../utils/jwtToken.js";

// Tracks issued refresh tokens by their jti so logout / password-reset can
// actually revoke a session instead of just deleting the client-side copy.
// We store a hash of the jti, never the token itself.

const hashJti = (jti) => crypto.createHash("sha256").update(jti).digest("hex");

/**
 * Issues a fresh access + refresh token pair for a user and records the
 * refresh token's jti as valid until it is used or revoked.
 */
export const issueTokenPair = async (db, userId) => {
  const collection = db.collection("refreshTokens");
  const { token: refreshToken, jti } = createRefreshToken({ id: userId });
  const accessToken = createAccessToken({ id: userId });

  await collection.insertOne({
    userId: new ObjectId(userId),
    jtiHash: hashJti(jti),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return { accessToken, refreshToken };
};

/**
 * Consumes a refresh token's jti: valid only if it hasn't been revoked or
 * already used. Deletes it and issues a new pair (rotation) — this makes a
 * stolen refresh token usable exactly once before it stops working for
 * everyone, including the legitimate owner, which is the signal to revoke
 * the rest of that user's sessions in a future iteration.
 */
export const rotateRefreshToken = async (db, userId, jti) => {
  const collection = db.collection("refreshTokens");
  const jtiHash = hashJti(jti);

  const result = await collection.findOneAndDelete({
    userId: new ObjectId(userId),
    jtiHash,
  });
  const existing = result?.value ?? result;
  if (!existing) return null;

  return issueTokenPair(db, userId);
};

/** Revokes a single refresh token (used on logout). */
export const revokeRefreshToken = async (db, jti) => {
  const collection = db.collection("refreshTokens");
  await collection.deleteOne({ jtiHash: hashJti(jti) });
};

/** Revokes every refresh token for a user (used on password reset). */
export const revokeAllRefreshTokens = async (db, userId) => {
  const collection = db.collection("refreshTokens");
  await collection.deleteMany({ userId: new ObjectId(userId) });
};
