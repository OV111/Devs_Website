import { useState, useRef, useEffect, useMemo } from "react";
import { Search, SquarePen, PanelLeft } from "lucide-react";
import SessionItem from "./SessionItem";

/** How long the sidebar stays open after the pointer leaves, to avoid flicker. */
const CLOSE_DELAY_MS = 260;

/** "2d ago" style — createdAt arrives as an ISO string from MongoDB. */
function formatWhen(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";

  const secs = Math.floor((Date.now() - then.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function SessionsSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onRenameSession,
  onDeleteSession,
  onTogglePinSession,
  mobileOpen = false,
  onMobileClose = () => {},
}) {
  // `pinned` is the explicit choice made by clicking a chevron; `peeking` is the
  // temporary hover state. Keeping them separate is what stops a hover-out from
  // closing a sidebar the user deliberately opened.
  const [pinned, setPinned] = useState(true);
  const [peeking, setPeeking] = useState(false);
  const [query, setQuery] = useState("");
  const closeTimer = useRef(null);

  const expanded = pinned || peeking;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleEnter = () => {
    cancelClose();
    if (!pinned) setPeeking(true);
  };

  const handleLeave = () => {
    cancelClose();
    // Delay so brushing past the rail, or crossing the gap between the rail and
    // the expanded panel, doesn't snap it shut mid-movement.
    closeTimer.current = setTimeout(() => setPeeking(false), CLOSE_DELAY_MS);
  };

  useEffect(() => cancelClose, []);

  // Escape closes the phone drawer; body scroll is locked while it's open so
  // swiping the list doesn't scroll the page behind it.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && onMobileClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [mobileOpen, onMobileClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => (s.title ?? "").toLowerCase().includes(q));
  }, [sessions, query]);

  // Picking a chat (or starting one) on a phone should also dismiss the drawer.
  const withClose = (fn) => (...args) => {
    fn(...args);
    onMobileClose();
  };

  // The panel's contents are shared by the desktop sidebar and the phone drawer.
  // `onClose` is only passed by the drawer and makes the panel icon close the drawer.
  const renderPanel = ({ onSelect, onNew, onClose }) => (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "#444" }}>
          Sessions
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onNew}
            className="w-9 h-9 md:w-7 md:h-7 relative max-md:after:absolute max-md:after:-inset-1 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 cursor-pointer text-white/60 hover:text-white"
            title="New session"
            aria-label="New session"
          >
            <SquarePen size={15} strokeWidth={1.75} />
          </button>
          {onClose ? (
            <button
              onClick={onClose}
              className="w-9 h-9 relative after:absolute after:-inset-1 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 cursor-pointer text-white/70 hover:text-white"
              aria-label="Close sessions"
            >
              <PanelLeft size={16} strokeWidth={2} />
            </button>
          ) : (
            <button
              onClick={() => {
                setPinned(false);
                setPeeking(false);
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 cursor-pointer text-white/70 hover:text-white"
              title="Collapse"
              aria-label="Collapse sessions"
            >
              <PanelLeft size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/5 bg-white/3">
          <Search size={13} strokeWidth={1.5} style={{ color: "#444" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            // 16px on phones stops iOS zooming the page when the field is focused.
            className="flex-1 min-w-0 bg-transparent outline-none text-base md:text-[12px] placeholder:text-[#333]"
            style={{ color: "#888" }}
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#3a3a3a transparent" }}
      >
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-12 px-4 text-center">
            <span className="text-[11px]" style={{ color: "#2a2a2a" }}>
              No sessions yet
            </span>
            <span className="text-[10px]" style={{ color: "#222" }}>
              Start a conversation to create one
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-[11px] text-center mt-12 px-4" style={{ color: "#2a2a2a" }}>
            No sessions match “{query}”
          </p>
        ) : (
          <>
            {[
              ["Pinned", filtered.filter((s) => s.pinned)],
              ["Recent", filtered.filter((s) => !s.pinned)],
            ].map(([label, group]) =>
              group.length === 0 ? null : (
                <div key={label}>
                  {/* The heading only earns its space once something is pinned —
                      otherwise every user sees an empty "Pinned" label forever. */}
                  {filtered.some((s) => s.pinned) && (
                    <p
                      className="text-[10px] font-bold tracking-widest  px-3 pt-2 pb-1"
                      style={{ color: "#333" }}
                    >
                      {label}
                    </p>
                  )}
                  {group.map((s) => (
                    <SessionItem
                      key={s._id}
                      session={{ ...s, when: formatWhen(s.updatedAt ?? s.createdAt) }}
                      active={s._id === activeSessionId}
                      onSelect={onSelect}
                      onRename={onRenameSession}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePinSession}
                    />
                  ))}
                </div>
              ),
            )}
          </>
        )}
      </div>
    </>
  );

  // Below md the desktop sidebar is hidden, so this slide-over is the only way
  // to reach past chats on a phone.
  const mobileDrawer = mobileOpen && (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
      <aside
        role="dialog"
        aria-label="Sessions"
        className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-white/10 bg-black pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
      >
        {renderPanel({
          onSelect: withClose(onSelectSession),
          onNew: withClose(onNewSession),
          onClose: onMobileClose,
        })}
      </aside>
    </div>
  );

  // ── Collapsed rail ────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <>
        <aside
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="w-10 shrink-0 hidden md:flex flex-col items-center border-r border-white/10"
        >
          <button
            onClick={() => setPinned(true)}
            className="mb-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-white/70 hover:text-white"
            title="Open sessions"
            aria-label="Open sessions"
          >
            <PanelLeft size={16} strokeWidth={2} />
          </button>
          <div className="flex-1" />
        </aside>
        {mobileDrawer}
      </>
    );
  }

  // ── Expanded panel ────────────────────────────────────────────────────────
  return (
    <>
      <aside
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="w-60 shrink-0 flex-col hidden md:flex border-r border-white/10"
      >
        {renderPanel({ onSelect: onSelectSession, onNew: onNewSession })}
      </aside>
      {mobileDrawer}
    </>
  );
}
