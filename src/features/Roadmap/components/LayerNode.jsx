import { memo } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Clock, Lock, Check, Play } from "lucide-react";
import useRoadmapStore from "@/stores/useRoadmapStore";

// Locked cards used to fade the WHOLE button to 45% opacity via Framer
// Motion's `animate` prop — that multiplies title text (already a muted
// neutral-500) down to an effective ~20% opacity, well under WCAG AA. The
// fix: never touch the container's own opacity. Each locked-state color
// below is picked to read as visibly "muted" against the done/in-progress
// states while keeping the title text itself at full opacity and >=4.5:1
// contrast against the card background.
const STATUS_CONFIG = {
  done: {
    border: "border-purple-600/70",
    bg: "bg-neutral-950/80",
    badgeClass: "bg-transparent text-purple-300 border border-purple-600/50",
    badgeLabel: "done",
    BadgeIcon: Check,
    titleClass: "text-neutral-100",
    metaClass: "text-neutral-600",
    extraClass: "",
  },
  "in-progress": {
    border: "border-violet-500",
    bg: "bg-violet-950/30",
    badgeClass: "bg-violet-500/20 text-violet-300 border border-violet-500/50",
    badgeLabel: "in progress",
    BadgeIcon: Play,
    titleClass: "text-neutral-100",
    metaClass: "text-neutral-600",
    extraClass: "layer-in-progress",
  },
  locked: {
    border: "border-neutral-800",
    bg: "bg-neutral-950/80",
    badgeClass: "bg-neutral-800/60 text-neutral-400 border border-neutral-700/40",
    badgeLabel: "locked",
    BadgeIcon: Lock,
    // neutral-300 on a near-black card comfortably clears AA (>7:1) while
    // still reading as visually secondary next to the full-white done state.
    titleClass: "text-neutral-300",
    metaClass: "text-neutral-500",
    extraClass: "",
  },
};

const LayerNode = memo(({ layer, index, resolvedStatus, connectorId, connectorRef }) => {
  const { activeLayer, setActiveLayer } = useRoadmapStore();
  const isActive = activeLayer?.id === layer.id;
  const cfg = STATUS_CONFIG[resolvedStatus] ?? STATUS_CONFIG.locked;

  return (
    <motion.button
      ref={connectorRef}
      id={connectorId}
      onClick={() => setActiveLayer(layer)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        relative w-full text-left px-4 pt-3 pb-3 rounded-2xl border
        transition-colors duration-200 cursor-pointer
        ${cfg.bg} ${cfg.border} ${cfg.extraClass}
        ${isActive ? "ring-2 ring-violet-500/60" : ""}
      `}
    >
      {/* Eyebrow + badge row */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-mono tracking-wider ${cfg.metaClass}`}>
          layer_{String(layer.order).padStart(2, "0")}
        </span>
        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.badgeClass}`}>
          <cfg.BadgeIcon size={9} />
          {cfg.badgeLabel}
        </span>
      </div>

      {/* Title */}
      <p className={`font-semibold text-sm leading-snug mb-2 ${cfg.titleClass}`}>
        {layer.title}
      </p>

      {/* Tech + time row */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span className={`flex shrink-0 items-center gap-1 text-[10px] ${cfg.metaClass}`}>
          <Clock size={10} />
          {layer.estimatedTime}
        </span>
        <div className="flex gap-1 overflow-hidden">
          {layer.techs.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-800/80 text-neutral-400"
            >
              {t}
            </span>
          ))}
          {layer.techs.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-800/80 text-neutral-400">
              +{layer.techs.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
});

export default LayerNode;
