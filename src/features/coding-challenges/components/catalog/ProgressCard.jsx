import { ArrowRight, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CARD = "flex flex-col items-center gap-3 py-5 px-4 border border-[#1a1a1a] bg-[#0d0d0d]";

const ProgressSkeleton = () => (
  <div className={`${CARD} animate-pulse`}>
    <div className="w-24 h-24 rounded-full border-[3px] border-[#1a1a1a]" />
    <div className="h-3 w-full rounded-sm bg-[#1a1a1a]" />
    <div className="h-3 w-2/3 rounded-sm bg-[#1a1a1a]" />
    <div className="h-8 w-full rounded-sm bg-[#1a1a1a]" />
  </div>
);

/**
 * Exam readiness for the layer the user is currently on: the share of that
 * layer's challenges they've solved, and the exam it unlocks.
 */
export default function ProgressCard({ readiness, loading }) {
  const navigate = useNavigate();

  if (loading && !readiness) return <ProgressSkeleton />;

  // Distinct from hasLayer:false below. Null means the request didn't land —
  // telling someone who *has* a path to go pick one would be a plain lie.
  if (!readiness) {
    return (
      <div className={CARD}>
        <p className="text-[11px] text-center text-[#555]">
          Couldn&apos;t load your exam readiness.
        </p>
      </div>
    );
  }

  // No active roadmap path — there is no layer to be ready *for*, and a 0%
  // ring here would read as failure rather than "not started yet".
  if (!readiness.hasLayer) {
    return (
      <div className={CARD}>
        <p className="text-[11px] text-center text-[#555]">
          Pick a roadmap path to track exam readiness against your current
          layer.
        </p>
        <button
          onClick={() => navigate("/roadmaps")}
          className="w-full flex justify-center items-center gap-1.5 py-2 text-[12px] font-bold transition-opacity hover:opacity-80 cursor-pointer bg-purple-600 text-white"
        >
          browse roadmaps <ArrowRight size={13} />
        </button>
      </div>
    );
  }

  const { percent, toGo, message, layerId } = readiness;

  return (
    <div className={CARD}>
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#9333ea"
            strokeWidth="2.5"
            // The dash array is in percent units because the circle's
            // circumference is ~100 at r=15.9 — that's the whole reason for
            // this radius.
            strokeDasharray={`${percent} ${100 - percent}`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[#e5e5e5]">{percent}</span>
          <span className="text-[9px] text-[#444]">
            {toGo === 0 ? "COMPLETE" : `${toGo} TO GO`}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-center text-[#555]">{message}</p>

      <button
        onClick={() => navigate(`/roadmaps/exam/${layerId}`)}
        className="w-full flex justify-center items-center gap-1.5 py-2 text-[12px] font-bold transition-opacity hover:opacity-80 cursor-pointer bg-purple-600 text-white"
      >
        <DollarSign size={12} /> take exam <ArrowRight size={13} />
      </button>
    </div>
  );
}
