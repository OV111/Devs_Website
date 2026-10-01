import { Link } from "react-router-dom";
import { STATUS_META, STATUS_ORDER } from "../lib/statusMeta";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

const Score = ({ label, value }) =>
  value === null || value === undefined ? null : (
    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-[#D4D4DC]">
      {label} {value}%
    </span>
  );

const TopicRow = ({ topic }) => {
  const meta = STATUS_META[topic.status] ?? STATUS_META.untested;
  const layerLine = topic.layer?.title
    ? `${topic.layer.title}${topic.layer.order ? ` · Layer ${topic.layer.order}` : ""}`
    : null;
  const misconceptions = topic.misconceptions.filter((m) => m.description);

  return (
    <li className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-[#F7F7F8]">{topic.title}</p>
          {layerLine && <p className="text-xs text-[#A1A0AB]">{layerLine}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {/* The engine attaches the whole layer-exam score to each topic missed
              in that exam — it is not a per-topic score, so it is labelled as such. */}
          <Score label="Layer exam" value={topic.examScore} />
          <Score label="Explained" value={topic.teachBackScore} />
          {topic.failCount > 0 && (
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-[#D4D4DC]">
              {topic.failCount}× missed
            </span>
          )}
        </div>
      </div>

      {misconceptions.length > 0 && (
        <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            You may believe
          </p>
          <ul className="space-y-1 text-[13px] text-amber-100/90">
            {misconceptions.map((m) => (
              <li key={m.id}>“{m.description}”</li>
            ))}
          </ul>
          <Link to="/ai-agent" className="mt-2 inline-block text-xs text-amber-300 hover:underline">
            Work through this with your mentor →
          </Link>
        </div>
      )}

      {topic.lastEvidenceAt && (
        <p className={`mt-2 text-[11px] ${meta.text}`}>
          Last evidence {formatDate(topic.lastEvidenceAt)}
        </p>
      )}
    </li>
  );
};

/** Topics grouped by status, attention-first, each group with what it means. */
const TopicList = ({ topics }) => (
  <div className="space-y-8">
    {STATUS_ORDER.map((status) => {
      const group = topics.filter((t) => t.status === status);
      if (!group.length) return null;
      const meta = STATUS_META[status];

      return (
        <section key={status} aria-labelledby={`group-${status}`}>
          <div className="mb-3 flex items-baseline gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
            <h3 id={`group-${status}`} className="text-sm font-semibold text-[#F7F7F8]">
              {meta.label} <span className="font-normal text-[#A1A0AB]">({group.length})</span>
            </h3>
            <p className="hidden text-xs text-[#A1A0AB] sm:block">— {meta.hint}</p>
          </div>
          <ul className="space-y-3">
            {group.map((t) => (
              <TopicRow key={t.slug} topic={t} />
            ))}
          </ul>
        </section>
      );
    })}
  </div>
);

export default TopicList;
