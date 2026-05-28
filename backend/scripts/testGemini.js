import dotenv from "dotenv";
import {process} from "process";
dotenv.config({ path: "./backend/.env" });

import { getGeminiModel } from "../config/gemini.js";

async function testGemini() {
  console.log("Testing Gemini connection...\n");

  // 1. check env
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌  GEMINI_API_KEY not found in backend/.env");
    process.exit(1);
  }
  console.log("✅  GEMINI_API_KEY found");

  // 2. test basic response
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(
      "Reply with exactly one sentence: DevsWebs agent ready."
    );
    const text = result.response.text();
    console.log("✅  Gemini responded:", text.trim());
  } catch (err) {
    console.error("❌  Gemini call failed:", err.message);
    process.exit(1);
  }

  // 3. test streaming
  try {
    const model = getGeminiModel();
    const result = await model.generateContentStream("Count to 3, one word per line.");
    process.stdout.write("✅  Streaming works: ");
    for await (const chunk of result.stream) {
      process.stdout.write(chunk.text());
    }
    console.log("\n");
  } catch (err) {
    console.error("❌  Streaming failed:", err.message);
    process.exit(1);
  }

  console.log("All checks passed — Gemini is ready to use.");
}

testGemini();
