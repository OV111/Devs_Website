import { useState } from "react";
import { Copy, Check, Volume2 } from "lucide-react";

/**
 * Action row under an agent response.
 *
 * Only Copy does anything today. "Read aloud" is rendered `disabled` with a
 * "coming soon" tooltip rather than as a live-looking button that silently does
 * nothing — a control that looks enabled and isn't is worse than no control.
 */
function ActionButton({ icon, label, onClick, disabled, active }) {
  const Icon = icon;
  return (
    <button
      // aria-disabled, not `disabled`: the real attribute suppresses pointer
      // events, so the button would lose its hover state AND its tooltip —
      // leaving a dead-looking control with no explanation. The click handler
      // is what actually blocks the action.
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      title={disabled ? `${label} — coming soon` : label}
      aria-label={label}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
        disabled
          ? "text-white/20 hover:text-white/40 hover:bg-white/5 cursor-not-allowed"
          : "text-white/35 hover:text-white hover:bg-white/8 cursor-pointer"
      }`}
    >
      <Icon size={15} strokeWidth={1.5} className={active ? "text-purple-400" : undefined} />
    </button>
  );
}

export default function MessageActions({ content }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context) — fail silently */
    }
  };

  return (
    // Focus-within keeps the row reachable by keyboard, not hover-only.
    <div className="flex items-center gap-0.5 mt-1 -ml-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <ActionButton
        icon={copied ? Check : Copy}
        label={copied ? "Copied" : "Copy"}
        onClick={copy}
        active={copied}
      />
      <ActionButton icon={Volume2} label="Read aloud" disabled />
    </div>
  );
}
