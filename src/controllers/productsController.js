import { prisma } from "../lib/prismaClient.js";
import { NotFoundError } from "../lib/errors.js";
import { IdParams } from "../validate/commons.js";
import {
  CreateProductBody,
  GetProductListParams,
  UpdateProductBody,
} from "../validate/products.js";

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

  await prisma.product.delete({ where: { id } });
  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = GetProductListParams.parse(
    req.query
  );

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
