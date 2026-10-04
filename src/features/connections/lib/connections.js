/**
 * Pure helpers for the followers / following lists. A "user" here is a row
 * from /my-profile/followers|following:
 *   { _id, username, firstName, lastName, stats, followedAt, youFollow, followsYou }
 */

export const isMutual = (u) => u.youFollow && u.followsYou;

/**
 * Filters per tab. "Mutual" is the same on both; the third is the one people
 * actually want from each list:
 *   followers → who I haven't followed back
 *   following → who isn't following me back
 */
const ALL = { id: "all", label: "All", test: () => true };
const MUTUAL = { id: "mutual", label: "Mutual", test: isMutual };

export const FILTERS = {
  followers: [ALL, MUTUAL, { id: "pending", label: "You don't follow back", test: (u) => !u.youFollow }],
  following: [ALL, MUTUAL, { id: "pending", label: "Don't follow you back", test: (u) => !u.followsYou }],
};

export const displayName = (u) =>
  `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username;

/** Case-insensitive match on name or @username. Empty query matches everything. */
export const matchesQuery = (u, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    displayName(u).toLowerCase().includes(q) ||
    String(u.username ?? "").toLowerCase().includes(q)
  );
};

const UNITS = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 days ago" / "last week" / "just now"; "" for a missing or invalid date. */
export const timeAgo = (input, now = Date.now()) => {
  const time = new Date(input).getTime();
  if (!input || Number.isNaN(time)) return "";
  const seconds = Math.round((time - now) / 1000);
  for (const [unit, size] of UNITS) {
    const value = Math.round(seconds / size);
    if (Math.abs(value) >= 1) return rtf.format(value, unit);
  }
  return "just now";
};
