// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "motion/react";

// AnimatePresence must stay mounted and wrap the condition — if it's inside
// the conditional it unmounts together with the panel and the exit animation
// never plays.
const DropdownPanel = ({ open, id, className = "", children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        id={id}
        initial={{ opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`absolute top-full z-40 overflow-hidden rounded-md border border-white/10 bg-neutral-900 shadow-lg shadow-black/40 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default DropdownPanel;
