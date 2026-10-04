/**
 * Team defense: a member is questioned on their own merged PRs.
 *
 * Same lifecycle and guarantees as the capstone defense
 * (generating -> active -> answered -> grading -> graded): the server owns each
 * question's clock, and every state change is ONE conditional update, so a
 * double click or two tabs can never answer twice. Differences: the unit is
 * (team, member), questions come from PR diffs, and the result is stored on the
 * session only (the evidence snapshot in stage 7 reads it).
 *
 * The capstone's defense service is NOT modified; only its pure helpers and
 * model wrapper are reused.
 */

import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import {
  DEFAULT_PASS_THRESHOLDS,
  DEFENSE_LOCK_STALE_MS,
  MAX_DEFENSE_SESSIONS,
  REVIEW_MODEL,
} from "../../capstone/lib/constants.js";
import {
  gradingJsonSchema,
  isOnTime,
  normalizeAnswer,
  parseGrades,
  scoreDefense,
} from "../../capstone/lib/defense.js";
import { scanForInjection } from "../../capstone/lib/reviewPrompt.js";
import { callWithOneRetry } from "../../capstone/lib/retry.js";
import { getPullFiles } from "../../capstone/services/githubClient.js";
import { runStructured } from "../../capstone/services/reviewModel.js";
import {
  buildDiffView,
  buildQuestionMessages,
  buildTeamGradingMessages,
  parseQuestions,
  questionJsonSchema,
  toPublicTeamDefense,
} from "../lib/teamDefense.js";
import { CONTRIBUTIONS, TEAMS, TEAM_DEFENSES, ensureIndexes, fail } from "./teamsData.js";

const NOT_GRADED = ["generating", "active", "answered", "grading"];

// ── Loading ──────────────────────────────────────────────────

const loadMemberContext = async (db, teamId, userId) => {
  const team = await db.collection(TEAMS).findOne({ _id: new ObjectId(teamId) });
  const isMember = team?.members.some((m) => m.status === "active" && m.userId.equals(userId));
  if (!isMember) fail(404, "Team not found"); // 404: do not reveal the team to non-members
  if (!team.repo) fail(409, "The team has no repository yet");
  if (team.status === "disbanded") fail(409, "This team has been disbanded");
  return team;
};

const getSessions = (db, teamId, userId) =>
  db
    .collection(TEAM_DEFENSES)
    .find({ teamId: new ObjectId(teamId), userId })
    .sort({ sessionNumber: 1 })
    .toArray();

const view = (session, sessions) => {
  const graded = sessions.filter((s) => s.status === "graded");
  const passed = graded.some((s) => s.result.passed);
  const open = sessions.some((s) => NOT_GRADED.includes(s.status));
  return {
    session: session ? toPublicTeamDefense(session) : null,
    sessionsUsed: graded.length,
    maxSessions: MAX_DEFENSE_SESSIONS,
    passed,
    canStart: !passed && !open && graded.length < MAX_DEFENSE_SESSIONS,
  };
};

// ── Timer housekeeping (one conditional update each) ─────────

/** Expire the open question if its time ran out. Does NOT serve the next one. */
const expireOverdue = async (db, session, now) => {
  const i = session.currentIndex;
  const q = session.questions?.[i];
  if (session.status !== "active" || !q?.askedAt || isOnTime(q.askedAt, now)) return session;

  const last = i + 1 === session.questions.length;
  const updated = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i, [`questions.${i}.askedAt`]: q.askedAt },
    {
      $set: {
        [`questions.${i}.answer`]: "",
        [`questions.${i}.expired`]: true,
        [`questions.${i}.answeredAt`]: now,
        currentIndex: i + 1,
        ...(last ? { status: "answered" } : {}),
      },
    },
    { returnDocument: "after" },
  );
  return updated ?? db.collection(TEAM_DEFENSES).findOne({ _id: session._id });
};

/** Start the open question's clock if it has not been served yet. */
const serveCurrent = async (db, session, now) => {
  const i = session.currentIndex;
  if (session.status !== "active" || session.questions[i]?.askedAt) return session;
  const updated = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i, [`questions.${i}.askedAt`]: null },
    { $set: { [`questions.${i}.askedAt`]: now } },
    { returnDocument: "after" },
  );
  return updated ?? db.collection(TEAM_DEFENSES).findOne({ _id: session._id });
};

// ── Public service functions ─────────────────────────────────

export const getTeamDefenseService = async (db, teamId, userId) => {
  await ensureIndexes(db);
  await loadMemberContext(db, teamId, userId);
  const sessions = await getSessions(db, teamId, userId);
  let session = sessions.at(-1) ?? null;
  if (session) {
    const now = new Date();
    session = await serveCurrent(db, await expireOverdue(db, session, now), now);
    sessions[sessions.length - 1] = session;
  }
  return view(session, sessions);
};

