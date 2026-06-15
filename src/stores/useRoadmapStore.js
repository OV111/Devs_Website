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

const startPath = async (pathId) => {
  try {
    await fetch(`${API_BASE_URL}/api/roadmaps/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ activePath: pathId }),
    });
  } catch {
    // non-fatal
  }
};

const useRoadmapStore = create((set) => ({
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
