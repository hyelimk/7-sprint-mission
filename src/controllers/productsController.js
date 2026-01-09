import { prisma } from "../lib/prismaClient.js";
import { NotFoundError } from "../lib/errors.js";
import { IdParams, CursorParams } from "../validation/commons.js";
import {
  CreateProductBody,
  GetProductList,
  UpdateProductBody,
} from "../validation/products.js";
import { CreateComment } from "../validation/comments.js";

export async function createProduct(req, res) {
  const userId = req.user.userId;
  const { name, description, price, tags, images } = CreateProductBody.parse(
    req.body
  );

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      images,
      userId,
    },
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = IdParams.parse(req.params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError("product", id);
  }
  return res.send(product);
}

export async function updateProduct(req, res) {
  const { id } = IdParams.parse(req.params);
  const data = UpdateProductBody.parse(req.body);

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }

  if (existingProduct.userId !== userId) {
    return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  });

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = IdParams.parse(req.params);
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  if (!existingProduct) {
    throw new NotFoundError("product", id);
  }
  if (existingProduct.userId !== userId) {
    return res.status(403).json({ message: "작성자만 삭제할 수 있습니다." });
  }

  await prisma.product.delete({ where: { id } });
  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = GetProductList.parse(req.query);

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : undefined;
  const totalCount = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === "recent" ? { id: "desc" } : { id: "asc" },
    where,
  });

  return res.send({
    list: products,
    totalCount,
  });
}
//product comment 관련
export async function createProductComment(req, res) {
  const userId = req.user.userId;
  const { id: productId } = IdParams.parse(req.params);
  const { content } = CreateComment.parse(req.body);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new NotFoundError("product", productId);

  const comment = await prisma.comment.create({
    data: { content, userId, productId },
  });

  return res.status(201).json(comment);
}

// export async function getCommentList(req, res) {
//   const { id: productId } = create(req.params, IdParamsStruct);
//   const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

//   const existingProduct = await prismaClient.product.findUnique({
//     where: { id: productId },
//   });
//   if (!existingProduct) {
//     throw new NotFoundError("product", productId);
//   }

//   const commentsWithCursorComment = await prismaClient.comment.findMany({
//     cursor: cursor ? { id: cursor } : undefined,
//     take: limit + 1,
//     where: { productId },
//   });
//   const comments = commentsWithCursorComment.slice(0, limit);
//   const cursorComment = commentsWithCursorComment[comments.length - 1];
//   const nextCursor = cursorComment ? cursorComment.id : null;

//   return res.send({
//     list: comments,
//     nextCursor,
//   });
// }
