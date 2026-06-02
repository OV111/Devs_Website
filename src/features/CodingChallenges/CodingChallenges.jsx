import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  DollarSign,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/effects/GradientText";
import TextType from "@/components/effects/TextType";
import {
  TYPE_STYLE,
  MOCK_STATS,
  DAILY,
  CHALLENGES,
  TOPICS,
  LEADERBOARD,
} from "../../../constants/CodingChallenges";

const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

function useCounter(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatCell({ value, unit, label, sub, index }) {
  const [started, setStarted] = useState(false);
  const prefix = value.startsWith("#") ? "#" : "";
  const numericTarget = parseInt(value.replace("#", ""), 10);
  const count = useCounter(numericTarget, 1800, started);
  return (
    <Motion.div
      className="px-4 py-4 flex flex-col gap-1"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
      onViewportEnter={() => setStarted(true)}
    >
      <p className="flex items-baseline gap-0 text-2xl font-bold leading-none text-[#e5e5e5]">
        <span
          className="tabular-nums inline-block"
          style={{ minWidth: `${(prefix + String(numericTarget)).length}ch` }}
        >
          {prefix}
          {count}
        </span>
        {unit && <span className="text-base">{unit}</span>}
      </p>
      <p className="text-[9px] font-bold tracking-widest uppercase mt-1 text-[#444]">
        {label}
      </p>
      <p className="text-[11px] text-green-400">{sub}</p>
    </Motion.div>
  );
}

function FilterGroup({
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
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300 sm:px-3"
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
            className="absolute left-0 z-50 mt-1.5 min-w-[120px] overflow-hidden rounded-md bg-white shadow-lg shadow-black/5 dark:bg-gray-900 dark:shadow-black/30"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => onSelect(opt)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
                >
                  {opt}
                  {active === opt && (
                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
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

function ChallengeCard({ c }) {
  const ts = TYPE_STYLE[c.type] || TYPE_STYLE.CODE;
  const diffLevel = c.xp >= 60 ? 3 : c.xp >= 50 ? 2 : 1;
  return (
    <div className="relative overflow-hidden rounded-sm p-4 flex flex-col gap-2.5 border border-[#1a1a1a] bg-[#0d0d0d]">
      {c.hot && (
        <div className="absolute top-4 right-[-28px] rotate-45 text-[8px] font-bold px-10 py-0.5 tracking-widest z-10 bg-purple-600 text-white">
          HOT SPOT MATCH
        </div>
      )}
      {c.done && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-purple-600 text-white">
          ✓
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#333]">{c.id}</span>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5"
          style={{ border: `1px solid ${ts.border}`, color: ts.color }}
        >
          {c.type}
        </span>
      </div>

      {/* Title */}
      <p className="text-[14px] font-semibold leading-snug text-[#e5e5e5]">
        {c.title}
      </p>

      {/* Description */}
      <p className="text-[12px] leading-relaxed text-[#555]">{c.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {c.tags.map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 border border-[#1f1f1f] text-[#444]"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 text-[11px] text-[#444]">
          <span>{c.time}</span>
          <span>{c.solves} solves</span>
          {/* difficulty bars */}
          <span className="flex items-end gap-0.5">
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={`w-[3px] rounded-sm inline-block ${level <= diffLevel ? "bg-red-400" : "bg-[#1f1f1f]"}`}
                style={{ height: `${level * 4}px` }}
              />
            ))}
          </span>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 border border-purple-600 text-purple-600">
          +{c.xp} xp
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function CodingChallenges() {
  const [activePath, setActivePath] = useState("all");
  const [activeLayer, setActiveLayer] = useState("3");
  const [activeType, setActiveType] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");
  const [recommended, setRecommended] = useState(false);
  const [activeTopic, setActiveTopic] = useState("all topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const searchInputRef = useRef(null);

  const openMenu = (name) => setOpenDropdown(name);
  const closeMenu = () => setOpenDropdown(null);

  const filteredChallenges = CHALLENGES.filter((c) => {
    if (activePath !== "all" && c.path !== activePath) return false;
    if (activeLayer === "4+") {
      if (parseInt(c.layer) < 4) return false;
    } else if (c.layer !== activeLayer) return false;
    if (activeType !== "all" && c.type.toLowerCase() !== activeType)
      return false;
    if (activeLevel !== "all" && c.level !== activeLevel) return false;
    if (recommended && !c.hot) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !c.desc.toLowerCase().includes(q) &&
        !c.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-[#e5e5e5] relative">
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[400px] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskComposite: "destination-in",
        }}
      />

      <div className="px-6 sm:px-10 lg:px-14 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          <div className="flex-1 min-w-0">
            <Motion.div
              {...FadeUp(0)}
              className="inline-flex items-center gap-2 text-[11px] mb-6 px-2 py-1.5 rounded-2xl border border-[#2d1b4e] bg-[#0f0b1a] text-[#888]"
            >
              <span className="text-[10px] font-bold justify-center items-center px-1.5 py-0.5 rounded-lg bg-purple-600 text-white">
                v0.1
              </span>
              <span>problems · path-specific · agent-guided</span>
            </Motion.div>

            <Motion.div {...FadeUp(0.08)} className="mb-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
                Coding
                {/* <br /> */}
                <TextType
                  as="span"
                  text={[
                    " challenges",
                    " problems",
                    " exercises",
                    " algorithms",
                    " puzzles",
                  ]}
                  typingSpeed={109}
                  deletingSpeed={40}
                  pauseDuration={1700}
                  showCursor={true}
                  cursorCharacter="|"
                  className="text-purple-600"
                  style={{ minWidth: "10ch" }}
                />
                <br />
                that actually
                <br />
                teach and grind.
              </h1>
            </Motion.div>

            <Motion.p
              {...FadeUp(0.16)}
              className="text-[14px] max-w-lg mb-8 text-[#666]"
            >
              Not random DSA grinding. Every challenge is tied to your current
              roadmap layer. Solve them to raise your exam readiness, and the AI
              agent steps in with progressive hints — never the answer.
            </Motion.p>

            <div className="grid grid-cols-2 sm:grid-cols-4">
              {MOCK_STATS.map(({ value, unit, label, sub }, i) => (
                <StatCell
                  key={label}
                  value={value}
                  unit={unit}
                  label={label}
                  sub={sub}
                  index={i}
                />
              ))}
            </div>
          </div>

          <Motion.div
            {...FadeUp(0.1)}
            className="w-full lg:w-[340px] shrink-0 rounded-sm p-5 flex flex-col gap-4 bg-purple-600 border border-purple-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_2px_rgba(74,222,128,0.6)]" />
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                  Daily Challenge
                </span>
              </div>
              {/* <span className="text-[11px] text-white/60">
                {DAILY.id} · {DAILY.date}
              </span> */}
            </div>

            <p className="text-[16px] font-bold text-white leading-snug">
              {DAILY.title}
            </p>

            <p className="text-[12px] leading-relaxed text-white/75">
              {DAILY.desc}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {DAILY.tags.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-bold px-2 pt-1 bg-black/25 text-white rounded-xl"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <button className="flex justify-center items-center gap-1.5 flex-1 py-2 text-[13px] font-bold rounded-sm transition-opacity hover:opacity-90 cursor-pointer bg-white text-purple-600">
                <p>$ start solving</p>
                <ArrowRight size={14} />
              </button>

              <div className="text-left shrink-0">
                <p className="text-[9px] tracking-widest uppercase text-white/50">
                  // RESETS IN
                </p>
                <p className="text-[15px] font-bold font-mono text-white">
                  {DAILY.countdown}
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      <div className="px-6 sm:px-10 lg:px-14 py-5 flex items-center gap-3">
        <FilterGroup
          label="Path"
          options={["backend", "frontend", "ai/ml", "devops", "all"]}
          active={activePath}
          onSelect={setActivePath}
          isOpen={openDropdown === "path"}
          onOpen={() => openMenu("path")}
          onClose={closeMenu}
        />
        <div className="hidden sm:block w-px h-4 bg-[#1f1f1f]" />
        <FilterGroup
          label="LAYER"
          options={["1", "2", "3", "4+"]}
          active={activeLayer}
          onSelect={setActiveLayer}
          isOpen={openDropdown === "layer"}
          onOpen={() => openMenu("layer")}
          onClose={closeMenu}
        />
        <div className="hidden sm:block w-px h-4 bg-[#1f1f1f]" />
        <FilterGroup
          label="Type"
          options={["all", "code", "debug", "build", "design"]}
          active={activeType}
          onSelect={setActiveType}
          isOpen={openDropdown === "type"}
          onOpen={() => openMenu("type")}
          onClose={closeMenu}
        />
        <div className="hidden sm:block w-px h-4 bg-[#1f1f1f]" />
        <FilterGroup
          label="Level"
          options={["all", "easy", "med", "hard"]}
          active={activeLevel}
          onSelect={setActiveLevel}
          isOpen={openDropdown === "level"}
          onOpen={() => openMenu("level")}
          onClose={closeMenu}
        />
        <div className="hidden sm:block w-px h-4 bg-[#1f1f1f]" />
        <button
          onClick={() => setRecommended(!recommended)}
          className={`cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
            recommended
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
          }`}
        >
          + recommended
        </button>

        <div className="ml-auto flex items-center gap-2 rounded-md bg-white px-3 py-2 dark:bg-gray-900">
          <Search className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search challenges..."
            className="min-w-0 w-[220px] bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-gray-100 dark:placeholder-gray-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 px-6 sm:px-10 lg:px-14 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredChallenges.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>

        <div className="w-52 shrink-0 hidden lg:flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 py-5 px-4 border border-[#1a1a1a] bg-[#0d0d0d]">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2.5"
                  strokeDasharray="68 32"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#e5e5e5]">68</span>
                <span className="text-[9px] text-[#444]">22 TO GO</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-[#555]">
              Solve 3 more on async errors and you're exam-ready.
            </p>
            <button className="w-full flex justify-center items-center gap-1.5 py-2 text-[12px] font-bold transition-opacity hover:opacity-80 cursor-pointer bg-purple-600 text-white">
              <DollarSign size={12} /> take exam <ArrowRight size={13} />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono text-[#444]">// TOPICS</p>
              <span className="text-[10px] text-[#2a2a2a]">layer 3</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {TOPICS.map(({ label, count }) => (
                <button
                  key={label}
                  onClick={() => setActiveTopic(label)}
                  className={`flex items-center justify-between px-3 py-1.5 text-[12px] transition-all cursor-pointer rounded-sm border ${
                    activeTopic === label
                      ? "bg-[#1a0f2e] text-white border-[#2d1b4e]"
                      : "bg-transparent text-[#555] border-transparent"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={
                      activeTopic === label ? "text-purple-600" : "text-[#333]"
                    }
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono text-[#444]">
                // LEADERBOARD
              </p>
              <span className="text-[10px] text-[#2a2a2a]">layer 3 · 7d</span>
            </div>
            <div className="flex flex-col gap-1">
              {LEADERBOARD.map(({ rank, initial, name, score, you }) => (
                <div
                  key={name}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-sm border ${
                    you
                      ? "bg-[#0f0b1a] border-[#2d1b4e]"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  <span
                    className={`text-[10px] w-5 shrink-0 tabular-nums text-right ${rank <= 3 ? "text-purple-600" : "text-[#333]"}`}
                  >
                    {rank <= 3 ? `0${rank}` : `#${rank}`}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${you ? "bg-purple-600 text-white" : "bg-[#1a1a1a] text-[#666]"}`}
                  >
                    {initial}
                  </div>
                  <span
                    className={`flex-1 text-[11px] truncate ${you ? "text-[#e5e5e5]" : "text-[#555]"}`}
                  >
                    {name}
                  </span>
                  <span
                    className={`text-[11px] font-semibold tabular-nums shrink-0 ${you ? "text-purple-600" : "text-[#444]"}`}
                  >
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
