import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConnectorContext } from "./connectorContextObject";

// Desktop-tree connector system: cards register their real DOM node under a
// stable id, connections declare which two ids they join, and every path is
// computed from actual getBoundingClientRect() measurements — never assumed
// card heights. A single ResizeObserver watches every registered node (title
// wraps, badge rows wrapping, hover-expand, etc. all trigger it), so paths
// stay attached to real card edges instead of drifting out of sync.
export const ConnectorProvider = ({ children, className }) => {
  const containerRef = useRef(null);
  const nodesRef = useRef(new Map()); // id -> HTMLElement
  const connectionsRef = useRef(new Map()); // id -> { fromId, toId, dashed, color, strokeWidth }
  const [paths, setPaths] = useState({});
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef(null);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const originX = containerRect.left - container.scrollLeft;
    const originY = containerRect.top - container.scrollTop;

    const nextPaths = {};
    connectionsRef.current.forEach((conn, id) => {
      const fromEl = nodesRef.current.get(conn.fromId);
      const toEl = nodesRef.current.get(conn.toId);
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const fromOnLeft = fromRect.left <= toRect.left;

      const x1 = (fromOnLeft ? fromRect.right : fromRect.left) - originX;
      const y1 = fromRect.top + fromRect.height / 2 - originY;
      const x2 = (fromOnLeft ? toRect.left : toRect.right) - originX;
      const y2 = toRect.top + toRect.height / 2 - originY;

      const bend = Math.max(Math.abs(x2 - x1) * 0.5, 20);
      const c1x = x1 + (fromOnLeft ? bend : -bend);
      const c2x = x2 + (fromOnLeft ? -bend : bend);

      nextPaths[id] = { d: `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`, ...conn };
    });

    setPaths(nextPaths);
    setSvgSize({ width: container.scrollWidth, height: container.scrollHeight });
  }, []);

  const scheduleRecompute = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(recompute);
  }, [recompute]);

  const resizeObserverRef = useRef(null);
  const getResizeObserver = () => {
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => scheduleRecompute());
    }
    return resizeObserverRef.current;
  };

  const registerNode = useCallback((id, el) => {
    const prev = nodesRef.current.get(id);
    if (prev && prev !== el) getResizeObserver().unobserve(prev);

    if (el) {
      nodesRef.current.set(id, el);
      getResizeObserver().observe(el);
    } else {
      nodesRef.current.delete(id);
    }
    scheduleRecompute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleRecompute]);

  const registerConnection = useCallback((id, conn) => {
    connectionsRef.current.set(id, conn);
    scheduleRecompute();
    return () => {
      connectionsRef.current.delete(id);
      scheduleRecompute();
    };
  }, [scheduleRecompute]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    getResizeObserver().observe(container);

    const onWindowResize = () => scheduleRecompute();
    window.addEventListener("resize", onWindowResize);

    // Fonts loading after first paint change every text metric the layout
    // depends on — recompute once they've actually settled.
    if (document.fonts?.ready) document.fonts.ready.then(scheduleRecompute).catch(() => {});

    const onScroll = () => scheduleRecompute();
    container.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onWindowResize);
      container.removeEventListener("scroll", onScroll);
      resizeObserverRef.current?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ containerRef, registerNode, registerConnection }),
    [registerNode, registerConnection],
  );

  return (
    <ConnectorContext.Provider value={value}>
      <div ref={containerRef} className={className} style={{ position: "relative" }}>
        {children}
        <svg
          width={svgSize.width}
          height={svgSize.height}
          className="pointer-events-none absolute top-0 left-0"
          style={{ overflow: "visible" }}
        >
          {Object.entries(paths).map(([id, p]) => (
            <path
              key={id}
              d={p.d}
              fill="none"
              stroke={p.color ?? "#404040"}
              strokeWidth={p.strokeWidth ?? 1.5}
              strokeDasharray={p.dashed ? "5 4" : "none"}
              opacity={p.opacity ?? 0.6}
            />
          ))}
        </svg>
      </div>
    </ConnectorContext.Provider>
  );
};
