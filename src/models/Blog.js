import { formatDate } from "../helpers/helper.js";

class Blog {
  constructor(
    userId,
    title,
    blogImageUrl,
    blogContentsId,
    category,
    city,
    province
  ) {
    this.userId = userId;
    this.title = title;
    this.blogImageUrl = blogImageUrl;
    this.blogContentsId = blogContentsId;
    this.category = category;
    this.city = city;
    this.province = province;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toObject() {
    return {
      userId: this.userId,
      title: this.title,
      blogImageUrl: this.blogImageUrl,
      blogContentsId: this.blogContentsId,
      category: this.category,
      city: this.city,
      province: this.province,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const blog = new Blog(
      data.userId,
      data.title,
      data.blogImageUrl,
      data.blogContentsId,
      data.category,
      data.city,
      data.province
    );
    blog.id = doc.id;
    blog.createdAt = formatDate(data.createdAt);
    blog.updatedAt = formatDate(data.updatedAt);
    return blog;
  }
}

export default Blog;
