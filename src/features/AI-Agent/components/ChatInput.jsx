import { useState, useRef, useEffect } from "react";
import { ArrowUp, Mic, AudioLines, FileText, X } from "lucide-react";
import { DROPDOWN_ITEMS, ATTACHMENT_ACCEPTED_EXTENSIONS } from "../../../../constants/AiAgent";
import { readAttachments, formatBytes } from "../lib/readAttachment";
import AgentMenu from "./AgentMenu";

const ACCEPT_ATTR = ATTACHMENT_ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(",");

/**
 * The single composer for the agent shell.
 *
 * `value`/`onValueChange` are controlled by the parent because the hero's
 * prompt chips live OUTSIDE this component and need to fill the box. Keeping
 * the draft here would mean two sources of truth for the same text.
 */
export default function ChatInput({ isStreaming, onSend, value, onValueChange, focusToken = 0 }) {
  const input = value;
  const setInput = onValueChange;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachErrors, setAttachErrors] = useState([]);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // The parent can now set the text (prompt chips, menu shortcuts), so the
  // auto-resize has to react to `value` rather than only to typing.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  // Parent bumps focusToken when it injects a prompt, so the caret lands at the
  // end of the inserted text ready for the user to keep typing.
  useEffect(() => {
    if (!focusToken) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [focusToken]);

  const handleFilesPicked = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    const { attachments: read, errors } = await readAttachments(files, attachments.length);
    if (read.length) setAttachments((prev) => [...prev, ...read]);
    setAttachErrors(errors);

    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  };

  const removeAttachment = (name) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
    setAttachErrors([]);
  };

  const canSend = Boolean(input.trim()) && !isStreaming;

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input.trim(), attachments);
    setInput("");
    setAttachments([]);
    setAttachErrors([]);
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleDropdownItem = (label) => {
    setDropdownOpen(false);

    if (label === "Attach file") {
      fileInputRef.current?.click();
      return;
    }

    // Everything else is a prompt shortcut: drop the question into the composer
    // and focus it, so the user can edit before sending rather than firing blind.
    const item = DROPDOWN_ITEMS.flatMap((g) => g.items).find((i) => i.label === label);
    if (!item?.prompt) return;

    setInput(item.prompt);
    // Resize is handled by the effect on `value`; just place the caret at the
    // end — "Find me platform posts about " expects typing to continue there.
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const handleKeyDown = (e) => {
    // Ctrl+U opens the file picker — the shortcut advertised in the menu.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      fileInputRef.current?.click();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    /* max-w-3xl matches the transcript column so the composer lines up with the
       messages instead of spanning the full pane. */
    <div className="px-4 pb-4 pt-2 shrink-0 w-full max-w-3xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        onChange={handleFilesPicked}
        className="hidden"
      />

      {attachErrors.length > 0 && (
        <div className="mb-2 space-y-1">
          {attachErrors.map((err, i) => (
            <p key={i} className="text-[12px] text-amber-400/90 px-1">
              {err}
            </p>
          ))}
        </div>
      )}

      <div className="rounded-2xl px-2.5 py-2 border border-white/10 bg-white/3">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pt-1 pb-2">
            {attachments.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg border border-white/10 bg-white/5 max-w-[220px]"
                title={a.truncated ? `${a.name} (truncated to fit)` : a.name}
              >
                <FileText size={13} className="shrink-0 text-purple-400" />
                <span className="text-[12px] text-white/80 truncate">{a.name}</span>
                <span className="text-[11px] text-white/30 shrink-0">
                  {formatBytes(a.bytes)}
                  {a.truncated ? " ·cut" : ""}
                </span>
                <button
                  onClick={() => removeAttachment(a.name)}
                  className="w-5 h-5 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Single row: menu, input and actions inline. items-end keeps the
            buttons anchored to the bottom as the textarea grows. */}
        <div className="flex items-end gap-1.5">
          <AgentMenu
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            onSelect={handleDropdownItem}
            isEnabled={() => true}
          />

          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            disabled={isStreaming}
            className="flex-1 min-w-0 bg-transparent outline-none resize-none text-[14px] leading-6 py-1 text-white placeholder:text-[#555] disabled:opacity-40 max-h-40 overflow-y-auto"
          />

          <div className="flex items-center gap-0.5 shrink-0">
            {/* Voice is UI-only for now.
                aria-disabled rather than the `disabled` attribute: a disabled
                button suppresses pointer events in most browsers, which kills
                BOTH the hover state and the native tooltip — so the control
                would look dead and never explain why. This keeps it hoverable
                and discoverable while still being announced as disabled, and
                the click handler is the thing that actually blocks the action. */}
            <button
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              title="Voice input — coming soon"
              aria-label="Voice input"
              className="w-8 h-8 rounded-md flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/5 transition-colors cursor-not-allowed"
            >
              <Mic size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-disabled="true"
              onClick={(e) => e.preventDefault()}
              title="Voice conversation — coming soon"
              aria-label="Voice conversation"
              className="w-8 h-8 rounded-md flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/5 transition-colors cursor-not-allowed"
            >
              <AudioLines size={18} strokeWidth={1.5} />
            </button>

            {/* Send only appears once there's something to send, so the resting
                state stays uncluttered. */}
            {canSend && (
              <button
                onClick={handleSend}
                aria-label="Send message"
                title="Send"
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer ml-0.5"
              >
                <ArrowUp size={17} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-2 px-1">
        <p className="text-[11px]" style={{ color: "#333" }}>
          Agent can make mistakes. Double-check important answers.
        </p>
        
      </div>
    </div>
  );
}
