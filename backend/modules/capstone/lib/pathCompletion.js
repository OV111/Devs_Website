/**
 * Has this learner PROVEN every layer of a track?
 *
 * Reads only server-written data (exam_attempts). `userProgress.completedLayers`
 * is deliberately ignored: the roadmap's "mark complete" toggle lets learners
 * self-report, which is fine for the UI but not for gating a certificate.
 *
 * Contract (capstoneService depends on this exact shape):
 *   isPathComplete(db, userId, trackId)
 *     → { complete: boolean, passed: number, total: number, missing: string[] }
 *   unknown trackId (no layers) → throws an Error with err.status = 404
 *
 * Data:
 *   roadmap_layers  { layerId: "api-dev-1", trackId: "api-dev", order: 1 }
 *   exam_attempts   { userId: ObjectId, path: "backend", layer: "api-dev-1", passed: true }
 *
 * exam_attempts.path is the CATEGORY ("backend"), not the track, and layerIds
 * are globally unique — so attempts are filtered by `layer: { $in: layerIds }`.
 * Served by the { userId, passed, layer } index created in capstoneData.js.
 */

import { ObjectId } from "mongodb";

export const isPathComplete = async (db, userId, trackId) => {
  // 1. Every layer of the track, in roadmap order (so `missing` reads naturally).
  const layers = await db
    .collection("roadmap_layers")
    .find({ trackId }, { projection: { layerId: 1, _id: 0 } })
    .sort({ order: 1 })
    .toArray();

  if (layers.length === 0) {
    const err = new Error("Unknown track");
    err.status = 404;
    throw err;
  }
  const layerIds = layers.map((l) => l.layerId);

  // 2. Which of them has at least one passed exam. distinct() de-duplicates in
  //    the database: retakes of the same layer count once, in one round trip.
  const passedLayers = await db.collection("exam_attempts").distinct("layer", {
    userId: new ObjectId(userId),
    passed: true,
    layer: { $in: layerIds },
  });

  // 3. Set lookup keeps this O(n) rather than includes() inside a loop (O(n²)).
  const passedSet = new Set(passedLayers);
  const missing = layerIds.filter((id) => !passedSet.has(id));

  return {
    complete: missing.length === 0,
    passed: layerIds.length - missing.length,
    total: layerIds.length,
    missing,
  };
};
