// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { ROADMAPS } from "../../../../constants/roadmapPaths";
import useRoadmapStore from "@/stores/useRoadmapStore";
import LayerNode from "./LayerNode";
import LayerDetail from "./LayerDetail";

const ETA_MAP = {
  mern: "~6 months",
};

const SubTopicNode = ({ title, tags, side }) => (
  <div
    className={`
      inline-flex flex-col gap-1.5 px-3 py-2.5 rounded-xl
      bg-neutral-900 border border-neutral-800
      min-w-[130px] max-w-[170px]
      ${side === "left" ? "text-right items-end" : "text-left items-start"}
    `}
  >
    <span className="text-[12px] font-medium text-neutral-200 leading-tight">{title}</span>
    <div className={`flex flex-wrap gap-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] text-neutral-500 leading-none"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const SpineRow = ({ layer, index, isLast }) => {
  // eslint-disable-next-line no-unused-vars
  const { activeLayer, setActiveLayer, layerProgress } = useRoadmapStore();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const centerRef = useRef(null);

  const resolvedStatus = layerProgress[layer.id] ?? layer.status ?? "locked";
  const leftNodes = layer.sideLeft ?? [];
  const rightNodes = layer.sideRight ?? [];

  const CONNECTOR_W = 80;

  return (
    <motion.div
      className="relative flex items-center justify-center gap-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      {/* Left subtopic column */}
      <div className="flex flex-col gap-3 items-end" style={{ width: 180 }} ref={leftRef}>
        {leftNodes.map((node) => (
          <SubTopicNode key={node.title} title={node.title} tags={node.tags} side="left" />
        ))}
      </div>

      {/* Left SVG connector */}
      <svg
        width={CONNECTOR_W}
        height={Math.max(leftNodes.length, 1) * 56}
        className="shrink-0 overflow-visible"
        style={{ minHeight: 56 }}
      >
        {leftNodes.map((_, i) => {
          const totalH = Math.max(leftNodes.length, 1) * 56;
          const spacing = totalH / leftNodes.length;
          const nodeY = spacing * i + spacing / 2;
          const centerY = totalH / 2;
          const isDone = resolvedStatus === "done";
          return (
            <path
              key={i}
              d={`M ${CONNECTOR_W} ${centerY} C ${CONNECTOR_W * 0.4} ${centerY}, ${CONNECTOR_W * 0.6} ${nodeY}, 0 ${nodeY}`}
              fill="none"
              stroke={isDone ? "#7c3aed" : "#404040"}
              strokeWidth="1.5"
              strokeDasharray={isDone ? "none" : "5 4"}
              opacity="0.7"
            />
          );
        })}
        {leftNodes.length === 0 && (
          <line x1={CONNECTOR_W} y1="28" x2="0" y2="28" stroke="transparent" />
        )}
      </svg>

      {/* Center layer node */}
      <div ref={centerRef} style={{ width: 280 }} className="shrink-0">
        <LayerNode layer={layer} index={index} />
        {/* Spine segment below (except last) */}
        {!isLast && (
          <div className="flex justify-center">
            <div
              className="w-px mt-1"
              style={{
                height: 32,
                background: resolvedStatus === "done" ? "#7c3aed" : undefined,
                borderLeft: resolvedStatus !== "done" ? "1px dashed #404040" : undefined,
              }}
            />
          </div>
        )}
      </div>

      {/* Right SVG connector */}
      <svg
        width={CONNECTOR_W}
        height={Math.max(rightNodes.length, 1) * 56}
        className="shrink-0 overflow-visible"
        style={{ minHeight: 56 }}
      >
        {rightNodes.map((_, i) => {
          const totalH = Math.max(rightNodes.length, 1) * 56;
          const spacing = totalH / rightNodes.length;
          const nodeY = spacing * i + spacing / 2;
          const centerY = totalH / 2;
          const isDone = resolvedStatus === "done";
          return (
            <path
              key={i}
              d={`M 0 ${centerY} C ${CONNECTOR_W * 0.4} ${centerY}, ${CONNECTOR_W * 0.6} ${nodeY}, ${CONNECTOR_W} ${nodeY}`}
              fill="none"
              stroke={isDone ? "#7c3aed" : "#404040"}
              strokeWidth="1.5"
              strokeDasharray={isDone ? "none" : "5 4"}
              opacity="0.7"
            />
          );
        })}
        {rightNodes.length === 0 && (
          <line x1="0" y1="28" x2={CONNECTOR_W} y2="28" stroke="transparent" />
        )}
      </svg>

      {/* Right subtopic column */}
      <div className="flex flex-col gap-3 items-start" style={{ width: 180 }} ref={rightRef}>
        {rightNodes.map((node) => (
          <SubTopicNode key={node.title} title={node.title} tags={node.tags} side="right" />
        ))}
      </div>
    </motion.div>
  );
};

const RoadmapTree = () => {
  const { selectedTrack, isPanelOpen, layerProgress } = useRoadmapStore();
  const layers = ROADMAPS[selectedTrack?.id];

  if (!layers) {
    return (
      <motion.div
        className="mt-20 flex flex-col items-center gap-3 text-neutral-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl opacity-40">🚧</div>
        <p className="text-sm tracking-widest uppercase text-neutral-600">Roadmap being authored</p>
        <p className="text-xs text-neutral-700 max-w-xs text-center">
          This track is being carefully crafted. Check back soon.
        </p>
      </motion.div>
    );
  }

  const totalLayers = layers.length;
  const doneCount = layers.filter(
    (l) => (layerProgress[l.id] ?? l.status) === "done"
  ).length;
  // eslint-disable-next-line no-unused-vars
  const inProgressCount = layers.filter(
    (l) => (layerProgress[l.id] ?? l.status) === "in-progress"
  ).length;
  const eta = ETA_MAP[selectedTrack?.id] ?? `~${totalLayers * 2} weeks`;

  return (
    <>
      <style>{`
        @keyframes in-progress-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(147,51,234,0.0), 0 0 12px rgba(147,51,234,0.3); }
          50%       { box-shadow: 0 0 0 4px rgba(147,51,234,0.12), 0 0 22px rgba(147,51,234,0.5); }
        }
        .layer-in-progress { animation: in-progress-pulse 2.5s ease-in-out infinite; }
      `}</style>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Track Header ── */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1">
                Selected Track
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 leading-tight">
                {selectedTrack.title}
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTrack.techs.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-700/50 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm text-neutral-400 font-mono">
                {eta} · {totalLayers} layers
              </p>
            </div>
          </div>

          {/* Legend + Progress row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-5 text-[12px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block ring-2 ring-violet-500/40" />
                in progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-600 inline-block" />
                locked
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] text-neutral-400 font-mono whitespace-nowrap">
                {doneCount} / {totalLayers} layers
              </span>
              <div className="w-32 h-1 rounded-full bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-purple-600 to-violet-500 transition-all duration-500"
                  style={{ width: `${(doneCount / totalLayers) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-neutral-800" />
        </div>

        {/* ── Tree Canvas ── */}
        <div className="relative flex flex-col items-center gap-0 overflow-x-auto pb-10">
          {layers.map((layer, index) => (
            <SpineRow
              key={layer.id}
              layer={layer}
              index={index}
              isLast={index === layers.length - 1}
            />
          ))}
        </div>
      </motion.div>

      {/* Detail drawer */}
      <AnimatePresence>{isPanelOpen && <LayerDetail />}</AnimatePresence>
    </>
  );
};

export default RoadmapTree;
