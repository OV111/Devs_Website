import React, { useState } from "react";
import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";
import { useBookCover } from "./useBookCover";

export default function BookCard({ resource, isSaved = false, onToggleSave }) {
  const [saving, setSaving] = useState(false);
  const [coverRef, cover] = useBookCover(resource.title);

  const handleSave = async () => {
    if (saving || !onToggleSave) return;
    setSaving(true);
    try {
      await onToggleSave(resource._id);
    } finally {
      setSaving(false);
    }
  };

  const meta = [resource.is_free ? "Free" : "Paid", resource.pages ? `${resource.pages} pages` : null]
    .filter(Boolean)
    .join(" · ");

  const externalUrl = resource.is_free && resource.free_url ? resource.free_url : resource.url;

  // The title <Link> is stretched over the whole card (after:inset-0), so the card
  // is one click target. Save + external link sit above it with z-10: no nested <a>.
  return (
    <article className="group relative flex flex-col gap-3">
      <div
        ref={coverRef}
        className="relative aspect-[2/3] overflow-hidden rounded-lg border border-neutral-800 border-l-4 border-l-purple-600 bg-neutral-900 transition-transform duration-200 group-hover:-translate-y-1"
      >
        {cover ? (
          <img
            src={cover}
            alt={`Cover of ${resource.title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-4" aria-hidden="true">
            <p className="font-mono text-sm font-bold leading-snug text-neutral-100">{resource.title}</p>
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">{resource.author}</p>
          </div>
        )}

        <SaveButton
          saved={isSaved}
          saving={saving}
          onClick={handleSave}
          label={resource.title}
          className={`absolute right-1.5 top-1.5 z-10 bg-black/70 backdrop-blur-sm ${
            isSaved
              ? ""
              : "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100"
          }`}
        />
      </div>

      <div>
        <h3 className="mb-1 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-100">
          <Link
            to={`/libs/${resource._id}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
          >
            {resource.title}
          </Link>
        </h3>
        {resource.author && <p className="mb-1 text-xs text-neutral-400">{resource.author}</p>}
        <p className="mb-3 text-xs text-neutral-400">{meta}</p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {resource.topics?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-sm border border-neutral-700 px-2 py-0.5 text-[11px] uppercase tracking-wide text-neutral-400"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${resource.is_free ? "Read free" : "View"}: ${resource.title} (opens in new tab)`}
          className="relative z-10 text-xs font-medium text-purple-400 hover:text-purple-300 hover:underline"
        >
          {resource.is_free ? "Read free ↗" : "View book ↗"}
        </a>
      </div>
    </article>
  );
}
