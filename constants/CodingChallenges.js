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
    id: "P_03_11", path: "backend", layer: "3", level: "med",
    type: "BUILD",
    title: "Streaming file-upload endpoint",
    desc: "Build a real upload endpoint that streams large files to disk without buffering them in memory. Handle disconnects and partial writes.",
    tags: ["streams", "upload"],
    time: "30m", solves: "487", xp: 55, hot: false, done: false,
  },
  {
    id: "P_03_12", path: "backend", layer: "3", level: "easy",
    type: "CODE",
    title: "LRU cache for Express responses",
    desc: "Implement a least-recently-used cache as middleware. Bound memory, expire on TTL, key on URL + query, invalidate cleanly.",
    tags: ["caching", "perf", "data-structures"],
    time: "29m", solves: "891", xp: 45, hot: false, done: false,
  },
  {
    id: "P_03_05", path: "backend", layer: "3", level: "hard",
    type: "DEBUG",
    title: "Fix a memory leak in a long-running service",
    desc: "A node service slowly bloats from 80MB to 2GB over 6 hours. You get heap snapshots. Find the closure-trap leak.",
    tags: ["memory", "debug"],
    time: "38m", solves: "334", xp: 65, hot: false, done: false,
  },
  {
    id: "P_03_03", path: "backend", layer: "3", level: "hard",
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
