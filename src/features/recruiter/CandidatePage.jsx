import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { recruiterApi } from "./recruiterApi";

/**
 * Public candidate scorecard: /candidate/:username. No account needed.
 * Order follows what a recruiter asks: is it real (links to verify), can they do
 * the job (results), what are they strong at, how active are they.
 * A section the developer chose not to share is simply absent.
 */

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3 border-t border-neutral-800 pt-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }) {
  return <p className="text-sm text-neutral-500">{children}</p>;
}

export default function CandidatePage() {
  const { username } = useParams();
  const [card, setCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    recruiterApi
      .scorecard(username)
      .then(setCard)
      .catch((err) =>
        setError(
          err.status === 404
            ? "This scorecard doesn't exist or isn't shared."
            : err.message,
        ),
      );
  }, [username]);

  if (error) return <p className="p-8 text-sm text-red-400">{error}</p>;
  if (!card) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold text-white">
          {card.name}
          {card.openToWork && (
            <span className="rounded-full border border-green-500/40 px-2.5 py-0.5 text-xs font-semibold text-green-400">
              Open to work
            </span>
          )}
        </h1>
        {card.headline && (
          <p className="text-sm font-semibold text-purple-300">{card.headline}</p>
        )}
        <p className="text-sm text-neutral-400">
          @{card.username} · member since {formatDate(card.activity.memberSince)}{" "}
          · last active {formatDate(card.activity.lastActiveAt)}
        </p>
        <p className="text-xs text-neutral-500">
          Every result below comes from graded exams, AI-reviewed capstones or
          merged pull requests.
        </p>
      </header>

      {card.capstones && (
        <Section title="Capstones">
          {card.capstones.length === 0 ? (
            <Empty>No capstone passed yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-3">
              {card.capstones.map((c) => (
                <li
                  key={c.verifyPath}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-800 p-4"
                >
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold text-white">
                      <BadgeCheck
                        size={16}
                        className="text-green-400"
                        aria-hidden="true"
                      />
                      {c.track.title}
                    </p>
                    <p className="text-[13px] text-neutral-400">
                      Review {c.reviewScore ?? "—"}% · defense{" "}
                      {c.defenseScore ?? "—"}% · {formatDate(c.issuedAt)}
                    </p>
                  </div>
                  <Link
                    to={c.verifyPath}
                    className="inline-flex items-center gap-1 text-sm text-purple-300 hover:text-purple-200"
                  >
                    Verify <ExternalLink size={11} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {card.exams && (
        <Section title="Layers passed">
          {card.exams.length === 0 ? (
            <Empty>No layer exams passed yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {card.exams.map((e) => (
                <li
                  key={`${e.path}:${e.layer}`}
                  className="flex justify-between text-sm text-neutral-300"
                >
                  <span>{e.layerTitle ?? e.layer}</span>
                  <span className="font-mono text-neutral-400">
                    {e.bestScore}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {card.teams && (
        <Section title="Team projects">
          {card.teams.length === 0 ? (
            <Empty>No team project yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-3">
              {card.teams.map((t) => (
                <li
                  key={t.evidencePath}
                  className="rounded-lg border border-neutral-800 p-4 text-sm text-neutral-300"
                >
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-[13px] text-neutral-400">
                    {t.mergedPulls} merged PRs · {t.reviewsGiven} reviews given
                    {t.defense &&
                      ` · defense ${t.defense.score}% (${t.defense.passed ? "passed" : "not passed"})`}
                    {t.peerRating &&
                      ` · peers ${t.peerRating.average}/5`}
                  </p>
                  <Link
                    to={t.evidencePath}
                    className="mt-1 inline-flex items-center gap-1 text-purple-300 hover:text-purple-200"
                  >
                    Team evidence <ExternalLink size={11} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {card.strengths && (
        <Section title="Strong topics">
          {card.strengths.length === 0 ? (
            <Empty>Not enough evidence yet.</Empty>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {card.strengths.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <p className="border-t border-neutral-800 pt-4 text-xs text-neutral-500">
        Effort points (XP): {card.xpTotal}. XP measures activity, not skill;
        rely on the verified results above.
      </p>
    </main>
  );
}
