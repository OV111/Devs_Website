import { CATEGORY_OPTIONS } from "../../constants/Categories.js";
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchUsers = async (db, query) => {
  const users = db.collection("users");
  const regex = new RegExp(escapeRegex(query), "i");

  const foundUsers = await users
    .find(
      {
        $or: [
          { username: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      },
      { projection: { password: 0 } },
    )
    .limit(10)
    .toArray();
  return foundUsers.map((user) => ({
    id: user._id,
    type: "user",
    title:
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
    username: user.username,
  }));
};

export const searchCategories = (query) => {
  const regex = new RegExp(escapeRegex(query), "i");

  return CATEGORY_OPTIONS.filter(
    (category) => regex.test(category.title) || regex.test(category.slug),
  ).map((category) => ({
    id: category.id,
    type: "category",
    title: category.title,
    slug: category.slug,
  }));
};
