import { NODE_ENV, BASE_URL } from '../lib/constants';

const isProduction = NODE_ENV === 'production';

// URL 추출 로직만 담당
export function getImageUrl(file: Express.Multer.File): string {
    if (isProduction) {
        return (file as Express.MulterS3.File).location;
    }
    return `${BASE_URL}/public/${file.filename}`;
}