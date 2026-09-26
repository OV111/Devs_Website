import { useState } from "react";
import { C, FONT_MONO } from "../../lib/arenaTheme";
import CodeEditor from "./CodeEditor";

const FILE_META = {
  js: { dot: C.amber, label: "JavaScript · UTF-8" },
  test: { dot: C.purple, label: "Jest Test · UTF-8" },
};

export default function CodePanel({ files, onChangeFile }) {
  const [active, setActive] = useState(0);
  const file = files[active];

  if (!file) return <div className="h-full" style={{ background: C.bg }} />;

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <div
        className="flex items-center justify-between border-b shrink-0"
        style={{ borderColor: C.border, background: C.surface }}
      >
        <div className="flex">
          {files.map((f, i) => {
            const meta = FILE_META[f.lang] || FILE_META.js;
            const isActive = active === i;
            return (
              <button
                key={f.name}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition-all cursor-pointer border-b-2"
                style={{
                  borderBottomColor: isActive ? meta.dot : "transparent",
                  color: isActive ? C.text : C.muted,
                  background: isActive ? C.bg : "transparent",
                  fontFamily: FONT_MONO,
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.dot }} />
                {f.name}
              </button>
            );
          })}
        </div>
        <span className="px-4 text-[11px]" style={{ color: C.faint, fontFamily: FONT_MONO }}>
          {(FILE_META[file.lang] || FILE_META.js).label}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeEditor
          key={file.name}
          value={file.code}
          readOnly={file.lang === "test"}
          onChange={(code) => onChangeFile?.(file.name, code)}
        />
      </div>
    </div>
  );
}
