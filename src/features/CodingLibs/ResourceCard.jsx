import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

const TYPE_COLORS = {
  book:           "#818cf8",
  documentation:  "#34d399",
  guide:          "#fb923c",
  cheatsheet:     "#f472b6",
};

const DIFFICULTY_COLORS = {
  beginner:     "#22c55e",
  intermediate: "#facc15",
  advanced:     "#f87171",
};

function Badge({ label, color }) {
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 uppercase font-bold"
      style={{ color, border: `1px solid ${color}33` }}
    >
      {label}
    </span>
  );
}

export default function ResourceCard({ resource, isSaved = false, onToggleSave }) {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => { setSaved(isSaved); }, [isSaved]);

  const typeColor = TYPE_COLORS[resource.type] ?? "#666";
  const diffColor = DIFFICULTY_COLORS[resource.difficulty] ?? "#666";

  const handleSave = async (e) => {
    e.stopPropagation();
    if (saving || !onToggleSave) return;
    setSaving(true);
    try {
      const nextSaved = await onToggleSave(resource._id);
      setSaved(nextSaved);
    } catch {
      // leave state unchanged on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-between p-4 cursor-pointer transition-colors"
      style={{
        backgroundColor: hovered ? "#181818" : "#111",
        border: "1px solid #1f1f1f",
        borderTop: `3px solid ${typeColor}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-semibold leading-snug text-[#e5e5e5]">{resource.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge label={resource.type} color={typeColor} />
            <button
              onClick={handleSave}
              disabled={saving}
              title={saved ? "Unsave resource" : "Save resource"}
              className={`transition-opacity hover:opacity-80 disabled:opacity-40 ${saved ? "text-purple-600" : "text-[#444]"}`}
            >
              <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {resource.author && (
          <p className="text-[11px] mb-2 text-[#555]">{resource.author}</p>
        )}

        <p className="text-xs leading-relaxed mb-3 text-[#666]">{resource.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {resource.topics.slice(0, 5).map((t) => (
            <span key={t} className="text-[9px] border border-[#222] text-[#444] px-1.5 py-0.5">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge label={resource.difficulty} color={diffColor} />
          <Badge
            label={resource.is_free ? "free" : "paid"}
            color={resource.is_free ? "#22c55e" : "#facc15"}
          />
        </div>
        <div className="flex gap-3">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] transition-opacity hover:opacity-80 text-purple-600"
          >
            open →
          </a>
          {resource.free_url && resource.free_url !== resource.url && (
            <a
              href={resource.free_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] transition-opacity hover:opacity-80 text-green-500"
            >
              free →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
