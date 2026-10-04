/**
 * Capstone Seeder — seeds capstone_briefs.
 *
 * Usage:
 *   npm run seed:capstones
 *
 * Content lives one file per brief under backend/seeders/capstones/. This file
 * is only the write path: validation, indexes and the upsert.
 *
 * Idempotent: upserts keyed on (slug, version). A new version is a new
 * document, so attempts graded against v1 keep pointing at v1.
 *
 * Guards:
 *  - the track must exist in roadmap_layers (run `npm run seed:roadmap` first)
 *  - every rubric layerId must belong to that track, and categoryId must match it
 *  - rubric weights must sum to 100
 *  - a brief is only written as "published" if `reviewed: true`
 *  - and only if EVERY layer of its track has an exam bank — a capstone
 *    unlocks after all layer exams are passed, so without banks it would be
 *    published but impossible to unlock
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB from "../config/db.js";
import { briefs } from "./capstones/index.js";

const validateBrief = (brief, layers) => {
  const errors = [];
  const trackLayerIds = new Set(layers.map((l) => l.layerId));
  const categories = new Set(layers.map((l) => l.categoryId));
  if (categories.size !== 1 || !categories.has(brief.categoryId)) {
    errors.push(`categoryId "${brief.categoryId}" does not match the track (${[...categories].join(", ")})`);
  }
  const weightSum = brief.rubric.reduce((sum, c) => sum + c.weight, 0);
  if (weightSum !== 100) errors.push(`rubric weights sum to ${weightSum}, expected 100`);

  for (const c of brief.rubric) {
    if (!trackLayerIds.has(c.layerId)) errors.push(`rubric "${c.id}" points at unknown layer ${c.layerId}`);
  }
  if (!brief.twistPool?.length) errors.push("twistPool is empty");
  if (brief.status === "published" && !brief.reviewed) {
    errors.push('status is "published" but reviewed is false — a human must review it first');
  }
  return errors;
};

async function seed() {
  const db = await connectDB();
  const col = db.collection("capstone_briefs");

  let failed = false;
  for (const brief of briefs) {
    const layers = await db
      .collection("roadmap_layers")
      .find({ trackId: brief.trackId })
      .project({ layerId: 1, categoryId: 1 })
      .toArray();

    if (layers.length === 0) {
      console.error(`✗ ${brief.slug}: track "${brief.trackId}" has no layers. Run 'npm run seed:roadmap' first.`);
      failed = true;
      continue;
    }

    const errors = validateBrief(brief, layers);

    if (brief.status === "published") {
      const banked = await db
        .collection("exam_question_banks")
        .distinct("layer", { layer: { $in: layers.map((l) => l.layerId) } });
      const missingBanks = layers.map((l) => l.layerId).filter((id) => !banked.includes(id));
      if (missingBanks.length) {
        errors.push(`cannot publish: no exam bank for ${missingBanks.join(", ")} — run the exam seeder for this track first`);
      }
    }
    if (errors.length) {
      console.error(`✗ ${brief.slug} v${brief.version}:\n  ${errors.join("\n  ")}`);
      failed = true;
    }
  }
  if (failed) process.exit(1);

  await Promise.all([
    col.createIndex({ slug: 1, version: 1 }, { unique: true }),
    col.createIndex({ trackId: 1, status: 1, version: -1 }),
  ]);

  const result = await col.bulkWrite(
    briefs.map((b) => ({
      updateOne: {
        filter: { slug: b.slug, version: b.version },
        update: { $set: { ...b, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  console.log(
    `✓ capstone briefs: ${result.upsertedCount} inserted, ${result.modifiedCount} updated ` +
      `(${briefs.filter((b) => b.status === "published").length} published)`,
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("Capstone seed failed:", err);
  process.exit(1);
});
