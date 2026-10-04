import connectDB from "../config/db.js";
import { getUserProgress } from "../services/userProgressService.js";
import { getExamHistory } from "../services/examHistoryService.js";
import { getWeakSpots, addWeakSpot } from "../services/weakSpotService.js";
import {
  getLearnerContext,
  getTopicDetail,
} from "../services/agent/learnerContextService.js";
import { recomputeMastery, getMastery } from "../services/learnerMasteryService.js";
import { getConcept, getConcepts } from "../services/conceptService.js";
import { logTeachingAttempt } from "../services/agent/teachingLogService.js";
import { toTopicSlug } from "../utils/topicKey.js";
import { escapeRegex } from "../utils/regex.js";
import { getCapstoneMentorView } from "../modules/capstone/index.js";

export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "get_capstone_status",
      description:
        "Get the learner's capstone project status: attempt state, AI review scores and feedback per rubric criterion, and their last defense result. Call this when they ask about their capstone, its review, or why it failed. Coach from the feedback Socratically — never write capstone code or draft defense answers.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_posts",
      description: "Search community posts by keyword on Vahoha. Use when the user asks about a topic and you want to surface relevant platform content.",
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
      description: "Search the Vahoha learning library for books, docs, and guides. Use when the user needs resources to study a topic.",
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
      description: "Look up a Vahoha user's public profile by username.",
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
      name: "get_learner_context",
      // The compact summary is already in the system prompt on every turn, so
      // this tool is the DRILL-IN path only. Saying that in the description is
      // what stops the model re-fetching context it can already see.
      description:
        "Drill into the learner's evidence beyond the summary already provided to you. Pass topicSlug (e.g. 'jwt-signature') to get the per-criterion breakdown of what exactly they got wrong on a topic, including detected misconceptions. Omit topicSlug for the full cross-platform picture. Do NOT call this just to re-read the summary you already have.",
      parameters: {
        type: "object",
        properties: {
          topicSlug: {
            type: "string",
            description:
              "Canonical topic key from the context summary, e.g. 'jwt-signature'. Use when the user asks what specifically they got wrong on one topic.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_concept",
      description:
        "Look up Vahoha's authored domain knowledge for a concept: its definition, purpose, prerequisites, and the known misconceptions WITH the authored correction for each. Call this before teaching or correcting a topic, especially when the learner's state lists a misconception — the correction here is the platform's canonical explanation and should shape your answer.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Concept id / topic slug, e.g. 'jwt-signature'.",
          },
          includePrerequisites: {
            type: "boolean",
            description:
              "Also return the concepts this one builds on. Use when the learner's confusion may actually be in a prerequisite.",
          },
        },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_teaching_attempt",
      description:
        "Record HOW you just explained something, so future conversations do not repeat an explanation that already failed. Call this after you teach or correct a concept, describing your angle in a few words (e.g. 'jwt.io decode demo showing readable payload'). Do not record whether it worked — that is measured from their later assessments, not from your judgement.",
      parameters: {
        type: "object",
        properties: {
          topicSlug: {
            type: "string",
            description: "Canonical topic slug, e.g. 'jwt-signature'.",
          },
          approach: {
            type: "string",
            description:
              "Short description of the angle you used — the analogy, example, or question. Not the full explanation.",
          },
          misconceptionId: {
            type: "string",
            description: "The misconception id you were correcting, if any.",
          },
        },
        required: ["topicSlug", "approach"],
      },
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
    const posts = db.collection("posts-default");
    return posts
      .find({
        category: { $regex: escapeRegex(category), $options: "i" },
        $or: [
          { title: { $regex: escapeRegex(keyword), $options: "i" } },
          { content: { $regex: escapeRegex(keyword), $options: "i" } },
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
          { title: { $regex: escapeRegex(keyword), $options: "i" } },
          { description: { $regex: escapeRegex(keyword), $options: "i" } },
          { topics: { $regex: escapeRegex(keyword), $options: "i" } },
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
      // _id: 0 — without it the stats document's own _id overwrites the user's
      // _id in the spread below, handing the model the wrong identifier.
      // The field list stays a whitelist so private stats never reach the model.
      { projection: { _id: 0, bio: 1, location: 1, githubLink: 1, followersCount: 1, postsCount: 1 } },
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

  if (name === "get_learner_context") {
    if (!userId) return { error: "Not authenticated" };

    if (args.topicSlug) {
      // Deliberately its own read rather than a filter over the memoized
      // summary context: that one is capped for prompt cost, so an older topic
      // may not appear in it, and answering "untested" for a topic the learner
      // actually failed months ago would be worse than the extra query.
      const detail = await getTopicDetail(db, userId, args.topicSlug);
      return detail ?? { error: "Unrecognised topic slug" };
    }

    // Reuse the context already assembled for this turn's system prompt when
    // the caller supplied it — otherwise this is the second identical set of
    // five queries in one request.
    return ctx.loadLearnerContext
      ? ctx.loadLearnerContext()
      : getLearnerContext(db, userId);
  }

  if (name === "get_concept") {
    // Domain knowledge is platform-wide, not per-learner, so this one needs no
    // auth check — there is nothing about the user in it.
    const concept = await getConcept(db, args.slug);
    if (!concept) {
      // Say so explicitly rather than returning null: the model must fall back to
      // its own knowledge knowingly, not silently treat an empty result as
      // "this concept has no misconceptions".
      return { found: false, slug: args.slug, message: "No authored concept for this slug." };
    }

    if (!args.includePrerequisites || !concept.prerequisites?.length) {
      return { found: true, ...concept };
    }

    return {
      found: true,
      ...concept,
      prerequisiteConcepts: await getConcepts(db, concept.prerequisites),
    };
  }

  if (name === "log_teaching_attempt") {
    if (!userId) return { error: "Not authenticated" };

    // Capture the topic's CURRENT status as the baseline the outcome is measured
    // against later. Read from stored mastery, so the mentor is not the one
    // deciding what state the learner was in when it taught them.
    const slug = toTopicSlug(args.topicSlug);
    const mastery = await getMastery(db, userId);
    const statusAtTime = mastery.find((t) => t.slug === slug)?.status ?? null;

    const logged = await logTeachingAttempt(db, userId, {
      topicSlug: args.topicSlug,
      approach: args.approach,
      misconceptionId: args.misconceptionId ?? null,
      statusAtTime,
      sessionId: ctx.sessionId ?? null,
    });

    if (!logged) return { error: "topicSlug and approach are both required" };
    return { logged: true, topicSlug: logged.slug, statusAtTime };
  }

  if (name === "log_weak_spot") {
    if (!userId) return { error: "Not authenticated" };
    const { topic, path = "unknown", layer = "unknown" } = args;
    if (!topic || typeof topic !== "string") return { error: "topic is required" };
    await addWeakSpot(db, userId, { topic: topic.trim(), path, layer, source: "agent" });

    // Confusion revealed in conversation is evidence like any other, so the
    // Adaptive Engine has to see it — otherwise the topic the mentor JUST logged
    // is absent from the context of the learner's very next message.
    try {
      await recomputeMastery(db, userId);
    } catch (err) {
      console.error("mastery recompute after log_weak_spot failed:", err);
    }

    return { logged: true, topic };
  }

  if (name === "get_capstone_status") {
    if (!userId) return { error: "Not authenticated" };
    return getCapstoneMentorView(db, userId);
  }

  return { error: `Unknown tool: ${name}` };
}
