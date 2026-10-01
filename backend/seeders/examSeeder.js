/**
 * Exam Question Bank Seeder — powered by Groq (llama-3.3-70b-versatile)
 *
 * Usage:
 *   GROQ_API_KEY=... MONGO_URI=... node backend/seeders/examSeeder.js
 *
 * Grows each layer's bank to QUESTIONS_PER_LAYER MCQs in batches, stored in
 * exam_question_banks. The exam serves a random 15, so a bank larger than 15
 * is what stops learners memorising the whole exam across attempts.
 *
 * Existing banks are topped up, not replaced: questions you already reviewed
 * are kept, and new ones are appended. REVIEW the new questions in MongoDB
 * before opening exams to users.
 *
 * To regenerate a layer from scratch, delete its doc from exam_question_banks first.
 */

import Groq from "groq-sdk";
import { MongoClient } from "mongodb";
import process from "process";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const GROQ_MODEL = "openai/gpt-oss-120b";
const QUESTIONS_PER_LAYER = 60; // target bank size; the exam serves a random 15 of these
// One call per 15 questions: 60 at once would exceed max_tokens, and a single
// request larger than the free tier's 8000 TPM can never succeed, retries or not.
const QUESTIONS_PER_CALL = 15;
const PACE_MS = 35000; // calls now carry the existing stems too (~4k tokens), so pace under 8000 TPM

// ── Which tracks to seed ──────────────────────────────────────
// layers: null = all layers in the track; or pass an array of layer IDs
const SEED_CONFIG = [
  { path: "backend", file: "backend.json", trackId: "api-dev", layers: null },
  { path: "backend", file: "backend.json", trackId: "node-dev", layers: null },
  { path: "backend", file: "backend.json", trackId: "python-backend", layers: null },
  { path: "backend", file: "backend.json", trackId: "db-engineer", layers: null },
  // { path: "fullstack", file: "fullstack.json", trackId: "mern", layers: null },
];

// ── Groq question generation ──────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Free tier is capped at 8000 TPM for this model and one call costs ~2500-3000
// tokens, so bursts of 3+ calls/minute 429. Retry with the server's own
// suggested wait (falls back to a fixed pause) instead of guessing a fixed
// delay that either wastes time when Groq isn't busy or still 429s when it is.
const withRateLimitRetry = async (fn, { retries = 5 } = {}) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status ?? err?.response?.status;
      if (status !== 429 || attempt === retries) throw err;

      const msg = err?.error?.message ?? err?.message ?? "";
      const match = msg.match(/try again in ([\d.]+)(m?s)/i);
      const waitMs = match
        ? (match[2] === "ms" ? parseFloat(match[1]) : parseFloat(match[1]) * 1000)
        : 15000;
      const padded = Math.ceil(waitMs) + 1000; // small buffer over the server's own estimate

      console.log(`  ⏸  Rate limited — waiting ${Math.round(padded / 1000)}s before retry ${attempt + 1}/${retries}...`);
      await new Promise((r) => setTimeout(r, padded));
    }
  }
};

// A malformed question would crash or silently break a live exam, so drop it
// here rather than trusting the model's JSON shape.
const isValidQuestion = (q) =>
  typeof q?.stem === "string" && q.stem.trim() !== "" &&
  Array.isArray(q.choices) && q.choices.length === 4 &&
  q.choices.every((c) => typeof c === "string" && c.trim() !== "") &&
  Number.isInteger(q.answerIdx) && q.answerIdx >= 0 && q.answerIdx <= 3;

const normalizeStem = (stem) => stem.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const generateQuestionsForLayer = async (layer, path, count, avoidStems = []) => {
  const topicList = layer.topics.join("\n- ");
  // Without this the model happily regenerates the questions already in the
  // bank, and the bank grows in size but not in variety.
  const avoidBlock = avoidStems.length
    ? `\n\nThe bank already contains these questions. Do NOT repeat or rephrase them; cover different angles:\n- ${avoidStems.join("\n- ")}`
    : "";

  const completion = await withRateLimitRetry(() => groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.4,
    max_tokens: 8192,
    messages: [
      {
        role: "system",
        content:
          "You are a senior developer writing a technical exam question bank for a developer learning platform. Return ONLY a valid JSON array — no explanation, no markdown fences, no preamble.",
      },
      {
        role: "user",
        content: `Layer: "${layer.title}" (${path} path)
Topics covered:
- ${topicList}

Generate exactly ${count} multiple-choice questions that test genuine understanding — not trivia or memorization. Each question should test a concept a working developer must know.${avoidBlock}

Rules:
- 4 choices each (indices 0–3)
- Exactly one correct answer
- Distractors must be plausible — not obviously wrong
- No trick questions
- Vary difficulty: about one third easy, half medium, the rest hard
- Cover different topics across the set

Return a JSON array ONLY:
[
  {
    "id": "q1",
    "stem": "question text",
    "topic": "topic name from the list above",
    "choices": ["choice A", "choice B", "choice C", "choice D"],
    "answerIdx": 0
  }
]`,
      },
    ],
  }));

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";

  // strip markdown fences if model adds them
  const json = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let questions;
  try {
    questions = JSON.parse(json);
  } catch {
    console.error(`  ✗ Failed to parse JSON for layer "${layer.title}"`);
    console.error("  Raw output (first 400 chars):", raw.slice(0, 400));
    return null;
  }

  if (!Array.isArray(questions)) {
    console.error(`  ✗ Expected array for layer "${layer.title}", got: ${typeof questions}`);
    return null;
  }

  // IDs are assigned by the caller, which knows what is already in the bank
  return questions.filter(isValidQuestion);
};

