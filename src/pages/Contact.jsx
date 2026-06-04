import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, Github, Twitter, Linkedin } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay },
});

const SOCIALS = [
  {
    label: "GitHub",
    handle: "@devswebs",
    href: "#",
    Icon: Github,
  },
  {
    label: "Twitter / X",
    handle: "@devswebs",
    href: "#",
    Icon: Twitter,
  },
  {
    label: "LinkedIn",
    handle: "DevsWebs",
    href: "#",
    Icon: Linkedin,
  },
];

const TOPICS = [
  "General question",
  "Bug report",
  "Feature request",
  "Partnership",
  "Press inquiry",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen px-6 sm:px-10 md:px-20 lg:px-28 py-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <Motion.div className="text-center" {...fadeUp(0)}>
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-purple-500 mb-3">
            Get in touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            We'd love to hear<br className="hidden sm:block" /> from you
          </h1>
          <p className="mt-4 text-[15px] text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Whether you've found a bug, have a feature idea, or just want to say hello — drop us a message and we'll get back to you within 24 hours.
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form */}
          <Motion.div className="lg:col-span-3" {...fadeUp(0.1)}>
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[400px] rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center px-8">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <Send size={22} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Message sent!</h2>
                <p className="text-[14px] text-neutral-400 max-w-xs">
                  Thanks for reaching out. We'll reply to <span className="text-white">{form.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                  className="mt-2 text-[13px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-neutral-400">Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[13px] text-white placeholder:text-neutral-600 outline-none focus:border-purple-500/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-neutral-400">Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[13px] text-white placeholder:text-neutral-600 outline-none focus:border-purple-500/60 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Topic */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-400">Topic</label>
                  <select
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[13px] text-white outline-none focus:border-purple-500/60 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="" disabled className="bg-neutral-900">Select a topic…</option>
                    {TOPICS.map((t) => (
                      <option key={t} value={t} className="bg-neutral-900">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-neutral-400">Message</label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3 top-3.5 text-neutral-600" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 text-[13px] text-white placeholder:text-neutral-600 outline-none focus:border-purple-500/60 transition-colors resize-none"
                    />
                    <p className="text-right text-[11px] text-neutral-700 mt-1">
                      {form.message.length} / 1000
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  Send message
                </button>
              </form>
            )}
          </Motion.div>

          {/* Sidebar info */}
          <Motion.div className="lg:col-span-2 flex flex-col gap-6" {...fadeUp(0.15)}>

            {/* Direct email */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center">
                <Mail size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Email us directly</p>
                <p className="text-[12px] text-neutral-500 mt-0.5">For anything urgent or private.</p>
              </div>
              <a
                href="mailto:hello@devswebs.com"
                className="text-[13px] text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                hello@devswebs.com
              </a>
            </div>

            {/* Response time */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]" />
                <p className="text-[13px] font-semibold text-white">Typical response time</p>
              </div>
              <p className="text-[28px] font-bold text-white">
                &lt; 24h
              </p>
              <p className="text-[12px] text-neutral-500 leading-relaxed">
                We read every message and respond personally. No bots, no auto-replies.
              </p>
            </div>

            {/* Socials */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
              <p className="text-[13px] font-semibold text-white">Find us online</p>
              <div className="flex flex-col gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center group-hover:border-purple-500/50 group-hover:bg-purple-600/10 transition-colors">
                      <social.Icon size={14} className="text-neutral-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-neutral-300 group-hover:text-white transition-colors">{social.label}</p>
                      <p className="text-[11px] text-neutral-600">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </Motion.div>
        </div>
      </div>
    </div>
  );
}
