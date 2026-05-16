import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const BlogCardSkeleton = () => (
  <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <Skeleton height={224} borderRadius={0} />
    <div className="space-y-3 px-6 py-4">
      <div className="flex justify-between">
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={12} />
      </div>
      <Skeleton height={20} width="85%" />
      <Skeleton height={14} count={2} />
    </div>
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Skeleton circle width={40} height={40} />
        <div>
          <Skeleton width={90} height={13} />
          <Skeleton width={60} height={11} style={{ marginTop: 4 }} />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton circle width={28} height={28} />
        <Skeleton circle width={28} height={28} />
        <Skeleton circle width={28} height={28} />
      </div>
    </div>
  </div>
);

export const BlogCardSkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
);
