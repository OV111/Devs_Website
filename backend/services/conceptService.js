/**
 * Curriculum Knowledge Layer — domain knowledge (Stage 3).
 *
 * The mentor has two distinct knowledge sources, and they must not be confused:
 *
 *   LEARNER knowledge  — "what does THIS learner know?"  → learnerMasteryService
 *   DOMAIN  knowledge  — "what is actually true about X?" → this module
 *
 * Knowing that a learner believes "the signature encrypts the payload" is only
 * half of what is needed to teach them. The other half is the authored
 * correction for that specific wrong belief, which lives here.
 *
 * A concept's `id` IS the canonical topic slug (see utils/topicKey.js), so
 * learner evidence and domain knowledge join on the same key with no mapping
 * table: mastery row `jwt-signature` ⇄ concept `jwt-signature`.
 *
 * Concepts are the single source of truth for misconceptions. Rubrics used to
 * carry their own copy; `rubricService.getRubric` now hydrates them from here so
 * grading and teaching can never drift apart.
 */

import { toTopicSlug } from "../utils/topicKey.js";

const COLLECTION = "concepts";

/**
 * @typedef {Object} Misconception
 * @property {string} id          Stable id, referenced by teach_back_sessions.misconceptionsDetected
 * @property {string} description The wrong belief, as a learner would hold it
 * @property {string} correction  The authored line that fixes it — what the mentor teaches from
 */

/**
 * @typedef {Object} Concept
 * @property {string} id                Canonical topic slug, e.g. "jwt-signature"
 * @property {string} title
 * @property {string} path
 * @property {string} layer
 * @property {string} definition        What it is
 * @property {string} purpose           Why it exists / what problem it solves
 * @property {string[]} prerequisites   Concept ids that should come first
 * @property {string[]} relatedConcepts Concept ids worth contrasting against
 * @property {Misconception[]} misconceptions
 */

/** One concept by slug. Tolerates any spelling of the topic. */
export const getConcept = async (db, idOrTopic) => {
  const id = toTopicSlug(idOrTopic);
  if (!id) return null;
  return db.collection(COLLECTION).findOne({ id }, { projection: { _id: 0 } });
};

/**
 * Several concepts in one round-trip.
 *
 * Exists so expanding a concept's prerequisites/related ids does not turn into
 * N queries — the mentor frequently wants "this concept plus what it builds on".
 */
export const getConcepts = async (db, ids = []) => {
  const slugs = [...new Set(ids.map(toTopicSlug).filter(Boolean))];
  if (!slugs.length) return [];
  return db
    .collection(COLLECTION)
    .find({ id: { $in: slugs } }, { projection: { _id: 0 } })
    .toArray();
};

/** Every concept in a layer — for "what does this layer cover?". */
export const listConceptsForLayer = async (db, path, layer) =>
  db
    .collection(COLLECTION)
    .find({ path, layer }, { projection: { _id: 0, definition: 0, misconceptions: 0 } })
    .toArray();

/**
 * Just the misconceptions for a topic.
 *
 * The narrow read used by rubric hydration and by the mentor, so neither has to
 * pull a concept's full prose to find out what the learner might have wrong.
 */
export const getMisconceptions = async (db, idOrTopic) => {
  const id = toTopicSlug(idOrTopic);
  if (!id) return [];
  const doc = await db
    .collection(COLLECTION)
    .findOne({ id }, { projection: { _id: 0, misconceptions: 1 } });
  return doc?.misconceptions ?? [];
};

export const upsertConcept = async (db, concept) => {
  const id = toTopicSlug(concept.id ?? concept.title);
  if (!id) throw new Error("Concept needs an id or title that slugifies");

  return db.collection(COLLECTION).findOneAndUpdate(
    { id },
    {
      $set: {
        ...concept,
        id,
        prerequisites: concept.prerequisites ?? [],
        relatedConcepts: concept.relatedConcepts ?? [],
        misconceptions: concept.misconceptions ?? [],
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true, returnDocument: "after", projection: { _id: 0 } },
  );
};
