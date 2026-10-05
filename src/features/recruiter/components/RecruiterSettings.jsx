import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { recruiterApi } from "../recruiterApi";
import Checkbox from "@/components/ui/FormCheckbox";

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
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            id="recruiter-switch-label"
            className="text-sm font-semibold text-white"
          >
            Show me to recruiters
          </p>
          <p className="text-xs text-neutral-400">
            {settings.enabled
              ? "Your scorecard is public: anyone with your link can open it."
              : "Your scorecard is private. Turn this on to get a public link."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          aria-labelledby="recruiter-switch-label"
          disabled={saving}
          onClick={() => save({ ...settings, enabled: !settings.enabled })}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:opacity-60 ${
            settings.enabled ? "bg-purple-600" : "bg-neutral-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              settings.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {settings.enabled && (
        <>
          <fieldset className="flex flex-col gap-2" disabled={saving}>
            <legend className="mb-1 text-xs text-neutral-400">
              What the page shows
            </legend>
            {SECTIONS.map(({ key, label }) => (
              <Checkbox
                key={key}
                label={label}
                checked={settings.show[key]}
                onChange={(e) =>
                  save({
                    ...settings,
                    show: { ...settings.show, [key]: e.target.checked },
                  })
                }
              />
            ))}
          </fieldset>
          <Checkbox
            label={'Show an "Open to work" badge'}
            checked={settings.openToWork}
            disabled={saving}
            onChange={(e) => save({ ...settings, openToWork: e.target.checked })}
          />
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
