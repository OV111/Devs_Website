import { useState, createElement } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Play, RotateCcw, Eye, Lock,
  CheckCircle2, XCircle, Clock, Search, Bot, LogOut,
  User, Bell, Bookmark, Settings as SettingsIcon, Star,
} from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import useProfileStore from "@/stores/useProfileStore";
import { CATEGORY_OPTIONS } from "../../../constants/Categories";
import { AVATAR_MENU_ITEMS } from "../../../constants/Navbar";

const C = {
  bg:       "#0a0a0c",
  surface:  "#111115",
  border:   "#1f1f26",
  purple:   "#a855f7",
  green:    "#2dd46a",
  amber:    "#ffb347",
  rose:     "#ff5470",
  text:     "#e2e2e8",
  muted:    "#6b6b7b",
  faint:    "#3a3a4a",
};

const FONT_SANS = "'Geist', 'Inter', system-ui, sans-serif";
const FONT_MONO = "'Geist Mono', 'Fira Code', 'JetBrains Mono', monospace";

const MOCK_CHALLENGE = {
  id: "P_03_09",
  type: "CODE",
  difficulty: "MEDIUM",
  xp: 45,
  weakTopic: true,
  title: "Async error wrapper for Express",
  breadcrumb: ["arena", "backend", "layer 3"],
  pager: { current: 9, total: 17 },
  description: `You're building an Express API where every route handler is <code>async</code>. Right now, any error thrown inside an async handler escapes the framework's error pipeline and crashes silently.`,
  task: `Write a function <code>asyncHandler(fn)</code> that takes an async route handler and returns a wrapped handler that catches any rejection and forwards it to Express's <code>next()</code>.`,
  constraints: [
    "Must work with both async functions and functions returning Promises.",
    "Must not change the original function's signature.",
    "Synchronous handlers should still work if accidentally wrapped.",
    "No external libraries (the standard library is fine).",
  ],
  example: `const safeGet = asyncHandler(async (req, res) => {
  const data = await fetchData(req.params.id);
  res.json(data);
});
app.get('/data/:id', safeGet);`,
  files: [
    {
      name: "asyncHandler.js",
      lang: "js",
      code: `// asyncHandler.js
// Wrap an async express handler so rejections reach next()

function asyncHandler(fn) {
  return function (req, res, next) {
    try {
      const result = fn(req, res, next);
      if (result && typeof result.catch === 'function') {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = asyncHandler;`,
    },
    {
      name: "asyncHandler_test.js",
      lang: "test",
      code: `// asyncHandler_test.js
const asyncHandler = require('./asyncHandler');

test('resolved_promise_passes', async () => {
  const fn = jest.fn().mockResolvedValue(undefined);
  const handler = asyncHandler(fn);
  const req = {}, res = {}, next = jest.fn();
  await handler(req, res, next);
  expect(next).not.toHaveBeenCalled();
});

test('rejection_calls_next', async () => {
  const err = new Error('boom');
  const fn = jest.fn().mockRejectedValue(err);
  const handler = asyncHandler(fn);
  const next = jest.fn();
  await handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('sync_throw_calls_next', () => {
  const err = new Error('sync');
  const fn = () => { throw err; };
  const handler = asyncHandler(fn);
  const next = jest.fn();
  handler({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});

test('does_not_mutate_fn', () => {
  const fn = async () => {};
  asyncHandler(fn);
  expect(fn.length).toBe(0);
});

test('preserves_arity', () => {
  const errorHandler = async (err, req, res, next) => {};
  const wrapped = asyncHandler(errorHandler);
  expect(wrapped.length).toBe(4);
});`,
    },
  ],
  hints: [
    {
      id: 1,
      revealed: true,
      cost: 0,
      text: `You're close — 4/5 tests pass. The failing one is <code>preserves_arity</code>. Re-read what Express decides with <code>fn.length</code> to decide if a function is an error handler vs a normal handler.`,
    },
    {
      id: 2,
      revealed: false,
      cost: 5,
      text: `Use <code>Object.defineProperty</code> on the wrapper to set its <code>length</code> to match <code>fn.length</code> before returning it.`,
    },
    {
      id: 3,
      revealed: false,
      cost: 15,
      text: `Here's the key line: <code>Object.defineProperty(wrapper, 'length', { value: fn.length });</code>`,
    },
  ],
  testResults: [
    { name: "resolved_promise_passes", passed: true, ms: 3 },
    { name: "rejection_calls_next",    passed: true, ms: 2 },
    { name: "sync_throw_calls_next",   passed: true, ms: 1 },
    { name: "does_not_mutate_fn",      passed: true, ms: 1 },
    { name: "preserves_arity",         passed: false, ms: 4 },
  ],
};

