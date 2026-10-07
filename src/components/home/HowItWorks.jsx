import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, MotionConfig, useInView } from "motion/react";
import {
  BookOpen,
  Lock,
  LockOpen,
  Map as MapIcon,
  RotateCcw,
  Target,
  Trophy,
  Layers,
} from "lucide-react";

/**
 * "How it works" as a horizontal path diagram (from the founder's sketch):
 * Pick a path -> branches (your pick is highlighted) -> Study the layer ->
 * Pass the exam -> next layers -> Capstone, with "Fix weak spots" looping back
 * to the exam as a retry.
 *
 * Desktop: nodes sit on a fixed 1000x320 grid (percent positions), an SVG with the
 * same viewBox draws the connectors, so lines and nodes always line up.
 * Mobile: a simple vertical list, because a 5-column diagram does not fit.
 *
 * The layer titles are the real first layers of the "API Developer" track
 * (src/data/roadmaps/backend.json).
 */

const W = 1000;
const H = 320;
const pos = ({ x, y }) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

// Node centres on the 1000x320 grid.
const N = {
  root: { x: 90, y: 160 },
  other1: { x: 290, y: 52 },
  study: { x: 290, y: 160 },
  other2: { x: 290, y: 268 },
  exam: { x: 510, y: 160 },
  fix: { x: 510, y: 268 },
  next: { x: 730, y: 160 },
  capstone: { x: 920, y: 160 },
};

const R = 28; // node circle radius in grid units, so lines stop at the edge

const MOBILE_STEPS = [
  { title: "Pick a path", body: "Choose your track.", icon: MapIcon },
  { title: "Study the layer", body: "Learn what it covers.", icon: BookOpen },
  { title: "Pass the exam", body: "Score 80% to unlock the next layer.", icon: Lock },
  { title: "Fix weak spots", body: "Your mentor helps you retry.", icon: Target },
];

const PURPLE = "rgba(168,85,247,0.8)";
const GREY = "rgba(115,115,115,0.7)";

// Curve from the right edge of one node to the left edge of another.
const curve = (a, b) =>
  `M ${a.x + R} ${a.y} C ${a.x + 90} ${a.y}, ${b.x - 90} ${b.y}, ${b.x - R} ${b.y}`;

function Edge({ d, active = false, dashed = false, inView, delay = 0 }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={active ? PURPLE : GREY}
      strokeWidth="1.5"
      strokeDasharray={dashed ? "4 6" : undefined}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.5 }}
    />
  );
}

