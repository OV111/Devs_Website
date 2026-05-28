// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X, Clock, BookOpen, Code2, Layers, Check, ChevronRight } from "lucide-react";
import useRoadmapStore from "@/stores/useRoadmapStore";

const resourceTypeColor = {
  docs: "bg-blue-900/30 text-blue-400 border border-blue-800/50",
  course: "bg-violet-900/30 text-violet-400 border border-violet-800/50",
  video: "bg-red-900/30 text-red-400 border border-red-800/50",
  book: "bg-amber-900/30 text-amber-400 border border-amber-800/50",
  article: "bg-green-900/30 text-green-400 border border-green-800/50",
  project: "bg-teal-900/30 text-teal-400 border border-teal-800/50",
};

const LayerDetail = () => {
  const { activeLayer, closePanel, layerProgress, setLayerStatus } = useRoadmapStore();

  if (!activeLayer) return null;

  const currentStatus = layerProgress[activeLayer.id] ?? activeLayer.status ?? "locked";
  const isDone = currentStatus === "done";

  const toggleComplete = () => {
    setLayerStatus(activeLayer.id, isDone ? "in-progress" : "done");
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePanel}
      />

      {/* Drawer */}
      <motion.div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-neutral-800">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1">
              Layer {activeLayer.order}
            </p>
            <h2 className="text-lg font-bold text-neutral-100 leading-snug">
              {activeLayer.title}
            </h2>
            <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-neutral-500">
              <Clock size={11} />
              {activeLayer.estimatedTime}
            </span>
          </div>
          <button
            onClick={closePanel}
            className="mt-1 p-1.5 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Tech pills */}
          <div className="flex flex-wrap gap-2">
            {activeLayer.techs.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800/50"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-400 leading-relaxed">
            {activeLayer.description}
          </p>

          {/* Topics */}
          <div>
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-3">
              <Layers size={12} />
              What you'll learn
            </h3>
            <ul className="space-y-2">
              {activeLayer.topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-3">
              <BookOpen size={12} />
              Resources
            </h3>
            <ul className="space-y-2">
              {activeLayer.resources.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-200 truncate">{r.label}</p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">{r.platform}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${resourceTypeColor[r.type] ?? "bg-neutral-800 text-neutral-500"}`}>
                    {r.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenge */}
          <div className="rounded-2xl border border-purple-800/40 bg-purple-950/20 px-4 py-4">
            <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-purple-500 mb-2">
              <Code2 size={12} />
              Layer Challenge
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {activeLayer.challenge}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={toggleComplete}
            className={`
              flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200
              ${isDone
                ? "bg-purple-600/20 border-purple-600/50 text-purple-300 hover:bg-purple-600/30"
                : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
              }
            `}
          >
            <Check size={14} className={isDone ? "text-purple-400" : "text-neutral-600"} />
            {isDone ? "Completed" : "Mark complete"}
          </button>

          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors duration-200"
          >
            Enter layer
            <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default LayerDetail;
