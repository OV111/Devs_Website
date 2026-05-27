import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, ArrowUp, Mic, Paperclip, BookOpen,
  BarChart2, Target, FlaskConical, ChevronRight, Map,
} from "lucide-react";
import useProfileStore from "@/stores/useProfileStore";
import hexLogo from "@/assets/devswebs_mark_transparent.png";
import TextType from "@/components/effects/TextType";

const CHIPS = [
  { label: "Challenges", icon: "⚡" },
  { label: "Exams",      icon: "📋" },
  { label: "Roadmap",    icon: "🗺️" },
  { label: "Weak Spots", icon: "🎯" },
  { label: "Blogs",      icon: "</>" },
];

const DROPDOWN_ITEMS = [
  {
    group: null,
    items: [
      { icon: Paperclip,   label: "Attach file",         arrow: false },
    ],
  },
  {
    group: null,
    items: [
      { icon: Map,         label: "My roadmap",          arrow: true  },
      { icon: BarChart2,   label: "My progress",         arrow: true  },
      { icon: Target,      label: "My weak spots",       arrow: false },
    ],
  },
  {
    group: null,
    items: [
      { icon: FlaskConical, label: "Browse challenges",  arrow: true  },
      { icon: BookOpen,    label: "Search blogs",        arrow: true  },
    ],
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function HexLogo() {
  return <img src={hexLogo} alt="DevsWeb" className="w-11 h-11 object-contain" />;
}

export default function AiAgentLanding() {
  const navigate = useNavigate();
  const { user } = useProfileStore();
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef(null);
  const dropdownRef  = useRef(null);

  const firstName = user?.firstName || "there";
  const greeting  = `${getGreeting()}, ${firstName}`;

  // close on outside click
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
    <div className="flex flex-col items-center justify-center bg-gray-950 text-white px-4 h-[calc(100vh-44px)]">
      <div className="w-full max-w-2xl space-y-8">

        {/* ── GREETING ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-3">
            <HexLogo />
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              {greeting}
            </h1>
          </div>
          <p className="text-lg text-white/40 tracking-tight">
            Your Agent for{" "}
            <TextType
              as="span"
              text={["skills", "exams", "weak spots", "code reviews", "roadmaps", "debugging", "layer prep"]}
              typingSpeed={60}
              deletingSpeed={35}
              pauseDuration={1800}
              loop
              showCursor
              cursorCharacter="|"
              cursorClassName="opacity-40"
              className="font-medium text-purple-400"
            />
          </p>
        </div>

        {/* ── INPUT BOX ── */}
        <div className="relative w-full rounded-2xl px-5 pt-4 pb-3 space-y-4 backdrop-blur border border-white/20 bg-white/5">
          <textarea
            ref={textareaRef}
            rows={3}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask your agent anything..."
            className="w-full bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-white/30 leading-relaxed max-h-40 overflow-y-auto"
          />

          {/* bottom bar */}
          <div className="flex items-center justify-between">

            {/* Plus + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#555] transition-colors hover:bg-white/5 cursor-pointer"
                title="More options"
              >
                <Plus size={18} strokeWidth={1.5} />
              </button>

              {/* dropdown */}
              {dropdownOpen && (
                <div className="absolute bottom-10 left-0 w-64 rounded-2xl overflow-hidden shadow-2xl z-50 border border-white/10 bg-[#1c1c1c]">
                  {DROPDOWN_ITEMS.map((group, gi) => (
                    <div key={gi}>
                      {gi > 0 && <div className="h-px bg-white/10 mx-3" />}
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <button
                            key={item.label}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <ItemIcon size={16} strokeWidth={1.5} className="shrink-0 text-white/50" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.arrow && <ChevronRight size={14} className="text-white/30" />}
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#555] hover:bg-white/5 transition-colors cursor-pointer"
                title="Microphone"
              >
                <Mic size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                  ${message.trim() ? "bg-purple-600 text-white cursor-pointer" : "bg-[#222] text-[#444] cursor-default"}`}
              >
                <ArrowUp size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* ── CHIPS ── */}
        <div className="flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => fillChip(c.label)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium bg-[#141414] text-[#888] border border-white/20 transition-colors hover:bg-[#1f1f1f]"
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
