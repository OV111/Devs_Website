import { useCallback, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { adminApi } from "./adminApi";
import AttemptDetail from "./components/admin/AttemptDetail";
import { ErrorBanner } from "./components/ui";
import { formatDateTime } from "./lib/format";

const STATUSES = [
  "",
  "started",
  "submitted",
  "reviewing",
  "defense",
  "passed",
  "failed",
];

/**
 * /capstone/admin — the review queue. Admin-only: the API answers 404 to
 * everyone else, and so does this page.
 */
export default function CapstoneAdminPage() {
  const [filter, setFilter] = useState({ status: "", page: 1 });
  const [list, setList] = useState(null);
  const [selected, setSelected] = useState(null); // attempt id
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadList = useCallback(async () => {
    try {
      setList(await adminApi.list(filter));
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [filter]);

  const loadDetail = useCallback(async (id) => {
    if (!id) return;
    try {
      setDetail(await adminApi.detail(id));
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    setDetail(null);
    loadDetail(selected);
  }, [selected, loadDetail]);

  /** Run a write, then refresh both panes. Resolves true on success. */
  const act = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await Promise.all([loadList(), loadDetail(selected)]);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (error?.status === 404 && !list) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 text-zinc-300 sm:px-8">
        <p>Not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-24 pt-28 text-white sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Capstone review queue</h1>
          <p className="text-[13px] text-zinc-500">
            Integrity flags, full grading data, overrides. Every action is
            logged.
          </p>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-zinc-400">
          Status
          <select
            value={filter.status}
            onChange={(e) => setFilter({ status: e.target.value, page: 1 })}
            className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-zinc-200"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "all"}
              </option>
            ))}
          </select>
        </label>
      </header>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col gap-3">
          {!list && (
            <div
              className="h-64 animate-pulse rounded-2xl bg-zinc-900"
              aria-busy="true"
            />
          )}
          {list?.attempts.length === 0 && (
            <p className="text-[13px] text-zinc-500">No attempts.</p>
          )}
          <ul className="flex flex-col gap-2">
            {list?.attempts.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setSelected(a.id)}
                  aria-pressed={selected === a.id}
                  className={`flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-colors ${
                    selected === a.id
                      ? "border-purple-500/60 bg-purple-600/10"
                      : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                  }`}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                    <span className="font-semibold text-white">
                      @{a.username} · {a.trackId} #{a.attemptNumber}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {a.status}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    review {a.reviewScore ?? "—"} · defense{" "}
                    {a.defenseScore ?? "—"} · {a.repo ?? "no repo"} ·{" "}
                    {formatDateTime(a.updatedAt)}
                  </span>
                  {(a.flags.length > 0 ||
                    a.integrity.pasteEvents > 0 ||
                    a.integrity.lateAnswers > 0) && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-300">
                      <AlertTriangle size={11} aria-hidden="true" />
                      {[
                        ...a.flags,
                        a.integrity.pasteEvents
                          ? `${a.integrity.pasteEvents} pastes`
                          : null,
                        a.integrity.lateAnswers
                          ? `${a.integrity.lateAnswers} late`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                  {a.overridden && (
                    <span className="text-[11px] text-purple-300">
                      overridden by an admin
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {list && list.total > list.pageSize && (
            <div className="flex items-center gap-3 text-[12px] text-zinc-400">
              <button
                type="button"
                disabled={filter.page <= 1}
                onClick={() => setFilter((f) => ({ ...f, page: f.page - 1 }))}
                className="disabled:opacity-40"
              >
                ← Prev
              </button>
              <span>
                page {list.page} of {Math.ceil(list.total / list.pageSize)}
              </span>
              <button
                type="button"
                disabled={filter.page * list.pageSize >= list.total}
                onClick={() => setFilter((f) => ({ ...f, page: f.page + 1 }))}
                className="disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div>
          {!selected && (
            <p className="text-[13px] text-zinc-500">
              Select an attempt to see everything about it.
            </p>
          )}
          {selected && !detail && (
            <div
              className="h-96 animate-pulse rounded-2xl bg-zinc-900"
              aria-busy="true"
            />
          )}
          {detail && (
            <AttemptDetail
              detail={detail}
              busy={busy}
              onOverride={(outcome, reason) =>
                act(() => adminApi.override(selected, outcome, reason))
              }
              onSetRevoked={(publicId, revoked, reason) =>
                act(() => adminApi.setRevoked(publicId, revoked, reason))
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
