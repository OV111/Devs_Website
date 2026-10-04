import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Award, Check, Clock, Lock, Play, Rocket } from "lucide-react";
import useAuthStore from "@/stores/useAuthStore";
import useCapstoneCatalog from "../hooks/useCapstoneCatalog";
import { capstoneApi } from "../capstoneApi";
import { nodeState } from "../lib/nodeState";

const LOOK = {
  coming_soon: {
    label: "coming soon",
    Icon: Clock,
    card: "border-dashed border-neutral-800 bg-neutral-950/60",
    badge: "bg-neutral-800/60 text-neutral-500 border-neutral-700/40",
  },
  locked: {
    label: "locked",
    Icon: Lock,
    card: "border-neutral-800 bg-neutral-950/80",
    badge: "bg-neutral-800/60 text-neutral-400 border-neutral-700/40",
  },
  ready: {
    label: "ready",
    Icon: Rocket,
    card: "border-purple-500/70 bg-purple-950/20",
    badge: "bg-purple-500/20 text-purple-200 border-purple-500/50",
  },
  in_progress: {
    label: "in progress",
    Icon: Play,
    card: "border-violet-500 bg-violet-950/30 layer-in-progress",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/50",
  },
  passed: {
    label: "approved",
    Icon: Check,
    card: "border-green-600/60 bg-green-950/20",
    badge: "bg-green-500/15 text-green-300 border-green-600/50",
  },
  failed: {
    label: "sent back",
    Icon: Lock,
    card: "border-red-600/50 bg-red-950/20",
    badge: "bg-red-500/15 text-red-300 border-red-600/50",
  },
};

/**
 * The capstone as the final node of EVERY roadmap track. It is always shown,
 * but only opens once the learner has passed every layer exam of the track
 * and a capstone is published for it; until then it is an inactive card that
 * says why (see lib/nodeState.js). The server enforces the same rule.
 */
export default function CapstoneRoadmapNode({ trackId }) {
  const catalog = useCapstoneCatalog();
  const isMember = Boolean(useAuthStore((s) => s.auth));
  const [mine, setMine] = useState(null);

  const entry = catalog?.find((c) => c.trackId === trackId);

  useEffect(() => {
    // Only a published capstone has anything personal to load.
    if (!entry?.published || !isMember) return undefined;
    let alive = true;
    capstoneApi
      .overview()
      .then(
        (items) =>
          alive && setMine(items.find((i) => i.trackId === trackId) ?? null),
      )
      .catch(() => {}); // stays closed: the server enforces access anyway
    return () => {
      alive = false;
    };
  }, [entry, isMember, trackId]);

  // Wait for the catalog so the node does not flash "coming soon" on load.
  if (catalog === null) return null;

  const state = nodeState({ entry, isMember, mine });
  const look = LOOK[state.kind];
  // With a single PUBLISHED capstone the page lives at /capstone itself.
  const href =
    catalog.filter((c) => c.published).length === 1
      ? "/capstone"
      : `/capstone/${trackId}`;

  const body = (
    <>
      <span className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-neutral-500">
          final · capstone
        </span>
        <span
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${look.badge}`}
        >
          <look.Icon size={9} aria-hidden="true" /> {look.label}
        </span>
      </span>
      <span className="flex items-start gap-3">
        <Award
          size={18}
          className={`mt-0.5 shrink-0 ${state.interactive ? "text-purple-300" : "text-neutral-600"}`}
          aria-hidden="true"
        />
        <span className="flex flex-col gap-1">
          <span
            className={`text-sm font-semibold leading-snug ${state.interactive ? "text-neutral-100" : "text-neutral-400"}`}
          >
            {state.title}
          </span>
          <span className="line-clamp-3 text-[11px] text-neutral-500">
            {state.hint}
          </span>
        </span>
      </span>
    </>
  );

  const base = "w-full max-w-md rounded-2xl border px-5 py-4";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex w-full flex-col items-center"
    >
      <div
        className={`h-10 w-px bg-linear-to-b from-neutral-700 ${state.interactive ? "to-purple-600/60" : "to-neutral-800"}`}
        aria-hidden="true"
      />
      {state.interactive ? (
        <Link
          to={href}
          className={`${base} transition-colors hover:border-purple-400 ${look.card}`}
        >
          {body}
        </Link>
      ) : (
        // Inactive: not a link and not focusable, so it cannot be opened by
        // click, tap or keyboard. aria-disabled lets assistive tech announce why.
        <div
          aria-disabled="true"
          className={`${base} cursor-not-allowed select-none ${look.card}`}
        >
          {body}
        </div>
      )}
    </Motion.div>
  );
}