const JS_KEYWORDS = new Set([
  "function","return","const","let","var","if","else","try","catch",
  "async","await","new","this","null","undefined","true","false",
  "typeof","instanceof","import","export","from","require","module",
  "class","extends","super","throw","for","while","do","switch",
  "case","break","continue","default","of","in","delete","void",
]);

const TOKEN_COLORS = {
  keyword:  C.purple,
  func:     "#60a5fa",
  string:   C.green,
  comment:  "#4a4a5c",
  number:   C.amber,
  plain:    "#c9c9d8",
};

function tokenizeLine(line) {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//")) return [{ text: line, t: "comment" }];

  const tokens = [];
  let i = 0;
  while (i < line.length) {
    const ch = line[i];

    if (ch === "/" && line[i + 1] === "/") {
      tokens.push({ text: line.slice(i), t: "comment" });
      break;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < line.length && line[j] !== ch) {
        if (line[j] === "\\") j++;
        j++;
      }
      j++;
      tokens.push({ text: line.slice(i, j), t: "string" });
      i = j;
      continue;
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const after = line.slice(j).trimStart();
      const type = JS_KEYWORDS.has(word) ? "keyword" : after.startsWith("(") ? "func" : "plain";
      tokens.push({ text: word, t: type });
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), t: "number" });
      i = j;
      continue;
    }

    tokens.push({ text: ch, t: "plain" });
    i++;
  }
  return tokens;
}

function HighlightedLine({ line }) {
  if (line.trim() === "") return <span>&nbsp;</span>;
  const tokens = tokenizeLine(line);
  return (
    <>
      {tokens.map((tok, i) => (
        <span
          key={i}
          style={{
            color: TOKEN_COLORS[tok.t],
            fontStyle: tok.t === "comment" ? "italic" : "normal",
          }}
        >
          {tok.text}
        </span>
      ))}
    </>
  );
}

function Badge({ children, color, bg, border }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {children}
    </span>
  );
}

function SectionHead({ children }) {
  return (
    <h2
      className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
      style={{ color: C.muted, fontFamily: FONT_MONO }}
    >
      {children}
    </h2>
  );
}

const INLINE_CODE_STYLE = {
  background: "#1e0a3c",
  border: `1px solid #3b1e6e`,
  borderRadius: "3px",
  padding: "0 4px",
  color: C.purple,
  fontFamily: FONT_MONO,
  fontSize: "0.85em",
};

