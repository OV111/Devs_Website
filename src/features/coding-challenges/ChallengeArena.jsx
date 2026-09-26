import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useChallengeStore from "./store/useChallengeStore";
import useCodeRunner from "./hooks/useCodeRunner";
import useArenaFiles from "./hooks/useArenaFiles";
import useArenaSubmit from "./hooks/useArenaSubmit";
import useArenaHints from "./hooks/useArenaHints";
import { C, FONT_MONO, FONT_SANS } from "./lib/arenaTheme";
import SubBar from "./components/arena/SubBar";
import ProblemPanel from "./components/arena/ProblemPanel";
import CodePanel from "./components/arena/CodePanel";
import HintsPanel from "./components/arena/HintsPanel";
import ActionBar from "./components/arena/ActionBar";
import SolvedPanel from "./components/arena/SolvedPanel";

export default function ChallengeArena() {
  const { id: slug } = useParams();
  const navigate = useNavigate();

  const {
    challenge, attempt, loading, error,
    loadChallenge, clearChallenge, startAttempt, saveDraft, revealHint, submitAttempt,
  } = useChallengeStore();

  // Stage 3: the files are executed in a throwaway Web Worker, off the UI
  // thread, so a bad solution can't freeze the Arena.
  const { run, running, results } = useCodeRunner();

  // The Arena is a `position: fixed` full-viewport layout, but the browser
  // still carries over whatever scroll position the catalog page was at —
  // so without this, arriving here mid-scroll renders the fixed layout
  // pushed down until the user manually scrolls back up.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    loadChallenge(slug);
    startAttempt(slug);
    return clearChallenge;
  }, [slug, loadChallenge, clearChallenge, startAttempt]);

  const { files, updateFile } = useArenaFiles({ challenge, attempt, saveDraft });
  const { submit: runSubmit, submitting, verdict, setVerdict } = useArenaSubmit(submitAttempt);
  const { hints, buyHint } = useArenaHints({ challenge, revealHint });

  // Shown once per fresh pass; dismissing it doesn't discard the verdict —
  // "View solution" in the action bar brings it back without re-submitting.
  const [showSolved, setShowSolved] = useState(true);
  const submit = async () => {
    setShowSolved(true);
    await runSubmit();
  };

  const handleChangeFile = (name, code) => {
    // Editing invalidates the previous verdict — showing a stale "passed"
    // next to changed code would be a lie.
    setVerdict(null);
    updateFile(name, code);
  };

  const breadcrumb = useMemo(
    () => (challenge ? ["arena", challenge.trackId, challenge.layerId] : ["arena"]),
    [challenge],
  );

  if (!challenge) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: "calc(100dvh - var(--navbar-h, 48px))",
          background: C.bg,
          fontFamily: FONT_MONO,
          color: C.muted,
        }}
      >
        <p className="text-[12px]" style={{ color: error ? C.rose : C.muted }}>
          {error
            ? `Couldn't load this challenge — ${error}`
            : loading
              ? "Loading challenge…"
              : "Challenge not found."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        height: "calc(100dvh - var(--navbar-h, 48px))",
        background: C.bg,
        fontFamily: FONT_SANS,
        color: C.text,
      }}
    >
      <SubBar
        breadcrumb={breadcrumb}
        challengeId={challenge.slug}
        pager={null}
        onBack={() => navigate("/coding-challenges")}
      />

      <div
        className="arena-workspace thin-scrollbar flex-1 min-h-0 overflow-hidden"
        style={{ display: "grid", gridTemplateColumns: "340px 1fr 272px" }}
      >
        <div className="h-full overflow-hidden flex flex-col" style={{ borderRight: `1px solid ${C.border}` }}>
          <ProblemPanel challenge={challenge} />
        </div>

        <div className="h-full overflow-hidden flex flex-col" style={{ borderRight: `1px solid ${C.border}` }}>
          <CodePanel key={challenge.slug} files={files} onChangeFile={handleChangeFile} />
        </div>

        <div className="h-full overflow-hidden flex flex-col">
          <HintsPanel key={challenge.slug} hints={hints} onReveal={buyHint} />
        </div>
      </div>

      {showSolved && (
        <SolvedPanel verdict={verdict} onDismiss={() => setShowSolved(false)} />
      )}

      <ActionBar
        testResults={verdict?.results?.length ? verdict.results : results}
        running={running}
        onRun={() => { setVerdict(null); run(files); }}
        onSubmit={submit}
        submitting={submitting}
        lastRunAt={verdict ? "graded" : results.length ? "just now" : null}
        verdict={verdict}
        onViewSolution={verdict?.passed ? () => setShowSolved(true) : null}
      />

      {/* Responsive: below 1100px allow scroll */}
      <style>{`
        @media (max-width: 1100px) {
          .arena-workspace {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          .arena-workspace > * {
            height: auto !important;
            min-height: 400px;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}
