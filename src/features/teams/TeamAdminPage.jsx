import { useCallback, useEffect, useState } from "react";
import { teamsApi } from "./teamsApi";
import ConfirmButton from "./components/admin/ConfirmButton";
import UserPicker from "./components/admin/UserPicker";
import "./teams-theme.css";

// Mirrors TEAM_STATUSES in backend/modules/teams/services/teamsData.js.
const STATUSES = ["forming", "active", "defending", "completed", "disbanded"];

const evidenceUrl = (path) => `${window.location.origin}${path}`;

function Panel({ title, hint, children }) {
  return (
    <section className="t-section">
      <h2 className="t-h2">{title}</h2>
      {hint && <p className="t-caption">{hint}</p>}
      {children}
    </section>
  );
}

function CreateTeamForm({ onCreate, busy }) {
  const [name, setName] = useState("");
  const [trackId, setTrackId] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (await onCreate({ name: name.trim(), trackId: trackId.trim() })) {
      setName("");
      setTrackId("");
    }
  };

  return (
    <form onSubmit={submit} className="t-card flex flex-col gap-3">
      <h2 className="t-h2">New team</h2>
      <input
        className="t-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
        aria-label="Team name"
        minLength={2}
        maxLength={60}
        required
      />
      <input
        className="t-input t-mono"
        value={trackId}
        onChange={(e) => setTrackId(e.target.value)}
        placeholder="track-id (kebab-case)"
        aria-label="Track id"
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        maxLength={40}
        required
      />
      <button type="submit" className="t-btn t-btn-primary" disabled={busy}>
        Create team
      </button>
    </form>
  );
}

function RepoPanel({ team, onSave, busy }) {
  const [url, setUrl] = useState("");

  return (
    <Panel
      title="Repository"
      hint="Public GitHub repo. One repo can belong to one team only."
    >
      {team.repo && (
        <p className="t-mono text-[var(--t-mist)]">{team.repo.fullName}</p>
      )}
      <div className="flex gap-2">
        <input
          className="t-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/org/project"
          aria-label="Repository URL"
        />
        <button
          type="button"
          className="t-btn t-btn-ghost shrink-0"
          disabled={busy || !url.trim()}
          onClick={async () => {
            if (await onSave(url.trim())) setUrl("");
          }}
        >
          {team.repo ? "Change" : "Set repo"}
        </button>
      </div>
    </Panel>
  );
}

function MembersPanel({ team, onAdd, onRemove, busy }) {
  const [picked, setPicked] = useState(null);
  const [login, setLogin] = useState("");
  const current = team.members.filter((m) => m.status !== "left");
  const left = team.members.filter((m) => m.status === "left");

  return (
    <Panel
      title={`Members (${current.length}/6)`}
      hint="Confirm each person's GitHub login yourself: merged PRs are matched to it."
    >
      <ul className="flex flex-col gap-2">
        {current.map((m) => (
          <li
            key={m.userId}
            className="t-card-subtle flex items-center justify-between gap-3"
          >
            <span className="t-mono text-[var(--t-mist)]">@{m.githubLogin}</span>
            <ConfirmButton
              disabled={busy}
              onConfirm={() => onRemove(m.userId)}
              confirmLabel="Remove?"
            >
              Remove
            </ConfirmButton>
          </li>
        ))}
        {current.length === 0 && <li className="t-caption">No members yet.</li>}
      </ul>
      {left.length > 0 && (
        <p className="t-caption">
          Left: {left.map((m) => `@${m.githubLogin}`).join(", ")}
        </p>
      )}

      <div className="t-card flex flex-col gap-3">
        {picked ? (
          <p className="flex items-center justify-between text-sm text-[var(--t-mist)]">
            <span>
              Adding <strong className="font-medium">{picked.username}</strong>{" "}
              <span className="t-mono text-[var(--t-fog)]">({picked.email})</span>
            </span>
            <button
              type="button"
              className="t-btn t-btn-ghost"
              onClick={() => setPicked(null)}
            >
              Change
            </button>
          </p>
        ) : (
          <UserPicker onPick={setPicked} />
        )}
        <input
          className="t-input t-mono"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="GitHub login"
          aria-label="GitHub login"
          maxLength={39}
        />
        <button
          type="button"
          className="t-btn t-btn-ghost w-fit"
          disabled={busy || !picked || !login.trim()}
          onClick={async () => {
            if (await onAdd({ userId: picked._id, githubLogin: login.trim() })) {
              setPicked(null);
              setLogin("");
            }
          }}
        >
          Add member
        </button>
      </div>
    </Panel>
  );
}

