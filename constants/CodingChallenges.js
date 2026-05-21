export const TYPE_STYLE = {
  CODE:   { border: "#7c3aed", color: "#a78bfa" },
  DEBUG:  { border: "#b45309", color: "#fb923c" },
  BUILD:  { border: "#166534", color: "#4ade80" },
  DESIGN: { border: "#1e40af", color: "#60a5fa" },
};

export const MOCK_STATS = [
  { value: "47", unit: "solved", label: "TOTAL PROBLEMS", sub: "↑ 6 this week" },
  { value: "73", unit: "%",      label: "ACCURACY",       sub: "↑ 4 pts" },
  { value: "12", unit: "d",      label: "SOLVE STREAK",   sub: "longest yet" },
  { value: "#142", unit: "",     label: "GLOBAL RANK",    sub: "↑ 23 places" },
];

export const DAILY = {
  id: "DC_142",
  date: "14 may",
  title: "Build a sliding-window rate limiter with Redis",
  desc: "Implement an Express middleware that enforces a 100 req/min sliding window per API key, backed by Redis. Pass all 6 test cases including the edge cases at window boundaries.",
  tags: ["BACKEND", "CACHING", "MIDDLEWARE", "MEDIUM"],
  countdown: "09:42:18",
};

export const CHALLENGES = [
  {
    id: "P_03_09",
    type: "CODE",
    title: "Implement an async error wrapper for Express",
    desc: "Build a helper that wraps async route handlers so rejections reach Express's error middleware. Five tests including arity preservation.",
    tags: ["async", "errors", "middleware"],
    time: "24m", solves: "612", xp: 45, hot: true, done: false,
  },
  {
    id: "P_03_07",
    type: "CODE",
    title: "Token-bucket rate-limit middleware",
    desc: "Implement an in-memory token bucket that allows N requests per minute per IP. Handle the refill arithmetic correctly under burst load.",
    tags: ["middleware", "concurrency"],
    time: "26m", solves: "2.4k", xp: 40, hot: false, done: true,
  },
  {
    id: "P_03_08",
    type: "DEBUG",
    title: "Why is my middleware order breaking auth?",
    desc: "A broken Express app crashes on protected routes. Find the off-by-one bug in middleware ordering. Subtle — don't trust the comments.",
    tags: ["middleware", "debug"],
    time: "33m", solves: "1.1k", xp: 50, hot: false, done: false,
  },
  {
    id: "P_03_10",
    type: "DESIGN",
    title: "Design a versioned REST API for a blog",
    desc: "Write the resource model, URL scheme, and versioning strategy. AI-graded for clarity, consistency, and how you handle breaking changes.",
    tags: ["rest", "design", "ai-graded"],
    time: "45m", solves: "612", xp: 60, hot: false, done: false,
  },
  {
    id: "P_03_11",
    type: "BUILD",
    title: "Streaming file-upload endpoint",
    desc: "Build a real upload endpoint that streams large files to disk without buffering them in memory. Handle disconnects and partial writes.",
    tags: ["streams", "upload"],
    time: "30m", solves: "487", xp: 55, hot: false, done: false,
  },
  {
    id: "P_03_12",
    type: "CODE",
    title: "LRU cache for Express responses",
    desc: "Implement a least-recently-used cache as middleware. Bound memory, expire on TTL, key on URL + query, invalidate cleanly.",
    tags: ["caching", "perf", "data-structures"],
    time: "29m", solves: "891", xp: 45, hot: false, done: false,
  },
  {
    id: "P_03_05",
    type: "DEBUG",
    title: "Fix a memory leak in a long-running service",
    desc: "A node service slowly bloats from 80MB to 2GB over 6 hours. You get heap snapshots. Find the closure-trap leak.",
    tags: ["memory", "debug"],
    time: "38m", solves: "334", xp: 65, hot: false, done: false,
  },
  {
    id: "P_03_03",
    type: "CODE",
    title: "Parse multipart form-data without a library",
    desc: "Read the boundary, parse headers and binary content. No busboy, no multipart.",
    tags: ["streams", "parsing"],
    time: "42m", solves: "201", xp: 70, hot: false, done: false,
  },
];

export const TOPICS = [
  { label: "all topics",    count: 12 },
  { label: "middleware",    count: 4 },
  { label: "routing",       count: 2 },
  { label: "async / errors", count: 3 },
  { label: "streams",       count: 2 },
  { label: "caching",       count: 1 },
];

export const LEADERBOARD = [
  { rank: 1,  initial: "D", name: "@daniel.k", score: "2,340", you: false },
  { rank: 2,  initial: "M", name: "@maria.s",  score: "2,180", you: false },
  { rank: 3,  initial: "R", name: "@ravi.p",   score: "1,920", you: false },
  { rank: 4,  initial: "N", name: "@nina.c",   score: "1,640", you: false },
  { rank: 23, initial: "V", name: "you",        score: "420",   you: true  },
];