function Circle({ at, label, sub, children, active = false, muted = false, inView, delay }) {
  return (
    <motion.div
      className="absolute flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
      style={pos(at)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.35 }}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full border bg-black transition-colors duration-500 ${
          active
            ? "border-purple-500 text-purple-300 shadow-[0_0_28px_-4px_rgba(168,85,247,0.6)]"
            : muted
              ? "border-neutral-800 text-neutral-600"
              : "border-neutral-700 text-neutral-300"
        }`}
      >
        {children}
      </span>
      <span className={`mt-2 text-sm font-medium ${muted ? "text-neutral-500" : "text-neutral-100"}`}>
        {label}
      </span>
      {sub && <span className="mt-0.5 text-xs text-neutral-400">{sub}</span>}
    </motion.div>
  );
}

const HowItWorks = () => {
  const ref = useRef(null);
  // `once` so the sequence plays the first time the section is seen, then stays.
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [unlocked, setUnlocked] = useState(false);

  // The exam's lock opens after the path has drawn to it.
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setUnlocked(true), 1500);
    return () => clearTimeout(id);
  }, [inView]);

  return (
    // reducedMotion="user": people with "reduce motion" on get the end state.
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        ref={ref}
        className="mx-auto max-w-6xl scroll-mt-[calc(var(--navbar-h,56px)+24px)] px-6 py-16 md:py-24"
      >
        <h2 className="text-center text-3xl font-[450] tracking-tight text-white">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-base text-neutral-400">
          A roadmap you earn, not one you scroll past.
        </p>

        {/* Desktop: horizontal path diagram */}
        <div className="relative mx-auto mt-16 hidden aspect-[1000/320] w-full max-w-5xl md:block">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* Root fans out to three paths; yours is the purple one. */}
            <Edge d={curve(N.root, N.other1)} inView={inView} delay={0.2} />
            <Edge d={curve(N.root, N.study)} active inView={inView} delay={0.3} />
            <Edge d={curve(N.root, N.other2)} inView={inView} delay={0.2} />
            <Edge d={curve(N.study, N.exam)} active inView={inView} delay={0.6} />
            {/* The exam leads on to the next layers, and on to the capstone. */}
            <Edge d={curve(N.exam, N.next)} active={unlocked} inView={inView} delay={0.9} />
            <Edge d={curve(N.next, N.capstone)} dashed inView={inView} delay={1.1} />
            {/* Failing sends you down to weak spots, and the retry loops back up. */}
            <Edge
              d={`M ${N.exam.x} ${N.exam.y + R} L ${N.fix.x} ${N.fix.y - R}`}
              dashed
              inView={inView}
              delay={1.0}
            />
            <Edge
              d={`M ${N.fix.x + R} ${N.fix.y} C ${N.fix.x + 130} ${N.fix.y}, ${N.exam.x + 130} ${N.exam.y}, ${N.exam.x + R + 4} ${N.exam.y + 8}`}
              active
              inView={inView}
              delay={1.2}
            />
          </svg>

          <Circle at={N.root} label="Pick a path" sub="Choose your track." inView={inView} delay={0}>
            <MapIcon size={22} aria-hidden="true" />
          </Circle>
          <Circle at={N.other1} label="Other path" muted inView={inView} delay={0.2}>
            <span aria-hidden="true">…</span>
          </Circle>
          <Circle at={N.study} label="Study the layer" sub="Learn what it covers." active inView={inView} delay={0.4}>
            <BookOpen size={22} aria-hidden="true" />
          </Circle>
          <Circle at={N.other2} label="Other path" muted inView={inView} delay={0.2}>
            <span aria-hidden="true">…</span>
          </Circle>
          <Circle
            at={N.exam}
            label="Pass the exam"
            sub="Score 80% to unlock the next layer."
            active={unlocked}
            inView={inView}
            delay={0.7}
          >
            {unlocked ? <LockOpen size={22} aria-hidden="true" /> : <Lock size={22} aria-hidden="true" />}
          </Circle>
          <Circle at={N.fix} label="Fix weak spots" sub="Your mentor helps you retry." inView={inView} delay={1.0}>
            <Target size={22} aria-hidden="true" />
          </Circle>
          <Circle at={N.next} label="Next layer…" sub="10 layers in a track" inView={inView} delay={1.0}>
            <Layers size={22} aria-hidden="true" />
          </Circle>
          <Circle at={N.capstone} label="Capstone" sub="Build and defend a real project." inView={inView} delay={1.2}>
            <Trophy size={22} aria-hidden="true" />
          </Circle>

          <motion.span
            className="absolute flex -translate-x-1/2 items-center gap-1 bg-black px-1.5 text-xs text-purple-300"
            style={{ left: `${((N.exam.x + 128) / W) * 100}%`, top: `${((N.fix.y - 36) / H) * 100}%` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            <RotateCcw size={11} aria-hidden="true" /> retry
          </motion.span>
        </div>

        {/* Mobile: the same four steps as a vertical list */}
        <ol className="mx-auto mt-12 max-w-sm space-y-6 md:hidden">
          {MOBILE_STEPS.map(({ title, body, icon: Icon }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-black text-neutral-300">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-medium text-neutral-100 md:text-base">{title}</h3>
                <p className="mt-0.5 text-base text-neutral-400 md:text-sm">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <Link
            to="/roadmaps"
            className="flex min-h-11 items-center rounded-full bg-white px-6 py-3 text-base leading-[20px] font-medium text-black sm:text-[14px] transition hover:bg-neutral-200"
          >
            Browse the roadmaps →
          </Link>
        </div>
      </section>
    </MotionConfig>
  );
};

export default HowItWorks;
