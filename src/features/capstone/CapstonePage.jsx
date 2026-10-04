import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Lock,
  Rocket,
  TimerReset,
} from "lucide-react";
import { capstoneApi } from "./capstoneApi";
import CapstoneTrack from "./components/CapstoneTrack";
import { SURFACE } from "./components/ui";
import { TrackSkeleton } from "./components/CapstoneSkeleton";

const STATE = {
  locked: {
    Icon: Lock,
    label: "locked",
    tone: "text-neutral-400 border-neutral-700",
  },
  ready: {
    Icon: Rocket,
    label: "ready to start",
    tone: "text-purple-300 border-purple-500/50",
  },
  in_progress: {
    Icon: TimerReset,
    label: "in progress",
    tone: "text-violet-300 border-violet-500/50",
  },
  passed: {
    Icon: CheckCircle2,
    label: "approved",
    tone: "text-green-300 border-green-500/50",
  },
  failed: {
    Icon: AlertTriangle,
    label: "sent back",
    tone: "text-red-300 border-red-500/50",
  },
};

/** Several capstones: one card per track, with where the learner stands. */
function Picker({ items }) {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-14 pb-24 text-white">
      <h1 className="text-3xl font-bold">Choose your capstone</h1>
      <p className="mt-2 text-sm text-neutral-400">
        One capstone per roadmap track. It unlocks when you pass every layer
        exam of that track.
      </p>
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((c) => {
          const s = STATE[c.state] ?? STATE.locked;
          return (
            <li key={c.trackId}>
              <Link
                to={`/capstone/${c.trackId}`}
                className={`${SURFACE} flex h-full flex-col gap-3 p-6 transition-colors hover:border-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-purple-400">
                    {c.trackTitle}
                  </span>
                  <span
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${s.tone}`}
                  >
                    <s.Icon size={10} aria-hidden="true" /> {s.label}
                  </span>
                </span>
                <span className="text-base font-semibold leading-snug">
                  {c.briefTitle}
                </span>
                <span className="font-mono text-xs text-neutral-500">
                  {c.eligibility.passed}/{c.eligibility.total} layer exams
                  passed
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * /capstone and /capstone/:trackId.
 *  - with a track id → that track's capstone;
 *  - without: one capstone available → shown right here (no redirect);
 *    several → a picker; none → an honest empty state.
 */
export default function CapstonePage() {
  const { trackId } = useParams();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trackId) return;
    capstoneApi.overview().then(setOverview).catch(setError);
  }, [trackId]);

  if (trackId) return <CapstoneTrack key={trackId} trackId={trackId} />;

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-14 pb-24">
        <div role="alert" className={`${SURFACE} mx-auto max-w-lg p-7`}>
          <h1 className="text-lg font-semibold text-white">
            Couldn't load capstones
          </h1>
          <p className="mt-1.5 text-sm text-neutral-300">{error.message}</p>
        </div>
      </div>
    );
  }
  // Same skeleton as CapstoneTrack: with one track (today) the page goes
  // straight into it, so the two loading phases read as one.
  if (!overview) return <TrackSkeleton />;
  if (overview.length === 1)
    return <CapstoneTrack trackId={overview[0].trackId} />;
  if (overview.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-14 pb-24 text-white">
        <div
          className={`${SURFACE} mx-auto flex max-w-lg flex-col items-start gap-4 p-7`}
        >
          <span className="grid size-10 place-items-center rounded-full bg-purple-500/10 text-purple-300">
            <Award size={20} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold">No capstones yet</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
              Capstones are being written for the roadmap tracks. Keep passing
              layer exams — yours will appear here and at the end of your track.
            </p>
          </div>
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Go to the roadmap →
          </Link>
        </div>
      </div>
    );
  }
  return <Picker items={overview} />;
}
