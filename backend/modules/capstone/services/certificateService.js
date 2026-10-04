/**
 * Capstone certificates (stage 5).
 *
 * A certificate is an immutable SNAPSHOT taken when the capstone is passed:
 * the brief, the repo and pinned commit, the scores. Editing a brief or
 * re-running anything later can never change what a certificate says.
 * The only mutable fields are `revokedAt` / `revokedReason` (admin, stage 7).
 *
 * Issuing is idempotent (unique index on userId + trackId) and is retried on
 * every status read, so a crash after "attempt passed" heals itself, and a
 * learner who could not get one while billing was enforced gets it the moment
 * they have access.
 *
 * Wording is deliberately honest: "AI-reviewed", never "verified" or
 * "proctored" — a typed defense can be helped by another AI, so we do not
 * claim more than the process proves (see docs/EXAM_INTEGRITY.md).
 */

import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { canAccess } from "../../billing/index.js";
import { BRIEFS, CERTIFICATES, REVIEWS, SUBMISSIONS } from "./capstoneData.js";

export const ASSESSMENT_METHOD =
  "The learner's own public GitHub repository was reviewed by an AI against a fixed, " +
  "weighted rubric at the exact commit shown, then the learner answered timed, typed " +
  "questions about their own code. Not proctored.";

// 9 random bytes → 12 base64url characters (72 bits): unguessable, URL-safe, short.
const newPublicId = () => randomBytes(9).toString("base64url");
export const PUBLIC_ID_PATTERN = /^[A-Za-z0-9_-]{12}$/;

/**
 * Issue the certificate for a passed attempt, or return the existing one.
 * @returns {Promise<object|{locked:true}|null>} null if the attempt has not passed
 */
export const ensureCertificate = async (db, userId, attempt) => {
  if (attempt?.status !== "passed") return null;
  const ownerId = new ObjectId(userId);

  const existing = await db.collection(CERTIFICATES).findOne({ userId: ownerId, trackId: attempt.trackId });
  if (existing) return existing;

  // Certificates are a Pro feature; while BILLING_ENFORCED is off this is
  // always true. Not issuing (rather than issuing a hidden one) keeps the
  // snapshot date honest: issuedAt is when they actually received it.
  if (!(await canAccess(db, userId, "pro"))) return { locked: true };

  const [user, track, brief, submission, review] = await Promise.all([
    db.collection("users").findOne({ _id: ownerId }, { projection: { firstName: 1, lastName: 1, username: 1 } }),
    db.collection("roadmap_tracks").findOne({ trackId: attempt.trackId }, { projection: { title: 1 } }),
    db.collection(BRIEFS).findOne({ _id: attempt.briefId }),
    db.collection(SUBMISSIONS).findOne({ _id: attempt.submissionId }),
    db.collection(REVIEWS).findOne({ _id: attempt.reviewId }),
  ]);
  if (!brief || !submission || !review) {
    throw Object.assign(new Error("Capstone records missing for certificate"), { status: 500 });
  }

  const nameOf = new Map(brief.rubric.map((c) => [c.id, c.name]));
  const twist = brief.twistPool.find((t) => t.id === attempt.twistId);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  const certificate = {
    userId: ownerId,
    trackId: attempt.trackId,
    attemptId: attempt._id,
    holderName: fullName || user?.username || "Vahoha learner",
    trackTitle: track?.title ?? attempt.trackId,
    project: { title: brief.title, briefVersion: brief.version, twist: twist?.text ?? null },
    repo: { fullName: submission.repo.fullName, url: submission.repo.htmlUrl, commitSha: submission.commitSha },
    scores: {
      review: review.totalScore,
      // null when an admin passed the attempt before any defense was graded.
      defense: attempt.defenseScore ?? null,
      criteria: review.criteria.map((c) => ({ name: nameOf.get(c.id) ?? c.id, score: c.score, maxScore: 4 })),
    },
    // Honesty: an outcome set by an admin is labelled as such, publicly, and a
    // certificate built on seeded test data says so loudly (testData).
    assessment: review.seededForTesting
      ? "TEST DATA — this certificate was generated from seeded test data. It is not a real assessment."
      : attempt.override
        ? `${ASSESSMENT_METHOD} The final outcome was set by a human reviewer.`
        : ASSESSMENT_METHOD,
    testData: Boolean(review.seededForTesting),
    humanReviewed: Boolean(attempt.override),
    issuedAt: new Date(),
    revokedAt: null,
    revokedReason: null,
  };

  // A publicId collision is astronomically unlikely, but the unique index
  // would turn it into an E11000 — retry with a fresh id rather than fail.
  for (let tries = 0; tries < 3; tries++) {
    try {
      certificate.publicId = newPublicId();
      const { insertedId } = await db.collection(CERTIFICATES).insertOne({ ...certificate });
      return { ...certificate, _id: insertedId };
    } catch (err) {
      if (err.code !== 11000) throw err;
      if (err.keyPattern?.userId) {
        // A concurrent request issued it first — return theirs.
        return db.collection(CERTIFICATES).findOne({ userId: ownerId, trackId: attempt.trackId });
      }
    }
  }
  throw Object.assign(new Error("Could not allocate a certificate id"), { status: 500 });
};

/** The public, unauthenticated verification record. */
export const getPublicCertificateService = async (db, publicId) => {
  const cert = PUBLIC_ID_PATTERN.test(publicId)
    ? await db.collection(CERTIFICATES).findOne({ publicId })
    : null;
  if (!cert) throw Object.assign(new Error("Certificate not found"), { status: 404 });

  // Link to the holder's CURRENT profile (usernames can change after issue).
  const user = await db.collection("users").findOne({ _id: cert.userId }, { projection: { username: 1 } });
  return toPublicCertificate(cert, user?.username ?? null);
};

export const listMyCertificatesService = async (db, userId) => {
  const certs = await db
    .collection(CERTIFICATES)
    .find({ userId: new ObjectId(userId) })
    .sort({ issuedAt: -1 })
    .toArray();
  return certs.map((c) => toPublicCertificate(c, null));
};

/**
 * A user's certificates as shown on their PUBLIC profile: newest first,
 * revoked ones left out (a revoked certificate must not be advertised).
 * Same safe shape as the verify page, so nothing private can leak here.
 */
export const listPublicCertificatesForUser = async (db, userId, username) => {
  const certs = await db
    .collection(CERTIFICATES)
    .find({ userId: new ObjectId(userId) })
    .sort({ issuedAt: -1 })
    .toArray();
  return certs.filter((c) => !c.revokedAt).map((c) => toPublicCertificate(c, username));
};

/** Everything here is safe to show anyone holding the link. No internal ids. */
export const toPublicCertificate = (cert, username) => ({
  publicId: cert.publicId,
  verifyPath: `/verify/${cert.publicId}`,
  holder: { name: cert.holderName, username, profilePath: username ? `/users/${username}` : null },
  track: { id: cert.trackId, title: cert.trackTitle },
  project: cert.project,
  repo: {
    ...cert.repo,
    commitUrl: `${cert.repo.url}/tree/${cert.repo.commitSha}`,
  },
  scores: cert.scores,
  assessment: cert.assessment,
  humanReviewed: Boolean(cert.humanReviewed),
  testData: Boolean(cert.testData),
  issuedAt: cert.issuedAt,
  revoked: Boolean(cert.revokedAt),
  revokedAt: cert.revokedAt,
  revokedReason: cert.revokedAt ? cert.revokedReason : null,
});
