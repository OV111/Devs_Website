import { useState } from "react";
import { motion as Motion } from "motion/react";
import { Mail, Send, Github, CheckCircle2 } from "lucide-react";
import XLogo from "../components/ui/XLogo";
import { API_BASE_URL } from "../../constants/api";
import { SITE } from "../../constants/site";

// Must match CONTACT_TOPICS in backend/modules/contact/schemas/contact.schemas.js
// — the server rejects anything else with a 400.
const TOPICS = ["General question", "Bug report", "Feature request", "Partnership", "Other"];
const MAX_MESSAGE = 1000;
const EMPTY_FORM = { name: "", email: "", topic: "", message: "", website: "" };

const SOCIALS = [
  { label: "X", ...SITE.socials.x, Icon: XLogo },
  { label: "GitHub", ...SITE.socials.github, Icon: Github },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition-colors focus:border-purple-500/60";

const Field = ({ label, htmlFor, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-xs font-medium text-neutral-400">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  // "idle" | "sending" | "sent" | "error" — one status instead of several
  // booleans that could contradict each other (sending AND sent).
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState({ field: null, message: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError({ field: null, message: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError({ field: body.field ?? null, message: body.message ?? "Something went wrong." });
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError({ field: null, message: "Network error. Check your connection and try again." });
      setStatus("error");
    }
  };

  const fieldError = (name) => (error.field === name ? error.message : null);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-20">
      <Motion.header className="flex flex-col items-center gap-4 text-center" {...fadeUp()}>
        <span className="text-sm font-medium text-neutral-400">Contact</span>
        <h1
          className="text-4xl font-[450] tracking-tight text-white sm:text-5xl"
          style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
        >
          Talk to the person building it.
        </h1>
        <p className="max-w-xl text-neutral-400">
          Found a bug, have an idea, or want to try Vahoha with your students?
          Every message is read by a human, not a bot.
        </p>
      </Motion.header>

      <div className="grid gap-8 lg:grid-cols-5">
        <Motion.div className="lg:col-span-3" {...fadeUp(0.1)}>
          {status === "sent" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 px-8 text-center">
              <CheckCircle2 size={36} className="text-purple-400" />
              <h2 className="text-xl font-medium text-white">Message sent</h2>
              <p className="max-w-xs text-sm text-neutral-400">
                Thanks, {form.name}. I&apos;ll reply to{" "}
                <span className="text-white">{form.email}</span>.
              </p>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setStatus("idle");
                }}
                className="mt-2 cursor-pointer text-sm text-purple-400 transition-colors hover:text-purple-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="contact-name" error={fieldError("name")}>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" htmlFor="contact-email" error={fieldError("email")}>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Topic" htmlFor="contact-topic" error={fieldError("topic")}>
                <select
                  id="contact-topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>
                    Select a topic…
                  </option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message" htmlFor="contact-message" error={fieldError("message")}>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={MAX_MESSAGE}
                  rows={6}
                  placeholder="What's on your mind?"
                  className={`${inputClass} resize-none`}
                />
                <p className="text-right text-[11px] text-neutral-600">
                  {form.message.length} / {MAX_MESSAGE}
                </p>
              </Field>

              {/* Honeypot: invisible to people and skipped by keyboard and
                  screen readers. Bots fill every field, which marks them. */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {status === "error" && !error.field && (
                <p role="alert" className="text-sm text-red-400">
                  {error.message}{" "}
                  <a href={`mailto:${SITE.email}`} className="underline">
                    Email instead
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-60"
              >
                <Send size={14} />
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </Motion.div>

        <Motion.aside className="flex flex-col gap-4 lg:col-span-2" {...fadeUp(0.15)}>
          <div className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
            <Mail size={18} className="text-purple-400" />
            <p className="mt-2 text-sm font-medium text-white">Email directly</p>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm break-all text-purple-400 transition-colors hover:text-purple-300"
            >
              {SITE.email}
            </a>
            <p className="text-xs text-neutral-500">Usually answered within 1–2 days.</p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm font-medium text-white">Follow along</p>
            {SOCIALS.map(({ label, handle, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 transition-colors group-hover:border-purple-500/50">
                  <Icon size={15} className="text-neutral-400 transition-colors group-hover:text-purple-400" />
                </span>
                <span>
                  <span className="block text-sm text-neutral-200 group-hover:text-white">{label}</span>
                  <span className="block text-xs text-neutral-500">{handle}</span>
                </span>
              </a>
            ))}
          </div>
        </Motion.aside>
      </div>
    </div>
  );
};

export default Contact;
