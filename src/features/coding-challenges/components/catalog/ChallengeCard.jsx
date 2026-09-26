import { TYPE_STYLE } from "../../../../../constants/CodingChallenges";

export default function ChallengeCard({ c }) {
  const ts = TYPE_STYLE[c.type] || TYPE_STYLE.CODE;
  const diffLevel = c.xp >= 60 ? 3 : c.xp >= 50 ? 2 : 1;

  return (
    <div className="relative overflow-hidden rounded-sm p-4 h-full flex flex-col gap-2.5 border border-[#1a1a1a] bg-[#0d0d0d]">
      {c.hot && (
        <div className="absolute top-4 right-[-28px] rotate-45 text-[8px] font-bold px-10 py-0.5 tracking-widest z-10 bg-purple-600 text-white">
          HOT SPOT MATCH
        </div>
      )}
      {c.done && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-purple-600 text-white">
          ✓
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#333]">{c.slug}</span>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5"
          style={{ border: `1px solid ${ts.border}`, color: ts.color }}
        >
          {c.type}
        </span>
      </div>

      <p className="text-[14px] font-semibold leading-snug text-[#e5e5e5]">
        {c.title}
      </p>

      <p className="text-[12px] leading-relaxed text-[#555]">{c.summary}</p>

      <div className="flex flex-wrap gap-1.5">
        {(c.tags ?? []).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 border border-[#1f1f1f] text-[#444]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 text-[11px] text-[#444]">
          <span>{c.estimatedMins}m</span>
          <span>{c.stats?.solves ?? 0} solves</span>
          {/* Lives in the meta row, not the corner: a challenge can be both
              in progress and recommended, and the corner is already spoken
              for by the hot ribbon. */}
          {c.inProgress && (
            <span className="flex items-center gap-1 text-amber-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              in progress
            </span>
          )}
          <span className="flex items-end gap-0.5">
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={`w-[3px] rounded-sm inline-block ${level <= diffLevel ? "bg-red-400" : "bg-[#1f1f1f]"}`}
                style={{ height: `${level * 4}px` }}
              />
            ))}
          </span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 border border-purple-600 text-purple-600">
          +{c.xp} xp
        </span>
      </div>
    </div>
  );
}
