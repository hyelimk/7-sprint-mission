import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./lib/constants.js";
import authRouter from "./routers/auth.routers.js";
import articlesRouter from "./routers/articlesRouter.js";
import productsRouter from "./routers/productsRouter.js";
import commentsRouter from "./routers/commentsRouter.js";
import imagesRouter from "./routers/imagesRouter.js";
import errorHandler from "./ middlewares/errorhandler.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
