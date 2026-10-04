// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useRoadmapStore from "@/stores/useRoadmapStore";
import { useMediaQuery } from "@/hooks/use-media-query";
import LayerDetail from "./LayerDetail";
import { ConnectorProvider } from "./tree/ConnectorContext";
import DesktopTreeRow from "./tree/DesktopTreeRow";
import MobileTreeRow from "./tree/MobileTreeRow";
import CapstoneRoadmapNode from "@/features/capstone/components/CapstoneRoadmapNode";

const ETA_MAP = {
  mern: "~6 months",
};

// Below this, the 3-column spine (left subtopics | sections | layer |
// sections | right subtopics) has nowhere near enough room — collapse to
// MobileTreeRow's single vertical flow instead. Matches Tailwind's own `xl`
// breakpoint so the same number isn't duplicated in a className vs a raw px.
const DESKTOP_BREAKPOINT = "(min-width: 1280px)";

const RoadmapTree = () => {
  const { selectedTrack, selectedCategory, isPanelOpen, layerProgress } = useRoadmapStore();
  const [categoryData, setCategoryData] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

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
        <div className="mt-25 mb-8 w-full px-4">
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

          {isDesktop && (
            <p className="mt-3 text-[10px] text-neutral-600 text-center">
              Hover subtopic cards to see descriptions · resource type badges show what&rsquo;s available
            </p>
          )}
        </div>

        {isDesktop ? (
          // Tree fills the page width naturally (no max-content / scroll box).
          <ConnectorProvider className="w-full pb-10">
            <div className="flex w-full flex-col items-center gap-0 px-10">
              {layers.map((layer, index) => (
                <DesktopTreeRow
                  key={layer.id}
                  layer={layer}
                  index={index}
                  isLast={index === layers.length - 1}
                  isDone={(layerProgress[layer.id] ?? layer.status) === "done"}
                  isPrevDone={index > 0 && (layerProgress[layers[index - 1].id] ?? layers[index - 1].status) === "done"}
                />
              ))}
              {/* The track's final step; renders nothing if it has no capstone. */}
              <CapstoneRoadmapNode trackId={selectedTrack.id} />
            </div>
          </ConnectorProvider>
        ) : (
          <div className="flex flex-col gap-5 px-4 pb-10">
            {layers.map((layer, index) => (
              <MobileTreeRow
                key={layer.id}
                layer={layer}
                index={index}
                isDone={(layerProgress[layer.id] ?? layer.status) === "done"}
              />
            ))}
            <CapstoneRoadmapNode trackId={selectedTrack.id} />
          </div>
        )}
      </motion.div>

      <AnimatePresence>{isPanelOpen && <LayerDetail />}</AnimatePresence>
    </>
  );
};

export default RoadmapTree;
