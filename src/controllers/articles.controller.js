import { prisma } from "../lib/prismaClient.js";
import { NotFoundError, ForbiddenError } from "../lib/errors.js";
import { IdParams } from "../validation/commons.js";
import {
  CreateArticleBody,
  UpdateArticleBody,
  GetArticleList,
} from "../validation/articles.js";
import { CreateComment } from "../validation/comments.js";

export async function createArticle(req, res) {
  const userId = req.user.userId;
  const data = CreateArticleBody.parse(req.body);

  const article = await prisma.article.create({
    data: { ...data, userId },
  });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = IdParams.parse(req.params);
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError("article", id);
  }

  return res.send(article);
}

export async function updateArticle(req, res) {
  const { id } = IdParams.parse(req.params);
  const data = UpdateArticleBody.parse(req.body);

  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existingArticle) throw new NotFoundError("article", id);

  if (existingArticle.userId !== userId) {
    throw new ForbiddenError("작성자만 수정할 수 있습니다.");
  }

  const updatedAriticle = await prisma.article.update({ where: { id }, data });

  return res.send(updatedAriticle);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });
  if (!existingArticle) {
    throw new NotFoundError("article", id);
  }

  if (existingArticle.userId !== userId) {
    throw new ForbiddenError("작성자만 삭제할 수 있습니다.");
  }

  await prisma.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(
    req.query,
    GetArticleList
  );

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prisma.article.count({ where });
  const articles = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { createdAt: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}
// 댓글관련
export async function createArticleComment(req, res) {
  const userId = req.user.userId;
  const { id: articleId } = IdParams.parse(req.params);
  const { content } = CreateComment.parse(req.body);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  });
  if (!article) throw new NotFoundError("article", articleId);

  const comment = await prisma.comment.create({
    data: { content, userId, articleId },
  });

  return res.status(201).json(comment);
}
