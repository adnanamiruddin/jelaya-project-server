import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  BlogsTable,
  CommentBlogTable,
  UsersTable,
} from "../config/firebase-config.js";
import responseHandler from "../handlers/response.handler.js";
import CommentBlog from "../models/CommentBlog.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

export const createComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { blogId, text } = req.body;

    const comment = new CommentBlog(blogId, id, text);
    await addDoc(CommentBlogTable, comment.toObject());

    responseHandler.created(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;

    const commentsSnap = await getDocs(
      query(CommentBlogTable, where("blogId", "==", blogId))
    );

    const comments = [];
    for (const commentDoc of commentsSnap.docs) {
      const comment = CommentBlog.toFormattedObject(commentDoc);

      const userSnap = await getDoc(doc(UsersTable, comment.userId));
      comment.user = User.getProfile(userSnap);

      comments.push(comment);
    }

    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    responseHandler.ok(res, comments);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.user;
    const { commentId } = req.params;

    const commentSnap = await getDoc(doc(CommentBlogTable, commentId));
    const comment = CommentBlog.toFormattedObject(commentSnap);

    if (comment.userId !== id) {
      responseHandler.forbidden(res);
      return;
    }

    await deleteDoc(doc(CommentBlogTable, commentId));

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const getUserComments = async (req, res) => {
  try {
    const { id } = req.user;

    const comments = [];
    const commentsSnap = await getDocs(
      query(CommentBlogTable, where("userId", "==", id))
    );
    for (const commentDoc of commentsSnap.docs) {
      const comment = CommentBlog.toFormattedObject(commentDoc);

      const blogSnap = await getDoc(doc(BlogsTable, comment.blogId));
      comment.blog = Blog.toFormattedObject(blogSnap);

      comments.push(comment);
    }

    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    responseHandler.ok(res, comments);
  } catch (error) {
    responseHandler.error(res);
  }
};
