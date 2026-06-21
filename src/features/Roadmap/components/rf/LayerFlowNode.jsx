import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock, Lock, Check, Play } from "lucide-react";
import useRoadmapStore from "@/stores/useRoadmapStore";

const STATUS = {
  done: {
    bar: "linear-gradient(to bottom, #7c3aed, #a855f7)",
    ring: "ring-[1.5px] ring-purple-600/60",
    badge: "bg-purple-600/20 text-purple-300 border-purple-700/50",
    title: "text-neutral-100",
    glow: "0 0 24px rgba(139,92,246,0.25)",
    Icon: Check,
    label: "done",
    opacity: 1,
  },
  "in-progress": {
    bar: "linear-gradient(to bottom, #a855f7, #c084fc)",
    ring: "ring-[1.5px] ring-violet-400",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/50",
    title: "text-neutral-100",
    glow: "0 0 32px rgba(139,92,246,0.45), 0 0 8px rgba(192,132,252,0.3)",
    Icon: Play,
    label: "in progress",
    opacity: 1,
  },
  locked: {
    bar: "#2a2a3a",
    ring: "",
    badge: "bg-neutral-800/60 text-neutral-500 border-neutral-700/40",
    title: "text-neutral-500",
    glow: "none",
    Icon: Lock,
    label: "locked",
    opacity: 0.55,
  },
};

const LayerFlowNode = memo(({ data }) => {
  const { layer, resolvedStatus } = data;
  const { setActiveLayer } = useRoadmapStore();
  const cfg = STATUS[resolvedStatus] ?? STATUS.locked;

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left-in" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="left-out" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right-out" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="right-in" style={{ opacity: 0 }} />

      <button
        onClick={() => setActiveLayer(layer)}
        style={{
          opacity: cfg.opacity,
          boxShadow: cfg.glow,
          width: 260,
        }}
        className={`
          relative text-left px-4 pt-3 pb-3 rounded-2xl border border-violet-900/50
          bg-violet-950/30 backdrop-blur-xl cursor-pointer
          transition-all duration-200 hover:border-violet-600/60
          ${cfg.ring}
          ${resolvedStatus === "in-progress" ? "animate-[in-progress-pulse_2.5s_ease-in-out_infinite]" : ""}
        `}
      >
        {/* accent bar */}
        <span
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          style={{ background: cfg.bar, boxShadow: resolvedStatus !== "locked" ? "0 0 6px rgba(139,92,246,0.6)" : "none" }}
        />

        {/* eyebrow + badge */}
        <div className="flex items-center justify-between mb-2 pl-3">
          <span className="text-[10px] font-mono text-neutral-600 tracking-wider">
            layer_{String(layer.order).padStart(2, "0")}
          </span>
          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.badge}`}>
            <cfg.Icon size={9} />
            {cfg.label}
          </span>
        </div>

        {/* title */}
        <p className={`font-semibold text-sm leading-snug mb-2 pl-3 ${cfg.title}`}>
          {layer.title}
        </p>

        {/* techs + time */}
        <div className="flex items-center gap-2 overflow-hidden pl-3">
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-neutral-600">
            <Clock size={10} />
            {layer.estimatedTime}
          </span>
          <div className="flex gap-1 overflow-hidden">
            {layer.techs.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-950/60 text-violet-400/70">
                {t}
              </span>
            ))}
            {layer.techs.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-950/60 text-violet-400/70">
                +{layer.techs.length - 3}
              </span>
            )}
          </div>
        </div>
      </button>
    </>
  );
});

export default LayerFlowNode;
