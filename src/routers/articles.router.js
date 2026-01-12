import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createArticleComment,
  getcomments,
  likeProduct,
  unlikeProduct,
} from "../controllers/articles.controller.js";

const articlesRouter = express.Router();

articlesRouter.post("/", authenticate(), withAsync(createArticle));
articlesRouter.get("/", withAsync(getArticleList));
articlesRouter.get("/:id", withAsync(getArticle));
articlesRouter.patch("/:id", authenticate(), withAsync(updateArticle));
articlesRouter.delete("/:id", authenticate(), withAsync(deleteArticle));
articlesRouter.post(
  "/:id/comments",
  authenticate(),
  withAsync(createArticleComment)
);
articlesRouter.get("/:id/comments", withAsync(getcomments));
articlesRouter.post("/:id/like", authenticate(), withAsync(likeProduct));
articlesRouter.delete("/:id/like", authenticate(), withAsync(unlikeProduct));

export default articlesRouter;
