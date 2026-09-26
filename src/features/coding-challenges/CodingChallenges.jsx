import { useEffect, useRef } from "react";
import BackgroundGrid from "./components/catalog/BackgroundGrid";
import HeroSection from "./components/catalog/HeroSection";
import FilterBar from "./components/catalog/FilterBar";
import ChallengeGrid from "./components/catalog/ChallengeGrid";
import CatalogSidebar from "./components/catalog/CatalogSidebar";
import useChallengeFilters from "./hooks/useChallengeFilters";
import useChallengeStore from "./store/useChallengeStore";

export default function CodingChallenges() {
  const heroRef = useRef(null);
  const {
    challenges,
    topics,
    daily,
    stats,
    readiness,
    leaderboard,
    loading,
    error,
    loadList,
  } = useChallengeStore();

  useEffect(() => {
    loadList();
  }, [loadList]);

  const filters = useChallengeFilters(challenges);

  return (
    <div className="min-h-screen text-[#e5e5e5] relative mt-8">
      <BackgroundGrid />

      <HeroSection daily={daily} stats={stats} heroRef={heroRef} />

      <FilterBar filters={filters} topics={topics} />

      <div className="flex gap-6 px-6 sm:px-10 lg:px-14 py-6">
        <ChallengeGrid
          challenges={filters.filteredChallenges}
          loading={loading}
          error={error}
        />
        <CatalogSidebar
          topics={topics}
          loading={loading}
          readiness={readiness}
          leaderboard={leaderboard}
          selectedTopics={filters.selectedTopics}
          onToggleTopic={filters.toggleTopicFilter}
        />
      </div>
    </div>
  );
}
