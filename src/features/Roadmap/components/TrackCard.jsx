import { ArrowUpRight } from "lucide-react";
import { SURFACE } from "@/components/ui/surface";

const MAX_TECHS = 4;

/**
 * One track in the catalog. A single <button> (the whole card is the target),
 * on the same surface as the Followers / Settings cards.
 */
export default function TrackCard({ track, onSelect }) {
  const techs = track.techs ?? [];
  const extra = techs.length - MAX_TECHS;
  const locked = !track.available;

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(track)}
      className={`${SURFACE} group flex h-full w-full flex-col p-5 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
        locked
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:-translate-y-0.5 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-white">{track.title}</h3>
        {locked ? (
          <span className="shrink-0 text-xs text-neutral-400">Soon</span>
        ) : (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-neutral-500 transition-colors group-hover:text-white"
          />
        )}
      </div>

      <p className="mt-1 text-xs text-neutral-400">{track.domain.title}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {techs.slice(0, MAX_TECHS).map((tech) => (
          <li key={tech} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs text-neutral-300">
            {tech}
          </li>
        ))}
        {extra > 0 && (
          <li className="rounded-md px-1.5 py-0.5 text-xs text-neutral-400">+{extra}</li>
        )}
      </ul>
    </button>
  );
}
