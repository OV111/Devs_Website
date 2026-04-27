import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GradientText from "../components/effects/GradientText";
import ShinyText from "../components/effects/ShinyText";
import { CATEGORY_OPTIONS2 } from "../../constants/Categories";

// ── Animated counter ──────────────────────────────────────────────────────────
function useCounter(target, duration = 2000, active = false) {
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

function StatCard({ value, label, suffix = "+", delay = 0 }) {
  const [started, setStarted] = useState(false);
  const count = useCounter(value, 2000, started);
  return (
    <motion.div
      className="flex flex-col items-center gap-2 p-6 rounded-2xl
        bg-white/60 dark:bg-white/5
        border border-fuchsia-100 dark:border-fuchsia-900/40
        shadow-sm backdrop-blur"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
      onViewportEnter={() => setStarted(true)}
    >
      <span className="text-4xl md:text-5xl font-bold text-fuchsia-700 dark:text-fuchsia-400">
        {count}
        {suffix}
      </span>
      <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium text-center">
        {label}
      </span>
    </motion.div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, delay },
});

const features = [
  {
    icon: "📖",
    title: "Read",
    desc: "Browse curated technical content organised by specialisation. From quick tips to deep-dives — find what you need, when you need it.",
    gradient: "from-purple-500/10 to-fuchsia-500/10 dark:from-purple-900/20 dark:to-fuchsia-900/20",
    border: "border-purple-200 dark:border-purple-800/40",
    badge: "Available now",
  },
  {
    icon: "✍️",
    title: "Write",
    desc: "Share your knowledge with thousands of developers. Publish articles, tutorials, and insights across 12 tech categories.",
    gradient: "from-fuchsia-500/10 to-pink-500/10 dark:from-fuchsia-900/20 dark:to-pink-900/20",
    border: "border-fuchsia-200 dark:border-fuchsia-800/40",
    badge: "Available now",
  },
  {
    icon: "🤝",
    title: "Connect",
    desc: "Follow developers you admire, get followed back, and chat in real-time with your network. Community is at the core.",
    gradient: "from-violet-500/10 to-purple-500/10 dark:from-violet-900/20 dark:to-purple-900/20",
    border: "border-violet-200 dark:border-violet-800/40",
    badge: "Available now",
  },
  {
    icon: "🗂️",
    title: "Create Projects",
    desc: "Showcase what you have built. Share repos, demos, and write-ups so the community can discover, learn from, and contribute to your work.",
    gradient: "from-sky-500/10 to-cyan-500/10 dark:from-sky-900/20 dark:to-cyan-900/20",
    border: "border-sky-200 dark:border-sky-800/40",
    badge: "Coming soon",
  },
  {
    icon: "📚",
    title: "Code Libraries",
    desc: "Publish and browse reusable snippets, hooks, utilities, and mini-libraries tagged by language and framework — copy, adapt, ship faster.",
    gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20",
    border: "border-emerald-200 dark:border-emerald-800/40",
    badge: "Coming soon",
  },
  {
    icon: "🎬",
    title: "Video Explanations",
    desc: "Some concepts click better when you see them. Attach short video walkthroughs to your articles and library entries.",
    gradient: "from-orange-500/10 to-amber-500/10 dark:from-orange-900/20 dark:to-amber-900/20",
    border: "border-orange-200 dark:border-orange-800/40",
    badge: "Coming soon",
  },
  {
    icon: "📝",
    title: "Exams",
    desc: "Test your knowledge with topic-based exams curated by the community. Track your score, review mistakes, and level up your understanding across every specialisation.",
    gradient: "from-rose-500/10 to-pink-500/10 dark:from-rose-900/20 dark:to-pink-900/20",
    border: "border-rose-200 dark:border-rose-800/40",
    badge: "Coming soon",
  },
  {
    icon: "💻",
    title: "Coding Problems",
    desc: "Sharpen your skills with hand-picked coding challenges. Solve problems directly in the browser, compare solutions with other devs, and build real interview confidence.",
    gradient: "from-cyan-500/10 to-sky-500/10 dark:from-cyan-900/20 dark:to-sky-900/20",
    border: "border-cyan-200 dark:border-cyan-800/40",
    badge: "Coming soon",
  },
  {
    icon: "🗺️",
    title: "Roadmaps",
    desc: "Follow structured, community-built learning paths for every specialisation. Know exactly what to learn next and track your progress from beginner to expert.",
    gradient: "from-lime-500/10 to-green-500/10 dark:from-lime-900/20 dark:to-green-900/20",
    border: "border-lime-200 dark:border-lime-800/40",
    badge: "Coming soon",
  },
];

