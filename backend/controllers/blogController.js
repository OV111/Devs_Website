import Busboy from "busboy";
import { uploadImage } from "../utils/uploadImage.js";
import {
  createBlogService,
  getBlogsService,
  getBlogBySlugService,
  getBlogByIdService,
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
    const db = req.app.locals.db;
    const blog = await getBlogByIdService(db, req.params.id);
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message || "Blog not found",
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const blog = await getBlogBySlugService(db, req.params.slug);
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message || "Blog not found",
    });
  }
};
