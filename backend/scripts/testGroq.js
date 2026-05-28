import dotenv from "dotenv";
import {process} from "process";
dotenv.config({ path: "./backend/.env" });

import { getGroqClient } from "../config/groq.js";

async function testGroq() {
  console.log("Testing Groq connection...\n");

  // 1. check env
  if (!process.env.GROQ_API_KEY) {
    console.error("❌  GROQ_API_KEY not found in backend/.env");
    process.exit(1);
  }
  console.log("✅  GROQ_API_KEY found");

  // 2. test basic response
  try {
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Reply with exactly: DevsWebs agent ready." }],
      max_tokens: 20,
    });
    const text = response.choices[0].message.content;
    console.log("✅  Groq responded:", text.trim());
  } catch (err) {
    console.error("❌  Groq call failed:", err.message);
    process.exit(1);
  }

  // 3. test streaming
  try {
    const groq = getGroqClient();
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Count to 3, one number per line." }],
      stream: true,
      max_tokens: 20,
    });
    process.stdout.write("✅  Streaming works: ");
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(text);
    }
    console.log("\n");
  } catch (err) {
    console.error("❌  Streaming failed:", err.message);
    process.exit(1);
  }

  console.log("All checks passed — Groq is ready to use.");
}

testGroq();
