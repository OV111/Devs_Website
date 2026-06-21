import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function FileIcon({ label, color = "#9333ea" }) {
  return (
    <svg viewBox="0 0 56 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Page body */}
      <path
        d="M4 4C4 2.895 4.895 2 6 2H38L52 16V66C52 67.105 51.105 68 50 68H6C4.895 68 4 67.105 4 66V4Z"
        fill="#1a1a2e"
        stroke="#2a2a3e"
        strokeWidth="1.5"
      />
      {/* Folded corner */}
      <path d="M38 2L52 16H40C38.895 16 38 15.105 38 14V2Z" fill="#2d1f4e" stroke="#3b2060" strokeWidth="1.5" />
      {/* Extension badge */}
      <rect x="8" y="44" width="24" height="14" rx="3" fill={color} opacity="0.9" />
      <text x="20" y="54.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="monospace">
        {label}
      </text>
      {/* Lines */}
      <line x1="12" y1="26" x2="44" y2="26" stroke="#2a2a3e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="32" x2="44" y2="32" stroke="#2a2a3e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="38" x2="32" y2="38" stroke="#2a2a3e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function CvFileCard({ editable = false, cvUrl = null, onUpload }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const hasFile = file || cvUrl;
  const fileName = file?.name ?? (cvUrl ? cvUrl.split("/").pop() : null);
  const ext = fileName?.split(".").pop()?.toUpperCase() ?? "PDF";
  const extColor = ext === "PDF" ? "#9333ea" : ext === "DOCX" || ext === "DOC" ? "#2563eb" : "#6b7280";

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      toast.error("Only PDF or Word documents allowed");
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error("File must be under 10 MB");
      return;
    }
    setFile(f);
    onUpload?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // ── Uploaded state ──────────────────────────────────────────────────────────
  if (hasFile) {
    return (
      <div className="flex items-center gap-4 px-3 py-3 rounded-sm border border-gray-800 bg-gray-900/40 group">
        <div className="w-10 h-12 shrink-0">
          <FileIcon label={ext} color={extColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-gray-100 truncate">{fileName}</p>
          <p className="text-[10px] font-mono text-gray-600 mt-0.5">{ext} · ready to share</p>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] px-2 py-1 rounded-sm border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
            >
              ↗ view
            </a>
          )}
          {editable && (
            <button
              type="button"
              onClick={() => { setFile(null); onUpload?.(null); }}
              className="text-[10px] px-2 py-1 rounded-sm border border-gray-800 text-gray-600 hover:text-red-400 hover:border-red-900 transition-colors"
            >
              remove
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Empty / upload state ────────────────────────────────────────────────────
  if (!editable) {
    return (
      <div className="flex flex-col items-center gap-2 px-3 py-6 rounded-sm border border-dashed border-gray-800 text-center">
        <div className="w-10 h-12 opacity-20">
          <FileIcon label="PDF" />
        </div>
        <p className="text-[11px] text-gray-600">No CV uploaded yet</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-3 px-3 py-6 rounded-sm border border-dashed cursor-pointer transition-colors ${
        isDragging
          ? "border-violet-500 bg-violet-950/20"
          : "border-gray-700 hover:border-violet-700 hover:bg-violet-950/10"
      }`}
    >
      <div className="w-10 h-12">
        <FileIcon label="PDF" />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium text-violet-400">Click to upload</p>
        <p className="text-[10px] text-gray-600 mt-0.5">or drag & drop</p>
        <p className="text-[10px] text-gray-700 mt-1">PDF · DOC · DOCX — max 10 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
