import { Prisma, Like } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { PagePaginationParams } from '../types/pagination';

export async function createArticle(data: Prisma.ArticleUncheckedCreateInput) {
  const createdArticle = await prismaClient.article.create({
    data,
  });
  return createdArticle;
}

export async function getArticle(id: number) {
  const article = await prismaClient.article.findUnique({ where: { id } });
  return article;
}

export async function getArticleWithLikes(id: number, { userId }: { userId?: number } = {}) {
  const article = await prismaClient.article.findUnique({
    where: { id },
    include: {
      likes: true,
    },
  });

  if (!article) {
    return null;
  }

  return {
    ...article,
    likes: undefined,
    likeCount: article.likes.length,
    isLiked: userId ? article.likes.some((like: Like) => like.userId === userId) : undefined,
  };
}

export async function getArticleListWithLikes(
  { page, pageSize, orderBy, keyword }: PagePaginationParams,
  {
    userId,
  }: {
    userId?: number;
  } = {},
) {
  const where: Prisma.ArticleWhereInput = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: {
      likes: true,
    },
  });

  const mappedArticles = articles.map(
    (article: Prisma.ArticleGetPayload<{ include: { likes: true } }>) => ({
      ...article,
      likes: undefined,
      likeCount: article.likes.length,
      isLiked: userId ? article.likes.some((like: Like) => like.userId === userId) : undefined,
    }),
  );

  return {
    list: mappedArticles,
    totalCount,
  };
}

export async function updateArticleWithLikes(
  id: number,
  data: Prisma.ArticleUncheckedUpdateInput,
) {
  const updatedArticle = await prismaClient.article.update({
    where: { id },
    data,
    include: {
      likes: true,
    },
  });

  return {
    ...updatedArticle,
    likes: undefined,
    likeCount: updatedArticle.likes.length,
    isLiked:
      typeof data.userId === 'number'
        ? updatedArticle.likes.some((like: Like) => like.userId === data.userId)
        : undefined,
  };
}

export async function deleteArticle(id: number) {
  return prismaClient.article.delete({
    where: { id },
  });
}