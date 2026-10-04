import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { ACTION_LABEL, hrefForTarget } from "../lib/statusMeta";

/**
 * The single most useful thing to do next, as decided by the server's adaptive
 * engine. Deliberately one step, not a list: a list makes the learner choose,
 * and choosing is exactly the thing they came here not to have to do.
 */
const NextStepCard = ({ nextAction }) => {
  if (!nextAction) return null;

  return (
    <section
      aria-labelledby="next-heading"
      className="rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 to-zinc-950 p-6"
    >
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">
        <Sparkles size={14} aria-hidden="true" /> Do this next
      </p>
      <h2 id="next-heading" className="text-xl font-semibold text-[#F7F7F8]">
        {nextAction.title ?? ACTION_LABEL[nextAction.action] ?? "Keep going"}
      </h2>
      <p className="mt-1 text-sm text-[#A1A0AB]">{nextAction.reason}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={hrefForTarget(nextAction.target)}
          className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          {ACTION_LABEL[nextAction.action] ?? "Continue"} <ArrowRight size={14} />
        </Link>
        {nextAction.target?.kind !== "mentor" && nextAction.title && (
          <Link
            to="/ai-agent"
            className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-[#F7F7F8] transition-colors hover:bg-white/5"
          >
            Ask your mentor about it
          </Link>
        )}
      </div>
    </section>
  );
};

export default NextStepCard;
