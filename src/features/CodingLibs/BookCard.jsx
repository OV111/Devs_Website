import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

const DIFFICULTY_COLORS = {
  beginner: "#22c55e",
  intermediate: "#facc15",
  advanced: "#f87171",
};

const COVER_PALETTES = [
  { bg: "#0d1a0f", border: "#22c55e" }, // green
  { bg: "#1a1508", border: "#facc15" }, // yellow
  { bg: "#0f1420", border: "#60a5fa" }, // blue
  { bg: "#1a100f", border: "#f87171" }, // red
  { bg: "#16101a", border: "#a78bfa" }, // purple
  { bg: "#0f1a1a", border: "#34d399" }, // teal
  { bg: "#1a0f14", border: "#f472b6" }, // pink
  { bg: "#12141a", border: "#94a3b8" }, // slate
];

function hashTitle(title) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0;
  return h % COVER_PALETTES.length;
}

function useBookCover(title) {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const q = encodeURIComponent(`intitle:${title}`);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
      .then((r) => r.json())
      .then((data) => {
        const img = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        if (img) {
          setCover(img.replace("zoom=1", "zoom=3").replace("http:", "https:"));
        }
      })
      .catch(() => {});
  }, [title]);

  return cover;
}

export default function BookCard({ resource, isSaved = false, onToggleSave }) {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  const cover = useBookCover(resource.title);

  useEffect(() => { setSaved(isSaved); }, [isSaved]);

  const palette = COVER_PALETTES[hashTitle(resource.title)];

  const handleSave = async (e) => {
    e.stopPropagation();
    if (saving || !onToggleSave) return;
    setSaving(true);
    try {
      const next = await onToggleSave(resource._id);
      setSaved(next);
    } catch {
      // leave unchanged
    } finally {
      setSaving(false);
    }
  };

  const metaLine = [
    resource.is_free ? "FREE" : "PAID",
    resource.pages ? `${resource.pages} PAGES` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      to={`/libs/${resource._id}`}
      className="flex flex-col gap-3 group cursor-pointer"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* Book cover */}
      <a
        href={resource.is_free && resource.free_url ? resource.free_url : resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden transition-transform duration-200 group-hover:-translate-y-1"
          style={{
            aspectRatio: "2 / 3",
            borderRadius: 8,
            border: "1px solid #2a2a2a",
            borderLeft: `4px solid ${palette.border}`,
            background: cover ? "#141414" : palette.bg,
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt={resource.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.92 }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <p
                className="text-sm font-bold leading-snug text-[#e5e5e5]"
                style={{ fontFamily: "monospace" }}
              >
                {resource.title}
              </p>
              <p
                className="text-[10px] tracking-widest uppercase text-[#555]"
                style={{ fontFamily: "monospace" }}
              >
                {resource.author}
              </p>
            </div>
          )}

          {/* Author overlay on real cover image */}
          {cover && (
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-2"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              }}
            >
              <p
                className="text-[9px] tracking-widest uppercase text-[#aaa]"
                style={{ fontFamily: "monospace" }}
              >
                {resource.author}
              </p>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            title={saved ? "Unsave" : "Save"}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
            style={{ color: saved ? "#a78bfa" : "#888" }}
          >
            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </a>

      {/* Below the cover */}
      <div>
        <p className="text-[15px] font-bold leading-snug text-[#e5e5e5] mb-1.5 line-clamp-2">
          {resource.title}
        </p>

        <p className="text-[11px] mb-3 tracking-wide" style={{ color: "#555" }}>
          {metaLine}
        </p>

        <div className="flex flex-wrap gap-2">
          {resource.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[11px] px-3 py-1 uppercase tracking-wider rounded-sm"
              style={{ border: "1px solid #2e2e2e", color: "#888" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
