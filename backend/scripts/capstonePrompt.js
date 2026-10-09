/**
 * Generate a ChatGPT prompt that writes capstone briefs for every track of a
 * roadmap category that does not have one yet.
 *
 * Usage:
 *   npm run capstone:prompt -- <category>      e.g.  npm run capstone:prompt -- blockchain
 *
 * Writes docs/capstone-prompts/<category>.md. The prompt embeds the REAL
 * layer ids of each track (so the model cannot invent them), a real brief as
 * the format example, and every rule the brief tests enforce — plus the
 * lessons from earlier batches (test checks that match the stack's own test
 * file names, mandatory CI, no repeated twist ideas).
 *
 * Workflow: paste the prompt into ChatGPT → paste its whole answer into
 * docs/capstone-prompts/<category>-output.md → ask Claude to split, test and
 * review it.
 */

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";
import { briefs } from "../seeders/capstones/index.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const category = process.argv[2];
if (!category) {
  console.error("Usage: npm run capstone:prompt -- <category>");
  process.exit(1);
}

const roadmapFile = path.join(root, "src/data/roadmaps", `${category}.json`);
if (!fs.existsSync(roadmapFile)) {
  const available = fs
    .readdirSync(path.join(root, "src/data/roadmaps"))
    .map((f) => f.replace(".json", ""));
  console.error(
    `Unknown category "${category}". Available: ${available.join(", ")}`,
  );
  process.exit(1);
}
const roadmap = JSON.parse(fs.readFileSync(roadmapFile, "utf8"));

// Track titles live in the frontend constants.
const titles = Object.fromEntries(
  [
    ...fs
      .readFileSync(path.join(root, "constants/roadmapPaths.js"), "utf8")
      .matchAll(/id: "([^"]+)",\s*\r?\n\s*title: "([^"]+)"/g),
  ].map((m) => [m[1], m[2]]),
);

const done = new Set(briefs.map((b) => b.trackId));
const tracks = Object.keys(roadmap).filter((t) => !done.has(t));
if (tracks.length === 0) {
  console.log(`Every ${category} track already has a capstone brief.`);
  process.exit(0);
}

// Format example: a brief from the same category if one exists.
const exampleBrief =
  briefs.find((b) => b.categoryId === category) ??
  briefs.find((b) => b.trackId === "api-dev");
const exampleFile = path.join(
  root,
  "backend/seeders/capstones",
  exampleBrief.categoryId,
  `${exampleBrief.trackId}.js`,
);
const example = fs.readFileSync(exampleFile, "utf8").replace(/\r\n/g, "\n");

// Stack-specific file-check hints, so checks match what real projects contain.
const HINTS = {
  blockchain:
    '"src/**/*.sol" or "contracts/**/*.sol" for Solidity, "test/**/*.t.sol" for Foundry tests, "test/**/*.{js,ts}" for Hardhat tests, ' +
    '"foundry.toml" or "hardhat.config.{js,ts}" for the toolchain, "Anchor.toml" and "programs/**/*.rs" for Solana/Anchor, ' +
    '"**/Move.toml" and "**/sources/**/*.move" for Move, "go.mod" and "**/*_test.go" for Go/Cosmos, "Cargo.toml" for Rust',
};
HINTS.mobile =
  '"pubspec.yaml", "lib/**/*.dart" and "test/**/*_test.dart" for Flutter; ' +
  '"app.json" or "app.config.{js,ts}", "**/*.{js,jsx,ts,tsx}" and "**/*.{test,spec}.{js,jsx,ts,tsx}" for React Native / Expo; ' +
  '"Package.swift" or "**/project.pbxproj", "**/*.swift" and "**/*Tests.swift" for iOS / Swift (SwiftUI); ' +
  '"build.gradle.kts", "app/src/main/**/*.kt", "app/src/test/**/*.kt" and "app/src/main/AndroidManifest.xml" for Android / Kotlin; ' +
  '"**/*.csproj", "**/*.xaml", "**/*.cs" and "**/*Tests.cs" for .NET MAUI; ' +
  '"manifest.json" or "**/manifest.webmanifest" and "**/service-worker.{js,ts}" or "**/sw.js" for a PWA; ' +
  '"capacitor.config.{ts,json}" and "ionic.config.json" for Ionic';

// Extra rules that only make sense for one category.
const NOTES = {
  cloud:
    "11. CLOUD / INFRASTRUCTURE: no live cloud account, no billable resources and no paid SaaS (no Datadog, no managed Kubernetes, no real domain). Everything must validate locally (terraform validate, cfn-lint, bicep build, helm lint, LocalStack, Azurite, kind, Miniflare, docker compose), and CI must run those checks with no cloud credentials. State the real-deploy steps as README documentation, not as a graded requirement. Optional twists must also be free.",
  mobile:
    "11. MOBILE: the app must run on an emulator or simulator — no real device, no paid developer account, no app-store or TestFlight publishing, " +
    "no real push-notification or payment credentials (use local stubs or a free backend). The automated tests must run WITHOUT a device or emulator " +
    "(unit and widget tests, e.g. flutter test, Jest, XCTest, JUnit, xUnit), and CI must run them (an iOS project needs a macOS runner). " +
    "Each brief needs at least one requirement about offline or local-data behaviour and one about loading, empty and error states in the UI.",
};
// DevOps tracks have the same constraint as cloud ones.
NOTES.devops = NOTES.cloud;

