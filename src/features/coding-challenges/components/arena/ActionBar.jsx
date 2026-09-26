import { Play, RotateCcw } from "lucide-react";
import { C, FONT_MONO } from "../../lib/arenaTheme";

export default function ActionBar({ testResults, onRun, running, onSubmit, submitting, lastRunAt, verdict, onViewSolution }) {
  const passed = testResults.filter((r) => r.passed).length;
  const total = testResults.length;

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{ height: "44px", borderTop: `1px solid ${C.border}`, background: C.surface }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {testResults.map((r, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: r.passed ? C.green : C.rose }}
              title={r.name}
            />
          ))}
        </div>
        <span className="text-[12px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
          <span style={{ color: total > 0 && passed === total ? C.green : C.muted }}>
            {passed}/{total} tests pass
          </span>
          {lastRunAt ? ` · last run ${lastRunAt}` : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] mr-1" style={{ color: C.faint, fontFamily: FONT_MONO }}>
          {verdict?.error
            ? verdict.error
            : verdict?.passed
              ? `solved · +${verdict.xpEarned} xp`
              : "autosaved"}
        </span>
        {onViewSolution && (
          <button
            onClick={onViewSolution}
            className="text-[11px] mr-1 underline cursor-pointer"
            style={{ color: C.green, fontFamily: FONT_MONO }}
          >
            view solution
          </button>
        )}
        <button
          onClick={onRun}
          disabled={running}
          className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded transition-colors cursor-pointer"
          style={{
            border: `1px solid ${running ? C.purple : C.faint}`,
            color: running ? C.purple : C.muted,
          }}
          onMouseEnter={(e) => { if (running) return; e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { if (running) return; e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}
        >
          <RotateCcw size={11} />
          Run tests
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-1.5 text-[12px] px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer"
          style={{ background: submitting ? "#7e22ce" : C.purple, color: "#fff" }}
          onMouseEnter={(e) => { if (submitting) return; e.currentTarget.style.background = "#9333ea"; }}
          onMouseLeave={(e) => { if (submitting) return; e.currentTarget.style.background = C.purple; }}
        >
          <Play size={11} fill="#fff" />
          {submitting ? "Grading…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
