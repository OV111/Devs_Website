// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { TRACKS } from "../../../../constants/roadmapPaths.js";
import useRoadmapStore from "../../../stores/useRoadmapStore.js";

const TrackSelector = () => {
  const { selectedCategory, selectedTrack, setTrack } = useRoadmapStore();

  const tracks = TRACKS[selectedCategory?.id] ?? [];

  return (
    <>
      {/* <style>{`
        @keyframes teal-glow-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(20,184,166,0.4); }
          50% { box-shadow: 0 0 22px rgba(20,184,166,0.6); }
        }
        .teal-glow-pulse { animation: teal-glow-pulse 2.5s ease-in-out infinite; }
      `}</style> */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <p className="rm-mono text-center text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mb-6 uppercase tracking-[0.8px]">
          Choose a specialization
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {tracks.map((track) => {
            const isSelected = selectedTrack?.id === track.id;
            const isLocked = !track.available;

            return (
              <button
                key={track.id}
                disabled={isLocked}
                onClick={() => !isLocked && setTrack(track)}
                className={`
                relative px-4 py-2 rounded-lg border text-[14px] cursor-pointer font-medium tracking-[0.1px] transition-colors duration-200
                ${
                  isLocked
                    ? "border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-400 opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "bg-teal-500/10 border-teal-500 text-teal-500"
                      : "rm-edge bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white dark:hover:border-neutral-500"
                }
              `}
              >
                {track.title}
                {isLocked && (
                  <span className="ml-2 text-[10px] uppercase tracking-wide opacity-70">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default TrackSelector;
