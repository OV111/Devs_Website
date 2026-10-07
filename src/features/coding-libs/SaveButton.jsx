import React from "react";
import { Bookmark } from "lucide-react";

export default function SaveButton({ saved, saving, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      aria-pressed={saved}
      aria-label={`${saved ? "Remove from saved" : "Save"}: ${label}`}
      className={`rounded-md p-2 transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 ${
        saved ? "text-purple-400" : "text-neutral-400 hover:text-purple-400"
      } ${className}`}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
    </button>
  );
}
