import { useNavigate } from "react-router-dom";
import ChallengeCard from "./ChallengeCard";
import ChallengeCardSkeleton from "./ChallengeCardSkeleton";

// Same column count as the real grid, so the loading state reserves the
// exact width/height the content will occupy — nothing reflows on arrival.
const SKELETON_COUNT = 4;

export default function ChallengeGrid({ challenges, loading, error }) {
  const navigate = useNavigate();

  if (!error && loading && challenges.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ChallengeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
      {error && (
        <p className="col-span-full text-[12px] text-red-400">
          Couldn&apos;t load challenges — {error}
        </p>
      )}
      {!error && !loading && challenges.length === 0 && (
        <p className="col-span-full text-[12px] text-[#444]">
          No challenges match these filters yet.
        </p>
      )}
      {challenges.map((c) => (
        <div
          key={c.slug}
          onClick={() => navigate(`/coding-challenges/${c.slug}`)}
          className="cursor-pointer h-full"
        >
          <ChallengeCard c={c} />
        </div>
      ))}
    </div>
  );
}
