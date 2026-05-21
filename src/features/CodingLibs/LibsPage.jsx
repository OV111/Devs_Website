import React, { useState } from "react";
import {
  ACCENT,
  PATHS,
  LAYERS,
  DIFFICULTIES,
  PRICES,
  RECOMMENDED,
  TABS,
  BOOKS,
  DOCS_LIST,
} from "../../../constants/LibsPage";

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="text-[11px] font-bold tracking-widest shrink-0 uppercase"
        style={{ color: ACCENT }}
      >
        // {title}
      </span>
      <div
        className="flex-1 h-px rounded-full"
        style={{ backgroundColor: ACCENT, opacity: 0.2 }}
      />
    </div>
  );
}

function FilterCheckbox({ label, count, active }) {
  return (
    <li className="flex items-center justify-between text-[14px] py-0.5">
      <label className="flex items-center gap-2 cursor-pointer">
        <span
          className="w-3 h-3 border flex items-center justify-center shrink-0"
          style={{
            borderColor: active ? ACCENT : "#333",
            backgroundColor: active ? ACCENT : "transparent",
          }}
        >
          {active && (
            <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>
              ✓
            </span>
          )}
        </span>
        <span style={{ color: active ? ACCENT : "#666" }}>{label}</span>
      </label>
      <span style={{ color: "#444" }}>{count}</span>
    </li>
  );
}

export default function LibsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex min-h-screen bg-gray-950 text-[#e5e5e5]">
      {/* Left Filter Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-800 px-5 py-7 space-y-7 hidden md:block overflow-y-auto">

        <div>
          <SectionHeader title="recommended" />
          <ul className="space-y-1.5">
            {RECOMMENDED.map((r) => (
              <FilterCheckbox key={r.label} {...r} />
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="path" />
          <ul className="space-y-1.5">
            {PATHS.map((p) => (
              <FilterCheckbox key={p.label} {...p} />
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="layer" />
          <ul className="space-y-1.5">
            {LAYERS.map((l) => (
              <FilterCheckbox key={l.label} {...l} />
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="difficulty" />
          <ul className="space-y-1.5">
            {DIFFICULTIES.map((d) => (
              <FilterCheckbox key={d.label} {...d} />
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="price" />
          <ul className="space-y-1.5">
            {PRICES.map((p) => (
              <FilterCheckbox key={p.label} {...p} />
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-7 overflow-y-auto">
        <p className="text-xs mb-5 font-bold tracking-widest uppercase" style={{ color: ACCENT }}>
          // DEV LIBRARY — V0.1
        </p>
        <h1 className="text-4xl font-bold mb-3 leading-tight">
          Curated. Contextual.{" "}
          <span style={{ color: ACCENT }}>Not a link dump.</span>
        </h1>
        <p className="text-sm sm:text-base mb-8 max-w-xl" style={{ color: "#666" }}>
          Every entry exists because it belongs to a specific path and layer.
          The agent uses this library to recommend exactly the resource you need.
        </p>

        {/* Tabs */}
        <div className="flex gap-6 mb-6" style={{ borderBottom: "1px solid #1a1a1a" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="pb-2 text-[14px] flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{
                color: activeTab === tab.key ? "#e5e5e5" : "#444",
                borderBottom: activeTab === tab.key ? `2px solid ${ACCENT}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {tab.label}
              <span
                className="px-1.5 py-0.5 rounded-sm"
                style={{
                  fontSize: 10,
                  backgroundColor: "#1a1a1a",
                  color: activeTab === tab.key ? ACCENT : "#444",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Agent Banner */}
        <div
          className="flex items-start justify-between gap-4 p-4 mb-8 rounded-sm"
          style={{ border: "1px solid #2d1b4e", backgroundColor: "#0f0b1a" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5"
              style={{ border: "1px solid #3b2060" }}
            >
              <span style={{ color: ACCENT, fontSize: 12 }}>▣</span>
            </div>
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: ACCENT }}>
                // AGENT PICKED 3 RESOURCES FOR YOUR WEAK SPOT
              </p>
              <p className="text-xs" style={{ color: "#666" }}>
                "async error handling" — start here, then move to streams.
              </p>
            </div>
          </div>
          <button
            className="text-xs px-3 py-1.5 shrink-0 transition-opacity hover:opacity-80"
            style={{ color: ACCENT, border: "1px solid #3b2060", backgroundColor: "transparent" }}
          >
            view picks →
          </button>
        </div>

        {/* Books Section */}
        <div className="mb-10">
          <SectionHeader title="books · layer 3 picks" />
          <div className="flex gap-4 overflow-x-auto pb-3">
            {BOOKS.map((book, i) => (
              <div
                key={i}
                className="shrink-0 w-44 flex flex-col justify-between cursor-pointer"
                style={{
                  height: 240,
                  backgroundColor: "#111",
                  border: "1px solid #1f1f1f",
                  borderLeft: `4px solid ${book.accent}`,
                  padding: "16px 14px",
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#181818")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
              >
                <p className="text-sm font-semibold leading-snug" style={{ color: "#e5e5e5" }}>
                  {book.title}
                </p>
                <div>
                  <p className="mb-1" style={{ color: "#555", fontSize: 10 }}>{book.author}</p>
                  <p className="mb-3" style={{ color: "#555", fontSize: 10 }}>
                    {book.price} · {book.pages} PAGES
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{ fontSize: 9, border: "1px solid #2a2a2a", color: "#555", padding: "2px 6px" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docs Section */}
        <div>
          <SectionHeader title="official docs · curated picks" />
          <div className="space-y-2">
            {DOCS_LIST.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-4 py-3 cursor-pointer"
                style={{ border: "1px solid #1f1f1f", backgroundColor: "#111", transition: "background-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#181818")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold w-5 text-center shrink-0" style={{ color: "#333", fontSize: 12 }}>
                    D
                  </span>
                  <div>
                    <p className="text-sm" style={{ color: "#e5e5e5" }}>{doc.title}</p>
                    <p style={{ color: "#555", fontSize: 11 }}>{doc.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={tag.style}
                      style={{ fontSize: 9, border: "1px solid", padding: "2px 8px" }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
