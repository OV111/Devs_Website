export const getDefaultPostsByCategoryService = async (db, categoryName) => {
  return db.collection("posts-default")
    .find({ category: categoryName })
    .toArray();
};

export const getPostsByCategoryService = async (db, categoryName) => {
  return db.collection("posts")
    .find({ category: categoryName })
    .toArray();
};

export const createPostService = async (db, { title, text, category, file }) => {
  const blogs = db.collection("blogs");
  await blogs.insertOne({ title, text, category, file });
};
