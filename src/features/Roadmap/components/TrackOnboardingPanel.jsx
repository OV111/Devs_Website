import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sprout,
  Layers,
  Code2,
  Cpu,
  Briefcase,
  TrendingUp,
  Rocket,
  BookOpen,
  GraduationCap,
  Laptop,
  ArrowLeftRight,
  User,
  Coffee,
  Timer,
  Flame,
  Zap,
} from "lucide-react";

const FREE_TEXT_STEP = {
  id: "about",
  question: "Tell us a bit about yourself.",
  hint: "Why did you choose this track? What's your story? (optional)",
  placeholder:
    "e.g. I'm a graphic designer who wants to move into frontend development and eventually build my own SaaS product...",
};

const STEPS = [
  {
    id: "skillLevel",
    question: "How would you describe your current experience?",
    hint: "Be honest — this helps us set the right starting point.",
    options: [
      {
        value: "beginner",
        label: "No experience",
        desc: "Starting from zero — haven't written code professionally.",
        Icon: Sprout,
      },
      {
        value: "some",
        label: "Some basics",
        desc: "Completed tutorials or courses, built a few small projects.",
        Icon: Layers,
      },
      {
        value: "intermediate",
        label: "Solid foundation",
        desc: "Comfortable with fundamentals, shipped real projects.",
        Icon: Code2,
      },
      {
        value: "advanced",
        label: "Experienced",
        desc: "Production-level work under my belt, looking to specialise.",
        Icon: Cpu,
      },
    ],
  },
  {
    id: "goal",
    question: "What's your primary motivation for learning this?",
    hint: "Your goal shapes which layers matter most right now.",
    options: [
      {
        value: "get_job",
        label: "Land a new role",
        desc: "Targeting a job in this specific domain.",
        Icon: Briefcase,
      },
      {
        value: "upskill",
        label: "Advance at work",
        desc: "Deepen expertise to grow in my current position.",
        Icon: TrendingUp,
      },
      {
        value: "build_projects",
        label: "Build a product",
        desc: "Have an idea I want to ship — learning to execute it.",
        Icon: Rocket,
      },
      {
        value: "learn",
        label: "Explore & grow",
        desc: "Curiosity-driven — no immediate deliverable in mind.",
        Icon: BookOpen,
      },
    ],
  },
  {
    id: "background",
    question: "What's your current situation?",
    hint: "Helps us understand the context you're learning in.",
    options: [
      {
        value: "student",
        label: "Student / Bootcamp",
        desc: "Enrolled in a degree programme or intensive course.",
        Icon: GraduationCap,
      },
      {
        value: "working_dev",
        label: "Employed in tech",
        desc: "Currently working as a developer or in a technical role.",
        Icon: Laptop,
      },
      {
        value: "career_changer",
        label: "Career transition",
        desc: "Switching from a non-tech field into software.",
        Icon: ArrowLeftRight,
      },
      {
        value: "self_taught",
        label: "Independent learner",
        desc: "Self-taught, freelancing, or between roles.",
        Icon: User,
      },
    ],
  },
  {
    id: "weeklyTime",
    question: "How many hours per week can you commit?",
    hint: "Realistic estimates lead to realistic progress.",
    options: [
      {
        value: "light",
        label: "Light  ·  1–5 hrs / week",
        desc: "Squeezing learning around a busy schedule.",
        Icon: Coffee,
      },
      {
        value: "moderate",
        label: "Moderate  ·  5–15 hrs / week",
        desc: "Consistent daily sessions, steady progress.",
        Icon: Timer,
      },
      {
        value: "intensive",
        label: "Intensive  ·  15–30 hrs / week",
        desc: "Learning is a top priority right now.",
        Icon: Flame,
      },
      {
        value: "fulltime",
        label: "Full-time  ·  30+ hrs / week",
        desc: "Fully focused — treating this like a job.",
        Icon: Zap,
      },
    ],
  },
];

const TOTAL_STEPS = STEPS.length + 1; // +1 for free-text step
const FREE_TEXT_STEP_INDEX = STEPS.length;

export default function TrackOnboardingPanel({ track, onClose, onStart }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [freeText, setFreeText] = useState("");

  const isFreeTextStep = step === FREE_TEXT_STEP_INDEX;
  const current = isFreeTextStep ? null : STEPS[step];
  const isLast = step === TOTAL_STEPS - 1;
  const selected = current ? answers[current.id] : null;
  const canContinue = isFreeTextStep ? true : !!selected; // free-text is optional
  const progress = ((step + (isFreeTextStep || selected ? 1 : 0)) / TOTAL_STEPS) * 100;

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (isLast) {
      onStart({ ...answers, about: freeText.trim() || null, track });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col"
        style={{ backgroundColor: "#0c0c0c", borderLeft: "1px solid #1c1c1c" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-purple-500 uppercase">
              Path Setup
            </p>
            <p className="text-[14px] font-semibold text-white mt-0.5 truncate">
              {track?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-neutral-600">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-[11px] text-neutral-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[3px] w-full rounded-full" style={{ backgroundColor: "#1e1e1e" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#9333ea" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="flex-1 px-6 pt-5 pb-4 overflow-y-auto"
          >
            <p className="text-[17px] font-semibold text-white leading-snug mb-1">
              {isFreeTextStep ? FREE_TEXT_STEP.question : current.question}
            </p>
            <p className="text-[12px] text-neutral-600 mb-5">
              {isFreeTextStep ? FREE_TEXT_STEP.hint : current.hint}
            </p>

            {isFreeTextStep ? (
              <div className="relative">
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder={FREE_TEXT_STEP.placeholder}
                  maxLength={400}
                  rows={6}
                  className="w-full resize-none rounded-xl px-4 py-3.5 text-[13px] text-white leading-relaxed placeholder:text-neutral-700 outline-none transition-all duration-150"
                  style={{
                    backgroundColor: "#111111",
                    border: `1px solid ${freeText.length > 0 ? "#7c3aed" : "#1e1e1e"}`,
                    caretColor: "#a855f7",
                  }}
                />
                <p
                  className="text-right text-[11px] mt-1.5"
                  style={{ color: freeText.length > 350 ? "#a855f7" : "#444" }}
                >
                  {freeText.length} / 400
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {current.options.map((opt) => {
                  const isChosen = selected === opt.value;
                  const Icon = opt.Icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 cursor-pointer flex items-start gap-3.5"
                      style={{
                        backgroundColor: isChosen ? "#140d24" : "#111111",
                        border: `1px solid ${isChosen ? "#7c3aed" : "#1e1e1e"}`,
                      }}
                    >
                      <div
                        className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isChosen ? "#2d1b56" : "#1a1a1a" }}
                      >
                        <Icon size={14} style={{ color: isChosen ? "#a855f7" : "#555" }} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[13px] font-semibold leading-tight"
                          style={{ color: isChosen ? "#e5e5e5" : "#888" }}
                        >
                          {opt.label}
                        </p>
                        <p
                          className="text-[11px] mt-0.5 leading-snug"
                          style={{ color: isChosen ? "#777" : "#444" }}
                        >
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              backgroundColor: canContinue ? "#7c3aed" : "#161616",
              color: canContinue ? "#fff" : "#333",
              cursor: canContinue ? "pointer" : "default",
            }}
          >
            {isLast ? "Start path" : "Continue"}
            <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
