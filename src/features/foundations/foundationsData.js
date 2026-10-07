// The core cards live in constants/Categories.js (FUNDAMENTALS_CONCEPTS) and are
// not edited. This file layers the AI-era angle on top of them:
//   - AI_ERA_NOTES: one "why it matters now" line per core card, keyed by title
//   - AI_ERA_SKILLS: new cards that only exist because AI writes code now
// buildFoundations() merges both into one list shaped like:
//   { icon, title, desc, difficulty, group: "core" | "ai", aiNote?: string }

import { FUNDAMENTALS_CONCEPTS } from "../../../constants/Categories.js";

export const AI_ERA_NOTES = {
  "Binary & Number Systems": "Explains why models quantize weights and why floats lose precision.",
  "How Computers Work": "Tells you why a model call is slow, costly, and memory-hungry.",
  "Version Control": "Your safety net when an AI edit rewrites 40 files at once.",
  "Networking Basics": "Every LLM call is an HTTP request: timeouts, retries, streaming.",
  "Big O Complexity": "Spot the quadratic loop AI wrote that passes the demo and dies in prod.",
  "Programming Paradigms": "Lets you judge whether generated code fits your codebase's style.",
  "Data Structures": "Choosing the right structure is still your call, not the model's.",
  Algorithms: "You can't review a solution you couldn't have reasoned toward.",
  Databases: "AI writes queries fast; you catch the missing index and the bad schema.",
  "Security Basics": "AI code ships leaked secrets and injection holes with full confidence.",
  Testing: "The only honest way to trust code you did not write.",
  "Operating Systems": "Debugging a hung process still needs you, not the chat window.",
  "APIs & Protocols": "Tool use and agents are APIs talking to APIs.",
  "Compilers & Interpreters": "Helps you read the errors the model can't explain.",
  "Package Management": "Models hallucinate package names; attackers register them.",
  "Concurrency & Async": "Generated async code looks right and races anyway.",
  "Command Line": "Agents run shell commands. You must know what they are doing.",
  "Design Patterns": "A shared vocabulary to direct AI and review what it builds.",
  "Calculus for ML": "Gradients are how models learn; the math hasn't changed.",
  "Linear Algebra": "Embeddings and attention are matrix operations.",
  "Statistics & Probability": "The base for evals: is this model really better, or just lucky?",
};

export const AI_ERA_SKILLS = [
  {
    icon: "💬",
    title: "Prompting & Context",
    desc: "Writing instructions a model can follow: goals, constraints, examples, and the right context in the window.",
    difficulty: "beginner",
  },
  {
    icon: "🔍",
    title: "Reviewing AI-Written Code",
    desc: "Read generated code like a pull request from a confident junior: check logic, edge cases, and what it silently assumed.",
    difficulty: "medium",
  },
  {
    icon: "🐞",
    title: "Debugging Code You Didn't Write",
    desc: "Form a hypothesis, narrow it down, and fix the real cause instead of re-prompting until it stops failing.",
    difficulty: "medium",
  },
  {
    icon: "🔌",
    title: "LLM APIs & Tool Use",
    desc: "Calling models from code: messages, streaming, structured output, function calling, and handling failures and cost.",
    difficulty: "medium",
  },
  {
    icon: "📏",
    title: "Evals & Hallucination Checks",
    desc: "Measure whether an AI feature works: test sets, graders, and ways to catch confident wrong answers.",
    difficulty: "hard",
  },
  {
    icon: "🛡️",
    title: "AI Security",
    desc: "Prompt injection, leaked secrets, over-permissioned agents, and untrusted model output used as code.",
    difficulty: "hard",
  },
];

