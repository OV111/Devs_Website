import { useEffect } from "react";

const CONFIRM_TONE = {
  danger:
    "bg-red-600 hover:bg-red-500 focus-visible:outline-red-300",
  primary:
    "bg-purple-600 hover:bg-purple-500 focus-visible:outline-purple-300",
};

/**
 * Modal confirm step for destructive or easy-to-regret actions. Replaces
 * `window.confirm`, which can't be styled, blocks the page and reads as a
 * browser warning rather than part of the product. Escape and a backdrop click
 * cancel; focus starts on Cancel so Enter never confirms by accident.
 */
export default function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111113] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-base font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[#A1A1AA]">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-purple-500"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors focus-visible:outline-2 ${CONFIRM_TONE[tone]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
