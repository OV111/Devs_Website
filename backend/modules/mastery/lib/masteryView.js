/**
 * The learner-facing view of mastery — pure, no database.
 *
 * learnerMasteryService already owns the POLICY (what "solid" or "shaky" means)
 * and the next-action decision. This file only shapes that answer for a person
 * to read, and decides how much of it a given user receives. Keeping it pure
 * means the free/Pro split, the summary math and the links are all testable
 * without Mongo.
 */

const STATUSES = ["shaky", "developing", "untested", "solid"];

/**
 * Where the "Do this next" button should go. Returned as data, not a URL, so the
 * backend never hard-codes frontend routes; the client maps `kind` to a path.
 *
 *   exam    -> prove or re-prove the layer the topic belongs to
 *   roadmap -> pick a path / move on to the next layer
 */
const targetFor = (action, topic) => {
  if (action === "start" || action === "advance") return { kind: "roadmap" };
  if (topic?.layer && topic?.path) {
    return { kind: "exam", layerId: topic.layer, path: topic.path };
  }
  // Evidence that came from mentor chat has no layer to test; the mentor is the
  // only sensible place to work on it.
  return { kind: "mentor" };
};

export const summarize = (topics = []) => {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const t of topics) if (t.status in counts) counts[t.status] += 1;

  const total = topics.length;
  return {
    total,
    ...counts,
    // Share of topics with any evidence that are solid. Untested topics are left
    // out of the denominator on purpose: "0% solid" for someone who has simply not
    // been tested yet reads as failure, which it is not.
    percentSolid:
      total - counts.untested > 0
        ? Math.round((counts.solid / (total - counts.untested)) * 100)
        : 0,
  };
};

/**
 * @param {object}   args
 * @param {object[]} args.topics      TopicState[] from learnerMasteryService, attention-first
 * @param {object}   args.nextAction  deriveNextAction() result
 * @param {boolean}  args.detail      Whether this user may see the per-topic map
 * @param {Map}      [args.layers]    layerId -> { title, trackId, order }
 * @param {Map}      [args.concepts]  topic slug -> Concept (for misconception text)
 */
export const buildMasteryView = ({
  topics = [],
  nextAction,
  detail,
  layers = new Map(),
  concepts = new Map(),
}) => {
  const focusTopic = nextAction?.topicSlug
    ? topics.find((t) => t.slug === nextAction.topicSlug)
    : null;

  const view = {
    summary: summarize(topics),
    nextAction: nextAction
      ? {
          action: nextAction.action,
          title: nextAction.title,
          reason: nextAction.reason,
          target: targetFor(nextAction.action, focusTopic),
        }
      : null,
    detail: Boolean(detail),
    topics: [],
    lockedTopicCount: 0,
  };

  // The redaction happens HERE, on the server. Hiding the list in the UI would
  // still ship it to the browser, readable in the network tab.
  if (!detail) {
    view.lockedTopicCount = topics.length;
    return view;
  }

  view.topics = topics.map((t) => {
    const layer = t.layer ? layers.get(t.layer) : null;
    const known = new Map(
      (concepts.get(t.slug)?.misconceptions ?? []).map((m) => [m.id, m]),
    );

    return {
      slug: t.slug,
      title: t.title,
      status: t.status,
      examScore: t.examScore ?? null,
      teachBackScore: t.teachBackScore ?? null,
      failCount: t.failCount ?? 0,
      lastEvidenceAt: t.lastEvidenceAt ?? null,
      path: t.path ?? null,
      layer: t.layer
        ? {
            id: t.layer,
            title: layer?.title ?? null,
            trackId: layer?.trackId ?? null,
            order: layer?.order ?? null,
          }
        : null,
      // Only the wrong belief is shown, never the authored correction: the
      // mentor teaches Socratically from the correction, and printing it here
      // would hand over the answer the mentor is meant to lead them to.
      misconceptions: (t.misconceptions ?? []).map((id) => ({
        id,
        description: known.get(id)?.description ?? null,
      })),
    };
  });

  return view;
};
