import { ObjectId } from "mongodb";
import { runHiddenTests } from "./runnerService.js";
import { saveChallengeResult } from "../../../services/challengeResultService.js";

/**
 * Submission grading.
 *
 * "Run" is client-side and advisory. THIS is the authority: it executes the
 * user's code against `hiddenTests`, which never leave the server, so editing
 * the visible test file cannot manufacture a pass.
 *
 * A pass must be all-or-nothing. Partial credit would make the XP economy
 * incoherent — hints cost XP, so a challenge that pays out for 4/7 would let a
 * user farm XP by buying hints on problems they never finish.
 */

const ATTEMPTS = "challenge_attempts";
const CHALLENGES = "challenges";

/**
 * XP earned. Full value the first time, nothing on a re-solve — otherwise a
 * solved challenge becomes an infinite XP faucet.
 */
const awardFor = (challenge, alreadySolved) =>
  alreadySolved ? 0 : (challenge.xp ?? 0);

export const submitAttemptService = async (db, userId, attemptId) => {
  if (!ObjectId.isValid(attemptId)) {
    const err = new Error("Attempt not found");
    err.status = 404;
    throw err;
  }

  // Ownership is part of the filter, never a read-then-compare.
  const attempt = await db.collection(ATTEMPTS).findOne({
    _id: new ObjectId(attemptId),
    userId: new ObjectId(userId),
  });
  if (!attempt) {
    const err = new Error("Attempt not found");
    err.status = 404;
    throw err;
  }

  const challenge = await db
    .collection(CHALLENGES)
    .findOne({ _id: attempt.challengeId });
  if (!challenge) {
    const err = new Error("Challenge not found");
    err.status = 404;
    throw err;
  }

  // The student edits exactly one module; the test file is read-only client
  // side and irrelevant here since grading uses the hidden set.
  const source = (attempt.code ?? []).find((f) => f.lang !== "test") ??
    (attempt.code ?? [])[0];
  if (!source?.code?.trim()) {
    const err = new Error("There is no code to submit yet.");
    err.status = 400;
    throw err;
  }

  // Export name is derived from the file name: asyncHandler.js -> asyncHandler.
  const exportName = source.name.replace(/\.[^.]+$/, "");

  const run = await runHiddenTests(
    source.code,
    exportName,
    challenge.hiddenTests,
  );

  const total = challenge.hiddenTests?.length ?? 0;
  const passedCount = run.results.filter((r) => r.passed).length;
  const passed = !run.fatal && total > 0 && passedCount === total;

  // Was this already solved on a previous submission?
  const previous = await db.collection("challengeResults").findOne({
    userId: new ObjectId(userId),
    challengeId: challenge.slug,
  });
  const alreadySolved = previous?.status === "solved";

  const xpEarned = passed ? awardFor(challenge, alreadySolved) : 0;

  // `saveChallengeResult` overwrites the fields it is given, so the running
  // total has to be carried forward — otherwise re-submitting a solved
  // challenge would rewrite its history to "earned 0".
  const xpOnRecord = (previous?.xpEarned ?? 0) + xpEarned;

  await saveChallengeResult(db, userId, {
    challengeId: challenge.slug,
    path: challenge.trackId,
    layer: challenge.layerId,
    // A solve is permanent — a later failed experiment must not demote it.
    status: passed || alreadySolved ? "solved" : "attempted",
    xpEarned: xpOnRecord,
    timeTakenSecs: Math.max(
      0,
      Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000),
    ),
    attempts: 1,
  });

  if (xpEarned > 0) {
    await db
      .collection("userProgress")
      .updateOne(
        { userId: new ObjectId(userId) },
        {
          $inc: { xpTotal: xpEarned },
          $set: { lastActiveAt: new Date(), updatedAt: new Date() },
        },
        { upsert: true },
      );
  }

  // Count a solve once per user, so the public solve count means "people who
  // solved this", not "submissions that happened to pass".
  await db.collection(CHALLENGES).updateOne(
    { _id: challenge._id },
    {
      $inc: {
        "stats.attempts": 1,
        "stats.solves": passed && !alreadySolved ? 1 : 0,
      },
    },
  );

  await db.collection(ATTEMPTS).updateOne(
    { _id: attempt._id },
    {
      $set: {
        lastResult: { passed, results: run.results, at: new Date() },
        updatedAt: new Date(),
      },
      $inc: { runs: 1 },
    },
  );

  return {
    passed,
    passedCount,
    total,
    results: run.results,
    error: run.error ?? null,
    xpEarned,
    alreadySolved,
    // The solution is the reward for passing — never sent otherwise.
    solution: passed ? challenge.solution : null,
  };
};
