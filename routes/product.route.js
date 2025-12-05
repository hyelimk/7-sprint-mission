import { Product, UnregisteredProduct } from "./product.js";
import { Router } from "express";
import { prisma } from "../prisma/prisma.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import productCommentRouter from "./product-comment.route.js";
import productImageRouter from "./product-image.route.js";

export const productRouter = Router();

productRouter.use("/:productId/image", productImageRouter);
productRouter.use("/:productId/comments", productCommentRouter);

productRouter.post("/", validatePostProduct, (req, res, next) => {
  const unregistered = UnregisteredProduct.fromInfo(req.body);

  prisma.product
    .create({ data: unregistered })
    .then((newEntity) => {
      res.status(201).json(Product.fromEntity(newEntity));
    })
    .catch(next);
});

productRouter.get("/:id", validateGetProduct, (req, res, next) => {
  const id = Number(req.params.id);

  prisma.product
    .findUnique({ where: { id } })
    .then((entity) => {
      if (!entity) throw new NotFoundError("상품을 찾을 수 없습니다.");
      res.json(Product.fromEntity(entity));
    })
    .catch(next);
});

productRouter.patch("/:id", validatePatchProduct, (req, res, next) => {
  const id = Number(req.params.id);
  const { name, description, price, tags } = req.body;

  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (tags !== undefined) data.tags = tags;

  prisma.product
    .update({ where: { id }, data })
    .then((updated) => {
      res.json(Product.fromEntity(updated));
    })
    .catch(next);
});

productRouter.delete("/:id", validateDeleteProduct, (req, res, next) => {
  const id = Number(req.params.id);

  prisma.product
    .delete({ where: { id } })
    .then(() => res.status(204).send())
    .catch(next);
});

productRouter.get("/", validateGetProducts, (req, res, next) => {
  const { keyword, page = "1", limit = "10" } = req.query;
  const options = getFindProductsOption({ keyword, page, limit });

  const findProducts = prisma.product.findMany(options);
  const countProducts = prisma.product.count({ where: options.where });

  Promise.all([findProducts, countProducts])
    .then(([items, totalCount]) => {
      res.json({
        items: items.map((entity) => Product.fromEntity(entity)),
        page: Number(page),
        limit: Number(limit),
        totalCount,
      });
    })
    .catch(next);
});

function getFindProductsOption({ keyword, page = "1", limit = "10" }) {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  if (Number.isNaN(pageNum) || Number.isNaN(limitNum)) {
    throw new BadRequestError("유효하지 않은 페이지 값입니다.");
  }

  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  const option = {
    skip,
    take,
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  };

  if (keyword) {
    option.where = {
      OR: [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ],
    };
  }

  return option;
}

// POST
function validatePostProduct(req, res, next) {
  const { name, description, price, tags } = req.body;
  if (!name || !description || price === undefined) {
    return next(
      new BadRequestError("name, description, price는 필수 값입니다.")
    );
  }
  if (typeof price !== "number") {
    return next(new BadRequestError("price는 숫자여야 합니다."));
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new BadRequestError("tags는 배열이어야 합니다."));
  }
  next();
}

// GET /:id
function validateGetProduct(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return next(new BadRequestError("유효하지 않은 ID입니다."));
  next();
}

// DELETE /:id
function validateDeleteProduct(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return next(new BadRequestError("유효하지 않은 ID입니다."));
  next();
}

// GET 리스트
function validateGetProducts(req, res, next) {
  const { page = "1", limit = "10" } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  if (Number.isNaN(pageNum) || Number.isNaN(limitNum)) {
    return next(new BadRequestError("page와 limit는 숫자여야 합니다."));
  }
  if (pageNum <= 0 || limitNum <= 0) {
    return next(
      new BadRequestError("page와 limit는 1 이상의 값이어야 합니다.")
    );
  }
  next();
}

// PATCH /:id
function validatePatchProduct(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id))
    return next(new BadRequestError("유효하지 않은 ID입니다."));

  const { name, description, price, tags } = req.body;
  if (
    name === undefined &&
    description === undefined &&
    price === undefined &&
    tags === undefined
  ) {
    return next(
      new BadRequestError("수정할 필드를 최소 1개 이상 보내야 합니다.")
    );
  }
  if (price !== undefined && typeof price !== "number") {
    return next(new BadRequestError("price는 숫자여야 합니다."));
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new BadRequestError("tags는 배열이어야 합니다."));
  }
  next();
}

export default productRouter;
