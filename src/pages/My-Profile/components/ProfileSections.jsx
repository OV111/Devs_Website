import {
  ACCENT,
  DEVSCOIN_BALANCE,
  DEVSCOIN_TXN,
  COIN_EARN_WAYS,
} from "./profileData";
import CvFileCard from "./CvFileCard";

export function SectionHeader({ title, right }) {
  return (
    <div className="mt-10 flex items-center gap-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide shrink-0">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      {right && (
        <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
          {right}
        </span>
      )}
    </div>
  );
}

export function PathCard({ path }) {
  const bars = 12;
  const filled = Math.round((path.progress / 100) * bars);
  return (
    <div className="px-5 py-4 rounded-sm border border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center text-sm shrink-0 bg-gray-900 border border-gray-800 text-gray-500">
            ▤
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-100">{path.title}</p>
            <p className="text-[10px] mt-0.5 font-mono text-gray-600">{path.meta}</p>
          </div>
        </div>
        {path.status === "completed" ? (
          <span className="text-[11px] shrink-0" style={{ color: ACCENT }}>
            ✓ completed {path.completedDate}
          </span>
        ) : (
          <span className="text-[11px] shrink-0 text-amber-500">in progress</span>
        )}
      </div>
      <div className="flex items-center gap-1 mt-3 pl-12">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-sm"
            style={{ backgroundColor: i < filled ? path.barColor : "#1f1f1f" }}
          />
        ))}
      </div>
    </div>
  );
}

export function CapstoneCard({ c }) {
  return (
    <div className="px-5 py-4 rounded-sm border border-gray-800">
      <div className="flex items-start gap-3 mb-2">
        <span
          className="text-[9px] font-bold px-2 py-0.5 shrink-0 mt-0.5 border rounded-sm"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          APPROVED
        </span>
        <p className="text-[14px] font-semibold text-gray-100">{c.title}</p>
      </div>
      <p className="text-[10px] font-mono mb-3 text-gray-600">{c.meta}</p>
      <p className="text-[13px] mb-4 text-gray-500">{c.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {c.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 border border-gray-800 text-gray-600 rounded-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        {["↗ github", "↗ live demo", "read agent review"].map((btn) => (
          <button
            key={btn}
            className="text-[11px] px-3 py-1.5 rounded-sm border border-gray-800 text-gray-500 hover:opacity-80 transition-opacity"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ExamRow({ exam }) {
  const isFailed = exam.status === "failed";
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-sm border border-gray-800">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono w-12 shrink-0 text-gray-600">{exam.id}</span>
        <p className="text-[13px] text-gray-300">{exam.title}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[12px] font-semibold" style={{ color: isFailed ? "#f87171" : ACCENT }}>
          {exam.score} / {exam.total}
        </span>
        <span className="text-[10px]" style={{ color: isFailed ? "#f87171" : "#4ade80" }}>
          {isFailed ? "failed" : "cleared"}
        </span>
        <span className="text-[10px] text-gray-700">{exam.date}</span>
      </div>
    </div>
  );
}

export function DevsCoinSection() {
  const earned = DEVSCOIN_TXN.filter((t) => t.type === "earn").reduce((s, t) => s + t.amount, 0);
  const spent  = DEVSCOIN_TXN.filter((t) => t.type === "spend").reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      {/* Balance row */}
      <div className="flex items-center justify-between px-5 py-4 rounded-sm border border-gray-800 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 border-2"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            ◈
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-600">balance</p>
            <p className="text-2xl font-bold" style={{ color: ACCENT }}>
              {DEVSCOIN_BALANCE.toLocaleString()}
              <span className="text-[12px] font-normal ml-1.5 text-gray-600">DC</span>
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-[10px] text-gray-600">earned</p>
            <p className="text-[13px] font-semibold text-green-400">+{earned}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600">spent</p>
            <p className="text-[13px] font-semibold text-red-400">−{spent}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-1.5 mb-4">
        {DEVSCOIN_TXN.map((txn, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-2.5 rounded-sm border border-gray-800"
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] font-bold w-5 text-center shrink-0"
                style={{ color: txn.type === "earn" ? "#4ade80" : "#f87171" }}
              >
                {txn.type === "earn" ? "+" : "−"}
              </span>
              <p className="text-[13px] text-gray-300">{txn.reason}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-[12px] font-semibold tabular-nums"
                style={{ color: txn.type === "earn" ? "#4ade80" : "#f87171" }}
              >
                {txn.type === "earn" ? "+" : "−"}{txn.amount} DC
              </span>
              <span className="text-[10px] text-gray-700">{txn.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* How to earn */}
      <div className="px-4 py-3 rounded-sm border border-gray-800">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-gray-600">
          how to earn
        </p>
        <div className="space-y-1.5">
          {COIN_EARN_WAYS.map(({ action, reward }) => (
            <div key={action} className="flex items-center justify-between text-[12px]">
              <span className="text-gray-500">{action}</span>
              <span className="font-semibold tabular-nums" style={{ color: ACCENT }}>{reward}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ForHiringPanel({ editable = false, cvUrl = null, onCvUpload }) {
  return (
    <div className="px-4 py-4 rounded-sm border border-gray-800">
      <p className="text-[11px] font-bold tracking-widest uppercase mb-1 text-gray-600">
        for hiring
      </p>
      <p className="text-[11px] mb-4 text-gray-600">
        Every score is verified by DevsWebs. Capstones are agent-reviewed. Nothing on this profile is
        self-reported.
      </p>

      <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-gray-600">cv</p>
      <CvFileCard editable={editable} cvUrl={cvUrl} onUpload={onCvUpload ?? (() => {})} />

      {!editable && cvUrl && (
        <a
          href={cvUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center text-[12px] py-2 rounded-sm transition-opacity hover:opacity-80 border"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          ↗ download cv
        </a>
      )}

      {editable && (
        <button
          className="mt-3 w-full text-[12px] py-2 rounded-sm transition-opacity hover:opacity-80 border"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          contact about hiring →
        </button>
      )}
    </div>
  );
}