function ProblemPanel({ challenge }) {
  return (
    <div
      className="flex flex-col h-full overflow-y-auto gap-5 px-5 py-5"
      style={{ scrollbarWidth: "thin", scrollbarColor: `${C.faint} transparent` }}
    >
      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge color={C.text}      bg="#18181f"  border={C.faint}>{challenge.id}</Badge>
        <Badge color={C.green}     bg="#06190f"  border="#0e3d1e">{challenge.type}</Badge>
        <Badge color={C.amber}     bg="#190f00"  border="#3d2700">{challenge.difficulty}</Badge>
        <Badge color={C.purple}    bg="#160828"  border="#3b1e6e">+{challenge.xp} XP</Badge>
      </div>

      {/* Weak topic pill */}
      {challenge.weakTopic && (
        <div className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full"
          style={{ background: "#1c1200", border: `1px solid #4a3200`, color: C.amber }}>
          <Star size={10} fill={C.amber} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Your weak topic</span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-[20px] font-bold leading-snug" style={{ color: C.text }}>
        {challenge.title}
      </h1>

      {/* Description */}
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "#8a8a9a" }}
        dangerouslySetInnerHTML={{ __html: challenge.description.replace(/<code>/g, `<code style="background:#1e0a3c;border:1px solid #3b1e6e;border-radius:3px;padding:0 4px;color:${C.purple};font-family:${FONT_MONO};font-size:0.85em">`).replace(/<\/code>/g, '</code>') }}
      />

      {/* Task */}
      <div>
        <SectionHead>The task</SectionHead>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "#8a8a9a" }}
          dangerouslySetInnerHTML={{ __html: challenge.task.replace(/<code>/g, `<code style="background:#1e0a3c;border:1px solid #3b1e6e;border-radius:3px;padding:0 4px;color:${C.purple};font-family:${FONT_MONO};font-size:0.85em">`).replace(/<\/code>/g, '</code>') }}
        />
      </div>

      {/* Constraints */}
      <div>
        <SectionHead>Constraints</SectionHead>
        <ul className="flex flex-col gap-2">
          {challenge.constraints.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: "#8a8a9a" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.purple }} />
              <span dangerouslySetInnerHTML={{ __html: c.replace(/<code>/g, `<code style="background:#1e0a3c;border:1px solid #3b1e6e;border-radius:3px;padding:0 4px;color:${C.purple};font-family:${FONT_MONO};font-size:0.85em">`).replace(/<\/code>/g, '</code>') }} />
            </li>
          ))}
        </ul>
      </div>

      {/* Example */}
      <div>
        <SectionHead>Example usage</SectionHead>
        <pre
          className="text-[12px] leading-relaxed p-4 rounded-lg overflow-x-auto"
          style={{
            background: "#0e0e14",
            border: `1px solid ${C.border}`,
            color: "#b0b0c0",
            fontFamily: FONT_MONO,
            scrollbarWidth: "thin",
            scrollbarColor: `${C.faint} transparent`,
          }}
        >
          {challenge.example}
        </pre>
      </div>
    </div>
  );
}

const FILE_META = {
  js:   { dot: C.amber,  label: "JavaScript · UTF-8" },
  test: { dot: C.purple, label: "Jest Test · UTF-8"  },
};

