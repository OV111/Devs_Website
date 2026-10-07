import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
  AnimatePresence,
  MotionConfig,
} from "motion/react";
import { Reveal } from "../../components/motion/Reveal.jsx";
import { useReveal } from "../../components/motion/useReveal.js";
import "./foundations-theme.css";
import { buildFoundations, FOUNDATIONS_FAQ } from "./foundationsData.js";

const GROUP_FILTERS = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "eng", label: "Engineering" },
  { id: "ai", label: "AI era" },
];
const LEVEL_FILTERS = ["beginner", "medium", "hard"];

// One entry per group = one section. Order here is the order on the page.
const SECTIONS = [
  {
    id: "ai",
    eyebrow: "New",
    title: "Skills for the AI era",
    sub: "Work that exists because AI now writes code.",
  },
  {
    id: "core",
    eyebrow: "Core",
    title: "Core fundamentals",
    sub: "What every developer needs, and why it matters more now.",
  },
  {
    id: "eng",
    eyebrow: "Engineering",
    title: "Beyond the code",
    sub: "System design, architecture and the habits that keep real software running.",
  },
];

const EASE = [0.22, 1, 0.36, 1];
const CARD_STAGGER = 0.08; // seconds between neighbours in a row
const COLUMNS = 3; // matches the grid on desktop; extra delay on narrow screens is harmless

function FoundationCard({ card, index }) {
  // Cards are individually observed (the grid is too tall for one 20% trigger on
  // phones), so the 80ms stagger comes from each card's position in its row.
  const reveal = useReveal({ delay: (index % COLUMNS) * CARD_STAGGER });
  return (
    <motion.article
      layout
      {...reveal}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      whileHover={{ y: -4 }}
      transition={{
        ...reveal.transition,
        layout: { duration: 0.35, ease: EASE },
      }}
      className={`f-card ${card.group === "ai" ? "f-card-ai" : ""}`}
    >
      <div className="f-card-top">
        <span className="f-icon" aria-hidden="true">
          {card.icon}
        </span>
        <span className="f-card-tags" style={{ display: "flex", gap: 6 }}>
          {card.group === "ai" && <span className="f-tag f-tag-ai">AI era</span>}
          {card.group === "eng" && <span className="f-tag">Engineering</span>}
          <span className={`f-tag f-tag-${card.difficulty}`}>
            {card.difficulty}
          </span>
        </span>
      </div>
      <h3 className="f-card-title">{card.title}</h3>
      <p className="f-card-desc">{card.desc}</p>
      {card.aiNote && (
        <p className="f-ai-note">
          <b>In the AI era</b>
          {card.aiNote}
        </p>
      )}
    </motion.article>
  );
}

// layoutId makes one background slide between pills instead of blinking.
function FilterPill({ active, onClick, layoutGroup, children }) {
  return (
    <button
      type="button"
      className="f-pill"
      aria-pressed={active}
      onClick={onClick}
    >
      {active && (
        <motion.span
          layoutId={layoutGroup}
          className="f-pill-bg"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="f-pill-label">{children}</span>
    </button>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal.Item className="f-faq-item">
      <button
        type="button"
        className="f-faq-q"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{item.q}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 22, lineHeight: 1 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p className="f-faq-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal.Item>
  );
}

export default function FoundationsPage() {
  const [group, setGroup] = useState("all");
  const [level, setLevel] = useState(null);

  const cards = useMemo(() => buildFoundations(), []);
  const visible = useMemo(
    () =>
      cards.filter(
        (c) =>
          (group === "all" || c.group === group) &&
          (!level || c.difficulty === level),
      ),
    [cards, group, level],
  );

  return (
    // reducedMotion="user" also covers the hover lift and layout moves; the
    // Reveal helpers check useReducedMotion themselves because "user" only
    // disables transforms, not opacity.
    <MotionConfig reducedMotion="user">
      <div className="foundations-theme">
        <div className="f-wrap">
          <Reveal as="header" className="f-hero" stagger={0.1} onLoad>
            <Reveal.Item as="span" className="f-eyebrow">
              <span className="f-dot" /> Free · No account needed
            </Reveal.Item>
            <Reveal.Item as="h1" className="f-display">
              The foundations every developer still needs.
            </Reveal.Item>
            <Reveal.Item as="p" className="f-lede">
              AI writes the surface. Learn what is underneath, plus the new
              skills to direct, review and trust what AI builds.
            </Reveal.Item>
            <Reveal.Item className="f-actions">
              <a href="#core" className="f-btn f-btn-primary">
                Start learning
              </a>
              <Link to="/roadmaps" className="f-btn f-btn-ghost">
                Browse roadmaps
              </Link>
            </Reveal.Item>
            <Reveal.Item as="p" className="f-meta">
              {cards.length} topics | Core, Engineering, AI era | Free forever
            </Reveal.Item>
          </Reveal>

          <div className="f-filters" role="group" aria-label="Filter foundations">
            {GROUP_FILTERS.map((f) => (
              <FilterPill
                key={f.id}
                layoutGroup="f-group-pill"
                active={group === f.id}
                onClick={() => setGroup(f.id)}
              >
                {f.label}
              </FilterPill>
            ))}
            <span className="f-divider" aria-hidden="true" />
            {LEVEL_FILTERS.map((l) => (
              <FilterPill
                key={l}
                layoutGroup="f-level-pill"
                active={level === l}
                onClick={() => setLevel(level === l ? null : l)}
              >
                {l}
              </FilterPill>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="f-empty">Nothing matches those filters.</p>
          )}

          {SECTIONS.map((s) => {
            const items = visible.filter((c) => c.group === s.id);
            if (items.length === 0) return null;
            return (
              <section key={s.id} id={s.id} className="f-section">
                <Reveal>
                  <p className="f-section-eyebrow">{s.eyebrow}</p>
                  <h2 className="f-section-title">{s.title}</h2>
                  <p className="f-section-sub">{s.sub}</p>
                </Reveal>
                <div className="f-grid">
                  <AnimatePresence mode="popLayout">
                    {items.map((c, i) => (
                      <FoundationCard key={c.title} card={c} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}

          <section className="f-section">
            <Reveal>
              <p className="f-section-eyebrow">FAQ</p>
              <h2 className="f-section-title">Questions</h2>
            </Reveal>
            <Reveal stagger={0.08} amount={0.1} style={{ marginTop: 24 }}>
              {FOUNDATIONS_FAQ.map((item) => (
                <FaqItem key={item.q} item={item} />
              ))}
            </Reveal>
          </section>

          <Reveal className="f-cta">
            <h2 className="f-section-title">Ready to go deeper?</h2>
            <p className="f-section-sub">
              Pick a roadmap and earn each layer with a graded exam.
            </p>
            <Link to="/roadmaps" className="f-btn f-btn-primary">
              Pick a roadmap
            </Link>
          </Reveal>
        </div>
      </div>
    </MotionConfig>
  );
}
