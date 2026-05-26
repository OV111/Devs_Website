import { motion as Motion, AnimatePresence } from "framer-motion";
import CategoryBar from "./components/CategotyBar";
import TrackSelector from "./components/TrackSelector";
import RoadmapTree from "./components/RoadmapTree";
import useRoadmapStore from "../../stores/useRoadmapStore";
import FloatingLoad from "./components/FloatingLoad";

export default function RoadmapPage() {
  const { selectedCategory, selectedTrack } = useRoadmapStore();

  return (
    <div className="min-h-screen px-6 sm:px-10 md:px-20 lg:px-28 py-12 bg-linear-to-br from-violet-50/60 via-white to-fuchsia-50/40 dark:bg-none">
      <div className="pointer-events-none fixed -top-20 -left-20 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl dark:bg-purple-900/20" />
      <div className="pointer-events-none fixed top-10 right-10 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-purple-900/6" />
      <Motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-wide bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, #7c3aed, #a855f7, #6d28d9, #c084fc, #7c3aed)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
          }}
        >
          Roadmaps
        </h2>

        <p className="mt-3 text-sm sm:text-base max-w-2xl mx-auto bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-700 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-500 bg-clip-text text-transparent">
          Structured learning paths built for developers — from first commit to
          production-ready. Pick a domain, choose your specialization, and track
          your progress with exams, coding challenges, real projects layer by
          layer.
        </p>
      </Motion.div>

      {/* Zone 1 — CategoryBar */}
      <CategoryBar />

      {/* Zone 2 — TrackSelector or idle prompt */}
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <TrackSelector key={selectedCategory.id} />
        ) : (
          <FloatingLoad />
        )}
      </AnimatePresence>

      {/* Zone 3 — RoadmapTree */}
      <AnimatePresence mode="wait">
        {selectedTrack && <RoadmapTree key={selectedTrack.id} />}
      </AnimatePresence>
    </div>
  );
}
