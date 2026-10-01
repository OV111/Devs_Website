import { create } from "zustand";
import { API_BASE_URL, authHeaders } from "../../constants/api";

const fetchProgress = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/roadmaps/progress`, {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const { progress } = await res.json();
    return progress;
  } catch {
    return null;
  }
};

const persistProgress = async (layerProgress, activePath) => {
  try {
    await fetch(`${API_BASE_URL}/api/roadmaps/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ layerProgress, activePath }),
    });
  } catch {
    // non-fatal — progress will re-sync on next load
  }
};

// Returns whether the save actually succeeded. setTrack's background call
// ignores this (that one's genuinely fire-and-forget — the track-select flow
// shouldn't block/error on it), but submitOnboarding needs it: a user who
// just answered 5 questions and hit "Start path" deserves to know if that
// was silently dropped.
const startPath = async (pathId, skillLevel) => {
  try {
    const body = { activePath: pathId };
    if (skillLevel) body.skillLevel = skillLevel;
    const res = await fetch(`${API_BASE_URL}/api/roadmaps/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
};

const useRoadmapStore = create((set, get) => ({
  selectedCategory: null,
  selectedTrack: null,
  activeLayer: null,
  isPanelOpen: false,
  layerProgress: {},
  progressLoaded: false,

  setCategory: (category) =>
    set({
      selectedCategory: category,
      selectedTrack: null,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: {},
      progressLoaded: false,
    }),

  setTrack: async (track) => {
    set({
      selectedTrack: track,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: {},
      progressLoaded: false,
    });

    await startPath(track.id);

    const progress = await fetchProgress();
    set({
      layerProgress: progress?.layerProgress ?? {},
      progressLoaded: true,
    });
  },

  loadProgress: async () => {
    const progress = await fetchProgress();
    set({
      layerProgress: progress?.layerProgress ?? {},
      progressLoaded: true,
    });
  },

  // Only skillLevel has a real consumer right now (learnerContextService.js
  // feeds it into the mentor's system prompt) — the onboarding wizard's other
  // answers (goal, background, weeklyTime, about) aren't sent anywhere yet
  // because nothing downstream reads them. Re-sends activePath too since
  // startPath is an upsert either way — cheaper than adding a second route
  // for one extra field.
  submitOnboarding: async (answers) => {
    const track = get().selectedTrack;
    if (!track) return false;
    return startPath(track.id, answers.skillLevel);
  },

  setActiveLayer: (layer) => set({ activeLayer: layer, isPanelOpen: true }),

  closePanel: () => set({ isPanelOpen: false }),

  setLayerStatus: (layerId, status) =>
    set((state) => {
      const updated = { ...state.layerProgress, [layerId]: status };
      persistProgress(updated, state.selectedTrack?.id);
      return { layerProgress: updated };
    }),

  reset: () =>
    set({
      selectedCategory: null,
      selectedTrack: null,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: {},
      progressLoaded: false,
    }),
}));

export default useRoadmapStore;
