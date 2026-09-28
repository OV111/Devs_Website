import { getGroqClient } from "../config/groq.js";

// Same model family as the exam seeder / AI agent. Grading is scoped to the
// rubric's own criteria/levels so the model is checking against a list, not
// judging freely — see rubricService.js for the schema this depends on.
const MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are a strict technical evaluator grading a developer's spoken/written explanation of a concept against a fixed rubric.

Score ONLY using the exact levels given for each criterion — do not invent new levels or partial scores between them. Base every score on evidence actually present in the learner's answer; if something isn't mentioned, it cannot be credited. Also check the answer against the known misconceptions list and flag any that are present.

Return ONLY valid JSON — no markdown fences, no explanation outside the JSON.`;

const buildUserPrompt = (rubric, answerText) => {
  const criteriaBlock = rubric.criteria
    .map(
      (c) =>
        `Criterion "${c.id}" (${c.label}): ${c.description}\n` +
        c.levels.map((l) => `  ${l.score}: ${l.description}`).join("\n"),
    )
    .join("\n\n");

  const misconceptionsBlock = (rubric.misconceptions || [])
    .map((m) => `- ${m.id}: ${m.description}`)
    .join("\n");

  return `Topic: ${rubric.topic}

Rubric criteria:
${criteriaBlock}

Known misconceptions to check for:
${misconceptionsBlock || "(none listed)"}

Learner's explanation:
"""
${answerText}
"""

Return JSON in exactly this shape:
{
  "criteria": [
    { "id": "criterion-id", "score": 0, "evidence": "quote or paraphrase from the answer justifying this score", "feedback": "one sentence" }
  ],
  "misconceptionsDetected": ["misconception-id"]
}`;
};

const stripFences = (raw) =>
  raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

export const evaluateTeachBack = async (rubric, answerText) => {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    max_tokens: 2048,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(rubric, answerText) },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const json = stripFences(raw);

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    const err = new Error("Evaluator returned invalid JSON.");
    err.status = 502;
    throw err;
  }

  if (!Array.isArray(parsed.criteria)) {
    const err = new Error("Evaluator response missing criteria array.");
    err.status = 502;
    throw err;
  }

  // clamp scores into each criterion's valid range — the app owns mastery
  // math, never trust the LLM's number unchecked
  const byId = Object.fromEntries(rubric.criteria.map((c) => [c.id, c]));
  const criteria = parsed.criteria
    .filter((r) => byId[r.id])
    .map((r) => {
      const maxScore = Math.max(...byId[r.id].levels.map((l) => l.score));
      const score = Math.min(Math.max(Number(r.score) || 0, 0), maxScore);
      return { id: r.id, label: byId[r.id].label, score, maxScore, evidence: r.evidence || "", feedback: r.feedback || "" };
    });

  return {
    criteria,
    misconceptionsDetected: Array.isArray(parsed.misconceptionsDetected) ? parsed.misconceptionsDetected : [],
  };
};

const FOLLOW_UP_SYSTEM_PROMPT = `You are a technical interviewer asking one targeted follow-up question to test whether a developer's understanding of a specific weak point is genuine, not memorized.

Return ONLY valid JSON — no markdown fences, no explanation outside the JSON.`;

/**
 * One follow-up question, scoped to the single weakest criterion (plus any
 * misconception hit) — never the whole topic. Mirrors section 11 of the
 * architecture: Concept + Weak Objective + Misconception + Prior Answer.
 */
export const generateFollowUp = async (rubric, weakCriterion, misconceptionsDetected, answerText) => {
  const groq = getGroqClient();

  const misconceptionDetail = (rubric.misconceptions || [])
    .filter((m) => misconceptionsDetected.includes(m.id))
    .map((m) => `- ${m.description}`)
    .join("\n");

  const prompt = `Topic: ${rubric.topic}

Weak criterion: "${weakCriterion.label}" — ${weakCriterion.feedback}
Scored ${weakCriterion.score}/${weakCriterion.maxScore}.

${misconceptionDetail ? `Detected misconception(s):\n${misconceptionDetail}\n` : ""}
Learner's original explanation:
"""
${answerText}
"""

Write ONE short, specific follow-up question that would reveal whether the learner actually understands "${weakCriterion.label}", the way a real technical interviewer would probe a shaky answer. Do not just re-ask the original question. Do not give away the answer.

Return JSON in exactly this shape:
{ "question": "..." }`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    max_tokens: 300,
    messages: [
      { role: "system", content: FOLLOW_UP_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const json = stripFences(raw);

  try {
    const parsed = JSON.parse(json);
    if (typeof parsed.question === "string" && parsed.question.trim()) {
      return parsed.question.trim();
    }
  } catch {
    // fall through to fallback below
  }

  return `Can you go deeper on "${weakCriterion.label}" — specifically, why does that matter in practice?`;
};
