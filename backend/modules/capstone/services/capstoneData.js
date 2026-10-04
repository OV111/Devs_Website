/**
 * Shared data access for the capstone services: collection names, indexes,
 * the error helper and the reads more than one service needs.
 */

import { ObjectId } from "mongodb";

export const BRIEFS = "capstone_briefs";
export const ATTEMPTS = "capstone_attempts";
export const SUBMISSIONS = "capstone_submissions";
export const REVIEWS = "capstone_reviews";
export const DEFENSES = "capstone_defenses";
export const CERTIFICATES = "certificates";
export const ADMIN_ACTIONS = "capstone_admin_actions";

// - attempts: attemptNumber is "attempts so far + 1", so two concurrent starts
//   compute the SAME number; the unique index turns the loser into an E11000.
// - exam_attempts: serves isPathComplete's { userId, passed, layer: $in } query.
// - submissions: per-attempt history, the per-user daily cap, and the two
//   cross-user integrity lookups (same GitHub repo id, same tree hash).
let indexesReady = null;
export const ensureIndexes = (db) => {
  indexesReady ??= Promise.all([
    db.collection(ATTEMPTS).createIndex({ userId: 1, trackId: 1, attemptNumber: 1 }, { unique: true }),
    db.collection("exam_attempts").createIndex({ userId: 1, passed: 1, layer: 1 }),
    db.collection(SUBMISSIONS).createIndex({ attemptId: 1, submittedAt: -1 }),
    db.collection(SUBMISSIONS).createIndex({ userId: 1, submittedAt: -1 }),
    db.collection(SUBMISSIONS).createIndex({ "repo.id": 1 }),
    db.collection(SUBMISSIONS).createIndex({ treeSha: 1 }),
    db.collection(REVIEWS).createIndex({ attemptId: 1, createdAt: -1 }),
    // One session per number per attempt: a double "start" collides here.
    db.collection(DEFENSES).createIndex({ attemptId: 1, sessionNumber: 1 }, { unique: true }),
    // hasLiveDefense runs on every mentor message.
    db.collection(DEFENSES).createIndex({ userId: 1, status: 1 }),
    // One certificate per learner per track (issuing twice collides), and the
    // public id must be unique because it IS the verification URL.
    db.collection(CERTIFICATES).createIndex({ userId: 1, trackId: 1 }, { unique: true }),
    db.collection(CERTIFICATES).createIndex({ publicId: 1 }, { unique: true }),
    db.collection(ATTEMPTS).createIndex({ updatedAt: -1 }), // admin list, newest activity first
    db.collection(ADMIN_ACTIONS).createIndex({ attemptId: 1, at: -1 }),
  ]).catch((err) => {
    indexesReady = null; // let the next request retry instead of caching a failure
    throw err;
  });
  return indexesReady;
};

export const fail = (status, message, details) => {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  throw err;
};

// Newest published version wins. Old versions stay in the collection because
// attempts point at the exact brief document they were started against.
export const getLatestBrief = (db, trackId) =>
  db.collection(BRIEFS).find({ trackId, status: "published" }).sort({ version: -1 }).limit(1).next();

export const getAttempts = (db, userId, trackId) =>
  db
    .collection(ATTEMPTS)
    .find({ userId: new ObjectId(userId), trackId })
    .sort({ attemptNumber: -1 })
    .toArray();

// The brief an attempt was started against, which may be older than `latest`.
// Costs one extra read only when the versions differ.
export const getBriefForAttempt = async (db, attempt, latest) =>
  latest && attempt.briefId.equals(latest._id)
    ? latest
    : db.collection(BRIEFS).findOne({ _id: attempt.briefId });
