// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState, useEffect, useMemo } from "react";
import useRoadmapStore from "@/stores/useRoadmapStore";
import LayerNode from "./LayerNode";
import LayerDetail from "./LayerDetail";

const ETA_MAP = {
  mern: "~6 months",
};

const MAIN_W  = 80;
const NODE_H  = 60;
const CHILD_H = 52;

const getNodeH = (node) =>
  node.children?.length ? Math.max(node.children.length * CHILD_H, NODE_H) : NODE_H;

const RESOURCE_COLORS = {
  docs:    "bg-sky-500/15 text-sky-300 border-sky-500/20",
  video:   "bg-rose-500/15 text-rose-300 border-rose-500/20",
  article: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  tool:    "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  course:  "bg-violet-500/15 text-violet-300 border-violet-500/20",
  book:    "bg-orange-500/15 text-orange-300 border-orange-500/20",
};

const ChildNode = ({ title, description, resources = [], side, isDone }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        relative flex flex-col gap-1.5 px-3 py-2.5 rounded-xl cursor-default
        border transition-all duration-200
        ${isDone
          ? "bg-purple-950/40 border-purple-700/30 hover:border-purple-500/50 hover:bg-purple-900/30"
          : "bg-neutral-900/80 border-neutral-700/40 hover:border-neutral-600/60 hover:bg-neutral-800/60"
        }
        ${side === "left" ? "text-right items-end" : "text-left items-start"}
        min-w-[160px] max-w-[200px]
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`text-[11px] font-semibold leading-snug ${isDone ? "text-purple-200" : "text-neutral-300"}`}>
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
        <div className={`flex flex-wrap gap-1 ${side === "left" ? "justify-end" : "justify-start"}`}>
          {resources.slice(0, 2).map((r, i) => (
            <span
              key={i}
              className={`text-[9px] px-1.5 py-0.5 rounded-md border font-medium ${
                RESOURCE_COLORS[r.type] ?? "bg-neutral-700/40 text-neutral-400 border-neutral-600/30"
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

const SubTopicNode = ({ title, side, children = [], isDone }) => {
  const hasChildren = children.length > 0;
  const totalH = Math.max(children.length * CHILD_H, NODE_H);
  const parentCenterY = totalH / 2;
  const CHILD_CONN_W = 44;

  const childCenters = children.map((_, i) => CHILD_H * i + CHILD_H / 2);

  const accentColor = isDone ? "#7c3aed" : "#404040";

  const parentNode = (
    <div
      className={`
        flex flex-col justify-center px-3.5 rounded-2xl shrink-0 relative overflow-hidden
        border transition-colors
        ${isDone
          ? "bg-purple-950/60 border-purple-600/40"
          : "bg-neutral-900/90 border-neutral-700/50"
        }
        min-w-[150px] max-w-[190px]
      `}
      style={{ height: totalH }}
    >
      {/* accent bar */}
      <div
        className={`absolute top-0 ${side === "left" ? "right-0" : "left-0"} w-0.5 h-full rounded-full opacity-60`}
        style={{ background: isDone ? "linear-gradient(to bottom, #7c3aed, #a855f7)" : "#303030" }}
      />
      <span className={`text-[12px] font-semibold leading-snug ${isDone ? "text-purple-100" : "text-neutral-200"} ${side === "left" ? "text-right" : "text-left"}`}>
        {title}
      </span>
      {hasChildren && (
        <span className={`text-[9px] mt-1 ${isDone ? "text-purple-400" : "text-neutral-500"} ${side === "left" ? "text-right" : "text-left"}`}>
          {children.length} subtopic{children.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );

  if (!hasChildren) return parentNode;

  const childSvg = (
    <svg width={CHILD_CONN_W} height={totalH} className="shrink-0 overflow-visible">
      {childCenters.map((childY, i) => {
        const x1 = side === "left" ? CHILD_CONN_W : 0;
        const x2 = side === "left" ? 0 : CHILD_CONN_W;
        return (
          <path
            key={i}
            d={`M ${x1} ${parentCenterY} C ${CHILD_CONN_W * 0.5} ${parentCenterY}, ${CHILD_CONN_W * 0.5} ${childY}, ${x2} ${childY}`}
            fill="none"
            stroke={accentColor}
            strokeWidth="1"
            strokeDasharray={isDone ? "none" : "3 3"}
            opacity="0.6"
          />
        );
      })}
    </svg>
  );

  const childrenCol = (
    <div className="flex flex-col shrink-0" style={{ height: totalH }}>
      {children.map((c) => (
        <div
          key={c.title}
          style={{ height: CHILD_H, display: "flex", alignItems: "center",
            justifyContent: side === "left" ? "flex-end" : "flex-start" }}
        >
          <ChildNode
            title={c.title}
            description={c.description}
            resources={c.resources ?? []}
            side={side}
            isDone={isDone}
          />
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

  const leftTotalH  = Math.max(leftNodes.reduce((s, n) => s + getNodeH(n), 0), NODE_H);
  const rightTotalH = Math.max(rightNodes.reduce((s, n) => s + getNodeH(n), 0), NODE_H);
  const leftCenterY  = leftTotalH  / 2;
  const rightCenterY = rightTotalH / 2;

  const SIDE_W = 500;
  const strokeColor = isDone ? "#7c3aed" : "#333333";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.35), ease: "easeOut" }}
    >
      {/* Left panel */}
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
              d={`M ${MAIN_W} ${leftCenterY} C ${MAIN_W * 0.35} ${leftCenterY}, ${MAIN_W * 0.65} ${leftPositions[i]}, 0 ${leftPositions[i]}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray={isDone ? "none" : "5 4"}
              opacity={isDone ? "0.8" : "0.5"}
            />
          ))}
          {leftNodes.length === 0 && <line x1={MAIN_W} y1="30" x2="0" y2="30" stroke="transparent" />}
        </svg>
      </div>

      {/* Center */}
      <div style={{ width: 300 }} className="shrink-0">
        <LayerNode layer={layer} index={index} resolvedStatus={isDone ? "done" : (layer.status ?? "locked")} />
        {!isLast && (
          <div className="flex justify-center">
            <div
              className="w-px mt-1"
              style={{
                height: 36,
                background: isDone ? "linear-gradient(to bottom, #7c3aed, #5b21b6)" : undefined,
                borderLeft: !isDone ? "1px dashed #333333" : undefined,
              }}
            />
          </div>
        )}
      </div>

      {/* Right panel */}
      <div
        className="shrink-0 flex items-center justify-start"
        style={{ width: SIDE_W, minHeight: NODE_H }}
      >
        <svg width={MAIN_W} height={rightTotalH} className="shrink-0 overflow-visible" style={{ minHeight: NODE_H }}>
          {rightNodes.map((_, i) => (
            <path
              key={i}
              d={`M 0 ${rightCenterY} C ${MAIN_W * 0.35} ${rightCenterY}, ${MAIN_W * 0.65} ${rightPositions[i]}, ${MAIN_W} ${rightPositions[i]}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeDasharray={isDone ? "none" : "5 4"}
              opacity={isDone ? "0.8" : "0.5"}
            />
          ))}
          {rightNodes.length === 0 && <line x1="0" y1="30" x2={MAIN_W} y2="30" stroke="transparent" />}
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
        className="mt-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-600">Loading roadmap...</p>
      </motion.div>
    );
  }

  if (!layers) {
    return (
      <motion.div
        className="mt-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl opacity-30">🚧</div>
        <p className="text-sm tracking-widest uppercase text-neutral-600">Roadmap being authored</p>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-1">Selected Track</p>
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

          {/* hint */}
          <p className="mt-3 text-[10px] text-neutral-600 text-center">
            Hover subtopic cards to see descriptions · resource type badges show what&rsquo;s available
          </p>
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
