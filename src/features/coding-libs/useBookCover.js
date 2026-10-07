import { useEffect, useRef, useState } from "react";

// Module-level cache: one Google Books request per title per session,
// shared by every card and every remount (tab switches, filter changes).
const coverCache = new Map();

function loadCover(title) {
  if (!coverCache.has(title)) {
    const q = encodeURIComponent(`intitle:${title}`);
    coverCache.set(
      title,
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
        .then((r) => r.json())
        .then((data) => {
          const img = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
          return img ? img.replace("zoom=1", "zoom=3").replace("http:", "https:") : null;
        })
        .catch(() => null),
    );
  }
  return coverCache.get(title);
}

// Only fetches once the card scrolls near the viewport, not 50 requests on mount.
export function useBookCover(title) {
  const ref = useRef(null);
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let live = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadCover(title).then((c) => live && setCover(c));
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [title]);

  return [ref, cover];
}
