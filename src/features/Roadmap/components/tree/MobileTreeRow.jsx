import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import LayerNode from "../LayerNode";
import { RESOURCE_BADGE_COLORS } from "./treeTokens";

// Below ~1280px there's no room for a three-column spine, so this collapses
// to a single vertical flow: layer -> its sections -> their subtopics,
// each level indented under the previous with a simple border-left spine
// instead of computed SVG paths. Nothing here needs DOM measurement, which
// is also what guarantees it can never clip — every card is full-width
// within its own indentation level, never absolutely positioned.
const MobileSubtopic = ({ title, description, resources = [] }) => (
  <div className="pl-4 border-l border-neutral-800 py-2">
    <p className="text-[12px] font-medium text-neutral-300 leading-snug">{title}</p>
    {description && (
      <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{description}</p>
    )}
    {resources.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1.5">
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
  </div>
);

const MobileSection = ({ section, isDone }) => (
  <div className="pl-4 border-l border-neutral-700/60 py-2">
    <p className={`text-[13px] font-semibold ${isDone ? "text-purple-200" : "text-neutral-200"}`}>
      {section.title}
    </p>
    {(section.children ?? []).length > 0 && (
      <div className="mt-1.5 flex flex-col">
        {section.children.map((c) => (
          <MobileSubtopic key={c.title} title={c.title} description={c.description} resources={c.resources ?? []} />
        ))}
      </div>
    )}
  </div>
);

const MobileTreeRow = ({ layer, index, isDone }) => {
  const sections = [...(layer.sideLeft ?? []), ...(layer.sideRight ?? [])];

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
            <MobileSection key={section.title} section={section} isDone={isDone} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MobileTreeRow;
