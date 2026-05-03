import Busboy from "busboy";
import fs from "fs";
import path from "path";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import {
  createBlogService,
  getBlogsService,
  getBlogBySlugService,
} from "../services/blogService.js";

export const createBlog = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let body = {};
  let filePath = null;

  busboy.on("field", (name, value) => {
    body[name] = value;
  });

  busboy.on("file", (name, file, info) => {
    const { filename } = info;

    const safeName = `${Date.now()}-${filename.replace(/\s+/g, "-")}`;
    const saveTo = path.join("uploads", safeName);

    const stream = fs.createWriteStream(saveTo);
    file.pipe(stream);

    filePath = saveTo;
  });

  busboy.on("finish", async () => {
    try {
      const db = req.app.locals.db;
      const user = req.user || { _id: null };

      let coverImageUrl = null;

      if (filePath && fs.existsSync(filePath)) {
        coverImageUrl = await uploadToCloudinary(filePath);

        fs.unlinkSync(filePath);
      }

      const blog = await createBlogService(db, body, user, {
        path: coverImageUrl,
      });

      res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to create blog",
      });
    }
  });

  req.pipe(busboy);
};

// export const getBlogs = async (req, res) => {
//   try {
//     const db = req.app.locals.db;
//     const { page = 1, limit = 10, category, tag } = req.query;

//     const pageNumber = Math.max(1, parseInt(page));
//     const limitNumber = Math.max(1, Math.min(100, parseInt(limit)));

//     const result = await getBlogsService(db, {
//       page: pageNumber,
//       limit: limitNumber,
//       category,
//       tag,
//     });

//     if (result.pagination) {
//       return res.json({
//         success: true,
//         ...result,
//       });
//     }
//     const total = result.length;

//     res.json({
//       success: true,
//       data: result,
//       pagination: {
//         total,
//         page: pageNumber,
//         limit: limitNumber,
//         totalPages: Math.ceil(total / limitNumber),
//         hasNextPage: pageNumber * limitNumber < total,
//         hasPrevPage: pageNumber > 1,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message || "Failed to fetch blogs",
//     });
//   }
// };

export const getBlogs = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await getBlogsService(db, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch blogs",
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
