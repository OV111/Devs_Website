import { useEffect, useState } from "react";

/** Ticking `HH:MM:SS` label counting down to the next UTC midnight. */
export default function useUtcMidnightCountdown() {
  const [label, setLabel] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
      );
      const left = Math.max(0, next - now.getTime());
      const pad = (n) => String(n).padStart(2, "0");
      setLabel(
        `${pad(Math.floor(left / 3600000))}:${pad(
          Math.floor(left / 60000) % 60,
        )}:${pad(Math.floor(left / 1000) % 60)}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return label;
}