function EvidencePanel({ evidence, onIssue, onRevoke, busy }) {
  const [consented, setConsented] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(evidenceUrl(evidence.path));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the URL is still visible to copy by hand.
    }
  };

  return (
    <Panel
      title="Evidence page"
      hint="Publishes member names, PR counts and defense scores at a public link. Re-issuing refreshes the snapshot and keeps the same link."
    >
      {evidence && (
        <div className="t-card-subtle flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm">
            <span
              className={`t-badge ${evidence.revoked ? "t-badge-red" : "t-badge-green"}`}
            >
              {evidence.revoked ? "revoked" : "live"}
            </span>
            <a
              className="t-link t-mono"
              href={evidence.path}
              target="_blank"
              rel="noopener noreferrer"
            >
              {evidenceUrl(evidence.path)}
            </a>
          </p>
          <div className="flex gap-2">
            <button type="button" className="t-btn t-btn-ghost" onClick={copy}>
              {copied ? "Copied" : "Copy link"}
            </button>
            <ConfirmButton
              disabled={busy}
              onConfirm={() => onRevoke(!evidence.revoked)}
              className="t-btn t-btn-ghost"
              confirmLabel={evidence.revoked ? "Restore?" : "Revoke?"}
            >
              {evidence.revoked ? "Restore" : "Revoke"}
            </ConfirmButton>
          </div>
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-[var(--t-mist)]">
        <input
          type="checkbox"
          className="mt-1"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
        />
        Every member has agreed to have their name and results published.
      </label>
      <button
        type="button"
        className="t-btn t-btn-primary w-fit"
        disabled={busy || !consented}
        onClick={async () => {
          if (await onIssue()) setConsented(false);
        }}
      >
        {evidence ? "Refresh evidence" : "Issue evidence"}
      </button>
    </Panel>
  );
}

/**
 * /team/admin: run a build team by hand. Admin-only: the API answers 404 to
 * everyone else, and so does this page.
 */
export default function TeamAdminPage() {
  const [teams, setTeams] = useState(null); // null = loading
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadList = useCallback(async () => {
    try {
      setTeams(await teamsApi.list());
    } catch (err) {
      setError(err);
    }
  }, []);

  const loadDetail = useCallback(async (id) => {
    if (!id) return;
    try {
      const [team, ev] = await Promise.all([
        teamsApi.get(id),
        teamsApi.evidenceStatus(id),
      ]);
      setDetail(team);
      setEvidence(ev);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    setDetail(null);
    setEvidence(null);
    setNotice(null);
    loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  /** Run a write, then refresh both panes. Resolves true on success. */
  const act = async (fn, successNotice) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await fn();
      await Promise.all([loadList(), loadDetail(selectedId)]);
      if (successNotice) setNotice(successNotice);
      return result ?? true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const shell = (children) => (
    <div className="teams-theme">
      <main className="mx-auto max-w-[1200px] px-4 py-12">{children}</main>
    </div>
  );

  if (error?.status === 404 && !teams) {
    return shell(<p className="t-muted">Not found.</p>);
  }
  if (!teams) {
    return shell(
      error ? (
        <p className="text-sm text-[var(--t-red)]">{error.message}</p>
      ) : (
        <p className="t-muted">Loading…</p>
      ),
    );
  }

  const create = async (body) => {
    const created = await act(() => teamsApi.create(body), "Team created.");
    if (created?._id) setSelectedId(created._id);
    return Boolean(created);
  };

  return shell(
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="t-h1">Team admin</h1>
        <p className="t-muted">Create teams, set repos, add members, sync PRs, issue evidence.</p>
      </header>

      {error && (
        <p role="alert" className="t-card-subtle text-sm text-[var(--t-red)]">
          {error.message}
        </p>
      )}
      {notice && (
        <p role="status" className="t-card-subtle text-sm text-[var(--t-green)]">
          {notice}
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-4">
          <CreateTeamForm onCreate={create} busy={busy} />
          <ul className="flex flex-col gap-2">
            {teams.map((t) => (
              <li key={t._id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t._id)}
                  aria-current={t._id === selectedId}
                  className={`t-card-subtle flex w-full items-center justify-between gap-2 text-left text-sm ${
                    t._id === selectedId ? "!bg-white/5 !shadow-[inset_0_0_0_1px_var(--t-border-strong)]" : ""
                  }`}
                >
                  <span className="text-[var(--t-paper)]">{t.name}</span>
                  <span className="t-badge">{t.status}</span>
                </button>
              </li>
            ))}
            {teams.length === 0 && <li className="t-caption">No teams yet.</li>}
          </ul>
        </aside>

        <div className="flex flex-col gap-6">
          {!selectedId && <p className="t-muted">Select a team or create one.</p>}
          {selectedId && !detail && <p className="t-muted">Loading…</p>}
          {detail && (
            <>
              <header className="flex flex-col gap-2">
                <h2 className="t-h1">{detail.name}</h2>
                <p className="flex items-center gap-2">
                  <span className="t-badge t-mono">{detail.trackId}</span>
                </p>
              </header>

              <Panel title="Status" hint="Completed and disbanded close ratings; disbanded also closes defenses.">
                <select
                  className="t-input w-fit"
                  value={detail.status}
                  disabled={busy}
                  aria-label="Team status"
                  onChange={(e) =>
                    act(() => teamsApi.setStatus(detail._id, e.target.value), "Status updated.")
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Panel>

              <RepoPanel
                team={detail}
                busy={busy}
                onSave={(url) => act(() => teamsApi.setRepo(detail._id, url), "Repository saved.")}
              />

              <MembersPanel
                team={detail}
                busy={busy}
                onAdd={(body) => act(() => teamsApi.addMember(detail._id, body), "Member added.")}
                onRemove={(userId) => act(() => teamsApi.removeMember(detail._id, userId), "Member removed.")}
              />

              <Panel title="Merged work" hint="Pulls merged PRs from GitHub and matches them to member logins.">
                <button
                  type="button"
                  className="t-btn t-btn-ghost w-fit"
                  disabled={busy || !detail.repo}
                  onClick={() => act(() => teamsApi.sync(detail._id), "Sync finished.")}
                >
                  {busy ? "Working…" : "Sync PRs"}
                </button>
                {!detail.repo && <p className="t-caption">Set a repository first.</p>}
              </Panel>

              <EvidencePanel
                evidence={evidence}
                busy={busy}
                onIssue={() => act(() => teamsApi.issueEvidence(detail._id), "Evidence issued.")}
                onRevoke={(revoked) =>
                  act(
                    () => teamsApi.revokeEvidence(detail._id, revoked),
                    revoked ? "Evidence revoked." : "Evidence restored.",
                  )
                }
              />
            </>
          )}
        </div>
      </div>
    </div>,
  );
}
