import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

/**
 * A small select-style dropdown. Click to open (works for mouse, touch and
 * keyboard — the old hover-only menus didn't), closes on outside click,
 * Escape, or picking an option.
 *
 * `value === ""` means "no filter"; `allLabel` is the option that clears it.
 * `mobileAlign="left"` opens the panel rightwards on phones, for menus that
 * sit at the left of the row there (right-anchored they'd run off-screen).
 */
const FilterMenu = ({ label, value, options, onChange, allLabel, mobileAlign = "right" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = allLabel ? [{ label: allLabel, value: "" }, ...options] : options;
  const current = items.find((o) => o.value === value);
  const isFiltered = Boolean(allLabel && value);

  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
          isFiltered
            ? "border-purple-500/50 text-purple-300"
            : "border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white"
        }`}
      >
        {isFiltered ? current?.label : label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 z-30 mt-2 w-40 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 py-1 shadow-xl shadow-black/50 ${
              mobileAlign === "left" ? "max-sm:right-auto max-sm:left-0" : ""
            }`}
          >
            {items.map((o) => (
              <li key={o.label} role="option" aria-selected={o.value === value}>
                <button
                  type="button"
                  onClick={() => pick(o.value)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-xs text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  {o.label}
                  {o.value === value && <Check size={13} className="text-purple-400" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterMenu;
