import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { recruiterApi } from "../recruiterApi";

function CopyLink({ path }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (permissions, insecure origin); the preview link still works.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-purple-500/50 hover:text-white"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}

const SECTIONS = [
  { key: "exams", label: "Passed layers and exam scores" },
  { key: "capstone", label: "Capstone certificates and scores" },
  { key: "teams", label: "Team projects (merged PRs, defense, peer rating)" },
  { key: "strengths", label: "Strong topics (only topics you know well)" },
];

/**
 * "Show me to recruiters": off by default. The developer chooses what the
 * public scorecard shows. Weak spots are never part of it.
 */
export default function RecruiterSettings({ username }) {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    recruiterApi
      .getSettings()
      .then(setSettings)
      .catch((err) => setError(err.message));
  }, []);

  const save = async (next) => {
    const previous = settings;
    setSettings(next); // optimistic: the toggle responds instantly
    setSaving(true);
    setError(null);
    try {
      setSettings(await recruiterApi.saveSettings(next));
    } catch (err) {
      setSettings(previous);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return error ? (
      <p className="text-sm text-red-400">{error}</p>
    ) : (
      <p className="text-sm text-neutral-500">Loading…</p>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 p-4">
      <label className="flex items-center gap-3 text-sm font-semibold text-white">
        <input
          type="checkbox"
          checked={settings.enabled}
          disabled={saving}
          onChange={(e) => save({ ...settings, enabled: e.target.checked })}
        />
        Show me to recruiters
      </label>
      <p className="text-xs text-neutral-500">
        Creates a public page anyone with the link can open. Off by default.
      </p>

      {settings.enabled && (
        <>
          <fieldset className="flex flex-col gap-2" disabled={saving}>
            <legend className="mb-1 text-xs text-neutral-400">
              What the page shows
            </legend>
            {SECTIONS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-neutral-300"
              >
                <input
                  type="checkbox"
                  checked={settings.show[key]}
                  onChange={(e) =>
                    save({
                      ...settings,
                      show: { ...settings.show, [key]: e.target.checked },
                    })
                  }
                />
                {label}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={settings.openToWork}
              disabled={saving}
              onChange={(e) => save({ ...settings, openToWork: e.target.checked })}
            />
            Show an &quot;Open to work&quot; badge
          </label>
          {username && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/candidate/${username}`}
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                Preview: /candidate/{username}
              </Link>
              <CopyLink path={`/candidate/${username}`} />
            </div>
          )}
        </>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
