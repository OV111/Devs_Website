import React from "react";
import { BOOK_GRID, CARD_GRID } from "./grids";

// Same grid + aspect ratio as the real cards, so nothing jumps when data arrives.
export default function ResourceSkeleton({ variant = "card", count = 8 }) {
  const isBook = variant === "book";
  return (
    <div className={isBook ? BOOK_GRID : CARD_GRID} aria-hidden="true">
      {Array.from({ length: count }, (_, i) =>
        isBook ? (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-[2/3] rounded-lg bg-neutral-900" />
            <div className="h-4 w-3/4 rounded bg-neutral-900" />
            <div className="h-3 w-1/2 rounded bg-neutral-900" />
          </div>
        ) : (
          <div key={i} className="h-44 animate-pulse rounded-md border border-neutral-800 bg-neutral-950" />
        ),
      )}
    </div>
  );
}
