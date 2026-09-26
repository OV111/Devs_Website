import useProfileStore from "@/stores/useProfileStore";
import hexLogo from "@/assets/devswebs_mark_transparent.png";
import TextType from "@/components/effects/TextType";
import { CHIPS } from "../../../../constants/AiAgent";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * The empty state of the agent shell — greeting, tagline, and prompt chips.
 *
 * This used to be a separate ROUTE (AiAgentLanding). It's now a state of the
 * one chat shell, which is how ChatGPT/Claude/Gemini work: "new chat" is a
 * state, not a page. Making it a component is what let the sidebar stay
 * mounted and removed the navigate-with-router-state handoff entirely.
 */
export default function AgentHero({ onSelectPrompt }) {
  const { user } = useProfileStore();
  const greeting = `${getGreeting()}, ${user?.firstName || "there"}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-6 sm:space-y-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 w-full sm:gap-3">
          <img
            src={hexLogo}
            alt="DevsWeb"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
          />
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold tracking-tight truncate min-w-0 text-white">
            {greeting}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-white/40 tracking-tight text-center">
          Your Agent for{" "}
          <TextType
            as="span"
            text={[
              "skills",
              "exams",
              "weak spots",
              "code reviews",
              "roadmaps",
              "debugging",
              "layer prep",
            ]}
            typingSpeed={60}
            deletingSpeed={35}
            pauseDuration={1800}
            loop
            showCursor
            cursorCharacter="|"
            cursorClassName="opacity-40"
            className="font-medium text-purple-600"
          />
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => {
          const ChipIcon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => onSelectPrompt(c.prompt)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-medium border border-white/10 bg-white/5 text-white/50 backdrop-blur transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white cursor-pointer"
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
    </div>
  );
}
