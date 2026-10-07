import React from "react";

// One badge for every resource attribute (type, difficulty, price).
// `color` is data-driven (per type/difficulty), so it stays inline.
export default function Badge({ label, color }) {
  return (
    <span
      className="rounded-sm px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{ color, border: `1px solid ${color}55` }}
    >
      {label}
    </span>
  );
}
