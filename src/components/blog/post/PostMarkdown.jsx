import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import "highlight.js/styles/github-dark.css";
import { slugify } from "./postModel.js";

/**
 * Renders a post's markdown for reading.
 *
 * SECURITY: react-markdown does not render raw HTML unless `rehype-raw` is
 * added, and we deliberately don't, so a post can never inject markup or
 * scripts. Don't add rehype-raw here without rehype-sanitize alongside it.
 */

const textOf = (node) =>
  typeof node === "string"
    ? node
    : Array.isArray(node)
      ? node.map(textOf).join("")
      : node?.props?.children
        ? textOf(node.props.children)
        : "";

function CodeBlock({ language, code, children }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the code is still selectable */
    }
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-neutral-800 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] uppercase tracking-wider text-white/40">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Code copied" : "Copy code"}
          className="flex cursor-pointer items-center gap-1.5 text-[11px] text-white/50 transition-colors hover:text-white"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {/* Long lines scroll inside the block, never the page. */}
      <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed">{children}</pre>
    </div>
  );
}

const heading = (Tag) =>
  function Heading({ children }) {
    const text = textOf(children);
    const id = slugify(text);
    return (
      // data-toc-title keeps the "#" link out of the table of contents entry.
      <Tag id={id} data-toc-title={text} className="group scroll-mt-24">
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ml-2 text-neutral-400 no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      </Tag>
    );
  };

const components = {
  // `code` renders the block (and its <pre>), so unwrap react-markdown's own <pre>.
  pre: ({ children }) => children,

  code({ inline, className, children, ...props }) {
    const text = String(children ?? "").replace(/\n$/, "");
    const language = /language-(\w+)/.exec(className || "")?.[1];
    const isBlock = inline === false || Boolean(language) || text.includes("\n");

    if (!isBlock) {
      return (
        <code
          className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.88em] font-medium text-purple-700 before:content-none after:content-none dark:bg-neutral-800 dark:text-purple-300"
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

  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),

  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },

  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ""} loading="lazy" className="rounded-xl" />
  ),

  // A wide table scrolls inside its own box instead of widening the page.
  table: ({ children }) => (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 text-left font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-neutral-100 px-4 py-2.5 text-neutral-700 last:border-b-0 dark:border-neutral-900 dark:text-neutral-300">
      {children}
    </td>
  ),
};

// Posts are often typed with a single newline between lines, which markdown
// folds into one paragraph. Turn those into hard breaks (two trailing spaces),
// but leave code fences untouched so copied code stays exact.
const keepLineBreaks = (markdown) => {
  let inFence = false;
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  return lines
    .map((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      const next = lines[i + 1];
      const breaksParagraph = inFence || !line.trim() || next === undefined || !next.trim();
      return breaksParagraph || line.endsWith("  ") ? line : `${line}  `;
    })
    .join("\n");
};

const PostMarkdown = memo(function PostMarkdown({ content, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={components}
      >
        {keepLineBreaks(content)}
      </ReactMarkdown>
    </div>
  );
});

export default PostMarkdown;
