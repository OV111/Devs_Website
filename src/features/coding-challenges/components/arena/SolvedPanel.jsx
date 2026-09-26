import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { C, FONT_MONO } from "../../lib/arenaTheme";
import SectionHead from "./SectionHead";

/**
 * The payoff for a passing submit. Without this, a solve was indistinguishable
 * from any other click — the server already sends the solution + explanation
 * back on a pass (submissionService.js), nothing was reading it.
 *
 * Dismissible rather than a hard redirect: staying on the page to keep reading
 * your own passing code, or the explanation, is a reasonable thing to want.
 */
export default function SolvedPanel({ verdict, onDismiss }) {
  const navigate = useNavigate();
  // Re-triggers the entrance animation on a fresh solve without remounting
  // the whole overlay tree.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!verdict?.passed) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(10,10,12,0.85)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-md transition-all duration-200"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(6px) scale(0.98)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${C.border}`, background: "#0c1f14" }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: C.green }} />
            <span
              className="text-[13px] font-bold tracking-wide"
              style={{ color: C.green, fontFamily: FONT_MONO }}
            >
              Solved
            </span>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Close"
            className="cursor-pointer rounded p-1 transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: C.faint, fontFamily: FONT_MONO }}>
                XP earned
              </span>
              <span className="text-[20px] font-bold" style={{ color: verdict.xpEarned > 0 ? C.purple : C.muted }}>
                +{verdict.xpEarned ?? 0}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: C.faint, fontFamily: FONT_MONO }}>
                Tests
              </span>
              <span className="text-[20px] font-bold" style={{ color: C.text }}>
                {verdict.passedCount}/{verdict.total}
              </span>
            </div>
            {verdict.alreadySolved && (
              <span
                className="ml-auto text-[10px] px-2 py-1 rounded"
                style={{ color: C.amber, border: `1px solid #4a3200`, background: "#1c1200" }}
              >
                already solved — no new XP
              </span>
            )}
          </div>

          {verdict.solution?.explanation && (
            <div>
              <SectionHead>Why it works</SectionHead>
              <p className="text-[13px] leading-relaxed" style={{ color: "#8a8a9a" }}>
                {verdict.solution.explanation}
              </p>
            </div>
          )}

          {verdict.solution?.code && (
            <div>
              <SectionHead>Reference solution</SectionHead>
              <pre
                className="text-[12px] leading-relaxed p-4 rounded-lg overflow-x-auto"
                style={{
                  background: "#0e0e14",
                  border: `1px solid ${C.border}`,
                  color: "#b0b0c0",
                  fontFamily: FONT_MONO,
                }}
              >
                {verdict.solution.code}
              </pre>
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-3"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <button
            onClick={onDismiss}
            className="text-[12px] px-3 py-1.5 rounded transition-colors cursor-pointer"
            style={{ border: `1px solid ${C.faint}`, color: C.muted }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}
          >
            Keep reading
          </button>
          <button
            onClick={() => navigate("/coding-challenges")}
            className="flex items-center gap-1.5 text-[12px] px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer"
            style={{ background: C.purple, color: "#fff" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#9333ea"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.purple; }}
          >
            Back to arena
          </button>
        </div>
      </div>
    </div>
  );
}
