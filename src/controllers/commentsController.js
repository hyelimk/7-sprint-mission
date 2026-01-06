import { create } from "superstruct";
import { prismaClient } from "../lib/prismaClient.js";
import { UpdateCommentBodyStruct } from "../validate/commentsStruct.js";
import NotFoundError from "../lib/error/notfound.error.js";
import { IdParamsStruct } from "../validate/commonStructs.js";

export async function updateComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  return res.send(updatedComment);
}

export async function deleteComment(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prismaClient.comment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new NotFoundError("comment", id);
  }

  await prismaClient.comment.delete({ where: { id } });

  return res.status(204).send();
}
////변경

export async function createComment(req, res) {
  const userId = req.user.userId;
  const { id: productId } = IdParams.parse(req.params);
  const { content } = CreateCommentBody.parse(req.body);

  const existingProduct = await prismaClient.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!existingProduct) throw new NotFoundError("product", productId);

  const comment = await prismaClient.comment.create({
    data: { productId, content, userId },
  });

  return res.status(201).send(comment);
}
export async function getCommentList(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const list = await prismaClient.comment.findMany({
      where: { productId },
      orderBy: { id: "desc" },
      take: 20,
    });

    return res.send({ list });
  } catch (e) {
    next(e);
  }
}
