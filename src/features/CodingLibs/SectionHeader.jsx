import React from "react";

export default function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[11px] font-bold tracking-widest shrink-0 uppercase text-purple-600">
        // {title}
      </span>
      <div className="flex-1 h-px rounded-full bg-purple-600/20" />
    </div>
  );
}
