import { create } from "zustand";
import { fetchSavedIds, fetchLikedIds } from "@/services/blogsApi";

const useBlogInteractionsStore = create((set, get) => ({
  savedIds: new Set(),
  likedIds: new Set(),
  _gen: 0,

  fetchInteractions: async () => {
    const gen = get()._gen + 1;
    set({ _gen: gen });
    const [savedIds, likedIds] = await Promise.all([
      fetchSavedIds(),
      fetchLikedIds(),
    ]);
    if (get()._gen === gen) {
      set({ savedIds, likedIds });
    }
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

  reset: () => set((state) => ({ savedIds: new Set(), likedIds: new Set(), _gen: state._gen + 1 })),
}));

export default useBlogInteractionsStore;
