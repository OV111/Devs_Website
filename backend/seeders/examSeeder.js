/**
 * Exam Question Bank Seeder — powered by Groq (llama-3.3-70b-versatile)
 *
 * Usage:
 *   GROQ_API_KEY=... MONGO_URI=... node backend/seeders/examSeeder.js
 *
 * Generates 15 MCQ questions per layer, stores them in exam_question_banks.
 * REVIEW the output in MongoDB before opening exams to users.
 *
 * To re-seed a layer, delete its doc from exam_question_banks first.
 */

import Groq from "groq-sdk";
import { MongoClient } from "mongodb";
import process from "process";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const GROQ_MODEL = "openai/gpt-oss-120b";
const QUESTIONS_PER_LAYER = 15;

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

const generateQuestionsForLayer = async (layer, path) => {
  const topicList = layer.topics.join("\n- ");

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

Generate exactly ${QUESTIONS_PER_LAYER} multiple-choice questions that test genuine understanding — not trivia or memorization. Each question should test a concept a working developer must know.

Rules:
- 4 choices each (indices 0–3)
- Exactly one correct answer
- Distractors must be plausible — not obviously wrong
- No trick questions
- Vary difficulty: ~5 easy, ~7 medium, ~3 hard
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

  // ensure IDs are unique across layers
  return questions.map((q, i) => ({ ...q, id: `${layer.id}-q${i + 1}` }));
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
      if (existing) {
        console.log(`  ⏭  "${layer.title}" already seeded — skipping (delete doc to regenerate)`);
        continue;
      }

      console.log(`  ⏳  Generating: "${layer.title}"...`);
      const questions = await generateQuestionsForLayer(layer, path);

      if (!questions) {
        console.log(`  ✗  Skipping "${layer.title}" due to generation error\n`);
        continue;
      }

      await col.insertOne({
        path,
        layer: layer.id,
        layerTitle: layer.title,
        questions,
        model: GROQ_MODEL,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`  ✓  ${questions.length} questions saved for "${layer.title}"\n`);

      // ~2500-3000 tokens/call against an 8000 TPM free-tier cap means >3
      // calls/minute 429s — pace at ~22s so we stay under it proactively
      // instead of relying on the retry backoff for every other call.
      await new Promise((r) => setTimeout(r, 22000));
    }
  }

  await mongo.close();
  console.log("Done. REVIEW questions in MongoDB before opening exams to users.");
};

seed().catch((err) => {
  console.error("Seeder failed:", err.message);
  process.exit(1);
});
