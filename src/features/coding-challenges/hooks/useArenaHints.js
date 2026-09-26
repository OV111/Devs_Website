import { useCallback, useMemo, useState } from "react";

/**
 * Hint bodies are never shipped with the challenge — they're bought one at a
 * time and cached here once the server hands the text over.
 */
export default function useArenaHints({ challenge, revealHint }) {
  const [hintTexts, setHintTexts] = useState({});

  const hints = useMemo(
    () =>
      (challenge?.hints ?? []).map((h) => ({
        id: h.order,
        cost: h.cost,
        revealed: Boolean(hintTexts[h.order]),
        text: hintTexts[h.order] ?? "",
      })),
    [challenge, hintTexts],
  );

  const buyHint = useCallback(
    async (order) => {
      try {
        const result = await revealHint(order);
        if (result?.text) {
          setHintTexts((prev) => ({ ...prev, [order]: result.text }));
        }
      } catch (err) {
        // 402 = not enough XP. Surface it on the card rather than silently
        // doing nothing, which would read as a broken button.
        setHintTexts((prev) => ({ ...prev, [order]: `⚠ ${err.message}` }));
      }
    },
    [revealHint],
  );

  return { hints, buyHint };
}
