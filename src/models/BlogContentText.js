import { formatDate } from "../helpers/helper.js";

class BlogContentText {
  constructor(userId, blogId, text) {
    this.userId = userId;
    this.blogId = blogId;
    this.text = text;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toObject() {
    return {
      userId: this.userId,
      blogId: this.blogId,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const blogContentText = new BlogContentText(
      data.userId,
      data.blogId,
      data.text
    );
    blogContentText.id = doc.id;
    blogContentText.createdAt = formatDate(data.createdAt);
    blogContentText.updatedAt = formatDate(data.updatedAt);
    return blogContentText;
  }
}

export default BlogContentText;
