import { formatDate } from "../helpers/helper.js";

class CommentBlog {
  constructor(blogId, userId, text) {
    this.blogId = blogId;
    this.userId = userId;
    this.text = text;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toObject() {
    return {
      blogId: this.blogId,
      userId: this.userId,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const commentBlog = new CommentBlog(data.blogId, data.userId, data.text);
    commentBlog.id = doc.id;
    commentBlog.createdAt = formatDate(data.createdAt);
    commentBlog.updatedAt = formatDate(data.updatedAt);
    return commentBlog;
  }
}

export default CommentBlog;
