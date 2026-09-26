import { ChevronDown, Check } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

/** Hover-triggered single-select dropdown used for Path / Layer / Type / Level. */
export default function FilterGroup({
  label,
  options,
  active,
  onSelect,
  isOpen,
  onOpen,
  onClose,
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#1f1f1f] bg-[#141414] px-2.5 py-1.5 text-xs font-medium text-[#888] transition-all duration-200 hover:border-purple-900/60 hover:bg-purple-950/40 hover:text-purple-300 sm:px-3"
      >
        <span>{active === "all" ? label : active}</span>
        <Motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 z-50 mt-1.5 min-w-[120px] overflow-hidden rounded-md border border-[#1f1f1f] bg-[#0d0d0d] shadow-lg shadow-black/30"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => onSelect(opt)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-[#888] transition-colors hover:bg-purple-950/40 hover:text-purple-300"
                >
                  {opt}
                  {active === opt && (
                    <Check className="h-3 w-3 text-purple-400" />
                  )}
                </button>
              </li>
            ))}
          </Motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
