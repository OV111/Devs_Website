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

const MAIN_W  = 100;
const CHILD_W = 50;
const NODE_H  = 56;
const CHILD_H = 36;

const getNodeH = (node) =>
  node.children?.length ? Math.max(node.children.length * CHILD_H, NODE_H) : NODE_H;

const ChildNode = ({ title, tags, side }) => (
  <div className={`
    inline-flex flex-col gap-1 px-2.5 py-1.5 rounded-lg
    bg-neutral-950 border border-neutral-800/60
    min-w-[100px] max-w-[130px]
    ${side === "left" ? "text-right items-end" : "text-left items-start"}
  `}>
    <span className="text-[11px] font-medium text-neutral-400 leading-tight">{title}</span>
    <div className={`flex flex-wrap gap-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
      {tags.map((tag) => (
        <span key={tag} className="text-[9px] text-neutral-600">{tag}</span>
      ))}
    </div>
  </div>
);

const SubTopicNode = ({ title, tags, side, children = [], isDone }) => {
  const hasChildren = children.length > 0;
  const totalH = Math.max(children.length * CHILD_H, NODE_H);
  const parentCenterY = totalH / 2;

  const parentNode = (
    <div className={`
      inline-flex flex-col gap-1.5 px-3 py-2.5 rounded-xl
      bg-neutral-900 border border-neutral-800
      min-w-[130px] max-w-[170px] shrink-0
      ${side === "left" ? "text-right items-end" : "text-left items-start"}
    `}>
      <span className="text-[12px] font-medium text-neutral-200 leading-tight">{title}</span>
      <div className={`flex flex-wrap gap-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
        {tags.map((tag) => (
          <span key={tag} className="text-[10px] text-neutral-500 leading-none">{tag}</span>
        ))}
      </div>
    </div>
  );

  if (!hasChildren) return parentNode;

  const childSvg = (
    <svg width={CHILD_W} height={totalH} className="shrink-0 overflow-visible">
      {children.map((_, i) => {
        const childY = CHILD_H * i + CHILD_H / 2;
        const x1 = side === "left" ? CHILD_W : 0;
        const x2 = side === "left" ? 0 : CHILD_W;
        return (
          <path
            key={i}
            d={`M ${x1} ${parentCenterY} C ${CHILD_W * 0.5} ${parentCenterY}, ${CHILD_W * 0.5} ${childY}, ${x2} ${childY}`}
            fill="none"
            stroke={isDone ? "#5b21b6" : "#303030"}
            strokeWidth="1"
            strokeDasharray={isDone ? "none" : "3 3"}
          />
        );
      })}
    </svg>
  );

  const childrenCol = (
    <div className={`flex flex-col ${side === "left" ? "items-end" : "items-start"}`}
      style={{ gap: `${CHILD_H - 28}px` }}>
      {children.map((c) => (
        <ChildNode key={c.title} title={c.title} tags={c.tags} side={side} />
      ))}
    </div>
  );

  return (
    <div className="flex items-center">
      {side === "left"
        ? <>{childrenCol}{childSvg}{parentNode}</>
        : <>{parentNode}{childSvg}{childrenCol}</>
      }
    </div>
  );
};

