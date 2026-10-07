import { Link } from "react-router-dom";
import { motion as Motion } from "motion/react";
import { Lock, Target, Bot, Check, Github } from "lucide-react";

// Copy follows VISION.md (problem → solution → who it's for). Everything on
// this page must be true today: no invented user counts, no placeholder
// socials, and roadmap items only for work that's built or actually planned.

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay },
});

const PILLARS = [
  {
    icon: Lock,
    title: "Roadmaps you have to earn",
    body: "Every layer is locked until you pass a server-graded exam on the one before it. No checkbox to tick, no skipping ahead.",
  },
  {
    icon: Target,
    title: "Your weak spots, not a score",
    body: "Fail an exam and you see exactly which topics you missed, so you review those instead of starting over.",
  },
  {
    icon: Bot,
    title: "A mentor that knows your journey",
    body: "The AI mentor can see your path, exam history and weak spots. It guides you to the answer instead of handing it over.",
  },
];

const AUDIENCE = [
  "Self-taught developers who want proof they're job-ready",
  "Career switchers and bootcamp grads filling gaps in what they learned",
  "Early-career devs who want an honest signal of what they don't know yet",
];

const STATUS = [
  {
    done: true,
    label: "Gated roadmaps",
    desc: "Layer-by-layer paths with progress tracking.",
  },
  {
    done: true,
    label: "Exams & weak spots",
    desc: "Server-graded exams that record what you missed.",
  },
  {
    done: true,
    label: "AI mentor",
    desc: "Grounded in your progress, exam history and weak spots.",
  },
  {
    done: true,
    label: "Coding challenges",
    desc: "Practice problems you solve in the browser.",
  },
  {
    done: false,
    label: "More exam-ready paths",
    desc: "Backend is first; more paths get full exams next.",
  },
  {
    done: false,
    label: "Teach-back",
    desc: "Explain a topic out loud and get graded on your understanding.",
  },
];

const SectionTitle = ({ children }) => (
  <Motion.h2
    className="text-center text-3xl font-[450] tracking-tight text-white"
    {...fadeUp()}
  >
    {children}
  </Motion.h2>
);

const About = () => (
  <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12 sm:gap-28 sm:px-6 sm:py-20">
    {/* Hero */}
    <section className="flex flex-col items-center gap-6 text-center">
      <Motion.span
        className="text-sm font-medium text-neutral-400"
        {...fadeUp()}
      >
        About Vahoha
      </Motion.span>
      <Motion.h1
        className="max-w-2xl text-3xl leading-tight font-[450] tracking-tight text-balance text-white sm:text-5xl"
        style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
        {...fadeUp(0.1)}
      >
        Learning that won&apos;t let you fake it.
      </Motion.h1>
      <Motion.p
        className="max-w-2xl text-lg leading-relaxed text-neutral-300"
        {...fadeUp(0.2)}
      >
        Courses, tutorials and roadmaps all share one gap: nothing checks
        whether you actually understood. You can finish them all and only find
        out what you missed in an interview. Vahoha closes that gap.
      </Motion.p>
    </section>

    {/* What makes it different */}
    <section className="flex flex-col gap-10">
      <SectionTitle>How Vahoha is different</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }, i) => (
          <Motion.div
            key={title}
            className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6"
            {...fadeUp(i * 0.1)}
          >
            <Icon size={20} className="text-purple-400" />
            <h3 className="mt-4 text-base font-medium text-neutral-100">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {body}
            </p>
          </Motion.div>
        ))}
      </div>
    </section>

    {/* Who it's for */}
    <section className="flex flex-col gap-10">
      <SectionTitle>Who it&apos;s for</SectionTitle>
      <ul className="mx-auto flex max-w-xl flex-col gap-3">
        {AUDIENCE.map((line, i) => (
          <Motion.li
            key={line}
            className="flex items-start gap-3 text-neutral-300"
            {...fadeUp(i * 0.08)}
          >
            <Check size={18} className="mt-0.5 shrink-0 text-purple-400" />
            {line}
          </Motion.li>
        ))}
      </ul>
    </section>

    {/* Honest build status */}
    <section className="flex flex-col gap-10">
      <SectionTitle>Where we are</SectionTitle>
      <ol className="mx-auto flex w-full max-w-xl flex-col gap-5 border-l border-neutral-800 pl-6">
        {STATUS.map(({ done, label, desc }, i) => (
          <Motion.li key={label} className="relative" {...fadeUp(i * 0.06)}>
            <span
              className={`absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full ${
                done ? "bg-purple-400" : "border border-neutral-600 bg-black"
              }`}
            />
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-100">
              {label}
              {!done && (
                <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-400">
                  Next
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{desc}</p>
          </Motion.li>
        ))}
      </ol>
    </section>

    {/* Built in public + CTA */}
    <Motion.section
      className="flex flex-col items-center gap-6 rounded-3xl border border-neutral-800 bg-neutral-950 px-5 py-10 text-center sm:px-6 sm:py-12"
      {...fadeUp()}
    >
      <h2 className="text-2xl font-[450] tracking-tight text-white sm:text-3xl">
        Built in public
      </h2>
      <p className="max-w-lg text-neutral-400">
        Vahoha is free during beta and built by a solo developer. Early users
        shape what gets built next, so tell us what works and what doesn&apos;t.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/get-started"
          className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          Get Started →
        </Link>
        <a
          href="https://github.com/OV111"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-neutral-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          <Github size={16} />
          GitHub
        </a>
        <Link
          to="/contact"
          className="rounded-full px-5 py-3 text-sm font-medium text-neutral-300 transition hover:text-white"
        >
          Contact
        </Link>
      </div>
    </Motion.section>
  </div>
);

export default About;
