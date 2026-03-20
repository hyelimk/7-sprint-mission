import express from 'express';
import { withAsync } from '../lib/withAsync';
import { uploadMiddleware } from '../middlewares/upload'; // ← 미들웨어에서 import
import { uploadImage } from '../controllers/imagesController';

const imagesRouter = express.Router();

imagesRouter.post('/upload', uploadMiddleware.single('image'), withAsync(uploadImage));

export default imagesRouter;