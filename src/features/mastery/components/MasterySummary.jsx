import { STATUS_META, STATUS_ORDER } from "../lib/statusMeta";

/**
 * One stacked bar for the whole picture, plus a legend with counts. The bar's
 * segments are proportional to topic counts, so a learner sees at a glance how
 * much of what they've touched is solid versus still shaky.
 */
const MasterySummary = ({ summary }) => {
  const { total, percentSolid } = summary;

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-xl border border-white/10 bg-zinc-950 p-6"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2 id="summary-heading" className="text-base font-semibold text-[#F7F7F8]">
          Overview
        </h2>
        <p className="text-sm text-[#A1A0AB]">
          <span className="text-2xl font-bold text-[#F7F7F8]">{percentSolid}%</span>{" "}
          of tested topics are solid
        </p>
      </div>

      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800"
        role="img"
        aria-label={STATUS_ORDER.map((s) => `${summary[s]} ${STATUS_META[s].label}`).join(", ")}
      >
        {STATUS_ORDER.map((status) =>
          summary[status] > 0 ? (
            <div
              key={status}
              className={STATUS_META[status].bar}
              style={{ width: `${(summary[status] / total) * 100}%` }}
            />
          ) : null,
        )}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <li key={status} className="flex items-center gap-2 text-[13px]">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[status].dot}`} aria-hidden="true" />
            <span className="text-[#D4D4DC]">{STATUS_META[status].label}</span>
            <span className="ml-auto font-semibold text-[#F7F7F8] sm:ml-1">{summary[status]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MasterySummary;