// Skills for building real software, beyond writing a function. Each card
// carries its own aiNote because these are new cards, not entries in
// Categories.js.
export const ENGINEERING_SKILLS = [
  {
    icon: "🏛️",
    title: "System Design",
    desc: "Break a product into services, data stores and queues, and reason about load, latency and failure before you build.",
    difficulty: "hard",
    aiNote: "AI drafts components fast; you decide the trade-offs it can't see.",
  },
  {
    icon: "🧱",
    title: "Software Architecture",
    desc: "Layers, boundaries, monolith vs services, and how to keep a codebase changeable as it grows.",
    difficulty: "hard",
    aiNote: "Generated code piles up without a structure to hold it. You own the structure.",
  },
  {
    icon: "🔗",
    title: "API Design",
    desc: "Resources, versioning, pagination, errors and idempotency: contracts other people build on.",
    difficulty: "medium",
    aiNote: "Models copy popular API habits, including the bad ones.",
  },
  {
    icon: "🚀",
    title: "Scalability & Caching",
    desc: "Horizontal scaling, load balancing, caches and where the real bottleneck is.",
    difficulty: "hard",
    aiNote: "Premature scaling is easy to generate. Knowing what to measure first is not.",
  },
  {
    icon: "🧼",
    title: "Clean Code & Refactoring",
    desc: "Naming, small functions, removing duplication and changing code safely under tests.",
    difficulty: "medium",
    aiNote: "AI adds code faster than anyone deletes it. Refactoring keeps it readable.",
  },
  {
    icon: "👀",
    title: "Code Review",
    desc: "Give and take review: spot risk, ask the right questions and keep changes small.",
    difficulty: "beginner",
    aiNote: "Every AI change is a pull request you must actually review.",
  },
  {
    icon: "📦",
    title: "Containers & CI/CD",
    desc: "Docker, build pipelines and automated deploys so shipping is boring and repeatable.",
    difficulty: "medium",
    aiNote: "Pipelines are your guard rail when changes arrive at AI speed.",
  },
  {
    icon: "📡",
    title: "Observability & Production Debugging",
    desc: "Logs, metrics and traces: find out what a live system is doing and why it broke.",
    difficulty: "medium",
    aiNote: "AI can't see your production. Telemetry is how you find out what it did there.",
  },
  {
    icon: "🛟",
    title: "Reliability & Failure Handling",
    desc: "Timeouts, retries, backoff, rate limits and graceful degradation when dependencies fail.",
    difficulty: "hard",
    aiNote: "Generated happy-path code rarely handles the failure paths.",
  },
  {
    icon: "📬",
    title: "Queues & Event-Driven Design",
    desc: "Background jobs, message queues and events: decouple work and survive spikes.",
    difficulty: "hard",
    aiNote: "Async pipelines multiply the bugs AI can't reproduce for you.",
  },
  {
    icon: "📝",
    title: "Technical Writing & Decisions",
    desc: "READMEs, design docs and architecture decision records that explain why, not just what.",
    difficulty: "beginner",
    aiNote: "AI writes the docs. You decide what is true and worth recording.",
  },
];

export const buildFoundations = () => [
  ...FUNDAMENTALS_CONCEPTS.map((card) => ({
    ...card,
    group: "core",
    aiNote: AI_ERA_NOTES[card.title],
  })),
  ...ENGINEERING_SKILLS.map((card) => ({ ...card, group: "eng" })),
  ...AI_ERA_SKILLS.map((card) => ({ ...card, group: "ai" })),
];

export const FOUNDATIONS_FAQ = [
  {
    q: "If AI writes my code, why learn fundamentals?",
    a: "Because someone has to judge the output. Reviewing, debugging and directing AI all require knowing what correct looks like. Fundamentals are that judgment.",
  },
  {
    q: "Where should I start?",
    a: "Begin with the beginner cards: How Computers Work, Version Control, Networking, Command Line. Then pick the AI-era skills once you can read code comfortably.",
  },
  {
    q: "Is this a replacement for a roadmap?",
    a: "No. Foundations is the shared base. When you are ready, pick a roadmap and the gated exams take over.",
  },
];
