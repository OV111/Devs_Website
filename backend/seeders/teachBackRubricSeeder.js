/**
 * Teach-Back Rubric Seeder
 *
 * Usage:
 *   MONGO_URI=... node backend/seeders/teachBackRubricSeeder.js
 *
 * Rubrics are hand-authored (not LLM-generated) — grading quality depends on
 * these being accurate, so edit RUBRICS directly and re-run to update.
 *
 * MISCONCEPTIONS LIVE IN conceptSeeder.js, not here (Stage 3). `getRubric`
 * hydrates them from the matching concept, so one authored list drives both
 * grading and teaching. A `misconceptions` array left on a rubric below is only a
 * fallback for topics whose concept has not been authored yet.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";

// Same env files, in the same order, as backend/server.js.
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const RUBRICS = [
  {
    path: "backend",
    layer: "layer-6",
    topic: "JWT Signature",
    criteria: [
      {
        id: "signature-purpose",
        label: "Purpose",
        description: "Why a JWT is signed",
        levels: [
          { score: 0, description: "Does not understand the purpose of a signature." },
          { score: 1, description: "Knows JWT contains a signature but cannot explain why." },
          { score: 2, description: "Correctly explains that the signature allows integrity/authenticity verification." },
          { score: 3, description: "Clearly explains signing, verification, integrity, and security implications." },
        ],
      },
      {
        id: "signing-vs-encryption",
        label: "Signing vs Encryption",
        description: "Distinguishing signing from encryption",
        levels: [
          { score: 0, description: "Confuses signing and encryption." },
          { score: 1, description: "Recognizes they are different but cannot explain how." },
          { score: 2, description: "Correctly distinguishes signing from encryption." },
          { score: 3, description: "Correctly distinguishes them and explains practical security implications." },
        ],
      },
      {
        id: "verification",
        label: "Verification",
        description: "How signature verification works",
        levels: [
          { score: 0, description: "Incorrect explanation." },
          { score: 1, description: "Basic understanding of verification." },
          { score: 2, description: "Correctly explains that the server verifies the signature." },
          { score: 3, description: "Can reason through what happens when a signed token is modified." },
        ],
      },
    ],
    // Misconceptions intentionally omitted — authored in conceptSeeder.js under
    // the "jwt-signature" concept and hydrated by getRubric.
  },
];

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");

  console.log("Connected to MongoDB.\n");

  // Writes through the service rather than hand-rolling the update, so the
  // seeder cannot drift from the real write shape — that is how `topicSlug`
  // ended up missing from seeded rubrics in the first place.
  const { upsertRubric } = await import("../services/rubricService.js");

  for (const { path, layer, topic, criteria, misconceptions } of RUBRICS) {
    await upsertRubric(db, path, layer, topic, { criteria, misconceptions });
    console.log(`  ✓ Seeded rubric: ${path}/${layer}/${topic}`);
  }

  console.log(`\nDone. Seeded ${RUBRICS.length} rubric(s).`);
  await mongo.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
