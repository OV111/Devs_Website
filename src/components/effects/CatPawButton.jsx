import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react"; // eslint-disable-line no-unused-vars

const W = 170;
const H = 70;
const CX = W / 2;
const CY = H / 2;

// Precompute parametric keyframes for an ellipse
const orbitKeyframes = (rx, ry, steps = 80) => {
  const cx = [];
  const cy = [];
  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    cx.push(parseFloat((rx * Math.cos(t)).toFixed(2)));
    cy.push(parseFloat((ry * Math.sin(t)).toFixed(2)));
  }
  return { cx, cy };
};

const RINGS = [
  { rx: 62, ry: 12, tilt: -15, color: "#a78bfa", dotR: 4,   dur: 3.6 },
  { rx: 56, ry: 18, tilt: 28,  color: "#38bdf8", dotR: 3,   dur: 5.2 },
  { rx: 48, ry: 9,  tilt: 8,   color: "#f472b6", dotR: 2.5, dur: 2.8 },
];

const CatPawButton = ({ className }) => {
  const [hovered, setHovered] = useState(false);

  const keyframes = useMemo(
    () => RINGS.map(({ rx, ry }) => orbitKeyframes(rx, ry)),
    []
  );

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ overflow: "visible" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Orbital SVG — centered over the button */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "visible",
        }}
      >
        <defs>
          {RINGS.map(({ color: _c }, i) => ( // eslint-disable-line no-unused-vars
            <filter key={i} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={hovered ? "2.5" : "1.5"} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        <g transform={`translate(${CX}, ${CY})`}>
          {RINGS.map(({ rx, ry, tilt, color, dotR, dur }, i) => (
            <g key={i} transform={`rotate(${tilt})`}>
              {/* Orbit ring line */}
              <motion.ellipse
                cx={0}
                cy={0}
                rx={rx}
                ry={ry}
                fill="none"
                stroke={color}
                strokeWidth={0.8}
                strokeDasharray="5 4"
                animate={{ opacity: hovered ? 0.7 : 0.25 }}
                transition={{ duration: 0.4 }}
              />

              {/* Orbiting dot */}
              <motion.circle
                r={dotR}
                fill={color}
                filter={`url(#glow-${i})`}
                animate={{
                  cx: keyframes[i].cx,
                  cy: keyframes[i].cy,
                }}
                transition={{
                  duration: dur,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
              />
            </g>
          ))}
        </g>
      </svg>

      <NavLink
        to="ai-agent"
        className={
          className ||
          (({ isActive }) => (isActive ? "text-emerald-500" : "text-cyan-500/80"))
        }
      >
        AI-Agent
      </NavLink>
    </div>
  );
};

export default CatPawButton;