export const startTeamDefenseService = async (db, teamId, userId) => {
  await ensureIndexes(db);
  const team = await loadMemberContext(db, teamId, userId);
  const sessions = await getSessions(db, teamId, userId);
  const latest = sessions.at(-1);
  const now = new Date();

  if (latest?.status === "generating") {
    if (now - latest.lockedAt < DEFENSE_LOCK_STALE_MS) fail(409, "Your questions are being prepared");
    // A dead request left this behind: remove it so the number can be reused.
    await db.collection(TEAM_DEFENSES).deleteOne({ _id: latest._id, status: "generating", lockedAt: latest.lockedAt });
    sessions.pop();
  } else if (latest && NOT_GRADED.includes(latest.status)) {
    return getTeamDefenseService(db, teamId, userId); // resume the open session
  }
  if (sessions.some((s) => s.result?.passed)) fail(409, "You already passed this defense");
  if (sessions.length >= MAX_DEFENSE_SESSIONS) fail(409, "All defense sessions have been used");

  const contributions = await db
    .collection(CONTRIBUTIONS)
    .find({ teamId: team._id, authorId: userId })
    .sort({ mergedAt: -1 })
    .limit(5)
    .toArray();
  if (!contributions.length) fail(409, "You have no merged pull requests in the team repository yet");

  // CLAIM first: the unique (teamId, userId, sessionNumber) index lets only one
  // concurrent start reach the model.
  const placeholder = {
    teamId: team._id,
    userId,
    sessionNumber: sessions.length + 1,
    status: "generating",
    lockedAt: now,
    createdAt: now,
  };
  try {
    placeholder._id = (await db.collection(TEAM_DEFENSES).insertOne(placeholder)).insertedId;
  } catch (err) {
    if (err.code === 11000) fail(409, "Your questions are being prepared");
    throw err;
  }

  try {
    const [owner, repo] = team.repo.fullName.split("/");
    const filesByPr = new Map(
      await Promise.all(contributions.map(async (c) => [c.prNumber, await getPullFiles(owner, repo, c.prNumber)])),
    );
    const prs = buildDiffView(contributions, filesByPr);
    if (!prs.length) fail(422, "Your pull requests have no readable code changes to ask about");

    // Injection attempts hidden in the diffs themselves are recorded on the session.
    const diffHits = scanForInjection(
      prs.flatMap((pr) => pr.files.map((f) => ({ path: `PR #${pr.prNumber} ${f.path}`, text: f.patch }))),
    );

    const messages = buildQuestionMessages({
      prs,
      nonce: randomBytes(12).toString("hex"),
      // A retake must not be passable from memory of the last attempt.
      previousQuestions: sessions.flatMap((s) => s.questions?.map((q) => q.text) ?? []),
    });
    const { questions, usage } = await callWithOneRetry(
      () => runStructured(messages, questionJsonSchema, "team_defense_questions"),
      (content) => parseQuestions(content, prs),
      "team defense questions",
    );

    const startedAt = new Date();
    const activated = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
      { _id: placeholder._id, status: "generating" },
      {
        $set: {
          status: "active",
          // The first question is served immediately: its clock starts now.
          questions: questions.map((q, i) => ({
            ...q,
            askedAt: i === 0 ? startedAt : null,
            answeredAt: null,
            answer: null,
            expired: false,
          })),
          currentIndex: 0,
          startedAt,
          prNumbers: prs.map((p) => p.prNumber),
          flags: diffHits.length ? [{ id: "prompt-injection-in-diff", detail: diffHits.join(", ") }] : [],
          model: REVIEW_MODEL,
          generationUsage: usage,
        },
        $unset: { lockedAt: "" },
      },
      { returnDocument: "after" },
    );
    if (!activated) fail(409, "Your questions are being prepared");
    return view(activated, [...sessions, activated]);
  } catch (err) {
    // Remove the placeholder so the member can retry; nothing was used up.
    await db.collection(TEAM_DEFENSES).deleteOne({ _id: placeholder._id, status: "generating" }).catch(() => {});
    throw err;
  }
};

