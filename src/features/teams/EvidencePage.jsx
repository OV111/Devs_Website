import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { teamsApi } from "./teamsApi";
import "./teams-theme.css";

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
    <li className="t-card flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="t-h2">
          {m.name}
          {!m.active && (
            <span className="t-badge ml-2">left the team</span>
          )}
        </span>
        <span className="t-mono text-[var(--t-fog)]">@{m.githubLogin}</span>
      </div>
      <p className="text-[14px] text-[var(--t-mist)]">
        {m.mergedPulls} merged PRs · {m.reviewsGiven} reviews given ·{" "}
        <span className="t-mono text-[var(--t-green)]">+{m.additions}</span>{" "}
        <span className="t-mono text-[var(--t-red)]">-{m.deletions}</span>
      </p>
      <p className="text-[14px] text-[var(--t-mist)]">
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

  const shell = (children) => (
    <div className="teams-theme">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12">
        {children}
      </main>
    </div>
  );
  if (error) return shell(<p className="text-sm text-[var(--t-red)]">{error}</p>);
  if (!data) return shell(<p className="t-muted">Loading…</p>);

  return shell(
    <>
      <header className="flex flex-col gap-2">
        <h1 className="t-h1">{data.team.name}</h1>
        <p className="t-muted">
          Track: {data.team.trackId} · {data.totals.mergedPulls} merged pull
          requests · {data.totals.defensesPassed} defenses passed · updated{" "}
          {formatDate(data.updatedAt)}
        </p>
        {data.team.repoUrl && (
          <a
            href={data.team.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-link inline-flex w-fit items-center gap-1.5"
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

      <section className="t-section t-muted">
        <h2 className="t-h2">How this was assessed</h2>
        PR numbers come from the team repository on GitHub. Each defense is a
        timed, AI-graded set of questions about that member&apos;s own merged
        changes, so the score shows how well they can explain their work. It
        does not prove they wrote every line, and peer ratings are only shown
        when at least three teammates rated the person.
      </section>
    </>,
  );
}
