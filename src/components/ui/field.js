/**
 * Shared text-input style, the form counterpart to SURFACE. The fill is a
 * 4% white wash over the page, so it stays neutral on any dark surface (the
 * old `gray-900` carried a blue tint that clashed with the near-black UI).
 * Focus is a visible purple border + ring — never `outline-none` alone.
 */
export const INPUT_CLASS =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base md:text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-[#8A8A93] dark:hover:border-white/20 dark:focus:border-purple-500 dark:scheme-dark";
