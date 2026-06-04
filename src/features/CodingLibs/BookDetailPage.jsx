import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchLibraryResourceById,
  fetchLibraryResources,
} from "../../services/libraryApi";
import BookCard from "./BookCard";

// ── palette helpers (mirrored from BookCard) ────────────────────────────────
const COVER_PALETTES = [
  { bg: "#0d1a0f", border: "#22c55e" },
  { bg: "#1a1508", border: "#facc15" },
  { bg: "#0f1420", border: "#60a5fa" },
  { bg: "#1a100f", border: "#f87171" },
  { bg: "#16101a", border: "#a78bfa" },
  { bg: "#0f1a1a", border: "#34d399" },
  { bg: "#1a0f14", border: "#f472b6" },
  { bg: "#12141a", border: "#94a3b8" },
];

function hashTitle(title = "") {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0;
  return h % COVER_PALETTES.length;
}

// ── small helpers ────────────────────────────────────────────────────────────
const DIFFICULTY_COLORS = {
  beginner: "#22c55e",
  intermediate: "#facc15",
  advanced: "#f87171",
};

function MonoLabel({ children, style, className = "" }) {
  return (
    <span
      className={`font-mono uppercase tracking-widest ${className}`}
      style={{ fontFamily: "monospace", ...style }}
    >
      {children}
    </span>
  );
}

// ── loading skeleton ─────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0a0a0c" }}
    >
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        />
        <MonoLabel style={{ color: "#555", fontSize: 11 }}>// loading resource</MonoLabel>
      </div>
    </div>
  );
}

// ── error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0a0a0c" }}
    >
      <div className="text-center max-w-sm px-8">
        <MonoLabel style={{ color: "#f87171", fontSize: 11 }} className="block mb-3">
          // error
        </MonoLabel>
        <p className="text-[#888] text-sm mb-6">{message}</p>
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] transition-colors"
          style={{ fontFamily: "monospace" }}
        >
          ‹ back to libs
        </button>
      </div>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────
