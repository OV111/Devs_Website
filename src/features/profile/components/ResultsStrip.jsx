import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * The verified-results strip at the top of the profile: what a visitor (or a
 * recruiter) should see first. XP is deliberately the small, last tile: it
 * measures effort, not proof.
 */
function Tile({ label, value, muted = false }) {
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span
        className={`text-2xl font-bold ${muted ? "text-neutral-300" : "text-white"}`}
      >
        {value}
      </span>
      <span className="text-xs text-neutral-400">{label}</span>
    </div>
  );
}

// Same grid, spacing and tile height as the real strip (py-3 + a 2rem number +
// a 1rem label = 72px), so nothing jumps when the numbers arrive.
const GRID = "grid grid-cols-3 gap-3 sm:max-w-md";
const TILE_HEIGHT = 72;

function StripSkeleton() {
  return (
    <SkeletonTheme baseColor="#1f1f23" highlightColor="#2b2b31" borderRadius={12}>
      <div className={GRID} role="status" aria-label="Loading verified results">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={TILE_HEIGHT} />
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function ResultsStrip({ summary, xp, loading }) {
  if (loading) return <StripSkeleton />;
  return (
    <section aria-label="Verified results" className={GRID}>
      <Tile label="Layers passed" value={summary.layersPassed} />
      <Tile label="Capstones" value={summary.capstones} />
      {/* xp stays undefined until the challenges request lands: show a dash, not a false 0. */}
      <Tile label="Challenge XP" value={xp ?? "—"} muted />
    </section>
  );
}
