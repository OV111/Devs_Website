import useProfileStore from "@/stores/useProfileStore";
import hexLogo from "@/assets/devswebs_mark_transparent.png";
import TextType from "@/components/effects/TextType";

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
export default function AgentHero() {
  const { user } = useProfileStore();
  const greeting = `${getGreeting()}, ${user?.firstName || "there"}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
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
    </div>
  );
}
