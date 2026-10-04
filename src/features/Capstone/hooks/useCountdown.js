import { useEffect, useRef, useState } from "react";

/**
 * Seconds left on a server-side timer.
 *
 * Built from the server's `secondsLeft`, not its `deadline`: an absolute
 * timestamp would be compared against the learner's own clock, which can be
 * minutes off. Converting "N seconds left" into a local end time at the moment
 * the response arrives removes clock skew entirely.
 *
 * @param {number|null} secondsLeft  from the server; null = no timer
 * @param {string} key  resets the timer when it changes (e.g. the question id)
 * @param {() => void} onExpire  called once when the timer reaches 0
 */
export default function useCountdown(secondsLeft, key, onExpire) {
  const [left, setLeft] = useState(secondsLeft ?? 0);
  const expireRef = useRef(onExpire);
  useEffect(() => {
    expireRef.current = onExpire;
  });

  useEffect(() => {
    if (secondsLeft == null) return undefined;
    const endsAt = Date.now() + secondsLeft * 1000;
    let fired = false;
    const tick = () => {
      const next = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
      setLeft(next);
      if (next === 0 && !fired) {
        fired = true;
        expireRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // `key` restarts the timer for a new question even if secondsLeft repeats.
  }, [secondsLeft, key]);

  return left;
}
