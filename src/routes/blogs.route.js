import express from "express";
import { body } from "express-validator";
import * as blogsController from "../controllers/blogs.controller.js";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("blogImageUrl").notEmpty().withMessage("Blog image is required"),
    body("blogContentsId")
      .notEmpty()
      .withMessage("Blog contents ID is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("province").notEmpty().withMessage("Province is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  blogsController.createBlog
);

router.get("/user-blogs", tokenMiddleware.auth, blogsController.getUserBlogs);

router.get("/", blogsController.getAllBlogs);

router.get("/:blogId", blogsController.getBlogById);

router.put(
  "/:blogId",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("blogImageUrl").notEmpty().withMessage("Blog image is required"),
    body("blogContentsId")
      .notEmpty()
      .withMessage("Blog contents ID is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("province").notEmpty().withMessage("Province is required"),
  ],
  tokenMiddleware.auth,
  requsetHandler.validate,
  blogsController.editBlog
);

router.delete("/:blogId", tokenMiddleware.auth, blogsController.deleteBlog);

router.post(
  "/blog-content/:blogId",
  [
    body("blogContent").notEmpty().withMessage("Blog content is required"),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["text", "image"])
      .withMessage("Type must be text or image"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  blogsController.addBlogContent
);

router.put(
  "/blog-content/:blogContentId",
  [
    body("blogContent").notEmpty().withMessage("Blog content is required"),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["text", "image"])
      .withMessage("Type must be text or image"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  blogsController.editBlogContent
);

router.delete(
  "/blog-content/:blogId",
  [
    body("blogContentId").notEmpty().withMessage("Blog content ID is required"),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["text", "image"])
      .withMessage("Type must be text or image"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  blogsController.deleteBlogContent
);

export default router;
