import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL, authHeaders } from "../../../../constants/api";

const C = {
  bg:       "#0a0a0c",
  surface:  "#111115",
  border:   "#1f1f26",
  purple:   "#a855f7",
  green:    "#2dd46a",
  amber:    "#ffb347",
  rose:     "#ff5470",
  text:     "#e2e2e8",
  muted:    "#6b6b7b",
  faint:    "#3a3a4a",
};

const FONT_SANS = "'Geist', 'Inter', system-ui, sans-serif";
const FONT_MONO = "'Geist Mono', 'Fira Code', 'JetBrains Mono', monospace";

function Badge({ children, color, bg, border }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {children}
    </span>
  );
}

function SectionHead({ children }) {
  return (
    <h2
      className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
      style={{ color: C.muted, fontFamily: FONT_MONO }}
    >
      {children}
    </h2>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ background: "#0e0e14", border: `1px solid ${C.border}` }}>
      <pre
        className="text-[12px] leading-relaxed p-4 whitespace-pre"
        style={{ color: "#b0b0c0", fontFamily: FONT_MONO }}
      >
        {code}
      </pre>
    </div>
  );
}

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/api/challenges${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
};

function ProposalCard({ proposal, onApprove, onReject }) {
  const [approving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState(null);
  const [approveErrorStatus, setApproveErrorStatus] = useState(null);
  const [approveSuccess, setApproveSuccess] = useState(null);

  const [note, setNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState(null);

  const approve = async () => {
    setApproving(true);
    setApproveError(null);
    setApproveErrorStatus(null);
    setApproveSuccess(null);
    try {
      const { data } = await request(`/proposals/${proposal._id}/approve`, { method: "POST" });
      setApproveSuccess(data);
      onApprove(proposal._id);
    } catch (err) {
      setApproveError(err.message);
      setApproveErrorStatus(err.status);
    } finally {
      setApproving(false);
    }
  };

  const reject = async () => {
    if (!note.trim()) return;
    setRejecting(true);
    setRejectError(null);
    try {
      await request(`/proposals/${proposal._id}/reject`, {
        method: "POST",
        body: JSON.stringify({ note: note.trim() }),
      });
      onReject(proposal._id);
    } catch (err) {
      setRejectError(err.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge color={C.text}   bg="#18181f" border={C.faint}>{proposal.slug}</Badge>
          <Badge color={C.green}  bg="#06190f" border="#0e3d1e">{proposal.type}</Badge>
          <Badge color={C.amber}  bg="#190f00" border="#3d2700">{proposal.difficulty}</Badge>
          <Badge color={C.purple} bg="#160828" border="#3b1e6e">+{proposal.xp} XP</Badge>
        </div>

        <h3 className="text-[16px] font-bold leading-snug" style={{ color: C.text }}>
          {proposal.title}
        </h3>

        <p className="text-[13px] leading-relaxed" style={{ color: "#8a8a9a" }}>
          {proposal.summary}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
          <span>track: <span style={{ color: "#9a9aaa" }}>{proposal.trackId}</span></span>
          <span>layer: <span style={{ color: "#9a9aaa" }}>{proposal.layerId}</span></span>
          <span>submitted by: <span style={{ color: "#9a9aaa" }}>{proposal.submittedBy || "—"}</span></span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-5 pb-5">
        {proposal.starterFiles?.length > 0 && (
          <div>
            <SectionHead>Starter files</SectionHead>
            <div className="flex flex-col gap-3">
              {proposal.starterFiles.map((f) => (
                <div key={f.name}>
                  <span className="text-[11px] mb-1 block" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                    {f.name}
                  </span>
                  <CodeBlock code={f.code} />
                </div>
              ))}
            </div>
          </div>
        )}

        {proposal.hiddenTests?.length > 0 && (
          <div>
            <SectionHead>Hidden tests (decide a pass)</SectionHead>
            <div className="flex flex-col gap-3">
              {proposal.hiddenTests.map((t, i) => (
                <div key={i}>
                  <span className="text-[11px] mb-1 block" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                    {t.name}
                  </span>
                  <CodeBlock code={t.code} />
                </div>
              ))}
            </div>
          </div>
        )}

        {proposal.solution?.code && (
          <div>
            <SectionHead>Reference solution</SectionHead>
            <CodeBlock code={proposal.solution.code} />
            {proposal.solution.explanation && (
              <p className="text-[12px] leading-relaxed mt-2" style={{ color: "#8a8a9a" }}>
                {proposal.solution.explanation}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Feedback rows */}
      {approveError && (
        <div
          className="mx-5 mb-3 px-4 py-3 rounded text-[12px] leading-relaxed"
          style={{
            background: approveErrorStatus === 422 ? "#2a0a10" : "#1c1200",
            border: `1px solid ${approveErrorStatus === 422 ? "#5a1c2a" : "#4a3200"}`,
            color: approveErrorStatus === 422 ? C.rose : C.amber,
            fontFamily: FONT_MONO,
          }}
        >
          {approveErrorStatus === 422 ? "SELF-CHECK FAILED — " : "ERROR — "}
          {approveError}
        </div>
      )}
      {approveSuccess && (
        <div
          className="mx-5 mb-3 px-4 py-2 rounded text-[12px]"
          style={{ background: "#06190f", border: "1px solid #0e3d1e", color: C.green, fontFamily: FONT_MONO }}
        >
          Approved · {approveSuccess.verifiedTests} hidden test(s) verified
        </div>
      )}
      {rejectError && (
        <div
          className="mx-5 mb-3 px-4 py-2 rounded text-[12px]"
          style={{ background: "#2a0a10", border: "1px solid #5a1c2a", color: C.rose, fontFamily: FONT_MONO }}
        >
          {rejectError}
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-5 flex flex-col gap-3 border-t pt-4" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          <button
            onClick={approve}
            disabled={approving}
            className="text-[12px] px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer"
            style={{ background: approving ? "#166534" : C.green, color: "#06190f" }}
          >
            {approving ? "Verifying…" : "Approve"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`reject-note-${proposal._id}`}
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: C.muted, fontFamily: FONT_MONO }}
          >
            Rejection note (required)
          </label>
          <textarea
            id={`reject-note-${proposal._id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain why this proposal is being rejected — the submitter will see this."
            rows={2}
            className="text-[12px] px-3 py-2 rounded outline-none resize-y w-full"
            style={{ background: "#0e0e14", border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT_SANS }}
          />
          <button
            onClick={reject}
            disabled={rejecting || !note.trim()}
            className="self-start text-[12px] px-4 py-1.5 rounded font-semibold transition-colors"
            style={{
              background: !note.trim() ? "transparent" : rejecting ? "#7f1d2e" : C.rose,
              border: !note.trim() ? `1px solid ${C.faint}` : "none",
              color: !note.trim() ? C.muted : "#fff",
              cursor: !note.trim() || rejecting ? "not-allowed" : "pointer",
            }}
          >
            {rejecting ? "Rejecting…" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewProposals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const { items } = await request("/proposals?status=pending");
      setItems(items ?? []);
    } catch (err) {
      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  if (notFound) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg, fontFamily: FONT_MONO, color: C.muted }}
      >
        <p className="text-[14px]">Not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: FONT_SANS, color: C.text }}>
      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: C.purple, fontFamily: FONT_MONO }}
          >
            Review queue
          </span>
          <h1 className="text-[22px] font-bold mt-1" style={{ color: C.text }}>
            Pending proposals
          </h1>
        </div>

        {loading && (
          <p className="text-[12px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
            Loading proposals…
          </p>
        )}

        {!loading && error && (
          <p className="text-[12px]" style={{ color: C.rose, fontFamily: FONT_MONO }}>
            Couldn't load proposals — {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-[13px]" style={{ color: C.muted }}>
            Nothing to review right now.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-5">
            {items.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onApprove={removeItem}
                onReject={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
