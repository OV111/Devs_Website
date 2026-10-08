/**
 * Splits each roadmap category file into one small file per track.
 *
 * Source of truth stays `src/data/roadmaps/<category>.json` (seeders, LayerPicker
 * and tests read it). The roadmap page only ever shows one track, so it fetches
 * `public/roadmaps/<category>/<track>.json` instead of a 1-2 MB category chunk.
 *
 * Also writes `public/roadmaps/layer-index.json` ({ id, title } for every layer),
 * which the blog LayerPicker searches instead of loading all 15 category files.
 *
 * Runs automatically before `npm run dev` and `npm run build` (pre-scripts).
 * The output folder is generated, so it's gitignored.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, basename } from "node:path";

const SRC = "src/data/roadmaps";
const OUT = "public/roadmaps";

// Wipe first so a renamed or deleted track can't leave a stale file behind.
rmSync(OUT, { recursive: true, force: true });

let count = 0;
const layerIndex = [];
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".json"))) {
  const categoryId = basename(file, ".json");
  const tracks = JSON.parse(readFileSync(join(SRC, file), "utf8"));
  mkdirSync(join(OUT, categoryId), { recursive: true });
  for (const [trackId, layers] of Object.entries(tracks)) {
    writeFileSync(join(OUT, categoryId, `${trackId}.json`), JSON.stringify(layers));
    count++;
    for (const { id, title } of layers) if (id && title) layerIndex.push({ id, title });
  }
}
writeFileSync(join(OUT, "layer-index.json"), JSON.stringify(layerIndex));

console.log(`splitRoadmaps: wrote ${count} tracks and ${layerIndex.length} indexed layers to ${OUT}/`);
