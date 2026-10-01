import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Mirrors BlogCard's layout, so the page doesn't jump when real cards arrive.
export const BlogCardSkeleton = () => (
  <div className="flex min-h-[478px] flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
    <Skeleton height={224} borderRadius={0} containerClassName="block leading-[0]" />
    <div className="flex flex-col gap-3 p-5">
      <Skeleton width={70} height={20} borderRadius={999} />
      <Skeleton height={20} width="85%" />
      <Skeleton height={14} count={3} />
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-neutral-800 px-5 py-3">
      <div className="flex items-center gap-2.5">
        <Skeleton circle width={28} height={28} />
        <Skeleton width={90} height={12} />
      </div>
      <Skeleton width={70} height={20} />
    </div>
  </div>
);

export const BlogCardSkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }, (_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
);
