/**
 * A developer's own recruiter-visibility settings. Always keyed by the signed-in
 * user's id taken from the token, never from the request body.
 */

import { ObjectId } from "mongodb";
import { DEFAULT_RECRUITER_SETTINGS, RECRUITER_SETTINGS, ensureIndexes } from "./recruiterData.js";

const toView = (doc) => ({
  enabled: doc?.enabled ?? DEFAULT_RECRUITER_SETTINGS.enabled,
  openToWork: doc?.openToWork ?? DEFAULT_RECRUITER_SETTINGS.openToWork,
  show: { ...DEFAULT_RECRUITER_SETTINGS.show, ...doc?.show },
});

export const getSettingsService = async (db, userId) => {
  await ensureIndexes(db);
  return toView(await db.collection(RECRUITER_SETTINGS).findOne({ userId: new ObjectId(userId) }));
};

export const saveSettingsService = async (db, userId, { enabled, openToWork, show }) => {
  await ensureIndexes(db);
  const now = new Date();
  const doc = await db.collection(RECRUITER_SETTINGS).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $set: { enabled, openToWork, show, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: "after" },
  );
  return toView(doc);
};
