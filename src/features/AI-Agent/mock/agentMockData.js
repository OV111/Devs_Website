export const MOCK_SESSIONS = [
  { id: "s1", title: "async error handling in express", createdAt: "12:04" },
  { id: "s2", title: "why my middleware order broke auth", createdAt: "09:32" },
  { id: "s3", title: "walk me through the event loop", createdAt: "Yesterday" },
  { id: "s4", title: "layer 3 exam — explain my fails", createdAt: "Yesterday" },
  { id: "s5", title: "REST API design for a blog", createdAt: "TUE" },
  { id: "s6", title: "JWT vs session cookies — which one", createdAt: "TUE" },
  { id: "s7", title: "explain closures with a real example", createdAt: "MON" },
  { id: "s8", title: "my for loop runs twice, why", createdAt: "MON" },
  { id: "s9", title: "how does DNS resolution actually work", createdAt: "MON" },
  { id: "s10", title: "postgres vs mongodb for my project", createdAt: "SUN" },
  { id: "s11", title: "debounce vs throttle differences", createdAt: "SUN" },
  { id: "s12", title: "layer 2 exam retake — feedback", createdAt: "SUN" },
  { id: "s13", title: "what even is a race condition", createdAt: "SAT" },
  { id: "s14", title: "TCP handshake step by step", createdAt: "SAT" },
  { id: "s15", title: "how to structure a node.js project", createdAt: "FRI" },
];

export const MOCK_MESSAGES = [
  {
    role: "user",
    content:
      "i keep getting tripped up on async error handling in express. when i throw inside an async route, my error middleware never fires. why?",
  },
  {
    role: "assistant",
    content:
      "Good catch — this is one of the most common Express gotchas. Before I answer directly, let me see if you've got the building block.\n\nWhen an async function throws, what does it actually return from the caller's perspective?",
  },
  {
    role: "user",
    content: "a promise? a rejected one i guess.",
  },
  {
    role: "assistant",
    content:
      "Exactly. Express's default error pipeline only sees errors passed to next(err) — synchronously, or that bubble up through synchronous throw. Your async handler returns a rejected promise, which Express (≤ v4) never inspects. So the rejection vanishes into the void.\n\nTwo fixes:\n1. Wrap manually — call next(err) in a catch.\n2. Use an asyncHandler wrapper — one helper applied to every route.\n\nTry the manual version first.",
  },
];

export const MOCK_TOPICS_MASTERED = [
  "EVENT_LOOP", "HTTP_BASICS", "MODULES", "NPM", "ROUTING", "REST", "CORS",
];

export const MOCK_WEAK_SPOTS = ["ASYNC_ERRORS", "STREAMS"];

export const MOCK_TOOLS = [
  { name: "get_user_progress", used: true },
  { name: "get_layer_content", used: false },
  { name: "search_platform_posts", used: true },
  { name: "get_exam_history", used: false },
  { name: "log_weak_spot", used: false },
];
