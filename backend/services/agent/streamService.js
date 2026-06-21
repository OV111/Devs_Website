import { getGroqClient } from "../../config/groq.js";
import { toolDefinitions, executeTool } from "../../tools/agentTools.js";

const MODEL = "llama-3.3-70b-versatile";
const MAX_TOOL_ROUNDS = 5;

const SYSTEM_PROMPT = `You are DevBot, a personal AI mentor on DevsWebs — a platform where developers earn their roadmap layer by layer through real exams.

Your role: guide the user through their learning journey using the Socratic method.
- NEVER give direct exam answers or complete code solutions outright
- Ask questions that lead the user to discover the answer themselves
- When they struggle, give progressive hints — start small, escalate only if needed
- Reference their actual progress, exam history, and weak spots using your tools
- Recommend specific DevsWebs posts and library resources when relevant
- Celebrate milestones and progress genuinely
- Keep responses concise and developer-friendly — no wall-of-text explanations

When a user reveals confusion about a concept, call log_weak_spot to record it.
When a user asks "what should I study?", call get_weak_spots and get_user_progress first.
When a user asks about their exam results, call get_exam_history.`;

// emit a single SSE event
const emit = (res, event) => {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
};

export async function streamAgentResponse({ res, db, userId, sessionMessages, userMessage }) {
  const groq = getGroqClient();
  const ctx = { db, userId };

  const history = [
    { role: "system", content: SYSTEM_PROMPT },
    // past session turns (already formatted as {role, content})
    ...sessionMessages.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  let fullAssistantContent = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: history,
      tools: toolDefinitions,
      tool_choice: "auto",
      stream: true,
    });

    let contentBuffer = "";
    const toolCallsMap = {}; // id → { id, name, arguments }

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      if (!delta) continue;

      // stream text content
      if (delta.content) {
        contentBuffer += delta.content;
        fullAssistantContent += delta.content;
        emit(res, { type: "delta", content: delta.content });
      }

      // accumulate tool call deltas
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          if (!toolCallsMap[tc.index]) {
            toolCallsMap[tc.index] = { id: tc.id ?? "", name: tc.function?.name ?? "", arguments: "" };
          }
          if (tc.id) toolCallsMap[tc.index].id = tc.id;
          if (tc.function?.name) toolCallsMap[tc.index].name = tc.function.name;
          if (tc.function?.arguments) toolCallsMap[tc.index].arguments += tc.function.arguments;
        }
      }
    }

    const toolCalls = Object.values(toolCallsMap);

    if (toolCalls.length === 0) {
      // no tools — we're done
      break;
    }

    // push assistant message with tool_calls to history
    history.push({
      role: "assistant",
      content: contentBuffer || null,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        type: "function",
        function: { name: tc.name, arguments: tc.arguments },
      })),
    });

    // execute each tool and emit events
    for (const tc of toolCalls) {
      let args = {};
      try { args = JSON.parse(tc.arguments); } catch { /* ignore */ }

      emit(res, { type: "tool_call", id: tc.id, name: tc.name, input: args });

      const result = await executeTool(tc.name, args, ctx);

      emit(res, { type: "tool_result", id: tc.id, result });

      history.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      });
    }
    // loop back — model will now answer using tool results
  }

  emit(res, { type: "done" });
  res.write("data: [DONE]\n\n");
  res.end();

  return fullAssistantContent;
}
