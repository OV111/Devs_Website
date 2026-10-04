import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SURFACE } from "./ui";

/**
 * Loading placeholder that mirrors CapstoneTrack's layout (hero + CTA +
 * stepper, agent card, work grid), so nothing jumps when data lands.
 * Same library + dark colours as the blog skeletons for a consistent shimmer.
 */
const PAGE = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-12";

/** Compact bar on mobile, six circles on a rail from sm up — like CapstoneStepper. */
function StepperSkeleton() {
  return (
    <>
      <div className="sm:hidden">
        <Skeleton width={180} height={14} />
        <Skeleton height={6} borderRadius={999} className="mt-2.5" />
      </div>
      <div className="relative hidden w-full max-w-xl grid-cols-6 sm:grid">
        <div className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[15px] h-[2px] rounded-full bg-neutral-800" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2">
            <Skeleton circle width={32} height={32} />
            <Skeleton width={52} height={12} />
          </div>
        ))}
      </div>
    </>
  );
}

export function TrackSkeleton() {
  return (
    <SkeletonTheme baseColor="#171717" highlightColor="#262626">
      <div
        className="min-h-screen pb-24"
        role="status"
        aria-busy="true"
        aria-label="Loading capstone"
      >
        {/* hero + agent card */}
        <div className={`${PAGE} pt-12 sm:pt-14`}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="flex flex-col gap-6">
              <Skeleton width={200} height={14} />
              <div>
                <Skeleton height={48} width="70%" />
                <Skeleton height={48} width="55%" className="mt-2" />
              </div>
              <div className="max-w-lg">
                <Skeleton height={16} count={2} />
                <Skeleton height={16} width="60%" />
              </div>
              <Skeleton width={180} height={42} borderRadius={8} />
              <div className="pt-4">
                <StepperSkeleton />
              </div>
            </div>

            <div className={`${SURFACE} overflow-hidden lg:mt-10`}>
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                <Skeleton width={100} height={12} />
                <Skeleton width={84} height={20} borderRadius={999} />
              </div>
              <div className="px-5 py-6">
                <Skeleton width="70%" height={22} />
                <Skeleton width="90%" height={14} className="mt-2" />
              </div>
              <div className="flex justify-between border-t border-white/5 px-5 py-3.5">
                <Skeleton width={90} height={12} />
                <Skeleton width={100} height={12} />
              </div>
            </div>
          </div>
        </div>

        {/* work grid */}
        <div className={`${PAGE} mt-14 sm:mt-16`}>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className={`${SURFACE} flex flex-col gap-4 p-6 sm:p-7`}>
              <Skeleton width={80} height={12} />
              <Skeleton width="50%" height={28} />
              <Skeleton height={15} count={3} />
              <div className="flex gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} width={64} height={24} borderRadius={6} />
                ))}
              </div>
            </div>
            <div className={`${SURFACE} flex flex-col gap-4 p-6`}>
              <Skeleton width={100} height={12} />
              <Skeleton height={14} count={2} />
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton circle width={16} height={16} />
                  <Skeleton height={14} containerClassName="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Loading capstone…</span>
      </div>
    </SkeletonTheme>
  );
}
