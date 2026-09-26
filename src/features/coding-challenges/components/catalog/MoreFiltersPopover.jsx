import { useEffect, useRef, useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { TIME_RANGES } from "../../lib/timeRanges";
import { STATUS_OPTIONS } from "../../lib/statuses";

/** Click-toggled secondary filter popover: status, topics, estimated time, clear. */
export default function MoreFiltersPopover({
  topics,
  selectedTopics,
  onToggleTopic,
  timeRange,
  onSelectTimeRange,
  selectedStatuses,
  onToggleStatus,
  onClear,
  activeCount,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 ${
          activeCount > 0
            ? "border-purple-900/60 bg-purple-950/40 text-purple-300"
            : "border-[#1f1f1f] bg-[#141414] text-[#888] hover:border-purple-900/60 hover:bg-purple-950/40 hover:text-purple-300"
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>+ More filters</span>
        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 w-64 overflow-hidden rounded-md border border-[#1f1f1f] bg-[#0d0d0d] p-3 shadow-lg shadow-black/30"
          >
            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold tracking-widest uppercase text-[#555]">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map(({ key, label }) => {
                  const checked = selectedStatuses.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onToggleStatus(key)}
                      aria-pressed={checked}
                      className={`cursor-pointer rounded-sm border px-2 py-1 text-[11px] transition-colors ${
                        checked
                          ? "border-purple-600 bg-purple-950/40 text-purple-300"
                          : "border-[#1f1f1f] text-[#888] hover:text-[#e5e5e5]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold tracking-widest uppercase text-[#555]">
                Topics
              </p>
              {topics.length === 0 && (
                <p className="text-[11px] text-[#444]">No topics yet.</p>
              )}
              <div className="flex max-h-36 flex-col gap-0.5 overflow-y-auto">
                {topics.map(({ label, count }) => {
                  const checked = selectedTopics.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onToggleTopic(label)}
                      className={`flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-left text-[12px] transition-colors ${
                        checked
                          ? "bg-purple-950/40 text-purple-300"
                          : "text-[#888] hover:bg-white/5 hover:text-[#e5e5e5]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                            checked
                              ? "border-purple-500 bg-purple-600"
                              : "border-[#333]"
                          }`}
                        >
                          {checked && <Check className="h-2.5 w-2.5 text-white" />}
                        </span>
                        {label}
                      </span>
                      <span className="text-[10px] text-[#444]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold tracking-widest uppercase text-[#555]">
                Estimated time
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TIME_RANGES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      onSelectTimeRange(timeRange === key ? null : key)
                    }
                    className={`cursor-pointer rounded-sm border px-2 py-1 text-[11px] transition-colors ${
                      timeRange === key
                        ? "border-purple-600 bg-purple-950/40 text-purple-300"
                        : "border-[#1f1f1f] text-[#888] hover:text-[#e5e5e5]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="w-full cursor-pointer rounded-sm border border-[#1f1f1f] py-1.5 text-[11px] font-medium text-[#666] transition-colors hover:border-purple-600 hover:text-purple-400"
            >
              Clear filters
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
