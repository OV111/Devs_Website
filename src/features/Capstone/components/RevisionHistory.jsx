import { motion as Motion } from "framer-motion";
import { SURFACE, SectionLabel } from "./ui";
import { fadeUp } from "../lib/motion";
import { formatRelative } from "../lib/format";

const TYPE_STYLES = {
  assign: { dot: "bg-purple-400", text: "text-purple-200" },
  submit: { dot: "bg-neutral-300", text: "text-neutral-100" },
  approve: { dot: "bg-green-400", text: "text-green-200" },
  reject: { dot: "bg-red-400", text: "text-red-200" },
  active: { dot: "bg-amber-400", text: "text-amber-200" },
};

/** Timeline of real attempt events (status.timeline), newest last. */
export default function RevisionHistory({ timeline }) {
  return (
    <Motion.aside
      {...fadeUp(0.1)}
      className={`${SURFACE} flex flex-col gap-5 p-6`}
    >
      <SectionLabel>History</SectionLabel>
      <ol className="flex flex-col">
        {timeline.map((rev, i) => {
          const s = TYPE_STYLES[rev.type] ?? TYPE_STYLES.assign;
          return (
            <li
              key={`${rev.action}-${rev.at ?? "now"}-${i}`}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center" aria-hidden="true">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${s.dot}`}
                />
                {i < timeline.length - 1 && (
                  <span className="my-1 w-px flex-1 bg-white/10" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 pb-5">
                <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <span
                    className={`font-semibold first-letter:uppercase ${s.text}`}
                  >
                    {rev.action}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {rev.at ? formatRelative(rev.at) : "now"}
                  </span>
                </p>
                <p className="text-[13px] leading-relaxed text-neutral-400">
                  {rev.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Motion.aside>
  );
}
