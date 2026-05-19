import { create } from "zustand";
import { API_BASE_URL, JWT_KEY, authHeaders } from "../../constants/api";

const useProfileStore = create((set) => ({
  user: null,
  stats: null,
  blogs: [],
  isLoading: false,
  isBlogsLoading: false,
  fetchProfile: async () => {
    const token = localStorage.getItem(JWT_KEY);
    if (!token) return "unauthorized";
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/my-profile`, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });
      if (response.status === 403) return "unauthorized";
      if (!response.ok) return;
      const data = await response.json();
      set({
        user: data.userWithoutPassword,
        stats: data.stats,
        isBlogsLoading: true,
      });
      return data.stats;
    } catch {
      console.log("Error");
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUserBlogs: async (userId) => {
    if (!userId) return;
    set({ isBlogsLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/user/${userId}`);
      if (!response.ok) {
        set({ isBlogsLoading: false });
        return;
      }
      const data = await response.json();
      set({ blogs: data.data ?? [], isBlogsLoading: false });
    } catch {
      console.log("Error");
      set({ isBlogsLoading: false });
    }
  },
  updateStats: (newStats) =>
    set((state) => ({ stats: { ...state.stats, ...newStats } })),

  clearProfile: () => {
    set({ user: null, stats: null });
  },
}));

export default useProfileStore;