// Next free `<layer>-qN` number. Uses the highest existing N, not the count,
// so a bank with hand-deleted questions never reuses an ID.
const nextQuestionNumber = (layerId, questions) => {
  const idPattern = new RegExp(`^${layerId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-q(\\d+)$`);
  const nums = questions
    .map((q) => Number(q.id?.match(idPattern)?.[1]))
    .filter(Number.isFinite);
  return (nums.length ? Math.max(...nums) : 0) + 1;
};

// ── Main seeder ───────────────────────────────────────────────

const seed = async () => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY env var is required");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");
  const col = db.collection("exam_question_banks");

  console.log("Connected to MongoDB.\n");

  for (const { path, file, trackId, layers: layerFilter } of SEED_CONFIG) {
    const filePath = join(__dirname, "../../src/data/roadmaps", file);
    const raw = await readFile(filePath, "utf-8");
    const roadmapData = JSON.parse(raw);

    const allLayers = roadmapData[trackId];
    if (!allLayers) {
      console.error(`✗ Track "${trackId}" not found in ${file}`);
      continue;
    }

    const targetLayers = layerFilter
      ? allLayers.filter((l) => layerFilter.includes(l.id))
      : allLayers;

    console.log(`Seeding ${targetLayers.length} layers for "${path}/${trackId}"...\n`);

    for (const layer of targetLayers) {
      const existing = await col.findOne({ path, layer: layer.id });
      const current = existing?.questions ?? [];
      if (current.length >= QUESTIONS_PER_LAYER) {
        console.log(`  ⏭  "${layer.title}" already has ${current.length} questions — skipping`);
        continue;
      }

      console.log(`  ⏳  "${layer.title}": ${current.length} → ${QUESTIONS_PER_LAYER} questions...`);
      const seen = new Set(current.map((q) => normalizeStem(q.stem)));
      const added = [];

      while (current.length + added.length < QUESTIONS_PER_LAYER) {
        const count = Math.min(QUESTIONS_PER_CALL, QUESTIONS_PER_LAYER - current.length - added.length);
        const avoidStems = [...current, ...added].map((q) => q.stem);
        const batch = await generateQuestionsForLayer(layer, path, count, avoidStems);

        // ~4k tokens/call against an 8000 TPM free-tier cap — pace proactively
        // instead of relying on the retry backoff for every other call.
        await new Promise((r) => setTimeout(r, PACE_MS));

        if (!batch) break;
        const fresh = batch.filter((q) => {
          const key = normalizeStem(q.stem);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        // A batch of nothing but duplicates means the model has run out of
        // angles for this layer; stop rather than loop forever.
        if (!fresh.length) break;
        added.push(...fresh.slice(0, count));
      }

      if (!added.length) {
        console.log(`  ✗  No new questions for "${layer.title}"\n`);
        continue;
      }

      let n = nextQuestionNumber(layer.id, current);
      // `reviewed: false` marks what still needs a human check of its answer key
      const newQuestions = added.map((q) => ({ ...q, id: `${layer.id}-q${n++}`, reviewed: false }));

      if (existing) {
        await col.updateOne(
          { _id: existing._id },
          { $push: { questions: { $each: newQuestions } }, $set: { model: GROQ_MODEL, updatedAt: new Date() } },
        );
      } else {
        await col.insertOne({
          path,
          layer: layer.id,
          layerTitle: layer.title,
          questions: newQuestions,
          model: GROQ_MODEL,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`  ✓  +${newQuestions.length} questions for "${layer.title}" (now ${current.length + newQuestions.length})\n`);
    }
  }

  await mongo.close();
  console.log("Done. REVIEW questions in MongoDB before opening exams to users.");
};

seed().catch((err) => {
  console.error("Seeder failed:", err.message);
  process.exit(1);
});
