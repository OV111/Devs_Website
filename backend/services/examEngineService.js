import { ObjectId } from "mongodb";
import { saveExamResult } from "./examHistoryService.js";
import { addWeakSpot, resolveWeakSpot } from "./weakSpotService.js";
import { updateUserProgress } from "./userProgressService.js";
import { getRubric, listRubricsForLayer } from "./rubricService.js";
import { evaluateTeachBack, generateFollowUp } from "./teachBackEvaluatorService.js";
import { toTopicSlug } from "../utils/topicKey.js";
import { recomputeMastery } from "./learnerMasteryService.js";

/**
 * Refresh the Adaptive Engine's view of this learner after new evidence lands.
 *
 * Deliberately swallows its own errors: mastery is derived data that the next
 * write will recompute anyway, so a hiccup here must never fail the submission
 * the learner just made. Awaited rather than fired-and-forgotten so the response
 * cannot race the recompute — a learner who submits an exam and is immediately
 * shown their next step must not see the pre-submission answer.
 */
const refreshMastery = async (db, userId) => {
  try {
    await recomputeMastery(db, userId);
  } catch (err) {
    console.error("mastery recompute failed (derived data, will self-heal):", err);
  }
};

const TIME_LIMIT_SECS = 600;
const QUESTIONS_PER_EXAM = 15; // = QUESTIONS_PER_LAYER in examSeeder.js — serve the full bank
const MAX_ATTEMPTS_PER_DAY = 3;
const COOLDOWN_AFTER_FAIL_MINS = 30;
const COOLDOWN_ENABLED = false; // TEMP: off while developing the exam UI — set back to true before shipping
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

  if (!COOLDOWN_ENABLED) return { allowed: true };

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

