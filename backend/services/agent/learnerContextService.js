/**
 * LearnerContext — a unified, read-only view of one learner (Stage 1 + 4).
 *
 * The mentor should know the learner but must never own the learner's truth, so
 * this module is a *projection*: it writes nothing, owns no collection, and
 * reads exclusively through the services that do own each source. Roadmap
 * progress, exam results, teach-back scores, weak spots and challenge results
 * stay authoritative where they already live.
 *
 * Since Stage 4, the per-topic statuses and the "what next" recommendation come
 * from the Adaptive Engine (`learnerMasteryService`) rather than being derived
 * here — the engine answers WHAT should happen next, and the mentor decides only
 * HOW to make it happen. This module is the adapter between the two.
 */

import { ObjectId } from "mongodb";
import { getUserProgress } from "../userProgressService.js";
import { getChallengeResults } from "../challengeResultService.js";
import {
  getMastery,
  buildTopicStates,
  loadTopicEvidence,
  deriveNextAction,
} from "../learnerMasteryService.js";
import { toTopicSlug } from "../../utils/topicKey.js";
import { getTeachingHistory, summarizeTeachingHistory } from "./teachingLogService.js";

/**
 * Layer-level exam summary, including direction of travel.
 *
 * Trend compares the mean of the newer half of recent attempts against the older
 * half rather than first-vs-last, so one unlucky attempt does not read as a
 * collapse. `exams` must be newest-first.
 */
export const summarizeExams = (exams = []) => {
  if (!exams.length) {
    return { lastScore: null, lastPassed: null, avgScoreRecent: null, trend: "insufficient-data" };
  }

  const scores = exams.map((e) => e.score).filter((s) => typeof s === "number");
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

  let trend = "insufficient-data";
  if (scores.length >= 4) {
    const mid = Math.floor(scores.length / 2);
    const newer = mean(scores.slice(0, mid)); // newest-first, so this is recent
    const older = mean(scores.slice(mid));
    const delta = newer - older;
    trend = delta >= 5 ? "improving" : delta <= -5 ? "declining" : "flat";
  }

  return {
    lastScore: exams[0].score ?? null,
    lastPassed: exams[0].passed ?? null,
    avgScoreRecent: scores.length ? Math.round(mean(scores)) : null,
    trend,
  };
};

const summarizeChallenges = (challenges = []) => {
  const solved = challenges.filter((c) => c.status === "solved");
  return {
    solvedCount: solved.length,
    attemptedCount: challenges.length,
    avgAttemptsPerSolve: solved.length
      ? +(solved.reduce((s, c) => s + (c.attempts || 1), 0) / solved.length).toFixed(1)
      : 0,
  };
};

/**
 * Assemble the full LearnerContext.
 *
 * Reads run in parallel — serialised awaits would stack round-trips onto every
 * mentor turn, which the user sees directly as time-to-first-token on the SSE
 * stream.
 *
 * Topic statuses come from stored mastery when the Adaptive Engine has run.
 * The fallback derivation exists for learners whose evidence predates Stage 4:
 * without it they would look like brand-new users until their next exam.
 */
export const getLearnerContext = async (db, userId) => {
  const uid = new ObjectId(userId);

  const [progress, challenges, mastery, exams] = await Promise.all([
    getUserProgress(db, userId),
    getChallengeResults(db, userId),
    getMastery(db, userId),
    // Needed for the layer-level summary regardless of where topics come from.
    db
      .collection("examHistory")
      .find({ userId: uid })
      .sort({ takenAt: -1 })
      .limit(10)
      .project({ answers: 0 })
      .toArray(),
  ]);

  const topics = mastery.length
    ? mastery
    : buildTopicStates(await loadTopicEvidence(db, userId));

  // Teaching history is fetched only for the topics that will actually appear in
  // the summary — the mentor's past attempts on a solid topic are not guidance
  // for this turn, and every extra line costs prompt budget on all 30 messages.
  const focusSlugs = topics.filter((t) => t.status !== "solid").slice(0, 5).map((t) => t.slug);

  const [teachBackLatest, teachingAttempts] = await Promise.all([
    db
      .collection("teach_back_sessions")
      .findOne({ userId: uid }, { sort: { startedAt: -1 }, projection: { startedAt: 1 } }),
    getTeachingHistory(db, userId, focusSlugs),
  ]);

  return {
    profile: {
      activePath: progress?.activePath ?? null,
      currentLayer: progress?.currentLayer ?? null,
      completedLayers: progress?.completedLayers ?? [],
      skillLevel: progress?.skillLevel ?? "beginner",
      xpTotal: progress?.xpTotal ?? 0,
      streak: progress?.streak ?? 0,
      lastActiveAt: progress?.lastActiveAt ?? null,
    },
    exams: summarizeExams(exams),
    topics,
    // The Adaptive Engine's answer, not the mentor's opinion.
    nextAction: deriveNextAction(topics, progress),
    // The mentor's own history. Verdicts are derived from the statuses above,
    // never self-reported.
    teachingAttempts,
    challenges: summarizeChallenges(challenges),
    activity: {
      lastExamAt: exams[0]?.takenAt ?? null,
      lastTeachBackAt: teachBackLatest?.startedAt ?? null,
      lastChallengeAt: challenges.find((c) => c.solvedAt)?.solvedAt ?? null,
    },
  };
};

