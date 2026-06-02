import React from "react";
import * as Si from "react-icons/si";

export default function LibCard({ lib }) {
  const IconComponent = Si[lib.icon];
  return (
    <div
      className="flex flex-col justify-between p-4 cursor-pointer transition-colors"
      style={{
        backgroundColor: "#111",
        border: "1px solid #1f1f1f",
        borderTop: `3px solid ${lib.iconColor}`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#181818")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111")}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {IconComponent ? (
              <IconComponent size={22} color={lib.iconColor} />
            ) : (
              <span
                className="w-6 h-6 flex items-center justify-center text-xs font-bold"
                style={{ color: lib.iconColor, border: `1px solid ${lib.iconColor}33` }}
              >
                {lib.name[0]}
              </span>
            )}
            <span className="text-sm font-semibold text-[#e5e5e5]">{lib.name}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 uppercase font-bold text-[#444] border border-[#222]">
            {lib.category}
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3 text-[#666]">{lib.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {lib.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] border border-[#222] text-[#444] px-1.5 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#444]">↓ {lib.weeklyDownloads}/wk</span>
        <div className="flex gap-3">
          <a
            href={lib.docs}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] transition-opacity hover:opacity-80 text-purple-600"
          >
            docs →
          </a>
          <a
            href={lib.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] transition-opacity hover:opacity-80 text-[#444]"
          >
            github →
          </a>
          <a
            href={lib.npm}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] transition-opacity hover:opacity-80 text-[#444]"
          >
            npm →
          </a>
        </div>
      </div>
    </div>
  );
}
