import { Check } from "lucide-react";

/**
 * A styled checkbox with a real <input type="checkbox"> inside: keyboard,
 * screen readers and form behavior stay native, only the look changes. The input
 * is visually hidden and the box next to it reacts to it through Tailwind's
 * `peer` selectors (checked, focus-visible, disabled).
 */
export default function FormCheckbox({ label, className = "", ...inputProps }) {
  return (
    <label
      className={`group inline-flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 ${className}`}
    >
      <input type="checkbox" className="peer sr-only" {...inputProps} />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-neutral-600 bg-neutral-900 text-transparent transition-colors group-hover:border-purple-400 peer-checked:border-purple-600 peer-checked:bg-purple-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-400"
      >
        <Check size={14} strokeWidth={3} />
      </span>
      {label}
    </label>
  );
}
