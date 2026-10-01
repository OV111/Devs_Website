import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useConnectorNode } from "./connectorHooks";
import { TREE_TOKENS, RESOURCE_BADGE_COLORS } from "./treeTokens";

// Leaf card — fixed width, intrinsic (not fixed) height so it never overlaps
// its neighbors regardless of title length. Title clamps to 2 lines with an
// ellipsis; the native `title` attribute gives the full text on hover
// without extra JS/UI.
const SubtopicCard = ({ id, title, description, resources = [], side, isDone }) => {
  const [hovered, setHovered] = useState(false);
  const connectorRef = useConnectorNode(id);

  return (
    <div
      ref={connectorRef}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: TREE_TOKENS.subtopicWidth, minHeight: TREE_TOKENS.subtopicMinHeight }}
      className={`
        flex flex-col gap-1.5 px-3 py-2.5 ${TREE_TOKENS.cardRadius} cursor-default border
        transition-all duration-200 shrink-0
        ${isDone
          ? "bg-neutral-900/80 border-purple-700/30 hover:border-purple-500/50 hover:bg-neutral-800/60"
          : "bg-neutral-900/80 border-neutral-700/40 hover:border-neutral-600/60 hover:bg-neutral-800/60"
        }
        ${side === "left" ? "text-right items-end" : "text-left items-start"}
      `}
    >
      <span
        className={`text-[11px] font-semibold leading-snug line-clamp-2 ${isDone ? "text-purple-200" : "text-neutral-300"}`}
      >
        {title}
      </span>

      <AnimatePresence>
        {hovered && description && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[10px] text-neutral-400 leading-relaxed overflow-hidden"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>

      {resources.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-auto pt-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
          {resources.slice(0, 2).map((r, i) => (
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
};

export default SubtopicCard;
