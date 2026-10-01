import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import CategoryBar from "./components/CategotyBar";
import TrackSelector from "./components/TrackSelector";
import RoadmapTree from "./components/RoadmapTree";
import useRoadmapStore from "../../stores/useRoadmapStore";
import FloatingLoad from "./components/FloatingLoad";
import TrackOnboardingPanel from "./components/TrackOnboardingPanel";

export default function RoadmapPage() {
  const { selectedCategory, selectedTrack, submitOnboarding, closePanel } = useRoadmapStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Only `skillLevel` is actually persisted right now — see submitOnboarding
  // in useRoadmapStore.js for why the other 4 answers aren't sent yet. The
  // panel used to close instantly on submit with no signal either way —
  // a failed save looked identical to a successful one.
  const handleStart = async (answers) => {
    setSaving(true);
    const ok = await submitOnboarding(answers);
    setSaving(false);
    setPanelOpen(false);
    if (ok) {
      toast.success("Got it — your mentor will use this to calibrate its answers.");
    } else {
      toast.error("Couldn't save that — your progress on the path itself is unaffected, but try Start Path again to set your level.");
    }
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
          Pick a domain and a track, then work through it layer by layer. Pass
          a timed exam to unlock the next layer, explain what you missed back
          to your AI mentor, and sharpen the skills with coding challenges
          along the way.
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
          onClick={() => { closePanel(); setPanelOpen(true); }} // close any open layer sidebar first
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
          // Backdrop: sits under the panel (z-50) but over the page, so the tree
          // can't be clicked while setup is open (no two sidebars at once).
          <Motion.div
            key="onboarding-backdrop"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!saving) setPanelOpen(false); }}
          />
        )}
        {panelOpen && (
          <TrackOnboardingPanel
            track={selectedTrack}
            onClose={() => setPanelOpen(false)}
            onStart={handleStart}
            submitting={saving}
          />
        )}
      </AnimatePresence>

      <Toaster position="top-center" />
    </div>
  );
}
