import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delay` ms. Used for
// search-as-you-type: one request after the user pauses, not one per keystroke.
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
