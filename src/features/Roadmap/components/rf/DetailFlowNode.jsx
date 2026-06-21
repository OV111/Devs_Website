import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const BADGE_COLORS = {
  docs:    "bg-sky-500/15 text-sky-300 border-sky-500/30",
  article: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  video:   "bg-rose-500/15 text-rose-300 border-rose-500/30",
  course:  "bg-violet-500/15 text-violet-300 border-violet-500/30",
  book:    "bg-orange-500/15 text-orange-300 border-orange-500/30",
  tool:    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const DetailFlowNode = memo(({ data }) => {
  const { title, resources = [], isDone, side } = data;
  const topResource = resources[0];
  const badgeClass = topResource ? (BADGE_COLORS[topResource.type] ?? BADGE_COLORS.docs) : null;

  return (
    <>
      {side === "left"
        ? <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
        : <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      }

      <div
        style={{ width: 210 }}
        className={`
          group relative flex items-start gap-2 px-3 py-2 rounded-xl
          border-l-2 cursor-default font-mono
          transition-all duration-200
          hover:translate-x-0.5 hover:shadow-[0_0_8px_rgba(139,92,246,0.3)]
          ${isDone
            ? "bg-violet-950/20 border-l-violet-500 hover:border-l-violet-400"
            : "bg-neutral-950/60 border-l-neutral-700 hover:border-l-neutral-500"
          }
        `}
      >
        <span className={`text-[10px] mt-0.5 shrink-0 ${isDone ? "text-violet-400" : "text-neutral-600"}`}>›</span>
        <div className="flex flex-col gap-1 min-w-0">
          <p className={`text-[10px] leading-snug ${isDone ? "text-violet-200" : "text-neutral-400"}`}>
            {title}
          </p>
          {badgeClass && (
            <span className={`self-start text-[8px] uppercase px-1.5 py-0.5 rounded-full border ${badgeClass}`}>
              {topResource.type}
            </span>
          )}
        </div>
      </div>
    </>
  );
});

export default DetailFlowNode;