const defaultHints =
  '"**/schema.prisma" for Prisma, "**/*_spec.rb" for RSpec, "**/test_*.py" for pytest, "**/*_test.go" for Go, "src/test/**/*.java" for JUnit';

const trackBlock = tracks
  .map((t) => {
    const layers = roadmap[t]
      .map(
        (l) =>
          `  - ${l.id} | ${l.title} | topics: ${(l.topics ?? []).slice(0, 4).join("; ")}`,
      )
      .join("\n");
    return `### ${t} — ${titles[t] ?? t}\n${layers}`;
  })
  .join("\n\n");

const prompt = `You are a senior engineer writing CAPSTONE PROJECT BRIEFS for a developer learning platform. A capstone is the final project of a roadmap track: the learner builds a real project in their own public GitHub repo, an AI reviews the code against your rubric, then the learner answers questions about their own code. Your briefs are shown to learners exactly as written and graded against.

Write ONE brief per track listed at the bottom (${tracks.length} tracks). Answer in batches of 3 tracks per reply, in the order listed. After each batch, stop and wait; I will type "next".

## OUTPUT FORMAT — follow exactly
For each track output ONE JavaScript file in its own code block, preceded by the file name on its own line:
FILE: backend/seeders/capstones/${category}/<trackId>.js
The file must have exactly the same structure, imports, field names and field order as this real example${exampleBrief.categoryId === category ? "" : ` (it is from another category — use categoryId "${category}" instead)`}:

\`\`\`js
${example}\`\`\`

## HARD RULES (a test suite rejects the file if any is broken)
1. trackId = the track id exactly as given below. categoryId = "${category}". slug = "<trackId>-<short-project-name>" in kebab-case. version: 1, status: "draft", reviewed: false.
2. rubric: exactly 6 criteria. Weights are integers that sum to EXACTLY 100. Every rubric layerId MUST be copied exactly from THAT track's layer list below — never invent an id, never use another track's id. Pick the layer that teaches that criterion.
3. twistPool: exactly 4 twists with unique ids. Each twist is ONE extra requirement of roughly EQUAL difficulty — each learner gets one at random, so no twist may be a trivial toggle or label while another is real engineering work. Do not reuse the same twist idea across tracks.
4. requirements: 9 to 12, each with a unique kebab-case id. Some have an automated "check" that verifies a FILE EXISTS in the repo. Shared checks you may use (imported from ../shared.js): CHECKS.readme, CHECKS.envExample, CHECKS.ci, CHECKS.compose, CHECKS.dockerfile, CHECKS.jsTests (ONLY for JavaScript/TypeScript test files named *.test.* or *.spec.*), CHECKS.goModule, CHECKS.goTests, CHECKS.cargo, CHECKS.proto. Otherwise write a custom check { type: "file", glob: "<glob>" } — but ONLY if a correct project for that stack would certainly contain a matching file, for example: ${HINTS[category] ?? defaultHints}. Globs match paths from the repo root; use **/ when the folder can vary. A check's "glob" may also be an ARRAY of globs (a file matching any one passes) — use an array instead of a brace alternation whenever an alternative contains "**/" (WRONG: "{docs/**/*.md,**/notes*.md}", RIGHT: ["docs/**/*.md", "**/notes*.md"]), because braces containing "**/" silently match nothing.
5. The "tests" requirement's check MUST match how THAT stack names its test files (e.g. Foundry tests are test/*.t.sol — never use CHECKS.jsTests for a non-JavaScript stack).
6. Every brief MUST include, each with a check: a README, a CI workflow (CHECKS.ci), and tests. Add .env.example or docker compose only where the stack really uses them.
7. Requirements must be concrete and testable ("only the owner can withdraw, enforced in the contract"), never vague ("follows best practices", "secure code").
8. The project must be buildable by one learner in about 2–4 weeks, use THAT track's stack, and be a different idea from every other track. For anything touching real money, the project must run on a local chain or public testnet only.
9. Keep the header comment, write "DRAFT by ChatGPT" in it, and keep this line in it:
   " * ⚠ This track has no exam banks yet, so the seeder refuses to publish it until its layer exams are seeded."
10. Plain JavaScript only: no TypeScript, no comments inside arrays, no text outside the code blocks except the FILE: lines.${NOTES[category] ? `\n${NOTES[category]}` : ""}

## TRACKS (id — title, then the track's real layers: layerId | title | topics)

${trackBlock}
`;

const out = path.join(root, "docs/capstone-prompts", `${category}.md`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, prompt);
console.log(
  `✓ ${path.relative(root, out)} — ${tracks.length} tracks: ${tracks.join(", ")}`,
);
console.log(
  `  Next: paste it into ChatGPT, then paste the full answer into docs/capstone-prompts/${category}-output.md`,
);
