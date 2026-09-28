import { getGroqClient } from "../../config/groq.js";

/**
 * Conversation titling.
 *
 * Deliberately a SMALL model: naming a chat is a trivial summarisation task and
 * the 120b buys nothing here, while being slower. This call is fired in parallel
 * with the main answer so it adds no latency to the user's reply.
 */
const TITLE_MODEL = "openai/gpt-oss-20b";

/** Hard ceiling so a runaway response can't become a 500-char sidebar row. */
const MAX_TITLE_CHARS = 60;

/** Longest slice of the user's message we bother sending to the titler. */
const MAX_INPUT_CHARS = 500;

const SYSTEM_PROMPT = `You write short titles for developer chat conversations.

Rules:
- 3 to 6 words
- A noun phrase describing the TOPIC, not a sentence and not a reply
- Title Case
- No quotes, no trailing punctuation, no emoji
- Never answer the message or address the user

Examples:
"hey so my express route keeps returning 404 and i cant work out why" -> Express Route 404 Debugging
"what is a database index?" -> Database Index Basics
"can you review this react component for me" -> React Component Review
"i need help with text for my website homepage" -> Website Homepage Copy`;

/**
 * Strip the things small models add despite being told not to.
 * Returns null when nothing usable survives, so the caller keeps its fallback.
 */
export const sanitizeTitle = (raw) => {
  if (!raw || typeof raw !== "string") return null;

  let title = raw
    .trim()
    // A model that ignores "no quotes" usually wraps the whole thing
    .replace(/^["'`]+|["'`]+$/g, "")
    // "Title: Foo" / "Here's a title: Foo"
    .replace(/^.*?\btitles?\s*:\s*/i, "")
    // Collapse newlines — sometimes it "explains" on a second line
    .split("\n")[0]
    .trim()
    // Trailing punctuation
    .replace(/[.!?,;:]+$/, "")
    .trim();

  if (!title) return null;
  // A "title" that long is the model answering the question instead of naming it.
  if (title.length > 120) return null;

  return title.slice(0, MAX_TITLE_CHARS).trim();
};

/**
 * Generate a title from the user's first message.
 *
 * Never throws — titling is cosmetic, so any failure returns null and the caller
 * keeps whatever placeholder it already showed.
 */
export const generateTitle = async (userMessage) => {
  try {
    const groq = getGroqClient();

    const res = await groq.chat.completions.create({
      model: TITLE_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: String(userMessage).slice(0, MAX_INPUT_CHARS) },
      ],
      // gpt-oss is a REASONING model: it spends completion tokens thinking
      // before it emits any content. Without reasoning_effort "low" it burns
      // 150+ tokens reasoning about a 4-word title and returns content: ""
      // with finish_reason "length". Both settings below are load-bearing —
      // max_tokens has to cover reasoning AND the title, not just the title.
      reasoning_effort: "low",
      max_tokens: 80,
      temperature: 0.3,
    });

    return sanitizeTitle(res.choices?.[0]?.message?.content);
  } catch (err) {
    console.error("generateTitle error:", err?.message ?? err);
    return null;
  }
};
