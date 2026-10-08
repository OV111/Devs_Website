/**
 * LLM-as-judge eval for the AI Mentor.
 *
 * Usage:
 *   npm run eval:mentor                      # all cases
 *   npm run eval:mentor -- --category=socratic
 *   npm run eval:mentor -- --id=socratic-01
 *
 * Costs Groq tokens and is non-deterministic, so it is NOT part of test:unit.
 * Results are saved to backend/evals/results/ so runs can be compared.
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const { EvalCases } = await import("../evals/mentor/schemas.js");
const { runMentor } = await import("../evals/mentor/runMentor.js");
const { judge, JUDGE_MODEL } = await import("../evals/mentor/judge.js");
const { printReport, summarize } = await import("../evals/mentor/report.js");
const { MODEL } = await import("../services/agent/streamService.js");

const dir = path.dirname(fileURLToPath(import.meta.url));
const CONCURRENCY = 1; // on-demand tier is 8k tokens/min; raise only on a paid tier

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];

const runCase = async (c) => {
  try {
    const reply = await runMentor(c);
    const verdict = await judge(c, reply);
    return { id: c.id, category: c.category, reply, ...verdict };
  } catch (err) {
    return { id: c.id, category: c.category, error: err.message };
  }
};

// Tiny worker pool: N workers pull from a shared index.
const pool = async (items, worker, size) => {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i]);
        process.stdout.write(".");
      }
    }),
  );
  return out;
};

const main = async () => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing from backend/.env");

  let cases = EvalCases.parse(
    JSON.parse(fs.readFileSync(path.join(dir, "../evals/mentor/cases.json"), "utf8")),
  );
  const category = arg("category");
  const id = arg("id");
  if (category) cases = cases.filter((c) => c.category === category);
  if (id) cases = cases.filter((c) => c.id === id);
  if (!cases.length) throw new Error("No cases matched the filter");

  console.log(`Mentor: ${MODEL} | Judge: ${JUDGE_MODEL} | ${cases.length} cases`);
  const results = await pool(cases, runCase, CONCURRENCY);
  const overall = printReport(results);

  const outDir = path.join(dir, "../evals/results");
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ mentorModel: MODEL, judgeModel: JUDGE_MODEL, overall, ...summarize(results), results }, null, 2),
  );
  console.log(`Saved ${path.relative(process.cwd(), file)}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
