import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import useThemeStore from "@/stores/useThemeStore";

const LoadingSuspense = () => {
  const { theme } = useThemeStore();
  const isDark = theme !== "light";

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isDark ? "bg-gray-950" : "bg-zinc-100"
      }`}
    >
      <TailChase size="44" speed="1.75" color={isDark ? "#a855f7" : "#7c3aed"} />
    </div>
  );
};

export default LoadingSuspense;
