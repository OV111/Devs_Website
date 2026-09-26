import {
  Paperclip,
  Map,
  BarChart2,
  Target,
  BookOpen,
  Zap,
  ClipboardList,
  Crosshair,
  FileText,
} from "lucide-react";

/**
 * Attachment limits.
 *
 * These mirror the server-side limits in backend/validation/aiAgent.schemas.js —
 * the UI copy exists only to fail fast and show a friendly message. The server
 * is the enforcing authority; never rely on these alone.
 *
 * IMPORTANT: the agent runs on Groq `openai/gpt-oss-120b`, which is TEXT-ONLY.
 * There is no vision model on Groq, so images genuinely cannot be understood —
 * we reject them with an explanation rather than silently attaching nothing.
 */
export const ATTACHMENT_LIMITS = {
  MAX_FILES: 3,
  MAX_FILE_BYTES: 256 * 1024, // 256 KB raw file
  MAX_CHARS_PER_FILE: 8000, // ~2k tokens; truncated past this
  MAX_TOTAL_CHARS: 16000, // ~4k tokens across all files in one message
};

// Extensions we can meaningfully turn into text. Anything not listed is rejected.
export const ATTACHMENT_ACCEPTED_EXTENSIONS = [
  // plain text / data
  "txt", "md", "markdown", "json", "csv", "tsv", "log", "yml", "yaml", "xml", "toml", "ini", "env",
  // code
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "py", "java", "c", "h", "cpp", "hpp", "cs", "go", "rs",
  "rb", "php", "swift", "kt", "scala", "sh", "bash", "sql", "html", "css", "scss", "vue", "svelte",
];

/**
 * Chips and menu items carry a `prompt` — the text dropped into the composer.
 *
 * They are prompt shortcuts, not data browsers, and that is deliberate: the
 * agent already has tools for progress, weak spots, exam history and post
 * search, so building panels would duplicate verified tools. What users
 * actually lack is knowing the agent CAN do this — a shortcut solves that.
 *
 * Inserting the bare label (the old behaviour) sent the model a one-word
 * message like "Roadmap", which is a much worse prompt than a real question.
 */
export const CHIPS = [
  { label: "Challenges", icon: Zap,           prompt: "What coding challenges should I practice next, based on where I am?" },
  { label: "Weak Spots", icon: Crosshair,     prompt: "What are my weak spots, and what should I review first?" },
  { label: "Exams",      icon: ClipboardList, prompt: "How have my exams gone so far, and what did I get wrong?" },
  { label: "Blogs",      icon: FileText,      prompt: "Find me platform posts about " },
  { label: "Roadmap",    icon: Map,           prompt: "Where am I on my roadmap right now, and what's the next layer?" },
];

export const DROPDOWN_ITEMS = [
  {
    items: [
      { icon: Paperclip, label: "Attach file", arrow: false, shortcut: "Ctrl+U" },
    ],
  },
  {
    items: [
      { icon: Map,       label: "My roadmap",    arrow: false, prompt: "Show me my roadmap — which path am I on and what layers are left?" },
      { icon: BarChart2, label: "My progress",   arrow: false, prompt: "Where am I on my roadmap right now, and what's the next layer?" },
      { icon: Target,    label: "My weak spots", arrow: false, prompt: "What are my weak spots, and what should I review first?" },
    ],
  },
  {
    items: [
      // "Browse challenges" was removed deliberately: /coding-challenges already
      // is the catalog, so a browser here was duplicate navigation in a worse
      // place. The useful version is an agent TOOL ("you're weak on indexing,
      // try this challenge") that the model calls — not a menu item.
      { icon: BookOpen, label: "Search blogs", arrow: false, prompt: "Find me platform posts about " },
    ],
  },
];
