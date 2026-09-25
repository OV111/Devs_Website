import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, authHeaders } from "../../../../constants/api";

/**
 * Propose a new coding challenge.
 *
 * Deliberately dumb about state: a proposal is a one-shot POST, so this
 * component keeps its own local form state instead of reaching for the
 * Zustand challenge store (which models an in-progress *attempt*, not a
 * draft submission). Client-side validation mirrors
 * backend/modules/coding-challenges/services/proposalService.js's
 * `validate()` field-for-field so a submitter never has to round-trip to
 * the server just to learn a required field is empty.
 */

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

const VALID_TYPES = ["CODE", "DEBUG", "BUILD", "SYSTEM_DESIGN"];
const VALID_DIFFICULTY = ["easy", "med", "hard"];

const emptyStarterFile = () => ({ name: "", lang: "js", code: "" });
const emptyHiddenTest = () => ({ name: "", code: "" });
const emptyHint = () => ({ cost: 10, text: "" });

const inputStyle = {
  background: "#16161c",
  border: `1px solid ${C.border}`,
  color: C.text,
  fontFamily: FONT_SANS,
};

const codeAreaStyle = {
  background: "#0e0e14",
  border: `1px solid ${C.border}`,
  color: C.text,
  fontFamily: FONT_MONO,
};

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

function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-bold tracking-wide uppercase"
        style={{ color: C.muted, fontFamily: FONT_MONO }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px]" style={{ color: C.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full text-[13px] px-3 py-2 rounded-sm outline-none"
      style={inputStyle}
    />
  );
}

function CodeArea(props) {
  return (
    <textarea
      {...props}
      spellCheck={false}
      rows={props.rows ?? 8}
      className="w-full text-[12px] px-3 py-2 rounded-sm outline-none resize-y leading-relaxed"
      style={codeAreaStyle}
    />
  );
}

function RemoveButton({ onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="text-[11px] font-bold tracking-wide uppercase px-2 py-1 rounded-sm shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ color: C.rose, border: `1px solid ${C.border}`, fontFamily: FONT_MONO }}
    >
      Remove
    </button>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-sm self-start"
      style={{
        color: C.purple,
        border: `1px solid #3b1e6e`,
        background: "#160828",
        fontFamily: FONT_MONO,
      }}
    >
      + {label}
    </button>
  );
}

