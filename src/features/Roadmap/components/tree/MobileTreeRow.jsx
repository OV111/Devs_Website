import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import LayerNode from "../LayerNode";
import { RESOURCE_BADGE_COLORS } from "./treeTokens";

// Below ~1280px there's no room for a three-column spine, so this collapses
// to a single vertical flow: layer -> its sections -> their subtopics,
// each level indented under the previous with a simple border-left spine
// instead of computed SVG paths. Nothing here needs DOM measurement, which
// is also what guarantees it can never clip — every card is full-width
// within its own indentation level, never absolutely positioned.
//
// Touch screens have no hover, so the desktop "hover to reveal description"
// becomes tap-to-expand (accordion). Only one subtopic per layer is open at a
// time, which keeps the layer short enough to scroll through quickly.
const MobileSubtopic = ({ title, description, resources = [], open, onToggle }) => {
  const expandable = Boolean(description) || resources.length > 0;

  return (
    <div className="pl-4 border-l border-neutral-800">
      <button
        type="button"
        onClick={expandable ? onToggle : undefined}
        aria-expanded={expandable ? open : undefined}
        disabled={!expandable}
        // Visible row stays compact; the invisible ::after pads the tap area to ~44px.
        className="relative w-full flex items-center justify-between gap-2 py-2 text-left cursor-pointer disabled:cursor-default after:absolute after:-inset-y-1 after:inset-x-0"
      >
        <span className="text-[12px] font-medium leading-snug text-purple-600">
          {title}
        </span>
        {expandable && (
          <ChevronDown
            size={14}
            className={`shrink-0 text-neutral-500 transition-transform duration-200 ${open ? "rotate-180 text-purple-600" : ""}`}
          />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && expandable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {description && (
              <p className="text-[11px] text-neutral-400 leading-relaxed">{description}</p>
            )}
            {resources.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5 pb-2">
                {resources.slice(0, 3).map((r, i) => (
                  <span
                    key={i}
                    className={`text-[9px] px-1.5 py-0.5 rounded-md border font-medium ${
                      RESOURCE_BADGE_COLORS[r.type] ?? "bg-neutral-700/40 text-neutral-400 border-neutral-600/30"
                    }`}
                  >
                    {r.type}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileSection = ({ section, isDone, openKey, onToggle }) => (
  <div className="pl-4 border-l border-neutral-700/60 py-2">
    <p className={`text-[13px] font-semibold ${isDone ? "text-purple-200" : "text-neutral-200"}`}>
      {section.title}
    </p>
    {(section.children ?? []).length > 0 && (
      <div className="mt-1 flex flex-col">
        {section.children.map((c) => {
          const key = `${section.title}::${c.title}`;
          return (
            <MobileSubtopic
              key={c.title}
              title={c.title}
              description={c.description}
              resources={c.resources ?? []}
              open={openKey === key}
              onToggle={() => onToggle(key)}
            />
          );
        })}
      </div>
    )}
  </div>
);

const MobileTreeRow = ({ layer, index, isDone }) => {
  const sections = [...(layer.sideLeft ?? []), ...(layer.sideRight ?? [])];
  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) => setOpenKey((current) => (current === key ? null : key));

  return (
    <motion.div
      className="w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
    >
      <LayerNode layer={layer} index={index} resolvedStatus={isDone ? "done" : (layer.status ?? "locked")} />

      {sections.length > 0 && (
        <div className="mt-3 pl-5 flex flex-col">
          {sections.map((section) => (
            <MobileSection
              key={section.title}
              section={section}
              isDone={isDone}
              openKey={openKey}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MobileTreeRow;
