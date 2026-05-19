import {
  getCommentsService,
  postCommentService,
  deleteCommentService,
} from "../services/commentService.js";

export const getComments = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const comments = await getCommentsService(db, req.params.id);
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }
    const db = req.app.locals.db;
    const comment = await postCommentService(db, req.params.id, req.user._id, text);
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentsCount = await deleteCommentService(db, req.params.id, req.params.commentId, req.user._id);
    res.json({ success: true, commentsCount });
  } catch (err) {
    const status = err.message === "Forbidden" ? 403 : err.message === "Comment not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
