import { AnimatePresence, MotionConfig, motion as Motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { SURFACE } from "@/components/ui/surface";

/**
 * Sticky "unsaved changes" bar for forms. Appears only while there is
 * something to save, shows progress while saving, confirms for a moment, then
 * leaves. Offset by the sidebar width so it centers on the content.
 */
export default function SaveBar({ dirty, saving, saved, onSave, onDiscard }) {
  const confirmed = saved && !dirty && !saving;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {(dirty || saving || saved) && (
          <Motion.div
            role="region"
            aria-label="Save changes"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center pl-10 pr-4 lg:pl-56"
          >
            <div
              className={`${SURFACE} pointer-events-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-5 py-3 shadow-2xl shadow-black/60`}
            >
              <p className="text-sm text-neutral-200" aria-live="polite">
                {confirmed ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-green-300">
                    <Check size={16} aria-hidden="true" /> Changes saved
                  </span>
                ) : (
                  "You have unsaved changes"
                )}
              </p>

              {!confirmed && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onDiscard}
                    disabled={saving}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-wait disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
