import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/** Rows shaped like ConnectionRow, so the list doesn't jump when data lands. */
export default function ConnectionsSkeleton({ rows = 5 }) {
  return (
    <SkeletonTheme baseColor="#171717" highlightColor="#262626">
      <ul
        role="status"
        aria-busy="true"
        aria-label="Loading people"
        className="divide-y divide-white/[0.06]"
      >
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-4 sm:px-5">
            <Skeleton circle width={48} height={48} />
            <div className="min-w-0 flex-1">
              <Skeleton width="40%" height={16} />
              <Skeleton width="65%" height={13} className="mt-2" />
            </div>
            <Skeleton width={104} height={38} borderRadius={8} />
          </li>
        ))}
      </ul>
    </SkeletonTheme>
  );
}
