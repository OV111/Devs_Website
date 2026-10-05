import { useState } from "react";

/**
 * Two-step button for irreversible admin actions. The first click arms it, the
 * second runs it. Inline instead of window.confirm: a native dialog blocks the
 * page and can't be styled or tested.
 */
export default function ConfirmButton({
  children,
  confirmLabel = "Confirm?",
  onConfirm,
  disabled,
  className = "t-btn t-btn-danger",
}) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => setArmed(true)}
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex gap-2">
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={() => {
          setArmed(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </button>
      <button
        type="button"
        className="t-btn t-btn-ghost"
        onClick={() => setArmed(false)}
      >
        Cancel
      </button>
    </span>
  );
}
