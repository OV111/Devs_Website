import { ObjectId } from "mongodb";
import { saveExamResult } from "./examHistoryService.js";
import { addWeakSpot } from "./weakSpotService.js";
import { updateUserProgress } from "./userProgressService.js";

const TIME_LIMIT_SECS = 600;
const QUESTIONS_PER_EXAM = 10;
const MAX_ATTEMPTS_PER_DAY = 3;
const COOLDOWN_AFTER_FAIL_MINS = 30;
const PASS_THRESHOLD = 80;

// ── Question bank ─────────────────────────────────────────────

export const getQuestionBank = async (db, path, layer) => {
  const collection = db.collection("exam_question_banks");
  return collection.findOne({ path, layer });
};

export const upsertQuestionBank = async (db, path, layer, questions) => {
  const collection = db.collection("exam_question_banks");
  return collection.findOneAndUpdate(
    { path, layer },
    { $set: { path, layer, questions, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  );
};

// ── Attempt limits ────────────────────────────────────────────

const checkAttemptLimits = async (db, userId, path, layer) => {
  const collection = db.collection("exam_attempts");

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const todayAttempts = await collection.countDocuments({
    userId: new ObjectId(userId),
    path,
    layer,
    startedAt: { $gte: dayStart },
    submitted: true,
  });

  if (todayAttempts >= MAX_ATTEMPTS_PER_DAY) {
    return { allowed: false, reason: `Daily limit reached (${MAX_ATTEMPTS_PER_DAY} attempts per day). Try again tomorrow.` };
  }

  const cooldownCutoff = new Date(Date.now() - COOLDOWN_AFTER_FAIL_MINS * 60 * 1000);
  const recentFail = await collection.findOne(
    {
      userId: new ObjectId(userId),
      path,
      layer,
      submitted: true,
      passed: false,
      submittedAt: { $gte: cooldownCutoff },
    },
    { sort: { submittedAt: -1 } },
  );

  if (recentFail) {
    const retryAt = new Date(recentFail.submittedAt.getTime() + COOLDOWN_AFTER_FAIL_MINS * 60 * 1000);
    const minsLeft = Math.ceil((retryAt - Date.now()) / 60000);
    return { allowed: false, reason: `Cooldown active. Retry in ${minsLeft} minute${minsLeft !== 1 ? "s" : ""}.` };
  }

  return { allowed: true };
};

// ── Generate attempt ──────────────────────────────────────────

export const generateAttempt = async (db, userId, path, layer) => {
  const limits = await checkAttemptLimits(db, userId, path, layer);
  if (!limits.allowed) {
    const err = new Error(limits.reason);
    err.status = 429;
    throw err;
  }

  const bank = await getQuestionBank(db, path, layer);
  if (!bank || !bank.questions?.length) {
    const err = new Error("No question bank found for this layer. Please check back soon.");
    err.status = 404;
    throw err;
  }

  // sample QUESTIONS_PER_EXAM questions randomly
  const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_EXAM, shuffled.length));

  const now = new Date();
  const attempt = {
    userId: new ObjectId(userId),
    path,
    layer,
    questions: selected, // stored WITH answerIdx server-side
    startedAt: now,
    expiresAt: new Date(now.getTime() + TIME_LIMIT_SECS * 1000),
    submitted: false,
    submittedAt: null,
    passed: null,
  };

  const collection = db.collection("exam_attempts");
  const result = await collection.insertOne(attempt);
  const attemptId = result.insertedId.toString();

  // return questions WITHOUT answerIdx
  const clientQuestions = selected.map(({ answerIdx: _A, ...rest }) => rest); // eslint-disable-line no-unused-vars

  return {
    attemptId,
    timeLimitSecs: TIME_LIMIT_SECS,
    passThreshold: PASS_THRESHOLD,
    questions: clientQuestions,
  };
};

// ── Submit attempt ────────────────────────────────────────────

export const submitAttempt = async (db, userId, attemptId, clientAnswers) => {
  const collection = db.collection("exam_attempts");

  const attempt = await collection.findOne({
    _id: new ObjectId(attemptId),
    userId: new ObjectId(userId),
  });

  if (!attempt) {
    const err = new Error("Attempt not found.");
    err.status = 404;
    throw err;
  }

  if (attempt.submitted) {
    const err = new Error("This attempt has already been submitted.");
    err.status = 409;
    throw err;
  }

  if (new Date() > attempt.expiresAt) {
    await collection.updateOne(
      { _id: attempt._id },
      { $set: { submitted: true, submittedAt: new Date(), timedOut: true } },
    );
    const err = new Error("Time limit exceeded.");
    err.status = 410;
    throw err;
  }

  // grade server-side
  const results = attempt.questions.map((q) => {
    const given = clientAnswers[q.id];
    const correct = given === q.answerIdx;
    return {
      id: q.id,
      topic: q.topic,
      stem: q.stem,
      correct,
      yourAnswer: given != null ? q.choices[given] : "skipped",
      correctAnswer: q.choices[q.answerIdx],
    };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const score = Math.round((correctCount / attempt.questions.length) * 100);
  const passed = score >= PASS_THRESHOLD;
  const missedTopics = results.filter((r) => !r.correct).map((r) => r.topic);
  const timeTakenSecs = Math.round((Date.now() - attempt.startedAt.getTime()) / 1000);

  // mark attempt submitted
  await collection.updateOne(
    { _id: attempt._id },
    { $set: { submitted: true, submittedAt: new Date(), score, passed } },
  );

  // save to exam history
  await saveExamResult(db, userId, {
    path: attempt.path,
    layer: attempt.layer,
    score,
    passed,
    totalQuestions: attempt.questions.length,
    correctAnswers: correctCount,
    missedTopics,
    timeTakenSecs,
  });

  // save weak spots for missed topics
  if (missedTopics.length > 0) {
    await Promise.all(
      missedTopics.map((topic) =>
        addWeakSpot(db, userId, { topic, path: attempt.path, layer: attempt.layer, source: "exam" }),
      ),
    );
  }

  // unlock next layer if passed
  if (passed) {
    await updateUserProgress(db, userId, {
      [`layerProgress.${attempt.layer}`]: "done",
    });
  }

  return { score, passed, correctCount, total: attempt.questions.length, missedResults: results.filter((r) => !r.correct) };
};
