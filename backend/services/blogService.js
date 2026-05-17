import { ObjectId } from "mongodb";
export const buildBlogDocument = ({
  title,
  description,
  content,
  tags,
  category,
  difficulty,
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
    difficulty,
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

export const authorLookup = [
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
      pipeline: [
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$author",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "usersStats",
      localField: "author._id",
      foreignField: "userId",
      as: "authorProfile",
      pipeline: [
        {
          $project: {
            profileImage: 1,
            bio: 1,
            followersCount: 1,
          },
        },
      ],
    },
  },
  {
    $unwind: {
      path: "$authorProfile",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      "author.userName": "$author.username",
      "author.pictures": "$authorProfile.profileImage",
      "author.bio": "$authorProfile.bio",
      "author.followersCount": "$authorProfile.followersCount",
    },
  },
  {
    $project: {
      authorProfile: 0,
      "author.username": 0,
    },
  },
];

export const createBlogService = async (db, body, user, file) => {
  const blogs = db.collection("blogs");
  const users = db.collection("users");
  const statsCollection = db.collection("usersStats");

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
  // ✅ Ensure authorId is always a proper ObjectId
  const authorId =
    user._id instanceof ObjectId ? user._id : new ObjectId(String(user._id));

  const doc = buildBlogDocument({
    ...body,
    slug,
    tags: parsedTags,
    coverImage: file?.path ?? null,
    author: authorId,
  });
  const result = await blogs.insertOne(doc);
  const [authorData, statsData] = await Promise.all([
    users.findOne(
      { _id: authorId },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          username: 1,
          pictures: 1,
        },
      },
    ),
    statsCollection.findOne({ userId: authorId.toString() }),
  ]);
  return {
    ...doc,
    _id: result.insertedId,
    author: authorData
      ? {
          _id: authorData._id,
          firstName: authorData.firstName,
          lastName: authorData.lastName,
          userName: authorData.username,
          pictures: statsData?.profileImage ?? null,
        }
      : null,
  };
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
    .aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      ...authorLookup,
    ])
    .toArray();
  return {
    data: blogs,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      hasNextPage: pageNumber * limitNumber < total,
      hasPrevPage: pageNumber > 1,
    },
  };
};

export const getBlogByIdService = async (db, rawId) => {
  const blogs = db.collection("blogs");
  const [blog] = await blogs
    .aggregate([{ $match: { _id: new ObjectId(rawId) } }, ...authorLookup])
    .toArray();

  if (!blog) throw new Error("Blog not found");
  await blogs.updateOne({ _id: blog._id }, { $inc: { views: 1 } });

  return blog;
};

export const getBlogBySlugService = async (db, slug) => {
  const blogs = db.collection("blogs");

  const [blog] = await blogs
    .aggregate([{ $match: { slug, status: "published" } }, ...authorLookup])
    .toArray();

  if (!blog) throw new Error("Blog not found");

  await blogs.updateOne({ _id: blog._id }, { $inc: { views: 1 } });

  return blog;
};

export const toggleLikeService = async (db, blogId, userId) => {
  const blogs = db.collection("blogs");
  const id = new ObjectId(blogId);
  const uid = new ObjectId(userId);

  const blog = await blogs.findOne({ _id: id }, { projection: { likes: 1 } });
  if (!blog) throw new Error("Blog not found");

  const alreadyLiked = blog.likes.some((l) => l.toString() === uid.toString());

  await blogs.updateOne(
    { _id: id },
    alreadyLiked ? { $pull: { likes: uid } } : { $addToSet: { likes: uid } },
  );

  return {
    liked: !alreadyLiked,
    likesCount: alreadyLiked ? blog.likes.length - 1 : blog.likes.length + 1,
  };
};

export const getUserBlogsService = async (db, userId) => {
  const blogsCollection = db.collection("blogs");
  const blogs = await blogsCollection
    .aggregate([
      { $match: { author: new ObjectId(userId), status: "published" } },
      { $sort: { createdAt: -1 } },
      ...authorLookup,
    ])
    .toArray();
    return blogs;
};
