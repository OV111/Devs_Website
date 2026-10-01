import { ObjectId } from "mongodb";

/**
 * Product events for the pilot (docs/STARTUP_CRITIQUE_2026-10.md, fix 1).
 *
 * Recorded server-side on purpose: the browser can't be trusted, ad-blockers
 * drop client analytics, and every one of these actions already passes
 * through a controller or service here.
 *
 * Tracking must never break the action it records, so every write swallows
 * its own errors. A lost event is a gap in a chart; a thrown one is a failed
 * signup or a lost exam.
 */

export const EVENT_TYPES = Object.freeze([
  "signup",
  "path_selected",
  "exam_started",
  "exam_submitted",
  "mentor_message",
  "teach_back",
  "active_day",
]);

const COLLECTION = "userEvents";
const DAY_MS = 24 * 60 * 60 * 1000;

const toObjectId = (id) => (id instanceof ObjectId ? id : new ObjectId(String(id)));
const dayKey = (date) => date.toISOString().slice(0, 10); // UTC "YYYY-MM-DD"

export const trackEvent = async (db, userId, type, meta = {}) => {
  try {
    if (!EVENT_TYPES.includes(type)) throw new Error(`unknown event type "${type}"`);
    await db.collection(COLLECTION).insertOne({
      userId: toObjectId(userId),
      type,
      meta,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("trackEvent failed (event dropped):", type, err.message);
  }
};

/**
 * At most one `active_day` row per user per UTC day, however many times it is
 * called. It's hooked into token refresh, which fires every ~15 minutes while
 * someone uses the app, so a plain insert would flood the collection.
 */
export const trackActiveDay = async (db, userId) => {
  try {
    const now = new Date();
    await db.collection(COLLECTION).updateOne(
      { userId: toObjectId(userId), type: "active_day", day: dayKey(now) },
      { $setOnInsert: { meta: {}, createdAt: now } },
      { upsert: true },
    );
  } catch (err) {
    // Two concurrent upserts for the same day: the unique index rejects the
    // loser, and the row it wanted already exists. Not a failure.
    if (err?.code === 11000) return;
    console.error("trackActiveDay failed (event dropped):", err.message);
  }
};

/**
 * Pilot funnel for a signup cohort. Pure (no db) so it's unit-testable.
 *
 * "Second layer" means exams started on 2+ distinct layers. Layer ids are
 * slugs, not numbers, so "the user moved on" is the honest thing to count.
 * "Returned within 7 days" means active on a later UTC day than signup, no
 * more than 7 days after it.
 */
export const computeFunnel = (events) => {
  const byUser = new Map();
  for (const e of events) {
    const key = String(e.userId);
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key).push(e);
  }

  const counts = {
    signedUp: 0,
    pathSelected: 0,
    examStarted: 0,
    examPassed: 0,
    returnedWithin7Days: 0,
    startedSecondLayer: 0,
  };

  for (const userEvents of byUser.values()) {
    const signup = userEvents.find((e) => e.type === "signup");
    if (!signup) continue; // not in this cohort
    counts.signedUp++;

    const has = (type, pred = () => true) => userEvents.some((e) => e.type === type && pred(e));
    if (has("path_selected")) counts.pathSelected++;
    if (has("exam_started")) counts.examStarted++;
    if (has("exam_submitted", (e) => e.meta?.passed === true)) counts.examPassed++;

    const signupDay = Date.parse(dayKey(new Date(signup.createdAt)));
    const returned = has("active_day", (e) => {
      const diff = Date.parse(e.day ?? dayKey(new Date(e.createdAt))) - signupDay;
      return diff >= DAY_MS && diff <= 7 * DAY_MS;
    });
    if (returned) counts.returnedWithin7Days++;

    const layers = new Set(
      userEvents.filter((e) => e.type === "exam_started").map((e) => `${e.meta?.path}/${e.meta?.layer}`),
    );
    if (layers.size >= 2) counts.startedSecondLayer++;
  }

  return counts;
};

/**
 * Loads the cohort that signed up since `since` and every event of theirs.
 * Fine at pilot scale (tens to thousands of users); move the counting into an
 * aggregation pipeline before this has to scan large volumes.
 */
export const getFunnel = async (db, since) => {
  const col = db.collection(COLLECTION);
  const cohort = await col.distinct("userId", { type: "signup", createdAt: { $gte: since } });
  const events = cohort.length ? await col.find({ userId: { $in: cohort } }).toArray() : [];
  return { since, ...computeFunnel(events) };
};
