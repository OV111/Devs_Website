/**
 * Capstone AI rubric review (stage 3).
 *
 * Flow: CLAIM the attempt ("submitted" → "reviewing") → list the files at the
 * pinned commit → pick what fits the budget → download them → build the
 * nonce-delimited prompt → run the model (one retry on unusable output) →
 * validate and score server-side → save the review → RELEASE:
 *   rubric passed → "defense" (stage 4)
 *   rubric failed → "failed", cooldown starts, the attempt is used up
 * Any infrastructure error (GitHub, Groq) releases back to "submitted" so the
 * learner can simply retry — an outage never costs them an attempt.
 *
 * Low-scoring criteria become weak spots for the layer that teaches them,
 * whatever the outcome, so the mentor can help with them.
 */

import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { trackEvent } from "../../../services/eventService.js";
import { addWeakSpot } from "../../../services/weakSpotService.js";
import { recomputeMastery } from "../../../services/learnerMasteryService.js";
import {
  COOLDOWN_MS,
  REVIEW_LOCK_STALE_MS,
  REVIEW_MODEL,
  REVIEW_PROMPT_VERSION,
  WEAK_SPOT_MAX_SCORE,
} from "../lib/constants.js";
import {
  buildReviewMessages,
  parseReviewOutput,
  reviewJsonSchema,
  scanForInjection,
  scoreReview,
} from "../lib/reviewPrompt.js";
import { callWithOneRetry } from "../lib/retry.js";
import { toPublicAttempt, toPublicReview } from "../lib/publicView.js";
import { loadSubmissionFiles } from "./repoFiles.js";
import { runReviewModel } from "./reviewModel.js";
import { ATTEMPTS, BRIEFS, REVIEWS, SUBMISSIONS, ensureIndexes, fail, getAttempts } from "./capstoneData.js";

export const reviewService = async (db, userId, trackId) => {
  await ensureIndexes(db);
  const ownerId = new ObjectId(userId);
  const now = new Date();

  const attempts = await getAttempts(db, userId, trackId);
  const open = attempts.find((a) => ["submitted", "reviewing"].includes(a.status));
  if (!open) {
    const current = attempts[0];
    if (!current) fail(404, "No capstone attempt. Start the capstone first.");
    if (["started", "checking"].includes(current.status)) fail(409, "Submit your repository before the review.");
    fail(409, "This attempt has already been reviewed");
  }

  // CLAIM — same pattern as submissionService: one atomic conditional update.
  const claimedAt = now;
  const claimed = await db.collection(ATTEMPTS).findOneAndUpdate(
    {
      _id: open._id,
      userId: ownerId,
      $or: [
        { status: "submitted" },
        { status: "reviewing", reviewingSince: { $lt: new Date(now.getTime() - REVIEW_LOCK_STALE_MS) } },
      ],
    },
    { $set: { status: "reviewing", reviewingSince: claimedAt, updatedAt: now } },
    { returnDocument: "after" },
  );
  if (!claimed) fail(409, "The review for this attempt is already running");

  const release = (fields) =>
    db.collection(ATTEMPTS).findOneAndUpdate(
      { _id: claimed._id, status: "reviewing", reviewingSince: claimedAt },
      { $set: { ...fields, updatedAt: new Date() }, $unset: { reviewingSince: "" } },
      { returnDocument: "after" },
    );

  try {
    const [brief, submission] = await Promise.all([
      db.collection(BRIEFS).findOne({ _id: claimed.briefId }),
      db.collection(SUBMISSIONS).findOne({ _id: claimed.submissionId, attemptId: claimed._id }),
    ]);
    if (!brief || !submission) fail(500, "The brief or submission for this attempt is missing");
    const twist = brief.twistPool.find((t) => t.id === claimed.twistId);

    const { files, omitted } = await loadSubmissionFiles(submission);
    if (files.length === 0) fail(422, "None of the files in your repository could be reviewed.");

    const nonce = randomBytes(12).toString("hex");
    const messages = buildReviewMessages({ brief, twist, files, omitted, nonce });
    const lineCounts = new Map(files.map((f) => [f.path, f.text.split("\n").length]));

    const startedAt = Date.now();
    const schema = reviewJsonSchema(brief.rubric.map((c) => c.id));
    const { criteria, summary, usage } = await callWithOneRetry(
      () => runReviewModel(messages, schema),
      (content) => parseReviewOutput(content, brief.rubric, lineCounts),
      "capstone review",
    );
    const { totalScore, passed } = scoreReview(criteria, brief.rubric, brief.passThresholds.rubric);

    const injectionPaths = scanForInjection(files);
    const review = {
      attemptId: claimed._id,
      submissionId: submission._id,
      userId: ownerId,
      trackId,
      criteria,
      summary,
      totalScore,
      passed,
      passMark: brief.passThresholds.rubric,
      model: REVIEW_MODEL,
      promptVersion: REVIEW_PROMPT_VERSION,
      files: files.map((f) => ({ path: f.path, chars: f.text.length, truncated: f.truncated })),
      omittedCount: omitted.length,
      flags: injectionPaths.length
        ? [{ id: "prompt-injection-suspected", detail: injectionPaths.slice(0, 10).join(", ") }]
        : [],
      usage,
      durationMs: Date.now() - startedAt,
      createdAt: new Date(),
    };
    const { insertedId } = await db.collection(REVIEWS).insertOne(review);
    review._id = insertedId;

    const finishedAt = new Date();
    const attempt = await release(
      passed
        ? { status: "defense", reviewId: insertedId }
        : { status: "failed", reviewId: insertedId, finishedAt, cooldownUntil: new Date(finishedAt.getTime() + COOLDOWN_MS) },
    );

    // The review is saved and the attempt released: from here on nothing may
    // fail the request, or the learner would see an error for a finished review.
    // Sequential: addWeakSpot is read-then-write, so parallel calls for the
    // same topic could race (see examEngineService.submitAttempt).
    try {
      const rubricById = new Map(brief.rubric.map((c) => [c.id, c]));
      for (const c of criteria.filter((x) => x.score <= WEAK_SPOT_MAX_SCORE)) {
        const rubricItem = rubricById.get(c.id);
        await addWeakSpot(db, userId, {
          topic: rubricItem.name,
          path: brief.categoryId,
          layer: rubricItem.layerId,
          source: "capstone",
        });
      }
      await recomputeMastery(db, userId);
    } catch (err) {
      console.error("capstone weak-spot/mastery update failed (review already saved):", err);
    }

    if (!passed) {
      await trackEvent(db, userId, "capstone_failed", {
        trackId,
        attemptId: claimed._id.toString(),
        stage: "review",
        totalScore,
      });
    }

    return {
      review: toPublicReview(review, brief),
      attempt: attempt ? toPublicAttempt(attempt, brief) : null,
    };
  } catch (err) {
    await release({ status: "submitted" }).catch(() => {});
    throw err;
  }
};
