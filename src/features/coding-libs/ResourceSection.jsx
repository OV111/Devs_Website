import React from "react";
import BookCard from "./BookCard";
import ResourceCard from "./ResourceCard";
import SectionHeader from "./SectionHeader";
import { BOOK_GRID, CARD_GRID } from "./grids";

// One place that knows how each resource type is laid out.
const SECTION_CONFIG = {
  book: { title: "Books", grid: BOOK_GRID, Card: BookCard },
  documentation: { title: "Documentation", grid: CARD_GRID, Card: ResourceCard },
  guide: { title: "Guides", grid: CARD_GRID, Card: ResourceCard },
  cheatsheet: { title: "Cheat sheets", grid: CARD_GRID, Card: ResourceCard },
};


export default function ResourceSection({ type, items, savedIds, onToggleSave, showHeader = true }) {
  const { title, grid, Card } = SECTION_CONFIG[type];
  if (items.length === 0) return null;

  return (
    <section className="mb-12" aria-label={title}>
      {showHeader && <SectionHeader title={title} count={items.length} />}
      <div className={grid}>
        {items.map((r) => (
          <Card
            key={r._id}
            resource={r}
            isSaved={savedIds.has(String(r._id))}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </section>
  );
}