export default function ProposeChallenge() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [trackId, setTrackId] = useState("");
  const [layerId, setLayerId] = useState("");
  const [type, setType] = useState("CODE");
  const [difficulty, setDifficulty] = useState("easy");
  const [xp, setXp] = useState(50);
  const [estimatedMins, setEstimatedMins] = useState(30);
  const [constraintsText, setConstraintsText] = useState("");
  const [example, setExample] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [starterFiles, setStarterFiles] = useState([emptyStarterFile()]);
  const [hiddenTests, setHiddenTests] = useState([emptyHiddenTest()]);
  const [hints, setHints] = useState([]);

  const [solutionCode, setSolutionCode] = useState("");
  const [solutionExplanation, setSolutionExplanation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null); // { slug, status }

  // --- repeatable-row helpers -------------------------------------------

  const updateStarterFile = (i, patch) =>
    setStarterFiles((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addStarterFile = () => setStarterFiles((rows) => [...rows, emptyStarterFile()]);
  const removeStarterFile = (i) =>
    setStarterFiles((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  const updateHiddenTest = (i, patch) =>
    setHiddenTests((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addHiddenTest = () => setHiddenTests((rows) => [...rows, emptyHiddenTest()]);
  const removeHiddenTest = (i) =>
    setHiddenTests((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  const updateHint = (i, patch) =>
    setHints((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addHint = () => setHints((rows) => [...rows, emptyHint()]);
  const removeHint = (i) => setHints((rows) => rows.filter((_, idx) => idx !== i));

  // --- validation (mirrors proposalService.validate()) -------------------

  const errors = useMemo(() => {
    const errs = [];

    if (!title.trim()) errs.push("title is required");
    if (!summary.trim()) errs.push("summary is required");
    if (!description.trim()) errs.push("description is required");
    if (!task.trim()) errs.push("task is required");
    if (!trackId.trim()) errs.push("trackId is required");
    if (!layerId.trim()) errs.push("layerId is required");

    if (!VALID_TYPES.includes(type)) errs.push(`type must be one of: ${VALID_TYPES.join(", ")}`);
    if (!VALID_DIFFICULTY.includes(difficulty))
      errs.push(`difficulty must be one of: ${VALID_DIFFICULTY.join(", ")}`);

    if (starterFiles.length === 0) errs.push("at least one starter file is required");
    for (const f of starterFiles) {
      if (!f.name.trim() || !f.code.trim())
        errs.push("each starter file needs a name and code");
    }

    if (hiddenTests.length === 0) errs.push("at least one hidden test is required");
    for (const t of hiddenTests) {
      if (!t.name.trim() || !t.code.trim())
        errs.push("each hidden test needs a name and code");
    }

    if (!solutionCode.trim()) errs.push("a reference solution is required");

    const xpNum = Number(xp);
    if (!Number.isInteger(xpNum) || xpNum < 0 || xpNum > 500)
      errs.push("xp must be a whole number between 0 and 500");

    const tags = tagsText.split(",").map((s) => s.trim()).filter(Boolean);
    if (tags.length > 8) errs.push("at most 8 tags allowed");

    for (const h of hints) {
      if (!h.text.trim()) errs.push("each hint needs text");
      if (!Number.isFinite(Number(h.cost)) || Number(h.cost) < 0)
        errs.push("hint cost must be a non-negative number");
    }

    return Array.from(new Set(errs));
  }, [title, summary, description, task, trackId, layerId, type, difficulty, starterFiles, hiddenTests, solutionCode, xp, tagsText, hints]);

  const isValid = errors.length === 0;

  // --- submit --------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setServerError("");
    setResult(null);

    const body = {
      title: title.trim(),
      summary: summary.trim(),
      description,
      task,
      trackId: trackId.trim(),
      layerId: layerId.trim(),
      type,
      difficulty,
      xp: Number(xp),
      estimatedMins: Number(estimatedMins) || 30,
      constraints: constraintsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      example: example.trim(),
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8),
      starterFiles: starterFiles.map((f) => ({ name: f.name.trim(), lang: f.lang || "js", code: f.code })),
      hiddenTests: hiddenTests.map((t) => ({ name: t.name.trim(), code: t.code })),
      hints: hints.map((h) => ({ cost: Number(h.cost) || 0, text: h.text.trim() })),
      solution: { code: solutionCode, explanation: solutionExplanation.trim() },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/challenges/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      setResult({ slug: data.slug ?? data.data?.slug, status: data.status ?? data.data?.status ?? "pending" });
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // --- success view -------------------------------------------------

  if (result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: C.bg, fontFamily: FONT_SANS }}
      >
        <div
          className="w-full max-w-md flex flex-col gap-4 p-6 rounded-sm text-center"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <span
            className="text-[10px] font-bold tracking-widest uppercase self-center px-2 py-0.5 rounded-sm"
            style={{ color: C.green, background: "#06190f", border: "1px solid #0e3d1e", fontFamily: FONT_MONO }}
          >
            Submitted
          </span>
          <h1 className="text-[18px] font-bold" style={{ color: C.text }}>
            Proposal received
          </h1>
          <p className="text-[13px]" style={{ color: C.muted }}>
            Slug{" "}
            <code
              className="px-1.5 py-0.5 rounded-sm"
              style={{ color: C.purple, background: "#1e0a3c", border: "1px solid #3b1e6e", fontFamily: FONT_MONO }}
            >
              {result.slug}
            </code>{" "}
            is now <strong style={{ color: C.text }}>pending review</strong>.
          </p>
          <button
            type="button"
            onClick={() => navigate("/coding-challenges")}
            className="mt-2 text-[12px] font-bold tracking-wide uppercase px-4 py-2 rounded-sm self-center"
            style={{ color: C.bg, background: C.purple, fontFamily: FONT_MONO }}
          >
            Back to challenges
          </button>
        </div>
      </div>
    );
  }

  // --- form -----------------------------------------------------------

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: C.bg, fontFamily: FONT_SANS }}>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex flex-col gap-8 px-4 md:px-6 py-8 md:py-10"
      >
        <div className="flex flex-col gap-1">
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: C.purple, fontFamily: FONT_MONO }}
          >
            Coding challenges
          </span>
          <h1 className="text-[22px] font-bold" style={{ color: C.text }}>
            Propose a challenge
          </h1>
          <p className="text-[13px]" style={{ color: C.muted }}>
            Submitted for admin review before it appears in the arena.
          </p>
        </div>

        {/* The problem */}
        <section className="flex flex-col gap-4">
          <SectionHead>The problem</SectionHead>

          <Field label="Title" htmlFor="title">
            <TextInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Debounce an async handler" />
          </Field>

          <Field label="Summary" htmlFor="summary" hint="One line — shows in list views.">
            <TextInput id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Wrap a function so rapid calls collapse to one." />
          </Field>

          <Field label="Description" htmlFor="description" hint="Full write-up shown on the problem panel. <code> tags are supported.">
            <CodeArea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
          </Field>

          <Field label="Task" htmlFor="task" hint="What the solver is asked to implement.">
            <CodeArea id="task" value={task} onChange={(e) => setTask(e.target.value)} rows={4} />
          </Field>

          <Field label="Constraints" htmlFor="constraints" hint="One per line, optional.">
            <CodeArea id="constraints" value={constraintsText} onChange={(e) => setConstraintsText(e.target.value)} rows={3} />
          </Field>

          <Field label="Example" htmlFor="example" hint="Optional sample input/output.">
            <CodeArea id="example" value={example} onChange={(e) => setExample(e.target.value)} rows={3} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Track ID" htmlFor="trackId">
              <TextInput id="trackId" value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="api-dev" />
            </Field>
            <Field label="Layer ID" htmlFor="layerId" hint="Must exist in roadmap_layers, e.g. api-dev-3.">
              <TextInput id="layerId" value={layerId} onChange={(e) => setLayerId(e.target.value)} placeholder="api-dev-3" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Type" htmlFor="type">
              <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full text-[13px] px-3 py-2 rounded-sm outline-none" style={inputStyle}>
                {VALID_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty" htmlFor="difficulty">
              <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full text-[13px] px-3 py-2 rounded-sm outline-none" style={inputStyle}>
                {VALID_DIFFICULTY.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="XP" htmlFor="xp" hint="Whole number, 0–500.">
              <TextInput id="xp" type="number" min={0} max={500} step={1} value={xp} onChange={(e) => setXp(e.target.value)} />
            </Field>
            <Field label="Est. minutes" htmlFor="estimatedMins">
              <TextInput id="estimatedMins" type="number" min={0} step={1} value={estimatedMins} onChange={(e) => setEstimatedMins(e.target.value)} />
            </Field>
            <Field label="Tags" htmlFor="tags" hint="Comma-separated, max 8.">
              <TextInput id="tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="async, debounce" />
            </Field>
          </div>
        </section>

        {/* Starter code */}
        <section className="flex flex-col gap-4">
          <SectionHead>Starter code</SectionHead>
          {starterFiles.map((f, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-sm" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
              <div className="flex items-center justify-between gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <Field label="File name" htmlFor={`starter-name-${i}`}>
                    <TextInput id={`starter-name-${i}`} value={f.name} onChange={(e) => updateStarterFile(i, { name: e.target.value })} placeholder="asyncHandler.js" />
                  </Field>
                  <Field label="Language" htmlFor={`starter-lang-${i}`}>
                    <TextInput id={`starter-lang-${i}`} value={f.lang} onChange={(e) => updateStarterFile(i, { lang: e.target.value })} placeholder="js" />
                  </Field>
                </div>
                <RemoveButton
                  onClick={() => removeStarterFile(i)}
                  disabled={starterFiles.length === 1}
                  label={`Remove starter file ${i + 1}`}
                />
              </div>
              <Field label="Code" htmlFor={`starter-code-${i}`}>
                <CodeArea id={`starter-code-${i}`} value={f.code} onChange={(e) => updateStarterFile(i, { code: e.target.value })} />
              </Field>
            </div>
          ))}
          <AddButton onClick={addStarterFile} label="add starter file" />
        </section>

        {/* Hidden tests */}
        <section className="flex flex-col gap-4">
          <SectionHead>Hidden tests</SectionHead>
          <p className="text-[12px] -mt-2" style={{ color: C.muted }}>
            Never shown to solvers — these decide a pass. Each test's code runs with the
            student's export in scope (named after the starter file, e.g.{" "}
            <code style={{ color: C.purple, fontFamily: FONT_MONO }}>asyncHandler</code>), plus an{" "}
            <code style={{ color: C.purple, fontFamily: FONT_MONO }}>assert(cond, message)</code> helper.
          </p>
          {hiddenTests.map((t, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-sm" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
              <div className="flex items-end justify-between gap-3">
                <div className="flex-1">
                  <Field label="Test name" htmlFor={`test-name-${i}`}>
                    <TextInput id={`test-name-${i}`} value={t.name} onChange={(e) => updateHiddenTest(i, { name: e.target.value })} placeholder="calls only once after rapid fire" />
                  </Field>
                </div>
                <RemoveButton
                  onClick={() => removeHiddenTest(i)}
                  disabled={hiddenTests.length === 1}
                  label={`Remove hidden test ${i + 1}`}
                />
              </div>
              <Field label="Code" htmlFor={`test-code-${i}`}>
                <CodeArea id={`test-code-${i}`} value={t.code} onChange={(e) => updateHiddenTest(i, { code: e.target.value })} />
              </Field>
            </div>
          ))}
          <AddButton onClick={addHiddenTest} label="add hidden test" />
        </section>

        {/* Reference solution */}
        <section className="flex flex-col gap-4">
          <SectionHead>Reference solution</SectionHead>
          <Field label="Solution code" htmlFor="solutionCode" hint="Verified against your hidden tests before publish.">
            <CodeArea id="solutionCode" value={solutionCode} onChange={(e) => setSolutionCode(e.target.value)} />
          </Field>
          <Field label="Explanation" htmlFor="solutionExplanation" hint="Optional — shown to solvers after they pass.">
            <CodeArea id="solutionExplanation" value={solutionExplanation} onChange={(e) => setSolutionExplanation(e.target.value)} rows={4} />
          </Field>
        </section>

        {/* Hints */}
        <section className="flex flex-col gap-4">
          <SectionHead>Hints (optional)</SectionHead>
          {hints.map((h, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-sm" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
              <div className="flex items-start justify-between gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3 flex-1">
                  <Field label="Text" htmlFor={`hint-text-${i}`}>
                    <TextInput id={`hint-text-${i}`} value={h.text} onChange={(e) => updateHint(i, { text: e.target.value })} placeholder="Think about clearing the previous timeout." />
                  </Field>
                  <Field label="XP cost" htmlFor={`hint-cost-${i}`}>
                    <TextInput id={`hint-cost-${i}`} type="number" min={0} step={1} value={h.cost} onChange={(e) => updateHint(i, { cost: e.target.value })} />
                  </Field>
                </div>
                <RemoveButton onClick={() => removeHint(i)} label={`Remove hint ${i + 1}`} />
              </div>
            </div>
          ))}
          <AddButton onClick={addHint} label="add hint" />
        </section>

        {/* Validation + submit */}
        {errors.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 rounded-sm" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: C.muted, fontFamily: FONT_MONO }}>
              Fix before submitting
            </span>
            <ul className="flex flex-col gap-1">
              {errors.map((e, i) => (
                <li key={i} className="text-[12px]" style={{ color: C.amber }}>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {serverError && (
          <p className="text-[13px] font-bold" style={{ color: C.rose }}>
            {serverError}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="text-[12px] font-bold tracking-wide uppercase px-5 py-2.5 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: C.bg, background: C.purple, fontFamily: FONT_MONO }}
          >
            {submitting ? "Submitting…" : "Submit proposal"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/coding-challenges")}
            className="text-[12px] font-bold tracking-wide uppercase px-4 py-2.5 rounded-sm"
            style={{ color: C.muted, border: `1px solid ${C.border}`, fontFamily: FONT_MONO }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