export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [moreBooks, setMoreBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchLibraryResourceById(id),
      fetchLibraryResources({ type: "book", limit: 4 }),
    ])
      .then(([book, { resources }]) => {
        if (cancelled) return;
        setResource(book);
        setMoreBooks(resources.filter((r) => r._id !== id).slice(0, 3));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load resource.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onBack={() => navigate("/libs")} />;
  if (!resource) return null;

  const palette = COVER_PALETTES[hashTitle(resource.title)];
  const accentColor = palette.border;

  const difficultyColor =
    DIFFICULTY_COLORS[resource.difficulty?.toLowerCase()] ?? "#888";

  // ── breadcrumb ─────────────────────────────────────────────────────────────
  const Breadcrumb = (
    <div
      className="max-w-6xl mx-auto px-8 pt-6 pb-0 flex items-center gap-2"
      style={{ fontFamily: "monospace" }}
    >
      <button
        onClick={() => navigate("/libs")}
        className="text-[#555] hover:text-[#aaa] transition-colors text-[11px] flex items-center gap-1"
      >
        ‹ back
      </button>
      <span className="text-[#2a2a2a] text-[11px]">/</span>
      <span className="text-[#444] text-[11px] tracking-wider uppercase">
        // coding libs
      </span>
      <span className="text-[#2a2a2a] text-[11px]">/</span>
      <span className="text-[#444] text-[11px] tracking-wider uppercase">
        books
      </span>
      <span className="text-[#2a2a2a] text-[11px]">/</span>
      <span
        className="text-[#666] text-[11px] max-w-[200px] truncate"
        style={{ letterSpacing: "0.05em" }}
      >
        {resource.title}
      </span>
    </div>
  );

  // ── book card object (decorative) ──────────────────────────────────────────
  const BookObject = (
    <div
      style={{
        width: 224,
        flexShrink: 0,
        aspectRatio: "2/3",
        background: palette.bg,
        borderTop: "1px solid #2a2a2a",
        borderRight: "1px solid #2a2a2a",
        borderBottom: "1px solid #2a2a2a",
        borderLeft: `6px solid ${accentColor}`,
        borderRadius: 8,
        boxShadow:
          "0 32px 64px rgba(0,0,0,0.7), 2px 0 0 rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        cursor: "default",
        marginBottom: -80,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* face gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* title */}
      <p
        style={{
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: 13,
          lineHeight: 1.4,
          color: "#fff",
          position: "absolute",
          top: 0,
          left: 0,
          padding: 20,
          zIndex: 2,
          maxWidth: "100%",
        }}
      >
        {resource.title}
      </p>

      {/* author */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#555",
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: 20,
          zIndex: 2,
        }}
      >
        {resource.author}
      </p>
    </div>
  );

  // ── meta pills ─────────────────────────────────────────────────────────────
  const MetaPills = (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* free / paid */}
      <span
        className="text-[10px] px-2.5 py-1 border rounded-sm uppercase tracking-wider font-bold"
        style={{
          color: resource.is_free ? "#22c55e" : "#facc15",
          borderColor: resource.is_free ? "#22c55e44" : "#facc1544",
          background: resource.is_free ? "#22c55e0d" : "#facc150d",
        }}
      >
        {resource.is_free ? "free" : "paid"}
      </span>

      {/* pages */}
      {resource.pages && (
        <span
          className="text-[10px] px-2.5 py-1 border rounded-sm uppercase tracking-wider font-bold"
          style={{ color: "#888", borderColor: "#2a2a2a" }}
        >
          {resource.pages} pages
        </span>
      )}

      {/* difficulty */}
      {resource.difficulty && (
        <span
          className="text-[10px] px-2.5 py-1 border rounded-sm uppercase tracking-wider font-bold"
          style={{
            color: difficultyColor,
            borderColor: difficultyColor + "44",
            background: difficultyColor + "0d",
          }}
        >
          {resource.difficulty}
        </span>
      )}

      {/* first path */}
      {resource.paths?.[0] && (
        <span
          className="text-[10px] px-2.5 py-1 border rounded-sm uppercase tracking-wider font-bold"
          style={{ color: "#555", borderColor: "#1e1e1e" }}
        >
          {resource.paths[0]}
        </span>
      )}
    </div>
  );

  // ── hero band ──────────────────────────────────────────────────────────────
  const Hero = (
    <div
      style={{ background: "#0d0d10", minHeight: 340, position: "relative", overflow: "hidden" }}
    >
      {/* radial glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 40% 50%, rgba(168,85,247,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-6xl mx-auto px-8 relative"
        style={{ zIndex: 1 }}
      >
        <div
          className="flex flex-col md:flex-row items-end gap-12 pt-10"
          style={{ alignItems: "flex-end" }}
        >
          {/* Left — decorative book object */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {BookObject}
          </div>

          {/* Right — info */}
          <div className="flex-1 pb-8" style={{ minWidth: 0 }}>
            {/* eyebrow */}
            <MonoLabel
              style={{ color: accentColor, fontSize: 11, letterSpacing: "0.15em", display: "block", marginBottom: 12 }}
            >
              // {(resource.type ?? "book").toUpperCase()}
            </MonoLabel>

            {/* title */}
            <h1
              className="font-bold text-white leading-tight mb-1"
              style={{ fontSize: 30 }}
            >
              {resource.title}
            </h1>

            {/* author */}
            <p className="text-sm mb-4" style={{ color: "#666" }}>
              {resource.author}
            </p>

            {MetaPills}

            {/* description */}
            {resource.description && (
              <p
                className="text-sm leading-relaxed mb-6 max-w-md"
                style={{ color: "#888" }}
              >
                {resource.description}
              </p>
            )}

            {/* buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold px-5 py-2.5 transition-colors"
                style={{
                  background: "#9333ea",
                  color: "#fff",
                  borderRadius: 4,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#a855f7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#9333ea")}
              >
                Start reading →
              </a>

              <button
                className="text-sm px-5 py-2.5 transition-colors"
                style={{
                  border: "1px solid #2a2a2a",
                  color: "#888",
                  background: "transparent",
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#444";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.color = "#888";
                }}
              >
                Save resource
              </button>

              {resource.free_url && (
                <a
                  href={resource.free_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] underline transition-colors"
                  style={{ color: "#555", textDecoration: "underline" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  Download / Read free ↗
                </a>
              )}
            </div>

            {/* progress bar */}
            <div style={{ marginTop: 4 }}>
              <MonoLabel
                style={{ color: "#444", fontSize: 10, display: "block", marginBottom: 4 }}
              >
                // PAGE 0 / {resource.pages ?? "—"} · NOT STARTED
              </MonoLabel>
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "#1e1e1e",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ width: "0%", height: "100%", background: "#9333ea" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── reading preview panel ──────────────────────────────────────────────────
  const topicHint = resource.topics?.[0] ?? "software";
  const descText =
    resource.description ||
    `This resource covers essential concepts in ${topicHint} development. Whether you are just starting out or looking to level up, the material is structured to build understanding progressively.`;

  const ReadingPreview = (
    <div
      style={{
        background: "#0f0f12",
        border: "1px solid #1e1e1e",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* top bar */}
      <div
        style={{
          background: "#0a0a0c",
          borderBottom: "1px dotted #1e1e1e",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MonoLabel style={{ color: "#555", fontSize: 10 }}>
          // CHAPTER 01 · INTRODUCTION
        </MonoLabel>
        <MonoLabel style={{ color: "#444", fontSize: 10 }}>
          01 / {resource.pages ?? "--"}
        </MonoLabel>
      </div>

      {/* two-column body */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderTop: "none" }}
      >
        {/* left column — prose */}
        <div
          className="px-8 py-10"
          style={{ borderRight: "1px dotted #1a1a1a" }}
        >
          <h2
            className="font-bold mb-4"
            style={{ fontSize: 18, color: "#e5e5e5" }}
          >
            Getting Started
          </h2>
          <p className="text-sm leading-7 mb-4" style={{ color: "#666" }}>
            {descText}
          </p>
          <p className="text-sm leading-7 mb-4" style={{ color: "#666" }}>
            Modern developers are expected to navigate ambiguity, ship
            iteratively, and understand systems at multiple layers of
            abstraction — from runtime semantics to network protocols. This
            chapter lays the groundwork for that mental model.
          </p>
          <p className="text-sm leading-7" style={{ color: "#666" }}>
            As you work through the examples, pay attention to the
            trade-offs being made. Every design decision has a cost; the
            goal is to develop intuition for when a given trade-off is
            worth it.
          </p>
        </div>

        {/* right column — code block */}
        <div className="px-8 py-10">
          <div
            style={{
              background: "#0a0a0c",
              border: "1px solid #1e1e1e",
              borderRadius: 2,
              padding: 16,
              fontFamily: "monospace",
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            <div>
              <span style={{ color: "#555" }}>{"// example: core concept"}</span>
            </div>
            <div>
              <span style={{ color: "#a855f7" }}>function </span>
              <span style={{ color: "#60a5fa" }}>understand</span>
              <span style={{ color: "#e5e5e5" }}>(concept) {"{"}</span>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <span style={{ color: "#a855f7" }}>const </span>
              <span style={{ color: "#60a5fa" }}>knowledge </span>
              <span style={{ color: "#e5e5e5" }}>= </span>
              <span style={{ color: "#22c55e" }}>"{topicHint}"</span>
              <span style={{ color: "#e5e5e5" }}>;</span>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <span style={{ color: "#a855f7" }}>const </span>
              <span style={{ color: "#60a5fa" }}>depth </span>
              <span style={{ color: "#e5e5e5" }}>= concept.layers</span>
              <span style={{ color: "#60a5fa" }}>.reduce</span>
              <span style={{ color: "#e5e5e5" }}>(</span>
            </div>
            <div style={{ paddingLeft: 32 }}>
              <span style={{ color: "#e5e5e5" }}>(acc, layer) </span>
              <span style={{ color: "#a855f7" }}>{"=>"}</span>
              <span style={{ color: "#e5e5e5" }}> acc + layer.value, </span>
              <span style={{ color: "#facc15" }}>0</span>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <span style={{ color: "#e5e5e5" }}>);</span>
            </div>
            <div style={{ paddingLeft: 16 }}>
              <span style={{ color: "#a855f7" }}>return </span>
              <span style={{ color: "#e5e5e5" }}>{"{ knowledge, depth };"}</span>
            </div>
            <div>
              <span style={{ color: "#e5e5e5" }}>{"}"}</span>
            </div>
          </div>
          <MonoLabel style={{ color: "#444", fontSize: 10, display: "block", marginTop: 8 }}>
            // try this in your REPL
          </MonoLabel>
        </div>
      </div>

      {/* bottom bar */}
      <div
        style={{
          borderTop: "1px dotted #1e1e1e",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          className="transition-colors"
          style={{ color: "#444", background: "none", border: "none", fontSize: 16, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
        >
          ‹
        </button>

        <div className="flex gap-1.5 items-center">
          <span style={{ color: accentColor, fontSize: 8 }}>●</span>
          <span style={{ color: "#333", fontSize: 8 }}>○</span>
          <span style={{ color: "#333", fontSize: 8 }}>○</span>
        </div>

        <button
          className="transition-colors"
          style={{ color: "#444", background: "none", border: "none", fontSize: 16, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
        >
          ›
        </button>
      </div>
    </div>
  );

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#0a0a0c", minHeight: "100vh", color: "#e5e5e5" }}>
      {Breadcrumb}
      {Hero}

      {/* content area — pt-24 to clear the overlapping book card */}
      <div className="max-w-6xl mx-auto px-8 pt-24 pb-20">
        {ReadingPreview}

        {/* dotted divider */}
        <div style={{ borderTop: "1px dotted #1e1e1e", margin: "48px 0" }} />

        {/* more books */}
        {moreBooks.length > 0 && (
          <section>
            <MonoLabel
              style={{ color: "#555", fontSize: 11, letterSpacing: "0.15em", display: "block", marginBottom: 24 }}
            >
              // MORE BOOKS
            </MonoLabel>

            <div
              className="flex gap-6 overflow-x-auto pb-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a #0a0a0c" }}
            >
              {moreBooks.map((book) => (
                <div key={book._id} style={{ minWidth: 160, flex: "0 0 160px" }}>
                  <BookCard
                    resource={book}
                    isSaved={false}
                    onToggleSave={() => Promise.resolve(false)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
