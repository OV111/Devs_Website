import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig, useInView } from "motion/react";
import { Map as MapIcon, BookOpen, Lock, LockOpen, Target } from "lucide-react";

// The core loop from VISION.md §3, cut to one line per step: the animation
// carries the story (a path that unlocks as you go), the copy just labels it.
const STEPS = [
  { title: "Pick a path", body: "Choose your track.", icon: MapIcon },
  { title: "Study the layer", body: "Learn what it covers.", icon: BookOpen },
  { title: "Pass the exam", body: "Unlock the next layer.", unlocks: true },
  { title: "Fix weak spots", body: "Your mentor helps you retry.", icon: Target },
];

const STEP_DELAY = 0.25; // seconds between each step appearing
const LINE_DURATION = STEPS.length * STEP_DELAY;

// The exam step shows both icons stacked and crossfades between them. Both
// stay mounted, so there's no exit/enter handoff that can stall mid-way.
const IconSwap = ({ unlocked }) => (
  <span className="relative block h-5 w-5">
    <motion.span
      className="absolute inset-0"
      animate={{ opacity: unlocked ? 0 : 1, scale: unlocked ? 0.6 : 1 }}
      transition={{ duration: 0.25 }}
    >
      <Lock size={20} />
    </motion.span>
    <motion.span
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: unlocked ? 1 : 0, scale: unlocked ? 1 : 0.6 }}
      transition={{ duration: 0.25 }}
    >
      <LockOpen size={20} />
    </motion.span>
  </span>
);

const StepIcon = ({ step, unlocked }) => {
  const Icon = step.icon;
  const isOpen = step.unlocks && unlocked;
  return (
    <span
      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-black transition-colors duration-500 ${
        isOpen
          ? "border-purple-500 text-purple-400 shadow-[0_0_24px_-4px_rgba(168,85,247,0.6)]"
          : "border-neutral-700 text-neutral-300"
      }`}
    >
      {step.unlocks ? <IconSwap unlocked={unlocked} /> : <Icon size={20} />}
    </span>
  );
};

const HowItWorks = () => {
  const ref = useRef(null);
  // `once` so the sequence plays the first time the section is seen, then stays.
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [unlocked, setUnlocked] = useState(false);

  // The lock opens just after the progress line reaches the exam step.
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setUnlocked(true), (3 * STEP_DELAY + 0.4) * 1000);
    return () => clearTimeout(id);
  }, [inView]);

  return (
    // reducedMotion="user": people with "reduce motion" turned on in their OS
    // get the end state without the movement.
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        ref={ref}
        // scroll-mt keeps the heading clear of the sticky navbar.
        className="mx-auto max-w-5xl scroll-mt-[calc(var(--navbar-h,56px)+24px)] px-6 py-24"
      >
        <h2 className="text-center text-3xl font-[450] tracking-tight text-white">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-neutral-400">
          A roadmap you earn, not one you scroll past.
        </p>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-4 sm:gap-6">
          {/* Track + progress line. Horizontal through the icon centres on
              desktop (12.5% = half a column in from each edge), vertical on
              mobile. The purple fill "draws" across as the section enters. */}
          <div className="absolute top-6 left-6 h-[calc(100%-3rem)] w-px bg-neutral-800 sm:right-[12.5%] sm:left-[12.5%] sm:h-px sm:w-auto">
            <motion.div
              className="h-full w-full origin-top bg-purple-500/70 sm:origin-left"
              initial={{ scaleX: 0, scaleY: 0 }}
              animate={inView ? { scaleX: 1, scaleY: 1 } : {}}
              transition={{ duration: LINE_DURATION, ease: "easeInOut" }}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative flex items-center gap-4 sm:flex-col sm:text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * STEP_DELAY }}
            >
              <StepIcon step={step} unlocked={unlocked} />
              <div>
                <h3 className="text-base font-medium text-neutral-100">{step.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: LINE_DURATION, duration: 0.4 }}
        >
          <Link
            to="/roadmaps"
            className="rounded-full bg-neutral-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Browse the roadmaps →
          </Link>
        </motion.div>
      </section>
    </MotionConfig>
  );
};

export default HowItWorks;
