import { C, FONT_MONO } from "./arenaTheme";

/**
 * Challenge copy (description/task/constraints/hints) comes from the server
 * as plain HTML with bare `<code>` tags. Style them inline on the way in
 * rather than shipping a stylesheet rule the server-authored markup has to
 * know about.
 */
export function renderInlineCode(html) {
  return html
    .replace(
      /<code>/g,
      `<code style="background:#1e0a3c;border:1px solid #3b1e6e;border-radius:3px;padding:0 4px;color:${C.purple};font-family:${FONT_MONO};font-size:0.85em">`,
    )
    .replace(/<\/code>/g, "</code>");
}
