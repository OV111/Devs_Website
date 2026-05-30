import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowUp, Mic, ChevronRight, AudioLines } from "lucide-react";
import useProfileStore from "@/stores/useProfileStore";
import hexLogo from "@/assets/devswebs_mark_transparent.png";
import TextType from "@/components/effects/TextType";
import { CHIPS, DROPDOWN_ITEMS } from "../../../constants/AiAgent";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function AiAgentLanding() {
  const navigate = useNavigate();
  const { user } = useProfileStore();
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  const firstName = user?.firstName || "there";
  const greeting = `${getGreeting()}, ${firstName}`;

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
    if (!message.trim()) return;
    navigate("/ai-agent/chat");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  const fillChip = (label) => {
    setMessage(label);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col mx-auto pt-24 sm:pt-40 w-full max-w-2xl px-4 space-y-6 sm:space-y-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 max-w-xl w-full lg:min-w-2xl lg:w-full sm:gap-3">
          <img
            src={hexLogo}
            alt="DevsWeb"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
          />
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold tracking-tight truncate min-w-0 text-white">
            {greeting}djenjdnejjenfjnrjcnrjncjrnef.erwnjrknsj.fnjn
          </h1>
        </div>
        <p className="text-base sm:text-lg text-white/40 tracking-tight text-center">
          Your Agent for{" "}
          <TextType
            as="span"
            text={[
              "skills",
              "exams",
              "weak spots",
              "code reviews",
              "roadmaps",
              "debugging",
              "layer prep",
            ]}
            typingSpeed={60}
            deletingSpeed={35}
            pauseDuration={1800}
            loop
            showCursor
            cursorCharacter="|"
            cursorClassName="opacity-40"
            className="font-medium text-purple-600"
          />
        </p>
      </div>

      <div className="relative w-full rounded-2xl px-3 sm:px-5 pt-4 pb-3 space-y-4 backdrop-blur border border-white/20 bg-white/5">
        <textarea
          ref={textareaRef}
          rows={2}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask your agent anything..."
          className="w-full bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-white/30 leading-relaxed max-h-30 overflow-y-auto"
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
              disabled={!message.trim()}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
                  ${message.trim() ? "bg-purple-600 text-white cursor-pointer" : "bg-[#222] text-white cursor-default"}`}
            >
              <ArrowUp size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => {
          const ChipIcon = c.icon;
          return (
            <button
              key={c.label}
              onClick={() => fillChip(c.label)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-medium border border-white/10 bg-white/5 text-white/50 backdrop-blur transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white cursor-pointer"
            >
              <ChipIcon
                size={14}
                strokeWidth={1.5}
                className="transition-colors duration-200 group-hover:text-purple-400"
              />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
