import { create } from "zustand";
import { API_BASE_URL, setAccessToken, clearAccessToken } from "../../constants/api";

const useAuthStore = create((set) => ({
  auth: false,
  isLoading: true,
  session: 0,
  // Runs once on app load. There is no token in localStorage to check anymore —
  // the only proof of a session is the httpOnly refresh cookie, so we exchange
  // it for a fresh access token. A 401 here just means "not logged in."
  init: async () => {
    try {
      set({ isLoading: true });
      const request = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!request.ok) {
        clearAccessToken();
        set({ auth: false });
        return;
      }
      const response = await request.json();
      setAccessToken(response.accessToken);
      set((state) => ({ auth: true, session: state.session + 1 }));
    } catch {
      clearAccessToken();
      set({ auth: false });
    } finally {
      set({ isLoading: false });
    }
  },
  login: (token) => {
    setAccessToken(token);
    set((state) => ({ auth: true, session: state.session + 1 }));
  },
  logout: async () => {
    clearAccessToken();
    set({ auth: false });
    try {
      await fetch(`${API_BASE_URL}/log-out`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Best-effort — the client-side state is already cleared either way.
    }
  },
}));

export default useAuthStore;
