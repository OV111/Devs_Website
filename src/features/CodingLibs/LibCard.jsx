import React, { useState } from "react";
import {
  SiDjango, SiDocker, SiEslint, SiExpo, SiExpress, SiFastapi, SiFastify,
  SiFlutter, SiFramer, SiGithubactions, SiGraphql, SiJest, SiKubernetes,
  SiNestjs, SiNextdotjs, SiOpenai, SiPrettier, SiPrisma, SiPytorch, SiReact,
  SiRedux, SiSvelte, SiTailwindcss, SiTensorflow, SiTerraform, SiVite,
  SiVitest, SiVuedotjs,
} from "react-icons/si";

// Explicit map instead of `import * as Si` — the namespace import defeats
// tree-shaking and bundled all ~3,000 Simple Icons (~4.9 MB) into this page.
// Add an entry here when constants/libs.js gains a new `icon` name; unknown
// names fall back to the first-letter badge below.
const ICONS = {
  SiDjango, SiDocker, SiEslint, SiExpo, SiExpress, SiFastapi, SiFastify,
  SiFlutter, SiFramer, SiGithubactions, SiGraphql, SiJest, SiKubernetes,
  SiNestjs, SiNextdotjs, SiOpenai, SiPrettier, SiPrisma, SiPytorch, SiReact,
  SiRedux, SiSvelte, SiTailwindcss, SiTensorflow, SiTerraform, SiVite,
  SiVitest, SiVuedotjs,
};

export default function LibCard({ lib }) {
  const IconComponent = ICONS[lib.icon];
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col justify-between p-4 cursor-pointer transition-colors"
      style={{
        backgroundColor: hovered ? "#181818" : "#111",
        border: "1px solid #1f1f1f",
        borderTop: `3px solid ${lib.iconColor}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
