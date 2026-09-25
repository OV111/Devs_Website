/**
 * Roadmap Seeder — moves the authored roadmap content into MongoDB.
 *
 * Usage:
 *   MONGO_URI=... node backend/seeders/roadmapSeeder.js
 *
 * Source of truth is `src/data/roadmaps/<category>.json` (authored content) plus
 * `constants/roadmapPaths.js` (track titles + availability). This seeder is the
 * bridge: it flattens category -> track -> layer into two queryable collections
 * so the backend can validate layer ids, link library resources and coding
 * challenges to layers, and answer "what is the user's current layer".
 *
 * Idempotent: every write is an upsert keyed on the natural slug id, so
 * re-running never duplicates and never destroys user-facing data.
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import { readFile, readdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, basename } from "path";
import connectDB from "../config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROADMAP_DIR = join(__dirname, "../../src/data/roadmaps");
const TRACKS_FILE = join(__dirname, "../../constants/roadmapPaths.js");

// ── Track metadata ────────────────────────────────────────────
// roadmapPaths.js is an ES module of plain data, so we can import it directly
// rather than parsing it. Keeps one source of truth for track titles.
const loadTrackMeta = async () => {
  const { TRACKS } = await import(`file://${TRACKS_FILE}`);
  const byTrackId = new Map();

  for (const [categoryId, tracks] of Object.entries(TRACKS)) {
    tracks.forEach((track, index) => {
      byTrackId.set(track.id, {
        categoryId,
        title: track.title,
        techs: track.techs ?? [],
        available: track.available ?? false,
        order: index + 1,
      });
    });
  }

  return byTrackId;
};

// ── Flatten the JSON files into documents ─────────────────────
const buildDocs = async (trackMeta) => {
  const files = (await readdir(ROADMAP_DIR)).filter((f) => f.endsWith(".json"));

  const trackDocs = [];
  const layerDocs = [];
  const orphanTracks = [];

  for (const file of files) {
    const categoryId = basename(file, ".json");
    const raw = JSON.parse(await readFile(join(ROADMAP_DIR, file), "utf8"));

    for (const [trackId, layers] of Object.entries(raw)) {
      if (!Array.isArray(layers) || layers.length === 0) continue;

      const meta = trackMeta.get(trackId);
      if (!meta) orphanTracks.push(`${categoryId}/${trackId}`);

      trackDocs.push({
        trackId,
        categoryId: meta?.categoryId ?? categoryId,
        title: meta?.title ?? trackId,
        techs: meta?.techs ?? [],
        available: meta?.available ?? false,
        order: meta?.order ?? 999,
        layerCount: layers.length,
      });

      for (const layer of layers) {
        layerDocs.push({
          layerId: layer.id,
          trackId,
          categoryId: meta?.categoryId ?? categoryId,
          order: layer.order,
          title: layer.title,
          description: layer.description ?? "",
          techs: layer.techs ?? [],
          topics: layer.topics ?? [],
          resources: layer.resources ?? [],
          // The authored one-line practice prompt. Distinct from the coding
          // challenges collection — that lands in a later stage.
          practicePrompt: layer.challenge ?? null,
          estimatedTime: layer.estimatedTime ?? null,
        });
      }
    }
  }

  return { trackDocs, layerDocs, orphanTracks };
};

// ── Write ─────────────────────────────────────────────────────
const upsertAll = async (collection, docs, key) => {
  if (docs.length === 0) return 0;

  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { [key]: doc[key] },
      update: {
        $set: { ...doc, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      upsert: true,
    },
  }));

  const result = await collection.bulkWrite(ops, { ordered: false });
  return result.upsertedCount + result.modifiedCount;
};

async function seed() {
  const db = await connectDB();

  const trackMeta = await loadTrackMeta();
  const { trackDocs, layerDocs, orphanTracks } = await buildDocs(trackMeta);

  const tracks = db.collection("roadmap_tracks");
  const layers = db.collection("roadmap_layers");

  await Promise.all([
    tracks.createIndex({ trackId: 1 }, { unique: true }),
    tracks.createIndex({ categoryId: 1, order: 1 }),
    layers.createIndex({ layerId: 1 }, { unique: true }),
    layers.createIndex({ trackId: 1, order: 1 }),
  ]);

  const tracksWritten = await upsertAll(tracks, trackDocs, "trackId");
  const layersWritten = await upsertAll(layers, layerDocs, "layerId");

  console.log(`roadmap_tracks: ${trackDocs.length} seen, ${tracksWritten} written`);
  console.log(`roadmap_layers: ${layerDocs.length} seen, ${layersWritten} written`);

  if (orphanTracks.length > 0) {
    console.warn(
      `\n${orphanTracks.length} track(s) have roadmap JSON but no entry in roadmapPaths.js TRACKS:\n  ` +
        orphanTracks.join("\n  ") +
        `\nThey were seeded with the raw id as title. Add them to TRACKS or remove the JSON.`,
    );
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Roadmap seed failed:", err);
  process.exit(1);
});
