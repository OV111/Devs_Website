// Own loading state, independent of the challenge grid's — the sidebar and
// the grid resolve from the same request, but render as two separate areas
// so one being slow never blocks the other's skeleton from showing.
const TopicsSkeleton = () => (
  <div className="flex flex-col gap-0.5 animate-pulse">
    {[18, 14, 16, 12, 15].map((w, i) => (
      <div key={i} className="flex items-center justify-between px-3 py-1.5">
        <div className="h-3 rounded-sm bg-[#1a1a1a]" style={{ width: `${w * 4}px` }} />
        <div className="h-3 w-3 rounded-sm bg-[#1a1a1a]" />
      </div>
    ))}
  </div>
);

/**
 * Topic counts for the current catalog. Rows drive the same `selectedTopics`
 * filter as the More Filters popover — one piece of state behind two surfaces,
 * so selecting here shows up there and vice versa.
 */
export default function TopicsPanel({
  topics,
  loading,
  selectedTopics = [],
  onToggleTopic,
  layerLabel,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-mono text-[#444]">// TOPICS</p>
        {layerLabel && (
          <span className="text-[10px] text-[#2a2a2a]">{layerLabel}</span>
        )}
      </div>

      {loading && topics.length === 0 ? (
        <TopicsSkeleton />
      ) : topics.length === 0 ? (
        <p className="px-3 text-[11px] text-[#444]">No topics yet.</p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {topics.map(({ label, count }) => {
            const active = selectedTopics.includes(label);
            return (
              <button
                key={label}
                onClick={() => onToggleTopic?.(label)}
                aria-pressed={active}
                className={`flex items-center justify-between px-3 py-1.5 text-[12px] transition-all cursor-pointer rounded-sm border ${
                  active
                    ? "bg-[#1a0f2e] text-white border-[#2d1b4e]"
                    : "bg-transparent text-[#555] border-transparent hover:text-[#888]"
                }`}
              >
                <span>{label}</span>
                <span className={active ? "text-purple-600" : "text-[#333]"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
