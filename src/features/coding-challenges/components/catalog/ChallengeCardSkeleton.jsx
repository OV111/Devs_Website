/**
 * Mirrors ChallengeCard's exact structure — same padding, same row heights,
 * same footer position — so the grid occupies the identical size while
 * loading as it does once real cards arrive. A generic spinner or a
 * differently-shaped placeholder here is what causes the layout jump this
 * component exists to avoid.
 */
export default function ChallengeCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-sm p-4 h-full flex flex-col gap-2.5 border border-[#1a1a1a] bg-[#0d0d0d] animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-3 w-24 rounded-sm bg-[#1a1a1a]" />
        <div className="h-4 w-12 rounded-sm bg-[#1a1a1a]" />
      </div>

      <div className="h-4 w-3/4 rounded-sm bg-[#1a1a1a]" />

      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-full rounded-sm bg-[#161616]" />
        <div className="h-3 w-5/6 rounded-sm bg-[#161616]" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <div className="h-4 w-14 rounded-sm bg-[#1a1a1a]" />
        <div className="h-4 w-16 rounded-sm bg-[#1a1a1a]" />
        <div className="h-4 w-12 rounded-sm bg-[#1a1a1a]" />
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1a1a1a]">
        <div className="h-3 w-24 rounded-sm bg-[#1a1a1a]" />
        <div className="h-4 w-14 rounded-sm bg-[#1a1a1a]" />
      </div>
    </div>
  );
}
