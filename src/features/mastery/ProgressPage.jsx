import { Link } from "react-router-dom";
import { AlertTriangle, Map as MapIcon } from "lucide-react";
import useMastery from "./hooks/useMastery";
import MasterySummary from "./components/MasterySummary";
import NextStepCard from "./components/NextStepCard";
import TopicList from "./components/TopicList";
import LockedTopics from "./components/LockedTopics";

/**
 * "What do I actually know?" — the learner-facing side of the adaptive engine.
 *
 * All the judgement (statuses, the next step, what a free user may see) happens
 * on the server; this page only lays it out.
 */
const ProgressPage = () => {
  const { data, loading, error, reload } = useMastery();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 pt-28 sm:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#F7F7F8]">My progress</h1>
        <p className="mt-1 text-sm text-[#A1A0AB]">
          What you&apos;ve proven, what&apos;s shaky, and the one thing to do next — built from
          your exams, explanations and mentor sessions.
        </p>
      </header>

      {loading && (
        <div className="space-y-4" aria-busy="true" aria-label="Loading progress">
          <div className="h-36 animate-pulse rounded-xl bg-zinc-900" />
          <div className="h-28 animate-pulse rounded-xl bg-zinc-900" />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-[13px] text-amber-200"
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p className="flex-1">{error.message}</p>
          <button type="button" onClick={reload} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      {data && data.summary.total === 0 && (
        <div className="space-y-6">
          <NextStepCard nextAction={data.nextAction} />
          <section className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/15 px-6 py-10 text-center">
            <MapIcon size={20} className="text-purple-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-[#F7F7F8]">No evidence yet</h2>
            <p className="max-w-md text-[13px] text-[#A1A0AB]">
              Your map fills in as you take layer exams and explain topics. Start with the
              first layer of a roadmap.
            </p>
            <Link to="/roadmaps" className="text-sm text-purple-400 hover:underline">
              Browse roadmaps →
            </Link>
          </section>
        </div>
      )}

      {data && data.summary.total > 0 && (
        <div className="space-y-6">
          <NextStepCard nextAction={data.nextAction} />
          <MasterySummary summary={data.summary} />
          {data.detail ? (
            <TopicList topics={data.topics} />
          ) : (
            <LockedTopics count={data.lockedTopicCount} />
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
