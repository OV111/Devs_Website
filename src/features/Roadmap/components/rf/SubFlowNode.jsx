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

const SubFlowNode = memo(({ data }) => {
  const { title, resources = [], isDone, side, childCount } = data;

  const topResource = resources[0];
  const badgeClass = topResource ? (BADGE_COLORS[topResource.type] ?? BADGE_COLORS.docs) : null;

  return (
    <>
      {side === "left"
        ? <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
        : <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      }
      {side === "left"
        ? <Handle type="target" position={Position.Left} id="detail-in" style={{ opacity: 0 }} />
        : <Handle type="source" position={Position.Right} id="detail-out" style={{ opacity: 0 }} />
      }

      <div
        style={{ width: 175 }}
        className={`
          group relative flex flex-col gap-1.5 px-3 pt-3 pb-2.5 rounded-[14px]
          border backdrop-blur-md cursor-default
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]
          ${isDone
            ? "bg-violet-950/30 border-violet-700/35 hover:border-violet-500/60 hover:ring-[1px] hover:ring-violet-500/40"
            : "bg-neutral-900/60 border-neutral-700/40 hover:border-neutral-600/60"
          }
        `}
      >
        {/* left accent stub */}
        <span
          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
          style={{ background: isDone ? "linear-gradient(to bottom, #7c3aed, #a855f7)" : "#2a2a3a" }}
        />

        {/* resource badge top-right */}
        {badgeClass && (
          <span className={`absolute top-2 right-2 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-full border ${badgeClass}`}>
            {topResource.type}
          </span>
        )}

        <p className={`text-[11px] font-semibold leading-snug pr-10 pl-2 ${isDone ? "text-violet-100" : "text-neutral-300"}`}>
          {title}
        </p>

        {childCount > 0 && (
          <span className={`text-[9px] font-mono pl-2 ${isDone ? "text-violet-400/60" : "text-neutral-600"}`}>
            {childCount} detail{childCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </>
  );
});

export default SubFlowNode;
