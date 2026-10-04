import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import ReasonAction from "./ReasonAction";
import { Card, ScoreBar, SectionLabel } from "../ui";
import { formatDateTime } from "../../lib/format";

const Flags = ({ flags }) =>
  flags?.length ? (
    <ul className="flex flex-wrap gap-1.5">
      {flags.map((f) => (
        <li
          key={`${f.id}:${f.detail}`}
          title={f.detail}
          className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-200"
        >
          <AlertTriangle size={10} aria-hidden="true" /> {f.id}
          {f.detail ? `: ${f.detail}` : ""}
        </li>
      ))}
    </ul>
  ) : null;

/**
 * Everything about one attempt, including what learners never see: flags,
 * expected points, late answers, paste/tab counters. Actions need a reason.
 */
export default function AttemptDetail({
  detail,
  onOverride,
  onSetRevoked,
  busy,
}) {
  const {
    attempt,
    user,
    brief,
    submissions,
    reviews,
    defenses,
    certificate,
    integrity,
    actions,
  } = detail;
  const rubricName = new Map((brief?.rubric ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <SectionLabel>{"// ATTEMPT"}</SectionLabel>
        <p className="text-[15px] font-semibold text-white">
          {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
            user?.username}{" "}
          · @{user?.username} ·{" "}
          <span className="text-zinc-400">{user?.email}</span>
        </p>
        <p className="text-[13px] text-zinc-400">
          {brief?.title} (v{brief?.version}) · attempt {attempt.attemptNumber} ·{" "}
          <strong className="text-white">{attempt.status}</strong>
        </p>
        {brief?.twist && (
          <p className="text-[12px] text-zinc-500">Twist: {brief.twist.text}</p>
        )}
        <p className="font-mono text-[11px] text-zinc-500">
          defense integrity: {integrity.tabSwitches} tab switches ·{" "}
          {integrity.pasteEvents} pastes · {integrity.lateAnswers} late answers
        </p>
        {attempt.override && (
          <p className="rounded-md border border-purple-500/30 bg-purple-600/10 px-3 py-2 text-[12px] text-purple-200">
            Overridden from {attempt.override.previousStatus} on{" "}
            {formatDateTime(attempt.override.at)}: {attempt.override.reason}
          </p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {attempt.status !== "passed" && (
            <ReasonAction
              label="Override → passed"
              confirmLabel="Confirm pass"
              onConfirm={(reason) => onOverride("passed", reason)}
              busy={busy}
            />
          )}
          {attempt.status !== "failed" && (
            <ReasonAction
              label="Override → failed"
              confirmLabel="Confirm fail"
              tone="red"
              onConfirm={(reason) => onOverride("failed", reason)}
              busy={busy}
            />
          )}
        </div>
      </Card>

      {certificate && (
        <Card className="flex flex-col gap-3">
          <SectionLabel>{"// CERTIFICATE"}</SectionLabel>
          <p className="text-[13px] text-zinc-300">
            <Link
              to={`/verify/${certificate.publicId}`}
              className="text-purple-400 hover:underline"
            >
              /verify/{certificate.publicId}
            </Link>{" "}
            · issued {formatDateTime(certificate.issuedAt)}
            {certificate.revokedAt && (
              <span className="text-red-300">
                {" "}
                · revoked {formatDateTime(certificate.revokedAt)}:{" "}
                {certificate.revokedReason}
              </span>
            )}
          </p>
          <ReasonAction
            label={
              certificate.revokedAt
                ? "Restore certificate"
                : "Revoke certificate"
            }
            confirmLabel={
              certificate.revokedAt ? "Confirm restore" : "Confirm revoke"
            }
            tone={certificate.revokedAt ? "purple" : "red"}
            onConfirm={(reason) =>
              onSetRevoked(certificate.publicId, !certificate.revokedAt, reason)
            }
            busy={busy}
          />
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        <SectionLabel>{`// SUBMISSIONS (${submissions.length})`}</SectionLabel>
        {submissions.map((s) => (
          <div
            key={s._id}
            className="flex flex-col gap-1.5 border-t border-white/5 pt-3 first:border-0 first:pt-0"
          >
            <p className="text-[12px] text-zinc-300">
              {formatDateTime(s.submittedAt)} ·{" "}
              {s.repo?.fullName ?? s.repoInput} ·{" "}
              <span className="font-mono">
                {s.commitSha?.slice(0, 7) ?? "—"}
              </span>{" "}
              ·{" "}
              <span className={s.passed ? "text-green-400" : "text-red-400"}>
                {s.passed ? "checks passed" : "checks failed"}
              </span>{" "}
              · {s.commitCount ?? "?"} commits · {s.fileCount ?? "?"} files
            </p>
            <Flags flags={s.flags} />
          </div>
        ))}
      </Card>

      {reviews.map((r) => (
        <Card key={r._id} className="flex flex-col gap-3">
          <SectionLabel>{`// REVIEW · ${r.totalScore}% · ${r.passed ? "passed" : "failed"} · ${r.model} · ${r.promptVersion}`}</SectionLabel>
          <Flags flags={r.flags} />
          <p className="text-[12px] text-zinc-400">{r.summary}</p>
          {r.criteria.map((c) => (
            <div key={c.id} className="flex flex-col gap-1">
              <ScoreBar label={rubricName.get(c.id) ?? c.id} score={c.score} />
              <p className="text-[11px] text-zinc-500">{c.feedback}</p>
            </div>
          ))}
          <p className="font-mono text-[11px] text-zinc-600">
            {r.files?.length ?? 0} files reviewed, {r.omittedCount ?? 0} omitted
            · {r.usage?.total_tokens ?? "?"} tokens
          </p>
        </Card>
      ))}

      {defenses.map((d) => (
        <Card key={d._id} className="flex flex-col gap-4">
          <SectionLabel>{`// DEFENSE SESSION ${d.sessionNumber} · ${d.status}${d.result ? ` · ${d.result.score}%` : ""}`}</SectionLabel>
          <Flags flags={d.flags} />
          {(d.questions ?? []).map((q) => (
            <div
              key={q.id}
              className="flex flex-col gap-1.5 border-t border-white/5 pt-3"
            >
              <p className="text-[13px] font-semibold text-white">{q.text}</p>
              <p className="font-mono text-[11px] text-zinc-500">
                {q.codeRef?.path}:{q.codeRef?.line} · focus {q.focus}
                {q.integrity
                  ? ` · ${q.integrity.tabSwitches} tabs · ${q.integrity.pasteEvents} pastes`
                  : ""}
              </p>
              <p className="text-[12px] text-zinc-300">
                <span className="text-zinc-500">Answer: </span>
                {q.expired ? (
                  <em className="text-red-300">expired</em>
                ) : (
                  q.answer || <em>none</em>
                )}
              </p>
              {q.lateAnswer && (
                <p className="text-[12px] text-amber-200/80">
                  Late answer (scored 0): {q.lateAnswer}
                </p>
              )}
              <p className="text-[11px] text-zinc-500">
                Expected: {q.expectedPoints?.join(" · ")}
              </p>
              {q.score != null && (
                <p className="text-[11px] text-zinc-400">
                  Score {q.score}/4 — {q.feedback}
                </p>
              )}
            </div>
          ))}
        </Card>
      ))}

      <Card className="flex flex-col gap-2">
        <SectionLabel>{"// AUDIT LOG"}</SectionLabel>
        {actions.length === 0 && (
          <p className="text-[12px] text-zinc-500">No admin actions yet.</p>
        )}
        {actions.map((a) => (
          <p key={a._id} className="text-[12px] text-zinc-400">
            {formatDateTime(a.at)} · {a.action}
            {a.from ? ` ${a.from} → ${a.to}` : ""} · {a.reason}
          </p>
        ))}
      </Card>
    </div>
  );
}
