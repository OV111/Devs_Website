import ProgressCard from "./ProgressCard";
import TopicsPanel from "./TopicsPanel";
import LeaderboardPanel from "./LeaderboardPanel";

export default function CatalogSidebar({
  topics,
  loading,
  readiness,
  leaderboard,
  selectedTopics,
  onToggleTopic,
}) {
  return (
    <div className="w-52 shrink-0 hidden lg:flex flex-col gap-6">
      <ProgressCard readiness={readiness} loading={loading} />
      <TopicsPanel
        topics={topics}
        loading={loading}
        selectedTopics={selectedTopics}
        onToggleTopic={onToggleTopic}
        layerLabel={
          readiness?.layerOrder ? `layer ${readiness.layerOrder}` : null
        }
      />
      <LeaderboardPanel leaderboard={leaderboard} loading={loading} />
    </div>
  );
}
