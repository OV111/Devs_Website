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
    comments: [],
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
    statsCollection.findOne({ userId: authorId }),
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
  const { category, tag, page = 1, limit = 10, difficulty, readTime, sort, filter } = query;

  const pageNumber = Math.max(1, +page);
  const limitNumber = Math.min(100, Math.max(1, +limit));
  const matchFilter = { status: "published" };
  if (category) matchFilter.category = category;
  if (tag) matchFilter.tags = { $in: Array.isArray(tag) ? tag : [tag] };
  if (difficulty) matchFilter.difficulty = difficulty;
  if (readTime === "< 5 min") matchFilter.readTime = { $lt: 5 };
  else if (readTime === "5–10 min") matchFilter.readTime = { $gte: 5, $lte: 10 };
  else if (readTime === "10+ min") matchFilter.readTime = { $gt: 10 };

  const blogsCollection = db.collection("blogs");
  const total = await blogsCollection.countDocuments(matchFilter);

  const effectiveSort = sort || filter;
  let pipeline;
  if (effectiveSort === "Popular") {
    pipeline = [
      { $match: matchFilter },
      { $addFields: { _likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { _likesCount: -1 } },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      { $project: { _likesCount: 0 } },
      ...authorLookup,
    ];
  } else {
    let sortStage;
    if (effectiveSort === "Oldest") sortStage = { createdAt: 1 };
    else if (effectiveSort === "Most Viewed" || effectiveSort === "Trending") sortStage = { views: -1 };
    else sortStage = { createdAt: -1 };
    pipeline = [
      { $match: matchFilter },
      { $sort: sortStage },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      ...authorLookup,
    ];
  }

  const blogs = await blogsCollection.aggregate(pipeline).toArray();
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

export const getSavedIdsService = async (db, userId) => {
  const favourites = db.collection("favouriteBlogs");
  const docs = await favourites
    .find({ userId: new ObjectId(userId) }, { projection: { blogId: 1 } })
    .toArray();
  return docs.map((d) => d.blogId.toString());
};

export const getLikedIdsService = async (db, userId) => {
  const blogs = db.collection("blogs");
  const uid = new ObjectId(userId);
  const docs = await blogs
    .find({ likes: uid }, { projection: { _id: 1 } })
    .toArray();
  return docs.map((d) => d._id.toString());
};

export const toggleFavouriteService = async (db, blogId, userId) => {
  const favourites = db.collection("favouriteBlogs");
  const bid = new ObjectId(blogId);
  const uid = new ObjectId(userId);

  const existing = await favourites.findOne({ userId: uid, blogId: bid });

  if (existing) {
    await favourites.deleteOne({ _id: existing._id });
    return { saved: false };
  } else {
    await favourites.insertOne({
      userId: uid,
      blogId: bid,
      savedAt: new Date(),
    });
    return { saved: true };
  }
};

export const updateBlogService = async (db, blogId, userId, body, file) => {
  const blogs = db.collection("blogs");
  const id = new ObjectId(blogId);
  const uid = userId instanceof ObjectId ? userId : new ObjectId(String(userId));

  const existing = await blogs.findOne({ _id: id });
  if (!existing) throw new Error("Blog not found");
  if (existing.author.toString() !== uid.toString()) throw new Error("Forbidden");

  let parsedTags = existing.tags;
  if (body.tags !== undefined) {
    try {
      parsedTags = Array.isArray(body.tags) ? body.tags : JSON.parse(body.tags || "[]");
    } catch { parsedTags = []; }
  }

  const content = body.content ?? existing.content;
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  let slug = existing.slug;
  if (body.title && body.title !== existing.title) {
    const baseSlug = body.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    slug = baseSlug;
    let counter = 1;
    while (await blogs.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const setFields = {
    title: body.title ?? existing.title,
    slug,
    description: body.description ?? existing.description,
    content,
    tags: parsedTags,
    category: body.category ?? existing.category,
    difficulty: body.difficulty ?? existing.difficulty,
    status: body.status ?? existing.status,
    readTime: Math.max(1, Math.ceil(words / 200)),
    wordCount: words,
    updatedAt: new Date(),
  };
  if (file?.path) setFields.coverImage = file.path;

  await blogs.updateOne({ _id: id }, { $set: setFields });
  return { ...existing, ...setFields, _id: id };
};

export const getUserAllBlogsService = async (db, userId) => {
  const blogsCollection = db.collection("blogs");
  const uid = userId instanceof ObjectId ? userId : new ObjectId(String(userId));
  return blogsCollection.find({ author: uid }).sort({ createdAt: -1 }).toArray();
};

export const deleteBlogService = async (db, blogId, userId) => {
  const blogs = db.collection("blogs");
  const id = new ObjectId(blogId);
  const uid = userId instanceof ObjectId ? userId : new ObjectId(String(userId));

  const existing = await blogs.findOne({ _id: id });
  if (!existing) throw new Error("Blog not found");
  if (existing.author.toString() !== uid.toString()) throw new Error("Forbidden");

  await blogs.deleteOne({ _id: id });
  return { deleted: true };
};

export const getFavouritesService = async (db, userId) => {
  const favourites = db.collection("favouriteBlogs");
  const uid = new ObjectId(userId);

  const saved = await favourites
    .aggregate([
      { $match: { userId: uid } },
      { $sort: { savedAt: -1 } },
      {
        $lookup: {
          from: "blogs",
          localField: "blogId",
          foreignField: "_id",
          as: "blog",
        },
      },
      { $unwind: "$blog" },
      { $match: { "blog.status": "published" } },
      {
        $lookup: {
          from: "users",
          localField: "blog.author",
          foreignField: "_id",
          as: "blog.author",
          pipeline: [
            { $project: { _id: 1, firstName: 1, lastName: 1, username: 1 } },
          ],
        },
      },
      { $unwind: "$blog.author" },
      { $replaceRoot: { newRoot: "$blog" } },
    ])
    .toArray();

  return saved;
};
