/** "Oct 6, 14:05" in the viewer's locale — for retry times and submission stamps. */
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const UNITS = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** "14 days ago", "in 3 hours", "now" — the original design's relative dates. */
export const formatRelative = (iso, now = Date.now()) => {
  if (!iso) return "now";
  const diff = new Date(iso).getTime() - now;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return "just now";
};
