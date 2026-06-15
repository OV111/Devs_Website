import connectDB from "../config/db.js";
import { getUserProgress } from "../services/userProgressService.js";
import { getExamHistory } from "../services/examHistoryService.js";
import { getWeakSpots, addWeakSpot } from "../services/weakSpotService.js";

export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "search_posts",
      description: "Search community posts by keyword on DevsFlow. Use when the user asks about a topic and you want to surface relevant platform content.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "Category to search in (e.g. backend, javascript, devops)" },
          keyword: { type: "string", description: "Keyword or topic to search for" },
          limit: { type: "number", description: "Max results (default 5)" },
        },
        required: ["category", "keyword"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_library",
      description: "Search the DevsFlow learning library for books, docs, and guides. Use when the user needs resources to study a topic.",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string", description: "Keyword to search" },
          limit: { type: "number", description: "Max results (default 5)" },
        },
        required: ["keyword"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_profile",
      description: "Look up a DevsFlow user's public profile by username.",
      parameters: {
        type: "object",
        properties: {
          username: { type: "string", description: "Username to look up" },
        },
        required: ["username"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_user_progress",
      description: "Get the current user's roadmap progress — active path, current layer, completed layers. Call this when the user asks where they are in their learning journey.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_exam_history",
      description: "Get the current user's recent exam results, scores, and missed topics. Call this when the user asks why they failed or wants to review past exams.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Number of recent exams to fetch (default 5)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weak_spots",
      description: "Get the topics the current user has struggled with. Call this when the user asks what they should review or study next.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "log_weak_spot",
      description: "Record a topic the user is struggling with. Call this when the user reveals confusion about a specific concept during the conversation.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "The topic name to log as a weak spot" },
          path: { type: "string", description: "The roadmap path (e.g. backend)" },
          layer: { type: "string", description: "The layer id (e.g. api-dev-1)" },
        },
        required: ["topic"],
      },
    },
  },
];

// ctx = { db, userId } for user-aware tools; falls back to standalone DB for public tools
export async function executeTool(name, args, ctx = {}) {
  const db = ctx.db ?? (await connectDB());
  const userId = ctx.userId;

  if (name === "search_posts") {
    const { category, keyword, limit = 5 } = args;
    const posts = db.collection("defaultPosts");
    return posts
      .find({
        category: { $regex: category, $options: "i" },
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { content: { $regex: keyword, $options: "i" } },
        ],
      })
      .project({ title: 1, category: 1, author: 1 })
      .limit(limit)
      .toArray();
  }

  if (name === "search_library") {
    const { keyword, limit = 5 } = args;
    const library = db.collection("libraryResources");
    return library
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { topics: { $regex: keyword, $options: "i" } },
        ],
      })
      .project({ title: 1, description: 1, type: 1, difficulty: 1 })
      .limit(limit)
      .toArray();
  }

  if (name === "get_user_profile") {
    const { username } = args;
    const users = db.collection("users");
    const user = await users.findOne(
      { username },
      { projection: { firstName: 1, lastName: 1, username: 1, _id: 1 } },
    );
    if (!user) return { error: "User not found" };
    const stats = await db.collection("usersStats").findOne(
      { userId: user._id },
      { projection: { bio: 1, location: 1, githubLink: 1, followersCount: 1, postsCount: 1 } },
    );
    return { ...user, ...stats };
  }

  if (name === "get_user_progress") {
    if (!userId) return { error: "Not authenticated" };
    const progress = await getUserProgress(db, userId);
    return progress ?? { message: "No roadmap started yet" };
  }

  if (name === "get_exam_history") {
    if (!userId) return { error: "Not authenticated" };
    const limit = args.limit ?? 5;
    return getExamHistory(db, userId, limit);
  }

  if (name === "get_weak_spots") {
    if (!userId) return { error: "Not authenticated" };
    return getWeakSpots(db, userId);
  }

  if (name === "log_weak_spot") {
    if (!userId) return { error: "Not authenticated" };
    const { topic, path = "unknown", layer = "unknown" } = args;
    if (!topic || typeof topic !== "string") return { error: "topic is required" };
    await addWeakSpot(db, userId, { topic: topic.trim(), path, layer, source: "agent" });
    return { logged: true, topic };
  }

  return { error: `Unknown tool: ${name}` };
}
