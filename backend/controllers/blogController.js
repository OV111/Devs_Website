import Busboy from "busboy";
import { ObjectId } from "mongodb";
import { uploadImage } from "../utils/uploadImage.js";
import {
  createBlogService,
  getBlogsService,
  getBlogBySlugService,
  getBlogByIdService,
  getUserBlogsService,
  toggleLikeService,
  toggleFavouriteService,
  getFavouritesService,
  getSavedIdsService,
  getLikedIdsService,
  updateBlogService,
  getUserAllBlogsService,
  deleteBlogService,
} from "../services/blogService.js";

export const createBlog = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let body = {};
  let fileUploadPromise = null;

  busboy.on("field", (name, value) => {
    body[name] = value;
  });

  busboy.on("file", (name, file, info) => {
    const { filename } = info;
    if (!filename) {
      file.resume();
      return;
    }
    fileUploadPromise = uploadImage(file, "blogs");
  });

  busboy.on("finish", async () => {
    try {
      const db = req.app.locals.db;
      const user = req.user;

      let coverImage = null;
      if (fileUploadPromise) {
        coverImage = await fileUploadPromise;
      }

      const blog = await createBlogService(db, body, user, {
        path: coverImage?.url ?? null,
      });

      res.status(201).json({ success: true, data: blog });
    } catch (err) {
      console.error("createBlog error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  busboy.on("error", (err) => {
    res.status(400).json({ success: false, message: err.message || "Invalid request body" });
  });

  req.pipe(busboy);
};

export const getBlogs = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await getBlogsService(db, req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch blogs",
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid blog id" });
    }
    const db = req.app.locals.db;
    const blog = await getBlogByIdService(db, req.params.id);
    res.json({ success: true, data: blog });
  } catch (err) {
    const status = err.message === "Blog not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message || "Blog not found" });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Bad Request, invalid user id" });
    }
    const db = req.app.locals.db;
    const blogs = await getUserBlogsService(db, req.params.userId);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch user's blogs",
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog id" });

    const db = req.app.locals.db;
    const result = await toggleLikeService(db, id, req.user._id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const blog = await getBlogBySlugService(db, req.params.slug);
    res.json({ success: true, data: blog });
  } catch (err) {
    const status = err.message === "Blog not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message || "Blog not found" });
  }
};

export const getSavedIds = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ids = await getSavedIdsService(db, req.user._id);
    res.json({ success: true, ids });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLikedIds = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ids = await getLikedIdsService(db, req.user._id);
    res.json({ success: true, ids });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog id" });

    const db = req.app.locals.db;
    const result = await toggleFavouriteService(db, id, req.user._id);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let body = {};
  let fileUploadPromise = null;

  busboy.on("field", (name, value) => { body[name] = value; });
  busboy.on("file", (name, file, info) => {
    const { filename } = info;
    if (!filename) { file.resume(); return; }
    fileUploadPromise = uploadImage(file, "blogs");
  });

  busboy.on("finish", async () => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id))
        return res.status(400).json({ success: false, message: "Invalid blog id" });

      const db = req.app.locals.db;
      let coverImage = null;
      if (fileUploadPromise) coverImage = await fileUploadPromise;

      const blog = await updateBlogService(db, id, req.user._id, body, {
        path: coverImage?.url ?? null,
      });
      res.json({ success: true, data: blog });
    } catch (err) {
      const status =
        err.message === "Forbidden" ? 403 :
        err.message === "Blog not found" ? 404 : 500;
      res.status(status).json({ success: false, message: err.message });
    }
  });

  busboy.on("error", (err) => {
    res.status(400).json({ success: false, message: err.message });
  });

  req.pipe(busboy);
};

export const getMyBlogs = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const blogs = await getUserAllBlogsService(db, req.user._id);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid blog id" });
    const db = req.app.locals.db;
    await deleteBlogService(db, id, req.user._id);
    res.json({ success: true });
  } catch (err) {
    const status =
      err.message === "Forbidden" ? 403 :
      err.message === "Blog not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const data = await getFavouritesService(db, req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
