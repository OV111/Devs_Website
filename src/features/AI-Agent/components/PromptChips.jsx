import { CHIPS } from "../../../../constants/AiAgent";

/**
 * Quick-prompt chips for the empty state.
 *
 * Split out of AgentHero (purely a layout change) so the composer can sit
 * BETWEEN the greeting and the chips, keeping header → input → chips as one
 * centred block. Behaviour is unchanged: each chip fills the composer via
 * onSelectPrompt.
 */
export default function PromptChips({ onSelectPrompt }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-2xl mx-auto px-4">
      {CHIPS.map((c) => {
        const ChipIcon = c.icon;
        return (
          <button
            key={c.label}
            onClick={() => onSelectPrompt(c.prompt)}
            className="group flex min-h-9 items-center relative max-md:after:absolute max-md:after:-inset-1 gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-medium border border-white/10 bg-white/5 text-white/50 backdrop-blur transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white cursor-pointer"
          >
            <ChipIcon
              size={14}
              strokeWidth={1.5}
              className="transition-colors duration-200 group-hover:text-purple-400"
            />
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