const categoryEmoji = {
  fullstack: "🌐",
  backend: "⚙️",
  mobile: "📱",
  aiml: "🤖",
  qa: "🧪",
  devops: "🚀",
  gamedev: "🎮",
  datascience: "📊",
  cybersecurity: "🔒",
  cloud: "☁️",
  database: "🗄️",
  quantum: "⚛️",
};

const roadmap = [
  { done: true,  label: "Platform Launch",          desc: "DevsFlow goes live with core blog features." },
  { done: true,  label: "7 Tech Categories",         desc: "Organised content across Full Stack, Backend, Mobile, AI & ML, QA, DevOps and Game Dev." },
  { done: true,  label: "User Profiles & Follows",   desc: "Build your dev identity and grow your network." },
  { done: true,  label: "Real-time Chat",            desc: "Instant messaging with mutual connections via WebSocket." },
  { done: false, label: "Code Playground",           desc: "Run and share code snippets directly inside articles." },
  { done: false, label: "Open-Source Integration",   desc: "Link repositories, showcase contributions, and celebrate OSS work." },
  { done: false, label: "Mobile App",                desc: "DevsFlow on iOS & Android — dev content in your pocket." },
];

const socials = [
  {
    label: "GitHub",
    handle: "@devsflow",
    desc: "Star us, fork us, contribute.",
    href: "#",
    color: "from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    handle: "@devsflow_dev",
    desc: "Updates, tips and community highlights.",
    href: "#",
    color: "from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "DevsFlow",
    desc: "Professional updates and articles.",
    href: "#",
    color: "from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const About = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs — same as Home */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-fuchsia-200/50 blur-3xl dark:bg-fuchsia-900/20" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-100/60 blur-3xl dark:bg-purple-900/10" />

      <div className="mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 flex flex-col gap-28">

        {/* ── 1. Hero ────────────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center gap-6">
          <motion.div {...fadeUp(0)}>
            <ShinyText
              text="Developer Community Platform"
              speed={4}
              className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-purple-600"
            />
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <GradientText
              colors={["#8A2BE2", "#FF1493", "#FF00FF", "#9c40ff", "#8A2BE2"]}
              animationSpeed={7}
              showBorder={false}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight px-2"
            >
              Built by Devs, for Devs.
            </GradientText>
          </motion.div>

          <motion.p
            className="max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            {...fadeUp(0.2)}
          >
            DevsFlow is a community-driven platform where developers read, write, and connect.
            Whether you are sharing a deep-dive on system design or looking for your next mentor —
            this is your place.
          </motion.p>

          <motion.div className="flex gap-4 flex-wrap justify-center mt-2" {...fadeUp(0.3)}>
            <Link
              to="/get-started"
              className="bg-fuchsia-700 hover:bg-fuchsia-600 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-700
                px-7 py-2.5 rounded-xl text-sm font-semibold text-white
                border border-fuchsia-600/70 shadow-md
                transition-all duration-200 hover:scale-105"
            >
              Join the Community
            </Link>
            <Link
              to="/categories/fullstack"
              className="bg-fuchsia-100 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:hover:bg-fuchsia-900/50
                px-7 py-2.5 rounded-xl text-sm font-semibold
                text-fuchsia-800 dark:text-fuchsia-200
                border border-fuchsia-300 dark:border-fuchsia-700
                transition-all duration-200 hover:scale-105"
            >
              Explore Content
            </Link>
          </motion.div>
        </section>

        {/* ── 2. What We Offer ───────────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center text-purple-800 dark:text-purple-300"
            {...fadeUp(0)}
          >
            What We Offer
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`relative flex flex-col gap-4 p-7 rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} shadow-sm`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {f.badge && (
                  <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    f.badge === "Coming soon"
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                      : "bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400"
                  }`}>
                    {f.badge}
                  </span>
                )}
                <span className="text-4xl">{f.icon}</span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. Stats ───────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center text-purple-800 dark:text-purple-300"
            {...fadeUp(0)}
          >
            Growing Every Day
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard value={120} label="Articles Published" delay={0} />
            <StatCard value={500} label="Developers Joined"  delay={0.1} />
            <StatCard value={12}  label="Tech Categories"    suffix="" delay={0.2} />
          </div>
        </section>

        {/* ── 4. Categories ──────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center text-purple-800 dark:text-purple-300"
            {...fadeUp(0)}
          >
            12 Specialisations, One Platform
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORY_OPTIONS2.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.06 }}
              >
                <Link
                  to={`/categories/${cat.slug}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl
                    bg-white/70 dark:bg-white/5
                    border border-fuchsia-100 dark:border-fuchsia-900/40
                    shadow-sm hover:shadow-md
                    hover:border-fuchsia-400 dark:hover:border-fuchsia-600
                    transition-all duration-200 group"
                >
                  <span className="text-2xl">{categoryEmoji[cat.id] ?? "💻"}</span>
                  <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-400 transition-colors">
                    {cat.title}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5. Roadmap ─────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center text-purple-800 dark:text-purple-300"
            {...fadeUp(0)}
          >
            Our Roadmap
          </motion.h2>

          <div className="relative flex flex-col pl-8">
            {/* vertical line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-fuchsia-400 via-purple-400 to-violet-300 dark:from-fuchsia-700 dark:via-purple-700 dark:to-violet-600" />

            {roadmap.map((item, i) => (
              <motion.div
                key={i}
                className="relative flex gap-5 pb-8 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                {/* dot */}
                <div
                  className={`absolute -left-5 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                    item.done
                      ? "bg-fuchsia-500 border-fuchsia-400 dark:bg-fuchsia-600 dark:border-fuchsia-500"
                      : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {item.done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${
                        item.done
                          ? "text-fuchsia-700 dark:text-fuchsia-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                    {!item.done && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 font-medium">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 6. Stay Connected ──────────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.div {...fadeUp(0)}>
              <ShinyText text="We build in public" speed={4} className="text-xs sm:text-sm font-semibold tracking-widest uppercase" />
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <GradientText
                colors={["#8A2BE2", "#FF1493", "#FF00FF", "#9c40ff", "#8A2BE2"]}
                animationSpeed={7}
                className="text-3xl sm:text-4xl font-bold"
              >
                Stay Connected
              </GradientText>
            </motion.div>
            <motion.p
              className="text-gray-500 dark:text-gray-400 max-w-lg text-sm sm:text-base"
              {...fadeUp(0.2)}
            >
              Follow us across platforms for updates, articles, behind-the-scenes development, and community highlights.
            </motion.p>
          </div>

          {/* Social cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden
                  bg-white/70 dark:bg-white/5
                  border border-gray-100 dark:border-white/10
                  shadow-sm hover:shadow-xl
                  transition-all duration-300"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${s.color}`} />

                {/* Icon circle */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${s.color} shadow-md`}>
                  {s.icon}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-base">{s.label}</span>
                  <span className="text-xs font-mono text-fuchsia-600 dark:text-fuchsia-400">{s.handle}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>

                {/* Arrow */}
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                  Follow
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Bottom CTA banner */}
          <motion.div
            className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6
              p-8 rounded-3xl
              bg-gradient-to-br from-fuchsia-600 to-violet-700 dark:from-fuchsia-700 dark:to-violet-800
              shadow-xl shadow-fuchsia-500/20 dark:shadow-fuchsia-900/40"
            {...fadeUp(0.3)}
          >
            {/* Background shimmer */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

            <div className="flex flex-col gap-1 text-center sm:text-left z-2">
              <span className="text-white font-bold text-xl sm:text-2xl">Ready to join the community?</span>
              <span className="text-fuchsia-200 text-sm">Start reading, writing, and connecting with developers today.</span>
            </div>
            <Link
              to="/get-started"
              className="z-2 flex-shrink-0 bg-white hover:bg-fuchsia-50 text-fuchsia-700 font-bold
                px-8 py-3 rounded-xl text-sm
                transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Get Started — it&apos;s free
            </Link>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default About;
