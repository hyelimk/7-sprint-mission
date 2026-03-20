import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import s3Client from '../lib/s3client';
import { NODE_ENV, PUBLIC_PATH, AWS_S3_BUCKET_NAME } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const isProduction = NODE_ENV === 'production';

const storage = isProduction
    ? multerS3({
        s3: s3Client!,
        bucket: AWS_S3_BUCKET_NAME!,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, `uploads/${uuidv4()}${ext}`);
        },
    })
    : multer.diskStorage({
        destination(req, file, cb) {
            cb(null, PUBLIC_PATH);
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        },
    });

export const uploadMiddleware = multer({
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter(req, file, cb) {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new BadRequestError('Only png, jpeg, and jpg are allowed'));
        }
        cb(null, true);
    },
});