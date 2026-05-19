import { ObjectId } from "mongodb";

const authorLookup = [
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author",
      pipeline: [
        { $project: { _id: 1, firstName: 1, lastName: 1, username: 1 } },
      ],
    },
  },
  { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "usersStats",
      localField: "author._id",
      foreignField: "userId",
      as: "authorStats",
      pipeline: [{ $project: { profileImage: 1 } }],
    },
  },
  { $unwind: { path: "$authorStats", preserveNullAndEmptyArrays: true } },
  {
    $addFields: { "author.pictures": "$authorStats.profileImage" },
  },
  { $project: { authorStats: 0 } },
];

export const getCommentsService = async (db, blogId) => {
  const comments = db.collection("comments");
  return comments
    .aggregate([
      { $match: { blogId: new ObjectId(blogId) } },
      { $sort: { createdAt: -1 } },
      ...authorLookup,
    ])
    .toArray();
};

export const postCommentService = async (db, blogId, userId, text) => {
  const comments = db.collection("comments");
  const users = db.collection("users");
  const stats = db.collection("usersStats");

  const doc = {
    blogId: new ObjectId(blogId),
    author: new ObjectId(userId),
    text: text.trim(),
    createdAt: new Date(),
  };

  const blogs = db.collection("blogs");
  const { insertedId } = await comments.insertOne(doc);

  const [user, userStats, blog] = await Promise.all([
    users.findOne({ _id: doc.author }, { projection: { firstName: 1, lastName: 1 } }),
    stats.findOne({ userId: doc.author }, { projection: { profileImage: 1 } }),
    blogs.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $push: { comments: insertedId } },
      { returnDocument: "after", projection: { comments: 1 } },
    ),
  ]);

  return {
    ...doc,
    _id: insertedId,
    commentsCount: blog?.comments?.length ?? 0,
    author: {
      _id: doc.author,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      pictures: userStats?.profileImage ?? null,
    },
  };
};

export const deleteCommentService = async (db, blogId, commentId, userId) => {
  const comments = db.collection("comments");
  const id = new ObjectId(commentId);
  const uid = new ObjectId(userId);

  const comment = await comments.findOne({ _id: id, blogId: new ObjectId(blogId) });
  if (!comment) throw new Error("Comment not found");
  if (comment.author.toString() !== uid.toString()) throw new Error("Forbidden");

  const blogs = db.collection("blogs");
  const [, updatedBlog] = await Promise.all([
    comments.deleteOne({ _id: id }),
    blogs.findOneAndUpdate(
      { _id: new ObjectId(blogId) },
      { $pull: { comments: id } },
      { returnDocument: "after", projection: { comments: 1 } },
    ),
  ]);
  return updatedBlog?.comments?.length ?? 0;
};
