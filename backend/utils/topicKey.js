/**
 * Canonical topic key.
 *
 * The same topic is spelled differently by every collection that stores one:
 * `weakSpots` uppercases it ("JWT SIGNATURE"), `teach_back_rubrics` keeps a
 * display title ("JWT Signature"), and `examHistory.missedTopics` holds whatever
 * the caller passed in. Joining a learner's evidence to domain knowledge is
 * impossible while those three disagree, so every topic also gets a slug and the
 * human-readable strings become display-only.
 *
 * Slugs are the join key for LearnerContext. Titles are for the UI and the model.
 */

/**
 * "JWT Signature" / "JWT SIGNATURE" / "jwt-signature" → "jwt-signature"
 *
 * Returns null for input that slugifies to nothing (null, "", "---"), so callers
 * get an explicit absence instead of an empty string that would silently join
 * every unslugifiable topic together into one bogus bucket.
 */
export const toTopicSlug = (topic) => {
  if (topic == null) return null;

  const slug = String(topic)
    .trim()
    // Decompose accents, then drop the combining marks: "Präfix" becomes
    // "prafix" rather than "pr-fix", which would split one topic into two keys.
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || null;
};

/**
 * Read the slug off a document that may predate the slug field.
 *
 * Every read path goes through this rather than `doc.slug` directly, which is
 * what lets LearnerContext be correct the moment it ships — before the backfill
 * script has run, and for any document written by code that still doesn't set
 * the field. Persisted slugs remain worth writing because only a stored field
 * can be indexed.
 */
export const topicSlugOf = (doc, { slugField = "slug", topicField = "topic" } = {}) =>
  doc?.[slugField] ?? toTopicSlug(doc?.[topicField]);
