import { create } from "zustand";

const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("theme") || "dark",
  setTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    set({ theme: newTheme });
    localStorage.setItem("theme", newTheme);
  },
}));

export default useThemeStore;
