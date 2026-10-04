import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { teamsApi } from "./teamsApi";

/**
 * Public team evidence: /evidence/:publicId. No account needed.
 * Built for someone who did not earn it (a recruiter): every number comes from
 * merged pull requests and graded defenses, and the page says what it does not
 * prove.
 */

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Member({ m }) {
  return (
    <li className="flex flex-col gap-1 rounded-lg border border-neutral-800 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-white">
          {m.name}
          {!m.active && (
            <span className="ml-2 text-xs text-neutral-500">(left the team)</span>
          )}
        </span>
        <span className="text-xs text-neutral-500">@{m.githubLogin}</span>
      </div>
      <p className="text-[13px] text-neutral-300">
        {m.mergedPulls} merged PRs · {m.reviewsGiven} reviews given ·{" "}
        <span className="text-green-400">+{m.additions}</span>{" "}
        <span className="text-red-400">-{m.deletions}</span>
      </p>
      <p className="text-[13px] text-neutral-300">
        Defense:{" "}
        {m.defense ? `${m.defense.score}% (passed)` : "no passed defense yet"}
        {m.peerRating &&
          ` · peers: ${m.peerRating.average}/5`}
      </p>
    </li>
  );
}

export default function EvidencePage() {
  const { publicId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    teamsApi
      .evidence(publicId)
      .then(setData)
      .catch((err) =>
        setError(
          err.status === 404 ? "This evidence page does not exist." : err.message,
        ),
      );
  }, [publicId]);

  if (error) return <p className="p-8 text-sm text-red-400">{error}</p>;
  if (!data) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">{data.team.name}</h1>
        <p className="text-sm text-neutral-400">
          Track: {data.team.trackId} · {data.totals.mergedPulls} merged pull
          requests · {data.totals.defensesPassed} defenses passed · updated{" "}
          {formatDate(data.updatedAt)}
        </p>
        {data.team.repoUrl && (
          <a
            href={data.team.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-purple-300 hover:text-purple-200"
          >
            View the repository
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        )}
      </header>

      <ul className="flex flex-col gap-3">
        {data.members.map((m) => (
          <Member key={m.githubLogin} m={m} />
        ))}
      </ul>

      <section className="border-t border-neutral-800 pt-6 text-[13px] leading-relaxed text-neutral-400">
        <h2 className="mb-1 text-sm font-semibold text-neutral-200">
          How this was assessed
        </h2>
        PR numbers come from the team repository on GitHub. Each defense is a
        timed, AI-graded set of questions about that member&apos;s own merged
        changes, so the score shows how well they can explain their work. It
        does not prove they wrote every line, and peer ratings are only shown
        when at least three teammates rated the person.
      </section>
    </main>
  );
}