/** Grade a session in "answered" (or a stale "grading") and store the result. */
export const gradeTeamDefenseService = async (db, teamId, userId) => {
  await ensureIndexes(db);
  await loadMemberContext(db, teamId, userId);
  const sessions = await getSessions(db, teamId, userId);
  const latest = sessions.at(-1);
  if (!latest || !["answered", "grading"].includes(latest.status)) {
    fail(409, "There is no finished defense waiting to be graded");
  }

  const now = new Date();
  const claimed = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
    {
      _id: latest._id,
      $or: [
        { status: "answered" },
        { status: "grading", lockedAt: { $lt: new Date(now.getTime() - DEFENSE_LOCK_STALE_MS) } },
      ],
    },
    { $set: { status: "grading", lockedAt: now } },
    { returnDocument: "after" },
  );
  if (!claimed) fail(409, "Your defense is already being graded");

  try {
    // Expired or empty answers score 0 without spending model tokens.
    const answered = claimed.questions.filter((q) => !q.expired && q.answer);
    let grades = new Map();
    let usage = null;
    if (answered.length) {
      const ids = answered.map((q) => q.id);
      const messages = buildTeamGradingMessages({ questions: answered, nonce: randomBytes(12).toString("hex") });
      ({ grades, usage } = await callWithOneRetry(
        () => runStructured(messages, gradingJsonSchema(ids), "team_defense_grading"),
        (content) => parseGrades(content, ids),
        "team defense grading",
      ));
    }

    const questions = claimed.questions.map((q) => {
      const g = grades.get(q.id);
      return g
        ? { ...q, score: g.score, feedback: g.feedback }
        : { ...q, score: 0, feedback: q.expired ? "No answer within the time limit." : "No answer given." };
    });
    const result = scoreDefense(questions.map((q) => q.score), DEFAULT_PASS_THRESHOLDS.defense);
    const injected = scanForInjection(answered.map((q) => ({ path: q.id, text: q.answer })));

    const graded = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
      { _id: claimed._id, status: "grading", lockedAt: claimed.lockedAt },
      {
        $set: {
          status: "graded",
          questions,
          result,
          gradedAt: new Date(),
          gradingUsage: usage,
          // Keep flags raised at start (injection in the diffs) and add the answers' own.
          flags: [
            ...(claimed.flags ?? []),
            ...(injected.length ? [{ id: "prompt-injection-suspected", detail: injected.join(", ") }] : []),
          ],
        },
        $unset: { lockedAt: "" },
      },
      { returnDocument: "after" },
    );
    if (!graded) fail(409, "Your defense is already being graded");
    return view(graded, sessions.map((s) => (s._id.equals(graded._id) ? graded : s)));
  } catch (err) {
    await db
      .collection(TEAM_DEFENSES)
      .updateOne(
        { _id: claimed._id, status: "grading", lockedAt: claimed.lockedAt },
        { $set: { status: "answered" }, $unset: { lockedAt: "" } },
      )
      .catch(() => {});
    throw err;
  }
};

/**
 * Answer the open question. On time: stored. Late: kept as `lateAnswer` for the
 * admin but scored 0. The next question is served in the same update, so its
 * clock starts the moment this response goes out. After the last answer,
 * grading runs immediately; if grading fails the answers are safe and the
 * client retries with POST /defense/grade.
 */
export const answerTeamDefenseService = async (db, teamId, userId, { questionId, answer }) => {
  await ensureIndexes(db);
  await loadMemberContext(db, teamId, userId);
  const sessions = await getSessions(db, teamId, userId);
  const session = sessions.at(-1);
  if (!session || session.status !== "active") fail(409, "There is no defense in progress");

  const i = session.currentIndex;
  const q = session.questions[i];
  if (q.id !== questionId) fail(409, "That question is no longer open");
  if (!q.askedAt) fail(409, "Load the question before answering it");

  const now = new Date();
  const text = normalizeAnswer(answer);
  const late = !isOnTime(q.askedAt, now);
  const last = i + 1 === session.questions.length;

  const updated = await db.collection(TEAM_DEFENSES).findOneAndUpdate(
    { _id: session._id, status: "active", currentIndex: i },
    {
      $set: {
        [`questions.${i}.answer`]: late ? "" : text,
        [`questions.${i}.expired`]: late,
        [`questions.${i}.answeredAt`]: now,
        ...(late ? { [`questions.${i}.lateAnswer`]: text } : {}),
        currentIndex: i + 1,
        ...(last ? { status: "answered" } : { [`questions.${i + 1}.askedAt`]: now }),
      },
    },
    { returnDocument: "after" },
  );
  if (!updated) fail(409, "That question is no longer open");

  if (last) {
    try {
      return await gradeTeamDefenseService(db, teamId, userId);
    } catch (err) {
      const fresh = await getSessions(db, teamId, userId);
      return {
        ...view(fresh.at(-1), fresh),
        gradingError: err.status ? err.message : "Grading failed. Try again in a minute.",
      };
    }
  }
  sessions[sessions.length - 1] = updated;
  return view(updated, sessions);
};