function CodePanel({ files }) {
  const [active, setActive] = useState(0);
  const file = files[active];
  const lines = file.code.split("\n");

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      {/* Tabs + meta */}
      <div className="flex items-center justify-between border-b shrink-0"
        style={{ borderColor: C.border, background: C.surface }}>
        <div className="flex">
          {files.map((f, i) => {
            const meta = FILE_META[f.lang] || FILE_META.js;
            const isActive = active === i;
            return (
              <button
                key={f.name}
                onClick={() => setActive(i)}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition-all cursor-pointer border-b-2"
                style={{
                  borderBottomColor: isActive ? meta.dot : "transparent",
                  color: isActive ? C.text : C.muted,
                  background: isActive ? C.bg : "transparent",
                  fontFamily: FONT_MONO,
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.dot }} />
                {f.name}
              </button>
            );
          })}
        </div>
        <span className="px-4 text-[11px]" style={{ color: C.faint, fontFamily: FONT_MONO }}>
          {(FILE_META[file.lang] || FILE_META.js).label}
        </span>
      </div>

      {/* Gutter + code */}
      <div
        className="flex-1 overflow-y-auto overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: `${C.faint} transparent` }}
      >
        <table className="w-full border-collapse" style={{ fontFamily: FONT_MONO, fontSize: "13px" }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group">
                <td
                  className="select-none text-right pr-4 pl-4 align-top leading-6"
                  style={{
                    color: "#3a3a52",
                    background: "#0c0c11",
                    borderRight: `1px solid ${C.border}`,
                    minWidth: "48px",
                    userSelect: "none",
                    fontSize: "11px",
                    paddingTop: "1px",
                    paddingBottom: "1px",
                  }}
                >
                  {i + 1}
                </td>
                <td
                  className="pl-5 pr-4 align-top leading-6 whitespace-pre group-hover:bg-white/[0.018]"
                  style={{ color: TOKEN_COLORS.plain, paddingTop: "1px", paddingBottom: "1px" }}
                >
                  <HighlightedLine line={line} />
                </td>
              </tr>
            ))}
            {/* bottom padding row */}
            <tr>
              <td style={{ background: "#0c0c11", borderRight: `1px solid ${C.border}` }}>&nbsp;</td>
              <td className="pb-10" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HintsPanel({ hints: init }) {
  const [hints, setHints] = useState(init);
  const reveal = (id) => setHints(prev => prev.map(h => h.id === id ? { ...h, revealed: true } : h));

  const descHtml = (html) =>
    html.replace(/<code>/g, `<code style="background:#1e0a3c;border:1px solid #3b1e6e;border-radius:3px;padding:0 4px;color:${C.purple};font-family:${FONT_MONO};font-size:0.85em">`).replace(/<\/code>/g, "</code>");

  return (
    <div className="flex flex-col h-full" style={{ background: C.surface }}>
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2 mb-1">
          <Bot size={13} style={{ color: C.purple }} />
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: C.purple, fontFamily: FONT_MONO }}>
            Agent Hints
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: C.muted }}>
          Socratic — guides, never gives the answer. Hints unlock progressively.
        </p>
      </div>

      {/* Cards */}
      <div
        className="flex flex-col divide-y flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: `${C.faint} transparent`, borderColor: C.border }}
      >
        {hints.map((hint) => (
          <div key={hint.id} className="px-4 py-4 flex flex-col gap-3" style={{ borderColor: C.border }}>
            {/* Status row */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: hint.revealed ? C.green : C.faint }}
              />
              <span className="text-[10px] font-bold tracking-widest" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                HINT {String(hint.id).padStart(2, "0")} ·{" "}
                <span style={{ color: hint.revealed ? C.green : C.faint }}>
                  {hint.revealed ? "REVEALED" : "LOCKED"}
                </span>
              </span>
            </div>

            {/* Content */}
            {hint.revealed ? (
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "#aaaabc" }}
                dangerouslySetInnerHTML={{ __html: descHtml(hint.text) }}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="h-2 rounded-sm w-full"       style={{ background: C.faint }} />
                <div className="h-2 rounded-sm w-4/5"        style={{ background: C.faint, opacity: 0.7 }} />
                <div className="h-2 rounded-sm w-3/5"        style={{ background: C.faint, opacity: 0.4 }} />
              </div>
            )}

            {/* Cost row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: hint.revealed ? C.faint : "#7a7a8a", fontFamily: FONT_MONO }}>
                cost:{" "}
                <span style={{ color: hint.revealed ? C.faint : hint.cost === 0 ? C.green : C.rose }}>
                  {hint.cost === 0 ? "0 xp" : `-${hint.cost} xp`}
                </span>
                {" · "}
                <span style={{ color: C.faint }}>
                  {hint.revealed ? "unlocked free" : hint.cost === 0 ? "free" : "still passable"}
                </span>
              </span>

              {hint.revealed ? (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: C.faint }}>
                  <Lock size={9} /> revealed
                </span>
              ) : (
                <button
                  onClick={() => reveal(hint.id)}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded transition-colors cursor-pointer"
                  style={{
                    border: `1px solid ${C.faint}`,
                    color: "#9a9aaa",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = "#9a9aaa"; }}
                >
                  <Eye size={10} />
                  reveal — {hint.cost === 0 ? "free" : `${hint.cost} xp`}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBar({ testResults }) {
  const passed = testResults.filter(r => r.passed).length;
  const total  = testResults.length;

  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{ height: "44px", borderTop: `1px solid ${C.border}`, background: C.surface }}
    >
      {/* Left: pips + summary */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {testResults.map((r, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: r.passed ? C.green : C.rose }}
              title={r.name}
            />
          ))}
        </div>
        <span className="text-[12px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
          <span style={{ color: C.green }}>{passed}/{total} tests pass</span>
          {" · last run 2s ago"}
        </span>
      </div>

      {/* Right: autosaved + buttons */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] mr-1" style={{ color: C.faint, fontFamily: FONT_MONO }}>
          autosaved
        </span>
        <button
          className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded transition-colors cursor-pointer"
          style={{ border: `1px solid ${C.faint}`, color: C.muted }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}
        >
          <RotateCcw size={11} />
          Run tests
        </button>
        <button
          className="flex items-center gap-1.5 text-[12px] px-4 py-1.5 rounded font-semibold transition-colors cursor-pointer"
          style={{ background: C.purple, color: "#fff" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#9333ea"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.purple; }}
        >
          <Play size={11} fill="#fff" />
          Submit
        </button>
      </div>
    </div>
  );
}

