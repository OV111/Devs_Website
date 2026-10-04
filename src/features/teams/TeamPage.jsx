import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Github } from "lucide-react";
import { teamsApi } from "./teamsApi";
import TeamDefense from "./components/TeamDefense";
import PeerRatings from "./components/PeerRatings";

/**
 * /team: the signed-in developer's build team.
 * Sections: members, my defense (questions on my own merged PRs), peer ratings,
 * and the merged work. Team 1 is assembled by hand, so a developer without a
 * team sees how it works instead of an empty page.
 */

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3 border-t border-neutral-800 pt-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function NoTeam() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-white">Build teams</h1>
      <p className="max-w-xl text-sm leading-relaxed text-neutral-400">
        After you pass a capstone, you can join a small team of developers with
        the same aim and build one real project together. Each member merges
        pull requests, is questioned on their own changes, and gets a public
        evidence page. You are not on a team yet.
      </p>
      <Link
        to="/capstone"
        className="w-fit rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
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

  if (error) return <p className="p-8 text-sm text-red-400">{error}</p>;
  if (team === undefined)
    return <p className="p-8 text-sm text-neutral-500">Loading…</p>;

  const wrap = "mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10";
  if (team === null)
    return (
      <main className={wrap}>
        <NoTeam />
      </main>
    );

  const active = team.members.filter((m) => m.status === "active");
  const teammates = active.filter((m) => m.userId !== team.viewerId);

  return (
    <main className={wrap}>
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">{team.name}</h1>
        <p className="text-sm text-neutral-400">
          Track: {team.trackId} · status: {team.status}
        </p>
        {team.repo && (
          <a
            href={team.repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-purple-300 hover:text-purple-200"
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
            <li
              key={m.userId}
              className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
            >
              @{m.githubLogin}
              {m.userId === team.viewerId ? " (you)" : ""}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your defense">
        <p className="text-sm text-neutral-400">
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
          <p className="text-sm text-neutral-500">
            No merged pull requests synced yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {contributions.map((c) => (
              <li key={c._id} className="text-sm text-neutral-300">
                <span className="text-neutral-500">#{c.prNumber}</span>{" "}
                {c.title} · @{c.authorLogin}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
}
