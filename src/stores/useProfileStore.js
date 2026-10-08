import { create } from "zustand";
import { API_BASE_URL, getAccessToken, authHeaders } from "../../constants/api";
import posthog, { isPostHogConfigured } from "../lib/posthog";

const useProfileStore = create((set, get) => ({
  user: null,
  stats: null,
  blogs: [],
  isLoading: false,
  isBlogsLoading: false,
  fetchProfile: async () => {
    const token = getAccessToken();
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
      const user = data.userWithoutPassword;
      const previousUser = get().user;
      set({
        user,
        stats: data.stats,
      });
      if (isPostHogConfigured && user?._id && previousUser?._id !== user._id) {
        posthog.identify(String(user._id), {
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
        });
      }
      return data.stats;
    } catch (err) {
      console.error("fetchProfile failed:", err);
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
    } catch (err) {
      console.error("fetchUserBlogs failed:", err);
      set({ isBlogsLoading: false });
    }
  },
  updateStats: (newStats) =>
    set((state) => ({ stats: { ...state.stats, ...newStats } })),

  updateUser: (newUser) =>
    set((state) => ({ user: { ...state.user, ...newUser } })),

  clearProfile: () => {
    set({ user: null, stats: null, blogs: [], isBlogsLoading: false });
  },
}));

export default useProfileStore;
