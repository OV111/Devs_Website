// One grid rhythm for the whole page: gap-5, with `min(100%, …)` so a card
// never overflows a 320px-wide screen.
export const BOOK_GRID =
  "grid gap-5 grid-cols-[repeat(auto-fill,minmax(min(100%,160px),1fr))]";
export const CARD_GRID =
  "grid gap-5 grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]";

// Order sections appear on the "all" tab.
export const SECTION_ORDER = ["book", "documentation", "guide", "cheatsheet"];
