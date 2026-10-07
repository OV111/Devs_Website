import React from "react";
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

function ExternalLink({ href, label, name, primary }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} ${label} (opens in new tab)`}
      className={`text-xs font-medium hover:underline ${
        primary ? "text-purple-400" : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      {label} ↗
    </a>
  );
}

// No whole-card click: the card has three destinations, so each link is its own target.
export default function LibCard({ lib }) {
  const IconComponent = ICONS[lib.icon];
  return (
    <article
      className="flex flex-col justify-between rounded-md border border-neutral-800 border-t-[3px] bg-neutral-950 p-4 transition-colors hover:bg-neutral-900"
      style={{ borderTopColor: lib.iconColor }}
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {IconComponent ? (
              <IconComponent size={22} color={lib.iconColor} aria-hidden="true" />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center text-xs font-bold"
                style={{ color: lib.iconColor, border: `1px solid ${lib.iconColor}55` }}
              >
                {lib.name[0]}
              </span>
            )}
            <h3 className="text-sm font-semibold text-neutral-100">{lib.name}</h3>
          </div>
          <span className="rounded-sm border border-neutral-700 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-neutral-400">
            {lib.category}
          </span>
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-neutral-400">{lib.description}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {lib.tags.map((tag) => (
            <span key={tag} className="rounded-sm border border-neutral-700 px-1.5 py-0.5 text-[11px] text-neutral-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400">↓ {lib.weeklyDownloads}/wk</span>
        <div className="flex gap-3">
          <ExternalLink href={lib.docs} label="Docs" name={lib.name} primary />
          <ExternalLink href={lib.github} label="GitHub" name={lib.name} />
          <ExternalLink href={lib.npm} label="npm" name={lib.name} />
        </div>
      </div>
    </article>
  );
}
