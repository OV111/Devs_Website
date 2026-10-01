// Single source of spacing/sizing for every card type in the roadmap tree,
// so padding/gap/radius/width can't drift between LayerNode, SectionCard and
// SubtopicCard the way they had (bug: "card widths/heights inconsistent").
export const TREE_TOKENS = {
  subtopicWidth: 260,
  subtopicMinHeight: 76,
  cardGap: 12, // flow-layout gap between stacked cards — replaces the fixed CHILD_H slot
  cardRadius: "rounded-xl",
  cardPadding: "px-3.5 py-3",
  sectionWidth: 190,
  // "Completed" color: purple accents only (border/text/lines) on the same
  // neutral card background as every other state — no purple background fill.
  doneColor: "#7c3aed", // violet-600
  doneSpine: "linear-gradient(to bottom, #7c3aed, #5b21b6)", // violet-600 -> 800
};

export const RESOURCE_BADGE_COLORS = {
  docs: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  video: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  article: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  tool: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  course: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  book: "bg-orange-500/15 text-orange-300 border-orange-500/20",
};
