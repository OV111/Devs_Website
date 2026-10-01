import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Shared shell for the card popovers (comments, share): same surface, same
 * header, same close behaviour (outside click, Escape, X button). Each popover
 * only supplies its content, so the two can't drift apart visually.
 */
const Popover = ({ title, badge, onClose, className = "", children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      className={`absolute right-0 bottom-10 z-50 flex flex-col rounded-xl border border-neutral-200 bg-white shadow-xl shadow-black/10 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/50 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
          {badge > 0 && (
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {badge}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title.toLowerCase()}`}
          className="cursor-pointer rounded-md p-0.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default Popover;
