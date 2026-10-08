import { getGroqClient } from "../../config/groq.js";
import { toolDefinitions } from "../../tools/agentTools.js";
import {
  MODEL,
  buildSystemPrompt,
  composeUserMessage,
  describeActivity,
} from "../../services/agent/streamService.js";
import { withRetry } from "./withRetry.js";

const MAX_ROUNDS = 3;

/**
 * One mentor reply for one case, built with the REAL prompt-assembly functions
 * so the eval tests what production sends.
 *
 * The real tool definitions are offered because the system prompt tells the
 * model to use them; without them it invents tool use in prose or returns an
 * empty reply. Tool results are stubbed: this measures the prompt's behaviour,
 * not the database behind the tools.
 */
export const runMentor = async (c) => {
  const messages = [
    { role: "system", content: buildSystemPrompt(c.learnerSummary, describeActivity(c.activity)) },
    ...c.history,
    { role: "user", content: composeUserMessage(c.userMessage, c.attachments) },
  ];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const completion = await withRetry(() =>
      getGroqClient().chat.completions.create({
        model: MODEL,
        messages,
        tools: toolDefinitions,
        tool_choice: round === MAX_ROUNDS - 1 ? "none" : "auto",
        reasoning_effort: "low",
        max_tokens: 3000,
      }),
    );

    const msg = completion.choices?.[0]?.message;
    if (!msg?.tool_calls?.length) return msg?.content ?? "";

    messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
    for (const tc of msg.tool_calls) {
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify({ ok: true, note: "eval stub: no real data available" }),
      });
    }
  }
  return "";
};
