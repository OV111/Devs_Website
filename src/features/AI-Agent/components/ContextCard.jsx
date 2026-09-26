import { Terminal } from "lucide-react";

/**
 * Rendered inline in the transcript when the user runs /context.
 *
 * Every value here comes from GET /api/ai-agent/context, which reads the same
 * constants and collections the agent actually runs on. That's deliberate: the
 * panel this replaced hardcoded a skill level, streak and exam score that were
 * never true, so the rule now is that this component displays only what the
 * server reports — it computes nothing itself.
 */
const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 text-[12px] py-1">
    <span className="text-white/40">{label}</span>
    <span className="text-white/80 font-mono">{value}</span>
  </div>
);

export default function ContextCard({ data, error }) {
  return (
    <div className="max-w-2xl rounded-xl border border-white/10 bg-white/3 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={13} className="text-purple-400" />
        <span className="text-[11px] font-bold tracking-widest uppercase text-purple-400">
          context
        </span>
      </div>

      {error ? (
        <p className="text-[12px] text-amber-400/90">{error}</p>
      ) : (
        <>
          <Row label="model" value={data.model} />
          <Row label="messages today" value={`${data.usage.used} / ${data.usage.cap}`} />
          <Row label="remaining today" value={data.usage.remaining} />
          <Row label="turns kept in context" value={data.limits.maxTurns} />
          <Row
            label="attachments"
            value={`${data.limits.maxAttachments} files · ${data.limits.maxAttachmentChars.toLocaleString()} chars`}
          />

          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-[11px] text-white/40 mb-1.5">
              tools available ({data.tools.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.tools.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white/25 mt-3">
            Ask the agent about your roadmap, weak spots or exam history — it reads those live.
          </p>
        </>
      )}
    </div>
  );
}
