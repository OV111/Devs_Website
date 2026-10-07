import React from "react";

export default function SectionHeader({ title, count, as: Tag = "h2" }) {
  return (
    <div className="mb-4 flex items-baseline gap-2 border-b border-neutral-800 pb-2">
      <Tag className="text-sm font-semibold text-neutral-100">{title}</Tag>
      {count !== undefined && <span className="text-xs text-neutral-400">{count}</span>}
    </div>
  );
}
