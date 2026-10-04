import { useState } from "react";
import { PrimaryButton } from "../ui";

/**
 * A destructive admin action that needs a written reason (min 10 chars, the
 * same rule the server enforces) and an explicit second click to confirm.
 */
export default function ReasonAction({
  label,
  confirmLabel,
  tone = "purple",
  onConfirm,
  busy,
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const valid = reason.trim().length >= 10;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold ${
          tone === "red"
            ? "border-red-500/40 text-red-300 hover:bg-red-500/10"
            : "border-purple-500/40 text-purple-200 hover:bg-purple-600/10"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-white/10 bg-zinc-900/60 p-3">
      <label className="text-[11px] text-zinc-400" htmlFor={`reason-${label}`}>
        Reason (saved to the audit log
        {tone === "red" ? " and shown publicly on a revoked certificate" : ""})
      </label>
      <textarea
        id={`reason-${label}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        maxLength={500}
        className="rounded-md border border-white/10 bg-zinc-800/60 px-2 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-purple-500/50"
      />
      <div className="flex gap-2">
        <PrimaryButton
          busy={busy}
          disabled={!valid}
          onClick={async () => {
            const ok = await onConfirm(reason.trim());
            if (ok) {
              setOpen(false);
              setReason("");
            }
          }}
        >
          {confirmLabel}
        </PrimaryButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-zinc-400 hover:text-zinc-200"
        >
          Cancel
        </button>
      </div>
      {!valid && (
        <p className="text-[11px] text-zinc-600">At least 10 characters.</p>
      )}
    </div>
  );
}
