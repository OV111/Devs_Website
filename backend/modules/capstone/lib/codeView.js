/**
 * How a source file is shown to the AI: every line prefixed with its ORIGINAL
 * line number, minus blank lines and comment-only lines.
 *
 * Why drop them: the reviewer's budget is small, and blank lines and comments
 * are about 15% of a typical project. Keeping the original numbers (so gaps
 * appear) means "src/notes.js:42" in the review still links to line 42 on
 * GitHub. It also removes a place to hide persuasive text ("// this is secure")
 * from the code being judged. Trailing comments on a line of code are kept.
 */

const SLASH_STYLE = new Set([
  "js", "jsx", "mjs", "cjs", "ts", "tsx", "go", "rs", "java", "kt", "c", "h", "cc", "cpp", "hpp", "sol", "move", "proto",
  "dart", "swift", "cs",
]);
const HASH_STYLE = new Set(["py", "rb", "sh", "yml", "yaml", "toml", "vy"]);
const DASH_STYLE = new Set(["sql"]);

const styleOf = (path) => {
  const name = path.slice(path.lastIndexOf("/") + 1);
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  if (SLASH_STYLE.has(ext)) return "slash";
  if (HASH_STYLE.has(ext)) return "hash";
  if (DASH_STYLE.has(ext)) return "dash";
  return null; // json, md, … : shown as is
};

export const numberedCode = (text, path) => {
  const style = styleOf(path);
  const lines = text.split("\n");
  const out = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (style) {
      const s = line.trim();
      if (inBlockComment) {
        if (s.includes("*/")) inBlockComment = false;
        continue;
      }
      if (s === "") continue;
      if (style === "slash") {
        if (s.startsWith("//")) continue;
        if (s.startsWith("/*")) {
          const end = s.indexOf("*/");
          if (end === -1) {
            inBlockComment = true;
            continue;
          }
          // "/* note */ doSomething();" keeps its code
          if (s.slice(end + 2).trim() === "") continue;
        }
      } else if (style === "hash" && s.startsWith("#")) {
        continue;
      } else if (style === "dash" && s.startsWith("--")) {
        continue;
      }
    }
    out.push(`${i + 1}| ${line}`);
  }
  return out.join("\n");
};