function ArenaNav() {
  const navigate   = useNavigate();
  const { auth, logout } = useAuthStore();
  const { user, stats } = useProfileStore();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => { logout(); navigate("/get-started"); };

  const AvatarImg = () => (
    <div className="w-7 h-7 rounded-full overflow-hidden border flex items-center justify-center shrink-0"
      style={{ borderColor: "rgba(255,255,255,0.2)" }}>
      {stats?.profileImage ? (
        <img src={stats.profileImage.replace("/upload/", "/upload/w_64,h_64,c_fill,f_auto,q_auto/")}
          alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[11px] font-bold"
          style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
          {user?.firstName?.[0]?.toUpperCase() || ""}
          {user?.lastName?.[0]?.toUpperCase() || ""}
        </div>
      )}
    </div>
  );

  return (
    <nav
      className="flex items-center gap-3 px-4 shrink-0"
      style={{ height: "48px", borderBottom: `1px solid ${C.border}`, background: C.surface, fontFamily: FONT_SANS }}
    >
      {/* Wordmark */}
      <NavLink to="/" className="text-[15px] font-bold shrink-0 mr-1" style={{ color: C.text }}>
        Devs<span style={{ color: C.purple }}>Webs</span>
      </NavLink>

      {/* Centered search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-[280px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: C.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full text-[12px] pl-8 pr-3 py-1.5 rounded-full outline-none transition-colors"
            style={{
              background: "#16161e",
              border: `1px solid ${C.border}`,
              color: C.text,
              fontFamily: FONT_SANS,
            }}
            onFocus={e  => { e.target.style.borderColor = C.purple; }}
            onBlur={e   => { e.target.style.borderColor = C.border;  }}
          />
        </div>
      </div>

      {/* Links */}
      <div className="hidden lg:flex items-center gap-0.5 text-[12px]" style={{ color: C.muted }}>
        {/* Categories dropdown */}
        <div className="relative"
          onMouseEnter={() => setCatOpen(true)}
          onMouseLeave={() => setCatOpen(false)}>
          <button className="px-2.5 py-1 rounded transition-colors cursor-pointer"
            style={{ color: catOpen ? C.text : C.muted }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            Categories
          </button>
          {catOpen && (
            <div className="absolute top-full left-0 w-40 rounded-md overflow-hidden z-10 py-1"
              style={{ background: "#16161e", border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              {CATEGORY_OPTIONS.map(({ title, slug }) => (
                <NavLink key={slug} to={`/categories/${slug}`} onClick={() => setCatOpen(false)}
                  className="block px-4 py-1.5 text-[12px] transition-colors"
                  style={{ color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.purple; e.currentTarget.style.background = "#1e0a3c"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "transparent"; }}>
                  {title}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {[
          { label: "Roadmaps",    to: "/roadmaps"          },
          { label: "Coding Libs", to: "/libs"              },
          { label: "Challenges",  to: "/coding-challenges" },
          { label: "Capstone",    to: "/capstone"          },
          { label: "AI-Agent",    to: "/ai-agent"          },
        ].map(({ label, to }) => (
          <NavLink key={to} to={to}
            className="px-2.5 py-1 rounded transition-colors"
            style={{ color: C.muted }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            {label}
          </NavLink>
        ))}
      </div>

      {/* Avatar / auth */}
      {auth ? (
        <div className="relative shrink-0 ml-1"
          onMouseEnter={() => setAvatarOpen(true)}
          onMouseLeave={() => setAvatarOpen(false)}>
          <button className="flex items-center cursor-pointer rounded-full focus-visible:outline-none">
            <AvatarImg />
          </button>
          {avatarOpen && (
            <div className="absolute right-0 top-full w-52 rounded-md overflow-hidden z-10"
              style={{ background: "#16161e", border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
              <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor: C.border }}>
                <AvatarImg />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: C.text }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  {user?.username && (
                    <p className="text-[11px] truncate" style={{ color: C.muted }}>@{user.username}</p>
                  )}
                </div>
              </div>
              {AVATAR_MENU_ITEMS.map(({ label, to, icon }) => (
                <NavLink key={to} to={to} onClick={() => setAvatarOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[12px] transition-colors"
                  style={{ color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.purple; e.currentTarget.style.background = "#1e0a3c"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "transparent"; }}>
                  {icon && <span>{createElement(icon, { size: 13 })}</span>}
                  {label}
                </NavLink>
              ))}
              <div style={{ borderTop: `1px solid ${C.border}` }} />
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-[12px] transition-colors cursor-pointer"
                style={{ color: C.rose }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2a0a10"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <NavLink to="/get-started"
          className="text-[12px] px-3 py-1.5 rounded font-semibold shrink-0 ml-1 transition-colors"
          style={{ background: C.purple, color: "#fff" }}
          onMouseEnter={e => e.currentTarget.style.background = "#9333ea"}
          onMouseLeave={e => e.currentTarget.style.background = C.purple}>
          Get Started
        </NavLink>
      )}
    </nav>
  );
}

function SubBar({ breadcrumb, challengeId, pager, onBack }) {
  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{ height: "38px", borderBottom: `1px solid ${C.border}`, background: C.surface, fontFamily: FONT_MONO }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px]">
        <button onClick={onBack}
          className="transition-colors cursor-pointer"
          style={{ color: C.muted }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
          <ChevronLeft size={13} />
        </button>
        {breadcrumb.map((seg) => (
          <span key={seg} className="flex items-center gap-1.5">
            <span style={{ color: C.muted }}>{seg}</span>
            <span style={{ color: C.faint }}>/</span>
          </span>
        ))}
        <span className="font-semibold" style={{ color: C.text }}>{challengeId}</span>
      </div>

      {/* Pager */}
      <div className="flex items-center gap-1 text-[12px]" style={{ color: C.muted }}>
        <button className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors cursor-pointer"
          style={{ border: `1px solid ${C.faint}` }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}>
          <ChevronLeft size={11} /> Prev
        </button>
        <span className="px-2" style={{ color: C.text }}>
          <span style={{ color: C.amber }}>{pager.current}</span>
          <span style={{ color: C.faint }}> / </span>
          {pager.total}
        </span>
        <button className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors cursor-pointer"
          style={{ border: `1px solid ${C.faint}` }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4a4a5a"; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.color = C.muted; }}>
          Next <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

export default function ChallengeArena() {
  const { id: _id } = useParams();
  const navigate    = useNavigate();
  const challenge   = MOCK_CHALLENGE;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-40 flex flex-col overflow-hidden"
      style={{ top: "var(--navbar-h, 48px)", background: C.bg, fontFamily: FONT_SANS, color: C.text }}
    >
      {/* Band 2: Sub-bar */}
      <SubBar
        breadcrumb={challenge.breadcrumb}
        challengeId={challenge.id}
        pager={challenge.pager}
        onBack={() => navigate("/coding-challenges")}
      />

      {/* Band 3: Workspace */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr 272px",
        }}
      >
        {/* Left: problem */}
        <div className="h-full overflow-hidden flex flex-col" style={{ borderRight: `1px solid ${C.border}` }}>
          <ProblemPanel challenge={challenge} />
        </div>

        {/* Center: editor */}
        <div className="h-full overflow-hidden flex flex-col" style={{ borderRight: `1px solid ${C.border}` }}>
          <CodePanel files={challenge.files} />
        </div>

        {/* Right: hints */}
        <div className="h-full overflow-hidden flex flex-col">
          <HintsPanel hints={challenge.hints} />
        </div>
      </div>

      {/* Band 4: Action bar */}
      <ActionBar testResults={challenge.testResults} />

      {/* Responsive: below 1100px allow scroll */}
      <style>{`
        @media (max-width: 1100px) {
          .arena-workspace {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          .arena-workspace > * {
            height: auto !important;
            min-height: 400px;
            overflow: visible !important;
          }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a4a; }
      `}</style>
    </div>
  );
}
