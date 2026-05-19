import { create } from "zustand";
import { fetchSavedIds, fetchLikedIds } from "@/services/blogsApi";

const useBlogInteractionsStore = create((set) => ({
  savedIds: new Set(),
  likedIds: new Set(),

  fetchInteractions: async () => {
    const [savedIds, likedIds] = await Promise.all([
      fetchSavedIds(),
      fetchLikedIds(),
    ]);
    set({ savedIds, likedIds });
  },

  toggleSaved: (id) =>
    set((state) => {
      const next = new Set(state.savedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { savedIds: next };
    }),

  toggleLiked: (id) =>
    set((state) => {
      const next = new Set(state.likedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { likedIds: next };
    }),

  reset: () => set({ savedIds: new Set(), likedIds: new Set() }),
}));

export default useBlogInteractionsStore;
