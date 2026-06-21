import { getGroqClient } from "../config/groq.js";
import { toolDefinitions, executeTool } from "../tools/agentTools.js";

const MODEL = "llama-3.3-70b-versatile";
const MAX_TOOL_ROUNDS = 5;

const SYSTEM_PROMPT = `You are DevBot, an AI assistant for DevsWebs — a social platform built for developers.
You help users find posts, library resources, and developer profiles on the platform.
Keep answers concise and developer-friendly. When referencing platform content, cite titles.`;

export async function runAgentChat(messages) {
  const groq = getGroqClient();
  const history = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: history,
      tools: toolDefinitions,
      tool_choice: "auto",
    });

    const choice = response.choices[0];
    const assistantMsg = choice.message;
    history.push(assistantMsg);

    if (choice.finish_reason !== "tool_calls" || !assistantMsg.tool_calls?.length) {
      return assistantMsg.content;
    }

    for (const call of assistantMsg.tool_calls) {
      const args = JSON.parse(call.function.arguments);
      const result = await executeTool(call.function.name, args);
      history.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  // Fallback: ask for final answer without tools
  const fallback = await groq.chat.completions.create({
    model: MODEL,
    messages: history,
  });
  return fallback.choices[0].message.content;
}
