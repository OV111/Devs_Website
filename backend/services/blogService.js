import { paginationClasses } from "@mui/material";
import { data } from "react-router-dom";

export const buildBlogDocument = ({
  title,
  description,
  content,
  tags,
  category,
  status,
  coverImage,
  author,
  slug,
}) => {
  const words = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;

  return {
    title,
    slug,
    category,
    description,
    content,
    tags,
    status: status || "draft",
    author,
    readTime: Math.max(1, Math.ceil(words / 200)),
    coverImage: coverImage ?? null,
    likes: [],
    views: 0,
    wordCount: words,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createBlogService = async (db, body, user, file) => {
  const blogs = db.collection("blogs");

  if (!body.title || !body.content || !body.category) {
    throw new Error("Title, content and category are required");
  }
  let parsedTags = [];
  try {
    parsedTags = Array.isArray(body.tags)
      ? body.tags
      : JSON.parse(body.tags || "[]");
  } catch {
    parsedTags = [];
  }
  const baseSlug = body.title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (await blogs.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  const doc = buildBlogDocument({
    ...body,
    slug,
    tags: parsedTags,
    coverImage: file?.path ?? null,
    author: user._id,
  });
  const result = await blogs.insertOne(doc);
  return { ...doc, _id: result.insertedId };
};

export const getBlogsService = async (db, query) => {
  const { category, tag, page = 1, limit = 10 } = query;

  const pageNumber = Math.max(1, +page);
  const limitNumber = Math.min(100, Math.max(1, +limit));
  const filter = { status: "published" };
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: Array.isArray(tag) ? tag : [tag] };

  const blogsCollection = db.collection("blogs");
  const total = await blogsCollection.countDocuments(filter);

  const blogs = await blogsCollection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((+pageNumber - 1) * +limitNumber)
    .limit(+limitNumber)
    .toArray();
  return {
    data: blogs,
    pagination: {
      total,
      page: +pageNumber,
      limit: +limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      hasNextPage: +pageNumber * +limitNumber < total,
      hasPrevPage: +pageNumber > 1,
    },
  };
};

export const getBlogBySlugService = async (db, slug) => {
  const blogs = db.collection("blogs");
  const blog = await blogs.findOne({ slug, status: "published" });

  if (!blog) {
    throw new Error("Blog not found");
  }
  await blogs.updateOne({ _id: blog._id }, { $inc: { views: 1 } });

  return blog;
};
