/**
 * Pure helpers for the top of the signed-in user's own profile: a headline and
 * result counts built from data the page already loads, plus a friendly
 * "last active". No fetching here, so everything is unit-tested directly.
 */

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * @param {{tracks?: {eligibility?: {passed?: number}}[], certificates?: object[]}} data
 *   `tracks` is the capstone overview (layer exams passed per track),
 *   `certificates` the user's own certificates.
 */
export const summarizeProfile = ({ tracks, certificates } = {}) => {
  const layersPassed = (tracks ?? []).reduce(
    (sum, t) => sum + (t.eligibility?.passed ?? 0),
    0,
  );
  const capstones = (certificates ?? []).filter((c) => !c.revoked).length;

  const parts = [
    layersPassed ? `${plural(layersPassed, "layer")} passed` : null,
    capstones ? `${plural(capstones, "capstone")} passed` : null,
  ].filter(Boolean);

  return { layersPassed, capstones, headline: parts.length ? parts.join(" · ") : null };
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "Active now", "5 minutes ago", "3 hours ago", "2 days ago", or a date. */
export const formatLastActive = (value, now = new Date()) => {
  if (!value) return "Active now";
  const then = new Date(value);
  if (Number.isNaN(then.getTime())) return "Active now";

  const diff = now.getTime() - then.getTime();
  if (diff < 5 * MINUTE) return "Active now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minutes ago`;
  if (diff < DAY) return plural(Math.floor(diff / HOUR), "hour") + " ago";
  if (diff < 30 * DAY) return plural(Math.floor(diff / DAY), "day") + " ago";
  return then.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};
