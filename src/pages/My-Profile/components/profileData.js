export const ACCENT = "#9333ea";

export const MOCK_PATHS = [
  {
    id: 1,
    title: "Backend developer",
    meta: "LAYER 3 / 9  ·  66% TO NEXT LAYER",
    progress: 66,
    status: "in_progress",
    barColor: "#f59e0b",
  },
  {
    id: 2,
    title: "Frontend fundamentals",
    meta: "STARTER PATH  ·  ALL 8 LAYERS CLEARED  ·  94 AVG",
    progress: 100,
    status: "completed",
    completedDate: "8 apr",
    barColor: ACCENT,
  },
];

export const MOCK_CAPSTONES = [
  {
    id: 1,
    status: "approved",
    title: "PixelDrop — image hosting api with rate-limited uploads",
    meta: "frontend fundamentals capstone  ·  approved 12 apr  ·  agent score 9.2 / 10",
    description:
      "Production-ready image hosting service. Handles signed uploads, on-the-fly resizing, and per-user rate limits via a token-bucket. Documented architecture decisions inline.",
    tags: ["NODE", "EXPRESS", "SHARP", "REDIS", "JEST", "DOCKER"],
  },
];

export const MOCK_EXAMS = [
  { id: "L_03", title: "Node.js & Express — attempt 1", score: 84, total: 100, status: "failed", date: "18 apr" },
  { id: "L_02", title: "How the web works — attempt 1", score: 92, total: 100, status: "cleared", date: "8 apr" },
  { id: "L_01", title: "Programming fundamentals — attempt 1", score: 96, total: 100, status: "cleared", date: "30 mar" },
  { id: "F8_05", title: "Frontend fundamentals — final", score: 94, total: 100, status: "cleared", date: "8 apr" },
];

export const MOCK_BADGES = [
  { label: "FIRST\nBLOOD", color: "#f59e0b", bg: "#1a1000", char: "A", earned: true },
  { label: "NIGHT\nOWL", color: "#2dd4bf", bg: "#001a1a", char: "N", earned: true },
  { label: "12\nDAY", color: "#fb923c", bg: "#1a0c00", char: "12", earned: true },
  { label: "PATH\nSTART", color: "#2dd4bf", bg: "#001a1a", char: "▶", earned: true },
  { label: "L1\nCLEAR", color: ACCENT, bg: "#0f0b1a", char: "1", earned: true },
  { label: "L2\nCLEAR", color: ACCENT, bg: "#0f0b1a", char: "2", earned: true },
  { label: "CAP\nSTONE", color: ACCENT, bg: "#0f0b1a", char: "★", earned: true },
  { label: "10\nSOLVES", color: "#facc15", bg: "#1a1500", char: "10", earned: true },
  { label: "96+\nEXAM", color: "#555", bg: "#111", char: "96", earned: false },
  { label: "ARENA\nTOP", color: "#555", bg: "#111", char: "▲", earned: false },
  { label: "WEEKLY\nWINNER", color: "#555", bg: "#111", char: "W", earned: false },
  { label: "PATH\nMASTER", color: "#555", bg: "#111", char: "M", earned: false },
];

export const MOCK_CERTIFICATES = [
  {
    id: 1,
    title: "Frontend Fundamentals",
    issued: "Apr 2025",
    score: "94 / 100",
    color: "#9333ea",
    bg: "#0f0b1a",
    char: "FE",
  },
  {
    id: 2,
    title: "How the Web Works",
    issued: "Apr 2025",
    score: "92 / 100",
    color: "#2dd4bf",
    bg: "#001a1a",
    char: "WW",
  },
  {
    id: 3,
    title: "Programming Fundamentals",
    issued: "Mar 2025",
    score: "96 / 100",
    color: "#f59e0b",
    bg: "#1a1000",
    char: "PF",
  },
];

export const GLANCE_STATS = [
  { label: "posts written", value: "12" },
  { label: "posts read", value: "128" },
  { label: "followers", value: "342" },
  { label: "agent sessions", value: "47" },
  { label: "commits to learn", value: "~14 weeks" },
];

export const DEVSCOIN_BALANCE = 1_340;

export const DEVSCOIN_TXN = [
  { type: "earn", amount: 150, reason: "Capstone approved — PixelDrop", date: "12 apr" },
  { type: "earn", amount: 100, reason: "Passed L_02 exam — 92/100", date: "8 apr" },
  { type: "spend", amount: 50, reason: "Unlocked agent session (extended)", date: "7 apr" },
  { type: "earn", amount: 75, reason: "12-day streak bonus", date: "6 apr" },
  { type: "earn", amount: 50, reason: "Passed L_01 exam — 96/100", date: "30 mar" },
  { type: "spend", amount: 30, reason: "Hint token used — L_03 problem", date: "18 apr" },
  { type: "earn", amount: 25, reason: "Post reached 100 reads", date: "15 apr" },
];

export const COIN_EARN_WAYS = [
  { action: "pass a layer exam", reward: "+50–150" },
  { action: "capstone approved", reward: "+150" },
  { action: "daily streak (7d)", reward: "+50" },
  { action: "post hits 100 reads", reward: "+25" },
  { action: "help in community", reward: "+10" },
];

function seededVal(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const ACTIVITY_GRID = Array.from({ length: 53 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const r = seededVal(w * 7 + d);
    if (r < 0.38) return 0;
    if (r < 0.56) return 1;
    if (r < 0.70) return 2;
    if (r < 0.83) return 3;
    return 4;
  })
);

export const ACTIVITY_COLORS = ["#111", "#1e0f3a", "#3b2060", "#7c3aed", "#9333ea"];
export const TOTAL_CONTRIBUTIONS = ACTIVITY_GRID.flat().filter((v) => v > 0).length;
