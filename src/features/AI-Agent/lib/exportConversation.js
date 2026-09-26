/**
 * Download the current conversation as a Markdown file.
 *
 * Markdown rather than JSON because the agent already answers in Markdown —
 * the file opens as a readable document instead of an escaped blob.
 */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "conversation";

export const buildMarkdown = (title, messages) => {
  const body = messages
    // tool_call entries are UI affordances, not conversation content
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      const heading = m.role === "user" ? "### You" : "### Agent";
      const files = m.attachments?.length
        ? `\n_Attached: ${m.attachments.map((a) => a.name).join(", ")}_\n`
        : "";
      return `${heading}\n${files}\n${m.content}`;
    })
    .join("\n\n---\n\n");

  return `# ${title}\n\n_Exported from DevsWebs Agent on ${new Date().toLocaleString()}_\n\n${body}\n`;
};

export const exportConversation = (title, messages) => {
  const blob = new Blob([buildMarkdown(title, messages)], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(title)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
