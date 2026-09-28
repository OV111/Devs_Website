import { toTopicSlug } from "../utils/topicKey.js";
import { getMisconceptions } from "./conceptService.js";

const COLLECTION = "teach_back_rubrics";

/**
 * A rubric, with its misconceptions hydrated from the Curriculum Knowledge Layer.
 *
 * Misconceptions moved to `concepts` in Stage 3 so that one authored list serves
 * both grading (detecting a wrong belief) and teaching (correcting it). Hydrating
 * here rather than at each call site means the evaluator and follow-up generator
 * needed no changes — they still read `rubric.misconceptions`.
 *
 * Falls back to whatever the rubric document itself carries, so a rubric whose
 * concept has not been authored yet still grades exactly as it did before.
 */
export const getRubric = async (db, path, layer, topic) => {
  const rubric = await db.collection(COLLECTION).findOne({ path, layer, topic });
  if (!rubric) return null;

  const fromConcept = await getMisconceptions(db, rubric.topicSlug ?? topic);

  return {
    ...rubric,
    misconceptions: fromConcept.length ? fromConcept : (rubric.misconceptions ?? []),
  };
};

export const listRubricsForLayer = async (db, path, layer) => {
  return db.collection(COLLECTION).find({ path, layer }).toArray();
};

export const upsertRubric = async (db, path, layer, topic, { criteria, misconceptions, version = 1 }) => {
  return db.collection(COLLECTION).findOneAndUpdate(
    { path, layer, topic },
    {
      $set: {
        path,
        layer,
        topic,
        // Lets a rubric be found by canonical key, which is how the Curriculum
        // Knowledge Layer (Stage 3) will link a concept to its assessment.
        topicSlug: toTopicSlug(topic),
        criteria,
        misconceptions: misconceptions || [],
        version,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, returnDocument: "after" },
  );
};