// Fisher–Yates. `sort(() => Math.random() - 0.5)` is not uniform: the comparator
// is inconsistent, so engines produce biased orderings.
export const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const shuffleChoices = (question) => {
  const order = shuffle(question.choices.map((_, i) => i));
  return {
    ...question,
    choices: order.map((i) => question.choices[i]),
    answerIdx: order.indexOf(question.answerIdx),
  };
};

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

  // Sample questions, then shuffle each one's choices so the correct answer's
  // position is uniform no matter how the bank was authored (LLM-generated
  // banks skew heavily toward "A"). answerIdx is remapped to the new order;
  // the attempt stores this shuffled copy, so grading stays consistent.
  const selected = shuffle(bank.questions)
    .slice(0, QUESTIONS_PER_EXAM)
    .map(shuffleChoices);

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

  // save weak spots for missed topics — dedupe first: addWeakSpot's own
  // existing-doc check is a separate findOne + insert/update, not atomic, so
  // firing it twice for the same topic in one Promise.all (e.g. two missed
  // questions sharing a topic) is a real race — both calls see "no existing
  // doc" and both insert, leaving duplicate weakSpots rows for one topic.
  const uniqueMissedTopics = [...new Set(missedTopics)];
  if (uniqueMissedTopics.length > 0) {
    await Promise.all(
      uniqueMissedTopics.map((topic) =>
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

  // Must run after saveExamResult and addWeakSpot — it reads what they wrote.
  await refreshMastery(db, userId);

  // One query for the whole layer rather than a getRubric() per missed topic —
  // rubric coverage is still thin (hand-authored, see teachBackRubricSeeder.js),
  // so the client needs to know which "Teach it back" buttons will actually
  // work instead of showing one for every miss and failing silently on submit.
  const layerRubrics = await listRubricsForLayer(db, attempt.path, attempt.layer);
  const rubricTopics = new Set(layerRubrics.map((r) => r.topic));
  const missedResults = results
    .filter((r) => !r.correct)
    .map((r) => ({ ...r, hasRubric: rubricTopics.has(r.topic) }));

  return { score, passed, correctCount, total: attempt.questions.length, missedResults };
};

// ── Teach-Back (rubric-based, free-form explanation) ────────────

const TEACH_BACK_PASS_RATIO = 0.7;

export const submitTeachBack = async (db, userId, { path, layer, topic, answerText }) => {
  const rubric = await getRubric(db, path, layer, topic);
  if (!rubric) {
    const err = new Error("No rubric found for this topic.");
    err.status = 404;
    throw err;
  }

  const { criteria, misconceptionsDetected } = await evaluateTeachBack(rubric, answerText);

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = maxScore > 0 && totalScore / maxScore >= TEACH_BACK_PASS_RATIO;
  const weakCriteria = criteria.filter((c) => c.score / c.maxScore < TEACH_BACK_PASS_RATIO);

  // Ask about the single weakest criterion only — a follow-up shouldn't
  // re-probe everything, just the one gap that most needs testing.
  let followUp = null;
  if (weakCriteria.length > 0) {
    const weakest = [...weakCriteria].sort((a, b) => a.score / a.maxScore - b.score / b.maxScore)[0];
    const question = await generateFollowUp(rubric, weakest, misconceptionsDetected, answerText);
    followUp = { criterionId: weakest.id, question };
  }

  const session = {
    userId: new ObjectId(userId),
    path,
    layer,
    topic,
    // Canonical key — this is the field LearnerContext joins on to pair a
    // teach-back score with the exam score for the same topic, which is the
    // whole basis of the "passed the exam but can't explain it" signal.
    topicSlug: toTopicSlug(topic),
    rubricVersion: rubric.version,
    answerText,
    criteria,
    misconceptionsDetected,
    score,
    passed,
    pendingFollowUp: followUp,
    startedAt: new Date(),
  };
  const result = await db.collection("teach_back_sessions").insertOne(session);

  await saveExamResult(db, userId, {
    path,
    layer,
    score,
    passed,
    totalQuestions: criteria.length,
    correctAnswers: criteria.filter((c) => c.score === c.maxScore).length,
    missedTopics: weakCriteria.length > 0 ? [topic] : [],
    timeTakenSecs: null,
  });

  if (weakCriteria.length > 0) {
    await addWeakSpot(db, userId, { topic, path, layer, source: "teach_back" });
  } else if (passed) {
    await resolveWeakSpot(db, userId, topic);
  }

  // Teach-back is the strongest signal the engine has, so this is the recompute
  // that matters most — it is what flips a topic the learner "passed" to shaky.
  await refreshMastery(db, userId);

  return { sessionId: result.insertedId, score, passed, criteria, misconceptionsDetected, followUp };
};

// ── Teach-Back follow-up (re-scores one criterion only) ─────────

export const submitTeachBackFollowUp = async (db, userId, { sessionId, answerText }) => {
  const sessions = db.collection("teach_back_sessions");
  const session = await sessions.findOne({ _id: new ObjectId(sessionId), userId: new ObjectId(userId) });

  if (!session) {
    const err = new Error("Teach-back session not found.");
    err.status = 404;
    throw err;
  }
  if (!session.pendingFollowUp) {
    const err = new Error("No follow-up question pending for this session.");
    err.status = 409;
    throw err;
  }

  const rubric = await getRubric(db, session.path, session.layer, session.topic);
  if (!rubric) {
    const err = new Error("No rubric found for this topic.");
    err.status = 404;
    throw err;
  }

  const criterionId = session.pendingFollowUp.criterionId;
  const criterionDef = rubric.criteria.find((c) => c.id === criterionId);

  // Score only the targeted criterion — build a single-criterion rubric so
  // the evaluator can't drift into re-grading everything else.
  const miniRubric = { ...rubric, criteria: [criterionDef] };
  const { criteria: rescored, misconceptionsDetected: followUpMisconceptions } = await evaluateTeachBack(
    miniRubric,
    answerText,
  );
  const updatedCriterion = rescored.find((c) => c.id === criterionId);

  const mergedCriteria = session.criteria.map((c) => (c.id === criterionId ? updatedCriterion ?? c : c));
  const mergedMisconceptions = Array.from(
    new Set([...session.misconceptionsDetected, ...followUpMisconceptions]),
  );

  const totalScore = mergedCriteria.reduce((sum, c) => sum + c.score, 0);
  const maxScore = mergedCriteria.reduce((sum, c) => sum + c.maxScore, 0);
  const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = maxScore > 0 && totalScore / maxScore >= TEACH_BACK_PASS_RATIO;
  const stillWeak = mergedCriteria.filter((c) => c.score / c.maxScore < TEACH_BACK_PASS_RATIO);

  await sessions.updateOne(
    { _id: session._id },
    {
      $set: {
        criteria: mergedCriteria,
        misconceptionsDetected: mergedMisconceptions,
        score,
        passed,
        pendingFollowUp: null,
        followUpAnswerText: answerText,
      },
    },
  );

  await saveExamResult(db, userId, {
    path: session.path,
    layer: session.layer,
    score,
    passed,
    totalQuestions: mergedCriteria.length,
    correctAnswers: mergedCriteria.filter((c) => c.score === c.maxScore).length,
    missedTopics: stillWeak.length > 0 ? [session.topic] : [],
    timeTakenSecs: null,
  });

  if (stillWeak.length === 0 && passed) {
    await resolveWeakSpot(db, userId, session.topic);
  }

  // A follow-up re-scores the session in place, so mastery has to be refreshed
  // here too — otherwise a learner who cleared the gap on the second attempt
  // stays marked shaky until some unrelated exam triggers a recompute.
  await refreshMastery(db, userId);

  return { sessionId: session._id, score, passed, criteria: mergedCriteria, misconceptionsDetected: mergedMisconceptions };
};
