import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import CategoryBar from "./components/CategotyBar";
import TrackSelector from "./components/TrackSelector";
import RoadmapTree from "./components/RoadmapTree";
import useRoadmapStore from "../../stores/useRoadmapStore";
import useAuthStore from "../../stores/useAuthStore";
import RoadmapHero from "./components/RoadmapHero";
import FloatingLoad from "./components/FloatingLoad";
import TrackOnboardingPanel from "./components/TrackOnboardingPanel";
import "./roadmap.css";

export default function RoadmapPage() {
  const { selectedCategory, selectedTrack, submitOnboarding, closePanel } = useRoadmapStore();
  const { auth } = useAuthStore();
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
    <div className="rm min-h-screen mx-auto max-w-[1200px] px-6 sm:px-10 py-12">
      <RoadmapHero />

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

      {/* Onboarding saves to the account, so guests don't get it. */}
      {/* Appears once a domain is picked, but a path can only start from a
          track, so it stays disabled until one is chosen. */}
      {auth && selectedCategory && !panelOpen && (
        <button
          disabled={!selectedTrack}
          title={selectedTrack ? undefined : "Choose a track first"}
          onClick={() => { closePanel(); setPanelOpen(true); }} // close any open layer sidebar first
          className={`fixed right-0 top-1/4 -translate-y-1/2 z-4
          flex items-center gap-2
          px-3 py-2 rounded-l-lg
          text-[13px] font-medium transition-all ${
            selectedTrack
              ? "bg-purple-500 rm-btn text-white cursor-pointer hover:px-4"
              : "bg-purple-500/30 text-white/50 cursor-not-allowed"
          }`}
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
