import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, X, ExternalLink, Github, Star, Clock, Tag } from "lucide-react";
import GradientText from "@/components/effects/GradientText";

const TAGS = ["All", "Frontend", "Fullstack", "Backend", "AI/ML", "Mobile", "DevOps"];

const PROJECTS = [
  {
    id: 1,
    title: "AI-Powered Code Review Tool",
    author: "Sarah K.",
    avatar: "SK",
    tag: "AI/ML",
    description:
      "A GitHub bot that automatically reviews pull requests using GPT-4, flags security issues, and suggests refactors with inline comments.",
    stack: ["Python", "FastAPI", "OpenAI", "GitHub Actions"],
    stars: 128,
    duration: "6 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: 2,
    title: "Real-Time Collaborative Editor",
    author: "James M.",
    avatar: "JM",
    tag: "Fullstack",
    description:
      "Google Docs-style collaborative editor with operational transforms, presence cursors, and offline-first sync via CRDTs.",
    stack: ["React", "Node.js", "Socket.io", "PostgreSQL"],
    stars: 94,
    duration: "8 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    author: "Amir T.",
    avatar: "AT",
    tag: "Fullstack",
    description:
      "Production-grade store with Stripe payments, inventory management, admin dashboard, and email notifications.",
    stack: ["Next.js", "Stripe", "Prisma", "Tailwind"],
    stars: 76,
    duration: "10 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: 4,
    title: "DevOps Monitoring Dashboard",
    author: "Lena R.",
    avatar: "LR",
    tag: "DevOps",
    description:
      "Grafana-style metrics dashboard that aggregates Prometheus data, supports alerting rules, and auto-scales infra via Terraform.",
    stack: ["Go", "Prometheus", "Terraform", "React"],
    stars: 61,
    duration: "5 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: 5,
    title: "Mobile Fitness Tracker",
    author: "Chris P.",
    avatar: "CP",
    tag: "Mobile",
    description:
      "Cross-platform app with workout logging, progress charts, AI-generated training plans, and HealthKit integration.",
    stack: ["React Native", "Expo", "Supabase", "OpenAI"],
    stars: 88,
    duration: "7 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: 6,
    title: "GraphQL API Gateway",
    author: "Nina V.",
    avatar: "NV",
    tag: "Backend",
    description:
      "Schema-stitched API gateway that federates 5 microservices, handles auth, rate-limiting, and request tracing.",
    stack: ["Node.js", "Apollo", "Redis", "Docker"],
    stars: 52,
    duration: "4 weeks",
    liveUrl: "#",
    repoUrl: "#",
  },
];

const FadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

function ProjectCard({ project }) {
  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-purple-700/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-700/30 border border-purple-700/50 flex items-center justify-center text-xs font-bold text-purple-300">
            {project.avatar}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">{project.title}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">{project.author}</p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-purple-600/15 text-purple-400 border border-purple-700/30">
          {project.tag}
        </span>
      </div>

      <p className="text-[12px] text-neutral-400 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-400"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
        <div className="flex items-center gap-4 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <Star size={11} className="text-yellow-500" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {project.duration}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={project.repoUrl}
            className="p-1.5 rounded-lg border border-neutral-700 hover:border-purple-500/50 hover:bg-purple-600/10 transition-colors text-neutral-400 hover:text-purple-400"
          >
            <Github size={13} />
          </a>
          <a
            href={project.liveUrl}
            className="p-1.5 rounded-lg border border-neutral-700 hover:border-purple-500/50 hover:bg-purple-600/10 transition-colors text-neutral-400 hover:text-purple-400"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </Motion.div>
  );
}

export default function CapstonePage() {
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PROJECTS.filter((p) => {
    const matchTag = activeTag === "All" || p.tag === activeTag;
    const matchSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen text-white px-4 pb-20">
      {/* Hero */}
      <div className="max-w-4xl pt-20 pl-12 pb-12 text-start">
        <Motion.div {...FadeUp(0)}>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-purple-400 border border-purple-700/40 bg-purple-600/10 px-3 py-1 rounded-full mb-5">
            <Tag size={10} />
            Capstone Projects
          </span>
        </Motion.div>
        <Motion.h1
          {...FadeUp(0.08)}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
        >
          <GradientText className="font-bold">Ship real projects.</GradientText>
          Prove what you know.
        </Motion.h1>
        <Motion.p
          {...FadeUp(0.16)}
          className="text-neutral-400 text-sm sm:text-base max-w-xl "
        >
          Capstone projects are full-scope builds that demonstrate mastery.
          Browse what the community has shipped — or submit your own.
        </Motion.p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <div className="relative w-full sm:max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, stacks…"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-8 pr-8 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/60 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                activeTag === tag
                  ? "bg-purple-600/20 border-purple-500/60 text-purple-300"
                  : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-purple-500/40 hover:text-neutral-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <Motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </Motion.div>
          ) : (
            <Motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 text-neutral-600 text-sm"
            >
              No projects match your search.
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
