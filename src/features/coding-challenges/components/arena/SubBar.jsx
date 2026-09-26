import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, FONT_MONO } from "../../lib/arenaTheme";

export default function SubBar({ breadcrumb, challengeId, pager, onBack }) {
  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{ height: "38px", borderBottom: `1px solid ${C.border}`, background: C.surface, fontFamily: FONT_MONO }}
    >
      <div className="flex items-center gap-1.5 text-[12px]">
        <button
          onClick={onBack}
          className="transition-colors cursor-pointer"
          style={{ color: C.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          <ChevronLeft size={13} />
        </button>
        {breadcrumb.map((seg) => (
          <span key={seg} className="flex items-center gap-1.5">
            <span style={{ color: C.muted }}>{seg}</span>
            <span style={{ color: C.faint }}>/</span>
          </span>
        ))}
        <span className="font-semibold" style={{ color: C.text }}>{challengeId}</span>
      </div>

      <div className="flex items-center gap-1 text-[12px]" style={{ color: C.muted }}>
        <button
          className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors cursor-pointer"
          style={{ border: `1px solid ${C.faint}` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}
        >
          <ChevronLeft size={11} /> Prev
        </button>
        <span className="px-2" style={{ color: C.text }}>
          <span style={{ color: C.amber }}>{pager?.current ?? "-"}</span>
          <span style={{ color: C.faint }}> / </span>
          {pager?.total ?? "-"}
        </span>
        <button
          className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors cursor-pointer"
          style={{ border: `1px solid ${C.faint}` }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}
        >
          Next <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}
