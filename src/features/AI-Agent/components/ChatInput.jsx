import { useState, useRef, useEffect } from "react";
import { Plus, ArrowUp, Mic, AudioLines, ChevronRight } from "lucide-react";
import { DROPDOWN_ITEMS } from "../../../../constants/AiAgent";

export default function ChatInput({ isStreaming, onSend }) {
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input.trim());
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <div className="px-4 pb-4 pt-2 shrink-0">
      <div className="rounded-2xl px-4 pt-3 pb-3 space-y-3 border border-white/5 bg-white/3">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            const el = inputRef.current;
            if (el) {
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 160) + "px";
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          disabled={isStreaming}
          className="w-full bg-transparent outline-none resize-none text-[14px] leading-relaxed placeholder:text-[#555] disabled:opacity-40 max-h-40 overflow-y-auto"
          style={{ color: "#e5e5e5" }}
        />

        <div className="flex items-center justify-between">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={`${dropdownOpen ? "bg-white/10" : ""} w-8 h-8 rounded-md flex items-center justify-center text-white transition-colors hover:bg-white/5 cursor-pointer`}
              title="More options"
            >
              <Plus size={20} strokeWidth={1.5} />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-11 left-0 w-60 rounded-xl overflow-hidden py-1 z-50 border border-white/15 bg-[#222] backdrop-blur-xl">
                {DROPDOWN_ITEMS.map((group, gi) => (
                  <div key={gi} className="px-1">
                    {gi > 0 && <div className="h-px bg-white/8 mx-2 my-1" />}
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className="w-full flex items-center rounded-lg gap-3 px-3 py-2.5 text-[14px] text-white hover:bg-white/8 transition-colors cursor-pointer"
                        >
                          <ItemIcon
                            size={17}
                            strokeWidth={1.5}
                            className="shrink-0 text-white/60"
                          />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.arrow && (
                            <ChevronRight size={14} className="text-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 select-none">
            <span className="text-[12px] font-xs text-white/30">DevsWebs agent</span>
            <span className="h-3.5 w-px bg-white/15" />
          </div>
            <button
              className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Speaker"
            >
              <AudioLines size={20} strokeWidth={1.5} />
            </button>
            <button
              className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Microphone"
            >
              <Mic size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
                  ${input.trim() ? "bg-purple-600 text-white cursor-pointer" : "bg-[#222] text-white cursor-default"}`}
            >
              <ArrowUp size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-[11px] mt-2 text-center" style={{ color: "#333" }}>
        Agent can make mistakes. Double-check important answers.
      </p>
    </div>
  );
}
