import { getBezierPath, getSmoothStepPath } from "@xyflow/react";
import { memo } from "react";

const GlowEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data = {},
}) => {
  const { active = false, variant = "bezier" } = data;

  const pathFn = variant === "smoothstep" ? getSmoothStepPath : getBezierPath;
  const [edgePath] = pathFn({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  const gradId = `grad-${id}`;
  const filterId = `glow-${id}`;
  const animId = `comet-${id}`;

  if (!active) {
    return (
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(80,80,100,0.35)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
    );
  }

  return (
    <g>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
          x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(139,92,246,0.25)"
        strokeWidth={6}
        filter={`url(#${filterId})`}
      />

      {/* main stroke */}
      <path
        id={animId}
        d={edgePath}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={2}
      />

      {/* comet dot */}
      <circle r={3} fill="#c084fc" filter={`url(#${filterId})`}>
        <animateMotion dur="2.4s" repeatCount="indefinite" calcMode="spline"
          keyTimes="0;1" keySplines="0.4 0 0.6 1">
          <mpath href={`#${animId}`} />
        </animateMotion>
      </circle>
    </g>
  );
});

export default GlowEdge;
