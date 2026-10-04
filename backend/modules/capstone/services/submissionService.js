/**
 * Capstone submission + automated checks (stage 2).
 *
 * Flow: daily cap → find the open attempt → CLAIM it (status "checking") →
 * gather facts from GitHub and Mongo → judge them (lib/autoChecks.js) →
 * record the submission → RELEASE the attempt as "submitted" (checks passed)
 * or back to "started" (learner fixes and resubmits; no attempt is used up).
 *
 * The claim is a conditional findOneAndUpdate, the same pattern as the arena's
 * hint purchase: MongoDB updates one document atomically, so of two concurrent
 * submits exactly one wins and the other gets a 409. The claim carries a
 * timestamp; the release only matches that exact claim, so a request whose
 * lock went stale can never overwrite a newer one.
 */

import { ObjectId } from "mongodb";
import { trackEvent } from "../../../services/eventService.js";
import { evaluateSubmission } from "../lib/autoChecks.js";
import { CHECK_LOCK_STALE_MS, MAX_SUBMISSIONS_PER_DAY, OPEN_STATUSES } from "../lib/constants.js";
import { toPublicAttempt, toPublicSubmission } from "../lib/publicView.js";
import { getCommitStats, getHeadCommit, getRepo, getTree } from "./githubClient.js";
import { ATTEMPTS, BRIEFS, SUBMISSIONS, ensureIndexes, fail, getAttempts } from "./capstoneData.js";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Everything evaluateSubmission needs, fetched with as few round trips as possible. */
const gatherFacts = async (db, ownerId, { owner, repo: repoName }) => {
  const repo = await getRepo(owner, repoName);
  if (!repo || repo.private) return { repo };

  const head = await getHeadCommit(owner, repoName);
  if (!head) return { repo, head };

  const otherUser = { userId: { $ne: ownerId } };
  const [stats, tree, repoUsedByOtherUser, treeSeenFromOtherUser] = await Promise.all([
    getCommitStats(owner, repoName, head.sha),
    getTree(owner, repoName, head.treeSha),
    db.collection(SUBMISSIONS).findOne({ "repo.id": repo.id, ...otherUser }, { projection: { _id: 1 } }),
    db.collection(SUBMISSIONS).findOne({ treeSha: head.treeSha, ...otherUser }, { projection: { _id: 1 } }),
  ]);

  return {
    repo,
    head,
    stats,
    tree,
    repoUsedByOtherUser: Boolean(repoUsedByOtherUser),
    treeSeenFromOtherUser: Boolean(treeSeenFromOtherUser),
  };
};

export const submitService = async (db, userId, trackId, repoRef) => {
  await ensureIndexes(db);
  const ownerId = new ObjectId(userId);
  const now = new Date();

  // Cheap guard first: every submission costs GitHub API calls.
  const recent = await db
    .collection(SUBMISSIONS)
    .countDocuments({ userId: ownerId, submittedAt: { $gte: new Date(now.getTime() - DAY_MS) } });
  if (recent >= MAX_SUBMISSIONS_PER_DAY) {
    fail(429, `You can submit at most ${MAX_SUBMISSIONS_PER_DAY} times per day. Try again tomorrow.`);
  }

  const attempts = await getAttempts(db, userId, trackId);
  const open = attempts.find((a) => OPEN_STATUSES.includes(a.status));
  if (!open) fail(404, "No open capstone attempt. Start the capstone first.");
  if (open.status !== "started" && open.status !== "checking") {
    fail(409, "This attempt has already been submitted");
  }

  // CLAIM. A "checking" claim older than CHECK_LOCK_STALE_MS belongs to a
  // request that died mid-check, so it may be taken over.
  const claimedAt = now;
  const claimed = await db.collection(ATTEMPTS).findOneAndUpdate(
    {
      _id: open._id,
      userId: ownerId,
      $or: [
        { status: "started" },
        { status: "checking", checkingSince: { $lt: new Date(now.getTime() - CHECK_LOCK_STALE_MS) } },
      ],
    },
    { $set: { status: "checking", checkingSince: claimedAt, updatedAt: now } },
    { returnDocument: "after" },
  );
  if (!claimed) fail(409, "A submission for this attempt is already being checked");

  const release = (fields) =>
    db.collection(ATTEMPTS).findOneAndUpdate(
      { _id: claimed._id, status: "checking", checkingSince: claimedAt },
      { $set: { ...fields, updatedAt: new Date() }, $unset: { checkingSince: "" } },
      { returnDocument: "after" },
    );

  try {
    const brief = await db.collection(BRIEFS).findOne({ _id: claimed.briefId });
    if (!brief) fail(500, "The brief for this attempt no longer exists");

    // "Created after you started" is measured from the FIRST attempt, so a
    // learner can keep improving the same repository across retries.
    const firstStartedAt = attempts.reduce(
      (earliest, a) => (a.startedAt < earliest ? a.startedAt : earliest),
      claimed.startedAt,
    );

    const facts = await gatherFacts(db, ownerId, repoRef);
    const result = evaluateSubmission({ ...facts, firstStartedAt, requirements: brief.requirements });

    const submission = {
      attemptId: claimed._id,
      userId: ownerId,
      trackId,
      repoInput: `${repoRef.owner}/${repoRef.repo}`,
      repo: facts.repo && !facts.repo.private ? facts.repo : null,
      commitSha: facts.head?.sha ?? null,
      treeSha: facts.head?.treeSha ?? null,
      commitCount: facts.stats?.count ?? null,
      fileCount: facts.tree?.paths.length ?? null,
      passed: result.passed,
      checks: result.checks,
      flags: result.flags,
      submittedAt: new Date(),
    };
    const { insertedId } = await db.collection(SUBMISSIONS).insertOne(submission);
    submission._id = insertedId;

    const attempt = await release(
      result.passed
        ? { status: "submitted", submissionId: insertedId, submittedAt: submission.submittedAt }
        : { status: "started" },
    );

    if (result.passed) {
      await trackEvent(db, userId, "capstone_submitted", {
        trackId,
        attemptId: claimed._id.toString(),
        submissionId: insertedId.toString(),
        flags: result.flags.map((f) => f.id),
      });
    }

    return {
      submission: toPublicSubmission(submission),
      // null only if our claim went stale and another request took over.
      attempt: attempt ? toPublicAttempt(attempt, brief) : null,
    };
  } catch (err) {
    // GitHub outage, rate limit or a bug: hand the attempt back untouched so
    // the learner can retry. Not recorded as a submission.
    await release({ status: "started" }).catch(() => {});
    throw err;
  }
};
