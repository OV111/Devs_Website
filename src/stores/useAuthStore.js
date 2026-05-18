import { create } from "zustand";
import { API_BASE_URL, JWT_KEY, authHeaders } from "../../constants/api";

const useAuthStore = create((set) => ({
  auth: false,
  isLoading: false,
  init: async () => {
    try {
      set({ isLoading: true });
      const request = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: authHeaders(),
      });
      const response = await request.json();
      if (!response.valid) {
        localStorage.removeItem(JWT_KEY);
      }
      set({ auth: response.valid });
    } catch {
      set({ auth: false });
    } finally {
      set({ isLoading: false });
    }
  },
  login: (token) => {
    localStorage.setItem(JWT_KEY, token);
    set({ auth: true });
  },
  logout: () => {
    localStorage.removeItem(JWT_KEY);
    set({ auth: false });
  },
}));

export default useAuthStore;
