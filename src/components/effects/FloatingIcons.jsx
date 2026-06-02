import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import * as TechIcons from "../../icons/techIcon";

const floatingIconsLayoutByCategory =
  TechIcons.floatingIconsLayoutByCategory ?? {};
const techIconRegistry = TechIcons.techIconRegistry ?? {};

function FloatingIcon({ icon, initialX, initialY, duration, delay, size }) {
  return (
    <motion.div
      className="absolute"
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.8 }}
      animate={{
        x: [initialX, initialX + 10, initialX - 15, initialX + 10, initialX],
        y: [initialY, initialY - 10, initialY + 10, initialY - 15, initialY],
        opacity: [0, 1, 1, 1, 1],
        scale: [0.8, 1, 1, 1, 1],
        rotate: [0, 5, -5, 3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
        <div className="relative w-full h-full drop-shadow-2xl">{icon}</div>
      </div>
    </motion.div>
  );
}

const buildIconsForCategory = (category) => {
  const normalizedCategory = String(category ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
  const categoryAliases = {
    "ai&ml": "aiml",
    "ai/ml": "aiml",
    aiml: "aiml",
  };
  const resolvedCategory =
    categoryAliases[normalizedCategory] ?? normalizedCategory;

  const layout =
    floatingIconsLayoutByCategory[resolvedCategory] ??
    floatingIconsLayoutByCategory.fullstack ??
    [];
  return layout
    .map((item) => ({
      ...item,
      Icon: techIconRegistry[item.icon],
    }))
    .filter((item) => Boolean(item.Icon));
};

export function FloatingIcons({ category }) {
  const icons = buildIconsForCategory(category);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" /> */}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {icons.map((item, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y }}
        >
          <FloatingIcon
            icon={<item.Icon className="w-full h-full" />}
            initialX={0}
            initialY={0}
            duration={item.duration}
            delay={item.delay}
            size={item.size}
          />
        </div>
      ))}

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
    </div>
  );
}
