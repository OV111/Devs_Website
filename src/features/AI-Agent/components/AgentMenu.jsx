import { useEffect, useRef } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { DROPDOWN_ITEMS } from "../../../../constants/AiAgent";

/**
 * The "+" menu next to the composer.
 *
 * Extracted because ChatInput and AiAgentLanding rendered identical copies of
 * this markup — styling had to be changed in two places and had already drifted.
 *
 * Sizing follows the reference design: a wider panel, roomier rows, 18px icons
 * with a larger gap to the label, and a 2xl radius.
 */
export default function AgentMenu({ open, onOpenChange, onSelect, isEnabled = () => false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOpenChange(false);
    };
    // Escape to dismiss is expected of any menu — it was missing before.
    const onKey = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => onOpenChange(!open)}
        className={`${open ? "bg-white/10" : ""} w-8 h-8 rounded-md flex items-center justify-center text-white transition-colors hover:bg-white/5 cursor-pointer`}
        title="More options"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Plus size={20} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-12 left-0 w-[270px] rounded-2xl overflow-hidden p-1.5 z-50 border border-white/10 bg-[#191918]  shadow-2xl shadow-black/60"
        >
          {DROPDOWN_ITEMS.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="h-px bg-white/10 my-1.5 mx-1" />}
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                const enabled = isEnabled(item.label);
                return (
                  <button
                    key={item.label}
                    role="menuitem"
                    onClick={() => enabled && onSelect(item.label)}
                    disabled={!enabled}
                    title={enabled ? undefined : "Coming soon"}
                    className={`w-full flex items-center rounded-lg gap-3.5 px-3 py-2.5 text-[15px] text-white transition-colors ${
                      enabled ? "hover:bg-white/10 cursor-pointer" : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <ItemIcon size={18} strokeWidth={1.5} className="shrink-0 text-white/70" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.arrow && <ChevronRight size={15} className="text-white/30 shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
