# Issues & Fix Options

> **Status review: 2026-10-02.** These six UI issues date from May 2026. Each was re-checked against the code; the original write-ups are kept below.

| # | Issue | Status | Evidence |
|---|---|---|---|
| 1 | Roadmap data bundle size | **Fixed** (a variant of Option A) | Each category is a JSON file in `src/data/roadmaps/` and `RoadmapTree` loads only the selected one with a dynamic `import()`. Tracks and layers are also seeded into MongoDB (`npm run seed:roadmap`) |
| 2 | Horizontal `flex-wrap` layer cards | **Superseded** | Replaced by the tree layout (`features/Roadmap/components/tree/`, `rf/`) in the roadmap UI refactor |
| 3 | No progress persistence | **Fixed** | Progress is saved server-side through `/api/roadmaps/progress`; guests get a read-only preview |
| 4 | Inline `<style>` in `CategoryBar` and `TrackSelector` | **Resolved by removal; cleanup left** | Both `<style>` blocks are commented out. Delete the commented code |
| 5 | No `exit` animation on `RoadmapTree` | **Open** | No `exit` prop in `RoadmapTree.jsx` |
| 6 | No Escape key on `LayerDetail` | **Open** | No `keydown` handler in `features/Roadmap` |

Nothing here blocks the pilot. Issues 5 and 6 are about 10 minutes each.

---

## 1. Roadmap Data Bundle Size

**Problem:**
All roadmap track data lives in a single `constants/roadmapPaths.js` file and is statically imported — meaning every user downloads the entire dataset on page load, even if they only view one track.

| Tracks filled | Estimated size | Impact |
|---|---|---|
| 1 (now) | ~23KB | Fine |
| 10 tracks | ~180KB | Noticeable |
| 80 tracks | ~1.4MB | Blocks render |

**Option A — Split into individual files + dynamic import** ✅ chosen
- One file per track under `constants/roadmaps/<trackId>.js`
- Loaded on demand when user selects a track via `await import(...)`
- Zero setup, works with Vite out of the box
- Migrate to Option B when DB is added for user progress

**Option B — Move to a database (Supabase / Firebase)**
- Store each track's layers as JSON in a DB row
- Fetch on track select, easy to update without redeploying
- Required eventually for user progress tracking anyway

---

## 2. LayerNode Layout — Horizontal Flex vs Vertical Timeline

**Problem:**
LayerNodes render in `flex-wrap` horizontal cards which breaks the sequential "layer by layer" roadmap concept visually.

**Fix:**
Switch to a vertical timeline layout — numbered nodes stacked top to bottom with a connecting line running through them.

---

## 3. No Progress Persistence

**Problem:**
All state (selected category, track, active layer) lives in Zustand memory — a page refresh resets everything.

**Fix:**
Persist `selectedCategory` and `selectedTrack` to `localStorage` via Zustand's `persist` middleware. Full progress tracking (completed layers) will require a DB (see Issue 1 Option B).

---

## 4. Inline `<style>` Tags in Components

**Problem:**
`CategoryBar` and `TrackSelector` inject `<style>` blocks inline for the glow-pulse animation. These re-inject on every render and are not scalable.

**Fix:**
Move the `glow-pulse` and `teal-glow-pulse` keyframes to the global CSS file (e.g. `index.css`).

---

## 5. Missing `exit` Animation on RoadmapTree

**Problem:**
`RoadmapTree` has no `exit` prop — when unmounted it snaps out instead of animating away.

**Fix:**
Add `exit={{ opacity: 0, y: 10 }}` to the root motion element in `RoadmapTree`.

---

## 6. No Escape Key Support on LayerDetail

**Problem:**
The `LayerDetail` drawer can only be closed via the X button or backdrop click — no keyboard support.

**Fix:**
Add a `useEffect` that listens for `keydown` Escape and calls `closePanel()`.
