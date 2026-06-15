/**
 * Exam Question Bank Seeder
 *
 * Run AFTER: npm install @anthropic-ai/sdk
 * Usage:    node backend/seeders/examSeeder.js
 *
 * Generates 15 MCQ questions per layer using claude-haiku-4-5,
 * stores them in exam_question_banks collection.
 * REVIEW the output in MongoDB before letting users take exams.
 */

import Anthropic from "@anthropic-ai/sdk";
import { MongoClient } from "mongodb";
import process from "process";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const QUESTIONS_PER_LAYER = 15;

// Which path + layers to seed (expand as needed)
const SEED_CONFIG = [
  { path: "backend", file: "backend.json", trackId: "api-dev", layers: null }, // null = all layers
];

const generateQuestionsForLayer = async (layer, path) => {
  const topicList = layer.topics.join("\n- ");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are writing a technical exam question bank for a developer learning platform.

Layer: "${layer.title}" (${path} path)
Topics covered:
- ${topicList}

Generate exactly ${QUESTIONS_PER_LAYER} multiple-choice questions that test genuine understanding of these topics — not trivia or memorization. Each question should test a concept a working developer must know.

Rules:
- 4 choices each (A/B/C/D)
- Exactly one correct answer
- Distractors must be plausible — not obviously wrong
- No trick questions
- Vary difficulty: ~5 easy, ~7 medium, ~3 hard
- Cover different topics across the question set

Return a JSON array ONLY — no explanation, no markdown, just the raw JSON array:
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
  });

  const raw = message.content[0].text.trim();

  // strip markdown code fences if model adds them
  const json = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

  let questions;
  try {
    questions = JSON.parse(json);
  } catch {
    console.error(`  ✗ Failed to parse JSON for layer "${layer.title}"`);
    console.error("  Raw output:", raw.slice(0, 300));
    return null;
  }

  if (!Array.isArray(questions)) {
    console.error(`  ✗ Expected array for layer "${layer.title}"`);
    return null;
  }

  // re-index ids to be unique across layers
  return questions.map((q, i) => ({ ...q, id: `${layer.id}-q${i + 1}` }));
};

const seed = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI env var is required");
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY env var is required");

  const mongo = new MongoClient(mongoUri);
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
      console.error(`Track "${trackId}" not found in ${file}`);
      continue;
    }

    const targetLayers = layerFilter
      ? allLayers.filter((l) => layerFilter.includes(l.id))
      : allLayers;

    console.log(`Seeding ${targetLayers.length} layers for path "${path}" track "${trackId}"...\n`);

    for (const layer of targetLayers) {
      const existing = await col.findOne({ path, layer: layer.id });
      if (existing) {
        console.log(`  ⏭  Layer "${layer.title}" already seeded — skipping. Delete the doc to regenerate.`);
        continue;
      }

      console.log(`  ⏳  Generating questions for: "${layer.title}"...`);
      const questions = await generateQuestionsForLayer(layer, path);

      if (!questions) continue;

      await col.insertOne({
        path,
        layer: layer.id,
        layerTitle: layer.title,
        questions,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`  ✓  ${questions.length} questions saved for "${layer.title}"`);

      // be polite to the API
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  await mongo.close();
  console.log("\nDone. REVIEW the questions in MongoDB before opening exams to users.");
};

seed().catch((err) => {
  console.error("Seeder failed:", err.message);
  process.exit(1);
});
