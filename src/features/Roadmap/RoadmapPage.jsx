import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import CategoryBar from "./components/CategotyBar";
import TrackSelector from "./components/TrackSelector";
import RoadmapTree from "./components/RoadmapTree";
import useRoadmapStore from "../../stores/useRoadmapStore";
import FloatingLoad from "./components/FloatingLoad";
import TrackOnboardingPanel from "./components/TrackOnboardingPanel";

export default function RoadmapPage() {
  const { selectedCategory, selectedTrack } = useRoadmapStore();
  const [panelOpen, setPanelOpen] = useState(false);

  const handleStart = (answers) => {
    console.log("User answers:", answers);
    // TODO: call createUserProgress() API with answers
    setPanelOpen(false);
  };

  return (
    <div className="min-h-screen px-6 sm:px-10 md:px-20 lg:px-28 py-12">
      <Motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-wide bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #7c3aed, #a855f7, #6d28d9, #c084fc, #7c3aed)",
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

      <CategoryBar />

      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <TrackSelector key={selectedCategory.id} />
        ) : (
          <FloatingLoad />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedTrack && <RoadmapTree key={selectedTrack.id} />}
      </AnimatePresence>

      {selectedTrack && !panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          // bg-fuchsia-500
          className=" fixed right-0 top-1/4 -translate-y-1/2 z-4
          bg-purple-500 glow-pulse
          flex items-center gap-2
          px-3 py-2.5 rounded-l-xl
          text-[13px] font-semibold text-white
          cursor-pointer transition-all hover:px-4"
          // className="fixed right-0 top-1/4 -translate-y-1/2 z-4 bg-purple-500 flex items-center gap-2 px-3 py-2.5 rounded-l-xl text-[13px] font-semibold text-white cursor-pointer transition-all hover:px-4"
        >
          Start Path
        </button>
      )}

      <AnimatePresence>
        {panelOpen && (
          <TrackOnboardingPanel
            track={selectedTrack}
            onClose={() => setPanelOpen(false)}
            onStart={handleStart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
