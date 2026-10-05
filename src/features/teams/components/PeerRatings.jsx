import { useEffect, useState } from "react";
import { teamsApi } from "../teamsApi";

/**
 * Rate each teammate 1-5. You only ever see the ratings YOU gave; what others
 * gave you is shown only as an average on the public evidence page.
 */
export default function PeerRatings({ teamId, teammates }) {
  const [given, setGiven] = useState({}); // userId -> score
  const [error, setError] = useState(null);

  useEffect(() => {
    teamsApi
      .myRatings(teamId)
      .then((rows) =>
        setGiven(Object.fromEntries(rows.map((r) => [r.rateeId, r.score]))),
      )
      .catch((err) => setError(err.message));
  }, [teamId]);

  const rate = async (userId, score) => {
    setError(null);
    try {
      await teamsApi.rate(teamId, userId, { score });
      setGiven((g) => ({ ...g, [userId]: score }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!teammates.length) {
    return <p className="t-caption">No teammates to rate yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-[var(--t-red)]">{error}</p>}
      {teammates.map((m) => (
        <div
          key={m.userId}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <span className="t-mono text-[var(--t-mist)]">@{m.githubLogin}</span>
          <div
            role="radiogroup"
            aria-label={`Rate ${m.githubLogin}`}
            className="flex gap-1"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={given[m.userId] === n}
                onClick={() => rate(m.userId, n)}
                className={`t-btn h-8 w-8 !p-0 ${
                  given[m.userId] === n ? "t-btn-primary" : "t-btn-ghost"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
