import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import "highlight.js/styles/github-dark.css";

/**
 * Renders an agent message as markdown.
 *
 * SECURITY: react-markdown does NOT render raw HTML unless you add `rehype-raw`.
 * We deliberately don't, so model output (which can be influenced by attached
 * files and other untrusted input) can never inject HTML or scripts. Don't add
 * rehype-raw here without adding rehype-sanitize alongside it.
 */

function CodeBlock({ language, code, children }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context) — fail silently */
    }
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/3">
        <span className="text-[11px] uppercase tracking-wider text-white/35">
          {language || "code"}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {/* overflow-x-auto so long lines scroll inside the block, never the page */}
      <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed">{children}</pre>
    </div>
  );
}

const components = {
  // `pre` is handled by the `code` renderer below, so unwrap it to avoid
  // nesting <pre> inside <pre>.
  pre: ({ children }) => children,

  code({ inline, className, children, ...props }) {
    const text = String(children ?? "").replace(/\n$/, "");
    const language = /language-(\w+)/.exec(className || "")?.[1];

    // react-markdown v10 doesn't always set `inline`; a code block always has a
    // language class or a newline, so fall back to that.
    const isBlock = inline === false || Boolean(language) || text.includes("\n");

    if (!isBlock) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-[13px] bg-white/8 text-purple-300 font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <CodeBlock language={language} code={text}>
        <code className={className} {...props}>
          {children}
        </code>
      </CodeBlock>
    );
  },

  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,

  h1: ({ children }) => <h1 className="text-[18px] font-semibold mt-4 mb-2 text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[16px] font-semibold mt-4 mb-2 text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="text-[15px] font-semibold mt-3 mb-1.5 text-white">{children}</h3>,
  h4: ({ children }) => <h4 className="text-[14px] font-semibold mt-3 mb-1.5 text-white">{children}</h4>,

  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through opacity-60">{children}</del>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      // noopener/noreferrer is required on target=_blank links, and doubly so
      // for model-generated URLs.
      rel="noopener noreferrer"
      className="text-purple-400 underline underline-offset-2 hover:text-purple-300"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-purple-500/40 pl-3 my-3 text-white/70 italic">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-4 border-white/10" />,

  // Tables must scroll inside their own container so a wide table never makes
  // the whole chat pane scroll sideways.
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-[13px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left font-semibold px-3 py-2 border-b border-white/10 text-white">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-3 py-2 border-b border-white/5">{children}</td>,

  input: ({ checked, type }) =>
    type === "checkbox" ? (
      <input type="checkbox" checked={checked} readOnly className="mr-1.5 accent-purple-500" />
    ) : null,
};

function MarkdownMessage({ content }) {
  return (
    /* Width is capped by the transcript column in MessageList, not here — a
       second cap would make agent text narrower than the user's bubbles. */
    <div className="text-[14px] w-full text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Markdown parsing runs on every render. During streaming the parent re-renders
// on each token, so memoizing keeps settled messages from re-parsing every time.
export default memo(MarkdownMessage);
