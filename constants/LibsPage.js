export const ACCENT = "#9333ea";

export const PATHS = [
  { label: "backend",      count: 94, active: true },
  { label: "frontend",     count: 76 },
  { label: "full stack",   count: 52 },
  { label: "ai & ml",      count: 31 },
  { label: "devops",       count: 28 },
  { label: "mobile",       count: 19 },
  { label: "data science", count: 24 },
  { label: "game dev",     count: 15 },
  { label: "cybersecurity",count: 20 },
  { label: "cloud",        count: 17 },
  { label: "qa",           count: 12 },
];

export const LAYERS = [
  { label: "1 — fundamentals",      count: 22 },
  { label: "2 — web",               count: 18 },
  { label: "3 — node/express",      count: 14, active: true },
  { label: "4 — databases",         count: 11 },
  { label: "5 — auth",              count: 9 },
  { label: "6 — testing",           count: 8 },
  { label: "7 — security",          count: 11 },
  { label: "8 — system design",     count: 9 },
  { label: "9 — devops / cloud",    count: 14 },
  { label: "10 — algorithms & ds",  count: 16 },
];

export const DIFFICULTIES = [
  { label: "beginner",     count: 112 },
  { label: "intermediate", count: 142, active: true },
  { label: "advanced",     count: 58 },
];

export const PRICES = [
  { label: "free only", count: 218 },
  { label: "paid",      count: 94 },
];

export const RECOMMENDED = [
  { label: "agent picks for you", count: 3,  active: true },
  { label: "community picks",     count: 27 },
];

export const TABS = [
  { key: "all",    label: "all",          count: 312 },
  { key: "books",  label: "books",        count: 49 },
  { key: "docs",   label: "docs",         count: 88 },
  { key: "guides", label: "guides",       count: 124 },
  { key: "sheets", label: "cheat sheets", count: 54 },
];

export const BOOKS = [
  {
    title:  "You Don't Know JS · Async & Performance",
    author: "KYLE SIMPSON",
    pages:  240,
    price:  "FREE",
    tags:   ["ESSENTIAL", "LAYER 3"],
    accent: "#9333ea",
  },
  {
    title:  "Node.js Design Patterns",
    author: "MARIO CASCIARO",
    pages:  608,
    price:  "PAID",
    tags:   ["INTERMEDIATE", "LAYER 3-6"],
    accent: "#facc15",
  },
  {
    title:  "High Performance Browser Networking",
    author: "ILYA GRIGORIK",
    pages:  400,
    price:  "FREE",
    tags:   ["LAYER 2", "ADVANCED"],
    accent: "#60a5fa",
  },
  {
    title:  "Designing Data-Intensive Applications",
    author: "MARTIN KLEPPMANN",
    pages:  590,
    price:  "PAID",
    tags:   ["ADVANCED", "LAYER 4+"],
    accent: "#a78bfa",
  },
  {
    title:  "Eloquent JavaScript",
    author: "MARIJN HAVERBEKE",
    pages:  472,
    price:  "FREE",
    tags:   ["LAYER 1-2", "BEGINNER"],
    accent: "#f87171",
  },
  {
    title:  "The Pragmatic Programmer",
    author: "HUNT & THOMAS",
    pages:  320,
    price:  "PAID",
    tags:   ["ALL PATHS"],
    accent: "#9333ea",
  },
];

export const DOCS_LIST = [
  {
    title: "Node.js — Asynchronous Programming",
    url:   "nodejs.org/docs · The official guide to async, callbacks, promises",
    tags: [
      { label: "LAYER 3",      style: "text-[#555] border-[#2a2a2a]" },
      { label: "INTERMEDIATE", style: "text-[#555] border-[#2a2a2a]" },
      { label: "FREE",         style: "text-purple-500 border-purple-900" },
    ],
  },
  {
    title: "Express — Error Handling",
    url:   "expressjs.com/guide/error-handling.html · the exact thing you're failing on",
    tags: [
      { label: "YOUR WEAK TOPIC", style: "text-yellow-500 border-yellow-700" },
      { label: "LAYER 3",         style: "text-[#555] border-[#2a2a2a]" },
      { label: "FREE",            style: "text-purple-500 border-purple-900" },
    ],
  },
];
