import { useEffect, useState } from "react";
import { teamsApi } from "../../teamsApi";

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2; // matches userSearchSchema on the server

const label = (u) =>
  [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username;

/**
 * Search users by username or email and pick one. Calls onPick(user) with the
 * raw search row ({ _id, username, email, ... }). Debounced so typing "alice"
 * sends one request, not five; a stale response from an older query is ignored.
 */
export default function UserPicker({ onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) {
      setResults([]);
      return undefined;
    }

    let stale = false;
    const timer = setTimeout(async () => {
      try {
        const rows = await teamsApi.searchUsers(q);
        if (!stale) {
          setResults(rows);
          setError(null);
        }
      } catch (err) {
        if (!stale) setError(err.message);
      }
    }, DEBOUNCE_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-2">
      <input
        className="t-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by username or email"
        aria-label="Search users"
      />
      {error && <p className="text-sm text-[var(--t-red)]">{error}</p>}
      {results.length > 0 && (
        <ul className="flex flex-col gap-1">
          {results.map((u) => (
            <li key={u._id}>
              <button
                type="button"
                className="t-card-subtle flex w-full items-baseline justify-between gap-3 text-left text-sm hover:bg-white/5"
                onClick={() => {
                  onPick(u);
                  setQuery("");
                  setResults([]);
                }}
              >
                <span className="text-[var(--t-mist)]">{label(u)}</span>
                <span className="t-mono text-[var(--t-fog)]">
                  {u.username} · {u.email}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
