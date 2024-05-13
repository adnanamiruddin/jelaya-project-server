import express from "express";
import { body } from "express-validator";
import * as commentsController from "../controllers/comments.controller.js";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/",
  [
    body("blogId").notEmpty().withMessage("Blog ID is required"),
    body("text").notEmpty().withMessage("Text is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  commentsController.createComment
);

router.get("/:blogId", commentsController.getCommentsByBlogId);

router.delete(
  "/:commentId",
  tokenMiddleware.auth,
  commentsController.deleteComment
);

router.get(
  "/",
  tokenMiddleware.auth,
  commentsController.getUserComments
);

export default router;
