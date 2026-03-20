import { Request, Response } from 'express';
import { getImageUrl } from '../services/image-servise';
import BadRequestError from '../lib/errors/BadRequestError';

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError('File is required');

  const url = getImageUrl(req.file);

  res.status(201).json({ url });
}