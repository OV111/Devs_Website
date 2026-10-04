/**
 * How a rubric score (0–4, as the server sends it) reads in the UI.
 * One table drives label, colour and "strong vs needs work", so the meter,
 * the chip and the summary counts can never disagree.
 *
 * `strong` matches the server's own cut (score >= 3).
 */
export const LEVELS = [
  { label: "Missing", tone: "red", strong: false },
  { label: "Weak", tone: "red", strong: false },
  { label: "Needs work", tone: "amber", strong: false },
  { label: "Strong", tone: "green", strong: true },
  { label: "Excellent", tone: "green", strong: true },
];

export const levelOf = (score) =>
  LEVELS[Math.max(0, Math.min(LEVELS.length - 1, Math.round(score)))];

// Full class strings so Tailwind can see them.
export const TONE = {
  green: {
    text: "text-green-300",
    chip: "border-green-500/30 bg-green-500/10 text-green-300",
    seg: "bg-green-400",
  },
  amber: {
    text: "text-amber-300",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    seg: "bg-amber-400",
  },
  red: {
    text: "text-red-300",
    chip: "border-red-500/30 bg-red-500/10 text-red-300",
    seg: "bg-red-400",
  },
};

/** "3 strong · 3 need work" style counts for the review header. */
export const summarize = (criteria) => {
  const strong = criteria.filter((c) => levelOf(c.score).strong).length;
  return { strong, needsWork: criteria.length - strong };
};

/** "src/auth.js:31" */
export const evidenceRef = (e) => `${e.path}${e.line ? `:${e.line}` : ""}`;
