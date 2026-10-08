import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Same library and dark colours as the capstone and blog skeletons, so every
 * loading state on the site shimmers the same way. Mirrors UserProfile's layout.
 */

// Mirrors SectionHeader: title, rule, optional right label.
const SectionHeadSkeleton = ({ title = 90, right }) => (
  <div className="mt-10 mb-4 flex items-center gap-4">
    <Skeleton width={title} height={14} />
    <div className="h-px flex-1 bg-white/10" />
    {right && <Skeleton width={right} height={12} />}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-white/10 ${className}`}>{children}</div>
);

const ProfileSkeleton = () => (
  <SkeletonTheme baseColor="#171717" highlightColor="#262626">
    <div className="min-h-screen bg-gray-50 dark:bg-black" role="status" aria-busy="true" aria-label="Loading profile">
      <div className="mx-auto max-w-6xl">
        {/* Banner + avatar, same position as the real page */}
        <div className="relative">
          <div className="h-40 sm:h-56">
            <Skeleton height="100%" borderRadius={0} containerClassName="block h-full leading-none" />
          </div>
          <div className="absolute -bottom-10 left-14 z-1 -translate-x-1/2 sm:-bottom-13 sm:left-16 lg:-bottom-14 lg:left-10 lg:translate-x-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border-3 border-gray-900 bg-black sm:h-24 sm:w-24 lg:h-28 lg:w-28">
              <Skeleton circle height="100%" containerClassName="block h-full leading-none" />
            </div>
          </div>
        </div>

        {/* Profile header */}
        <div className="px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full max-w-2xl">
              <Skeleton width={200} height={32} />
              <Skeleton width={90} height={14} className="mt-1" />
              <Skeleton width={150} height={14} className="mt-1" />
              <Skeleton width="80%" height={16} className="mt-1" />
              <Skeleton width={180} height={14} className="mt-1" />
            </div>
            <div className="flex flex-col items-start gap-6 lg:items-end">
              <div className="flex gap-2">
                <Skeleton width={92} height={36} borderRadius={8} />
                <Skeleton width={92} height={36} borderRadius={8} />
                <Skeleton width={36} height={36} borderRadius={8} />
              </div>
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton width={28} height={22} />
                    <Skeleton width={60} height={14} />
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                {[1, 2].map((i) => (
                  <Skeleton key={i} circle width={24} height={24} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body: hiring panel first below xl, right column from xl */}
        <div className="mt-6 flex flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-10 xl:flex-row">
          <aside className="order-first w-full shrink-0 xl:order-last xl:w-60">
            <SectionHeadSkeleton title={80} />
            <Card className="p-4">
              <Skeleton height={14} count={3} />
              <Skeleton width={30} height={12} className="mt-4" />
              <Skeleton height={64} borderRadius={12} className="mt-2" />
            </Card>
          </aside>

          <div className="min-w-0 flex-1">
            <SectionHeadSkeleton title={56} />
            <Card className="px-5 py-4">
              <Skeleton width="40%" height={16} />
              <Skeleton width="25%" height={12} />
            </Card>

            <SectionHeadSkeleton title={96} right={72} />
            <Card className="px-5 py-6">
              <Skeleton width="35%" height={16} />
              <Skeleton width="60%" height={14} className="mt-2" />
            </Card>

            <SectionHeadSkeleton title={112} right={72} />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="w-1/2">
                    <Skeleton height={16} />
                    <Skeleton width="50%" height={12} />
                  </div>
                  <Skeleton width={72} height={24} borderRadius={999} />
                </Card>
              ))}
            </div>

            <SectionHeadSkeleton title={56} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={224} borderRadius={16} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading profile…</span>
    </div>
  </SkeletonTheme>
);

export default ProfileSkeleton;
