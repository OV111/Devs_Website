import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github } from "lucide-react";
import { teamsApi } from "./teamsApi";
import TeamDefense from "./components/TeamDefense";
import PeerRatings from "./components/PeerRatings";
import "./teams-theme.css";

/**
 * /team: the signed-in developer's build team.
 * Sections: members, my defense (questions on my own merged PRs), peer ratings,
 * and the merged work. Team 1 is assembled by hand, so a developer without a
 * team sees how it works instead of an empty page.
 */

function Section({ title, children }) {
  return (
    <section className="t-section">
      <h2 className="t-h2">{title}</h2>
      {children}
    </section>
  );
}

function NoTeam() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="t-h1">Build teams</h1>
      <p className="t-muted max-w-xl">
        After you pass a capstone, you can join a small team of developers with
        the same aim and build one real project together. Each member merges
        pull requests, is questioned on their own changes, and gets a public
        evidence page. You are not on a team yet.
      </p>
      <Link
        to="/capstone"
        className="t-btn t-btn-primary w-fit"
      >
        Go to your capstone
      </Link>
    </div>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState(undefined); // undefined = loading, null = no team
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mine = await teamsApi.mine();
        if (cancelled) return;
        setTeam(mine);
        if (mine) {
          const rows = await teamsApi.contributions(mine._id);
          if (!cancelled) setContributions(rows);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shell = (children) => (
    <div className="teams-theme">
      <main className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12">
        {children}
      </main>
    </div>
  );

  if (error) return shell(<p className="text-sm text-[var(--t-red)]">{error}</p>);
  if (team === undefined) return shell(<p className="t-muted">Loading…</p>);
  if (team === null) return shell(<NoTeam />);

  const active = team.members.filter((m) => m.status === "active");
  const teammates = active.filter((m) => m.userId !== team.viewerId);

  return shell(
    <>
      <header className="flex flex-col gap-2">
        <h1 className="t-h1">{team.name}</h1>
        <p className="flex items-center gap-2">
          <span className="t-badge t-mono">{team.trackId}</span>
          <span className="t-badge">{team.status}</span>
        </p>
        {team.repo && (
          <a
            href={team.repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="t-link inline-flex w-fit items-center gap-1.5"
          >
            <Github size={14} aria-hidden="true" />
            {team.repo.fullName}
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        )}
      </header>

      <Section title="Members">
        <ul className="flex flex-wrap gap-2">
          {active.map((m) => (
            <li key={m.userId} className="t-pill t-mono">
              @{m.githubLogin}
              {m.userId === team.viewerId ? " (you)" : ""}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your defense">
        <p className="t-muted">
          Five questions about the pull requests you merged. Only you can answer
          them, and each has a 3-minute timer.
        </p>
        <TeamDefense teamId={team._id} />
      </Section>

      <Section title="Rate your teammates">
        <PeerRatings teamId={team._id} teammates={teammates} />
      </Section>

      <Section title="Merged work">
        {contributions.length === 0 ? (
          <p className="t-caption">
            No merged pull requests synced yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contributions.map((c) => (
              <li key={c._id} className="t-card-subtle flex items-baseline gap-3 text-sm">
                <span className="t-mono text-[var(--t-ash)]">#{c.prNumber}</span>
                <span className="flex-1 text-[var(--t-mist)]">{c.title}</span>
                <span className="t-mono text-[var(--t-fog)]">@{c.authorLogin}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>,
  );
}
