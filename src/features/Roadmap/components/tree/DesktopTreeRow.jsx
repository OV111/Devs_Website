import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import LayerNode from "../LayerNode";
import SectionCard from "./SectionCard";
import { useConnection, useConnectorNode } from "./connectorHooks";
import { TREE_TOKENS } from "./treeTokens";

// Section and subtopic cards are fixed-width and stack vertically, so every
// row's side panel is naturally this width UNLESS a layer has zero sections
// on that side — then the column would collapse to 0px and throw off the
// center layer-node spine's alignment for just that one row. Pin a min-width
// derived from the actual card tokens (not a guessed constant) so every
// row's panel reserves the same footprint even when empty.
const SIDE_PANEL_MIN_WIDTH = TREE_TOKENS.sectionWidth + 24 /* gap-6 */ + TREE_TOKENS.subtopicWidth;

// One layer's full row: left sections | layer node | right sections. All
// three columns sit in normal flex flow now (no SIDE_W-guessed widths) so
// nothing needs a fixed width beyond the subtopic/section cards themselves —
// the row is only as wide as its content, which is what lets the container
// decide whether to scroll instead of silently clipping the right column.
const LayerToSectionLink = ({ layerId, sectionId, isDone }) => {
  useConnection(`${layerId}->${sectionId}`, {
    fromId: layerId,
    toId: sectionId,
    dashed: !isDone,
    color: isDone ? TREE_TOKENS.doneColor : "#333333",
    strokeWidth: 1.5,
    opacity: isDone ? 0.8 : 0.5,
  });
  return null;
};

const DesktopTreeRow = ({ layer, index, isLast, isDone, isPrevDone }) => {
  const leftSections = layer.sideLeft ?? [];
  const rightSections = layer.sideRight ?? [];
  const layerId = `layer-${layer.id}`;
  const layerConnectorRef = useConnectorNode(layerId);

  return (
    <motion.div
      className="flex items-stretch justify-center gap-10 xl:gap-14"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.35), ease: "easeOut" }}
    >
      {/* Left panel */}
      <div className="shrink-0 flex flex-col justify-center items-end" style={{ gap: 16, minWidth: SIDE_PANEL_MIN_WIDTH }}>
        {leftSections.map((section, i) => {
          const sectionId = `${layerId}-left-${i}`;
          return (
            <div key={section.title}>
              <LayerToSectionLink layerId={layerId} sectionId={sectionId} isDone={isDone} />
              <SectionCard id={sectionId} title={section.title} side="left" isDone={isDone} children={section.children ?? []} />
            </div>
          );
        })}
      </div>

      {/* Center */}
      <div style={{ width: 300 }} className="shrink-0 flex flex-col items-center">
        <div className="flex-1 flex justify-center" style={{ minHeight: 18 }}>
          {index > 0 && (
            <div
              className="w-px h-full"
              style={{
                background: isPrevDone ? TREE_TOKENS.doneSpine : undefined,
                borderLeft: !isPrevDone ? "1px dashed #333333" : undefined,
              }}
            />
          )}
        </div>

        <LayerNode
          layer={layer}
          index={index}
          resolvedStatus={isDone ? "done" : (layer.status ?? "locked")}
          connectorId={layerId}
          connectorRef={layerConnectorRef}
        />

        <div className="flex-1 flex justify-center" style={{ minHeight: 18 }}>
          {!isLast && (
            <div
              className="w-px h-full"
              style={{
                background: isDone ? TREE_TOKENS.doneSpine : undefined,
                borderLeft: !isDone ? "1px dashed #333333" : undefined,
              }}
            />
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="shrink-0 flex flex-col justify-center items-start" style={{ gap: 16, minWidth: SIDE_PANEL_MIN_WIDTH }}>
        {rightSections.map((section, i) => {
          const sectionId = `${layerId}-right-${i}`;
          return (
            <div key={section.title}>
              <LayerToSectionLink layerId={layerId} sectionId={sectionId} isDone={isDone} />
              <SectionCard id={sectionId} title={section.title} side="right" isDone={isDone} children={section.children ?? []} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DesktopTreeRow;