const SpineRow = ({ layer, index, isLast }) => {
  const { layerProgress } = useRoadmapStore();
  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const centerRef = useRef(null);

  const resolvedStatus = layerProgress[layer.id] ?? layer.status ?? "locked";
  const isDone = resolvedStatus === "done";
  const leftNodes  = layer.sideLeft  ?? [];
  const rightNodes = layer.sideRight ?? [];

  // calculate cumulative Y centers for main SVG connections
  const buildPositions = (nodes) => {
    let offset = 0;
    return nodes.map((n) => {
      const h = getNodeH(n);
      const y = offset + h / 2;
      offset += h;
      return y;
    });
  };

  const leftPositions  = buildPositions(leftNodes);
  const rightPositions = buildPositions(rightNodes);
  const leftTotalH  = Math.max(leftNodes.reduce((s, n)  => s + getNodeH(n), 0), NODE_H);
  const rightTotalH = Math.max(rightNodes.reduce((s, n) => s + getNodeH(n), 0), NODE_H);
  const leftCenterY  = leftTotalH  / 2;
  const rightCenterY = rightTotalH / 2;

  return (
    <motion.div
      className="relative flex items-center justify-center gap-0"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      {/* Left nodes */}
      <div className="flex flex-col items-end" ref={leftRef}
        style={{ gap: 0 }}>
        {leftNodes.map((node) => (
          <SubTopicNode
            key={node.title}
            title={node.title}
            tags={node.tags}
            side="left"
            children={node.children ?? []}
            isDone={isDone}
          />
        ))}
      </div>

      {/* Main connector — left */}
      <svg width={MAIN_W} height={leftTotalH} className="shrink-0 overflow-visible" style={{ minHeight: NODE_H }}>
        {leftNodes.map((_, i) => (
          <path
            key={i}
            d={`M ${MAIN_W} ${leftCenterY} C ${MAIN_W * 0.4} ${leftCenterY}, ${MAIN_W * 0.6} ${leftPositions[i]}, 0 ${leftPositions[i]}`}
            fill="none"
            stroke={isDone ? "#7c3aed" : "#404040"}
            strokeWidth="1.5"
            strokeDasharray={isDone ? "none" : "5 4"}
            opacity="0.7"
          />
        ))}
        {leftNodes.length === 0 && <line x1={MAIN_W} y1="28" x2="0" y2="28" stroke="transparent" />}
      </svg>

      {/* Center */}
      <div ref={centerRef} style={{ width: 280 }} className="shrink-0">
        <LayerNode layer={layer} index={index} />
        {!isLast && (
          <div className="flex justify-center">
            <div className="w-px mt-1" style={{
              height: 32,
              background: isDone ? "#7c3aed" : undefined,
              borderLeft: !isDone ? "1px dashed #404040" : undefined,
            }} />
          </div>
        )}
      </div>

      {/* Main connector — right */}
      <svg width={MAIN_W} height={rightTotalH} className="shrink-0 overflow-visible" style={{ minHeight: NODE_H }}>
        {rightNodes.map((_, i) => (
          <path
            key={i}
            d={`M 0 ${rightCenterY} C ${MAIN_W * 0.4} ${rightCenterY}, ${MAIN_W * 0.6} ${rightPositions[i]}, ${MAIN_W} ${rightPositions[i]}`}
            fill="none"
            stroke={isDone ? "#7c3aed" : "#404040"}
            strokeWidth="1.5"
            strokeDasharray={isDone ? "none" : "5 4"}
            opacity="0.7"
          />
        ))}
        {rightNodes.length === 0 && <line x1="0" y1="28" x2={MAIN_W} y2="28" stroke="transparent" />}
      </svg>

      {/* Right nodes */}
      <div className="flex flex-col items-start" ref={rightRef} style={{ gap: 0 }}>
        {rightNodes.map((node) => (
          <SubTopicNode
            key={node.title}
            title={node.title}
            tags={node.tags}
            side="right"
            children={node.children ?? []}
            isDone={isDone}
          />
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
        <p className="text-sm tracking-widest uppercase text-neutral-600">
          Roadmap being authored
        </p>
        <p className="text-xs text-neutral-700 max-w-xs text-center">
          This track is being carefully crafted. Check back soon.
        </p>
      </motion.div>
    );
  }

  const totalLayers = layers.length;
  const doneCount = layers.filter(
    (l) => (layerProgress[l.id] ?? l.status) === "done",
  ).length;
  // eslint-disable-next-line no-unused-vars
  const inProgressCount = layers.filter(
    (l) => (layerProgress[l.id] ?? l.status) === "in-progress",
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1">
                Selected Track
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 leading-tight">
                {selectedTrack.title}
              </h2>
              {/* <div className="flex flex-wrap gap-2 mt-3">
                {selectedTrack.techs.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-700/50 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div> */}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm text-neutral-400 font-mono">
                {eta} · {totalLayers} layers
              </p>
            </div>
          </div>

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

      <AnimatePresence>{isPanelOpen && <LayerDetail />}</AnimatePresence>
    </>
  );
};

export default RoadmapTree;
