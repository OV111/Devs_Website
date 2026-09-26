import { useState } from "react";
import { motion as Motion } from "framer-motion";
import useCounter from "../../hooks/useCounter";

export default function StatCell({ value, unit, label, sub, index }) {
  const [started, setStarted] = useState(false);
  const prefix = value.startsWith("#") ? "#" : "";
  const numericTarget = parseInt(value.replace("#", ""), 10);
  const count = useCounter(numericTarget, 1800, started);

  return (
    <Motion.div
      className="px-4 py-4 flex flex-col gap-1"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
      onViewportEnter={() => setStarted(true)}
    >
      <p className="flex items-baseline gap-0 text-2xl font-bold leading-none text-[#e5e5e5]">
        <span
          className="tabular-nums inline-block"
          style={{ minWidth: `${(prefix + String(numericTarget)).length}ch` }}
        >
          {prefix}
          {count}
        </span>
        {unit && <span className="text-base">{unit}</span>}
      </p>
      <p className="text-[9px] font-bold tracking-widest uppercase mt-1 text-[#444]">
        {label}
      </p>
      <p className="text-[11px] text-green-400">{sub}</p>
    </Motion.div>
  );
}
