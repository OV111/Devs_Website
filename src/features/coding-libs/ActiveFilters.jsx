import React from "react";
import { X } from "lucide-react";

function Chip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex items-center gap-1 rounded-sm border border-purple-500/40 bg-purple-500/10 px-2 py-1 text-xs text-purple-300 transition-colors hover:bg-purple-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
    >
      {label}
      <X size={12} aria-hidden="true" />
    </button>
  );
}

export default function ActiveFilters({ filters, setFilters, onClearAll }) {
  const remove = (key) => setFilters((f) => ({ ...f, [key]: null }));
  const hasAny = filters.path || filters.difficulty || filters.is_free !== null;
  if (!hasAny) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filters.path && <Chip label={filters.path} onRemove={() => remove("path")} />}
      {filters.difficulty && <Chip label={filters.difficulty} onRemove={() => remove("difficulty")} />}
      {filters.is_free !== null && (
        <Chip label={filters.is_free ? "Free only" : "Paid"} onRemove={() => remove("is_free")} />
      )}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-sm px-2 py-1 text-xs text-neutral-400 underline hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-purple-400"
      >
        Clear all
      </button>
    </div>
  );
}
