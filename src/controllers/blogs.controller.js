import {
  BlogContentImageTable,
  BlogContentTextTable,
  BlogsTable,
  CommentBlogTable,
  UsersTable,
} from "../config/firebase-config.js";
import Blog from "../models/Blog.js";
import responseHandler from "../handlers/response.handler.js";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import BlogContentText from "../models/BlogContentText.js";
import BlogContentImage from "../models/BlogContentImage.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  try {
    const {
      userId,
      title,
      blogImageUrl,
      blogContentsId,
      category,
      city,
      province,
    } = req.body;

    const blog = new Blog(
      userId,
      title,
      blogImageUrl,
      blogContentsId,
      category,
      city,
      province
    );
    const blogSnap = await addDoc(BlogsTable, blog.toObject());

    responseHandler.created(res, {
      id: blogSnap.id,
      ...blog,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const { id } = req.user;

    const blogs = [];
    const blogsSnap = await getDocs(
      query(BlogsTable, where("userId", "==", id))
    );
    blogsSnap.forEach((blogDoc) => {
      const blog = Blog.toFormattedObject(blogDoc);
      blogs.push(blog);
    });

    responseHandler.ok(res, blogs);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = [];
    const blogsSnap = await getDocs(BlogsTable);

    for (const blogDoc of blogsSnap.docs) {
      const blog = Blog.toFormattedObject(blogDoc);

      const userSnap = await getDoc(doc(UsersTable, blog.userId));
      blog.user = User.getProfile(userSnap);

      blogs.push(blog);
    }

    responseHandler.ok(res, blogs);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blogSnap = await getDoc(doc(BlogsTable, blogId));
    if (!blogSnap.exists()) {
      responseHandler.notFound(res);
      return;
    }

    const blog = Blog.toFormattedObject(blogSnap);

    const blogContents = [];
    for (const blogContentId of blog.blogContentsId) {
      const blogContentSnap = await getDoc(
        doc(BlogContentTextTable, blogContentId)
      );
      if (blogContentSnap.exists()) {
        const blogContent = BlogContentText.toFormattedObject(blogContentSnap);
        blogContent.type = "text";
        blogContents.push(blogContent);
      } else {
        const blogContentSnap = await getDoc(
          doc(BlogContentImageTable, blogContentId)
        );
        const blogContent = BlogContentImage.toFormattedObject(blogContentSnap);
        blogContent.type = "image";
        blogContents.push(blogContent);
      }
    }

    blogContents.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    blog.blogContents = blogContents;

    responseHandler.ok(res, blog);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const editBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const dataReq = req.body;

    const blogRef = doc(BlogsTable, blogId);
    const blogSnap = await getDoc(blogRef);
    if (!blogSnap.exists()) return responseHandler.notFound(res);

    await updateDoc(blogRef, dataReq);

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blogRef = doc(BlogsTable, blogId);
    const blogSnap = await getDoc(blogRef);
    if (!blogSnap.exists()) return responseHandler.notFound(res);

    const blogContentTextSnap = await getDocs(
      query(BlogContentTextTable, where("blogId", "==", blogId))
    );
    blogContentTextSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    const blogContentImageSnap = await getDocs(
      query(BlogContentImageTable, where("blogId", "==", blogId))
    );
    blogContentImageSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    const commentsSnap = await getDocs(
      query(CommentBlogTable, where("blogId", "==", blogId))
    );
    commentsSnap.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await deleteDoc(blogRef);

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const addBlogContent = async (req, res) => {
  try {
    const { id } = req.user;
    const { blogId } = req.params;
    const { blogContent, type } = req.body;

    const blogSnap = await getDoc(doc(BlogsTable, blogId));
    const blog = Blog.toFormattedObject(blogSnap);

    if (type === "text") {
      const newBlogContentText = new BlogContentText(id, blogId, blogContent);
      const blogContentTextSnap = await addDoc(
        BlogContentTextTable,
        newBlogContentText.toObject()
      );

      blog.blogContentsId.push(blogContentTextSnap.id);

      await updateDoc(doc(BlogsTable, blogId), {
        blogContentsId: blog.blogContentsId,
      });
    } else if (type === "image") {
      const newBlogContentImage = new BlogContentImage(id, blogId, blogContent);
      const blogContentImageSnap = await addDoc(
        BlogContentImageTable,
        newBlogContentImage.toObject()
      );

      blog.blogContentsId.push(blogContentImageSnap.id);

      await updateDoc(doc(BlogsTable, blogId), {
        blogContentsId: blog.blogContentsId,
      });
    } else {
      return responseHandler.badRequest(res, "Type must be text or image");
    }
    responseHandler.created(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const editBlogContent = async (req, res) => {
  try {
    const { blogContentId } = req.params;
    const { blogContent, type } = req.body;

    if (type === "text") {
      await updateDoc(doc(BlogContentTextTable, blogContentId), {
        text: blogContent,
      });
    }
    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

export const deleteBlogContent = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { blogContentId, type } = req.body;

    const blogDoc = doc(BlogsTable, blogId);
    const blogSnap = await getDoc(blogDoc);
    const blog = Blog.toFormattedObject(blogSnap);

    if (type === "text") {
      blog.blogContentsId = blog.blogContentsId.filter(
        (id) => id !== blogContentId
      );
      await updateDoc(blogDoc, {
        blogContentsId: blog.blogContentsId,
      });

      await deleteDoc(doc(BlogContentTextTable, blogContentId));
    } else if (type === "image") {
      blog.blogContentsId = blog.blogContentsId.filter(
        (id) => id !== blogContentId
      );
      await updateDoc(blogDoc, {
        blogContentsId: blog.blogContentsId,
      });

      await deleteDoc(doc(BlogContentImageTable, blogContentId));
    } else {
      return responseHandler.badRequest(res, "Type must be text or image");
    }

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};
