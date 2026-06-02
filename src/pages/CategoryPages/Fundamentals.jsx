// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FUNDAMENTALS_CONCEPTS } from "../../../constants/Categories";

export default function Fundamentals() {
  return (
    <div className="min-h-screen px-6 sm:px-10 md:px-20 lg:px-28 py-12 bg-linear-to-br from-amber-50/50 via-white to-orange-50/40 dark:bg-none">
      <div className="pointer-events-none fixed -top-20 -left-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-900/14" />
      <div className="pointer-events-none fixed top-10 -right-8 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-900/12" />

      <div className="mb-10">
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-wide bg-linear-to-r from-amber-600 via-orange-500 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent">
          Fundamentals from A-Z
        </h1>
        <p className="mt-3 text-sm sm:text-base max-w-2xl bg-linear-to-r from-amber-600 via-orange-500 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
          The foundation every developer must own — before frameworks, before
          tools, before anything else.
        </p>
      </div>

      <div className="max-w-4xl mb-14">
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
          Why fundamentals first? <span>(recommended)</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Frameworks change. Languages evolve.
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            {" "}
            AI writes the surface. Fundamentals are what's underneath.
          </span>{" "}
          Libraries get deprecated overnight. But the developer who understands
          underneath{" "}
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            how memory works
          </span>
          ,{" "}
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            why algorithms matter
          </span>
          , and{" "}
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            how the internet actually moves data
          </span>{" "}
          — that developer adapts. Fundamentals are not a beginner topic. They
          are the foundation every really{" "}
          <span className="text-neutral-700 dark:text-neutral-200 font-medium">
            extraordinary developer
          </span>{" "}
          quietly built before anyone was watching.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        {FUNDAMENTALS_CONCEPTS.map((concept, i) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
            className="flex flex-col gap-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{concept.icon}</span>
                <h3 className="font-semibold text-sm sm:text-base text-neutral-800 dark:text-neutral-100">
                  {concept.title}
                </h3>
              </div>
              <span
                className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full capitalize
                ${concept.difficulty === "beginner" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : ""}
                ${concept.difficulty === "medium" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : ""}
                ${concept.difficulty === "hard" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : ""}
              `}
              >
                {concept.difficulty}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {concept.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
