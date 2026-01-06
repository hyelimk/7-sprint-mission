import express from "express";
import { withAsync } from "../lib/withAsync.js";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
} from "../controllers/productsController.js";
import { authenticate } from "../ middlewares/authenticate.js";
const productsRouter = express.Router();

productsRouter.post("/", authenticate(), withAsync(createProduct));
productsRouter.get("/:id", withAsync(getProduct));
productsRouter.patch("/:id", authenticate(), withAsync(updateProduct));
productsRouter.delete("/:id", authenticate(), withAsync(deleteProduct));
productsRouter.get("/", withAsync(getProductList));

export default productsRouter;
