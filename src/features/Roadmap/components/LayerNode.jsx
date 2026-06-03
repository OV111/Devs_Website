import { memo } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Clock, Lock, Check, Play } from "lucide-react";
import useRoadmapStore from "@/stores/useRoadmapStore";

const STATUS_CONFIG = {
  done: {
    border: "border-purple-700",
    bg: "bg-purple-950/40",
    badgeClass: "bg-purple-600/20 text-purple-300 border border-purple-700/50",
    badgeLabel: "done",
    BadgeIcon: Check,
    numberBg: "bg-purple-600 text-white",
    extraClass: "",
  },
  "in-progress": {
    border: "border-violet-500",
    bg: "bg-violet-950/30",
    badgeClass: "bg-violet-500/20 text-violet-300 border border-violet-500/50",
    badgeLabel: "in progress",
    BadgeIcon: Play,
    numberBg: "bg-violet-500 text-white",
    extraClass: "layer-in-progress",
  },
  locked: {
    border: "border-neutral-800",
    bg: "bg-neutral-950",
    badgeClass: "bg-neutral-800/60 text-neutral-500 border border-neutral-700/40",
    badgeLabel: "locked",
    BadgeIcon: Lock,
    numberBg: "bg-neutral-800 text-neutral-500",
    extraClass: "",
  },
};

const LayerNode = memo(({ layer, index, resolvedStatus }) => {
  const { activeLayer, setActiveLayer } = useRoadmapStore();
  const isActive = activeLayer?.id === layer.id;
  const cfg = STATUS_CONFIG[resolvedStatus] ?? STATUS_CONFIG.locked;
  const isLocked = resolvedStatus === "locked";

  return (
    <motion.button
      onClick={() => setActiveLayer(layer)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: isLocked ? 0.45 : 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        relative w-full text-left px-4 pt-3 pb-3 rounded-2xl border
        transition-colors duration-200 cursor-pointer
        ${cfg.bg} ${cfg.border} ${cfg.extraClass}
        ${isActive ? "ring-2 ring-violet-500/60" : ""}
        ${isLocked ? "cursor-pointer" : ""}
      `}
    >
      {/* Eyebrow + badge row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-neutral-600 tracking-wider">
          layer_{String(layer.order).padStart(2, "0")}
        </span>
        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.badgeClass}`}>
          <cfg.BadgeIcon size={9} />
          {cfg.badgeLabel}
        </span>
      </div>

      {/* Title */}
      <p className={`font-semibold text-sm leading-snug mb-2
        ${resolvedStatus === "locked" ? "text-neutral-500" : "text-neutral-100"}
      `}>
        {layer.title}
      </p>

      {/* Tech + time row */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="flex shrink-0 items-center gap-1 text-[10px] text-neutral-600">
          <Clock size={10} />
          {layer.estimatedTime}
        </span>
        <div className="flex gap-1 overflow-hidden">
          {layer.techs.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-800/80 text-neutral-500"
            >
              {t}
            </span>
          ))}
          {layer.techs.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-800/80 text-neutral-500">
              +{layer.techs.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
});

export default LayerNode;
