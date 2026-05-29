import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    id: "skillLevel",
    question: "What's your current skill level?",
    options: [
      { value: "beginner",     label: "Beginner",     desc: "Just starting out, learning the basics" },
      { value: "intermediate", label: "Intermediate",  desc: "Built some projects, know the fundamentals" },
      { value: "advanced",     label: "Advanced",      desc: "Production experience, looking to level up" },
    ],
  },
  {
    id: "goal",
    question: "What's your main goal?",
    options: [
      { value: "get_job",       label: "Get a job",        desc: "Land my first or next dev role" },
      { value: "upskill",       label: "Upskill",          desc: "Improve in my current role" },
      { value: "build_projects",label: "Build projects",   desc: "Ship real products and side projects" },
      { value: "learn",         label: "Learn for fun",    desc: "I just love building things" },
    ],
  },
  {
    id: "background",
    question: "What's your background?",
    options: [
      { value: "student",         label: "Student",          desc: "Currently in school or bootcamp" },
      { value: "working_dev",     label: "Working dev",      desc: "Already working in tech" },
      { value: "career_changer",  label: "Career changer",   desc: "Transitioning from another field" },
      { value: "self_taught",     label: "Self-taught",      desc: "Learned on my own outside school" },
    ],
  },
];

export default function TrackOnboardingPanel({ track, onClose, onStart }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const selected = answers[current.id];

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (!selected) return;
    if (isLast) {
      onStart({ ...answers, track });
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
        style={{ backgroundColor: "#0d0d0d", borderLeft: "1px solid #1f1f1f" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-purple-500 uppercase">
              // START PATH
            </p>
            <p className="text-[14px] font-semibold text-white mt-0.5">{track?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 pt-5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className="h-0.5 flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i <= step ? "#9333ea" : "#2a2a2a" }}
            />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 px-6 pt-6 pb-4 overflow-y-auto"
          >
            <p className="text-[18px] font-semibold text-white mb-6 leading-snug">
              {current.question}
            </p>

            <div className="space-y-2.5">
              {current.options.map((opt) => {
                const isChosen = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 cursor-pointer"
                    style={{
                      backgroundColor: isChosen ? "#1a0f2e" : "#141414",
                      border: `1px solid ${isChosen ? "#9333ea" : "#2a2a2a"}`,
                    }}
                  >
                    <p className="text-[13px] font-semibold" style={{ color: isChosen ? "#e5e5e5" : "#aaa" }}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: isChosen ? "#888" : "#555" }}>
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderTop: "1px solid #1a1a1a" }}>
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-white transition-colors disabled:opacity-0 cursor-pointer"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              backgroundColor: selected ? "#9333ea" : "#1a1a1a",
              color: selected ? "#fff" : "#444",
              cursor: selected ? "pointer" : "default",
            }}
          >
            {isLast ? "Start path" : "Next"}
            <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
