// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState, useEffect, useMemo } from "react";
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

const ChildNode = ({ title, side }) => (
  <div className={`
    inline-flex flex-col gap-1 px-2.5 py-1.5 rounded-lg
    bg-neutral-950 border border-neutral-800/60
    min-w-[100px] max-w-[130px]
    ${side === "left" ? "text-right items-end" : "text-left items-start"}
  `}>
    <span className="text-[11px] font-medium text-neutral-400 leading-tight">{title}</span>
  </div>
);

const SubTopicNode = ({ title, side, children = [], isDone }) => {
  const hasChildren = children.length > 0;
  const totalH = Math.max(children.length * CHILD_H, NODE_H);
  const parentCenterY = totalH / 2;

  // child Y centres — centre of each equal slot
  const childCenters = children.map((_, i) => (CHILD_H * i) + CHILD_H / 2);

  const parentNode = (
    <div
      className={`
        flex flex-col justify-center px-3 rounded-xl shrink-0
        bg-neutral-900 border border-neutral-800
        min-w-[130px] max-w-[170px]
        ${side === "left" ? "text-right items-end" : "text-left items-start"}
      `}
      style={{ height: totalH }}
    >
      <span className="text-[12px] font-medium text-neutral-200 leading-snug line-clamp-3">{title}</span>
    </div>
  );

  if (!hasChildren) return parentNode;

  const childSvg = (
    <svg width={CHILD_W} height={totalH} className="shrink-0 overflow-visible">
      {childCenters.map((childY, i) => {
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

  // each child gets an exact CHILD_H slot; ChildNode is centred inside it
  const childrenCol = (
    <div className="flex flex-col shrink-0" style={{ height: totalH }}>
      {children.map((c) => (
        <div
          key={c.title}
          style={{ height: CHILD_H, display: "flex", alignItems: "center",
            justifyContent: side === "left" ? "flex-end" : "flex-start" }}
        >
          <ChildNode title={c.title} side={side} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center" style={{ height: totalH }}>
      {side === "left"
        ? <>{childrenCol}{childSvg}{parentNode}</>
        : <>{parentNode}{childSvg}{childrenCol}</>
      }
    </div>
  );
};

const SpineRow = memo(({ layer, index, isLast, isDone }) => {
  const leftNodes  = useMemo(() => layer.sideLeft  ?? [], [layer.sideLeft]);
  const rightNodes = useMemo(() => layer.sideRight ?? [], [layer.sideRight]);

  const leftPositions = useMemo(() => {
    let offset = 0;
    return leftNodes.map((n) => { const h = getNodeH(n); const y = offset + h / 2; offset += h; return y; });
  }, [leftNodes]);

  const rightPositions = useMemo(() => {
    let offset = 0;
    return rightNodes.map((n) => { const h = getNodeH(n); const y = offset + h / 2; offset += h; return y; });
  }, [rightNodes]);

  const leftTotalH  = Math.max(leftNodes.reduce((s, n)  => s + getNodeH(n), 0), NODE_H);
  const rightTotalH = Math.max(rightNodes.reduce((s, n) => s + getNodeH(n), 0), NODE_H);
  const leftCenterY  = leftTotalH  / 2;
  const rightCenterY = rightTotalH / 2;

  const SIDE_W = 420;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.07, 0.3) }}
    >
      {/* Left panel — fixed width, content right-aligned */}
      <div
        className="shrink-0 flex items-center justify-end"
        style={{ width: SIDE_W, minHeight: NODE_H }}
      >
        <div className="flex flex-col items-end" style={{ gap: 0 }}>
          {leftNodes.map((node) => (
            <div key={node.title} style={{ height: getNodeH(node), display: "flex", alignItems: "center" }}>
              <SubTopicNode
                title={node.title}
                side="left"
                children={node.children ?? []}
                isDone={isDone}
              />
            </div>
          ))}
        </div>

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
      </div>

      {/* Center — fixed width, always pinned */}
      <div style={{ width: 280 }} className="shrink-0">
        <LayerNode layer={layer} index={index} resolvedStatus={isDone ? "done" : (layer.status ?? "locked")} />
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

      {/* Right panel — fixed width, content left-aligned */}
      <div
        className="shrink-0 flex items-center justify-start"
        style={{ width: SIDE_W, minHeight: NODE_H }}
      >
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

        <div className="flex flex-col items-start" style={{ gap: 0 }}>
          {rightNodes.map((node) => (
            <div key={node.title} style={{ height: getNodeH(node), display: "flex", alignItems: "center" }}>
              <SubTopicNode
                title={node.title}
                side="right"
                children={node.children ?? []}
                isDone={isDone}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

const RoadmapTree = () => {
  const { selectedTrack, selectedCategory, isPanelOpen, layerProgress } = useRoadmapStore();
  const [categoryData, setCategoryData] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoadingCategory(true);
    import(`../../../data/roadmaps/${selectedCategory.id}.json`)
      .then((mod) => {
        setCategoryData(mod.default);
        setLoadingCategory(false);
      })
      .catch(() => setLoadingCategory(false));
  }, [selectedCategory]);

  const layers = selectedTrack ? categoryData[selectedTrack.id] : null;

  if (loadingCategory) {
    return (
      <motion.div
        className="mt-20 flex flex-col items-center gap-3 text-neutral-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-600">Loading roadmap...</p>
      </motion.div>
    );
  }

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
              isDone={(layerProgress[layer.id] ?? layer.status) === "done"}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>{isPanelOpen && <LayerDetail />}</AnimatePresence>
    </>
  );
};

export default RoadmapTree;
