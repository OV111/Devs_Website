// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
const FloatingLoad = () => {
  return (
    <motion.div
      key="idle"
      className="mt-16 flex flex-col items-center gap-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-purple-400 dark:text-purple-500"
      >
        <ChevronUp size={28} strokeWidth={1.8} />
      </motion.div>
      {/* fix: text now matches ChevronUp direction — both point toward category pills above */}
      <motion.p
        className="text-sm mt-2 text-purple-600 dark:text-neutral-400 tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Pick one above to begin
      </motion.p>
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-purple-700/50  dark:text-purple-500"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FloatingLoad;
