import { formatDate } from "../helpers/helper.js";

class BlogContentImage {
  constructor(userId, blogId, imageUrl) {
    this.userId = userId;
    this.blogId = blogId;
    this.imageUrl = imageUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toObject() {
    return {
      userId: this.userId,
      blogId: this.blogId,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const blogContentImage = new BlogContentImage(
      data.userId,
      data.blogId,
      data.imageUrl
    );
    blogContentImage.id = doc.id;
    blogContentImage.createdAt = formatDate(data.createdAt);
    blogContentImage.updatedAt = formatDate(data.updatedAt);
    return blogContentImage;
  }
}

export default BlogContentImage;
