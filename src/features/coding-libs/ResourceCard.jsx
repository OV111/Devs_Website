import React, { useState } from "react";
import Badge from "./Badge";
import SaveButton from "./SaveButton";

const TYPE_COLORS = {
  book: "#818cf8",
  documentation: "#34d399",
  guide: "#fb923c",
  cheatsheet: "#f472b6",
};

const TYPE_LABELS = { book: "book", documentation: "docs", guide: "guide", cheatsheet: "cheat sheet" };

const DIFFICULTY_COLORS = {
  beginner: "#22c55e",
  intermediate: "#facc15",
  advanced: "#f87171",
};

export default function ResourceCard({ resource, isSaved = false, onToggleSave }) {
  const [saving, setSaving] = useState(false);
  const typeColor = TYPE_COLORS[resource.type] ?? "#a3a3a3";
  const diffColor = DIFFICULTY_COLORS[resource.difficulty] ?? "#a3a3a3";

  const handleSave = async () => {
    if (saving || !onToggleSave) return;
    setSaving(true);
    try {
      await onToggleSave(resource._id);
    } finally {
      setSaving(false);
    }
  };

  // Title link is stretched over the card; save + free link sit above it (z-10).
  return (
    <article
      className="group relative flex flex-col justify-between rounded-md border border-neutral-800 border-t-[3px] bg-neutral-950 p-4 transition-colors hover:bg-neutral-900"
      style={{ borderTopColor: typeColor }}
    >
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-neutral-100">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            >
              {resource.title}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </h3>
          <SaveButton
            saved={isSaved}
            saving={saving}
            onClick={handleSave}
            label={resource.title}
            className="relative z-10 -m-2 shrink-0"
          />
        </div>

        {resource.author && <p className="mb-2 text-xs text-neutral-400">{resource.author}</p>}
        <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-neutral-400">{resource.description}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {resource.topics?.slice(0, 4).map((t) => (
            <span key={t} className="rounded-sm border border-neutral-700 px-1.5 py-0.5 text-[11px] text-neutral-400">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge label={TYPE_LABELS[resource.type] ?? resource.type} color={typeColor} />
          <Badge label={resource.difficulty} color={diffColor} />
          <Badge label={resource.is_free ? "free" : "paid"} color={resource.is_free ? "#22c55e" : "#facc15"} />
        </div>
        {resource.free_url && resource.free_url !== resource.url && (
          <a
            href={resource.free_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 shrink-0 text-xs font-medium text-green-400 hover:underline"
          >
            Free version ↗
          </a>
        )}
      </div>
    </article>
  );
}
