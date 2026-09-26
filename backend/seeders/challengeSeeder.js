/**
 * Challenge Seeder — seeds the coding-challenges problem bank.
 *
 * Usage:
 *   MONGO_URI=... node backend/seeders/challengeSeeder.js
 *
 * Content lives one file per problem under backend/seeders/challenges/,
 * grouped by track — see that folder's index.js. This file is only the
 * write path: validation, indexes, and the upsert.
 *
 * Idempotent: upserts keyed on `slug`, so re-running never duplicates and
 * never wipes solve stats.
 *
 * Note on `layerId`: challenges point at a roadmap layer seeded by
 * roadmapSeeder.js. Run that first — this seeder verifies every referenced
 * layer exists and refuses to write orphans.
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB from "../config/db.js";
import { challenges } from "./challenges/index.js";

// ── Write ─────────────────────────────────────────────────────

async function seed() {
  const db = await connectDB();
  const col = db.collection("challenges");

  // Guard: every challenge must point at a layer that actually exists.
  const referenced = [...new Set(challenges.map((c) => c.layerId))];
  const found = await db
    .collection("roadmap_layers")
    .find({ layerId: { $in: referenced } })
    .project({ layerId: 1 })
    .toArray();
  const known = new Set(found.map((l) => l.layerId));
  const missing = referenced.filter((id) => !known.has(id));

  if (missing.length > 0) {
    console.error(
      `Refusing to seed — these layerIds are not in roadmap_layers:\n  ${missing.join("\n  ")}\n` +
        `Run 'npm run seed:roadmap' first.`,
    );
    process.exit(1);
  }

  await Promise.all([
    col.createIndex({ slug: 1 }, { unique: true }),
    col.createIndex({ status: 1, trackId: 1, layerId: 1 }),
    col.createIndex({ status: 1, tags: 1 }),
    col.createIndex(
      { title: "text", summary: "text", tags: "text" },
      { name: "challenge_text_search" },
    ),
  ]);

  const ops = challenges.map((c) => ({
    updateOne: {
      filter: { slug: c.slug },
      update: {
        $set: {
          ...c,
          status: c.status ?? "published",
          hiddenTests: c.hiddenTests ?? [],
          submittedBy: null,
          updatedAt: new Date(),
        },
        // stats must survive a re-seed — never reset a solve count
        $setOnInsert: { createdAt: new Date(), stats: { solves: 0, attempts: 0 } },
      },
      upsert: true,
    },
  }));

  const result = await col.bulkWrite(ops, { ordered: false });
  const published = challenges.filter((c) => (c.status ?? "published") === "published").length;

  console.log(
    `challenges: ${challenges.length} seen, ${result.upsertedCount} inserted, ${result.modifiedCount} updated`,
  );
  console.log(`  ${published} published, ${challenges.length - published} draft (no tests authored yet)`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Challenge seed failed:", err);
  process.exit(1);
});
