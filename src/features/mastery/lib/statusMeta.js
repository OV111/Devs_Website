/**
 * How each mastery status is presented. The meaning of a status is decided on
 * the server (learnerMasteryService); this only gives it words and a colour.
 *
 * Ordered attention-first — the same order the server sorts topics in — so the
 * page leads with what needs work.
 */
export const STATUS_ORDER = ["shaky", "developing", "untested", "solid"];

export const STATUS_META = {
  shaky: {
    label: "Needs work",
    hint: "Failed more than once, or couldn't explain it yet.",
    dot: "bg-rose-400",
    bar: "bg-rose-500",
    text: "text-rose-300",
  },
  developing: {
    label: "Getting there",
    hint: "Partly understood — not reliable yet.",
    dot: "bg-amber-400",
    bar: "bg-amber-500",
    text: "text-amber-300",
  },
  untested: {
    label: "Not tested yet",
    hint: "No exam or explanation on record.",
    dot: "bg-zinc-500",
    bar: "bg-zinc-600",
    text: "text-zinc-400",
  },
  solid: {
    label: "Solid",
    hint: "Strong results and nothing contradicting them.",
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
    text: "text-emerald-300",
  },
};

/** Server `target` -> route. The backend sends intent, the client owns URLs. */
export const hrefForTarget = (target) => {
  if (!target) return "/roadmaps";
  if (target.kind === "exam" && target.layerId) {
    const path = target.path ? `?path=${encodeURIComponent(target.path)}` : "";
    return `/roadmaps/exam/${encodeURIComponent(target.layerId)}${path}`;
  }
  if (target.kind === "mentor") return "/ai-agent";
  return "/roadmaps";
};

export const ACTION_LABEL = {
  reinforce: "Reinforce this",
  practice: "Practice this",
  assess: "Prove it",
  advance: "Go to your next layer",
  start: "Choose a roadmap",
};
