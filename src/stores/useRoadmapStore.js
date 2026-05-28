import { create } from "zustand";

const loadProgress = (trackId) => {
  try {
    const raw = localStorage.getItem(`roadmap-progress-${trackId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const useRoadmapStore = create((set) => ({
  selectedCategory: null,
  selectedTrack: null,
  activeLayer: null,
  isPanelOpen: false,
  layerProgress: {},

  setCategory: (category) =>
    set({
      selectedCategory: category,
      selectedTrack: null,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: {},
    }),

  setTrack: (track) =>
    set({
      selectedTrack: track,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: loadProgress(track.id),
    }),

  setActiveLayer: (layer) => set({ activeLayer: layer, isPanelOpen: true }),

  closePanel: () => set({ isPanelOpen: false }),

  setLayerStatus: (layerId, status) =>
    set((state) => {
      const trackId = state.selectedTrack?.id;
      const updated = { ...state.layerProgress, [layerId]: status };
      if (trackId) {
        localStorage.setItem(`roadmap-progress-${trackId}`, JSON.stringify(updated));
      }
      return { layerProgress: updated };
    }),

  reset: () =>
    set({
      selectedCategory: null,
      selectedTrack: null,
      activeLayer: null,
      isPanelOpen: false,
      layerProgress: {},
    }),
}));

export default useRoadmapStore;
