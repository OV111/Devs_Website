import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Check, X, Pin, PinOff } from "lucide-react";

/**
 * One row in the sessions list.
 *
 * The row is a <div>, not a <button>: the menu trigger and the rename input are
 * interactive elements, and nesting those inside a button is invalid HTML that
 * breaks keyboard behaviour. Click-to-open lives on the title element instead.
 */
export default function SessionItem({ session, active, onSelect, onRename, onDelete, onTogglePin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState(session.title ?? "");
  const [busy, setBusy] = useState(false);

  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
    };
    const onKey = (e) => e.key === "Escape" && closeMenu();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!renaming) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [renaming]);

  const closeMenu = () => {
    setMenuOpen(false);
    setConfirmDelete(false);
  };

  const startRename = () => {
    setDraft(session.title ?? "");
    setRenaming(true);
    closeMenu();
  };

  const commitRename = async () => {
    const next = draft.trim();
    // Nothing to do if it's unchanged or empty — don't spend a request on it.
    if (!next || next === session.title) return setRenaming(false);
    setBusy(true);
    await onRename(session._id, next);
    setBusy(false);
    setRenaming(false);
  };

  const handleDelete = async () => {
    setBusy(true);
    await onDelete(session._id);
    // No cleanup after this — the row unmounts when the parent drops it.
  };

  if (renaming) {
    return (
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-sm"
        style={{ backgroundColor: "#1a0f2e", borderLeft: "2px solid #9333ea" }}
      >
        <input
          ref={inputRef}
          value={draft}
          maxLength={80}
          disabled={busy}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setRenaming(false);
          }}
          // Clicking away saves, matching the inline-rename behaviour people
          // expect from file explorers and chat sidebars.
          onBlur={commitRename}
          className="flex-1 min-w-0 bg-transparent outline-none text-[13px] text-white border-b border-purple-500/50"
        />
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={commitRename}
          className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
          title="Save"
        >
          <Check size={13} />
        </button>
        <button
          // onMouseDown so this fires before onBlur would commit the rename.
          onMouseDown={(e) => {
            e.preventDefault();
            setRenaming(false);
          }}
          className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
          title="Cancel"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="group relative flex items-center rounded-sm transition-colors hover:bg-white/5"
      style={{
        backgroundColor: active ? "#1a0f2e" : "transparent",
        borderLeft: active ? "2px solid #9333ea" : "2px solid transparent",
        opacity: busy ? 0.5 : 1,
      }}
    >
      <button
        onClick={() => onSelect(session._id)}
        className="flex-1 min-w-0 text-left px-3 py-2 cursor-pointer"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {session.pinned && (
            <Pin size={11} className="shrink-0 text-purple-400/70" fill="currentColor" />
          )}
          <p className="text-[13px] truncate" style={{ color: active ? "#e5e5e5" : "#666" }}>
            {session.title}
          </p>
        </div>
        <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
          {session.when}
        </p>
      </button>

      <div className="relative shrink-0 pr-1.5" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          // Always visible for the active row and while open, otherwise on
          // hover/focus — a permanently visible control on every row is noise,
          // but one that only appears on hover is unreachable by keyboard.
          className={`w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer text-white/50 hover:text-white hover:bg-white/10 focus:opacity-100 ${
            menuOpen || active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          title="Session options"
          aria-label="Session options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={15} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-7 w-40 rounded-xl overflow-hidden p-1 z-50 border border-white/10 bg-[#191918] shadow-2xl shadow-black/60"
          >
            {confirmDelete ? (
              <>
                <p className="px-2.5 py-1.5 text-[12px] text-white/50">Delete this chat?</p>
                <button
                  role="menuitem"
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                  Yes, delete
                </button>
                <button
                  role="menuitem"
                  onClick={() => setConfirmDelete(false)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  <X size={15} strokeWidth={1.5} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  role="menuitem"
                  onClick={() => {
                    onTogglePin(session._id, !session.pinned);
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white hover:bg-white/10 cursor-pointer"
                >
                  {session.pinned ? (
                    <PinOff size={15} strokeWidth={1.5} className="text-white/70" />
                  ) : (
                    <Pin size={15} strokeWidth={1.5} className="text-white/70" />
                  )}
                  {session.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  role="menuitem"
                  onClick={startRename}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white hover:bg-white/10 cursor-pointer"
                >
                  <Pencil size={15} strokeWidth={1.5} className="text-white/70" />
                  Rename
                </button>
                <button
                  role="menuitem"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
