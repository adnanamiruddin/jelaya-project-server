import express from "express";
import usersRoute from "./users.route.js";
import blogsRoute from "./blogs.route.js";
import commentsRoute from "./comments.route.js";

const router = express.Router();

router.use("/users", usersRoute);
router.use("/blogs", blogsRoute);
router.use("/comments", commentsRoute);

export default router;