/**
 * One topic's evidence, for when the summary is not enough.
 *
 * Backs the `detailed` path of the mentor's tool: the compact summary rides on
 * every turn, and this is the escape hatch for "what exactly did I get wrong".
 */
export const getTopicDetail = async (db, userId, topicSlug) => {
  const slug = toTopicSlug(topicSlug);
  if (!slug) return null;

  const [mastery, sessions] = await Promise.all([
    getMastery(db, userId),
    db
      .collection("teach_back_sessions")
      .find({ userId: new ObjectId(userId), topicSlug: slug })
      .sort({ startedAt: -1 })
      .limit(3)
      // criteria is the point of this query, so only the essay is projected out
      .project({ answerText: 0 })
      .toArray(),
  ]);

  const topic =
    mastery.find((t) => t.slug === slug) ??
    buildTopicStates(await loadTopicEvidence(db, userId)).find((t) => t.slug === slug);

  if (!topic) return { slug, status: "untested", teachBackBreakdown: [] };

  return {
    ...topic,
    // Per-criterion breakdown is the actionable part: it names which specific
    // sub-skill failed, which is what lets the mentor target the real gap
    // instead of re-teaching the whole topic.
    teachBackBreakdown: sessions.map((s) => ({
      at: s.startedAt,
      score: s.score,
      passed: s.passed,
      weakCriteria: (s.criteria ?? [])
        .filter((c) => c.maxScore > 0 && c.score / c.maxScore < 0.7)
        .map((c) => ({ id: c.id, label: c.label, score: c.score, maxScore: c.maxScore })),
      misconceptionsDetected: s.misconceptionsDetected ?? [],
    })),
  };
};

/**
 * Compact text rendering for injection into the system prompt.
 *
 * Token budget is the whole design constraint: this rides on every one of the
 * learner's 30 daily messages, so it stays a handful of lines and the full
 * object stays behind the tool. Only non-solid topics are listed — what the
 * learner has already mastered is not what the mentor needs to act on.
 */
export const summarizeLearnerContext = (ctx, { maxTopics = 5 } = {}) => {
  const { profile, exams, topics, challenges, nextAction, teachingAttempts } = ctx;

  const lines = [
    `Path: ${profile.activePath ?? "none"} | Layer: ${profile.currentLayer ?? "-"} | Level: ${profile.skillLevel} | Streak: ${profile.streak}d`,
  ];

  if (exams.lastScore !== null) {
    lines.push(
      `Exams: last ${exams.lastScore}% (${exams.lastPassed ? "passed" : "failed"}), recent avg ${exams.avgScoreRecent}%, trend ${exams.trend}`,
    );
  } else {
    lines.push("Exams: none taken yet");
  }

  if (challenges.attemptedCount) {
    lines.push(
      `Challenges: ${challenges.solvedCount}/${challenges.attemptedCount} solved, avg ${challenges.avgAttemptsPerSolve} attempts`,
    );
  }

  const needsWork = topics.filter((t) => t.status !== "solid").slice(0, maxTopics);
  if (needsWork.length) {
    lines.push("Topics needing attention:");
    for (const t of needsWork) {
      const bits = [];
      if (t.examScore !== null) bits.push(`exam ${t.examScore}%`);
      if (t.teachBackScore !== null) bits.push(`teach-back ${t.teachBackScore}%`);
      if (t.failCount) bits.push(`${t.failCount} fail(s)`);
      const misc = t.misconceptions?.length
        ? ` | known misconceptions: ${t.misconceptions.join(", ")}`
        : "";
      lines.push(`  - ${t.title} [${t.slug}] ${t.status}${bits.length ? ` (${bits.join(", ")})` : ""}${misc}`);
    }
  } else if (topics.length) {
    lines.push("No weak topics on record — everything assessed is solid.");
  }

  const history = summarizeTeachingHistory(teachingAttempts, topics);
  if (history) lines.push(history);

  if (nextAction) {
    // Stated as the platform's decision, not a suggestion, so the mentor treats
    // it as the goal for the turn rather than re-deciding what to teach.
    lines.push(
      `Recommended focus (decided by the platform, not by you): ${nextAction.action}` +
        `${nextAction.title ? ` "${nextAction.title}" [${nextAction.topicSlug}]` : ""} — ${nextAction.reason}`,
    );
  }

  return lines.join("\n");
};
